export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-800 py-12 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 text-base md:px-10">
        <div className="flex flex-wrap items-center gap-6 text-base leading-[1.7]">
          <div className="inline-flex items-center gap-2 text-white">
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
          <div className="inline-flex items-center gap-2 text-white">
            <span>工具：</span>
            {[
              {
                src: "/ai1.jpg",
                alt: "AI 工具 1",
                href: "https://chatgpt.com/",
              },
              {
                src: "/ai2.jpg",
                alt: "AI 工具 2",
                href: "https://cursor.com/home",
              },
              {
                src: "/ai3.jpg",
                alt: "AI 工具 3",
                href: "https://chatgpt.com/codex/get-started",
              },
            ].map((tool) => (
              <a
                key={tool.src}
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 overflow-hidden rounded-full ring-1 ring-white/20"
              >
                <img
                  src={tool.src}
                  alt={tool.alt}
                  className="h-full w-full object-cover"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
