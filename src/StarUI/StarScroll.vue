<template>
  <div
    class="star-scroll-wrap"
    style="overflow: auto"
    :style="{ height: props.height || 'auto' }"
  >
    <slot name="content"> </slot>
    <div v-if="state.isLoading" class="star-scroll-wrap-loading">
      <star-space :size="20"></star-space>
      <p v-if="props.textLoading" class="text">{{ $t("加载中") }}...</p>
      <star-loading-fish v-if="props.imgLoading" :gifType="props.gifType">
      </star-loading-fish>
      <!-- <img v-if="props.imgLoading" src="../assets/nft/loading-c.gif" /> -->
    </div>
    <div
      v-if="!state.hasMore && props.isShowMore"
      class="star-scroll-wrap-more"
    >
      <star-space :size="20"></star-space>
      <p class="text">{{ $t("没有数据了") }}</p>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import {
  computed,
  defineProps,
  defineEmits,
  reactive,
  watch,
  onMounted,
  onUnmounted,
} from "vue";
import StarSpace from "@StarUI/StarSpace.vue";
import StarLoadingFish from "@StarUI/StarLoadingFish.vue";
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  hasMore: {
    type: Boolean,
    default: false,
  },
  height: String,
  imgLoading: {
    type: Boolean,
    default: false,
  },
  textLoading: {
    type: Boolean,
    default: true,
  },
  gifType: {
    type: String,
    default: "light",
  },
  isShowMore: {
    type: Boolean,
    default: true,
  },
});
const state = reactive({
  isLoading: props.isLoading,
  hasMore: props.hasMore,
  isAchiveBottom: false,
  // is_loading: false,
});

watch(
  () => props.isLoading,
  (n, o) => {
    if (n !== o) {
      state.isLoading = n;
    }
  }
);
watch(
  () => props.hasMore,
  (n, o) => {
    if (n !== o) {
      state.hasMore = n;
      // setTimeout(() => state.)
    }
  }
);
const emits = defineEmits(["loadMore"]);
const loadMore = () => {
  emits("loadMore");
  state.isAchiveBottom = false;
};

const scrollEvent = () => {
  window.addEventListener(
    "scroll",
    () => {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      let scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      //滚动条到底部的条件(距底部20px时触发加载)
      if (
        scrollTop + windowHeight >= scrollHeight - 20 &&
        !state.isAchiveBottom &&
        state.hasMore
      ) {
        state.isAchiveBottom = true;
        setTimeout(() => {
          emits("loadMore");
          state.isAchiveBottom = false;
        }, 500);
      }
    },
    false
  );
};
onMounted(() => {
  scrollEvent();
});
onUnmounted(() => {
  window.removeEventListener("scroll", scrollEvent);
});
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.star-scroll-wrap {
  position: relative;
  .text {
    text-align: center;
    font-size: 14px;
    color: $text-gray4-color;
    display: block;
    width: 100%;
  }

  .star-scroll-wrap-loading {
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
    padding-bottom: 20px;
    text-align: center;
    img {
      width: 90px;
    }
  }
  .star-scroll-wrap-more {
    position: relative;
    left: 50%;
    transform: translate(-50%, 0);
    padding-bottom: 20px;
  }
}
</style>
