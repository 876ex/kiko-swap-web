<template>
  <div :class="$style['container-footer']">
    <p :class="$style['container-footer-title']">{{ $t("加入我们的社区") }}</p>
    <div :class="$style['container-footer-content']">
      <div
        :class="$style['container-footer-content-item']"
        v-for="(d, i) in state.tabs"
        :key="i"
        @click="pushPage(d.url)"
      >
        <img :src="d.img" />
        <span>{{ d.title }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive } from "vue";
import utilsTool from "@utils/tool.js";

const state = reactive({
  tabs: [
    {
      title: "Twitter",
      img: require("../../assets/home/twitter.png"),
      url: "https://twitter.com/Kiko_Swap",
    },
    {
      title: "Telegram",
      img: require("../../assets/home/tel.png"),
      url: "https://t.me/kikoswap",
    },
    {
      title: "Medium",
      img: require("../../assets/home/med.png"),
      url: "https://medium.com/@kikoswap",
    },
  ],
});

const pushPage = (url) => {
  utilsTool.openNewWindow(url);
};
</script>
<style lang="scss" module>
.container-footer {
  width: 100%;
  // left: 20%;
  padding: 30px 20%;
  overflow: hidden;
  padding-bottom: 120px;
  box-sizing: border-box;
  // margin-left: 10%;
  // height: 681px;
  background: #ffffff;
  .container-footer-title {
    font-size: 30px;
    font-weight: 700;
    text-align: center;
    margin-top: 40px;
    margin-bottom: 50px;
    color: #9c897e;
  }
  .container-footer-content {
    display: flex;
    justify-content: space-between;
    .container-footer-content-item {
      cursor: pointer;
      background: #faf6f3;
      border-radius: 16px;
      padding: 40px 8%;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        opacity: 0.8;
      }
      img {
        width: 44px;
        height: 36px;
        margin-right: 5px;
        display: inline-block;
      }
      span {
        font-size: 20px;
        color: #9c897e;
        font-weight: bold;
      }
    }
  }
}
</style>
