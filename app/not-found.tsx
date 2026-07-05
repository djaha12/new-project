import Link from "next/link";
import { primaryNav } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * 404 — объект не найден или снят с продажи.
 * Тёмный премиальный экран с быстрыми ссылками в разделы каталога.
 */
export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[78vh] items-center overflow-hidden bg-ink text-text-invert">
      {/* Мягкое премиальное свечение */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-ink-soft via-ink to-ink" />
      <div className="pointer-events-none absolute -right-40 -top-44 -z-10 h-[34rem] w-[34rem] rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-52 -left-44 -z-10 h-[30rem] w-[30rem] rounded-full bg-emerald/10 blur-3xl" />

      <div className="container py-20 sm:py-28">
        <div className="mx-auto max-w-2xl animate-fade-up text-center">
          <span className="eyebrow justify-center text-gold-bright">
            <Icon name="search" size={14} />
            Ошибка 404
          </span>

          <div className="mt-6 font-display text-[6.5rem] leading-none text-gold-bright sm:text-[9rem]">
            404
          </div>

          <h1 className="mt-4 text-balance font-display text-3xl leading-[1.1] text-text-invert sm:text-4xl">
            Объект не найден или снят с продажи
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/70">
            Возможно, объект уже продан и ушёл из каталога, ссылка устарела или в
            адресе закралась опечатка. Вернитесь на главную или откройте каталог —
            там только проверенные и актуальные объекты.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href="/catalog" variant="primary" icon="search">
              Смотреть каталог
            </Button>
            <Button href="/" variant="gold-outline" icon="home">
              На главную
            </Button>
          </div>

          {/* Быстрые ссылки в основные разделы */}
          <div className="mt-12 border-t border-white/10 pt-8">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
              Куда дальше
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2.5">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition-colors hover:border-gold/50 hover:text-gold-bright"
                >
                  {item.label}
                  <Icon name="arrow-up-right" size={14} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
