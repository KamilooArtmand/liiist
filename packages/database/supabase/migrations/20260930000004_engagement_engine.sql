-- ==============================================================================
-- ENGAGEMENT ENGINE: SAVES, LIKES, COMMENTS & COLLECTIONS
-- ==============================================================================

-- 1. User Collections (Folders for Saves)
CREATE TABLE public.user_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_private BOOLEAN NOT NULL DEFAULT false, -- If true, won't show on public profile
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_user_collections_owner ON public.user_collections(owner_id);

-- 2. Saves (Bookmarks)
-- Can save either an entity or a list. 
CREATE TABLE public.saves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id UUID NOT NULL REFERENCES public.user_collections(id) ON DELETE CASCADE,
    entity_id UUID REFERENCES public.entities(id) ON DELETE CASCADE,
    list_id UUID REFERENCES public.user_lists(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    -- Ensure it references one or the other, not both or neither
    CONSTRAINT save_target_check CHECK (
        (entity_id IS NOT NULL AND list_id IS NULL) OR 
        (entity_id IS NULL AND list_id IS NOT NULL)
    )
);
CREATE UNIQUE INDEX idx_saves_unique_entity ON public.saves(collection_id, entity_id) WHERE entity_id IS NOT NULL;
CREATE UNIQUE INDEX idx_saves_unique_list ON public.saves(collection_id, list_id) WHERE list_id IS NOT NULL;

-- 3. Comments (Threaded)
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- For threading/replies
    entity_id UUID REFERENCES public.entities(id) ON DELETE CASCADE,
    list_id UUID REFERENCES public.user_lists(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT comment_target_check CHECK (
        (entity_id IS NOT NULL AND list_id IS NULL) OR 
        (entity_id IS NULL AND list_id IS NOT NULL)
    )
);
CREATE INDEX idx_comments_parent ON public.comments(parent_id);
CREATE INDEX idx_comments_user ON public.comments(user_id);

-- 4. Likes
CREATE TABLE public.likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    entity_id UUID REFERENCES public.entities(id) ON DELETE CASCADE,
    list_id UUID REFERENCES public.user_lists(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT like_target_check CHECK (
        num_nonnulls(entity_id, list_id, comment_id) = 1
    ),
    UNIQUE(user_id, entity_id, list_id, comment_id)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (Privacy Inheritance)
-- ==============================================================================

ALTER TABLE public.user_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Collections: Owner can read all. Public can read if !is_private
CREATE POLICY "Users can read public collections" ON public.user_collections
FOR SELECT USING (
  owner_id = auth.uid() OR is_private = false
);

CREATE POLICY "Owners have full access to collections" ON public.user_collections
FOR ALL USING (owner_id = auth.uid());

-- Comments: Inherits privacy from target list (entities are assumed public)
CREATE POLICY "Read comments honoring list privacy" ON public.comments
FOR SELECT USING (
  list_id IS NULL OR 
  EXISTS (
    SELECT 1 FROM public.user_lists l 
    WHERE l.id = comments.list_id AND (
      l.visibility = 'public' OR 
      l.owner_id = auth.uid() OR 
      (l.visibility = 'friends' AND is_friend(l.owner_id, auth.uid()))
    )
  )
);
