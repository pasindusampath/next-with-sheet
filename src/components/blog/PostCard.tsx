import Link from "next/link";
import { BlogPostResponse } from "@/lib/posts";

interface PostCardProps {
  post: BlogPostResponse;
}

const formatDate = (value?: string) => {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return null;
  }
};

export function PostCard({ post }: PostCardProps) {
  const publishedOn =
    formatDate(post.publishedAt) ?? formatDate(post.updatedAt);

  return (
    <article className="flex h-full flex-col justify-between rounded-3xl border border-prussian-blue-200 bg-eggshell-900 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div>
        {publishedOn ? (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-paynes-gray-400">
            {publishedOn}
          </p>
        ) : null}
        <h3 className="mt-3 text-xl font-semibold text-prussian-blue">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="mt-3 text-sm leading-6 text-paynes-gray-500">
          {post.metaDescription}
        </p>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {post.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-prussian-blue-200 px-3 py-1 text-xs font-medium text-paynes-gray-500"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="text-sm font-semibold text-prussian-blue underline-offset-4 transition hover:underline"
        >
          Read
        </Link>
      </div>
    </article>
  );
}

