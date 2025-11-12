import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getCurrentAdmin } from "@/lib/auth";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-eggshell-900 via-eggshell-700 to-eggshell-600 px-6 py-24">
      <LoginForm />
    </div>
  );
}

