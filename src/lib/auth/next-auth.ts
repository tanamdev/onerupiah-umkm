import crypto from 'crypto';
import type { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth/password';
import { verifyPassword } from '@/lib/auth/password';
import { subscriptionService } from '@/lib/subscription';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
            isActive: true,
            avatar: true,
          },
        });

        if (!user || !user.isActive) {
          return null;
        }

        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar || undefined,
          role: user.role,
        } as any;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google') {
        return true;
      }

      if (!user.email) {
        return false;
      }

      const normalizedEmail = user.email.toLowerCase().trim();
      const displayName = user.name?.trim() || normalizedEmail.split('@')[0];

      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: {
          id: true,
          isActive: true,
        },
      });

      if (existingUser && !existingUser.isActive) {
        return false;
      }

      if (!existingUser) {
        const randomPassword = crypto.randomBytes(32).toString('hex');
        const hashedPassword = await hashPassword(randomPassword);

        const newUser = await prisma.user.create({
          data: {
            name: displayName,
            email: normalizedEmail,
            password: hashedPassword,
            avatar: user.image || null,
            isActive: true,
            emailVerified: true,
            role: 'USER',
          },
          select: {
            id: true,
          },
        });

        // Create default free subscription
        await subscriptionService.createDefaultSubscription(newUser.id);
      } else {
        await prisma.user.update({
          where: { email: normalizedEmail },
          data: {
            name: displayName,
            avatar: user.image || undefined,
            emailVerified: true,
          },
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        (token as any).userId = user.id;
      }

      if ((user as any)?.role) {
        (token as any).role = (user as any).role;
      }

      if (token.email && !(token as any).role) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email.toLowerCase().trim() },
          select: {
            id: true,
            role: true,
          },
        });

        if (dbUser) {
          (token as any).userId = dbUser.id;
          (token as any).role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token as any).userId;
        (session.user as any).role = (token as any).role;
      }

      return session;
    },
  },
};
