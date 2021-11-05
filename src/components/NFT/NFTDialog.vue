<template>
  <div class="nft-dialog">
    <ElDialog
      v-model="state.visible"
      custom-class="star-dialog-el"
      :width="setDiaglogStyle.dialogWidth"
      :before-close="handleClose"
      :close-on-press-escape="false"
      :close-on-click-modal="props.isClickModal"
      :modal="props.isHasModal"
      :show-close="false"
    >
      <!-- :width="`${props.width ? props.width + 'px' : '480px'}`" -->
      <template #title>
        <div
          class="nft-dialog-header"
          :style="{
            'justify-content': `${
              props.dialogParams.title ? 'space-between' : 'flex-end'
            }`,
          }"
        >
          <span v-if="props.dialogParams.title">
            {{ props.dialogParams.title }}
          </span>
          <svg-icon
            v-if="state.isShowClose"
            name="dialog-close"
            class="svg"
            @click.stop="handleClose"
          ></svg-icon>
        </div>
      </template>
      <div class="nft-dialog-content">
        <div class="nft-dialog-content-core">
          <img
            style="border-radius: 16px"
            :src="
              renderContentImg(
                props.dialogParams.dialogStatus,
                props.dialogParams.customImgUrl
              )
            "
            :style="
              setWH(
                props.dialogParams.dialogStatus,
                props.dialogParams.customImgUrl,
                props.dialogParams.isBlindBox
              )
            "
          />
          <star-space
            :size="15"
            v-if="props.dialogParams.dialogStatus !== 'ongoing'"
          ></star-space>
          <p
            class="nft-dialog-content-core-text"
            v-if="props.dialogParams.dialogText"
          >
            {{
              props.dialogParams.dialogStatus === "ongoing"
                ? $t(props.dialogParams.dialogText) + "..."
                : $t(props.dialogParams.dialogText)
            }}
          </p>
        </div>
        <star-space
          :size="20"
          v-if="!props.dialogParams.customImgUrl"
        ></star-space>
        <div
          class="nft-dialog-content-feedback"
          :style="{ width: setDiaglogStyle.feedBackWith }"
          v-if="props.dialogParams.dialogStatus === 'ongoing'"
        >
          <div
            :class="renderColorStyle(props.dialogParams.phase1)"
            class="nft-dialog-content-feedback-phase1"
          >
            <img
              :src="renderPhaseStatus(props.dialogParams.phase1)"
              alt=""
              :style="{ marginLeft: setDiaglogStyle.loadingMarLeft }"
              :class="rotateAni(props.dialogParams.phase1)"
            />
            <span>{{ $t("在钱包确认操作") }}</span>
          </div>
          <div
            class="nft-dialog-content-feedback-phase2"
            :class="renderColorStyle(props.dialogParams.phase2)"
          >
            <img
              :src="renderPhaseStatus(props.dialogParams.phase2)"
              alt=""
              :style="{ marginLeft: setDiaglogStyle.loadingMarLeft }"
              :class="rotateAni(props.dialogParams.phase2)"
            />
            <span>{{ $t("请耐心等待网络确认") }}</span>
          </div>
        </div>
      </div>
      <div class="nft-dialog-footer">
        <star-button
          @click="() => emits('handleSuccess')"
          class="nft-dialog-footer-button"
          type="green"
          v-if="
            props.dialogParams.successBtnText &&
            props.dialogParams.dialogStatus === 'success'
          "
        >
          {{ props.dialogParams.successBtnText }}
        </star-button>
        <star-button
          type="red"
          class="nft-dialog-footer-button"
          @click="() => emits('handleFailed')"
          v-if="
            props.dialogParams.failedBtnText &&
            props.dialogParams.dialogStatus === 'failed'
          "
        >
          {{ props.dialogParams.failedBtnText }}
        </star-button>
      </div>
    </ElDialog>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch, computed } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import StarSpace from "@StarUI/StarSpace.vue";
import StarButton from "@StarUI/StarButton.vue";
import { useStore } from "vuex";
import { ElDialog } from "element-plus";
import dialogOnGoingImg from "../../assets/nft/confirm-logo.gif";
import dialogFailedImg from "../../assets/nft/dialog-error.png";
import dialogSuccessImg from "../../assets/nft/dialog-ok.png";
import dialogLoadingImg from "../../assets/nft/dialog-loading.png";
import dialogPhaseSuccessImg from "../../assets/nft/dialog-success.png";

