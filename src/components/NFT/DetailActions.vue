<template>
  <!-- 物品详情操作部分 -->
  <div class="nft-goods-detail-action">
    <!-- 我的NFT 未出售 -->
    <div class="sell-blind" v-if="props.action_type === 'UNSOLD'">
      <div class="trade-input" v-if="props.box_detail">
        <star-input
          class="trade-star-input"
          :value="String(props.box_detail.sellingPrice || '')"
          @inputEvent="inputEvent"
          validateType="integer"
          max="999999999"
        >
        </star-input>
        <div class="currency-select">
          {{ state.current_currency }}
        </div>
      </div>
      <!-- 盲盒未开启 -->
      <div class="buttons blind-buttons" v-if="!props.is_blind_open">
        <div
          class="sell-blind-box actions-button"
          @click="actionsCall('SellBlinkBox')"
        >
          {{ $t("出售盲盒") }}
        </div>
        <!-- <div
          class="open-blind-box actions-button"
          @click="actionsCall('OpenBlinkBox')"
        >
          {{ $t("打开盲盒") }}
        </div> -->
      </div>
      <!-- 我的NFT nft-->
      <div class="buttons" v-else>
        <div
          class="open-blind-box actions-button"
          @click="actionsCall('SellNFT')"
        >
          {{ $t("出售") }}
        </div>
      </div>
    </div>
    <!-- 购买者视角 出售中 -->
    <div class="on-offer-blind" v-if="props.action_type === 'BUYERSELL'">
      <div class="blind-offer-price">
        <div class="sell-price price-content-style">
          <span>{{ $t("售价") }}：</span>
          <span
            >{{
              (props.box_detail.sellingPrice &&
                utilsFormat.formatPrice(props.box_detail.sellingPrice)) ||
              "--"
            }}
            {{
              props.box_detail.sellingPrice
                ? utilsFormat.getTokenCurrency(props.box_detail.payToken)
                : ""
            }}</span
          >
        </div>
        <div class="lastest-price price-content-style">
          <span>{{ $t("最高出价") }}：</span>
          <span
            >{{
              (props.box_detail.topBidPrice &&
                utilsFormat.formatPrice(props.box_detail.topBidPrice)) ||
              $t("暂无报价")
            }}
            {{
              props.box_detail.topBidPrice &&
              utilsFormat.formatPrice(props.box_detail.topBidPrice)
                ? utilsFormat.getTokenCurrency(props.box_detail.payToken)
                : ""
            }}</span
          >
        </div>
      </div>
      <div class="blind-offer-actions" v-if="props.box_detail">
        <span class="purchase" @click="actionsCall('Purchase')">
          {{
            formatPriceWithLength(
              props.box_detail.sellingPrice,
              props.box_detail.payTokenPrecision
            )
          }}
          {{ utilsFormat.getTokenCurrency(props.box_detail.payToken) }}
          {{ $t("购买") }}</span
        >
        <span class="bid" @click="actionsCall('BidPrice')">{{
          $t("出价")
        }}</span>
      </div>
    </div>
    <!-- 拥有者视角 出售中 -->
    <div class="on-offer-blind" v-if="props.action_type === 'OWNERSELL'">
      <div class="blind-offer-price">
        <div class="sell-price price-content-style">
          <span>{{ $t("售价") }}：</span>
          <span style="display: inline-block"
            >{{
              utilsFormat.formatPrice(props.box_detail.sellingPrice) || "--"
            }}
            {{
              props.box_detail.sellingPrice
                ? utilsFormat.getTokenCurrency(props.box_detail.payToken)
                : ""
            }}</span
          >
          <svg-icon
            name="update"
            class="edit-icon"
            @click="actionsCall('UpdateBid')"
            v-if="props.box_detail.onSell"
          ></svg-icon>
        </div>
        <div class="lastest-price price-content-style">
          <span>{{ $t("最高出价") }}：</span>
          <span v-if="Number(props.box_detail.topBidPrice) > 0">
            {{ utilsFormat.formatPrice(props.box_detail.topBidPrice) }}
            {{ utilsFormat.getTokenCurrency(props.box_detail.payToken) }}
          </span>
          <span v-else>
            {{ $t("暂无报价") }}
          </span>
        </div>
      </div>
      <div class="blind-offer-actions" v-if="props.box_detail.onSell">
        <span
          :style="{
            cursor: props.box_detail.topBidPrice <= 0 ? 'default' : 'pointer',
          }"
          :class="
            props.box_detail.topBidPrice === 0
              ? 'accept-bid disabled-status'
              : 'accept-bid'
          "
          @click="
            () => {
              if (props.box_detail.topBidPrice > 0) {
                actionsCall('AcceptBid');
              }
            }
          "
          >{{ $t("接受报价") }}
          {{
            formatPriceWithLength(
              props.box_detail.topBidPrice,
              props.box_detail.payTokenPrecision
            )
          }}
          {{ utilsFormat.getTokenCurrency(props.box_detail.payToken) }}
        </span>
        <span class="cancel-sell" @click="actionsCall('CancelSell')">{{
          $t("取消出售")
        }}</span>
      </div>
      <div v-else>
        <div class="sold-out">
          <span class="sold-out-action all-horizontal">{{ $t("售罄") }}</span>
        </div>
      </div>
    </div>
    <!-- 售罄 -->
    <div class="sold-out" v-if="props.action_type === 'SOLDOUT'">
      <span class="sold-out-action all-horizontal">{{ $t("售罄") }}</span>
    </div>
    <!-- 回收状态 -->
    <div class="blind-recovery" v-if="props.action_type === 'RECOVERY'">
      <div class="recovery-price-count">
        <p class="recovery-price price-content-style">
          <span> {{ $t("回收价格") }}:</span>
          <span
            >{{ props.box_detail.buyPrice }}
            {{ props.box_detail.payToekn || "STC" }}</span
          >
        </p>
        <p class="holding-count price-content-style">
          <span>{{ $t("持有数量") }}:</span>
          <span> {{ props.box_detail.userHoldAmount }}</span>
        </p>
      </div>
      <div
        class="recovery-actions all-horizontal"
        @click="
          () => {
            if (props.box_detail.userHoldAmount > 0) {
              actionsCall('Recovery');
            }
          }
        "
        :style="{
          cursor: props.box_detail.userHoldAmount === 0 ? 'default' : 'pointer',
        }"
        :class="{
          'disabled-status': props.box_detail.userHoldAmount === 0,
        }"
      >
        <span class="sell">{{ $t("出售") }}</span>
      </div>
    </div>
    <search-currency
      :dialogVisible="state.isShowSearchDialog"
      @handleClose="handleClose"
      @handleSelect="handleSelectCurrency"
    ></search-currency>
  </div>
