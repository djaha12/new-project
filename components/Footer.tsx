"use client";

import Link from "next/link";
import { site } from "@/lib/site";
import { useI18n } from "@/components/i18n";
import { Icon } from "@/components/ui/Icon";

const NAV_KEYS = ["catalog", "premium", "abroad", "brokers", "ai", "sell"] as const;
const NAV_HREF: Record<(typeof NAV_KEYS)[number], string> = {
  catalog: "/catalog",
  premium: "/premium",
  abroad: "/abroad",
  brokers: "/brokers",
  ai: "/ai",
  sell: "/sell",
};

export function Footer() {
  const { d } = useI18n();
  const l = d.footer.links;

  const cols = [
    {
      title: d.footer.colCatalog,
      links: [
        { label: l.apartments, href: "/catalog?category=apartment" },
        { label: l.houses, href: "/catalog?category=house" },
        { label: l.land, href: "/catalog?category=land" },
        { label: l.commercial, href: "/catalog?category=commercial" },
        { label: l.premium, href: "/premium" },
      ],
    },
    {
      title: d.footer.colServices,
      links: [
        { label: l.aiAnalysis, href: "/ai" },
        { label: l.estimate, href: "/estimate" },
        { label: l.districts, href: "/districts" },
        { label: l.sell, href: "/sell" },
        { label: l.abroad, href: "/abroad" },
        { label: l.brokers, href: "/brokers" },
      ],
    },
    {
      title: d.footer.colCabinets,
      links: [
        { label: l.saved, href: "/saved" },
        { label: l.sellerCabinet, href: "/dashboard/seller" },
        { label: l.brokerCabinet, href: "/dashboard/broker" },
      ],
    },
  ];

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
              {d.footer.slogan}
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
                {col.links.map((li) => (
                  <li key={li.href}>
                    <Link href={li.href} className="text-sm text-white/60 hover:text-white">
                      {li.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/45">
            © {site.name} · {site.tagline}. {d.footer.disclaimer}
          </p>
          <nav className="flex flex-wrap gap-4">
            {NAV_KEYS.map((k) => (
              <Link key={k} href={NAV_HREF[k]} className="text-xs text-white/55 hover:text-white">
                {d.nav[k]}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
