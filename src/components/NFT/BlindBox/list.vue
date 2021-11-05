<template>
  <div>
    <star-scroll
      :hasMore="state.listStatus.hasMore"
      :isLoading="state.listStatus.isLoading"
      :isShowMore="false"
      @loadMore="loadMore"
      :textLoading="false"
      gifType="white"
      :imgLoading="true"
      v-if="state.listData && state.listData.length > 0 && !state.firstLoading"
    >
      <template #content>
        <div class="nft-blindbox-list">
          <div
            v-for="(d, i) in state.listData"
            :key="i"
            class="nft-blindbox-list-item"
            :set="(sellInfo = sellStatus(d.type, d.sellingTime))"
            @click="pushDetailPage(d.id)"
          >
            <img :src="d.boxTokenLogo" alt="" />
            <div class="nft-blindbox-list-item-right">
              <star-space :size="15"></star-space>
              <p class="nft-blindbox-list-item-right-title">
                {{ d.seriesName }}-{{ d.name }}
              </p>
              <star-space :size="10"></star-space>
              <p
                class="nft-blindbox-list-item-right-status"
                :class="sellInfo.status"
              >
                {{ $t(sellInfo.text) }}
              </p>
              <star-space :size="50"></star-space>
              <p class="nft-blindbox-list-item-right-countdown">
                {{
                  (state.timers &&
                    state.timers[i] &&
                    state.timers[i].loaded &&
                    state.timers[i].countdown) ||
                  ""
                }}
              </p>
              <star-space :size="10"></star-space>
              <p class="nft-blindbox-list-item-right-detail">
                <span>{{ $t("剩余数量") }}：{{ d.amount }}</span>
                <span
                  >{{ $t("售价") }}：{{ d.sellingPrice }}
                  {{ utilsFormat.getTokenCurrency(d.payToken) }}</span
                >
              </p>
            </div>
          </div>
        </div>
      </template>
    </star-scroll>
    <star-loading-fish
      style="margin-top: 30px"
      gifType="white"
      v-if="state.firstLoading"
    ></star-loading-fish>
  </div>
</template>
<script setup>
/* eslint-disable */
import {
  computed,
  onMounted,
  reactive,
  defineProps,
  defineEmits,
  onUnmounted,
  watch,
} from "vue";
import StarSpace from "@StarUI/StarSpace.vue";
import StarScroller from "@StarUI/StarScroller.vue";
import utilsDate from "@utils/date.js";
import { isUndefined, cloneDeep } from "lodash";
import dayjs from "dayjs";
import utilsFormat from "@utils/format";
import StarLoadingFish from "@StarUI/StarLoadingFish.vue";
import StarScroll from "@StarUI/StarScroll.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const store = useStore();
const router = useRouter();

let state = reactive({
  listData: computed(() => store.state.StoreBlindBox.listData),
  timers: null,
  listStatus: computed(() => store.state.StoreBlindBox.listStatus),
  firstLoading: computed(() => store.state.StoreBlindBox.firstLoading),
});

const formateDate = (obj) => {
  const { day, hour, minute, second } = obj;
  if (
    isUndefined(day) &&
    isUndefined(hour) &&
    isUndefined(minute) &&
    isUndefined(second)
  ) {
    return;
  }
  return `${day === 0 ? "" : `${day}D`} ${hour}:${minute}:${second}`;
};

const playTimer = () => {
  state.timer = setInterval(() => {
    for (let key in state.timers) {
      state.timers[key].countdown = formateDate(
        utilsDate.countdown(state.timers[key].sellingTime)
      );
      state.timers[key].loaded = true;
    }
  }, 1000);
};

const loadMore = () => {
  console.log("loadMore", loadMore);
  store.dispatch("StoreBlindBox/getOfferingList", { type: "scroll" });
};

watch(
  () => state.listData,
  () => {
    state.timers = cloneDeep(state.listData);
    state.timers.map((d) => {
      if (d.type === "willsell") {
        d.countdown = d.sellingTime;
      } else {
        d.countdown = "";
      }
    });
    playTimer();
  }
);

onMounted(async () => {
  if (!state.listData || (state.listData && state.listData.length === 0)) {
    const data = await store.dispatch("StoreBlindBox/getOfferingList", {
      type: "init",
    });
    if (data && data.length) {
      state.timers = cloneDeep(data);
      state.timers.map((d) => {
        if (d.type === "willsell") {
          d.countdown = d.sellingTime;
        } else {
          d.countdown = "";
        }
      });
      playTimer();
    }
  }
});

onUnmounted(() => {
  // store.commit("StoreBlindBox/CLEAR_DATA");
});

const pushDetailPage = (groupId) => {
  router.push({
    path: `/nftblindbox/${groupId}`,
  });
};

const sellStatus = (type, sellingTime) =>
  computed(() => {
    {
      if (type === "willsell") {
        if (dayjs().isAfter(sellingTime)) {
          return {
            status: "selling",
            text: "售卖中",
          };
        }
        return {
          status: "willsell",
          text: "即将出售",
        };
      }
      if (type === "selling") {
        return {
          status: "selling",
          text: "售卖中",
        };
      }
      if (type === "sellout") {
        return {
          status: "sellout",
          text: "已售罄",
        };
      }
    }
  }).value;
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.nft-blindbox-list-item:not(:first-child) {
  margin-top: 20px;
}
.nft-blindbox-list-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  border-radius: 16px;
  overflow: hidden;
  background-color: #fff;
  &:hover {
    opacity: 0.9;
  }
  img {
    width: 360px;
    height: 220px;
  }
  .nft-blindbox-list-item-right {
    text-align: left;
    width: calc(100% - 400px);
    .nft-blindbox-list-item-right-title {
      color: $text-brown-color;
      font-size: 32px;
      font-weight: 600;
    }
    .nft-blindbox-list-item-right-status {
      font-size: 20px;
      &.willsell {
        color: $text-green-color;
      }
      &.selling {
        color: $text-orange-color;
      }
      &.sellout {
        color: $text-gray4-color;
      }
    }
    .nft-blindbox-list-item-right-countdown,
    .nft-blindbox-list-item-right-detail {
      color: $text-brown-color;
      font-size: 14px;
    }
    .nft-blindbox-list-item-right-detail {
      span + span {
        margin-left: 20px;
      }
    }
  }
}
</style>
