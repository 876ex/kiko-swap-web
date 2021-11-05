<template>
  <div class="nft-no-data">
    <div class="nft-no-data-box">
      <div class="nft-no-data-text">{{ $t("没有数据,请连接钱包") }}</div>
      <star-button type="dark" class="nft-no-data-btn" @click="connectWallet">
        {{ $t("连接钱包") }}
      </star-button>
    </div>
  </div>
</template>
<script setup>
import StarButton from "@StarUI/StarButton.vue";
import connectLogic from "@mixins/wallet";
import { useStore } from "vuex";
const store = useStore();
const { connectWallet } = connectLogic(store);
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.nft-no-data {
  width: 900px;
  height: 204px;
  border-radius: 16px;
  color: $text-brown-color;
  padding: 0 96px;
  box-sizing: border-box;
  // background-color: $btn-light-orange-bgcolor;
  background-image: url("../../assets/nft/no-connect-bg.png");
  margin: 0 auto;
  display: flex;
  align-items: center;
  position: relative;
  .nft-no-data-box {
    position: absolute;
    right: 30px;
    text-align: center;
    top: 80px;
    .nft-no-data-text {
      color: #391b0f;
      font-size: 14px;
    }
    .nft-no-data-btn {
      margin-top: 5px;
      width: 200px;
      font-size: 16px;
    }
  }
}
</style>
