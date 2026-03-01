"use client";

import { useEffect, useState } from "react";

const heroImages = [
  "/hero-home1.jpg",
  "/hero-home2.jpg",
  "/hero-home3.jpg",
  "/hero-home4.jpg",
  "/hero-home5.jpg",
];

type TabKey = "record" | "lab";

export default function Home() {
  const [tab, setTab] = useState<TabKey>("record");
  const [heroImage, setHeroImage] = useState(heroImages[0]);

  useEffect(() => {
    const idx = Math.floor(Math.random() * heroImages.length);
    setHeroImage(heroImages[idx]);
  }, []);

  return (
    <main className="min-h-screen bg-black text-neutral-200">
      <section className="relative h-[52vh] w-full overflow-hidden">
        <img
          src={heroImage}
          alt="hero"
          className="absolute inset-0 h-full w-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-end px-4 pb-12 md:px-10">
          <h1 className="text-[clamp(3.5rem,6.5vw,4.5rem)] font-light leading-[1.5] tracking-tight text-white">
            even
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-[1.6] text-neutral-300">
            生活、法律、科技与审美的交汇处。
          </p>
        </div>
      </section>

      <div className="mx-auto mt-16 max-w-5xl px-4 md:px-10">
        <div className="flex gap-12 border-b border-neutral-800">
          {[
            { key: "record" as const, label: "记录" },
            { key: "lab" as const, label: "实验" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`pb-4 text-base uppercase tracking-[0.35em] transition ${
                tab === item.key
                  ? "border-b border-white text-white"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-4 py-20 md:px-10">
        {tab === "record" ? <RecordList /> : <LabList />}
      </section>

      <footer className="border-t border-neutral-800 py-12 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 text-base md:px-10">
          <div className="inline-flex items-center gap-2 text-base leading-[1.7] text-white">
            <span>作者：</span>
            <span className="flex h-7 w-7 overflow-hidden rounded-full ring-1 ring-white/20">
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
        </div>
      </footer>
    </main>
  );
}

function RecordList() {
  const posts = [
    {
      title: "为什么我更愿意做小工具",
      excerpt:
        "关于克制、长期主义，以及为什么我不再执着于做‘平台型产品’。",
      date: "2026 · 02",
    },
    {
      title: "一个偏安静的专注系统",
      excerpt:
        "记录我如何设计一个不依赖意志力的工作与写作流程。",
      date: "2025 · 11",
    },
  ];

  return (
    <div className="space-y-20">
      {posts.map((post, i) => (
        <article key={i} className="max-w-2xl">
          <h2 className="text-4xl font-light leading-[1.35] text-white">
            {post.title}
          </h2>
          <p className="mt-6 text-lg leading-[1.7] text-neutral-300">
            {post.excerpt}
          </p>
          <span className="mt-6 block text-sm uppercase tracking-[0.3em] text-neutral-500">
            {post.date}
          </span>
        </article>
      ))}
    </div>
  );
}

function LabList() {
  const tools = [
    {
      name: "法院文书批量下载",
      desc: "从法院短信提取文书，批量下载。",
      href: "https://download.ytang.xyz/",
      preview: "/tool-preview-1.jpg",
    },
    {
      name: "专注计时器",
      desc: "一个不打扰人的极简专注计时工具。",
      preview: "/tool-preview-2.jpg",
    },
  ];

  return (
    <div className="space-y-20">
      {tools.map((tool, i) => (
        <div key={i}>
          <h3 className="text-3xl font-light text-white">
            {tool.href ? (
              <a
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {tool.name}
              </a>
            ) : (
              tool.name
            )}
          </h3>
          <p className="mt-4 max-w-xl text-lg leading-[1.7] text-neutral-300">
            {tool.desc}
          </p>
          <div className="mt-6 max-w-xl overflow-hidden rounded-2xl border border-neutral-800">
            <img
              src={tool.preview}
              alt="工具预览"
              className="h-48 w-full object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
