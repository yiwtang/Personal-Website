import { NextRequest, NextResponse } from "next/server";

const API_PATH =
  "/yzw/yzw-zxfw-sdfw/api/v1/sdfw/getWsListBySdbhNew";

function extractUrl(text: string): string {
  const match = text.match(
    /(https?:\/\/[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|])/
  );
  if (match) return match[1];
  throw new Error("未找到有效的网址。");
}

function parseParamsFromUrl(inputUrl: string): Record<string, string> {
  const parsed = new URL(inputUrl);
  const fragment = parsed.hash.slice(1);
  const fragmentQuery =
    fragment.includes("?") ? fragment.slice(fragment.indexOf("?") + 1) : "";
  const queryPart = parsed.search ? parsed.search.slice(1) : "";
  const merged = new URLSearchParams(
    [fragmentQuery, queryPart].filter(Boolean).join("&")
  );
  return {
    qdbh: (merged.get("qdbh") ?? "").trim(),
    sdbh: (merged.get("sdbh") ?? "").trim(),
    sdsin: (merged.get("sdsin") ?? "").trim(),
    mm: (merged.get("mm") ?? "").trim(),
  };
}

export interface CourtFileItem {
  c_wsmc: string;
  c_wjgs?: string;
  wjlj: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const urlInput = typeof body?.url === "string" ? body.url.trim() : "";

    if (!urlInput) {
      return NextResponse.json(
        { error: "请提供网址或短信内容。" },
        { status: 400 }
      );
    }

    const actualUrl = extractUrl(urlInput);
    const payload = parseParamsFromUrl(actualUrl);
    const parsed = new URL(actualUrl);
    const baseUrl = `${parsed.protocol}//${parsed.host}`;
    const apiUrl = `${baseUrl}${API_PATH}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        Referer: actualUrl,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `请求失败: ${response.status} ${response.statusText}` },
        { status: 502 }
      );
    }

    const data = (await response.json()) as {
      code?: number;
      message?: string;
      data?: CourtFileItem[];
    };

    if (data.code !== 200) {
      return NextResponse.json(
        { error: data.message ?? "接口错误" },
        { status: 502 }
      );
    }

    const files = data.data ?? [];
    return NextResponse.json({
      files,
      pageTitle: "法院送达文件列表",
      sourceUrl: actualUrl,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "获取文件列表失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
