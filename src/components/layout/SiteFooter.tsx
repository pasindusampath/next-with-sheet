export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} Next Sheet CMS. All rights reserved.</p>
        <div className="flex gap-6">
          <a
            href="/privacy"
            className="transition-colors hover:text-slate-900"
          >
            Privacy
          </a>
          <a href="/terms" className="transition-colors hover:text-slate-900">
            Terms
          </a>
          <a href="mailto:hello@example.com" className="transition-colors hover:text-slate-900">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

