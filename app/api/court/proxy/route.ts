import { NextRequest, NextResponse } from "next/server";

/**
 * 代理下载法院文书文件，避免跨域与 Referer 限制
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "缺少 url 参数" }, { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: "无效的 URL" }, { status: 400 });
  }

  try {
    const res = await fetch(targetUrl.href, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: request.headers.get("referer") ?? targetUrl.origin + "/",
      },
      signal: AbortSignal.timeout(60000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `上游返回 ${res.status}` },
        { status: 502 }
      );
    }

    const contentType =
      res.headers.get("content-type") ?? "application/octet-stream";
    const contentDisposition = res.headers.get("content-disposition");
    const body = await res.arrayBuffer();

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", "private, max-age=3600");
    if (contentDisposition) {
      headers.set("Content-Disposition", contentDisposition);
    }

    return new NextResponse(body, { status: 200, headers });
  } catch (err) {
    console.error("Court proxy error:", err);
    return NextResponse.json(
      { error: "下载失败" },
      { status: 500 }
    );
  }
}
