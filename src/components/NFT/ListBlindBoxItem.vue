<template>
  <div class="nft-blind-box-item">
    <div class="nft-blind-box-pic" @click="watchDetail" v-if="baseData">
      <img
        :src="baseData.icon"
        alt=""
        :class="baseData.nft ? 'opened' : ''"
        width="100%"
        v-unsold-nft-url="{
          isUnSoldNft: baseData.isUnSoldNft || false,
          url: baseData.icon || '',
        }"
      />
    </div>
    <!-- <div>{{ baseData }}</div> -->
    <div class="nft-blind-text">
      <div class="nft-blind-text-base">
        <div class="nft-blind-text-name">
          {{ baseData.nftName || baseData.name || "" }}
        </div>
        <div class="nft-blind-text-address">
          <span v-if="baseData.type === 'box'">
            {{
              baseData.boxToken.slice(0, 6) +
              "..." +
              baseData.boxToken.slice(-4)
            }}
          </span>
          <span v-if="baseData.type === 'nft'">
            {{
              baseData.nftMeta.slice(0, 6) + "..." + baseData.nftMeta.slice(-4)
            }}
          </span>
        </div>
      </div>
      <div class="nft-blind-text-price">
        <div
          class="nft-blind-text-price-item"
          v-if="
            (props.cardType === 'market' && props.sellType === 'sold') ||
            (props.cardType === 'collection' && props.sellType === 'sold')
          "
        >
          <span>{{ $t("已出售") }}:</span>
          <span>{{
            baseData.payToken ? baseData.payToken.split("::")[2] : ""
          }}</span>
        </div>
        <div
          class="nft-blind-text-price-item"
          v-if="
            (props.cardType === 'market' && props.sellType === 'sell') ||
            (props.cardType === 'collection' && props.sellType === 'sell') ||
            (props.cardType === 'collection' && props.sellType === 'selling')
          "
        >
          <span>{{ $t("售价") }}：</span>
          <span
            >{{ utilsFormat.formatPrice(baseData.sellPrice) }}
            {{ utilsFormat.getTokenCurrency(baseData.payToken) }}</span
          >
        </div>
        <div
          :style="
            props.cardType === 'collection' && props.sellType === 'sold'
              ? { height: '20px' }
              : ''
          "
        >
          <div
            class="nft-blind-text-price-item"
            v-if="
              (props.cardType === 'market' && props.sellType === 'sell') ||
              (props.cardType === 'collection' && props.sellType === 'sell')
            "
          >
            <span>{{ $t("最高出价") }}：</span>
            <span v-if="Number(baseData.offerPrice) > 0">
              {{ utilsFormat.formatPrice(baseData.offerPrice) }}
              {{ utilsFormat.getTokenCurrency(baseData.payToken) }}
            </span>
            <span v-else style="text-align: right">
              {{ $t("暂无报价") }}
            </span>
          </div>
          <div
            v-if="
              props.cardType === 'collection' && props.sellType === 'selling'
            "
            class="nft-blind-text-price-item"
          >
            <span>{{ $t("最高出价") }}：</span>
            <span v-if="Number(baseData.offerPrice) > 0">
              {{ utilsFormat.formatPrice(baseData.offerPrice) }}
              {{ utilsFormat.getTokenCurrency(baseData.payToken) }}
            </span>
            <span v-else>
              {{ $t("暂无报价") }}
            </span>
          </div>
        </div>

        <div
          class="nft-blind-text-price-item buyback"
          v-if="props.cardType === 'back'"
        >
          <span>{{ $t("回收价格") }}：</span>
          <span> {{ baseData.buyPrice }} {{ baseData.currency }}</span>
        </div>
      </div>
      <div class="nft-blind-text-btn" v-if="props.hasBtn === true">
        <div class="nft-blind-text-one" v-if="props.sellType === 'sell'">
          <star-button
            type="dark"
            class="nft-blind-text-one-btn"
            @click="actionsCall('CancelSell')"
            >{{ $t("取消出售") }}</star-button
          >
        </div>
        <div class="nft-blind-text-one" v-if="props.sellType === 'sold'">
          <star-button
            type="dark"
            class="nft-blind-text-one-btn"
            @click="CancelSell('AcceptBid')"
            >{{ $t("确认") }}</star-button
          >
        </div>
        <div class="nft-blind-text-two" v-if="props.sellType === 'selling'">
          <star-button
            v-if="Number(baseData.offerPrice) > 0"
            type="light"
            class="nft-blind-text-two-btn nft-blind-text-two-btn-light"
            @click="actionsCall('AcceptBid')"
            >{{
              $t("接受") +
              ` ${formatPriceWithLength(
                baseData.offerPrice
              )} ${utilsFormat.getTokenCurrency(baseData.payToken)}`
            }}
          </star-button>

          <star-button
            type="dark"
            :style="{ width: Number(baseData.offerPrice) <= 0 ? '100%' : '' }"
            class="nft-blind-text-two-btn"
            @click="actionsCall('CancelSell')"
            >{{ $t("取消出售") }}</star-button
          >
        </div>
      </div>
    </div>
    <Confirm
      cType="success"
      :dialogVisible="state.isShowConfirm"
      :contentText="state.contentText"
      :pic="state.pic"
      @handleConfirm="handleConfirm"
      @handleClose="handleClose"
    ></Confirm>
  </div>
