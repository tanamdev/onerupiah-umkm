import { DefaultSession } from 'next-auth';

type AppUserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role?: AppUserRole;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role?: AppUserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    role?: AppUserRole;
  }
}
