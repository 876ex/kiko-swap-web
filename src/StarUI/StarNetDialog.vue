<template>
  <div class="star-net-dialog">
    <ElDialog
      v-model="state.visible"
      width="440px"
      custom-class="star-dialog-el"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal="true"
      :show-close="false"
    >
      <div class="star-net-dialog-content">
        <star-space :size="50"></star-space>
        <img src="../assets/common/net-error.png" />
        <star-space :size="40"></star-space>
        <p class="star-net-dialog-content-text">{{ $t("网络错误") }}</p>
        <p style="font-size: 14px">
          {{ $t("请切换正确的钱包网络") }}
        </p>
        <star-space :size="20"></star-space>
      </div>
    </ElDialog>
  </div>
</template>

<script setup>
import { ElDialog } from "element-plus";
import { reactive, defineProps, watch } from "vue";
import StarSpace from "@StarUI/StarSpace";
const props = defineProps({
  visible: Boolean,
});
const state = reactive({
  visible: props.visible,
});
watch(
  () => props.visible,
  (n) => {
    state.visible = n;
  }
);
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.star-net-dialog {
  ::v-deep(.el-dialog) {
    border-radius: 34px;
    .el-dialog__headerbtn:focus .el-dialog__close,
    .el-dialog__headerbtn:hover .el-dialog__close {
      color: $btn-orange-bgcolor;
    }
  }
  ::v-deep(.el-dialog__body) {
    padding-top: 10px !important;
  }

  .star-net-dialog-content {
    // background: red;
    text-align: center;
    img {
      display: inline-block;
      width: 70px;
      user-select: none;
    }
    .star-net-dialog-content-text {
      font-size: 20px;
      color: $text-black-color;
      font-weight: 600;
    }
  }
}
</style>
