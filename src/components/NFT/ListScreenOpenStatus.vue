<template>
  <div class="nft-status">
    <div
      class="nft-status-item"
      v-for="(d, i) in state.radios"
      :key="i"
      @click="clickRadio(i)"
    >
      <div class="nft-status-item-circle">
        <div
          class="nft-status-item-circle-inner"
          :class="d.isOpen ? ' active' : ''"
        ></div>
      </div>
      <span>
        {{ $t(d.name) }}
      </span>
    </div>
    <div v-if="props.showTips">
      {{ $t("费率") }} {{ NFT_CONSTANTS.NFT_GAS_FEE * 100 }}%
      <ElTooltip effect="light" placement="left-start">
        <template #default>
          <svg-icon name="question" class="question"></svg-icon>
        </template>
        <template #content>
          <p style="width: 250px">
            {{ $t("平台费文本") }}
          </p>
        </template>
      </ElTooltip>
    </div>
  </div>
</template>
<script setup>
import { reactive, defineEmits, defineProps } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import { ElTooltip } from "element-plus";
import NFT_CONSTANTS from "@constants/nft";
const props = defineProps({
  showTips: {
    type: Boolean,
    default: true,
  },
});
let state = reactive({
  radios: [
    {
      name: "未打开",
      isOpen: true,
    },
    {
      name: "已打开",
      isOpen: true,
    },
  ],
});

//未打开已打开点击效果
let clickRadio = (i) => {
  state.radios[i].isOpen = !state.radios[i].isOpen;
  emits("clickRadio", state.radios);
};

const emits = defineEmits(["clickRadio"]);
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.nft-status {
  display: flex;
  .nft-status-item {
    display: flex;
    margin-right: 10px;
    .nft-status-item-circle {
      user-select: none;
      cursor: pointer;
      width: 20px;
      height: 20px;
      background: #f9efe4;
      border: 2px solid #e9ded1;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      margin-right: 8px !important;
      .nft-status-item-circle-inner {
        width: 14px;
        height: 14px;
        background: $nft-radio-bgcolor;
        border-radius: 50%;
        &.active {
          background: $text-orange-color;
        }
      }
    }
  }
}
</style>
