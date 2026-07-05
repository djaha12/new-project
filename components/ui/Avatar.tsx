import { cn, initials } from "@/lib/utils";

const GRADS: [string, string][] = [
  ["#3B5230", "#75863F"],
  ["#7A5B22", "#C9A15A"],
  ["#2A2F36", "#4A5B6B"],
  ["#1C5B4E", "#2E8C73"],
  ["#33414F", "#5B6B7B"],
  ["#245B72", "#3E8BA6"],
  ["#7C4A34", "#A9714E"],
];

const sizes = {
  sm: "h-10 w-10 text-xs",
  md: "h-14 w-14 text-sm",
  lg: "h-20 w-20 text-lg",
  xl: "h-28 w-28 text-2xl",
};

/** Градиентный аватар с инициалами (без внешних фото). */
export function Avatar({
  name,
  tone,
  size = "md",
  className,
}: {
  name: string;
  tone: number;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const [from, to] = GRADS[tone % GRADS.length];
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-display font-medium text-white shadow-soft ring-1 ring-black/5",
        sizes[size],
        className,
      )}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  );
}
