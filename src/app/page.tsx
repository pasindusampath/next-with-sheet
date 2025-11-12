import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";

export const revalidate = 300;

export default async function Home() {
  const posts = await getPublishedPosts();
  const featuredPosts = posts.slice(0, 3);
  const heroPost = posts[0];

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-eggshell-900 via-eggshell-800 to-eggshell-700">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-24 pt-16 text-center md:flex-row md:items-center md:gap-20 md:text-left">
          <div className="mx-auto max-w-2xl md:mx-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-paynes-gray-400/60 bg-eggshell px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-paynes-gray-500">
              Google Sheets Powered
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-rich-black sm:text-5xl">
              Run your landing page and blog from a single Google Sheet.
            </h1>
            <p className="mt-6 text-lg leading-7 text-paynes-gray-500">
              Next Sheet CMS keeps your marketing site fresh with automated N8N
              content workflows while giving admins a clean interface to manage
              updates—no databases or heavy CMS setup required.
            </p>
            <div className="mt-8 flex flex-col gap-3 text-sm font-medium md:flex-row">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-prussian-blue px-6 py-3 text-eggshell-900 shadow-md transition hover:bg-prussian-blue-600"
              >
                Book a Demo
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-prussian-blue-300 bg-white px-6 py-3 text-sm font-semibold text-prussian-blue shadow-sm transition hover:border-prussian-blue hover:bg-eggshell-900"
              >
                See Features
              </a>
            </div>
          </div>
          <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-prussian-blue-300 bg-eggshell-900 shadow-[0_30px_60px_-20px_rgba(29,45,68,0.35)]">
            <div className="bg-prussian-blue px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-eggshell-900">
              {heroPost ? "Latest automation" : "Admin Snapshot"}
            </div>
            <div className="grid gap-6 px-6 py-8 text-left">
              <div>
                <p className="text-xs font-medium uppercase text-paynes-gray-500">
                  Published posts
                </p>
                <p className="mt-1 text-2xl font-semibold text-rich-black">
                  {posts.length}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-paynes-gray-500">
                  Latest automation
                </p>
                <p className="mt-1 text-sm text-paynes-gray-400">
                  {heroPost
                    ? heroPost.title
                    : "Automated blog posts from your Google Sheet arrive here."}
                </p>
              </div>
              <div className="rounded-2xl border border-prussian-blue-200 bg-eggshell px-4 py-3 text-sm text-paynes-gray-400">
                “Our marketing team updates content directly from Google Sheets.
                Launch speed increased 4× without touching the codebase.”
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto max-w-6xl px-6 py-24 text-center md:text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-paynes-gray-400">
          Why it works
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-rich-black sm:text-4xl">
          Powerful automation with a familiar workflow.
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {[
            {
              title: "Sheets as your CMS",
              description:
                "Structure blog content, metadata, and admin credentials within a single Google Sheet with instant syncing.",
            },
            {
              title: "Automations via N8N",
              description:
                "Trigger blog creation, revalidation, and SEO updates automatically from your existing N8N workflows.",
            },
            {
              title: "Next.js performance",
              description:
                "Static rendering and ISR keep pages fast, while dynamic API routes give admins full control.",
            },
          ].map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-prussian-blue-200 bg-eggshell-900 p-8 text-left shadow-sm"
            >
              <h3 className="text-xl font-semibold text-prussian-blue">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-paynes-gray-500">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="blog" className="bg-eggshell py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-paynes-gray-400">
                Latest insights
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-rich-black sm:text-4xl">
                Stories designed to convert.
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-full border border-prussian-blue-300 px-6 py-3 text-sm font-medium text-prussian-blue transition hover:border-prussian-blue hover:text-prussian-blue-600"
            >
              View all posts
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featuredPosts.length > 0 ? (
              featuredPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <article className="rounded-3xl border border-prussian-blue-200 bg-eggshell-900 p-6 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-paynes-gray-400">
                  Feed in progress
                </p>
                <h3 className="mt-3 text-xl font-semibold text-prussian-blue">
                  Automated posts will appear here soon
                </h3>
                <p className="mt-3 text-sm leading-6 text-paynes-gray-500">
                  Connect your Google Sheet and trigger an N8N workflow to see
                  new stories populate this feed instantly.
                </p>
              </article>
            )}
          </div>
        </div>
      </section>

      <section
        id="about"
        className="mx-auto max-w-6xl px-6 py-24 text-center md:text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-paynes-gray-400">
          Built for teams
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-rich-black sm:text-4xl">
          A no-code friendly workflow that scales with your content ops.
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-7 text-paynes-gray-500 md:mx-0">
          Your spreadsheet becomes the source of truth for published content,
          admin permissions, and automation triggers. Editors update rows.
          N8N flows create outlines and drafts. Next.js revalidates and serves
          polished landing pages instantly.
        </p>
      </section>

      <section id="contact" className="bg-prussian-blue py-24 text-eggshell-900">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 text-center md:flex-row md:items-start md:gap-16 md:text-left">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to connect your sheet?
            </h2>
            <p className="mt-4 text-lg leading-7 text-silver-lake-blue-800">
              Share your email and we’ll send onboarding instructions along with
              a starter sheet template tailored to your content workflow.
            </p>
          </div>
          <form
            className="flex w-full max-w-md flex-col gap-3 text-left"
            action="https://formspree.io/f/mayvlabn"
            method="POST"
          >
            <label className="text-sm font-medium text-eggshell-900">
              Work email
              <input
                type="email"
                placeholder="you@company.com"
                className="mt-1 w-full rounded-2xl border border-silver-lake-blue-400 bg-rich-black px-4 py-3 text-sm text-eggshell-900 placeholder:text-silver-lake-blue-700 focus:border-silver-lake-blue-500 focus:outline-none focus:ring-2 focus:ring-silver-lake-blue-400/60"
                name="email"
                required
              />
            </label>
            <label className="text-sm font-medium text-eggshell-900">
              What are you planning to ship?
              <textarea
                placeholder="Tell us about your upcoming campaigns"
                className="mt-1 w-full rounded-2xl border border-silver-lake-blue-400 bg-rich-black px-4 py-3 text-sm text-eggshell-900 placeholder:text-silver-lake-blue-700 focus:border-silver-lake-blue-500 focus:outline-none focus:ring-2 focus:ring-silver-lake-blue-400/60"
                rows={3}
                name="message"
              />
            </label>
            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-eggshell px-6 py-3 text-sm font-semibold text-prussian-blue transition hover:bg-eggshell-600"
            >
              Request onboarding
            </button>
            <p className="text-xs text-silver-lake-blue-700">
              We respect your privacy. You’ll hear from us within one business
              day.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
