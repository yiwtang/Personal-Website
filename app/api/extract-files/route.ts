import { NextRequest, NextResponse } from "next/server";

interface ExtractedFile {
  name: string;
  url: string;
  size?: string;
  type: string;
}

// Common file extensions to look for
const FILE_EXTENSIONS = [
  // Documents
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv", "rtf", "odt",
  // Images
  "jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "ico", "tiff",
  // Archives
  "zip", "rar", "7z", "tar", "gz", "bz2",
  // Audio
  "mp3", "wav", "ogg", "flac", "aac", "wma",
  // Video
  "mp4", "avi", "mkv", "mov", "wmv", "flv", "webm",
  // Code / Data
  "json", "xml", "yaml", "yml", "html", "css", "js", "ts",
  // Other
  "apk", "exe", "dmg", "iso", "bin",
];

function getFileType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const typeMap: Record<string, string> = {
    pdf: "PDF", doc: "Word", docx: "Word", xls: "Excel", xlsx: "Excel",
    ppt: "PPT", pptx: "PPT", txt: "Text", csv: "CSV", rtf: "RTF", odt: "Doc",
    jpg: "Image", jpeg: "Image", png: "Image", gif: "Image", bmp: "Image",
    svg: "SVG", webp: "Image", ico: "Icon", tiff: "Image",
    zip: "Archive", rar: "Archive", "7z": "Archive", tar: "Archive",
    gz: "Archive", bz2: "Archive",
    mp3: "Audio", wav: "Audio", ogg: "Audio", flac: "Audio", aac: "Audio", wma: "Audio",
    mp4: "Video", avi: "Video", mkv: "Video", mov: "Video", wmv: "Video",
    flv: "Video", webm: "Video",
    json: "JSON", xml: "XML", yaml: "YAML", yml: "YAML",
    html: "HTML", css: "CSS", js: "JS", ts: "TS",
    apk: "APK", exe: "EXE", dmg: "DMG", iso: "ISO", bin: "Binary",
  };
  return typeMap[ext] || ext.toUpperCase();
}

function extractFilesFromHtml(html: string, baseUrl: string): ExtractedFile[] {
  const files: ExtractedFile[] = [];
  const seen = new Set<string>();

  // Match href and src attributes
  const linkRegex = /(?:href|src)\s*=\s*["']([^"']+)["']/gi;
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const rawUrl = match[1];

    // Check if URL points to a file
    const hasFileExt = FILE_EXTENSIONS.some((ext) => {
      const pattern = new RegExp(`\\.${ext}(\\?.*)?$`, "i");
      return pattern.test(rawUrl);
    });

    if (hasFileExt) {
      try {
        const absoluteUrl = new URL(rawUrl, baseUrl).href;
        if (!seen.has(absoluteUrl)) {
          seen.add(absoluteUrl);
          const filename = decodeURIComponent(
            absoluteUrl.split("/").pop()?.split("?")[0] || "unknown"
          );
          files.push({
            name: filename,
            url: absoluteUrl,
            type: getFileType(filename),
          });
        }
      } catch {
        // Skip invalid URLs
      }
    }
  }

  // Also look for plain text URLs ending in file extensions
  const plainUrlRegex = /https?:\/\/[^\s"'<>]+/gi;
  while ((match = plainUrlRegex.exec(html)) !== null) {
    const rawUrl = match[0];
    const hasFileExt = FILE_EXTENSIONS.some((ext) => {
      const pattern = new RegExp(`\\.${ext}(\\?.*)?$`, "i");
      return pattern.test(rawUrl);
    });

    if (hasFileExt && !seen.has(rawUrl)) {
      seen.add(rawUrl);
      const filename = decodeURIComponent(
        rawUrl.split("/").pop()?.split("?")[0] || "unknown"
      );
      files.push({
        name: filename,
        url: rawUrl,
        type: getFileType(filename),
      });
    }
  }

  return files;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Invalid URL provided" },
        { status: 400 }
      );
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Fetch the page
    const response = await fetch(parsedUrl.href, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
        { status: 502 }
      );
    }

    const contentType = response.headers.get("content-type") || "";

    // If the URL itself is a file, return it directly
    const isDirectFile = FILE_EXTENSIONS.some((ext) => {
      const pattern = new RegExp(`\\.${ext}(\\?.*)?$`, "i");
      return pattern.test(parsedUrl.pathname);
    });

    if (isDirectFile) {
      const filename = decodeURIComponent(
        parsedUrl.pathname.split("/").pop() || "unknown"
      );
      const contentLength = response.headers.get("content-length");
      return NextResponse.json({
        files: [
          {
            name: filename,
            url: parsedUrl.href,
            size: contentLength ? formatBytes(parseInt(contentLength)) : undefined,
            type: getFileType(filename),
          },
        ],
        pageTitle: filename,
      });
    }

    // Parse HTML for files
    if (contentType.includes("text/html") || contentType.includes("text/plain")) {
      const html = await response.text();

      // Extract page title
      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
      const pageTitle = titleMatch ? titleMatch[1].trim() : parsedUrl.hostname;

      const files = extractFilesFromHtml(html, parsedUrl.href);

      return NextResponse.json({ files, pageTitle });
    }

    return NextResponse.json({
      files: [],
      pageTitle: parsedUrl.hostname,
      message: "The URL does not point to an HTML page with extractable files.",
    });
  } catch (error) {
    console.error("Extract files error:", error);
    return NextResponse.json(
      { error: "Failed to process the URL. Please check the URL and try again." },
      { status: 500 }
    );
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
