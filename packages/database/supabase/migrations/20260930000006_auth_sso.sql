-- ==============================================================================
-- AUTHENTICATION & SSO TRIGGERS
-- ==============================================================================

-- Create a function to automatically create a profile for new users
-- This handles OAuth (Google/Facebook) signups from Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  base_handle TEXT;
  final_handle TEXT;
BEGIN
  -- Extract name or email to generate a base handle
  -- Fallback to a random string if identity lacks name
  base_handle := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1),
    'user_' || substr(NEW.id::text, 1, 8)
  );
  
  -- Clean the handle (alphanumeric and underscores only)
  base_handle := regexp_replace(lower(base_handle), '[^a-z0-9_]', '', 'g');
  
  -- Ensure it's at least 3 chars
  IF length(base_handle) < 3 THEN
    base_handle := base_handle || '123';
  END IF;
  
  -- Prevent handle collisions
  final_handle := base_handle;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE handle = final_handle) LOOP
    final_handle := base_handle || floor(random() * 1000)::text;
  END LOOP;

  -- Insert the profile
  INSERT INTO public.profiles (id, handle, display_name, avatar_url)
  VALUES (
    NEW.id,
    final_handle,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Anonymous Cosmologist'),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  RETURN NEW;
END;
$$;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
