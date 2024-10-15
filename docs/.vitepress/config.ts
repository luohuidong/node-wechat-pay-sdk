import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Node WeChat Pay SDK",
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
        items: [
          { text: "Native下单接口", link: "/api/transactions-native" },
          { text: "查询订单", link: "/api/transactions-query" },
          { text: "签名验证", link: "/api/sign-verify" },
          { text: "解密", link: "/api/decrypt-data" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/luohuidong/node-wechat-pay-sdk" }],
  },
});
