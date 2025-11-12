import "server-only";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import { listAdminUsers, saveAdminUser } from "./googleSheets";
import { getJwtSecret } from "./env";
import { SheetAdminUser } from "./types";

const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

export interface AdminSession {
  id: string;
  email: string;
  role: SheetAdminUser["role"];
}

interface TokenPayload extends AdminSession {
  iat?: number;
  exp?: number;
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};

const getSecret = () => getJwtSecret();

const resolveAdminById = async (id: string) => {
  const admins = await listAdminUsers();
  return admins.find((admin) => admin.id === id && admin.active);
};

export const signAdminToken = (session: AdminSession) => {
  const secret = getSecret();
  return jwt.sign(session, secret, { expiresIn: SESSION_MAX_AGE_SECONDS });
};

export const verifyAdminToken = async (
  token: string,
): Promise<AdminSession | null> => {
  try {
    const secret = getSecret();
    const decoded = jwt.verify(token, secret) as TokenPayload;
    const admin = await resolveAdminById(decoded.id);
    if (!admin) return null;
    return {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    };
  } catch {
    return null;
  }
};

export const getTokenFromRequest = (request: NextRequest) => {
  const cookieToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (cookieToken) return cookieToken;

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "").trim();
  }

  return null;
};

export async function requireAdminFromRequest(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function authenticateAdmin(
  email: string,
  password: string,
): Promise<SheetAdminUser | null> {
  const admins = await listAdminUsers();
  const admin = admins.find(
    (item) => item.email.toLowerCase() === email.toLowerCase(),
  );

  if (!admin || !admin.active) {
    return null;
  }

  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match) {
    return null;
  }

  const timestamp = new Date().toISOString();
  await saveAdminUser({
    ...admin,
    lastLoginAt: timestamp,
  });

  return { ...admin, lastLoginAt: timestamp };
}

export const attachSessionCookie = (
  response: NextResponse,
  token: string,
) => {
  response.cookies.set(ADMIN_SESSION_COOKIE, token, cookieOptions);
};

export const clearSessionCookie = (response: NextResponse) => {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...cookieOptions,
    maxAge: 0,
  });
};

