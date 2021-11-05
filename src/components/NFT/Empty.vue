<template>
  <div class="empty-c">
    <img src="../../assets/nft/empty.png" />
    <slot name="content" class="text"></slot>
  </div>
</template>
<script setup>
/* eslint-disable */
import { computed, onMounted, reactive, defineProps, defineEmits } from "vue";
</script>
<style lang="scss" scoped>
.empty-c {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  img {
    display: inline-block;
    margin-bottom: 30px;
  }
}
</style>
