const sanitizeUrl = (url: string) => url.replace(/\/+$/, "");

export const siteUrl =
  (process.env.NEXT_PUBLIC_SITE_URL &&
    sanitizeUrl(process.env.NEXT_PUBLIC_SITE_URL)) ||
  (process.env.SITE_URL && sanitizeUrl(process.env.SITE_URL)) ||
  "http://localhost:3000";

