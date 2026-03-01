"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Download,
  FileText,
  CheckSquare,
  Square,
  ArrowLeft,
  FileArchive,
} from "lucide-react";
import { toast } from "sonner";

export interface CourtFileItem {
  c_wsmc: string;
  c_wjgs?: string;
  wjlj: string;
  [key: string]: unknown;
}

interface CourtFileListProps {
  files: CourtFileItem[];
  sourceUrl: string;
  onReset: () => void;
}

function getExt(item: CourtFileItem): string {
  const ext = (item.c_wjgs ?? "pdf").toString().replace(/^\./, "");
  return ext || "pdf";
}

function sanitize(name: string): string {
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim().slice(0, 150);
}

function getFileName(item: CourtFileItem, usedNames: Set<string>): string {
  const base = sanitize(item.c_wsmc || "未命名");
  const ext = getExt(item);
  const full = `${base}.${ext}`;
  if (!usedNames.has(full)) {
    usedNames.add(full);
    return full;
  }
  let i = 1;
  while (usedNames.has(`${base}(${i}).${ext}`)) i++;
  const next = `${base}(${i}).${ext}`;
  usedNames.add(next);
  return next;
}

export function CourtFileList({
  files,
  sourceUrl,
  onReset,
}: CourtFileListProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const usedNames = new Set<string>();
  const fileNames = files.map((f) => getFileName(f, usedNames));

  const toggleFile = (url: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === files.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(files.map((f) => f.wjlj)));
    }
  };

  const proxyUrl = (url: string) => `/api/court/proxy?url=${encodeURIComponent(url)}`;

  const downloadOne = (item: CourtFileItem, name: string) => {
    const a = document.createElement("a");
    a.href = proxyUrl(item.wjlj);
    a.download = name;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(`正在下载 ${name}`);
  };

  const downloadSelected = () => {
    if (selected.size === 0) {
      toast.error("请至少选择一份文件");
      return;
    }
    const toDownload = files.filter((f) => selected.has(f.wjlj));
    toDownload.forEach((item, i) => {
      const used = new Set<string>();
      const name = getFileName(item, used);
      setTimeout(() => downloadOne(item, name), i * 300);
    });
    toast.success(`正在下载 ${toDownload.length} 个文件`);
  };

  const downloadAll = () => {
    const used = new Set<string>();
    files.forEach((item, i) => {
      const name = getFileName({ ...item }, used);
      setTimeout(() => downloadOne(item, name), i * 300);
    });
    toast.success(`正在下载全部 ${files.length} 个文件`);
  };

const downloadZip = async () => {
  const used = new Set<string>();
  const list = files.map((item) => {
    const name = getFileName(item, used);
    return {
      name,
      url: proxyUrl(item.wjlj),
    };
  });

  console.log("Sending files:", list);

  // 使用表单提交，避免大文件 fetch 导致的 ERR_FAILED
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "/api/court/zip";
  form.target = "_blank";

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "payload";
  input.value = JSON.stringify({ files: list });
  form.appendChild(input);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);

  toast.success("正在打包并开始下载");
};

  const total = files.length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {total > 0
              ? `共 ${total} 个文件`
              : "未获取到文件"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {total > 0 ? "可勾选后下载或打包为 ZIP" : "请检查链接是否正确"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onReset}>
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          返回
        </Button>
      </div>

      {total > 0 && (
        <>
          <div className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3">
            <button
              onClick={selectAll}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {selected.size === total ? (
                <CheckSquare className="h-4 w-4 text-primary" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              {selected.size === total ? "取消全选" : "全选"}
            </button>
            <div className="flex items-center gap-2">
              {selected.size > 0 && (
                <Button size="sm" onClick={downloadSelected}>
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  下载 ({selected.size})
                </Button>
              )}
              <Button
                size="sm"
                variant={selected.size > 0 ? "outline" : "default"}
                onClick={downloadAll}
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                全部下载
              </Button>
              <Button size="sm" variant="outline" onClick={downloadZip}>
                <FileArchive className="mr-1.5 h-3.5 w-3.5" />
                打包 ZIP
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {files.map((item, i) => (
              <div
                key={item.wjlj}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-colors cursor-pointer ${
                  selected.has(item.wjlj)
                    ? "bg-primary/5 ring-1 ring-primary/20"
                    : "hover:bg-secondary/50"
                }`}
                onClick={() => toggleFile(item.wjlj)}
              >
                <Checkbox
                  checked={selected.has(item.wjlj)}
                  onCheckedChange={() => toggleFile(item.wjlj)}
                  className="shrink-0 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <div className="shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="truncate text-sm font-medium text-foreground block">
                    {fileNames[i]}
                  </span>
                </div>
                <span className="shrink-0 rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                  {getExt(item).toUpperCase()}
                </span>
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadOne(item, fileNames[i]);
                    }}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    title="下载"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {total === 0 && (
        <div className="flex flex-col items-center gap-3 py-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
            <FileText className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-center text-sm text-muted-foreground leading-relaxed">
            未获取到可下载文件，请确认链接是否为法院送达文书页面。
          </p>
          <Button variant="outline" size="sm" onClick={onReset}>
            重新输入
          </Button>
        </div>
      )}
    </div>
  );
}

function formatMMDD(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${m}${day}`;
}
