import { Scale } from "lucide-react";
import type { ReactNode } from "react";

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function LegalLayout({ title, subtitle, children }: LegalLayoutProps) {
  return (
    <main className="min-h-screen bg-black text-neutral-200">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 py-8 md:px-10 md:py-14">
        <header className="flex flex-col gap-6 text-left">
          <div className="flex items-center justify-between gap-6">
            <div className="inline-flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/60">
                <Scale className="h-6 w-6 text-neutral-200" />
              </div>
              <span className="text-xs uppercase tracking-[0.35em] text-neutral-500">
                Legal Tools
              </span>
            </div>
            <a
              href="https://ytang.xyz/"
              className="rounded-full border border-neutral-800 px-4 py-2 text-xs uppercase tracking-[0.3em] text-neutral-200 transition-colors hover:border-neutral-600 hover:text-white"
            >
              返回主页
            </a>
          </div>
          <div>
            <h1 className="text-[clamp(3rem,6vw,4rem)] font-light leading-[1.5] tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-[1.6] text-neutral-500">
              {subtitle}
            </p>
          </div>
        </header>

        <div className="relative">
          <div className="absolute -inset-[1px] rounded-2xl bg-neutral-800/50 opacity-50" />
          <div className="relative overflow-hidden rounded-2xl border border-neutral-900 bg-[#080808] shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-900 bg-neutral-900/30 px-6 py-4">
              <div className="flex gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-neutral-800" />
                <div className="h-2.5 w-2.5 rounded-full bg-neutral-800" />
                <div className="h-2.5 w-2.5 rounded-full bg-neutral-800" />
              </div>
            </div>
            <div className="p-6 md:p-8">{children}</div>
          </div>
        </div>

        <footer className="grid gap-6 border-t border-neutral-900 pt-8 text-base text-white md:grid-cols-[1fr,1.2fr]">
          <div className="grid gap-2">
            <span className="text-base uppercase tracking-[0.3em] text-white">
              说明
            </span>
            <span className="leading-[1.7] text-white">
              文件从法院系统获取，本站不存储任何文书内容。
            </span>
          </div>
          <div className="grid grid-rows-[auto,auto] gap-4">
            <div className="inline-flex items-center gap-2 text-base leading-[1.7] text-white">
              <span>作者：</span>
              <span className="flex h-6 w-6 overflow-hidden rounded-full ring-1 ring-white/20">
                <img
                  src="/avatar.jpg"
                  alt="作者头像"
                  className="h-full w-full object-cover"
                />
              </span>
              <a
                href="https://xhslink.com/m/6cJBmAsJnKo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline"
              >
                @even在开庭
              </a>
            </div>
            <div className="group relative inline-flex items-center gap-2 text-base leading-[1.7] text-white">
              <span>投喂作者☕</span>
              <div className="absolute left-0 top-full z-20 hidden pt-2 group-hover:block">
                <img
                  src="https://ytang.xyz/thanks.jpg"
                  alt="收款码"
                  className="w-60 max-w-none rounded-xl border border-white/10 bg-white/5 object-contain shadow-lg"
                />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
