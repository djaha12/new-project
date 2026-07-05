import Link from "next/link";
import type { Broker } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";

export function BrokerCard({
  broker,
  className,
}: {
  broker: Broker;
  className?: string;
}) {
  const b = broker;
  return (
    <Link
      href={`/brokers/${b.slug}`}
      className={cn(
        "group flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <Avatar name={b.name} tone={b.photoTone} size="lg" />
          {b.hasVideo && (
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-white ring-2 ring-surface">
              <Icon name="play" size={11} />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-text group-hover:text-gold">
            {b.name}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-text-soft">{b.title}</p>
          <div className="mt-1.5 flex items-center gap-1 text-xs">
            <Icon name="star" size={13} className="fill-gold text-gold" />
            <span className="font-semibold text-text">{b.rating.toFixed(1)}</span>
            <span className="text-text-muted">· {b.reviews} отзывов</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {b.specialties.slice(0, 3).map((s) => (
          <Badge key={s} tone="neutral">
            {s}
          </Badge>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
        <Stat value={b.dealsClosed} label="сделок" />
        <Stat value={b.activeListings} label="в продаже" />
        <Stat value={`${b.avgDaysToSell}д`} label="ср. срок" />
      </div>
    </Link>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <div className="font-display text-lg leading-none text-text">{value}</div>
      <div className="mt-1 text-[11px] text-text-muted">{label}</div>
    </div>
  );
}
