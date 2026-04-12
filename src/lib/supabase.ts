// src/lib/supabase.ts
// ---------------------------------------------------------
// Install: npm install @supabase/supabase-js
// Add to .env:
//   VITE_SUPABASE_URL=https://your-project.supabase.co
//   VITE_SUPABASE_ANON_KEY=your-anon-key
// ---------------------------------------------------------

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// ---------------------------------------------------------
// ROW TYPES — mirror Postgres columns exactly
// ---------------------------------------------------------

export interface Author {
  id: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  twitter_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface PostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_image_url: string | null;
  read_time_minutes: number | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author_id: string | null;
  category_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

export interface PostTag {
  post_id: string;
  tag_id: string;
}

// ---------------------------------------------------------
// ENRICHED / JOINED TYPES — used in components
// ---------------------------------------------------------

/** Returned by getPublishedPosts — no body, just grid fields */
export interface PostSummary extends PostRow {
  authors: Pick<Author, "id" | "name" | "avatar_url"> | null;
  categories: Pick<Category, "id" | "name" | "slug"> | null;
}

/** Returned by getPostBySlug — full detail with tags */
export interface PostDetail extends PostRow {
  authors: Author | null;
  categories: Category | null;
  tags: Tag[];
}

/** Returned by getAllPostsAdmin */
export interface PostAdmin extends PostRow {
  authors: Pick<Author, "id" | "name"> | null;
  categories: Pick<Category, "id" | "name" | "slug"> | null;
}

/** Raw shape of the post_tags join before flattening */
interface PostTagJoin {
  tag_id: string;
  tags: Tag;
}

/** Raw Supabase response before we reshape post_tags */
interface RawPostDetail extends PostRow {
  authors: Author | null;
  categories: Category | null;
  post_tags: PostTagJoin[];
}

// ---------------------------------------------------------
// INPUT TYPES
// ---------------------------------------------------------

export interface CreatePostInput {
  title: string;
  slug: string;
  excerpt?: string;
  body: string;
  cover_image_url?: string;
  read_time_minutes?: number;
  status: "draft" | "published" | "archived";
  published_at?: string;
  author_id?: string;
  category_id?: string;
  meta_title?: string;
  meta_description?: string;
  tag_ids?: string[];
}

export interface AdminSession {
  email: string;
  id: string;
}

// ---------------------------------------------------------
// SUPABASE CLIENT
// ---------------------------------------------------------

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---------------------------------------------------------
// AUTH API
// ---------------------------------------------------------

/** Sign in with email + password via Supabase Auth */
export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
}

/** Sign out the current session */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

/** Returns the current logged-in user, or null */
export async function getSession(): Promise<AdminSession | null> {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) return null;
  return { email: user.email ?? "", id: user.id };
}

/** Subscribe to auth state changes. Returns an unsubscribe function. */
export function onAuthChange(
  callback: (session: AdminSession | null) => void,
): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user;
    callback(user ? { email: user.email ?? "", id: user.id } : null);
  });
  return () => data.subscription.unsubscribe();
}

// ---------------------------------------------------------
// POSTS API
// ---------------------------------------------------------

/** All published posts for the blog grid */
export async function getPublishedPosts(): Promise<PostSummary[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id, title, slug, excerpt, cover_image_url, read_time_minutes,
      published_at, status, created_at, updated_at, author_id, category_id,
      body, meta_title, meta_description,
      authors ( id, name, avatar_url ),
      categories ( id, name, slug )
    `,
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as PostSummary[];
}

/** Single post by slug — full body + tags */
export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      authors (*),
      categories (*),
      post_tags (
        tag_id,
        tags ( id, name, slug, created_at )
      )
    `,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return null;

  const raw = data as unknown as RawPostDetail;
  const { post_tags, ...rest } = raw;
  const post: PostDetail = {
    ...rest,
    tags: post_tags.map((pt) => pt.tags),
  };

  return post;
}

/** All posts (any status) for admin panel */
export async function getAllPostsAdmin(): Promise<PostAdmin[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id, title, slug, excerpt, status, read_time_minutes,
      published_at, created_at, updated_at, author_id, category_id,
      body, meta_title, meta_description,
      authors ( id, name ),
      categories ( id, name, slug )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as PostAdmin[];
}

/** Create a new post */
export async function createPost(input: CreatePostInput): Promise<PostRow> {
  const { tag_ids, ...postData } = input;

  const { data, error } = await supabase
    .from("posts")
    .insert([postData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  const post = data as PostRow;

  if (tag_ids && tag_ids.length > 0) {
    const tagRows: PostTag[] = tag_ids.map((tag_id) => ({
      post_id: post.id,
      tag_id,
    }));
    const { error: tagError } = await supabase
      .from("post_tags")
      .insert(tagRows);
    if (tagError) throw new Error(tagError.message);
  }

  return post;
}

/** Update an existing post */
export async function updatePost(
  id: string,
  input: Partial<CreatePostInput>,
): Promise<PostRow> {
  const { tag_ids, ...postData } = input;

  const { data, error } = await supabase
    .from("posts")
    .update(postData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (tag_ids !== undefined) {
    await supabase.from("post_tags").delete().eq("post_id", id);
    if (tag_ids.length > 0) {
      const tagRows: PostTag[] = tag_ids.map((tag_id) => ({
        post_id: id,
        tag_id,
      }));
      await supabase.from("post_tags").insert(tagRows);
    }
  }

  return data as PostRow;
}

/** Delete a post by id */
export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------
// CATEGORIES & TAGS
// ---------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as Category[];
}

export async function getTags(): Promise<Tag[]> {
  const { data, error } = await supabase.from("tags").select("*").order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as Tag[];
}

export async function createTag(name: string): Promise<Tag> {
  const slug = generateSlug(name);
  const { data, error } = await supabase
    .from("tags")
    .insert([{ name, slug }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Tag;
}

// ---------------------------------------------------------
// AUTHORS
// ---------------------------------------------------------

export async function getAuthors(): Promise<Author[]> {
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []) as Author[];
}

// ---------------------------------------------------------
// UTILS
// ---------------------------------------------------------

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function estimateReadTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
