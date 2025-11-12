import "server-only";

import { google, sheets_v4 } from "googleapis";
import {
  getGoogleServiceAccount,
  getGoogleSheetId,
  env,
} from "./env";
import {
  SheetAdminUser,
  SheetBlogPost,
  SheetStatus,
} from "./types";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

type BlogPostInput = Omit<SheetBlogPost, "rowIndex"> & {
  rowIndex?: number;
};

type AdminUserInput = Omit<SheetAdminUser, "rowIndex"> & {
  rowIndex?: number;
};

export const BLOG_POST_COLUMNS = [
  "id",
  "slug",
  "title",
  "meta_title",
  "meta_description",
  "outline",
  "content",
  "tags",
  "status",
  "cover_image",
  "created_at",
  "updated_at",
  "published_at",
  "author",
] as const;

export const ADMIN_COLUMNS = [
  "id",
  "email",
  "password_hash",
  "role",
  "active",
  "last_login_at",
] as const;

let sheetsClientPromise: Promise<sheets_v4.Sheets> | null = null;

const toRecord = <T extends string>(row: string[], columns: readonly T[]) => {
  return columns.reduce(
    (acc, column, index) => {
      acc[column] = row[index] ?? "";
      return acc;
    },
    {} as Record<T, string>,
  );
};

const parseJSONList = (value?: string) => {
  if (!value || !value.trim()) return [];
  const trimmed = value.trim();

  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed)
      ? parsed.map((item) => String(item))
      : [];
  } catch {
    return trimmed
      .split(/[,|\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const parseBoolean = (value?: string) => {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
};

const serializeList = (value?: string[]) =>
  value && value.length ? JSON.stringify(value) : "";

const sanitize = (value?: string) => (value ?? "").trim();
const optional = (value?: string) => {
  const cleaned = sanitize(value);
  return cleaned.length ? cleaned : undefined;
};

const withDefaultStatus = (value?: string): SheetStatus => {
  const allowed: SheetStatus[] = [
    "draft",
    "scheduled",
    "published",
    "archived",
  ];
  if (!value) return "draft";
  const normalized = value.trim().toLowerCase() as SheetStatus;
  return allowed.includes(normalized) ? normalized : "draft";
};

async function getSheetsClient() {
  if (!sheetsClientPromise) {
    const { clientEmail, privateKey } = getGoogleServiceAccount();
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: SCOPES,
    });

    sheetsClientPromise = auth.authorize().then(() => google.sheets({ version: "v4", auth }));
  }

  return sheetsClientPromise;
}

const getSpreadsheetId = () => getGoogleSheetId();

const getBlogRange = (startRow = 2, endRow?: number) => {
  const columnLetter = String.fromCharCode(64 + BLOG_POST_COLUMNS.length); // 64 + 14 = 78 => 'N'
  return `${env.POSTS_SHEET_NAME}!A${startRow}:${columnLetter}${endRow ?? ""}`;
};

const getAdminRange = (startRow = 2, endRow?: number) => {
  const columnLetter = String.fromCharCode(64 + ADMIN_COLUMNS.length); // 64 + 6 = 70 => 'F'
  return `${env.ADMINS_SHEET_NAME}!A${startRow}:${columnLetter}${endRow ?? ""}`;
};

const parseBlogPostRow = (row: string[], index: number): SheetBlogPost => {
  const record = toRecord(row, BLOG_POST_COLUMNS);
  return {
    rowIndex: index + 2, // account for header row
    id: sanitize(record.id),
    slug: sanitize(record.slug),
    title: sanitize(record.title),
    metaTitle: optional(record.meta_title),
    metaDescription: sanitize(record.meta_description),
    outline: parseJSONList(record.outline),
    content: sanitize(record.content),
    tags: parseJSONList(record.tags),
    status: withDefaultStatus(record.status),
    coverImage: optional(record.cover_image),
    createdAt: optional(record.created_at),
    updatedAt: optional(record.updated_at),
    publishedAt: optional(record.published_at),
    author: optional(record.author),
  };
};

const parseAdminRow = (row: string[], index: number): SheetAdminUser => {
  const record = toRecord(row, ADMIN_COLUMNS);
  return {
    rowIndex: index + 2,
    id: sanitize(record.id),
    email: sanitize(record.email).toLowerCase(),
    passwordHash: sanitize(record.password_hash),
    role: (sanitize(record.role) as SheetAdminUser["role"]) || "admin",
    active: parseBoolean(record.active),
    lastLoginAt: optional(record.last_login_at),
  };
};

const serializeBlogPost = (post: BlogPostInput): string[] => [
  post.id,
  post.slug,
  post.title,
  post.metaTitle ?? "",
  post.metaDescription,
  serializeList(post.outline),
  post.content,
  serializeList(post.tags),
  post.status,
  post.coverImage ?? "",
  post.createdAt ?? "",
  post.updatedAt ?? "",
  post.publishedAt ?? "",
  post.author ?? "",
];

const serializeAdmin = (admin: AdminUserInput): string[] => [
  admin.id,
  admin.email.toLowerCase(),
  admin.passwordHash,
  admin.role,
  admin.active ? "TRUE" : "FALSE",
  admin.lastLoginAt ?? "",
];

export async function listBlogPosts(): Promise<SheetBlogPost[]> {
  const sheets = await getSheetsClient();
  const range = getBlogRange();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range,
    majorDimension: "ROWS",
  });

  const rows = response.data.values ?? [];
  return rows
    .filter((row) => row.length > 0 && row.some((cell) => cell && cell.trim()))
    .map((row, index) => parseBlogPostRow(row, index));
}

