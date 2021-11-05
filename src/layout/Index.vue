<template>
  <div :class="$style['star-layout']">
    <side-bar :class="$style['star-sidebar-wrap']"></side-bar>
    <div
      v-if="route.meta.url !== '/'"
      :class="$style['star-layout-main']"
      :style="`background-image: url(${state.bg})`"
    >
      <nav-bar :class="$style['star-layout-home-navbar']"></nav-bar>
      <app-main :class="$style['star-layout-content']"> </app-main>
    </div>
    <!-- 首页 -->
    <div v-else :class="$style['star-layout-home']">
      <!-- <img src="https://static.kikoswap.com/img/2cdf_00015_iSpt.webp" /> -->
      <home-content></home-content>
      <nav-bar :class="$style['star-layout-home-navbar']"></nav-bar>
    </div>
    <star-net-dialog :visible="state.showWalletNetDialog"></star-net-dialog>
  </div>
</template>

<script setup>
/* eslint-disable */
import AppMain from "./AppMain.vue";
import SideBar from "./SideBar.vue";
import NavBar from "./NavBar.vue";
import { useStore } from "vuex";
import { reactive, watch, computed, onMounted, ref } from "vue";
import StarNetDialog from "@StarUI/StarNetDialog";
import { useRoute } from "vue-router";
import swapBg from "../assets/bg/swap.jpg";
import liquidityBg from "../assets/bg/liquidity.jpg";
import HomeContent from "@views/Home/Index.vue";
import nftBg from "../assets/bg/nft.jpg";
import CONSTANTS_STARMASK from "@constants/starmask.js";

const route = useRoute();

let state = reactive({
  netChainId: computed(() => store.state.StoreWallet.netChainId),
  showWalletNetDialog: false,
  bg: "../assets/bg/liquidity.jpg",
});

const setBg = (key) => {
  const bg = {
    swap: swapBg,
    liquidity: liquidityBg,
    nft: nftBg,
  };
  state.bg = bg[key];
};

const store = useStore();

onMounted(() => {
  let bgValue = ref(route.meta.bg).value;
  if (!bgValue) return;
  setBg(bgValue);
  if (
    state.netChainId &&
    state.netChainId !== CONSTANTS_STARMASK.MAIN_CHIA_ID
  ) {
    console.log("A");
    state.showWalletNetDialog = true;
  }
});

watch(
  () => route.meta,
  (n) => {
    let bgValue = n.bg;
    if (!bgValue) return;
    setBg(bgValue);
  }
);

watch(
  () => state.netChainId,
  (n) => {
    if (n === CONSTANTS_STARMASK.MAIN_CHIA_ID) {
      state.showWalletNetDialog = false;
    }
    if (n !== CONSTANTS_STARMASK.MAIN_CHIA_ID) {
      state.showWalletNetDialog = true;
    }
  }
);
</script>

<style lang="scss" module>
.star-layout {
  .star-sidebar-wrap {
    position: fixed;
    top: 0px;
    left: 0px;
    height: 100%;
    z-index: 3;
    width: 200px;
    overflow: hidden;
    // background: #f9efe4;
  }
  .star-layout-main {
    margin-left: 200px;
    min-height: 100vh;
    max-width: calc(100% - 200px);
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    .star-layout-content {
      padding-top: 64px;
    }
  }
  .star-layout-home {
    max-width: calc(100% - 200px);
    margin-left: 200px;
    min-height: 100vh;
    // background: red;
    position: relative;
    .star-layout-home-navbar {
      position: absolute;
    }
  }
}
</style>
