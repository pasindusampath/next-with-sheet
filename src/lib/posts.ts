import "server-only";

import { randomUUID } from "crypto";
import { listBlogPosts, saveBlogPost, deleteBlogPost } from "./googleSheets";
import { SheetBlogPost, SheetStatus } from "./types";

export interface BlogPostPayload {
  id?: string;
  title: string;
  slug?: string;
  metaTitle?: string;
  metaDescription: string;
  outline?: string[];
  content: string;
  tags?: string[];
  status?: SheetStatus;
  coverImage?: string;
  author?: string;
  publishedAt?: string;
}

export type BlogPostResponse = Omit<SheetBlogPost, "rowIndex">;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const toResponse = (post: SheetBlogPost): BlogPostResponse => {
  const { rowIndex: _rowIndex, ...rest } = post;
  void _rowIndex;
  return rest;
};

export async function getAllPosts() {
  const posts = await listBlogPosts();
  return posts.map(toResponse);
}

const sortByPublishedDate = (a: SheetBlogPost, b: SheetBlogPost) => {
  const aDate = a.publishedAt ?? a.updatedAt ?? a.createdAt ?? "";
  const bDate = b.publishedAt ?? b.updatedAt ?? b.createdAt ?? "";
  return new Date(bDate).getTime() - new Date(aDate).getTime();
};

export async function getPublishedPosts() {
  const posts = await listBlogPosts();
  return posts
    .filter((post) => post.status === "published")
    .sort(sortByPublishedDate)
    .map(toResponse);
}

export async function getPostById(id: string) {
  const posts = await listBlogPosts();
  const match = posts.find((post) => post.id === id);
  return match ? toResponse(match) : undefined;
}

export async function getPostBySlug(slug: string) {
  const posts = await listBlogPosts();
  const match = posts.find((post) => post.slug === slug);
  return match ? toResponse(match) : undefined;
}

const ensureSlug = (slug: string | undefined, title: string) => {
  const generated = slugify(title);
  if (!slug || !slug.trim()) return generated;
  return slugify(slug);
};

const normalizeArray = (value?: string[]) =>
  Array.isArray(value) ? value.map((item) => item.trim()).filter(Boolean) : [];

const nowISO = () => new Date().toISOString();

export async function createPost(payload: BlogPostPayload) {
  const id = payload.id ?? randomUUID();
  const slug = ensureSlug(payload.slug, payload.title);
  const outline = normalizeArray(payload.outline);
  const tags = normalizeArray(payload.tags);
  const status = payload.status ?? "draft";
  const timestamp = nowISO();

  const record: SheetBlogPost = {
    rowIndex: 0,
    id,
    slug,
    title: payload.title,
    metaTitle: payload.metaTitle,
    metaDescription: payload.metaDescription,
    outline,
    content: payload.content,
    tags,
    status,
    coverImage: payload.coverImage,
    createdAt: timestamp,
    updatedAt: timestamp,
    author: payload.author,
    publishedAt:
      payload.publishedAt ??
      (status === "published" ? timestamp : undefined),
  };

  await saveBlogPost(record);
  return toResponse({ ...record, rowIndex: 0 });
}

export async function updatePost(id: string, payload: Partial<BlogPostPayload>) {
  const posts = await listBlogPosts();
  const existing = posts.find((post) => post.id === id);

  if (!existing) {
    return undefined;
  }

  const outline =
    payload.outline !== undefined
      ? normalizeArray(payload.outline)
      : existing.outline;

  const tags =
    payload.tags !== undefined ? normalizeArray(payload.tags) : existing.tags;

  const status = payload.status ?? existing.status;
  const timestamp = nowISO();

  const updated: SheetBlogPost = {
    ...existing,
    title: payload.title ?? existing.title,
    slug: ensureSlug(payload.slug ?? existing.slug, payload.title ?? existing.title),
    metaTitle: payload.metaTitle ?? existing.metaTitle,
    metaDescription: payload.metaDescription ?? existing.metaDescription,
    outline,
    content: payload.content ?? existing.content,
    tags,
    status,
    coverImage: payload.coverImage ?? existing.coverImage,
    author: payload.author ?? existing.author,
    updatedAt: timestamp,
    publishedAt:
      status === "published"
        ? payload.publishedAt ?? existing.publishedAt ?? timestamp
        : existing.publishedAt,
  };

  await saveBlogPost(updated);
  return toResponse(updated);
}

export async function removePost(id: string) {
  const posts = await listBlogPosts();
  const match = posts.find((post) => post.id === id);

  if (!match) {
    return false;
  }

  await deleteBlogPost(match.rowIndex);
  return true;
}