export async function listAdminUsers(): Promise<SheetAdminUser[]> {
  const sheets = await getSheetsClient();
  const range = getAdminRange();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range,
    majorDimension: "ROWS",
  });

  const rows = response.data.values ?? [];
  return rows
    .filter((row) => row.length > 0 && row.some((cell) => cell && cell.trim()))
    .map((row, index) => parseAdminRow(row, index));
}

export async function findBlogPostBySlug(
  slug: string,
): Promise<SheetBlogPost | undefined> {
  const posts = await listBlogPosts();
  return posts.find((post) => post.slug === slug);
}

export async function findAdminByEmail(
  email: string,
): Promise<SheetAdminUser | undefined> {
  const admins = await listAdminUsers();
  return admins.find(
    (admin) => admin.email.toLowerCase() === email.toLowerCase(),
  );
}

export async function saveBlogPost(post: BlogPostInput) {
  const sheets = await getSheetsClient();
  const values = [serializeBlogPost(post)];
  const spreadsheetId = getSpreadsheetId();

  if (post.rowIndex && post.rowIndex >= 2) {
    const range = getBlogRange(post.rowIndex, post.rowIndex);
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });
    return post.rowIndex;
  }

  const range = `${env.POSTS_SHEET_NAME}!A:A`;
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values,
    },
  });

  const updates = response.data.updates;
  return updates?.updatedRange ?? null;
}

export async function saveAdminUser(admin: AdminUserInput) {
  const sheets = await getSheetsClient();
  const values = [serializeAdmin(admin)];
  const spreadsheetId = getSpreadsheetId();

  if (admin.rowIndex && admin.rowIndex >= 2) {
    const range = getAdminRange(admin.rowIndex, admin.rowIndex);
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });
    return admin.rowIndex;
  }

  const range = `${env.ADMINS_SHEET_NAME}!A:A`;
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values,
    },
  });

  const updates = response.data.updates;
  return updates?.updatedRange ?? null;
}

export async function deleteBlogPost(rowIndex: number) {
  const sheets = await getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const range = getBlogRange(rowIndex, rowIndex);

  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range,
  });
}

export async function deleteAdmin(rowIndex: number) {
  const sheets = await getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const range = getAdminRange(rowIndex, rowIndex);

  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range,
  });
}

