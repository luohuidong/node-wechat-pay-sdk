import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Node WechatPay SDK",
  description: "Node WechatPay API V3 SDK",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "开始使用", link: "/introduction/get-started" },
      { text: "API", link: "/api/transactions-native" },
    ],

    sidebar: [
      {
        text: "介绍",
        items: [{ text: "开始使用", link: "/introduction/get-started" }],
      },
      {
        text: "API",
        items: [{ text: "Native下单接口", link: "/api/transactions-native" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/luohuidong/node-wechatpay-api-v3-sdk" },
    ],
  },
});
