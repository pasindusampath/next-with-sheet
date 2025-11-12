import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPublishedPosts } from "@/lib/posts";
import { PostBody } from "@/components/blog/PostBody";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(
  props: PostPageProps,
): Promise<Metadata> {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {};
  }

  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription;
  const url = `/blog/${post.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

const formatDate = (value?: string) => {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return null;
  }
};

export default async function BlogPostPage(props: PostPageProps) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const publishedOn =
    formatDate(post.publishedAt) ?? formatDate(post.updatedAt);

  return (
    <article className="mx-auto max-w-5xl px-6 py-24">
      <header className="text-center">
        {publishedOn ? (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            {publishedOn}
          </p>
        ) : null}
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          {post.title}
        </h1>
        {post.author ? (
          <p className="mt-4 text-sm font-medium text-slate-500">
            By {post.author}
          </p>
        ) : null}
        {post.tags?.length ? (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      {post.outline?.length ? (
        <aside className="mx-auto mt-12 max-w-3xl rounded-3xl border border-slate-200 bg-white px-6 py-6 text-left shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Outline</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600">
            {post.outline.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ol>
        </aside>
      ) : null}

      <section className="mt-16">
        <PostBody content={post.content} />
      </section>
    </article>
  );
}

