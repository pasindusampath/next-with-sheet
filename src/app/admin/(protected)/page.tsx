import { getAllPosts } from "@/lib/posts";
import { PostTable } from "@/components/admin/PostTable";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const posts = await getAllPosts();

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Content overview
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Manage posts synced from Google Sheets or created manually.
        </p>
      </section>

      <PostTable posts={posts} />
    </div>
  );
}

