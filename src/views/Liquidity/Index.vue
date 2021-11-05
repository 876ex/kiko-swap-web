<template>
  <div class="liquidity-container">
    <star-space :size="20"></star-space>
    <div class="liquidity-container-btnwarp">
      <star-change-button :activeIndex="1"></star-change-button>
    </div>
    <star-space :size="25"></star-space>
    <star-swap-card class="liquidity-container-card">
      <liquidity-core class="liquidity-container-core"></liquidity-core>
    </star-swap-card>
    <liquidity-transition-card
      v-if="state.poolType === 'add' || state.poolType === 'delete'"
      class="liquidity-container-transition-card"
    ></liquidity-transition-card>
  </div>
</template>
<script setup>
import { computed, reactive } from "vue";
import LiquidityCore from "@components/Liquidity/core.vue";
import LiquidityTransitionCard from "@components/Liquidity/transitioncard.vue";
import StarSwapCard from "@StarUI/StarSwapCard.vue";
import StarChangeButton from "@StarUI/StarChangeButton.vue";
import StarSpace from "@StarUI/StarSpace.vue";
import { useStore } from "vuex";
const store = useStore();
let state = reactive({
  poolType: computed(() => store.state.StoreLiquidity.poolType),
});
</script>
<style lang="scss" scoped>
.liquidity-container {
  // position: relative;
  // left: 50%;
  // display: inline-block;
  // transform: translate(-50%, 0);
  .liquidity-container-btnwarp {
    display: flex;
    justify-content: center;
  }
  .liquidity-container-card {
    margin: 0 auto;
    position: relative;
    .liquidity-container-core {
      position: relative;
      width: 100%;
    }
  }
  .liquidity-container-transition-card {
    margin: 0 auto;
    position: relative;
  }
}
</style>
