/** @type {import('next').NextConfig} */

// Статический экспорт включается только в CI для GitHub Pages (env STATIC_EXPORT).
// Локальная разработка и Vercel работают в обычном режиме (SSR/SSG).
const isExport = process.env.STATIC_EXPORT === "1";

const nextConfig = {
  reactStrictMode: true,
  // MVP: не блокируем демо-сборку из-за строгих правил линта/типов —
  // корректность проверяется отдельным `npm run typecheck`.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  ...(isExport
    ? {
        output: "export",
        basePath: process.env.PAGES_BASE_PATH || "",
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
