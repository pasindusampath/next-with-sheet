import { PostEditor } from "@/components/admin/PostEditor";

export default function NewPostPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Create new post
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Draft content manually or paste in results from your automation run.
        </p>
      </section>

      <PostEditor mode="create" />
    </div>
  );
}

