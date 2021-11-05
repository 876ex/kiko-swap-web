<template>
  <div class="market-container">
    <star-nft
      class="blind-box-container"
      v-if="state.walletStatus === 'connected'"
    >
      <template #nft-header>
        <list-screen
          @clickSelectJoint="selectCallback"
          @clickRadio="clickRadio"
          :isShowOpenStatus="true"
          :showTips="false"
          :isShowSeries="true"
          :isShowSort="true"
        ></list-screen>
        <div class="blind-box-list">
          <!-- <div :class="{ 'blind-box-list-wrap': state.loading }"> -->
          <star-scroll
            :hasMore="state.listStatus.hasMore"
            :isLoading="state.listStatus.isLoading"
            @loadMore="loadMore"
            :textLoading="false"
            :imgLoading="true"
            :isShowMore="false"
            v-if="market_data && market_data.length > 0 && !state.firstLoading"
          >
            <template #content>
              <div class="blind-box-list-content">
                <list-blind-box-item
                  v-for="(blind, i) in market_data"
                  :key="i"
                  class="list-blind-box-item"
                  cardType="market"
                  sellType="sell"
                  :hasBtn="false"
                  :baseData="blind"
                  @watchDetail="watchDetail(blind)"
                ></list-blind-box-item>
              </div>
            </template>
          </star-scroll>
          <star-loading-fish v-if="state.firstLoading"></star-loading-fish>
          <empty
            v-if="
              !state.firstLoading &&
              ((market_data && market_data.length === 0) || !market_data)
            "
          >
            <template #content>
              <p style="color: #8b8b8b">
                {{ $t("市场无数据文案") }}
              </p>
            </template>
          </empty>
        </div>
      </template>
    </star-nft>
    <star-nft
      class="blind-box-container"
      v-if="state.walletStatus !== 'connected'"
    >
      <template #nft-no-data>
        <nft-no-connected-wallet class="no-data"></nft-no-connected-wallet>
      </template>
    </star-nft>
  </div>
</template>
<script setup>
import StarNft from "@StarUI/StarNFT.vue";
import { reactive, computed, onMounted, onUnmounted } from "vue";
import NftNoConnectedWallet from "@components/NFT/NFTNoConnectedWallet.vue";
import ListScreen from "@components/NFT/ListScreen.vue";
import ListBlindBoxItem from "@components/NFT/ListBlindBoxItem.vue";
import StarScroll from "@StarUI/StarScroll.vue";
import Empty from "@components/NFT/Empty.vue";
import StarLoadingFish from "@StarUI/StarLoadingFish.vue";
import { useRouter } from "vue-router";
const router = useRouter();
import { useStore } from "vuex";
const store = useStore();
let state = reactive({
  walletStatus: computed(() => store.state.StoreWallet.walletStatus),
  marketList: computed(() => store.state.StoreNftMarket.marketList),
  firstLoading: computed(() => store.state.StoreNftMarket.firstLoading),
  listStatus: computed(() => store.state.StoreNftMarket.listStatus),
});

onMounted(() => {
  store.dispatch("StoreNftMarket/queryMarketList", { type: "init" });
});

onUnmounted(() => {
  store.commit("StoreNftMarket/CLEAR_DATA");
});

const market_data = computed(() => store.getters["StoreNftMarket/market_data"]);

// 查看卡片详情
const watchDetail = (detail) => {
  router.push({
    path: "/nftmarketdetail",
    query: {
      id: detail.nftBoxId,
      groupId: detail.groupId,
      type: detail.type,
      chainId: detail.chainId,
    },
  });
};
// 类型筛选
const selectCallback = (item) => {
  const { groupId, sort } = item;
  store.dispatch("StoreNftMarket/changeListQuery", {
    groupId: groupId,
    sort: sort.value,
  });
};

const clickRadio = (data) => {
  const rules = data.map((d) => d.isOpen);
  store.commit("StoreNftMarket/SET_MARKET_LIST_RULE", rules);
};
// 加载数据
const loadMore = () => {
  store.dispatch("StoreNftMarket/queryMarketList", { type: "scroll" });
};
</script>
<style lang="scss" scoped>
.blind-box-container {
  margin: 0 auto;
  padding-bottom: 30px;
  .blind-box-list {
    margin-top: 45px;
    .blind-box-list-content {
      display: flex;
      flex-wrap: wrap;
      .list-blind-box-item {
        margin-right: 30px;
        height: 400px;
        &:nth-child(3n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
