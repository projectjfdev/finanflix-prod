/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
    // reactRefresh: false,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    // ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  devIndicators: {
    buildActivity: true,
  },
  // reactStrictMode: false,
  // images: {
  //   domains: ["res.cloudinary.com"],
  // },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "**",
      },
    ],
  },
  //   webpack: (config) => {
  //     config.module.rules.push({
  //       test: /\.node/,
  //       use: "raw-loader",
  //     });
  // return config;
  //   },
  // webpack: (config, { isServer }) => {
  //   // Configuraciones adicionales si es necesario
  //   if (!isServer) {
  //     // Evitar problemas con módulos no encontrados en el cliente
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       canvas: false, // Ignorar el módulo 'canvas' si no se usa
  //     };
  //   }
  //   return config;
  // },
};

export default nextConfig;

// https://www.youtube.com/watch?v=cBg6xA5C60s 2:04:19 / 3:31:23
// reactStrictMode: false, Solo lo usamos para que funcionen los botones del calendario.
// Al parecer cuando hacemos el build no necesitamos el reactStrictMode en false
// Data sacada de aca: https://github.com/vercel/next.js/issues/56206
