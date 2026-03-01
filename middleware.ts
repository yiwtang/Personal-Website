import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").toLowerCase();
  const url = request.nextUrl.clone();

  if (host.startsWith("download.")) {
    if (!url.pathname.startsWith("/download")) {
      url.pathname = `/download${url.pathname === "/" ? "" : url.pathname}`;
    }
    return NextResponse.rewrite(url);
  }

  if (host.startsWith("www.")) {
    if (url.pathname.startsWith("/download")) {
      url.pathname = "/";
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api|public).*)"],
};
