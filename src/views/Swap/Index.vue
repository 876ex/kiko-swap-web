<template>
  <div class="swap-container">
    <star-space :size="20"></star-space>
    <div class="swap-container-btnwarp">
      <star-change-button :activeIndex="0"></star-change-button>
    </div>
    <star-space :size="25"></star-space>
    <star-swap-card class="swap-container-card">
      <swap-core class="swap-container-core"></swap-core>
    </star-swap-card>
    <swap-transition-card
      class="swap-container-transition-card"
    ></swap-transition-card>
  </div>
</template>
<script setup>
import SwapCore from "@components/Swap/core.vue";
import SwapTransitionCard from "@components/Swap/card.vue";
import StarSwapCard from "@StarUI/StarSwapCard.vue";
import StarChangeButton from "@StarUI/StarChangeButton.vue";
import StarSpace from "@StarUI/StarSpace.vue";
// const test = (type) => {
//   let t = {};
//   if (type === "from") {
//     t = {
//       type,
//       currency: "BTC",
//     };
//   }

//   if (type === "to") {
//     t = {
//       type,
//       currency: "BSV",
//     };
//   }
//   store.dispatch("StoreSwap/setSelectCurrencyInfo", t);
// };
</script>
<style lang="scss" scoped>
.swap-container {
  .swap-container-btnwarp {
    display: flex;
    justify-content: center;
  }
  .swap-container-card {
    margin: 0 auto;
    position: relative;
    .swap-container-core {
      position: relative;
      width: 100%;
    }
  }
  .swap-container-transition-card {
    margin: 0 auto;
    position: relative;
  }
}
</style>
