<template>
  <div :class="$style['container-list']">
    <p :class="$style['container-list-title']">{{ $t("行情") }}</p>
    <star-space :size="20"></star-space>
    <div
      :class="$style['container-list-content']"
      v-if="state.assetsList && state.assetsList.length > 0"
    >
      <div :class="$style['container-list-content-tabs']">
        <div
          v-for="(d, i) in state.tabs"
          :key="i"
          :class="$style['container-list-content-tabs-item']"
        >
          {{ $t(d) }}
        </div>
      </div>
      <div :class="$style['container-list-content-body']">
        <div
          :class="$style['container-list-content-body-item']"
          v-for="(d, i) in state.assetsList"
          :key="i"
        >
          <span
            :class="$style['container-list-content-body-item-ml']"
            style="font-weight: bold"
          >
            {{ d.sort + 1 }}</span
          >
          <div :class="$style['container-list-content-body-item-name']">
            <img :src="d.icon" />
            <span style="font-weight: bold"> {{ d.name }}</span>
          </div>
          <span :class="$style['container-list-content-body-item-flex2']">
            <star-amount
              :value="d.price"
              displayPreFix="$"
              :formatOptions="{
                precision: 2,
              }"
            >
            </star-amount>
          </span>
          <span :class="$style['container-list-content-body-item-flex2']">
            <star-amount
              :value="d.rate"
              :formatOptions="{
                precision: 2,
                showSign: true,
                percentStyle: true,
              }"
              :isShowTradeColor="true"
            >
            </star-amount>
          </span>
          <span :class="$style['container-list-content-body-item-flex2']">
            <star-amount
              :value="d.amount"
              :formatOptions="{
                precision: 2,
                compact: true,
                grouped: true,
              }"
              :isShowTradeColor="true"
              displayPreFix="$"
            >
            </star-amount>
          </span>
          <span :class="$style['container-list-content-body-item-flex2']">
            <star-amount
              :value="d.liquidity"
              :formatOptions="{
                precision: 2,
                compact: true,
                grouped: true,
              }"
              displayPreFix="$"
            >
            </star-amount>
          </span>
        </div>
      </div>
      <div :class="$style['container-list-content-footer']">
        <star-pagination
          @pageEvent="pageEvent"
          :disabled="[
            state.queryParams.pageNum === 1,
            state.queryParams.hasNext,
          ]"
        ></star-pagination>
      </div>
    </div>
    <star-loading-fish
      v-if="!state.assetsList || state.assetsList.length === 0"
    ></star-loading-fish>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive } from "vue";
import StarSpace from "@StarUI/StarSpace.vue";
import StarPagination from "@StarUI/StarPagination.vue";
import StarAmount from "@StarUI/StarAmount.vue";
import StarLoadingFish from "@StarUI/StarLoadingFish.vue";
import { useStore } from "vuex";
const store = useStore();
let state = reactive({
  tabs: ["#", "名称", "价格", "价格变化", "24小时交易额", "TVL"],
  assetsList: computed(() => store.state.StoreInfo.assetsList),
  queryParams: computed(() => store.state.StoreInfo.queryParams),
});

onMounted(() => {
  store.dispatch("StoreInfo/getAssetsList", { type: "init" });
});

const pageEvent = (type) => {
  console.log("pageEvent", type);
  store.dispatch("StoreInfo/getAssetsList", { type });
};
</script>
<style lang="scss" module>
.container-list {
  width: 100%;
  font-weight: 500;
  .container-list-title {
    color: $text-brown-color;
    font-weight: 600;
    font-size: 24px;
  }
  .container-list-content {
    background: #fff;
    width: 100%;
    border-radius: 16px;
    .container-list-content-tabs {
      padding: 0px 40px;
      display: flex;
      font-weight: 600;
      height: 66px;
      color: #3f1c09;
      justify-content: space-around;
      align-items: center;
      border-bottom: 1px solid $border-gray-color;
      .container-list-content-tabs-item:first-child {
        flex: 0.3;
      }
      .container-list-content-tabs-item:not(:first-child) {
        flex: 2;
      }
    }
    .container-list-content-body {
      .container-list-content-body-item {
        display: flex;
        padding: 0px 40px;
        height: 72px;
        align-items: center;
        border-bottom: 1px solid $border-gray-color;
        .container-list-content-body-item-ml {
          flex: 0.3;
        }
        .container-list-content-body-item-name {
          color: $text-black-color;
          flex: 2;
          display: flex;
          align-items: center;
          overflow: hidden;
          img {
            width: 30px;
          }
          img + span {
            margin-left: 10px;
          }
        }
        .container-list-content-body-item-flex2 {
          flex: 2;
          display: flex;
          overflow: hidden;
          color: $text-black-color;
        }
        &:hover {
          opacity: 0.7;
        }
      }
    }
    .container-list-content-footer {
      padding: 20px 0px;
    }
  }
}
</style>
