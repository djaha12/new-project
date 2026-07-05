import type { Broker } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

/**
 * Ключевые действия по объекту: позвонить, написать в WhatsApp,
 * записаться на просмотр (ведёт к форме заявки #lead).
 * Переиспользуется в sticky-сайдбаре (stacked) и в блоке брокера.
 */
export function BookingCtas({
  broker,
  stacked = false,
  className,
}: {
  broker: Broker;
  stacked?: boolean;
  className?: string;
}) {
  const tel = `tel:${broker.phone.replace(/[^\d+]/g, "")}`;
  const wa = `https://wa.me/${broker.whatsapp}`;
  const full = stacked ? "w-full" : "";

  return (
    <div className={cn("flex gap-2.5", stacked ? "flex-col" : "flex-wrap", className)}>
      <Button href={tel} variant="primary" icon="phone" className={full}>
        Позвонить
      </Button>
      <Button
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        variant="outline"
        icon="chat"
        className={full}
      >
        WhatsApp
      </Button>
      <Button href="#lead" variant="dark" icon="check-circle" className={full}>
        Записаться на просмотр
      </Button>
    </div>
  );
}
