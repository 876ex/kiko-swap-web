<template>
  <div class="nft-second-dialog">
    <ElDialog
      v-model="state.visible"
      :width="`${props.width ? props.width + 'px' : '440px'}`"
      custom-class="star-dialog-el"
      :before-close="handleClose"
      :close-on-press-escape="false"
      :close-on-click-modal="props.isClickModal"
      :modal="true"
      :show-close="false"
    >
      <template #title>
        <div class="nft-second-dialog-header">
          <span>
            {{ props.title || "" }}
          </span>
          <svg-icon
            v-if="state.isShowClose"
            name="dialog-close"
            class="svg"
            @click.stop="handleClose"
          ></svg-icon>
        </div>
      </template>
      <div class="nft-second-dialog-content">
        <img
          :src="props.dialogParams.imgUrl"
          v-if="props.dialogParams.imgUrl"
        />
        <p v-if="props.dialogParams.text">{{ props.dialogParams.text }}</p>
        <p
          v-if="props.dialogParams.gasInfo"
          class="nft-second-dialog-content-gas"
        >
          {{ props.dialogParams.gasInfo }}
        </p>
      </div>
      <div class="nft-second-dialog-footer">
        <star-button
          @click="emits('handleConfirm')"
          class="nft-second-dialog-footer-button"
          type="green"
          v-if="props.dialogParams.confirmText"
        >
          {{ props.dialogParams.confirmText }}
        </star-button>
        <star-button
          type="red"
          class="nft-second-dialog-footer-button"
          @click="emits('handleCancel')"
          v-if="props.dialogParams.cancelText"
        >
          {{ props.dialogParams.cancelText }}
        </star-button>
      </div>
    </ElDialog>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import StarButton from "@StarUI/StarButton.vue";
import { ElDialog } from "element-plus";

const props = defineProps({
  dialogVisible: {
    type: Boolean,
  },
  isClickModal: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
  },
  isShowClose: {
    type: Boolean,
    default: true,
  },
  dialogParams: null,
});
const state = reactive({
  visible: props.dialogVisible,
  isShowClose: props.isShowClose,
});

watch(
  () => props.dialogVisible,
  (n) => {
    state.visible = n;
  }
);

watch(
  () => props.isShowClose,
  (n) => {
    state.isShowClose = n;
  }
);

const emits = defineEmits(["handleClose", "handleCancel", "handleConfirm"]);

const handleClose = () => {
  console.log("===yes===");
  emits("handleClose");
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.nft-second-dialog {
  ::v-deep(.el-dialog) {
    border-radius: 34px;
    .el-dialog__headerbtn:focus .el-dialog__close,
    .el-dialog__headerbtn:hover .el-dialog__close {
      color: $btn-orange-bgcolor;
    }
  }
  .star-dialog-el {
    ::v-deep(.el-dialog__header) {
      text-align: left !important;
    }
  }
  .nft-second-dialog-header {
    display: flex;
    justify-content: flex-end;
    font-weight: bold;
    .svg {
      width: 36px;
      height: 36px;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  .nft-second-dialog-content {
    text-align: center;
    user-select: none;
    img {
      width: 80%;
      border-radius: 16px;
    }
    p {
      margin-top: 20px;
      font-size: 16px;
      color: #010e22;
      font-weight: 600;
    }
    .nft-second-dialog-content-gas {
      margin-top: 3px;
      font-size: 13px;
      color: #969696;
    }
  }

  .nft-second-dialog-footer {
    width: 90%;
    margin-top: 20px;
    margin-left: 5%;
    display: flex;
    justify-content: space-around;
    .nft-second-dialog-footer-button {
      user-select: none;
      // padding-right: 0px;
      // padding-left: 0px;
      padding: 15px 15px;
      width: 35%;
      font-size: 16px;
      border-radius: 12px;
    }
  }
}
</style>
