"use client";

import { useState, useCallback } from "react";
import { CourtInput } from "@/components/court-input";
import {
  CourtFileList,
  type CourtFileItem,
} from "@/components/court-file-list";
import { LegalLayout } from "@/components/legal-layout";

type AppState = "input" | "loading" | "results";

export default function Home() {
  const [state, setState] = useState<AppState>("input");
  const [files, setFiles] = useState<CourtFileItem[]>([]);
  const [sourceUrl, setSourceUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFetch = useCallback(async (url: string) => {
    setState("loading");
    setFiles([]);
    setError(null);
    setSourceUrl(url);

    try {
      const res = await fetch("/api/court/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "获取文件列表失败");
        setState("input");
        return;
      }

      setFiles(data.files ?? []);
      setState("results");
    } catch {
      setError("网络错误，请重试");
      setState("input");
    }
  }, []);

  const handleReset = useCallback(() => {
    setState("input");
    setFiles([]);
    setSourceUrl("");
    setError(null);
  }, []);

  return (
    <LegalLayout
      title="法院文书批量下载工具"
      subtitle="粘贴短信或链接，获取送达文书列表并下载（适用于法院“一张网”短信）"
    >
          {error && (
        <div className="mb-4 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          {state === "input" && (
            <CourtInput onFetch={handleFetch} isLoading={false} />
          )}

          {state === "loading" && (
            <CourtInput onFetch={handleFetch} isLoading={true} />
          )}

          {state === "results" && (
            <CourtFileList
              files={files}
              sourceUrl={sourceUrl}
              onReset={handleReset}
            />
          )}
    </LegalLayout>
  );
}