const store = useStore();
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  dialogVisible: {
    type: Boolean,
  },
  isClickModal: {
    type: Boolean,
    default: false,
  },
  isHasModal: {
    type: Boolean,
    default: true,
  },
  width: {
    type: Number,
  },
  isShowClose: {
    type: Boolean,
    default: true,
  },
  dialogParams: {
    type: Object,
  },
});
const state = reactive({
  visible: props.dialogVisible,
  isShowClose: props.isShowClose,
  currLang: computed(() => store.state.StoreApp.currLang),
});

watch(
  () => props.dialogVisible,
  (n, o) => {
    console.log("n", n, "o,", o);
    state.visible = n;
  }
);

watch(
  () => props.isShowClose,
  (n) => {
    state.isShowClose = n;
  }
);

// const setDiaglogStyle = () => {
//   if (state.currLang === "en") {
//     return {
//       dialogWidth: "500px",
//       feedBackWith: "440px",
//       loadingMarLeft: "20px",
//     };
//   }
//   return {
//     dialogWidth: "440px",
//   };
// };

const setDiaglogStyle = computed(() => {
  if (state.currLang === "en") {
    return {
      dialogWidth: "500px",
      feedBackWith: "440px",
      loadingMarLeft: "20px",
    };
  }
  return {
    dialogWidth: "440px",
  };
});

const renderContentImg = (type, customImgUrl) => {
  const obj = {
    ongoing: customImgUrl || dialogOnGoingImg,
    failed: dialogFailedImg,
    success: customImgUrl || dialogSuccessImg,
  };
  return obj[type];
};

const renderPhaseStatus = (type) => {
  const obj = {
    loading: dialogLoadingImg,
    success: dialogPhaseSuccessImg,
  };
  return obj[type];
};

const setWH = (type, customImgUrl, isBlindBox) => {
  if (customImgUrl && isBlindBox) {
    return {
      width: "40%",
      "margin-bottom": "10px",
    };
  }
  if (customImgUrl) {
    return {
      width: "80%",
      "margin-bottom": "10px",
    };
  }
  if (type !== "ongoing") {
    return {
      width: "63px",
      // height: "56px",
    };
  }
  return {};
};

const rotateAni = (type) => {
  if (type === "loading") {
    return "loading-img";
  }
};

const renderColorStyle = (type) => {
  if (type === "loading") {
    return "loading-div";
  }
};

const emits = defineEmits(["handleClose", "handleSuccess", "handleFailed"]);

const handleClose = () => {
  emits("handleClose");
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  50% {
    transform: rotate(200deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.nft-dialog {
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
  .nft-dialog-header {
    display: flex;

    align-items: center;
    font-weight: bold;
    span {
      font-size: 18px;
    }
    .svg {
      width: 36px;
      height: 36px;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  .nft-dialog-content {
    // background: red;
    .nft-dialog-content-core {
      text-align: center;
      img {
        display: inline-block;
        width: 140px;
        user-select: none;
      }
      .nft-dialog-content-core-text {
        font-size: 20px;
        color: $text-black-color;
        font-weight: 600;
      }
    }
  }
  .nft-dialog-content-feedback {
    width: 323px;
    height: 109px;
    background: #fafafa;
    border-radius: 16px;
    margin: 0 auto;
    margin-top: 20px;
    overflow: hidden;
    // display: flex;
    // justify-content: center;
    // flex-direction: column;
    div {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: #000928;
      overflow: hidden;
      &.loading-div {
        color: #8b8b8b;
      }
      img {
        width: 14px;
        height: 14px;
        margin-left: 60px;
        display: inline-block;
      }
      span {
        margin-left: 10px;
        font-size: 16px;
        font-weight: 600;
      }
    }
    .loading-img {
      transition: 0.5s;
      animation: rotate 1s linear infinite;
    }
    .nft-dialog-content-feedback-phase1 {
      margin-top: 30px;
    }
    .nft-dialog-content-feedback-phase2 {
      margin-top: 10px;
    }
  }
  .nft-dialog-footer {
    width: 100%;
    margin-top: 0px;
    .nft-dialog-footer-button {
      padding-right: 0px;
      padding-left: 0px;
      width: 70%;
      margin-left: 15%;
      font-size: 16px;
      border-radius: 10px;
    }
  }
}
</style>
