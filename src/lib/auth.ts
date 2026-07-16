import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@creativeplus.com" },
        password: { label: "Password", type: "password", placeholder: "password123" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          // Direct Prisma Query
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (user && user.password === credentials.password) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              image: user.profileImage
            };
          }

          // Fallback to local JSON DB in local dev
          if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
            const fallback = require('./dbFallback');
            const db = fallback.readDb();
            const mockUser = db.users.find(
              (u: any) => u.email === credentials.email && u.password === credentials.password
            );
            if (mockUser) {
              return {
                id: mockUser.id,
                name: mockUser.name,
                email: mockUser.email,
                role: mockUser.role,
                image: mockUser.profileImage
              };
            }
          }

          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.image;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET || 'creative-plus-secret-key-123456789'
};
