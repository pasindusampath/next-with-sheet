import { notFound } from "next/navigation";
import { getPostById } from "@/lib/posts";
import { PostEditor } from "@/components/admin/PostEditor";

interface AdminPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage(props: AdminPostPageProps) {
  const params = await props.params;
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-prussian-blue-200 bg-eggshell-900 px-6 py-8 shadow-sm">
        <h2 className="text-xl font-semibold text-prussian-blue">
          Edit post: {post.title}
        </h2>
        <p className="mt-2 text-sm text-paynes-gray-500">
          Update content, metadata, or publishing status. Changes sync back to
          Google Sheets automatically.
        </p>
      </section>

      <PostEditor mode="edit" post={post} />
    </div>
  );
}

