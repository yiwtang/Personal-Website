"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search, Loader2, MessageSquareText } from "lucide-react";

function extractUrl(text: string): string | null {
  const match = text.match(
    /(https?:\/\/[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|])/
  );
  return match ? match[1] : null;
}

interface CourtInputProps {
  onFetch: (url: string) => void;
  isLoading: boolean;
}

export function CourtInput({ onFetch, isLoading }: CourtInputProps) {
  const [text, setText] = useState("");
  const url = extractUrl(text);

  const handleSubmit = () => {
    if (url) onFetch(url);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <MessageSquareText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            粘贴网址或短信内容
          </h2>
          <p className="text-sm text-muted-foreground">
            将自动识别其中的法院文书链接
          </p>
        </div>
      </div>

      <div className="relative">
        <Textarea
          placeholder={
            "粘贴短信或网址...\n例如：请点击 https://xxx.gov.cn/...#?qdbh=xxx&sdbh=xxx 下载文书"
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[140px] resize-none border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/40"
          disabled={isLoading}
        />
      </div>

      {url && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            已识别链接
          </p>
          <div className="flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-2">
            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span className="truncate text-sm font-mono text-foreground/80">
              {url}
            </span>
          </div>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!url || isLoading}
        className="w-full font-medium"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            正在获取文件列表...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            获取文件列表
          </>
        )}
      </Button>
    </div>
  );
}
