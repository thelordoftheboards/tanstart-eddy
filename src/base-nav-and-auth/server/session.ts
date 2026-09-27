import { useSession } from '@tanstack/react-start/server';
import { env } from '../../lib/env.server';

export interface SessionDataType {
  email?: string;
  role?: string;
  userId?: string;
}

export function useAppSession() {
  return useSession<SessionDataType>({
    // Optional: customize cookie settings
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
    // Session configuration
    name: 'app-session',
    password: env.BETTER_AUTH_SECRET,
  });
}
