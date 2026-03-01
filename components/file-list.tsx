"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Download,
  FileText,
  FileImage,
  FileArchive,
  FileAudio,
  FileVideo,
  FileCode,
  File,
  CheckSquare,
  Square,
  ExternalLink,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

export interface ExtractedFile {
  name: string;
  url: string;
  size?: string;
  type: string;
}

interface UrlResult {
  url: string;
  pageTitle: string;
  files: ExtractedFile[];
  error?: string;
}

interface FileListProps {
  results: UrlResult[];
  onReset: () => void;
}

function getFileIcon(type: string) {
  const iconClass = "h-5 w-5";
  switch (type) {
    case "PDF":
    case "Word":
    case "Text":
    case "CSV":
    case "RTF":
    case "Doc":
    case "Excel":
    case "PPT":
      return <FileText className={`${iconClass} text-primary`} />;
    case "Image":
    case "SVG":
    case "Icon":
      return <FileImage className={`${iconClass} text-emerald-400`} />;
    case "Archive":
      return <FileArchive className={`${iconClass} text-amber-400`} />;
    case "Audio":
      return <FileAudio className={`${iconClass} text-sky-400`} />;
    case "Video":
      return <FileVideo className={`${iconClass} text-rose-400`} />;
    case "JSON":
    case "XML":
    case "YAML":
    case "HTML":
    case "CSS":
    case "JS":
    case "TS":
      return <FileCode className={`${iconClass} text-teal-400`} />;
    default:
      return <File className={`${iconClass} text-muted-foreground`} />;
  }
}

function getTypeBadgeColor(type: string): string {
  switch (type) {
    case "PDF":
    case "Word":
    case "Text":
    case "CSV":
    case "RTF":
    case "Doc":
    case "Excel":
    case "PPT":
      return "bg-primary/15 text-primary";
    case "Image":
    case "SVG":
    case "Icon":
      return "bg-emerald-500/15 text-emerald-400";
    case "Archive":
      return "bg-amber-500/15 text-amber-400";
    case "Audio":
      return "bg-sky-500/15 text-sky-400";
    case "Video":
      return "bg-rose-500/15 text-rose-400";
    case "JSON":
    case "XML":
    case "YAML":
    case "HTML":
    case "CSS":
    case "JS":
    case "TS":
      return "bg-teal-500/15 text-teal-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function FileList({ results, onReset }: FileListProps) {
  const allFiles = results.flatMap((r) =>
    r.files.map((f) => ({ ...f, sourceUrl: r.url }))
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleFile = (url: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) {
        next.delete(url);
      } else {
        next.add(url);
      }
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === allFiles.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allFiles.map((f) => f.url)));
    }
  };

  const downloadFile = (url: string, name: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadSelected = () => {
    if (selected.size === 0) {
      toast.error("Please select at least one file");
      return;
    }
    const filesToDownload = allFiles.filter((f) => selected.has(f.url));
    filesToDownload.forEach((f, i) => {
      setTimeout(() => downloadFile(f.url, f.name), i * 300);
    });
    toast.success(`Downloading ${filesToDownload.length} file(s)`);
  };

  const downloadAll = () => {
    allFiles.forEach((f, i) => {
      setTimeout(() => downloadFile(f.url, f.name), i * 300);
    });
    toast.success(`Downloading all ${allFiles.length} file(s)`);
  };

  const totalFiles = allFiles.length;
  const hasErrors = results.some((r) => r.error);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {totalFiles > 0
              ? `${totalFiles} file${totalFiles !== 1 ? "s" : ""} found`
              : "Scan complete"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {totalFiles > 0
              ? "Select files to download"
              : "No downloadable files were found"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onReset}>
          New Scan
        </Button>
      </div>

      {/* URL Sources */}
      {results.map((result, idx) => (
        <div key={idx} className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe className="h-3 w-3" />
            <span className="truncate">{result.pageTitle}</span>
            <span className="text-border">|</span>
            <span>
              {result.files.length} file{result.files.length !== 1 ? "s" : ""}
            </span>
          </div>
          {result.error && (
            <p className="text-xs text-destructive">{result.error}</p>
          )}
        </div>
      ))}

      {totalFiles > 0 && (
        <>
          {/* Actions bar */}
          <div className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3">
            <button
              onClick={selectAll}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {selected.size === allFiles.length ? (
                <CheckSquare className="h-4 w-4 text-primary" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              {selected.size === allFiles.length
                ? "Deselect all"
                : "Select all"}
            </button>
            <div className="flex items-center gap-2">
              {selected.size > 0 && (
                <Button size="sm" onClick={downloadSelected}>
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Download ({selected.size})
                </Button>
              )}
              <Button
                size="sm"
                variant={selected.size > 0 ? "outline" : "default"}
                onClick={downloadAll}
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                All
              </Button>
            </div>
          </div>

          {/* File list */}
          <div className="flex flex-col gap-1">
            {allFiles.map((file, i) => (
              <div
                key={i}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-colors cursor-pointer ${
                  selected.has(file.url)
                    ? "bg-primary/5 ring-1 ring-primary/20"
                    : "hover:bg-secondary/50"
                }`}
                onClick={() => toggleFile(file.url)}
              >
                <Checkbox
                  checked={selected.has(file.url)}
                  onCheckedChange={() => toggleFile(file.url)}
                  className="shrink-0 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />

                <div className="shrink-0">{getFileIcon(file.type)}</div>

                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium text-foreground">
                    {file.name}
                  </span>
                  {file.size && (
                    <span className="text-xs text-muted-foreground">
                      {file.size}
                    </span>
                  )}
                </div>

                <span
                  className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${getTypeBadgeColor(file.type)}`}
                >
                  {file.type}
                </span>

                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadFile(file.url, file.name);
                      toast.success(`Downloading ${file.name}`);
                    }}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    title="Open in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {totalFiles === 0 && !hasErrors && (
        <div className="flex flex-col items-center gap-3 py-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
            <FileText className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-center text-sm text-muted-foreground leading-relaxed">
            No downloadable files were found on the page.
            <br />
            Try a different URL or message.
          </p>
          <Button variant="outline" size="sm" onClick={onReset} className="mt-2">
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
