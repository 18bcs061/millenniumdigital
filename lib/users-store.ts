import usersData from "@/data/users.json";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  loyaltyPoints: number;
}

const seededUsers = usersData as StoredUser[];

/**
 * Runtime-registered accounts, kept in memory only (no database yet).
 * This resets on cold start / new serverless instance — fine for demoing
 * within a session, but not a substitute for real persistence. Swap this
 * module out once a database is reconnected.
 */
const runtimeUsers = new Map<string, StoredUser>();

export function findUserByEmail(email: string): StoredUser | undefined {
  return runtimeUsers.get(email.toLowerCase()) ?? seededUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(input: { name: string; email: string; passwordHash: string; loyaltyPoints?: number }): StoredUser {
  const user: StoredUser = {
    id: `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name: input.name,
    email: input.email,
    passwordHash: input.passwordHash,
    loyaltyPoints: input.loyaltyPoints ?? 50,
  };
  runtimeUsers.set(user.email.toLowerCase(), user);
  return user;
}
