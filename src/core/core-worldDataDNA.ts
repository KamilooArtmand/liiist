// WORLD DATA DNA — The Autonomous Knowledge Graph & Universal Ontology Engine
// Single Source of Truth for all interconnected entities, handles, unique cryptographic-style IDs, and graph edges.

export type DNADomain =
  | 'planetary'     // World, Continents, Oceans, Atmospheric layers
  | 'geopolitical'  // Countries, Sovereign States, Territories, Dependencies
  | 'administrative'// States, Provinces, Cantons, Prefectures, Governorates
  | 'municipal'     // Megacities, Cities, Municipalities, Towns, Villages
  | 'enterprise'    // Multinationals, Global Brands, Conglomerates, Foundries
  | 'luminary'      // Visionaries, Scientists, Philosophers, Laureates, Leaders
  | 'monetary'      // Sovereign Currencies, Reserve Assets, Central Financial Systems
  | 'cultural'      // Civilizations, Languages, UNESCO Sites, Movements
  | 'ecosystem';    // Biomes, Ecological Reserves, Mountain Ranges, Watersheds

export type DNAFacet = 'root' | 'node' | 'leaf' | 'quantum';

export interface DNARelationEdge {
  targetId: string;       // Target DNA Node ID
  targetHandle: string;   // e.g. @usa, @california, @apple
  relation:
    | 'contains'          // Parent contains child
    | 'part_of'           // Child is part of parent
    | 'governs'           // State governs city/county
    | 'borders'           // Geographical adjacency
    | 'currency_of'       // Monetary association
    | 'founded_in'        // Entity founded in location
    | 'born_in'           // Person birthplace
    | 'capital_of'        // Capital city of nation/state
    | 'headquartered_in'  // Brand headquarters
    | 'allied_with';      // Diplomatic or economic alliance
  weight?: number;        // Connection strength (0.0 - 1.0)
}

export interface WorldDataDNANode {
  id: string;             // Universal Unique Global Identifier, e.g., 'DNA-GEO-001', 'DNA-USA-050'
  handle: string;         // Universal Canonical Handle starting with @ (e.g. @world, @countries, @usa, @california, @apple)
  canonicalPath: string;  // Hierarchical URL: liii.st/World/Country/United States/California
  title: string;          // Primary Title
  nativeTitle?: string;   // Native script title
  domain: DNADomain;      // Ontological domain
  facet: DNAFacet;        // Graph depth
  parentId?: string;      // Immediate parent DNA Node ID
  childrenCount: number;  // Sub-nodes cataloged
  metrics: {
    primaryValue: string | number; // e.g., '195', '39.0M', '$3.9T'
    primaryLabel: string;          // e.g., 'Sovereign States', 'Inhabitants', 'State GDP'
    secondaryValue?: string | number;
    secondaryLabel?: string;
  };
  edges: DNARelationEdge[]; // Semantic Knowledge Graph Connections
  metadata: {
    establishedYear?: number;
    coordinates?: [number, number]; // [lat, lng]
    isoCode?: string;
    verifiedAt: string;
    version: string;
  };
}

export interface DNAGraphStats {
  totalNodes: number;
  totalEdges: number;
  domainsCount: number;
  lastSync: string;
}

// Global DNA Knowledge Graph Repository
export class WorldDataDNAEngine {
  private static nodes: Map<string, WorldDataDNANode> = new Map();
  private static handles: Map<string, string> = new Map(); // handle -> id

  // Register a node into the DNA graph
  public static registerNode(node: WorldDataDNANode): void {
    this.nodes.set(node.id, node);
    const cleanHandle = node.handle.startsWith('@') ? node.handle.toLowerCase() : `@${node.handle.toLowerCase()}`;
    this.handles.set(cleanHandle, node.id);
  }

  // Retrieve by Unique ID
  public static getNodeById(id: string): WorldDataDNANode | undefined {
    return this.nodes.get(id);
  }

  // Retrieve by Universal Handle (e.g. '@usa', '@world', '@california')
  public static getNodeByHandle(handle: string): WorldDataDNANode | undefined {
    const cleanHandle = handle.startsWith('@') ? handle.toLowerCase() : `@${handle.toLowerCase()}`;
    const id = this.handles.get(cleanHandle);
    return id ? this.nodes.get(id) : undefined;
  }

  // Query nodes by domain
  public static getNodesByDomain(domain: DNADomain): WorldDataDNANode[] {
    return Array.from(this.nodes.values()).filter(n => n.domain === domain);
  }

  // Traverse edges (connected entities in the DNA web)
  public static getConnectedNodes(nodeId: string): { edge: DNARelationEdge; node: WorldDataDNANode | undefined }[] {
    const node = this.nodes.get(nodeId);
    if (!node) return [];
    return node.edges.map(edge => ({
      edge,
      node: this.nodes.get(edge.targetId)
    }));
  }

  // Get entire graph registry statistics
  public static getStats(): DNAGraphStats {
    let edgeCount = 0;
    const domains = new Set<DNADomain>();
    this.nodes.forEach(n => {
      edgeCount += n.edges.length;
      domains.add(n.domain);
    });

    return {
      totalNodes: this.nodes.size,
      totalEdges: edgeCount,
      domainsCount: domains.size,
      lastSync: new Date().toISOString()
    };
  }

  // Return all nodes
  public static getAllNodes(): WorldDataDNANode[] {
    return Array.from(this.nodes.values());
  }
}
