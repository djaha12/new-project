import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "dark" | "outline" | "ghost" | "gold-outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2";

const variants: Record<Variant, string> = {
  primary: "bg-gold text-white hover:bg-gold/90 shadow-soft hover:shadow-lift",
  dark: "bg-ink text-text-invert hover:bg-ink-soft shadow-soft",
  outline:
    "border border-line-strong bg-surface text-text hover:border-ink hover:bg-surface",
  "gold-outline": "border border-gold/40 text-gold hover:bg-gold-wash",
  ghost: "text-text hover:bg-surface-3/70",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-13 px-8 text-base py-3.5",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconRight?: IconName;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & { href?: undefined };
type LinkProps = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
};

export function Button(props: ButtonProps | LinkProps) {
  const {
    variant = "primary",
    size = "md",
    className,
    icon,
    iconRight,
    children,
    onClick,
  } = props;
  const classes = cn(base, variants[variant], sizes[size], className);
  const content = (
    <>
      {icon && <Icon name={icon} size={18} />}
      {children}
      {iconRight && <Icon name={iconRight} size={18} />}
    </>
  );

  if ("href" in props && props.href) {
    const { href, target, rel } = props;
    return (
      <Link href={href} target={target} rel={rel} onClick={onClick} className={classes}>
        {content}
      </Link>
    );
  }

  const { type = "button", disabled } = props as ButtonProps;
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
