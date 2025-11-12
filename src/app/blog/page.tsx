import { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Browse the latest posts generated from our Google Sheet and automation workflows.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <header className="flex flex-col gap-4 text-center md:text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-paynes-gray-400">
          Blog
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-rich-black sm:text-5xl">
          AI-assisted stories shipped from a Google Sheet.
        </h1>
        <p className="text-lg leading-7 text-paynes-gray-500">
          Each article is crafted through N8N workflows, reviewed by admins, and
          published instantly through Next.js.
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-3xl border border-dashed border-prussian-blue-300 bg-eggshell-900 px-10 py-16 text-center">
          <h2 className="text-2xl font-semibold text-prussian-blue">
            No published posts yet
          </h2>
          <p className="mt-4 text-sm text-paynes-gray-500">
            Connect your Google Sheet and trigger an automation run to populate
            the feed. Admins can publish drafts from the dashboard.
          </p>
          <Link
            href="/#contact"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-prussian-blue px-6 py-3 text-sm font-semibold text-eggshell-900 transition hover:bg-prussian-blue-600"
          >
            Get onboarding support
          </Link>
        </div>
      )}
    </div>
  );
}

