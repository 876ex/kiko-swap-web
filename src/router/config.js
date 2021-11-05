import Layout from "../layout/Index.vue";
const routes = [
  {
    component: Layout,
    redirect: () => {
      return {
        name: "home",
      };
    },
    children: [
      {
        path: "/",
        component: () => import("@views/Home/Index.vue"),
        name: "home",
        meta: { title: "首页", affix: true, url: "/" },
      },
      {
        path: "/swap",
        component: () => import("@views/Swap/Index.vue"),
        name: "swap",
        meta: { title: "兑换", affix: true, url: "/swap", bg: "swap" },
      },
      {
        path: "/liquidity",
        component: () => import("@views/Liquidity/Index.vue"),
        name: "liquidity",
        meta: {
          title: "流动性",
          affix: true,
          url: "/liquidity",
          bg: "liquidity",
        },
      },
      {
        path: "/nftblindbox",
        component: () => import("@views/NFT/BlindBox/Index.vue"),
        name: "nftblindbox",
        meta: {
          title: "盲盒",
          affix: true,
          url: "/nftblindbox",
          bg: "nft",
        },
      },
      {
        path: "/nftblindbox/:id",
        component: () => import("@views/NFT/BlindBox/Detail.vue"),
        name: "nftblindboxdetail",
        meta: {
          title: "盲盒",
          affix: true,
          url: "/nftblindbox/:id",
          bg: "nft",
        },
      },
      {
        path: "/nftbuyback",
        component: () => import("@views/NFT/BuyBack/Index.vue"),
        name: "nftbuyback",
        meta: { title: "平台回购", affix: true, url: "/nftbuyback", bg: "nft" },
      },
      {
        path: "/nftcollection/:tabIndex",
        component: () => import("@views/NFT/Collection/Index.vue"),
        name: "nftcollection",
        meta: {
          title: "我的NFT",
          affix: true,
          url: "/nftcollection",
          bg: "nft",
        },
      },
      {
        path: "/nftmarket",
        component: () => import("@views/NFT/Market/Index.vue"),
        name: "nftmarket",
        meta: { title: "市场", affix: true, url: "/nftmarket", bg: "nft" },
      },
      {
        path: "/nftcollectiondetail",
        component: () => import("@views/NFT/Collection/Detail.vue"),
        name: "nftcollectiondetail",
        meta: {
          title: "我的NFT详情",
          affix: true,
          url: "/nftcollectiondetail",
          bg: "nft",
        },
      },
      {
        path: "/nftmarketdetail",
        component: () => import("@views/NFT/Market/Detail.vue"),
        name: "nftmarketdetail",
        meta: {
          title: "市场详情",
          affix: true,
          url: "/nftmarketdetail",
          bg: "nft",
        },
      },
      {
        path: "/nftbuybackdetail",
        component: () => import("@views/NFT/BuyBack/Detail.vue"),
        name: "nftbuybackdetail",
        meta: {
          title: "平台回购详情",
          affix: true,
          bg: "nft",
          url: "/nftbuybackdetail",
        },
      },
      {
        path: "/info",
        component: () => import("@views/Info/Index.vue"),
        name: "info",
        meta: {
          title: "行情",
          affix: true,
          bg: "nft",
          url: "/info",
        },
      },
    ],
  },
];
export default routes;
