
-- 1) Length constraints
ALTER TABLE public.forum_posts
  ADD CONSTRAINT forum_posts_title_len CHECK (char_length(title) BETWEEN 1 AND 200),
  ADD CONSTRAINT forum_posts_body_len CHECK (char_length(body) BETWEEN 1 AND 5000),
  ADD CONSTRAINT forum_posts_author_len CHECK (char_length(author_name) BETWEEN 1 AND 80);

ALTER TABLE public.forum_replies
  ADD CONSTRAINT forum_replies_body_len CHECK (char_length(body) BETWEEN 1 AND 5000),
  ADD CONSTRAINT forum_replies_author_len CHECK (char_length(author_name) BETWEEN 1 AND 80);

-- 2) Replace permissive INSERT policies with validating ones
DROP POLICY IF EXISTS "Anyone can create posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Anyone can create replies" ON public.forum_replies;

CREATE POLICY "Anyone can create posts"
ON public.forum_posts
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(title) BETWEEN 1 AND 200
  AND char_length(body) BETWEEN 1 AND 5000
  AND char_length(author_name) BETWEEN 1 AND 80
  AND upvotes = 0
);

CREATE POLICY "Anyone can create replies"
ON public.forum_replies
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(body) BETWEEN 1 AND 5000
  AND char_length(author_name) BETWEEN 1 AND 80
  AND upvotes = 0
);

-- 3) Switch upvote functions to SECURITY INVOKER (rely on RLS + column grants)
CREATE OR REPLACE FUNCTION public.increment_forum_post_upvotes(_post_id uuid)
RETURNS integer
LANGUAGE sql
SECURITY INVOKER
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
SECURITY INVOKER
SET search_path = public
AS $$
  UPDATE public.forum_replies
     SET upvotes = upvotes + 1
   WHERE id = _reply_id
  RETURNING upvotes;
$$;

-- 4) Allow only the upvotes column to be updated by public roles
GRANT UPDATE (upvotes) ON public.forum_posts TO anon, authenticated;
GRANT UPDATE (upvotes) ON public.forum_replies TO anon, authenticated;

CREATE POLICY "Anyone can increment post upvotes"
ON public.forum_posts
FOR UPDATE
TO anon, authenticated
USING (upvotes >= 0)
WITH CHECK (upvotes >= 0);

CREATE POLICY "Anyone can increment reply upvotes"
ON public.forum_replies
FOR UPDATE
TO anon, authenticated
USING (upvotes >= 0)
WITH CHECK (upvotes >= 0);
