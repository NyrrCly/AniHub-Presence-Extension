import { defineConfig } from "wxt";

export default defineConfig({
  srcDir: "src",
  suppressWarnings: {
    firefoxDataCollection: true,
  },
  modules: ['@wxt-dev/auto-icons'],
  manifest: {
    name: "AniHub Presence Extension",
    version: "1.0.0",
    permissions: ["storage", "activeTab"],
    host_permissions: [
      "*://anihub.in.ua/*",
      "*://*.anihub.in.ua/*",
      "http://localhost:3000/*",
      "*://*.ashdi.vip/*",
    ],
    browser_specific_settings: {
      gecko: {
        id: "anihub-presence@ua.com",
      },
    },
  },
});
