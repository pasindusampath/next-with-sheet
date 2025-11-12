export type SheetStatus = "draft" | "scheduled" | "published" | "archived";

export interface SheetBlogPost {
  rowIndex: number;
  id: string;
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription: string;
  outline: string[];
  content: string;
  tags: string[];
  status: SheetStatus;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  author?: string;
}

export interface SheetAdminUser {
  rowIndex: number;
  id: string;
  email: string;
  passwordHash: string;
  role: "admin" | "editor";
  active: boolean;
  lastLoginAt?: string;
}

export interface SheetRange {
  startRow: number;
  endRow: number;
  range: string;
}

