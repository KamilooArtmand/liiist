import { Pool } from 'pg';

export interface GraphNode {
  id: string;
  label: string;
  type: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship_type: string;
}

export interface SemanticGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * Generates a semantic graph of entities and their relations up to a specified depth.
 * Utilizes PostgreSQL Recursive CTEs for maximum memory/speed efficiency.
 */
export async function getEntityRelationGraph(
  pool: Pool,
  rootEntityId: string,
  maxDepth: number = 3
): Promise<SemanticGraph> {
  const query = `
    WITH RECURSIVE graph_traverse AS (
      -- 1. Base Case: The Root Entity
      SELECT 
        e.id, 
        e.slug AS label, 
        e.type,
        0 AS depth,
        NULL::uuid AS edge_source,
        NULL::uuid AS edge_target,
        NULL::text AS relation_type
      FROM entities e
      WHERE e.id = $1

      UNION ALL

      -- 2. Recursive Step: Finding connected entities via entity_relations
      SELECT 
        next_e.id, 
        next_e.slug AS label, 
        next_e.type,
        gt.depth + 1,
        er.source_id AS edge_source,
        er.target_id AS edge_target,
        er.relation_type
      FROM graph_traverse gt
      -- Join edges where the current node is either source or target
      JOIN entity_relations er ON er.source_id = gt.id OR er.target_id = gt.id
      -- Join the entity at the other end of the edge
      JOIN entities next_e ON (next_e.id = er.target_id AND next_e.id != gt.id) 
                           OR (next_e.id = er.source_id AND next_e.id != gt.id)
      -- 3. Constraint: Limit depth to prevent memory overflow on infinite networks
      WHERE gt.depth < $2
    )
    SELECT * FROM graph_traverse;
  `;

  const { rows } = await pool.query(query, [rootEntityId, maxDepth]);

  const nodesMap = new Map<string, GraphNode>();
  const edgesMap = new Map<string, GraphEdge>();

  for (const row of rows) {
    // Collect unique nodes
    if (!nodesMap.has(row.id)) {
      nodesMap.set(row.id, {
        id: row.id,
        label: row.label,
        type: row.type,
      });
    }

    // Collect unique edges (skip the root base case which has null edge_source)
    if (row.edge_source && row.edge_target && row.relation_type) {
      const edgeKey = `${row.edge_source}-${row.relation_type}-${row.edge_target}`;
      if (!edgesMap.has(edgeKey)) {
        edgesMap.set(edgeKey, {
          source: row.edge_source,
          target: row.edge_target,
          relationship_type: row.relation_type,
        });
      }
    }
  }

  return {
    nodes: Array.from(nodesMap.values()),
    edges: Array.from(edgesMap.values()),
  };
}

/**
 * Generates a hierarchical tree graph from taxonomy_nodes.
 */
export async function getTaxonomyGraph(
  pool: Pool,
  rootNodeId: string,
  maxDepth: number = 5
): Promise<SemanticGraph> {
  const query = `
    WITH RECURSIVE tax_traverse AS (
      SELECT 
        id, 
        name AS label, 
        'taxonomy_node' AS type,
        0 AS depth,
        parent_id
      FROM taxonomy_nodes
      WHERE id = $1

      UNION ALL

      SELECT 
        n.id, 
        n.name AS label, 
        'taxonomy_node' AS type,
        tt.depth + 1,
        n.parent_id
      FROM tax_traverse tt
      JOIN taxonomy_nodes n ON n.parent_id = tt.id
      WHERE tt.depth < $2
    )
    SELECT * FROM tax_traverse;
  `;

  const { rows } = await pool.query(query, [rootNodeId, maxDepth]);

  const nodesMap = new Map<string, GraphNode>();
  const edgesMap = new Map<string, GraphEdge>();

  for (const row of rows) {
    if (!nodesMap.has(row.id)) {
      nodesMap.set(row.id, {
        id: row.id,
        label: row.label,
        type: row.type,
      });
    }

    if (row.parent_id) {
      const edgeKey = `${row.parent_id}-CHILD_OF-${row.id}`;
      if (!edgesMap.has(edgeKey)) {
        edgesMap.set(edgeKey, {
          source: row.parent_id,
          target: row.id,
          relationship_type: 'CHILD_OF',
        });
      }
    }
  }

  return {
    nodes: Array.from(nodesMap.values()),
    edges: Array.from(edgesMap.values()),
  };
}
