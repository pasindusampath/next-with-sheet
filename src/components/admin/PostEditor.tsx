"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPostResponse } from "@/lib/posts";
import type { SheetStatus } from "@/lib/types";

interface PostEditorProps {
  post?: BlogPostResponse;
  mode: "create" | "edit";
}

const statusOptions: SheetStatus[] = [
  "draft",
  "scheduled",
  "published",
  "archived",
];

const toTextareaValue = (items?: string[]) =>
  items && items.length ? items.join("\n") : "";

const toTagsValue = (items?: string[]) =>
  items && items.length ? items.join(", ") : "";

const parseOutline = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const parseTags = (value: string) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

export function PostEditor({ post, mode }: PostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    post?.metaDescription ?? "",
  );
  const [outline, setOutline] = useState(toTextareaValue(post?.outline));
  const [content, setContent] = useState(post?.content ?? "");
  const [tags, setTags] = useState(toTagsValue(post?.tags));
  const [status, setStatus] = useState<SheetStatus>(post?.status ?? "draft");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [author, setAuthor] = useState(post?.author ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!title.trim() || !metaDescription.trim() || !content.trim()) {
      setError("Title, meta description, and content are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      title,
      slug,
      metaTitle,
      metaDescription,
      outline: parseOutline(outline),
      content,
      tags: parseTags(tags),
      status,
      coverImage: coverImage.trim() || undefined,
      author: author.trim() || undefined,
    };

    try {
      const response = await fetch(
        mode === "create" ? "/api/posts" : `/api/posts/${post?.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        const message = result?.error || "Unable to save post.";
        throw new Error(message);
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-8 rounded-3xl border border-prussian-blue-200 bg-eggshell-900 px-8 py-10 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-prussian-blue">
          Title
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="mt-2 w-full rounded-2xl border border-prussian-blue-200 px-4 py-3 text-sm text-rich-black placeholder:text-paynes-gray-400 focus:border-prussian-blue focus:outline-none focus:ring-2 focus:ring-prussian-blue-200"
            placeholder="AI Blogging Trends 2025"
          />
        </label>
        <label className="text-sm font-medium text-prussian-blue">
          Slug
          <input
            type="text"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-prussian-blue-200 px-4 py-3 text-sm text-rich-black placeholder:text-paynes-gray-400 focus:border-prussian-blue focus:outline-none focus:ring-2 focus:ring-prussian-blue-200"
            placeholder="ai-blogging-trends-2025"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-prussian-blue">
          Meta title
          <input
            type="text"
            value={metaTitle}
            onChange={(event) => setMetaTitle(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-prussian-blue-200 px-4 py-3 text-sm text-rich-black placeholder:text-paynes-gray-400 focus:border-prussian-blue focus:outline-none focus:ring-2 focus:ring-prussian-blue-200"
          />
        </label>
        <label className="text-sm font-medium text-prussian-blue">
          Cover image URL
          <input
            type="url"
            value={coverImage}
            onChange={(event) => setCoverImage(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-prussian-blue-200 px-4 py-3 text-sm text-rich-black placeholder:text-paynes-gray-400 focus:border-prussian-blue focus:outline-none focus:ring-2 focus:ring-prussian-blue-200"
            placeholder="https://"
          />
        </label>
      </div>

      <label className="text-sm font-medium text-prussian-blue">
        Meta description
        <textarea
          value={metaDescription}
          onChange={(event) => setMetaDescription(event.target.value)}
          required
          rows={3}
          className="mt-2 w-full rounded-2xl border border-prussian-blue-200 px-4 py-3 text-sm text-rich-black placeholder:text-paynes-gray-400 focus:border-prussian-blue focus:outline-none focus:ring-2 focus:ring-prussian-blue-200"
          placeholder="Short summary for SEO and previews."
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-prussian-blue">
          Outline (one item per line)
          <textarea
            value={outline}
            onChange={(event) => setOutline(event.target.value)}
            rows={8}
            className="mt-2 w-full rounded-2xl border border-prussian-blue-200 px-4 py-3 text-sm text-rich-black placeholder:text-paynes-gray-400 focus:border-prussian-blue focus:outline-none focus:ring-2 focus:ring-prussian-blue-200"
            placeholder="Intro\nTrend 1\nTrend 2"
          />
        </label>
        <label className="text-sm font-medium text-prussian-blue">
          Tags (comma separated)
          <textarea
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            rows={8}
            className="mt-2 w-full rounded-2xl border border-prussian-blue-200 px-4 py-3 text-sm text-rich-black placeholder:text-paynes-gray-400 focus:border-prussian-blue focus:outline-none focus:ring-2 focus:ring-prussian-blue-200"
            placeholder="AI blogging, content strategy"
          />
        </label>
      </div>

      <label className="text-sm font-medium text-prussian-blue">
        Author
        <input
          type="text"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-prussian-blue-200 px-4 py-3 text-sm text-rich-black placeholder:text-paynes-gray-400 focus:border-prussian-blue focus:outline-none focus:ring-2 focus:ring-prussian-blue-200"
          placeholder="Your name"
        />
      </label>

      <label className="text-sm font-medium text-prussian-blue">
        Content (Markdown supported)
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
          rows={16}
          className="mt-2 w-full rounded-2xl border border-prussian-blue-200 px-4 py-3 text-sm text-rich-black placeholder:text-paynes-gray-400 focus:border-prussian-blue focus:outline-none focus:ring-2 focus:ring-prussian-blue-200"
          placeholder="## Heading"
        />
      </label>

      <label className="text-sm font-medium text-prussian-blue">
        Status
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as SheetStatus)}
          className="mt-2 w-full rounded-2xl border border-prussian-blue-200 px-4 py-3 text-sm text-rich-black focus:border-prussian-blue focus:outline-none focus:ring-2 focus:ring-prussian-blue-200"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-prussian-blue px-6 py-3 text-sm font-semibold text-eggshell-900 transition hover:bg-prussian-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
            ? "Create post"
            : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center justify-center rounded-full border border-prussian-blue-200 px-6 py-3 text-sm font-semibold text-prussian-blue transition hover:border-prussian-blue hover:text-prussian-blue-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

