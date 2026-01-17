import { useSession } from '@tanstack/react-start/server';
import { env } from '~/lib/env.server';

export interface SessionDataType {
  userId?: string;
  email?: string;
  role?: string;
}

export function useAppSession() {
  return useSession<SessionDataType>({
    // Session configuration
    name: 'app-session',
    password: env.BETTER_AUTH_SECRET,
    // Optional: customize cookie settings
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
    },
  });
}
