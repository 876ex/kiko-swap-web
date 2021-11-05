<template>
  <div class="nft-detail-tab">
    <div
      class="nft-detail-tab-item"
      v-for="(d, i) in props.cross_bar_array"
      :key="i"
      @click="selectCrossTab(d.id)"
    >
      <span
        :class="['name', state.selected_tab === d.id ? 'selected_tab' : '']"
        >{{ d.name }}</span
      >
      <span
        class="bottom-line"
        v-if="state.selected_tab === d.id && props.cross_bar_array.length > 1"
      ></span>
    </div>
  </div>
</template>
<script setup>
import { reactive, defineProps, watch } from "vue";
let state = reactive({
  selected_tab: "description", // description rarevalue history
});

const emits = defineEmits(["selectCrossTab"]);
const props = defineProps({
  cross_bar_array: {
    type: Array,
  },
  selected_tab: {
    type: String,
  },
});
watch(
  () => props.selected_tab,
  (n) => {
    state.selected_tab = n;
  }
);

const selectCrossTab = (id) => {
  emits("selectCrossTab", id);
};
</script>
<style lang="scss" scoped>
.nft-detail-tab {
  display: flex;
  .nft-detail-tab-item {
    font-size: 16px;
    font-weight: 500;
    color: #3f1c09;
    margin-right: 32px;
    position: relative;
    cursor: pointer;
    .bottom-line {
      display: inline-block;
      width: 100%;
      height: 4px;
      background: #fb8000;
      border-radius: 4px;
      position: absolute;
      bottom: -4px;
      left: 0%;
    }
    .selected_tab {
      color: #3f1c09;
    }
  }
}
</style>
