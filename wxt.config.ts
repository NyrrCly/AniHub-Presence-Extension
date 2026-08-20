import { defineConfig } from "wxt";

export default defineConfig({
  srcDir: "src",
  suppressWarnings: {
    firefoxDataCollection: true,
  },
  modules: ["@wxt-dev/auto-icons"],
  manifest: {
    name: "AniHub Presence Extension",
    version: "1.0.3",
    permissions: ["storage", "activeTab"],
    host_permissions: [
      "*://anihub.in.ua/*",
      "*://*.anihub.in.ua/*",
      "http://localhost:3000/*",
      "*://*.ashdi.vip/*",
      "*://*.fenixplay.xyz/*",
      "*://*.moonanime.art/*",
    ],
    browser_specific_settings: {
      gecko: {
        id: "anihub-presence@ua.com",
        data_collection_permissions: {
          required: ["none"],
        },
      },
    },
  },
});
