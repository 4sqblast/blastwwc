import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fresh Oil | 4SQ Blast 2026",
    short_name: "Fresh Oil",
    description:
      "Fresh Oil Word & Worship Conference, Lagos, 19–22 November 2026.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f4ed",
    theme_color: "#1855df",
    orientation: "portrait",
    icons: [
      {
        src: "/pwa-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}