"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const heroImages = [
  "/hero-home1.jpg",
  "/hero-home2.jpg",
  "/hero-home3.jpg",
  "/hero-home4.jpg",
  "/hero-home5.jpg",
];

const getRandomHeroImage = () =>
  heroImages[Math.floor(Math.random() * heroImages.length)];

type TabKey = "record" | "lab" | "question" | "me";

const tabs = [
  { key: "record" as const, label: "记录" },
  { key: "lab" as const, label: "实验" },
  { key: "question" as const, label: "问题" },
  { key: "me" as const, label: "我" },
];

export default function Home() {
  const [tab, setTab] = useState<TabKey>("record");
  const [heroImage, setHeroImage] = useState(heroImages[0]);

  useEffect(() => {
    setHeroImage(getRandomHeroImage());
  }, []);

  useEffect(() => {
    const nextTab = new URLSearchParams(window.location.search).get("tab");
    if (
      nextTab === "record" ||
      nextTab === "lab" ||
      nextTab === "question" ||
      nextTab === "me"
    ) {
      setTab(nextTab);
    }
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
        <div className="flex flex-wrap gap-12 border-b border-neutral-800">
          {tabs.map((item) => (
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
        {tab === "record" ? <RecordList /> : null}
        {tab === "lab" ? <LabList /> : null}
        {tab === "question" ? <QuestionList /> : null}
        {tab === "me" ? <MeIntro /> : null}
      </section>
    </main>
  );
}

function RecordList() {
  const posts = [
    {
      title: "把复杂流程变成简单按钮",
      excerpt: "一篇图文记录：我如何重新梳理一套法院文书下载流程。",
      date: "2026 · 03",
      href: "/blog/first",
    },
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
          <h2 className="text-3xl font-light leading-[1.4] text-white md:text-4xl">
            {post.href ? (
              <Link href={post.href} className="hover:underline">
                {post.title}
              </Link>
            ) : (
              post.title
            )}
          </h2>
          <p className="mt-6 text-lg leading-[1.7] text-neutral-300">
            {post.excerpt}
          </p>
          <span className="mt-6 block text-xs uppercase tracking-[0.35em] text-neutral-500">
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
      preview: "/placeholder.jpg",
    },
  ];

  return (
    <div className="space-y-20">
      {tools.map((tool, i) => (
        <div key={i}>
          <h3 className="text-3xl font-light leading-[1.4] text-white md:text-4xl">
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

function QuestionList() {
  const faqs = [
    {
      question: "网站如何搭建？",
      answer:
        "购买域名—vibe coding写网页—上传github-vercel部署。",
    },
    {
      question: "网站搭建成本？",
      answer: "域名：14元/年，服务器：无，网页开发：vibe coding，至今未充值。",
    },
  ];

  return (
    <div className="space-y-8">
      {faqs.map((item) => (
        <div key={item.question} className="border-b border-neutral-900 pb-6">
          <h3 className="text-lg font-medium text-white">{item.question}</h3>
          <p className="mt-3 text-base leading-[1.7] text-neutral-400">
            {item.answer}
          </p>
        </div>
      ))}
    </div>
  );
}

function MeIntro() {
  return (
    <div>
      <p className="max-w-2xl text-lg leading-[1.7] text-neutral-300">
        我是一名关注法律、技术与产品的创作者，喜欢把复杂的流程变成更好
        用的工具。正在持续写作与实验。
      </p>
      <Link
        href="/me"
        className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-white hover:underline"
      >
        查看详细介绍
      </Link>
    </div>
  );
}
