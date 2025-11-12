import { getAllPosts } from "@/lib/posts";
import { PostTable } from "@/components/admin/PostTable";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const posts = await getAllPosts();

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-prussian-blue-200 bg-eggshell-900 px-6 py-8 shadow-sm">
        <h2 className="text-xl font-semibold text-prussian-blue">
          Content overview
        </h2>
        <p className="mt-2 text-sm text-paynes-gray-500">
          Manage posts synced from Google Sheets or created manually.
        </p>
      </section>

      <PostTable posts={posts} />
    </div>
  );
}

