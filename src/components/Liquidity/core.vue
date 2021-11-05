<template>
  <div class="liquidity-content">
    <li-header></li-header>
    <star-space :size="20"></star-space>
    <div class="liquidity-content-core">
      <template v-if="state.poolType === 'init'">
        <no-data v-if="!state.hasLiquidity"></no-data>
        <template v-if="state.hasLiquidity">
          <pool-list :data="state.poolList"></pool-list>
        </template>
      </template>
      <template v-if="state.poolType === 'add'">
        <add-pool></add-pool>
      </template>
      <template v-if="state.poolType === 'delete'">
        <del-pool></del-pool>
      </template>
      <star-space :size="20"></star-space>
      <div class="liquidity-content-core-btn">
        <star-button
          type="dark"
          v-if="
            state.walletStatus === 'unConnected' && state.poolType === 'add'
          "
          @click="connectWallet"
        >
          {{ $t("连接钱包") }}
        </star-button>
        <div v-if="state.walletStatus === 'connected' && btnStatus">
          <star-button
            :type="btnStatus.type"
            @click="btnClickEvent(btnStatus.flag)"
            >{{ btnStatus.text }}</star-button
          >
        </div>
      </div>
    </div>
    <search-currency
      :dialogVisible="state.isShowSearchDialog"
      @handleClose="handleClose('isShowSearchDialog')"
      @handleSelect="handleSelectCurrency"
    ></search-currency>
    <history-record
      :historyType="'liquidity'"
      :dialogVisible="state.isShowHistoryRecordDialog"
      @handleClose="handleClose('isShowHistoryRecordDialog')"
    >
    </history-record>
    <star-confirm
      :dialogVisible="state.isShowConfirm"
      @handleClose="handleClose('isShowConfirm')"
    >
      <template #image-logo>
        <img src="../../assets/confirm/confirm-logo.png" />
      </template>
      <template #content-text>
        {{ state.pointer }}
        <p v-if="state.poolType === 'add'">
          {{ $t("流动性添加中") }}
          <br />
          {{ $t("稍后请刷新查看") }}
        </p>
        <p v-if="state.poolType === 'delete'">
          {{ $t("流动性移除中") }}
          <br />
          {{ $t("稍后请刷新查看") }}
        </p>
      </template>
      <template #footer>
        <star-button class="confirm-btn" @click="handleConfirm">{{
          $t("确认")
        }}</star-button>
      </template>
    </star-confirm>
  </div>
</template>
<script setup>
import { computed, reactive, onMounted, watch } from "vue";
import StarConfirm from "@StarUI/StarConfirm.vue";
import StarButton from "@StarUI/StarButton.vue";
import StarSpace from "@StarUI/StarSpace.vue";
import NoData from "./nodata.vue";
import LiHeader from "./header.vue";
import { useStore } from "vuex";
import utilsNumber from "@utils/number";
import { useI18n } from "vue-i18n";
import AddPool from "./addpool.vue";
import DelPool from "./delpool.vue";
import PoolList from "./poollist.vue";
import connectLogic from "@mixins/wallet";
import SearchCurrency from "@components/SearchCurrency";
import HistoryRecord from "@components/HistoryRecord";

const { t } = useI18n();
const store = useStore();

let state = reactive({
  hasLiquidity: computed(() => store.state.StoreLiquidity.hasLiquidity),
  poolType: computed(() => store.state.StoreLiquidity.poolType),
  to: computed(() => store.state.StoreLiquidity.to),
  from: computed(() => store.state.StoreLiquidity.from),
  walletStatus: computed(() => store.state.StoreWallet.walletStatus),
  focusType: null,
  poolList: computed(() => store.state.StoreLiquidity.poolList),
  isShowSearchDialog: computed(
    () => store.state.StoreLiquidity.isShowSearchDialog
  ),
  currencySelectType: computed(
    () => store.state.StoreLiquidity.currencySelectType
  ),
  isShowHistoryRecordDialog: computed(
    () => store.state.StoreLiquidity.isShowHistoryRecordDialog
  ),
  accounts: computed(() => store.state.StoreWallet.accounts),
  isShowConfirm: computed(() => store.state.StoreLiquidity.isShowConfirm),
  delInpVal: computed(() => store.state.StoreLiquidity.delInpVal),
});

const { connectWallet } = connectLogic(store);

const handleClose = (type) => {
  if (type === "isShowSearchDialog") {
    store.commit("StoreLiquidity/HANDLE_CURRENCY_SELECT_VISIBLE", {
      isShow: false,
      type: null,
    });
  }
  if (type === "isShowHistoryRecordDialog") {
    store.commit("StoreLiquidity/CHANGE_HISTORY_RECORD_VISIBLE", false);
  }
  if (type === "isShowConfirm") {
    store.commit("StoreLiquidity/CHANGE_CONFIRM_VISIBLE", false);
  }
};

