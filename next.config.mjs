/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // MVP: не блокируем демо-сборку из-за строгих правил линта/типов —
  // корректность проверяется отдельным `npm run typecheck`.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
