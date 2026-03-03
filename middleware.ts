import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").toLowerCase();
  const url = request.nextUrl.clone();

  // 排除静态文件请求（public 目录）
  const isStaticFile = url.pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|avif)$/i);

  if (host.startsWith("download.") && !isStaticFile) {
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
