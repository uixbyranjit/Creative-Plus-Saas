import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Redirect client portal logins if trying to access dashboard/admin
    if (token?.role === "CLIENT" && !path.startsWith("/client-portal")) {
      return NextResponse.redirect(new URL("/client-portal", req.url));
    }
    
    // Redirect team logins if trying to access client portal
    if (token?.role !== "CLIENT" && path.startsWith("/client-portal")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
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
