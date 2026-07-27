-- Remove overly permissive UPDATE policies
DROP POLICY IF EXISTS "Anyone can update post upvotes" ON public.forum_posts;
DROP POLICY IF EXISTS "Anyone can update reply upvotes" ON public.forum_replies;

-- Secure definer functions that only increment the upvotes column
CREATE OR REPLACE FUNCTION public.increment_forum_post_upvotes(_post_id uuid)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.forum_posts
     SET upvotes = upvotes + 1
   WHERE id = _post_id
  RETURNING upvotes;
$$;

CREATE OR REPLACE FUNCTION public.increment_forum_reply_upvotes(_reply_id uuid)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.forum_replies
     SET upvotes = upvotes + 1
   WHERE id = _reply_id
  RETURNING upvotes;
$$;

REVOKE ALL ON FUNCTION public.increment_forum_post_upvotes(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.increment_forum_reply_upvotes(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_forum_post_upvotes(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_forum_reply_upvotes(uuid) TO anon, authenticated;