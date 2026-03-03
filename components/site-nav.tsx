import Link from "next/link";

export function SiteNav() {
  const items = [
    { label: "主页", href: "https://ytang.xyz", external: true },
    { label: "记录", href: "/?tab=record" },
    { label: "实验", href: "/?tab=lab" },
    { label: "问题", href: "/?tab=question" },
    { label: "我", href: "/?tab=me" },
  ];

  return (
    <nav className="flex flex-wrap items-center gap-6 text-sm uppercase tracking-[0.3em] text-neutral-300 md:gap-8 md:text-base">
      {items.map((item) =>
        item.external ? (
          <a
            key={item.label}
            href={item.href}
            className="transition-colors hover:text-white"
          >
            {item.label}
          </a>
        ) : (
          <Link
            key={item.label}
            href={item.href}
            className="transition-colors hover:text-white"
          >
            {item.label}
          </Link>
        )
      )}
    </nav>
  );
}
