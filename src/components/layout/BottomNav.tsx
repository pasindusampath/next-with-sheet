 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-2xl border border-prussian-blue-800/60 bg-eggshell/95 shadow-xl backdrop-blur-lg md:hidden">
      <ul className="flex items-center justify-around px-2 py-3 text-sm font-medium text-paynes-gray-500">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === item.href
              : pathname.startsWith(item.href.replace("/#", ""));

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive ? "text-prussian-blue" : "text-paynes-gray-400"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`h-1 w-8 rounded-full transition ${
                    isActive ? "bg-prussian-blue" : "bg-transparent"
                  }`}
                  aria-hidden
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

