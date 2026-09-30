-- ==============================================================================
-- ACCOUNT LIFECYCLE & SECURITY
-- ==============================================================================

-- 1. Add Deactivation & Deletion tracking to Profiles
ALTER TABLE public.profiles 
ADD COLUMN is_deactivated BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN scheduled_deletion_date TIMESTAMPTZ;

-- 2. Update Profile RLS to enforce deactivation logic
-- Drop the old public policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

-- Create new policy: Public profiles are viewable ONLY if they are not deactivated.
-- However, users can always see their own profile regardless of deactivation state.
CREATE POLICY "Public profiles are viewable if not deactivated" 
ON public.profiles FOR SELECT USING (
  (is_deactivated = false) OR (auth.uid() = id)
);

-- 3. Blocked Users Table
CREATE TABLE public.blocked_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(blocker_id, blocked_id)
);

ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own blocks" ON public.blocked_users
FOR ALL USING (blocker_id = auth.uid());

-- Prevent blocked users from viewing the blocker's profile
CREATE POLICY "Hide profiles from blocked users" 
ON public.profiles FOR SELECT USING (
  NOT EXISTS (
    SELECT 1 FROM public.blocked_users 
    WHERE blocker_id = public.profiles.id AND blocked_id = auth.uid()
  )
);
