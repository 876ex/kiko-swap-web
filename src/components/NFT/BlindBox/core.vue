<template>
  <div class="nft-blindbox-core" v-if="state.blindBoxData">
    <div class="nft-blindbox-core-header">
      <div class="nft-blindbox-core-header-left">
        <img :src="state.blindBoxData.boxTokenLogo" />
      </div>
      <div class="nft-blindbox-core-header-right">
        <p class="nft-blindbox-core-header-right-title">
          {{ state.blindBoxData.name }}
        </p>
        <star-space :size="40"></star-space>
        <p class="nft-blindbox-core-header-right-price">
          <span>{{ $t("售价") }}</span>
          <span> {{ state.blindBoxData.sellingPrice }} STC</span>
        </p>
        <star-space :size="10"></star-space>
        <p
          class="nft-blindbox-core-header-right-quantity"
          v-if="state.remainQuantity"
        >
          <span>{{ $t("剩余数量") }}</span>
          <span>{{ state.remainQuantity }}</span>
        </p>
        <star-space :size="60"></star-space>
        <template v-if="state.walletStatus === 'unConnected'">
          <star-button
            type="light"
            class="nft-blindbox-core-header-right-button light"
            @click="connectWallet"
          >
            {{ $t("链接钱包") }}
          </star-button>
        </template>
        <template v-if="state.walletStatus === 'connected'">
          <star-button
            type="brown"
            class="nft-blindbox-core-header-right-button"
            :style="{ cursor: 'default' }"
            v-if="
              productStatus === 'unopened' && state.sellingTime && state.loaded
            "
          >
            <p>{{ t("即将到来") }}： {{ state.sellingTime }}</p>
          </star-button>
          <star-button
            type="dark"
            class="nft-blindbox-core-header-right-button"
            @click="changeBuyModalStatus(true)"
            v-if="
              productStatus === 'ongoing' ||
              (state.loaded &&
                !state.sellingTime &&
                productStatus !== 'sellout')
            "
          >
            {{ $t("购买") }}
          </star-button>
          <star-button
            type="disabled"
            class="nft-blindbox-core-header-right-button"
            v-if="productStatus === 'sellout'"
            :style="{ cursor: 'default' }"
          >
            {{ $t("售罄") }}
          </star-button>
        </template>
      </div>
    </div>
    <star-space :size="40"></star-space>
    <div class="nft-blindbox-core-introduces">
      <div v-for="(d, i) in state.blindBoxData.introduces" :key="i">
        <star-space :size="30" v-if="i !== 0"></star-space>
        <p class="nft-blindbox-core-introduces-title">{{ t(`${d.title}`) }}</p>
        <star-space :size="15"></star-space>
        <p class="nft-blindbox-core-introduces-desc">
          {{
            state.lang === "en"
              ? `${d.enDesc}`
              : state.lang === "zh"
              ? `${d.cnDesc}`
              : ""
          }}
        </p>
      </div>
    </div>
    <star-confirm
      :title="t('购买盲盒')"
      :dialogVisible="state.isShowBuyModal"
      class="nft-blindbox-core-buy-dialog"
      :isCustomContent="true"
      @handleClose="changeBuyModalStatus(false)"
      @handleSuccess="handleDialog('success')"
      @handleFailed="handleDialog('failed')"
    >
      <template #core>
        <div class="nft-blindbox-core-buy-dialog-content">
          <!-- <p>
            {{
              t("剩余可购买", {
                content: state.remainQuantity,
              })
            }}
          </p> -->
          <star-space :size="10"></star-space>
          <star-input-number
            width="100%"
            :value="state.inputVal"
            @inputEvent="inputEvent"
            :max="10"
          ></star-input-number>
          <star-space :size="10"></star-space>
          <div class="nft-blindbox-core-buy-dialog-content-details">
            <span>{{ t("总价") }}：{{ totalCost }} STC</span>
            <span>{{ t("可用") }}：{{ userAmount }} STC</span>
          </div>
          <div class="nft-blindbox-core-buy-dialog-content-errors">
            <!-- <p v-if="state.errors[0]">
              * {{ t("购买数量需小于剩余可购买数量") }}
            </p> -->
            <p v-if="state.errors[1]">* {{ t("可用金额不足") }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="nft-blindbox-core-buy-dialog-footer">
          <star-button type="light" @click="changeBuyModalStatus(false)">
            {{ t("取消") }}
          </star-button>
          <star-button type="dark" @click="buyBlindBox">
            {{ t("确认") }}
          </star-button>
        </div>
      </template>
    </star-confirm>
    <nft-dialog
      :dialogVisible="state.dialogParams.isShow"
      :isShowClose="!(state.dialogParams.dialogStatus === 'ongoing')"
      class="nft-blindbox-core-buycb-dialog"
      :dialogParams="state.dialogParams"
      @handleClose="handleCloseBuyCbModal"
      @handleSuccess="handleSuccess"
      @handleFailed="handleFailed"
    ></nft-dialog>
    <nft-sold-out-dialog
      :dialogVisible="state.soldDialogParams.isShow"
      :dialogParams="state.soldDialogParams"
      @handleClose="handleSoldOutCloseFunc"
      @handleConfirm="handleSoldOutConfirmFunc"
    >
    </nft-sold-out-dialog>
  </div>
</template>
<script setup>
import {
  computed,
  ref,
  reactive,
  onUnmounted,
  watch,
  onBeforeMount,
} from "vue";
import StarConfirm from "@StarUI/StarConfirm";
import NFT_CONSTANTS from "@constants/nft.js";
import NftDialog from "@components/NFT/NFTDialog.vue";
import StarSpace from "@StarUI/StarSpace.vue";
import StarButton from "@StarUI/StarButton.vue";
import StarInputNumber from "@StarUI/StarInputNumber.vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import utilsDate from "@utils/date.js";
import { isUndefined } from "lodash";
import { useRouter, useRoute } from "vue-router";
import utilsNumber from "@utils/number";
import utilsFormat from "@utils/format";
import connectLogic from "../../../mixins/wallet";
import CONSTANTS_TOKENS from "@constants/token";
import NftSoldOutDialog from "@components/NFT/NFTSoldOutDialog.vue";
const store = useStore();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const { connectWallet } = connectLogic(store);
let state = reactive({
  lang: computed(() => store.state.StoreApp.currLang),
  blindBoxData: computed(() => store.state.StoreBlindBox.blindBoxData),
  sellingTime: null,
  walletStatus: computed(() => store.state.StoreWallet.walletStatus),
  timer: null, //倒计时定时器
  balances: computed(() => store.state.StoreWallet.balances),
  isShowBuyModal: computed(() => store.state.StoreBlindBox.isShowBuyModal),
  remainQuantity: computed(() => store.state.StoreBlindBox.remainQuantity),
  inputVal: 1,
  loaded: false,
  errors: [false, false],
  buyStatus: computed(() => store.state.StoreBlindBox.buyStatus),
  provider: computed(() => store.state.StoreWallet.stcProvider),
  dialogParams: computed(() => store.state.StoreBlindBox.dialogParams),
  soldDialogParams: computed(() => store.state.StoreBlindBox.soldDialogParams),
});

const handleSoldOutCloseFunc = () => {
  window.location.reload();
};
const productStatus = computed(
  () => store.getters["StoreBlindBox/productStatus"]
);

const handleCloseBuyCbModal = () => {
  window.location.reload();
  // store.commit(
  //   "StoreBlindBox/CHANGE_BUY_CB_MODAL_STATUS",
  //   NFT_CONSTANTS.INIT_DIALOG_PARAMS
  // );
  // store.dispatch("StoreBlindBox/getOfferingAmount", {
  //   boxToken: state.blindBoxData.boxToken,
  //   type: "detail",
  // });
};

const handleSuccess = () => {
  router.push({
    name: "nftcollection",
    params: {
      tabIndex: 1,
    },
  });
};

const handleFailed = () => {
  window.location.reload();
};

const userAmount = computed(() => {
  return utilsNumber.formatNumberMeta(
    utilsFormat.formatBalance(state.balances[CONSTANTS_TOKENS.STC], 9),
    {
      precision: 0,
    }
  ).text;
});

const handleDialog = (type) => {
  store.commit(
    "StoreBlindBox/CHANGE_BUY_CB_MODAL_STATUS",
    NFT_CONSTANTS.INIT_DIALOG_PARAMS
  );
  if (type === "success") {
    router.push({
      name: "nftcollection",
      params: {
        tabIndex: 1,
      },
    });
  }
};

const totalCost = computed(() => {
  return utilsNumber
    .bigNum(state.blindBoxData.sellingPrice)
    .times(state.inputVal)
    .toString();
});

const formateDate = (obj) => {
  const { day, hour, minute, second } = obj;
  if (
    isUndefined(day) &&
    isUndefined(hour) &&
    isUndefined(minute) &&
    isUndefined(second)
  ) {
    // 倒计时结束。可以售卖
    return;
  }
  return `${day === 0 ? "" : `${day}D`} ${hour}:${minute}:${second}`;
};

const changeBuyModalStatus = (flag) => {
  store.commit("StoreBlindBox/CHANGE_BUY_MODAL_STATUS", flag);
  state.inputVal = 1;
  state.errors = [false, false];
};

const validateVal = () => {
  // if (utilsNumber.bigNum(val).gt(state.remainQuantity)) {
  //   state.errors[0] = true;
  //   return false;
  // }
  if (utilsNumber.bigNum(totalCost.value).gt(userAmount.value)) {
    state.errors[1] = true;
    return false;
  }
  return true;
};

const inputEvent = (e) => {
  state.inputVal = Number(e);
  state.errors = [false, false];
  validateVal(e);
};

const buyBlindBox = async () => {
  state.errors = [false, false];
  if (!validateVal(state.inputVal)) {
    return;
  }
  store.commit("StoreBlindBox/CHANGE_BUY_MODAL_STATUS", false);
  store.commit("StoreBlindBox/CHANGE_BUY_CB_MODAL_STATUS", {
    isShow: true,
  });
  store.dispatch("StoreBlindBox/buyBlindbox", {
    tyArgs: [state.blindBoxData.boxToken, state.blindBoxData.payToken],
    args: [String(state.inputVal)],
    boxToken: state.blindBoxData.boxToken,
  });
};

watch(
  () => state.blindBoxData && state.blindBoxData.sellingTime,
  () => {
    state.timer = setInterval(() => {
      state.sellingTime = formateDate(
        utilsDate.countdown(state.blindBoxData.sellingTime)
      );
      state.loaded = true;
    }, 1000);
  }
);

onBeforeMount(() => {
  const id = ref(route.params.id).value;
  if (id) {
    store.dispatch("StoreBlindBox/getOfferingBoxData", { id });
  }
});

onUnmounted(() => {
  store.commit(
    "StoreBlindBox/CHANGE_BUY_CB_MODAL_STATUS",
    NFT_CONSTANTS.INIT_DIALOG_PARAMS
  );
  if (state.timer) {
    clearInterval(state.timer);
  }
});
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.loading-img {
  width: 140px;
  height: 140px;
}
.nft-blindbox-core {
  .nft-blindbox-core-header {
    display: flex;
    .nft-blindbox-core-header-left {
      background: #ebebeb;
      width: 376px;
      height: 376px;
      border-top: 48px solid #fff;
      border-bottom: 48px solid #fff;
      border-left: 24px solid #fff;
      border-right: 24px solid #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .nft-blindbox-core-header-right {
      color: $text-brown-color;
      margin-left: 33px;
      .nft-blindbox-core-header-right-title {
        font-size: 32px;
        font-family: PingFangSC-Semibold, PingFang SC;
      }
      .nft-blindbox-core-header-right-price {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 16px;
        span {
          display: block;
        }
        :first-child {
          font-size: 14px;
        }
      }
      .nft-blindbox-core-header-right-quantity {
        font-size: 24px;
        font-weight: bold;
        span {
          display: block;
        }
        :first-child {
          font-size: 14px;
        }
      }
      .nft-blindbox-core-header-right-button {
        width: 370px;
        height: 46px;
        line-height: 46px;
        padding: 0px;
        border-radius: 16px;
      }
      .nft-blindbox-core-header-right-button.light {
        background-color: transparent;
      }
    }
  }
  .nft-blindbox-core-introduces {
    color: $text-black-color;
    font-size: 14px;
    color: #391b0f;
    .nft-blindbox-core-introduces-title {
      font-size: 24px;
    }
  }
  .nft-blindbox-core-buy-dialog {
    .nft-blindbox-core-buy-dialog-content-details {
      display: flex;
      justify-content: space-between;
    }
    .nft-blindbox-core-buy-dialog-content-errors {
      margin-top: 3px;
      font-size: 12px;
      text-align: right;
      color: $text-error-color;
    }

    .nft-blindbox-core-buy-dialog-footer {
      display: flex;
      justify-content: space-between;
      .star-button {
        width: 35%;
      }
    }
  }
  .nft-blindbox-core-buycb-dialog {
    .nft-blindbox-core-buycb-dialog-text {
      margin-top: 10px;
      font-size: 16px;
      width: 400px;
    }
    .nft-blindbox-core-buycb-dialog-btn {
      width: 80%;
      margin-left: 10%;
      padding-left: 0px;
      padding-right: 0px;
    }
  }
}
</style>