</template>
<script setup>
/* eslint-disable */
import { reactive, computed, defineEmits, defineProps, onMounted } from "vue";
import StarInput from "@StarUI/StarInput.vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import SearchCurrency from "@components/SearchCurrency";
import { useRoute } from "vue-router";
const route = useRoute();
import { useStore } from "vuex";
const store = useStore();
import utilsFormat from "@utils/format";
import StarButton from "@StarUI/StarButton.vue";
let state = reactive({
  value: "",
  isShowSearchDialog: false, // 是否出现币种弹窗
  current_currency: computed(() => store.state.StoreNFTDetail.sell_currency), // 当前选择出售币种
  buy_back_price: "", // 平台回购单独取价格
  accounts: computed(() => store.state.StoreWallet.accounts),
});
const props = defineProps({
  is_sell: false, // 是否是出售
  box_detail: {}, // 详情信息
  action_type: String, // 操作类型  SELL 出售 OWNERSELL 本人出售 BUYERSELL 购买者 SOLDOUT售罄 RECOVERY回收
  is_blind_open: Boolean, // 盲盒是否开启
});

const formatPriceWithLength = (price, precision) => {
  const t = utilsFormat.formatPrice(price, precision, { grouped: false });
  if (t && t.length > 3) {
    return t.slice(0, 3) + "...";
  }
  return t;
};

