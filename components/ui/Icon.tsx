import type { SVGProps } from "react";

export type IconName =
  | "search"
  | "arrow-right"
  | "arrow-up-right"
  | "check"
  | "x"
  | "minus"
  | "map-pin"
  | "home"
  | "building"
  | "landmark"
  | "store"
  | "tree"
  | "phone"
  | "chat"
  | "star"
  | "shield"
  | "sparkles"
  | "chevron-down"
  | "chevron-right"
  | "menu"
  | "play"
  | "ruler"
  | "bed"
  | "layers"
  | "car"
  | "video"
  | "flame"
  | "trending"
  | "scale"
  | "wand"
  | "users"
  | "file"
  | "globe"
  | "sun"
  | "check-circle"
  | "quote";

const paths: Record<IconName, React.ReactNode> = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  "arrow-right": <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  "arrow-up-right": <><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>,
  check: <path d="m5 12 4.5 4.5L19 7" />,
  x: <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>,
  minus: <path d="M5 12h14" />,
  "map-pin": <><path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>,
  home: <><path d="M4 11.5 12 4l8 7.5" /><path d="M6 10v10h12V10" /></>,
  building: <><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M9 7h.01M12 7h.01M15 7h.01M9 11h.01M12 11h.01M15 11h.01M10 21v-4h4v4" /></>,
  landmark: <><path d="M4 10h16" /><path d="M4 10 12 4l8 6" /><path d="M6 10v8M10 10v8M14 10v8M18 10v8" /><path d="M4 20h16" /></>,
  store: <><path d="M4 9V7l1.5-3h13L20 7v2" /><path d="M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" /><path d="M5 11v9h14v-9" /></>,
  tree: <><path d="M12 3 6 12h3l-3 5h12l-3-5h3L12 3Z" /><path d="M12 17v4" /></>,
  phone: <path d="M6 3h3l1.5 5-2 1.5a12 12 0 0 0 6 6l1.5-2 5 1.5v3a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2Z" />,
  chat: <path d="M4 5h16v11H8l-4 4V5Z" />,
  star: <path d="m12 3 2.6 5.6 6 .7-4.4 4.1 1.2 6L12 16.9 6.6 19.5l1.2-6L3.4 9.3l6-.7L12 3Z" />,
  shield: <><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>,
  sparkles: <><path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4Z" /><path d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" /></>,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
  play: <path d="M8 5v14l11-7-11-7Z" />,
  ruler: <><rect x="3" y="8" width="18" height="8" rx="1.5" transform="rotate(0 12 12)" /><path d="M7 8v3M11 8v4M15 8v3M19 8v4" /></>,
  bed: <><path d="M3 8v10M3 12h18v6M21 18v-4a3 3 0 0 0-3-3H9v4" /><circle cx="6.5" cy="10.5" r="1.5" /></>,
  layers: <><path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" /><path d="m4 12 8 4.5 8-4.5" /></>,
  car: <><path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13" /><path d="M4 13h16v5h-2v-2H6v2H4v-5Z" /><circle cx="7.5" cy="15.5" r="0.5" /><circle cx="16.5" cy="15.5" r="0.5" /></>,
  video: <><rect x="3" y="6" width="12" height="12" rx="2" /><path d="m15 10 6-3v10l-6-3" /></>,
  flame: <path d="M12 3c1 3-2 4-2 7a2 2 0 0 0 4 0c2 2 3 3.5 3 6a5 5 0 0 1-10 0c0-4 3-6 5-13Z" />,
  trending: <><path d="M4 16l5-5 3 3 7-7" /><path d="M15 7h5v5" /></>,
  scale: <><path d="M12 4v16" /><path d="M6 8h12" /><path d="m6 8-3 6h6l-3-6Z" /><path d="m18 8-3 6h6l-3-6Z" /><path d="M8 20h8" /></>,
  wand: <><path d="m15 4 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" /><path d="M5 19 14 10" /><path d="m13 7 4 4" /></>,
  users: <><circle cx="9" cy="8" r="3" /><path d="M4 20a5 5 0 0 1 10 0" /><path d="M16 6a3 3 0 0 1 0 6M15 20a5 5 0 0 0-1.5-3.6" /></>,
  file: <><path d="M7 3h7l4 4v14H7V3Z" /><path d="M14 3v4h4" /><path d="m9.5 14 1.8 1.8L15 12" /></>,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.5 2.5 14 0 17M12 3.5c-2.5 2.5-2.5 14 0 17" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M18.5 5.5l-1.4 1.4M6.9 17.1l-1.4 1.4" /></>,
  "check-circle": <><circle cx="12" cy="12" r="8.5" /><path d="m8.5 12 2.5 2.5L16 9.5" /></>,
  quote: <path d="M9 7H5v6h4v-2H7a2 2 0 0 1 2-2V7Zm10 0h-4v6h4v-2h-2a2 2 0 0 1 2-2V7Z" />,
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
