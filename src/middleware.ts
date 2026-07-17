import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    console.warn("MIDDLEWARE EXECUTION TRACE:", {
      file: "src/middleware.ts",
      function: "middleware",
      pathname: path,
      tokenRole: token?.role,
      hasToken: !!token,
      cookieNames: req.cookies.getAll().map(c => c.name),
      hasSecretEnv: !!process.env.NEXTAUTH_SECRET
    });

    // Redirect client portal logins if trying to access dashboard/admin
    if (token?.role === "CLIENT" && !path.startsWith("/client-portal")) {
      console.warn("MIDDLEWARE REDIRECT TRIGGERED: Redirecting CLIENT role to /client-portal from line 22");
      return NextResponse.redirect(new URL("/client-portal", req.url));
    }
    
    // Redirect team logins if trying to access client portal
    if (token?.role !== "CLIENT" && path.startsWith("/client-portal")) {
      console.warn("MIDDLEWARE REDIRECT TRIGGERED: Redirecting non-client role to /dashboard from line 28");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        console.warn("MIDDLEWARE AUTHORIZATION CHECK:", {
          file: "src/middleware.ts",
          function: "authorized callback",
          pathname: req.nextUrl.pathname,
          hasToken: !!token,
          tokenContent: token ? { id: token.id, role: token.role } : null,
          cookieNames: req.cookies.getAll().map(c => c.name),
          hasSecretEnv: !!process.env.NEXTAUTH_SECRET
        });
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/leads/:path*",
    "/clients/:path*",
    "/orders/:path*",
    "/tasks/:path*",
    "/payments/:path*",
    "/followups/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/client-portal/:path*"
  ],
};
