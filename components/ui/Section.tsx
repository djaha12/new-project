import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/** Секция с вертикальными отступами и опциональной тёмной темой. */
export function Section({
  children,
  className,
  dark = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-14 sm:py-20",
        dark && "bg-ink text-text-invert",
        className,
      )}
    >
      <div className="container">{children}</div>
    </section>
  );
}

/** Шапка секции: eyebrow + заголовок + подзаголовок + ссылка «смотреть все». */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  link,
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  link?: { label: string; href: string };
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4 mb-8", className)}>
      <div className="max-w-2xl">
        {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
        <h2
          className={cn(
            "font-display text-3xl sm:text-[2.6rem] leading-[1.05]",
            dark ? "text-text-invert" : "text-text",
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p className={cn("mt-3 text-[15px] leading-relaxed", dark ? "text-white/70" : "text-text-soft")}>
            {subtitle}
          </p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className={cn(
            "group inline-flex items-center gap-1.5 text-sm font-semibold",
            dark ? "text-gold-bright" : "text-gold hover:text-ink",
          )}
        >
          {link.label}
          <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
