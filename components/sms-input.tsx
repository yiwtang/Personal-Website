"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search, Loader2, MessageSquareText } from "lucide-react";

interface SmsInputProps {
  onExtract: (urls: string[]) => void;
  isLoading: boolean;
}

function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s<>"')\]]+/gi;
  const matches = text.match(urlRegex);
  if (!matches) return [];
  // Deduplicate
  return [...new Set(matches)];
}

export function SmsInput({ onExtract, isLoading }: SmsInputProps) {
  const [text, setText] = useState("");
  const urls = extractUrls(text);

  const handleSubmit = () => {
    if (urls.length > 0) {
      onExtract(urls);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <MessageSquareText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Paste your message
          </h2>
          <p className="text-sm text-muted-foreground">
            URLs will be automatically detected
          </p>
        </div>
      </div>

      <div className="relative">
        <Textarea
          placeholder={"Paste your SMS or message here...\ne.g. Please download files from https://example.com/files"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[140px] resize-none border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/40"
          disabled={isLoading}
        />
      </div>

      {urls.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {urls.length} URL{urls.length > 1 ? "s" : ""} detected
          </p>
          <div className="flex flex-col gap-1.5">
            {urls.map((url, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-2"
              >
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="truncate text-sm font-mono text-foreground/80">
                  {url}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={urls.length === 0 || isLoading}
        className="w-full font-medium"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Extract Files
          </>
        )}
      </Button>
    </div>
  );
}
