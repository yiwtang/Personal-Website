import { SiteNav } from "@/components/site-nav";

export default function BlogFirstPage() {
  return (
    <main className="min-h-screen bg-black text-neutral-200">
      <article className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-16 md:px-10">
        <header className="flex flex-col gap-10">
          <div className="border-b border-neutral-900 pb-6">
            <SiteNav />
          </div>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
              记录 · 2026 · 03
            </p>
            <h1 className="text-[clamp(2.8rem,6vw,3.8rem)] font-light leading-[1.3] text-white">
              把复杂流程变成简单按钮
            </h1>
            <p className="max-w-3xl text-lg leading-[1.8] text-neutral-300">
              这一篇图文记录我如何把一套复杂的法院文书下载流程，拆解成更清晰、
              更易复用的步骤与组件。
            </p>
          </div>
        </header>

        <figure className="overflow-hidden rounded-3xl border border-neutral-900">
          <img
            src="/placeholder.jpg"
            alt="图文封面"
            className="h-[420px] w-full object-cover"
          />
        </figure>

        <section className="max-w-4xl space-y-6 text-lg leading-[1.9] text-neutral-300">
          <p>
            在处理法院短信与链接时，最大的痛点不是下载动作本身，而是信息
            的整理与判断。过去需要手动复制、拆解链接、识别有效文件，再批量保存。
          </p>
          <p>
            于是我先把流程画成三段：输入、解析、下载。每一段都做成清晰的
            小模块，并给出可复用的错误提示，让用户几步内拿到结果。
          </p>
        </section>

        <figure className="grid gap-6 md:grid-cols-2">
          <img
            src="/placeholder.jpg"
            alt="流程示意"
            className="h-64 w-full rounded-2xl border border-neutral-900 object-cover"
          />
          <img
            src="/placeholder.jpg"
            alt="界面细节"
            className="h-64 w-full rounded-2xl border border-neutral-900 object-cover"
          />
        </figure>

        <section className="max-w-4xl space-y-6 text-lg leading-[1.9] text-neutral-300">
          <p>
            这只是一个开始，后续我会继续补充更多案例与实现细节。任何建议也欢迎
            通过主页的联系方式告诉我。
          </p>
        </section>
      </article>
    </main>
  );
}