</template>
<script setup>
import { defineProps, reactive, computed, defineEmits } from "vue";
import { useStore } from "vuex";
import StarButton from "@StarUI/StarButton.vue";
import Confirm from "@components/NFT/Confirm";
import utilsFormat from "@utils/format";

const store = useStore();
const props = defineProps({
  cardType: {
    type: String,
    default: "", //back平台回购，market 市场 collection 收藏 ,conllectionSell 未出售
  },
  sellType: {
    type: String,
    default: "sell", //sell 出售中，selling 出售中两个按钮 sold 已出售待确认
  },
  baseData: {
    type: Object,
  },
  contentText: {
    type: String,
    default: "222",
  },
  hasBtn: {
    type: Boolean,
    default: true,
  },
});
let state = reactive({
  isShowConfirm: computed(
    () => store.state.StoreNftMarket.change_confirm_visible
  ),
  pic: require("../../assets/nft/confirm-logo.png"),
  icon: require("../../assets/nft/blindbox.png"),
  contentText: "",
});

const formatPriceWithLength = (price) => {
  const t = utilsFormat.formatPrice(price, 9, { grouped: false });
  if (t && t.length > 3) {
    return t.slice(0, 3) + "...";
  }
  return t;
};

const handleConfirm = () => {
  store.commit("StoreNftMarket/CHANGE_CONFIRM_VISIBLE", false);
};
const handleClose = () => {
  store.commit("StoreNftMarket/CHANGE_CONFIRM_VISIBLE", false);
};
const emits = defineEmits(["watchDetail", "actionsCall"]);
const watchDetail = () => {
  // 卡片的信息
  const card_detail = {};
  emits("watchDetail", card_detail);
};
const actionsCall = (action) => {
  emits("actionsCall", { action: action, baseData: props.baseData });
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.nft-blind-box-item {
  width: 279px;
  background: $white;
  box-shadow: 0px 8px 16px 0px rgba(223, 205, 185, 0.46), 0px 1px 0px 0px $white;
  border-radius: 16px;
  font-size: 14px;
  user-select: none;
  margin-bottom: 30px;
  padding-bottom: 10px;
  overflow: hidden;
  margin-right: 20px;
  &:hover {
    transform: scale(1.01);
    transition: scale ease-in-out 0.2s;
  }
  .nft-blind-box-pic {
    width: 279px;
    height: 279px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-bottom: 0.5px solid #d1d1d1;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
  img {
    cursor: pointer;
    max-width: 279px;
    max-height: 279px;
    width: 100%;
    height: 100%;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
  .opened {
    max-width: 279px;
    max-height: 279px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }

  .nft-blind-text {
    padding: 12px 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    .nft-blind-text-address {
      font-family: PingFangSC-Regular, PingFang SC;
      color: $text-gray3-color;
    }
    .nft-blind-text-price {
      text-align: center;
      margin: 10px auto;
      .nft-blind-text-price-item {
        display: flex;
        justify-content: space-between;
        :first-child {
          color: #7f7f7f;
        }
        &.buyback {
          display: block;
          justify-content: flex-start;
          text-align: center;
        }
      }
    }
    .nft-blind-text-one-btn {
      width: 80%;
      height: 10px;
      line-height: 10px;
    }
    .nft-blind-text-one {
      margin: 10px auto;
    }
    .nft-blind-text-two {
      display: flex;
      justify-content: space-between;
      margin: 10px auto;
    }
    .nft-blind-text-two-btn {
      height: 10px;
      line-height: 10px;
      width: 46%;
      padding-left: 0;
      padding-right: 0;
    }
    .nft-blind-text-two-btn-light {
      border: 1px solid $border-gray-color;
      color: $text-black-color;
    }
  }
}
.confirm-foot-btn {
  width: 80%;
  display: flex;
  margin: 10px auto;
  justify-content: space-between;
}
.confirm-btn-one {
  width: 100%;
  border-color: $border-green-color !important;
  color: $border-green-color !important;
}
.confirm-foot-btn-one {
  width: 80%;
  display: flex;
  margin: 10px auto;
  justify-content: space-between;
}
.confirm-btn {
  width: 30%;
  border-color: $border-green-color !important;
  color: $border-green-color !important;
}
.cancel-btn {
  width: 30%;
}
</style>
