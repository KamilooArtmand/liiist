-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ==========================================
-- 1. TAXONOMY NODES (Graph-based hierarchical categories)
-- ==========================================
CREATE TABLE taxonomy_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES taxonomy_nodes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. ENTITIES (Universal storage for all classified objects)
-- ==========================================
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL, -- e.g., 'movie', 'software', 'city', 'disease'
    base_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    embedding VECTOR(1536), -- Semantic embeddings for similarity search (e.g., OpenAI ada-002)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. ENTITY TAXONOMY MAPPING (Connecting entities to the graph)
-- ==========================================
CREATE TABLE entity_taxonomy (
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    node_id UUID REFERENCES taxonomy_nodes(id) ON DELETE CASCADE,
    PRIMARY KEY (entity_id, node_id)
);

-- ==========================================
-- 4. ENTITY RELATIONS (Non-linear Semantic Graph connections)
-- ==========================================
CREATE TABLE entity_relations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    target_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    relation_type TEXT NOT NULL, -- e.g., 'DIRECTED_BY', 'TREATS', 'DEVELOPED_BY'
    metadata JSONB DEFAULT '{}'::jsonb, -- Edge properties (e.g., { "role": "Lead Actor" })
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_id, target_id, relation_type)
);

-- ==========================================
-- INDEXING FOR EXTREME PERFORMANCE
-- ==========================================

-- HNSW Index for sub-millisecond semantic similarity search (using Cosine distance)
CREATE INDEX entities_embedding_hnsw_idx ON entities USING hnsw (embedding vector_cosine_ops);

-- GIN Index for blazing fast JSONB querying on metadata attributes
CREATE INDEX entities_metadata_gin_idx ON entities USING gin (base_metadata);

-- Standard Indexes for routing and fast graph traversal
CREATE INDEX entities_slug_idx ON entities(slug);
CREATE INDEX entities_type_idx ON entities(type);
CREATE INDEX entity_relations_source_idx ON entity_relations(source_id);
CREATE INDEX entity_relations_target_idx ON entity_relations(target_id);
CREATE INDEX taxonomy_nodes_parent_idx ON taxonomy_nodes(parent_id);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE taxonomy_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_taxonomy ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_relations ENABLE ROW LEVEL SECURITY;

-- Public read-only access policies (Ensures global read capability as requested)
CREATE POLICY "Public read access for taxonomy" ON taxonomy_nodes FOR SELECT USING (true);
CREATE POLICY "Public read access for entities" ON entities FOR SELECT USING (true);
CREATE POLICY "Public read access for entity_taxonomy" ON entity_taxonomy FOR SELECT USING (true);
CREATE POLICY "Public read access for entity_relations" ON entity_relations FOR SELECT USING (true);