// 输入框赋值
const inputEvent = (e) => {
  // state.value = e;
  props.box_detail.sellingPrice = e;
};
// 展示币种筛选
const showCurrencyListDialog = () => {
  state.isShowSearchDialog = true;
};
// 选择币种
const handleSelectCurrency = (item) => {
  const { shortName } = item;
  state.isShowSearchDialog = false;
  store.commit("StoreNFTDetail/SELL_CURRENCY", shortName);
};
// 关闭币种选择弹窗
const handleClose = () => {
  state.isShowSearchDialog = false;
};
// 所有操作跟父组件交互
const emits = defineEmits(["actionsCall", "getUpdateValue"]);
const actionsCall = (action) => {
  emits("actionsCall", { action: action });
};
const updatePrice = () => {
  state.isShowQuotationDialog = true;
};
const inputEventQuotation = (e) => {
  state.quotationMsg.priceValue = e;
};
const handleConfirm = () => {
  state.isShowQuotationDialog = false;
  emits("getUpdateValue", state.quotationMsg.priceValue);
};
const handleCloseQuotation = () => {
  state.isShowQuotationDialog = false;
};
</script>
<style lang="scss" scoped>
.edit-icon {
  width: 20px;
  height: 20px;
  margin-left: 10px;
}
.nft-goods-detail-action {
  flex: 1;
}
.sell-blind {
  height: calc(100% - 50px);
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  padding-top: 50px;
}
.trade-input {
  width: 100%;
  height: 72px;
  position: relative;
  border: 1px solid #ededed;
  background: #ffffff;
  border-radius: 16px;

  .trade-star-input {
    height: 72px;
    line-height: 72px;
    position: absolute;
    left: 18px;
    top: 0;
    font-size: 24px;
    font-weight: 500px;
    ::v-deep(.el-input__inner) {
      border: none;
      color: #000;
    }
  }
  &:hover {
    border: 2px solid #ededed;
  }
  &:focus-within {
    border: 2px solid #000000;
  }
  .currency-select {
    height: 72px;
    line-height: 72px;
    position: absolute;
    right: 18px;
    top: 0;
    font-weight: 500;
    font-size: 20px;
    color: #000000;
    cursor: pointer;
  }
}
.actions-button {
  width: 100%;
  border-radius: 19px;
  height: 46px;
  line-height: 46px;
  text-align: center;
  font-weight: 600;
  cursor: pointer;
  background-color: #f88000;
  color: #fff;
}
.blind-buttons {
  display: flex;
  justify-content: space-between;
  div {
    height: 46px;
    height: 46px;
  }
}
.sell-blind-box {
  border: 1px solid #f88000;
  margin-bottom: 17px;
  background-color: #f88000;
  color: #ffffff;
}

.on-offer-blind {
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}
.blind-offer-price {
  flex: 1;
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  color: #000000;
  .sell-price {
    margin-bottom: 16px;
    text-align: left;
    span {
      display: block;
    }
    :first-child {
      font-size: 14px;
      color: #3f1c09;
    }
  }
  .lastest-price {
    text-align: left;
    span {
      display: block;
    }
    :first-child {
      font-size: 14px;
      color: #3f1c09;
    }
  }
}
.blind-offer-actions {
  display: flex;
  justify-content: space-between;
  span {
    cursor: pointer;
    flex: 1;
    display: inline-block;
    height: 46px;
    line-height: 46px;
    text-align: center;
    margin-right: 16px;
    border-radius: 16px;
    background: #f88000;
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;

    &:last-child {
      margin: 0;
      background: #fffaf3;
      color: #f36346;
      border: 1px solid #f36346;
    }
  }
}
.cancel-sell {
  cursor: pointer;
}
.sold-out {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: flex-end;
}
.accept-bid {
  cursor: pointer;
}
.all-horizontal {
  cursor: pointer;
  display: inline-block;
  width: 100%;
  height: 46px;
  background: #d1d1d1;
  border-radius: 16px;
  text-align: center;
  line-height: 46px;
  color: #9e9e9e;
  font-weight: 500;
}
.disabled-status {
  background: #d1d1d1 !important;
  color: #9e9e9e !important;
}
.blind-recovery {
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  .recovery-price-count {
    padding-top: 24px;
    flex: 1;
    text-align: left;
    font-weight: 500;
    .recovery-price {
      font-size: 24px;
      color: #000000;
      span {
        display: block;
      }
      :first-child {
        font-size: 14px;
        color: #3f1c09;
      }
    }
    .holding-count {
      margin-top: 16px;
      font-size: 24px;
      color: #3f1c09;
      span {
        display: block;
      }
      :first-child {
        font-size: 14px;
        color: #3f1c09;
      }
    }
  }
  .recovery-actions {
    background: #f88000;
    color: #ffffff;
  }
  .price-content-style {
    text-align: left;
  }
}
</style>
