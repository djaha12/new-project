import type { ReactNode } from "react";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Премиальный медиа-плейсхолдер вместо внешних фото: детерминированный
 * дуотон-градиент + лёгкая сцена по категории. Выглядит намеренно-дорого
 * и не зависит от сети.
 */

const GRADIENTS: [string, string, string][] = [
  ["#2A2F36", "#3A4048", "#20252B"], // 0 графит — центр/коммерция
  ["#7A5B22", "#B98B3E", "#5E4417"], // 1 золото — элитка
  ["#7C4A34", "#A9714E", "#5C3623"], // 2 бронза — дом
  ["#1C5B4E", "#2E8C73", "#154438"], // 3 изумруд — премиум-квартира
  ["#33414F", "#4A5B6B", "#26313B"], // 4 сталь — стандарт-квартира
  ["#245B72", "#3E8BA6", "#1B4658"], // 5 озеро — Иссык-Куль
  ["#3B5230", "#5B7A44", "#2A3C22"], // 6 лес — участок
  ["#4E5A2E", "#75863F", "#3A431F"], // 7 олива — участок
];

function Scene({ category }: { category: Category }) {
  const stroke = "rgba(255,255,255,0.16)";
  const strokeSoft = "rgba(255,255,255,0.10)";
  if (category === "land") {
    return (
      <>
        <path d="M0 78 L18 60 L34 72 L52 48 L72 68 L88 54 L100 66 L100 100 L0 100 Z" fill="rgba(0,0,0,0.14)" />
        <path d="M0 78 L18 60 L34 72 L52 48 L72 68 L88 54 L100 66" fill="none" stroke={stroke} strokeWidth="0.6" />
        <path d="M20 92 L50 82 L80 92 L50 100 Z" fill="none" stroke={strokeSoft} strokeWidth="0.6" strokeDasharray="2 2" />
      </>
    );
  }
  if (category === "house") {
    return (
      <>
        <path d="M28 70 L50 52 L72 70 L72 92 L28 92 Z" fill="rgba(0,0,0,0.12)" stroke={stroke} strokeWidth="0.6" />
        <path d="M44 92 L44 78 L56 78 L56 92" fill="none" stroke={strokeSoft} strokeWidth="0.6" />
        <path d="M22 72 L50 48 L78 72" fill="none" stroke={stroke} strokeWidth="0.6" />
      </>
    );
  }
  if (category === "commercial") {
    return (
      <>
        <rect x="26" y="50" width="48" height="42" fill="rgba(0,0,0,0.12)" stroke={stroke} strokeWidth="0.6" />
        <path d="M24 50 L76 50 L72 42 L28 42 Z" fill="none" stroke={stroke} strokeWidth="0.6" />
        <path d="M28 50 v6 M34 50 v6 M40 50 v6 M46 50 v6 M52 50 v6 M58 50 v6 M64 50 v6 M70 50 v6" stroke={strokeSoft} strokeWidth="0.5" />
      </>
    );
  }
  // apartment / room — фасад с сеткой окон
  return (
    <>
      <rect x="30" y="34" width="40" height="58" fill="rgba(0,0,0,0.12)" stroke={stroke} strokeWidth="0.6" />
      {[42, 52, 62, 72, 82].map((y) =>
        [36, 46, 56].map((x) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="6" height="5" fill={strokeSoft} />
        )),
      )}
    </>
  );
}

export function PropertyMedia({
  tone,
  category,
  className,
  rounded = "rounded-t-2xl",
  children,
}: {
  tone: number;
  category: Category;
  className?: string;
  rounded?: string;
  children?: ReactNode;
}) {
  const [from, via, to] = GRADIENTS[tone % GRADIENTS.length];
  return (
    <div
      className={cn("relative overflow-hidden noise-overlay", rounded, className)}
      style={{
        backgroundImage: `radial-gradient(120% 90% at 78% 12%, ${via} 0%, ${from} 45%, ${to} 100%)`,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <Scene category={category} />
      </svg>
      {/* мягкое верхнее свечение и нижнее затемнение под подписи */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/30" />
      {children}
    </div>
  );
}
