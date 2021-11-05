<template>
  <div class="no-liquidity-data">
    <!-- <star-space :size="40"></star-space> -->
    <!-- <p>未找到流動性 您可以添加流動性以獲取LP Token並享受額外代幣激勵</p> -->
    <p>{{ $t("未找到流动性") }}</p>
    <p>{{ $t("您可以添加流动性以获取LP Token并享受额外代币激励") }}</p>
    <star-space :size="40"></star-space>
    <star-button type="light" class="no-liquidity-data-btn" @click="addPool"
      >{{ $t("添加流动性") }}
    </star-button>
  </div>
</template>
<script setup>
import StarButton from "@StarUI/StarButton.vue";
import StarSpace from "@StarUI/StarSpace.vue";
import { useStore } from "vuex";
const store = useStore();
const addPool = () => {
  store.commit("StoreLiquidity/CHANGE_POOL_TYPE", "add");
};
</script>
<style lang="scss" scoped>
.no-liquidity-data {
  font-size: 14px;
  .no-liquidity-data-btn {
    width: 100%;
    width: 100%;
    padding: 15px 0px;
    font-weight: bold;
  }
}
</style>
