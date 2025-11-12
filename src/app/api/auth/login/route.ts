import { NextRequest, NextResponse } from "next/server";
import {
  authenticateAdmin,
  attachSessionCookie,
  signAdminToken,
  getCurrentAdmin,
} from "@/lib/auth";

interface LoginRequestBody {
  email?: string;
  password?: string;
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, admin });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as LoginRequestBody;

  if (!body.email || !body.password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const admin = await authenticateAdmin(body.email, body.password);

  if (!admin) {
    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 401 },
    );
  }

  const session = {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  };

  const token = signAdminToken(session);
  const response = NextResponse.json({ authenticated: true, admin: session });
  attachSessionCookie(response, token);
  return response;
}

