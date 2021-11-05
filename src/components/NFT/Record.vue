<template>
  <div class="collection-record-card">
    <div class="record-wrap-th">
      <div
        v-for="(d, index) in setTh(props.type)"
        :key="index"
        class="record-wrap-th-item"
      >
        {{ $t(d) }}
      </div>
    </div>
    <div
      v-for="(d, i) in props.data"
      :key="i"
      class="record-wrap-tr"
      @click="pushPage(d)"
      :set="
        ((token = utilsFormat.getTokenCurrency(d.payToken)),
        (price = utilsFormat.formatPrice(d.price)))
      "
    >
      <div class="record-wrap-tr-td name">
        <img :src="d.icon" />
        <span>{{ d.name }}</span>
      </div>
      <template v-if="props.type === 'purchase'">
        <p class="record-wrap-tr-td status" :style="setColor(d.state)">
          {{ $t(setState(d.state)) }}
        </p>
        <p class="record-wrap-tr-td price">
          {{ price }}
          {{ token }}
        </p>
      </template>
      <template v-if="props.type === 'sell'">
        <p class="record-wrap-tr-td price">
          {{ price }}
          {{ token }}
        </p>
        <p class="record-wrap-tr-td price">
          {{ utilsFormat.formatPrice(d.fee) }}
          {{ token }}
        </p>
      </template>

      <p class="record-wrap-tr-td date">
        {{ formatDate(d.createTime) }}
      </p>
    </div>
    <div class="record-wrap-pagination">
      <div
        class="record-wrap-pagination-prev"
        @click="emits('pageEvent', 'prev')"
        :class="{ disabled: props.disabled[0] }"
      >
        {{ $t("上一页") }}
      </div>
      <div
        class="record-wrap-pagination-next"
        @click="emits('pageEvent', 'next')"
        :class="{ disabled: props.disabled[1] === false }"
      >
        {{ $t("下一页") }}
      </div>
    </div>
  </div>
</template>
<script setup>
// 收藏页面
// 购买记录
// 出售记录
/* eslint-disable */
import { computed, onMounted, reactive, defineProps, defineEmits } from "vue";
import dayjs from "dayjs";
import utilsFormat from "@utils/format";
import { useRouter } from "vue-router";
const router = useRouter();
const STATE = {
  ONE_PRICE: "一口价购买",
  HIGHEST_PRICE: "最高价",
  OVER_PRICE: "报价被超越",
  ACCEPT_PRICE: "报价被接受",
  SELL_CANCEL: "出售已取消",
};
const setState = (state) => {
  return STATE[state] || "";
};

const setColor = (state) => {
  if (state === "OVER_PRICE") {
    return {
      color: "#f36346",
    };
  }
  return {
    color: "#26bb8f",
  };
};

const props = defineProps({
  data: Object,
  type: String,
  disabled: {
    type: Array,
  },
});

const emits = defineEmits(["listEvent", "pageEvent"]);

const formatDate = (date) => {
  return dayjs(date).format("YYYY-MM-DD hh:mm:ss");
};

const setTh = (type) => {
  if (type === "purchase") {
    return ["NFT", "状态", "我的出价", "出价时间"];
  }
  if (type === "sell") {
    return ["NFT", "成交价", "手续费", "成交时间"];
  }
};

const pushPage = (detail) => {
  router.push({
    path: "/nftmarketdetail",
    query: {
      id: detail.nftBoxId,
      groupId: detail.groupId,
      type: detail.type,
      chainId: detail.refId,
    },
  });
};
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.collection-record-card {
  background-color: #fffaf3;
  width: 100%;
  height: auto;
  box-shadow: 0px 8px 16px 0px rgba(223, 205, 185, 0.46),
    0px 1px 0px 0px #ffffff;
  border-radius: 34px;
  padding: 32px;
  box-sizing: border-box;
  .record-wrap-th {
    display: flex;
    .record-wrap-th-item:first-child {
      flex: 1.8;
    }
    .record-wrap-th-item:not(:first-child) {
      text-align: right;
      flex: 1;
    }

    .record-wrap-th-item {
      font-size: 14px;
      text-align: center;
      color: $text-brown-color;
    }
  }
  .record-wrap-tr {
    display: flex;
    margin-top: 20px;
    padding-bottom: 15px;
    align-items: center;
    cursor: pointer;
    border-bottom: 2px solid $border-gray-color;
    &:hover {
      opacity: 0.7;
      transition: all ease-in-out 0.3s;
    }
    img {
      width: 120px;
      height: 120px;
      vertical-align: middle;
      border-radius: 16px;
      + span {
        margin-left: 32px;
      }
    }
    .record-wrap-tr-td {
      flex: 1;
      text-align: center;
      &:first-child {
        text-align: left;
        flex: 1.8;
      }
      &:not(:first-child) {
        text-align: right;
        flex: 1;
      }
      &.date,
      &.price,
      &.name {
        font-size: 14px;
        color: #000;
        font-weight: 600;
      }
    }
  }
  .record-wrap-pagination {
    display: flex;
    color: $text-brown-color;
    margin-top: 30px;
    justify-content: center;
    .record-wrap-pagination-prev,
    .record-wrap-pagination-next {
      border: 0.5px solid $border-gray-color;
      padding: 5px 0px;
      width: 70px;
      text-align: center;
      cursor: pointer;
      font-size: 14px;
      user-select: none;
      border-radius: 5px;
      &.disabled {
        color: $text-gray4-color;
      }
      &:hover {
        opacity: 0.6;
        transition: opacity ease-in-out 0.2s;
      }
    }
    .record-wrap-pagination-next {
      margin-left: 10px;
    }
  }
}
</style>
