"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BlogPostResponse } from "@/lib/posts";

interface PostTableProps {
  posts: BlogPostResponse[];
}

const statusStyles: Record<string, string> = {
  draft: "bg-eggshell-800 text-paynes-gray-500",
  scheduled: "bg-silver-lake-blue-800 text-prussian-blue",
  published: "bg-prussian-blue-600 text-eggshell-900",
  archived: "bg-paynes-gray-300 text-paynes-gray-600",
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
      <div className="rounded-3xl border border-dashed border-prussian-blue-300 bg-eggshell-900 px-10 py-16 text-center">
        <h2 className="text-2xl font-semibold text-prussian-blue">
          No posts available
        </h2>
        <p className="mt-4 text-sm text-paynes-gray-500">
          Use the “New Post” button to create a draft or trigger an automation
          to populate this list.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-prussian-blue-200 bg-eggshell-900 shadow-sm">
      <table className="w-full table-fixed">
        <thead className="bg-eggshell text-left text-xs font-semibold uppercase tracking-[0.2em] text-paynes-gray-400">
          <tr>
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Updated</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-eggshell text-sm">
          {posts.map((post) => {
            const statusStyle =
              statusStyles[post.status] ?? statusStyles.draft;
            const updatedOn =
              post.updatedAt || post.createdAt || post.publishedAt;
            return (
              <tr key={post.id} className="hover:bg-eggshell/60">
                <td className="px-6 py-5">
                  <div className="font-semibold text-prussian-blue">
                    {post.title}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-paynes-gray-500">
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
                <td className="px-6 py-5 text-xs text-paynes-gray-500">
                  {updatedOn
                    ? new Date(updatedOn).toLocaleString()
                    : "Not set"}
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="inline-flex items-center justify-center rounded-full border border-prussian-blue-200 px-3 py-1 text-xs font-semibold text-prussian-blue transition hover:border-prussian-blue hover:text-prussian-blue-600"
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

