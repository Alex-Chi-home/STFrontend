import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ST-v0.1",
    short_name: "SimpleT",
    description: "A Progressive Web App built with Next.js",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/dogs.svg",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/vercel.svg",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
