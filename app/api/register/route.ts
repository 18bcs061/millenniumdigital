import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { findUserByEmail, createUser } from "@/lib/users-store";

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide a valid name, email, and an 8+ character password." }, { status: 400 });
  }

  const { name, email, password } = parsed.data;

  if (findUserByEmail(email)) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = createUser({ name, email, passwordHash });

  return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 });
}
