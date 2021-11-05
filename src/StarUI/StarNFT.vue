<template>
  <div class="star-nft">
    <star-space :size="25"></star-space>
    <star-change-button
      :activeIndex="state.activeIndex"
      :tabs="state.tabs"
      class="star-nft-header"
    ></star-change-button>
    <star-space :size="25"></star-space>
    <slot name="nft-header"></slot>
    <div
      class="nft-card-core"
      v-if="props.coreType === 'card'"
      :style="{ 'min-height': props.cardTypeParams.minHeight }"
    >
      <slot name="nft-card"> </slot>
    </div>
    <div
      :class="{ 'nft-card-core': props.cardStyleType }"
      v-if="props.coreType === 'list'"
      :style="{ 'min-height': props.listTypeParams.minHeight }"
    >
      <slot name="nft-list"> </slot>
    </div>
    <slot name="nft-no-data"></slot>
  </div>
</template>
<script setup>
import { reactive, defineProps, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import StarChangeButton from "@StarUI/StarChangeButton.vue";
import StarSpace from "@StarUI/StarSpace.vue";
import { findIndex } from "lodash";
const route = useRoute();

let state = reactive({
  tabs: [
    {
      label: "盲盒",
      path: "/nftblindbox",
    },
    {
      label: "市场",
      path: "/nftmarket",
    },
    {
      label: "我的NFT",
      path: {
        name: "nftcollection",
        params: {
          tabIndex: "1",
        },
      },
    },
    {
      label: "平台回购",
      path: "/nftbuyback",
    },
  ],
  activeIndex: null,
});
let props = defineProps({
  coreType: String,
  cardStyleType: {
    type: Boolean,
    default: false,
  },
  listTypeParams: {
    type: Object,
    default: () => {
      return {
        minHeight: "",
      };
    },
  },
  cardTypeParams: {
    type: Object,
    default: () => {
      return {
        minHeight: "",
      };
    },
  },
});

onMounted(() => {
  const path = ref(route.path).value;
  state.activeIndex = findIndex(state.tabs, { path });
  if (path.indexOf("/nftblindbox") > -1) {
    state.activeIndex = 0;
  }
  if (path === "/nftmarketdetail") {
    state.activeIndex = 1;
  }
  if (path.indexOf("/nftcollection") > -1) {
    state.activeIndex = 2;
  }
  if (path === "/nftbuybackdetail") {
    state.activeIndex = 3;
  }
});
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.star-nft {
  width: 900px;
  .star-nft-header {
    width: auto;
  }
  .nft-card-core {
    background-color: $nft-card-bgcolor;
    width: 100%;
    // height: 400px;
    height: auto;
    box-shadow: 0px 8px 16px 0px rgba(223, 205, 185, 0.46),
      0px 1px 0px 0px #ffffff;
    border-radius: 34px;
    padding: 32px;
    box-sizing: border-box;
  }
}
</style>
