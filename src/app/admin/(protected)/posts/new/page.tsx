import { PostEditor } from "@/components/admin/PostEditor";

export default function NewPostPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-prussian-blue-200 bg-eggshell-900 px-6 py-8 shadow-sm">
        <h2 className="text-xl font-semibold text-prussian-blue">
          Create new post
        </h2>
        <p className="mt-2 text-sm text-paynes-gray-500">
          Draft content manually or paste in results from your automation run.
        </p>
      </section>

      <PostEditor mode="create" />
    </div>
  );
}

