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
        console.log("3. Credentials received (Email):", credentials?.email);
        console.log("4. authorize() entered");
        if (!credentials?.email || !credentials?.password) {
          console.warn("⚠️ Missing email or password credentials");
          return null;
        }
        try {
          console.log("5. User lookup started");
          // Direct Prisma Query
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });
          console.log("6. User lookup completed. User found:", !!user);

          if (user) {
            console.log("7. Password verification started");
            const isMatch = user.password === credentials.password;
            console.log("8. Password verification result:", isMatch);
            if (isMatch) {
              console.log("9. User returned from authorize() successfully");
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.profileImage
              };
            } else {
              console.warn("⚠️ Password mismatch for user:", credentials.email);
            }
          }

          // Fallback to local JSON DB in local dev
          if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
            console.log("ℹ️ Checking local mock database fallback...");
            const fallback = require('./dbFallback');
            const db = fallback.readDb();
            const mockUser = db.users.find(
              (u: any) => u.email === credentials.email && u.password === credentials.password
            );
            if (mockUser) {
              console.log("9. Mock user returned from authorize() successfully");
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
          console.error("❌ Authorize error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      console.log("10. JWT callback entered. User present:", !!user);
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
      }
      console.log("11. JWT callback completed. Token role:", token.role);
      return token;
    },
    async session({ session, token }: any) {
      console.log("12. Session callback entered. Token present:", !!token);
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.image;
      }
      console.log("13. Session callback completed. Session user role:", session.user?.role);
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
