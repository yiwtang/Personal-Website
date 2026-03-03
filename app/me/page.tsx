import { SiteNav } from "@/components/site-nav";

export default function MePage() {
  return (
    <main className="min-h-screen bg-black text-neutral-200">
      <article className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-16 md:px-10">
        <header className="flex flex-col gap-10">
          <div className="border-b border-neutral-900 pb-6">
            <SiteNav />
          </div>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
              我
            </p>
            <h1 className="text-[clamp(2.8rem,6vw,3.8rem)] font-light leading-[1.3] text-white">
              个人介绍
            </h1>
            <p className="max-w-3xl text-lg leading-[1.8] text-neutral-300">
              这里是更完整的自我介绍，包括工作关注点、做事方式和一些个人习惯。
            </p>
          </div>
        </header>

        <section className="max-w-4xl space-y-6 text-lg leading-[1.9] text-neutral-300">
          <p>
            我主要从事法律相关的产品与流程优化，习惯先拆解问题，再用更简洁
            的交互方式呈现给用户。对我来说，好工具需要在克制与效率之间找到平衡。
          </p>
          <p>
            工作之外，我会写作、做实验性的项目，也会持续整理自己的工作方法。
          </p>
        </section>

        <figure className="overflow-hidden rounded-3xl border border-neutral-900">
          <img
            src="/placeholder.jpg"
            alt="个人照片或场景"
            className="h-[420px] w-full object-cover"
          />
        </figure>

        <section className="max-w-4xl space-y-6 text-lg leading-[1.9] text-neutral-300">
          <p>
            如果你想交流或合作，可以通过主页的联系方式找到我。
          </p>
        </section>
      </article>
    </main>
  );
}
