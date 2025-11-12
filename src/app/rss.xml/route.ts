import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/posts";
import { siteUrl } from "@/lib/site";

export const revalidate = 300;

const buildRss = (posts: Awaited<ReturnType<typeof getPublishedPosts>>) => {
  const updatedAt =
    posts[0]?.updatedAt ?? posts[0]?.createdAt ?? new Date().toISOString();

  const items = posts
    .map((post) => {
      const pubDate = post.publishedAt ?? post.updatedAt ?? updatedAt;
      return `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <link>${siteUrl}/blog/${post.slug}</link>
          <guid>${post.id}</guid>
          <pubDate>${new Date(pubDate).toUTCString()}</pubDate>
          <description><![CDATA[${post.metaDescription}]]></description>
        </item>
      `;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title><![CDATA[Next Sheet CMS Blog]]></title>
      <link>${siteUrl}</link>
      <description><![CDATA[Latest content automated from Google Sheets workflows.]]></description>
      <lastBuildDate>${new Date(updatedAt).toUTCString()}</lastBuildDate>
      ${items}
    </channel>
  </rss>`;
};

export async function GET() {
  const posts = await getPublishedPosts();
  const xml = buildRss(posts);
  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate",
    },
  });
}

