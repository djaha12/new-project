import Link from "next/link";
import { primaryNav, site } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";

const cols: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Каталог",
    links: [
      { label: "Квартиры", href: "/catalog?category=apartment" },
      { label: "Дома", href: "/catalog?category=house" },
      { label: "Участки", href: "/catalog?category=land" },
      { label: "Коммерция", href: "/catalog?category=commercial" },
      { label: "Премиум", href: "/premium" },
    ],
  },
  {
    title: "Сервисы",
    links: [
      { label: "AI-анализ объекта", href: "/ai" },
      { label: "Продать объект", href: "/sell" },
      { label: "Зарубежная недвижимость", href: "/abroad" },
      { label: "Наши брокеры", href: "/brokers" },
    ],
  },
  {
    title: "Кабинеты",
    links: [
      { label: "Кабинет продавца", href: "/dashboard/seller" },
      { label: "Кабинет брокера", href: "/dashboard/broker" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-text-invert">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-gold-bright">
                M
              </span>
              <span className="font-display text-xl font-semibold">{site.name}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {site.slogan}
            </p>
            <div className="mt-5 flex flex-col gap-1.5 text-sm text-white/70">
              <a href={`tel:${site.phone}`} className="inline-flex items-center gap-2 hover:text-white">
                <Icon name="phone" size={15} /> {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-white">
                <Icon name="chat" size={15} /> {site.email}
              </a>
              <span className="inline-flex items-center gap-2">
                <Icon name="map-pin" size={15} /> {site.city}, {site.country}
              </span>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/60 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/45">
            © {site.name} · {site.tagline}. AI-анализ не является юридическим заключением.
          </p>
          <nav className="flex flex-wrap gap-4">
            {primaryNav.map((item) => (
              <Link key={item.href} href={item.href} className="text-xs text-white/55 hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
