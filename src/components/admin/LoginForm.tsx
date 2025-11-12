"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        const message = result?.error || "Unable to sign in. Try again.";
        throw new Error(message);
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-5 rounded-3xl border border-prussian-blue-200 bg-eggshell-900 px-8 py-10 shadow-lg"
    >
      <div className="text-left">
        <h1 className="text-2xl font-semibold text-prussian-blue">
          Sign in to Admin
        </h1>
        <p className="mt-2 text-sm text-paynes-gray-500">
          Use the credentials stored in your Google Sheet.
        </p>
      </div>

      <label className="text-sm font-medium text-prussian-blue">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="mt-2 w-full rounded-2xl border border-prussian-blue-200 px-4 py-3 text-sm text-rich-black placeholder:text-paynes-gray-400 focus:border-prussian-blue focus:outline-none focus:ring-2 focus:ring-prussian-blue-200"
          placeholder="admin@example.com"
        />
      </label>

      <label className="text-sm font-medium text-prussian-blue">
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="mt-2 w-full rounded-2xl border border-prussian-blue-200 px-4 py-3 text-sm text-rich-black placeholder:text-paynes-gray-400 focus:border-prussian-blue focus:outline-none focus:ring-2 focus:ring-prussian-blue-200"
          placeholder="••••••••"
        />
      </label>

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-prussian-blue px-6 py-3 text-sm font-semibold text-eggshell-900 transition hover:bg-prussian-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

