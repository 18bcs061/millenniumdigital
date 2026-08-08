import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      loyaltyPoints: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    loyaltyPoints: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    loyaltyPoints?: number;
  }
}
