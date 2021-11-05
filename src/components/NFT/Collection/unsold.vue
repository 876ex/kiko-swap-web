<template>
  <star-loading-fish v-if="state.isLoading" class="loading"></star-loading-fish>
  <empty v-if="!state.isLoading && unsold_data && unsold_data.length === 0">
    <template #content>
      <p style="color: #8b8b8b">
        {{ $t("我的NFT未出售无数据文案") }}
      </p>
      <p class="link" @click="() => emits('pushMarket')">
        {{ $t("去市场转转吧") }}
      </p>
    </template>
  </empty>
  <template v-if="!state.isLoading && unsold_data && unsold_data.length > 0">
    <list-blind-box-item
      v-for="d in unsold_data"
      :key="d.id"
      cardType="collection"
      :sellType="d.sellType"
      :hasBtn="false"
      :baseData="d"
      @actionsCall="actionsCall"
      @watchDetail="() => emits('watchDetail', d, 'unsold')"
    ></list-blind-box-item>
  </template>
</template>

<script setup>
import Empty from "@components/NFT/Empty.vue";
import ListBlindBoxItem from "@components/NFT/ListBlindBoxItem.vue";
import StarLoadingFish from "@StarUI/StarLoadingFish.vue";
import { computed, defineEmits, reactive } from "vue";
import { useStore } from "vuex";
const store = useStore();
let state = reactive({
  isLoading: computed(() => store.state.StoreCollection.isLoading),
});
const unsold_data = computed(
  () => store.getters["StoreCollection/unsold_data"]
);
const actionsCall = (e) => {
  emits("actionsCall", e);
};

const emits = defineEmits(["pushMarket", "watchDetail", "actionsCall"]);
</script>

<style scoped lang="scss">
@import "./style.scss";
</style>
