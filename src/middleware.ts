import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    console.error("MIDDLEWARE FUNCTION ENTERED");
    console.error("pathname:", path);
    console.error("token:", JSON.stringify(token));
    console.error("hasToken:", !!token);

    // Redirect client portal logins if trying to access dashboard/admin
    if (token?.role === "CLIENT" && !path.startsWith("/client-portal")) {
      console.error("REDIRECTING");
      console.error("from:", path);
      console.error("to:", "/client-portal");
      console.error("reason:", "token.role is CLIENT and path does not start with /client-portal");
      return NextResponse.redirect(new URL("/client-portal", req.url));
    }
    
    // Redirect team logins if trying to access client portal
    if (token?.role !== "CLIENT" && path.startsWith("/client-portal")) {
      console.error("REDIRECTING");
      console.error("from:", path);
      console.error("to:", "/dashboard");
      console.error("reason:", "token.role is not CLIENT and path starts with /client-portal");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    console.error("MIDDLEWARE PASSED: No redirect triggered for", path);
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        console.error("AUTHORIZED CALLBACK");
        console.error("pathname:", req.nextUrl.pathname);
        console.error("token:", JSON.stringify(token));
        console.error("authorized:", !!token);
        if (!token) {
          console.error("REDIRECTING");
          console.error("from:", req.nextUrl.pathname);
          console.error("to:", "/login");
          console.error("reason:", "token is null/undefined, withAuth will redirect to signIn page");
        }
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
