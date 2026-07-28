-- Drop permissive UPDATE policies and column grants
DROP POLICY IF EXISTS "Anyone can increment post upvotes" ON public.forum_posts;
DROP POLICY IF EXISTS "Anyone can increment reply upvotes" ON public.forum_replies;
DROP POLICY IF EXISTS "Only upvotes column may change on posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Only upvotes column may change on replies" ON public.forum_replies;

REVOKE UPDATE ON public.forum_posts FROM anon, authenticated;
REVOKE UPDATE ON public.forum_replies FROM anon, authenticated;

-- Recreate upvote RPCs as SECURITY DEFINER, restricted to incrementing upvotes only
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