import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { createPost, getAllPosts } from "@/lib/posts";
import { SheetStatus } from "@/lib/types";
import { requireAdminFromRequest } from "@/lib/auth";

interface PostRequestBody {
  title?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  outline?: string[];
  content?: string;
  tags?: string[];
  status?: SheetStatus;
  coverImage?: string;
  author?: string;
  publishedAt?: string;
}

const requiredFields: Array<keyof PostRequestBody> = [
  "title",
  "metaDescription",
  "content",
];

const validatePayload = (body: PostRequestBody) => {
  const missing = requiredFields.filter(
    (field) => !body[field] || !String(body[field]).trim(),
  );

  if (missing.length) {
    return {
      valid: false,
      message: `Missing required fields: ${missing.join(", ")}`,
    };
  }

  return { valid: true };
};

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json({ data: posts });
  } catch (error) {
    console.error("Failed to fetch posts from sheet", error);
    return NextResponse.json(
      { error: "Unable to fetch posts" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as PostRequestBody;
    const validation = validatePayload(body);

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.message },
        { status: 400 },
      );
    }

    const post = await createPost({
      title: body.title!,
      slug: body.slug,
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription!,
      outline: body.outline,
      content: body.content!,
      tags: body.tags,
      status: body.status,
      coverImage: body.coverImage,
      author: body.author,
      publishedAt: body.publishedAt,
    });

    const revalidate = () => {
      revalidatePath("/");
      revalidatePath("/blog");
      revalidatePath(`/blog/${post.slug}`);
      revalidatePath("/sitemap.xml");
      revalidatePath("/rss.xml");
    };

    revalidate();
    return NextResponse.json({ data: post }, { status: 201 });
  } catch (error) {
    console.error("Failed to create post", error);
    return NextResponse.json(
      { error: "Unable to create post" },
      { status: 500 },
    );
  }
}

