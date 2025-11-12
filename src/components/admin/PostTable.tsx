"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BlogPostResponse } from "@/lib/posts";

interface PostTableProps {
  posts: BlogPostResponse[];
}

const statusStyles: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600",
  scheduled: "bg-amber-100 text-amber-700",
  published: "bg-emerald-100 text-emerald-700",
  archived: "bg-slate-200 text-slate-500",
};

export function PostTable({ posts }: PostTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (deletingId) return;
    if (!confirm("Delete this post? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        const message = result?.error ?? "Failed to delete post.";
        throw new Error(message);
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to delete post.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!posts.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-10 py-16 text-center">
        <h2 className="text-2xl font-semibold text-slate-900">
          No posts available
        </h2>
        <p className="mt-4 text-sm text-slate-600">
          Use the “New Post” button to create a draft or trigger an automation
          to populate this list.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full table-fixed">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          <tr>
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Updated</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {posts.map((post) => {
            const statusStyle =
              statusStyles[post.status] ?? statusStyles.draft;
            const updatedOn =
              post.updatedAt || post.createdAt || post.publishedAt;
            return (
              <tr key={post.id} className="hover:bg-slate-50/60">
                <td className="px-6 py-5">
                  <div className="font-semibold text-slate-900">
                    {post.title}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                    {post.metaDescription}
                  </p>
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-xs text-slate-500">
                  {updatedOn
                    ? new Date(updatedOn).toLocaleString()
                    : "Not set"}
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      className="inline-flex items-center justify-center rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:border-rose-300 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={deletingId === post.id}
                    >
                      {deletingId === post.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

