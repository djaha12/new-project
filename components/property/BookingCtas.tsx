import type { Broker, Property } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ViewingScheduler } from "@/components/property/ViewingScheduler";

/**
 * Ключевые действия по объекту: позвонить, написать в WhatsApp, записаться на
 * просмотр (слот-пикер ViewingScheduler, если передан объект — иначе #lead).
 * Переиспользуется в sticky-сайдбаре (stacked) и в блоке брокера.
 */
export function BookingCtas({
  broker,
  property,
  stacked = false,
  className,
}: {
  broker: Broker;
  property?: Property;
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
      {property ? (
        <ViewingScheduler
          brokerName={broker.name}
          brokerWhatsapp={broker.whatsapp}
          propertyTitle={property.title}
          propertyAddress={property.address}
          priceUsd={property.price}
          coords={property.coords}
          triggerClassName={full}
        />
      ) : (
        <Button href="#lead" variant="dark" icon="check-circle" className={full}>
          Записаться на просмотр
        </Button>
      )}
    </div>
  );
}