const handleConfirm = () => {
  store.commit("StoreLiquidity/CHANGE_CONFIRM_VISIBLE", false);
  store.commit("StoreLiquidity/CHANGE_POOL_TYPE", "init");
};

const handleSelectCurrency = (item) => {
  const { shortName, icon, address, exchangePrecision, displayPrecision } =
    item;
  const params = Object.assign(
    {},
    {
      currency: shortName,
      icon,
      token: address,
      exchangePrecision,
      displayPrecision,
    },
    { type: state.currencySelectType }
  );
  store.dispatch("StoreLiquidity/setSelectCurrencyInfo", params);
};
/* eslint-disable*/
const btnStatus = computed(() => {
  if (
    state.poolType === "delete" &&
    state.delInpVal &&
    utilsNumber.bigNum(state.delInpVal).gt(0)
  ) {
    return { type: "light", text: t("移除"), flag: "3" };
  }
  if (
    state.poolType === "delete" &&
    (!state.delInpVal || !utilsNumber.bigNum(state.delInpVal).gt(0))
  ) {
    return { type: "disabled", text: t("请输入数量") };
  }
  // 有流动池且连接
  if (state.hasLiquidity && state.poolType === "init") {
    return { type: "light", text: t("添加流动性"), flag: "1" };
  }

  if (state.poolType === "add" && state.from.inputVal && state.to.inputVal) {
    return { type: "light", text: t("添加"), flag: "2" };
  }

  // 连接状态、币种信息inputVal即可
  if (
    (!state.from.currency || !state.to.currency) &&
    state.poolType === "add"
  ) {
    return { type: "disabled", text: t("请选择币种") };
  }
  if (
    state.from.currency &&
    state.to.currency &&
    (!utilsNumber.bigNum(state.from.inputVal).gt(0) ||
      !utilsNumber.bigNum(state.to.inputVal).gt(0))
  ) {
    return { type: "disabled", text: t("请输入数量") };
  }
  const isGtFrom = utilsNumber
    .bigNum(state.from.inputVal)
    .gt(state.from.balance);
  const isGtTo = utilsNumber.bigNum(state.to.inputVal).gt(state.to.balance);
  if (isGtFrom || isGtTo) {
    return {
      type: "disabled",
      text: t("token余额不足", {
        currency: isGtFrom ? state.from.currency : state.to.currency,
      }),
    };
  }
  // 是否有流动池
  const isQuality = true;
  if (!isQuality) {
    return {
      type: "disabled",
      text: t("没有足够的流动性"),
    };
  }
});

const btnClickEvent = (flag) => {
  if (state.poolType === "add" && flag === "2") {
    store.dispatch("StoreLiquidity/addLiquidity");
    // 添加流动池
  }
  if (state.poolType === "init" && flag === "1") {
    store.commit("StoreLiquidity/CHANGE_POOL_TYPE", "add");
  }
  if (state.poolType === "delete" && flag === "3") {
    store.dispatch("StoreLiquidity/delLiquidity");
  }
};

onMounted(() => {
  store.dispatch(
    "StoreLiquidity/getAllPoolListByUser",
    state.accounts[0] || null
  );
});

// 钱包链接
watch(
  () => state.accounts,
  (n) => {
    store.dispatch("StoreLiquidity/getAllPoolListByUser", (n && n[0]) || null);
  }
);

watch(
  () => state.poolType,
  (n) => {
    if (n === "init") {
      store.dispatch(
        "StoreLiquidity/getAllPoolListByUser",
        state.accounts[0] || null
      );
    }
  }
);
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.confirm-btn {
  width: 100%;
  padding: 15px 0px;
  font-weight: bold;
  font-size: 16px;
}
.liquidity-content {
  width: 100%;
  color: $text-black-color;
  .liquidity-content-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .liquidity-content-header-left {
      display: flex;
      align-items: center;
      p,
      span {
        font-size: 20px;
        font-weight: 600;
      }
      .svg-icon {
        width: 50px;
        height: 40px;
        margin-right: 10px;
      }
    }
    .liquidity-content-header-right {
      .svg-icon {
        width: 18px;
        height: 18px;
      }
      .svg-icon:last-child {
        margin-left: 15px;
      }
    }
  }
  .liquidity-content-core {
    .liquidity-content-core-detail {
      padding: 0px 16px;
      .liquidity-content-core-detail-price {
        display: flex;
        align-items: center;
        justify-content: space-around;
        span {
          display: inline-block;
          flex: 1;
        }
        span:nth-child(2) {
          flex: 4;
        }
        span:last-child {
          text-align: right;
        }
      }
      .liquidity-content-core-detail-slippage {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .liquidity-content-core-btn {
      .star-button {
        width: 100%;
        padding: 15px 0px;
      }
    }
  }
}
</style>
