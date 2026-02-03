import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const AUTH_COOKIE = "authToken";

type JwtPayload = {
  _id?: string;
  userId?: number;
  email?: string;
  exp?: number; // seconds
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Avoid redirect loops
  if (pathname.startsWith("/auth")) return NextResponse.next();

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!token) return redirectToLogin(request);

  let user: JwtPayload;
  try {
    user = jwtDecode<JwtPayload>(token);
  } catch {
    return redirectToLogin(request);
  }

  // Expiry check
  if (user?.exp && Date.now() >= user.exp * 1000) {
    const res = redirectToLogin(request);
    res.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  }

  
  const isProtected =
    pathname === "/user" ||
    pathname.startsWith("/user/") ||
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/");

  if (isProtected) {
    const isValidUser = Boolean(user?.userId || user?._id || user?.email);
    if (isValidUser) return NextResponse.next();
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const callbackUrl = request.nextUrl.pathname + request.nextUrl.search;
  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("callbackUrl", callbackUrl);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/checkout/:path*", "/user/:path*"],
};
