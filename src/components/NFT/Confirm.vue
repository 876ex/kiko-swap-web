<template>
  <div class="confirm">
    <star-confirm
      :dialogVisible="props.dialogVisible"
      @handleClose="handleClose"
      :isShowClose="props.isShowClose"
    >
      <template #image-logo>
        <div class="image-logo">
          <img
            :src="props.pic"
            class="normal-img"
            v-if="props.cType === 'secondConfirm' || props.cType === 'fallback'"
          />
          <img
            src="../../assets/nft/confirm-logo.gif"
            v-if="props.cType === 'loading'"
            class="loading-img"
          />
          <img
            src="../../assets/nft/dialog-error.png"
            v-if="props.cType === 'fail'"
            class="info-img"
          />
          <img
            src="../../assets/nft/dialog-ok.png"
            v-if="props.cType === 'success'"
            class="info-img"
          />
        </div>
      </template>
      <template #content-text>
        <div class="confirm-text">{{ $t(props.contentText) }}</div>
      </template>
      <template #footer>
        <div class="confirm-foot-btn" v-if="props.cType === 'secondConfirm'">
          <star-button @click="handleConfirm" class="confirm-btn">{{
            $t("确认")
          }}</star-button>
          <star-button @click="handleClose" class="cancel-btn">{{
            $t("取消")
          }}</star-button>
        </div>
        <div class="confirm-foot-btn-one">
          <star-button
            @click="handleConfirm"
            class="confirm-btn-one-succ"
            v-if="props.cType === 'success' || props.cType === 'fallback'"
            >{{ $t("确认") }}</star-button
          >
          <star-button
            @click="handleConfirm"
            class="confirm-btn-one-fail"
            v-if="props.cType === 'fail'"
            >{{ $t("确认") }}</star-button
          >
        </div>
      </template>
    </star-confirm>
  </div>
</template>
<script setup>
import StarButton from "@StarUI/StarButton.vue";
import StarConfirm from "@StarUI/StarConfirm";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  //confirm类型
  cType: {
    type: String,
    default: "secondConfirm", //secondConfirm 二次确认；loading 获取收益中/正在下架商品； success 成功； fail 失败
  },
  //confirm 开关
  dialogVisible: {
    type: Boolean,
    default: true,
  },
  //confirm文本类容
  contentText: {
    type: String,
    default: "",
  },
  pic: {
    type: String,
    default: "",
  },
  isShowClose: {
    type: Boolean,
  },
});
const emits = defineEmits(["handleConfirm", "handleClose"]);
const handleConfirm = () => {
  emits("handleConfirm");
};
const handleClose = () => {
  emits("handleClose");
};
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.image-logo {
  text-align: center;
  .normal-img {
    width: 100%;
    height: 100%;
  }
  .loading-img {
    width: 140px;
    height: 140px;
  }
  .info-img {
    width: auto;
    height: auto;
  }
}
.confirm-foot-btn {
  width: 80%;
  display: flex;
  margin: 10px auto;
  justify-content: space-between;
}
.confirm-btn-one-succ {
  width: 100%;
  border-color: $border-green-color !important;
  color: $border-green-color !important;
}

.confirm-btn-one-fail {
  width: 100%;
}
.confirm-foot-btn-one {
  width: 80%;
  display: flex;
  margin: 10px auto;
  justify-content: space-between;
}
.confirm-text {
  margin: 20px auto;
  font-size: 16px;
}
.confirm-btn {
  width: 30%;
  border-color: $border-green-color !important;
  color: $border-green-color !important;
  font-size: 16px;
}
.cancel-btn {
  width: 30%;
  font-size: 16px;
}
</style>
