import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getPostById, removePost, updatePost } from "@/lib/posts";
import { SheetStatus } from "@/lib/types";
import { requireAdminFromRequest } from "@/lib/auth";

interface PostUpdatePayload {
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

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const post = await getPostById(params.id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error("Failed to fetch post", error);
    return NextResponse.json(
      { error: "Unable to fetch post" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const admin = await requireAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as PostUpdatePayload;
    const post = await updatePost(params.id, body);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/sitemap.xml");
    revalidatePath("/rss.xml");

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error("Failed to update post", error);
    return NextResponse.json(
      { error: "Unable to update post" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const admin = await requireAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await getPostById(params.id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const success = await removePost(params.id);

    if (!success) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/sitemap.xml");
    revalidatePath("/rss.xml");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete post", error);
    return NextResponse.json(
      { error: "Unable to delete post" },
      { status: 500 },
    );
  }
}

