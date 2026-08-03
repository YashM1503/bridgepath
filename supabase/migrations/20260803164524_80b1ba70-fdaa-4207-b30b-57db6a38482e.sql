REVOKE EXECUTE ON FUNCTION public.increment_forum_post_upvotes(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.increment_forum_reply_upvotes(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_forum_post_upvotes(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_forum_reply_upvotes(uuid) TO service_role;