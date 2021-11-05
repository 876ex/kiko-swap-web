<template>
  <div class="recovery-container">
    <star-nft
      class="blind-box-container"
      v-if="state.walletStatus === 'connected'"
    >
      <template #nft-header v-if="state.coreType !== 'card'">
        <list-screen
          @clickSelectJoint="clickSelectJoint"
          :showTips="false"
          :isShowSeries="true"
          :isShowSort="true"
        ></list-screen>

        <div class="blind-box-list">
          <star-scroll
            :hasMore="state.listStatus.hasMore"
            :isLoading="state.listStatus.isLoading"
            @loadMore="loadMore"
            :isShowMore="false"
            :textLoading="false"
            :imgLoading="true"
            v-if="state.buyBackList && state.buyBackList.length > 0"
          >
            <template #content>
              <div class="blind-box-list-content">
                <list-blind-box-item
                  v-for="(blind, i) in state.buyBackList"
                  :key="i"
                  class="list-blind-box-item"
                  cardType="back"
                  sellType=""
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
              ((state.buyBackList && state.buyBackList.length === 0) ||
                !state.buyBackList)
            "
          >
            <template #content>
              <p style="color: #8b8b8b">
                {{ $t("回购无数据文案") }}
              </p>
            </template>
          </empty>
        </div>
      </template>
    </star-nft>

    <star-nft class="blind-box-container" :coreType="state.coreType" v-else>
      <template #nft-no-data>
        <nft-no-connected-wallet class="no-data"></nft-no-connected-wallet>
      </template>
    </star-nft>
  </div>
</template>
<script setup>
import { reactive, computed, onMounted, onUnmounted } from "vue";
import StarNft from "@StarUI/StarNFT.vue";
import ListScreen from "@components/NFT/ListScreen.vue";
import NftNoConnectedWallet from "@components/NFT/NFTNoConnectedWallet.vue";
import ListBlindBoxItem from "@components/NFT/ListBlindBoxItem.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Empty from "@components/NFT/Empty.vue";
import StarScroll from "@StarUI/StarScroll.vue";
import StarLoadingFish from "@StarUI/StarLoadingFish.vue";

const router = useRouter();
const store = useStore();
let state = reactive({
  walletStatus: computed(() => store.state.StoreWallet.walletStatus),
  buyBackList: computed(() => store.state.StoreBuyBack.buyBackList),
  listStatus: computed(() => store.state.StoreBuyBack.listStatus),
  firstLoading: computed(() => store.state.StoreBuyBack.firstLoading),
});

onMounted(() => {
  store.dispatch("StoreBuyBack/getBuyBacklist", { type: "init" });
});

onUnmounted(() => {
  store.commit("StoreBuyBack/CLEAR_PARAMS_DATA");
});

const clickSelectJoint = (item) => {
  // store.dispatch("StoreBuyBack/getBuyBacklist", {
  //   sort: item.sort.value,
  //   groupId: item.groupId,
  // });

  //   const { groupId, sort } = item;
  store.dispatch("StoreBuyBack/changeListQuery", {
    sort: item.sort.value,
    groupId: item.groupId,
  });
};

// 查看卡片详情
const watchDetail = (detail) => {
  router.push({
    path: "/nftbuybackdetail",
    query: {
      type: "back",
      id: detail.id,
      groupId: detail.groupId,
      token: detail.fullCurrency,
    },
  });
};

const loadMore = () => {
  store.dispatch("StoreBuyBack/getBuyBacklist", { type: "scroll" });
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
