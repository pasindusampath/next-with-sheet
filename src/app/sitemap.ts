import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const updatedAt =
    posts[0]?.updatedAt ?? posts[0]?.createdAt ?? new Date().toISOString();

  const postEntries = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt ?? post.createdAt ?? new Date().toISOString(),
  }));

  return [
    {
      url: `${siteUrl}/`,
      lastModified: updatedAt,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: updatedAt,
    },
    ...postEntries,
  ];
}

