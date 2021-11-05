<template>
  <star-nft
    class="blind-box-container"
    coreType="list"
    :cardStyleType="false"
    :listTypeParams="{ minHeight: '800px' }"
  >
    <template #nft-list>
      <list></list>
    </template>
  </star-nft>
</template>

<style lang="scss" scoped>
.blind-box-container {
  margin: 0 auto;
  padding-bottom: 30px;
  min-height: 800px;
}
</style>

<script setup>
import StarNft from "@StarUI/StarNFT.vue";
import list from "@components/NFT/BlindBox/list.vue";
</script>
