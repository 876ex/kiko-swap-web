<template>
  <star-nft class="blind-box-container" coreType="card">
    <template #nft-card>
      <core></core>
    </template>
  </star-nft>
</template>

<style lang="scss" scoped>
.blind-box-container {
  margin: 0 auto;
  padding-bottom: 30px;
}
</style>

<script setup>
import StarNft from "@StarUI/StarNFT.vue";
import core from "@components/NFT/BlindBox/core.vue";
</script>
