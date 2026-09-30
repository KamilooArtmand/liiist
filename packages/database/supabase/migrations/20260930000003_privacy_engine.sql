-- ==============================================================================
-- PRIVACY ENGINE & LIST VISIBILITY ACL
-- ==============================================================================

-- 1. Enums & Helper Functions
CREATE TYPE list_visibility AS ENUM ('public', 'friends', 'private');

-- Mock function to check if the current user is a mutual friend of the list owner.
-- In production, this would query a user_relationships or followers table.
CREATE OR REPLACE FUNCTION is_friend(user_a UUID, user_b UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Assuming a mutual follower table exists, or simply returning false for now
  -- RETURN EXISTS (SELECT 1 FROM friends WHERE (user_id = user_a AND friend_id = user_b));
  RETURN false; 
END;
$$;

-- ==============================================================================
-- 2. User Lists Table
-- ==============================================================================
CREATE TABLE public.user_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    visibility list_visibility NOT NULL DEFAULT 'private',
    allow_friends_to_add BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast visibility lookups and Command Bar filtering
CREATE INDEX user_lists_visibility_idx ON public.user_lists (visibility);
CREATE INDEX user_lists_owner_idx ON public.user_lists (owner_id);

ALTER TABLE public.user_lists ENABLE ROW LEVEL SECURITY;

-- Policy: Owners have full CRUD access
CREATE POLICY "Owners have full access to their lists." 
ON public.user_lists FOR ALL USING (auth.uid() = owner_id);

-- Policy: Public lists are readable by anyone
CREATE POLICY "Public lists are globally readable." 
ON public.user_lists FOR SELECT USING (visibility = 'public');

-- Policy: Friends-only lists are readable if the user is a friend
CREATE POLICY "Friends can read friends-only lists." 
ON public.user_lists FOR SELECT USING (
  visibility = 'friends' AND is_friend(owner_id, auth.uid())
);

-- ==============================================================================
-- 3. List Items Table (Granular Collaboration)
-- ==============================================================================
CREATE TABLE public.list_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_id UUID NOT NULL REFERENCES public.user_lists(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
    added_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.list_items ENABLE ROW LEVEL SECURITY;

-- Policy: Read access matches the parent list's visibility
CREATE POLICY "Anyone who can read the list can read its items." 
ON public.list_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_lists l
    WHERE l.id = list_items.list_id
    AND (
      l.owner_id = auth.uid() OR
      l.visibility = 'public' OR
      (l.visibility = 'friends' AND is_friend(l.owner_id, auth.uid()))
    )
  )
);

-- Policy: Insert access for owners OR friends (if allowed by owner)
CREATE POLICY "Owners and allowed friends can add items." 
ON public.list_items FOR INSERT WITH CHECK (
  auth.uid() = added_by AND 
  EXISTS (
    SELECT 1 FROM public.user_lists l
    WHERE l.id = list_items.list_id
    AND (
      l.owner_id = auth.uid() OR
      (l.allow_friends_to_add = true AND is_friend(l.owner_id, auth.uid()))
    )
  )
);

-- Policy: Owners can delete any item in their list; users can delete their own added items
CREATE POLICY "Owners and item creators can delete." 
ON public.list_items FOR DELETE USING (
  added_by = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.user_lists l
    WHERE l.id = list_items.list_id AND l.owner_id = auth.uid()
  )
);
