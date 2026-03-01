import type { NextApiRequest, NextApiResponse } from 'next';
import archiver from 'archiver';

const MMDD = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${m}${day}`;
};

function sanitize(s: string): string {
  return s.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim().slice(0, 150);
}

// 关键修复：从代理 URL 提取真实 URL，避免重复解码导致的 URIError
function extractRealUrl(proxyUrl: string, baseUrl: string): string | null {
  try {
    // 同时支持绝对/相对 URL
    const urlObj = new URL(proxyUrl, baseUrl);
    const isProxyPath = urlObj.pathname === '/api/court/proxy';

    if (isProxyPath) {
      const realUrl = urlObj.searchParams.get('url');
      return realUrl || null;
    }

    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      return urlObj.href;
    }
  } catch (e) {
    console.error('[zip] Failed to parse URL:', proxyUrl, e);
  }

  return null;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[zip] Request received, method:', req.method);

  if (req.method !== 'POST') {
    console.log('[zip] Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 构建基础 URL 用于解析相对路径
  const rawProto = req.headers['x-forwarded-proto'];
  const protocol = (Array.isArray(rawProto) ? rawProto[0] : rawProto)?.split(',')[0] || 'http';
  const rawHost = req.headers['x-forwarded-host'] ?? req.headers.host;
  const host = Array.isArray(rawHost) ? rawHost[0] : rawHost;
  const baseUrl = `${protocol}://${host}`;

  // 手动解析 body：支持 application/json 和 form payload
  let body = {};
  try {
    body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        if (!data) return resolve({});
        try {
          return resolve(JSON.parse(data));
        } catch {
          try {
            const params = new URLSearchParams(data);
            const payload = params.get('payload');
            if (payload) return resolve(JSON.parse(payload));
          } catch (e) {
            return reject(e);
          }
          return reject(new Error('Unsupported body format'));
        }
      });
      req.on('error', reject);
    });
    console.log('[zip] Parsed body:', JSON.stringify(body));
  } catch (e) {
    console.log('[zip] Parse error:', e);
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const files = (body as any)?.files as Array<{ name: string; url: string }> | undefined;
  console.log('[zip] Files:', files);

  if (!Array.isArray(files) || files.length === 0) {
    console.log('[zip] No files provided');
    return res.status(400).json({ error: "请提供 files 数组 (name, url)" });
  }

  const zipFilename = `法院送达文件_${MMDD()}.zip`;
  console.log('[zip] Starting zip for', files.length, 'files');
  
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(zipFilename)}`);

  const archive = archiver('zip', { zlib: { level: 6 } });

  archive.pipe(res);

  // 等待所有文件下载完成并确保响应结束
  await new Promise<void>((resolve, reject) => {
    let resolved = false;
    const done = () => {
      if (resolved) return;
      resolved = true;
      resolve();
    };

    archive.on('error', (err) => {
      console.log('[zip] Archive error:', err);
      if (!resolved) reject(err);
    });

    archive.on('warning', (err) => {
      console.log('[zip] Archive warning:', err);
    });

    res.on('close', () => {
      console.log('[zip] Response closed');
      done();
    });

    res.on('finish', () => {
      console.log('[zip] Response finished');
      done();
    });

    const downloadFile = async (f: { name: string; url: string }) => {
      const name = f?.name ?? "未命名";
      const proxyUrl = f?.url;
      if (!proxyUrl) return;
      
      // 关键修复：提取真实 URL
      const realUrl = extractRealUrl(proxyUrl, baseUrl);
      if (!realUrl) {
        console.log('[zip] Invalid URL:', proxyUrl);
        return;
      }
      
      console.log('[zip] Real URL:', realUrl);
      
      const base = sanitize(name.replace(/\.[^.]+$/, "") || "未命名");
      const ext = (name.match(/\.([^.]+)$/)?.[1] ?? "pdf").toLowerCase();
      const filename = getUniqueName(base, ext);

      try {
        console.log('[zip] Fetching:', realUrl);
        const response = await fetch(realUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            // 关键修复：使用真实 URL 的 origin 作为 Referer
            "Referer": new URL(realUrl).origin + "/",
          },
          signal: AbortSignal.timeout(60000),
        });
        console.log('[zip] Fetch status:', response.status);
        if (response.ok) {
          const buffer = Buffer.from(await response.arrayBuffer());
          archive.append(buffer, { name: filename });
          console.log('[zip] Added:', filename, `(${(buffer.length / 1024).toFixed(1)} KB)`);
        } else {
          console.log('[zip] Failed to fetch:', response.status, realUrl);
        }
      } catch (e) {
        console.log('[zip] Fetch error:', e);
      }
    };

    const usedNames = new Set<string>();
    const getUniqueName = (base: string, ext: string) => {
      const full = `${base}.${ext}`;
      if (!usedNames.has(full)) {
        usedNames.add(full);
        return full;
      }
      let i = 1;
      let next = `${base}(${i}).${ext}`;
      while (usedNames.has(next)) {
        i++;
        next = `${base}(${i}).${ext}`;
      }
      usedNames.add(next);
      return next;
    };

    // 下载所有文件，然后 finalize
    (async () => {
      try {
        for (const f of files) {
          await downloadFile(f);
        }
        console.log('[zip] All files downloaded, finalizing...');
        await archive.finalize();
        console.log('[zip] Finalize called');
      } catch (e) {
        console.log('[zip] Error during download:', e);
        reject(e);
      }
    })();
  });
}
