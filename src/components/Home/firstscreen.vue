<template>
  <div :class="$style['screen-container']">
    <!-- 草 -->
    <div :class="$style['screen-container-grass']">
      <img
        :src="HOME_CONSTANTS.GRASS_ONE"
        :class="$style['screen-container-grass1']"
      />
      <img
        :src="HOME_CONSTANTS.GRASS_TWO"
        :class="$style['screen-container-grass2']"
      />
    </div>
    <!-- 太阳 -->
    <div
      v-if="state.isShowSun"
      :class="$style['screen-container-sun']"
      class="animate__animated animate__fadeInDownBig"
    ></div>

    <img
      :src="HOME_CONSTANTS.SWALLOW_GROUP"
      :class="$style['screen-container-swallow']"
    />
    <!-- 猫 -->
    <div :class="$style['screen-container-cat']">
      <img
        :src="HOME_CONSTANTS.CAT_IN"
        :class="$style['screen-container-cat-in']"
        v-if="!state.isShowWinkCat"
      />
      <img
        :src="HOME_CONSTANTS.CAT_WINK"
        v-if="state.isShowWinkCat"
        :class="$style['screen-container-cat-pos']"
      />
    </div>
    <div :class="$style['screen-container-main']">
      <img
        src="../../assets/home/firstscreen-content-title.png"
        :class="$style['screen-container-main-title']"
      />
      <img
        :src="state.currLang === 'zh' ? descZhPNG : descPNG"
        :class="$style['screen-container-main-desc']"
      />
      <div :class="$style['screen-container-main-footer']">
        <star-button
          type="dark"
          :class="$style['screen-container-main-footer-btn']"
          @click="btnClick"
        >
          <span v-if="state.walletStatus !== 'connected'">
            {{ $t("链接钱包") }}
          </span>
          <span v-else>
            {{ $t("立即交易") }}
          </span>
        </star-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive } from "vue";
import StarButton from "@StarUI/StarButton.vue";
import HOME_CONSTANTS from "@constants/home";
import { useStore } from "vuex";
import utilsRouter from "@utils/router";
import connectLogic from "@mixins/wallet";
const descZhPNG = require("../../assets/home/firstscreen-content-desc-zh.png");
const descPNG = require("../../assets/home/firstscreen-content-desc.png");

const store = useStore();

const { connectWallet } = connectLogic(store);

let state = reactive({
  isShowWinkCat: false,
  isShowSun: true,
  walletStatus: computed(() => store.state.StoreWallet.walletStatus),
  currLang: computed(() => store.state.StoreApp.currLang),
});

onMounted(() => {
  setTimeout(() => {
    state.isShowSun = true;
  }, 600);
  setTimeout(() => {
    state.isShowWinkCat = true;
  }, 3500);
});

const btnClick = () => {
  if (state.walletStatus === "connected") {
    utilsRouter.push({
      path: "/swap",
    });
  } else {
    connectWallet();
  }
};
</script>
<style lang="scss" module>
@import "./animation.scss";
.screen-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-image: url("../../assets/home/firstscreen-bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  animation-name: zoom_bg;
  animation-duration: 1.2s;
  animation-timing-function: ease-out;
  .screen-container-grass {
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    height: 200px;
    .screen-container-grass1 {
      position: absolute;
      top: 25px;
      left: -300px;
      animation-name: grass1_slide;
      animation-duration: 0.5s;
      transform: rotate(-10deg);
      animation-delay: 550ms;
      animation-timing-function: cubic-bezier(1, 0.5, 0.8, 1);
      animation-fill-mode: forwards;
    }
    .screen-container-grass2 {
      position: absolute;
      top: -50px;
      left: -300px;
      animation-name: grass2_slide;
      animation-duration: 0.5s;
      animation-delay: 550ms;
      animation-timing-function: cubic-bezier(1, 0.5, 0.8, 1);
      animation-fill-mode: forwards;
    }
  }
  .screen-container-swallow {
    position: absolute;
    top: 20%;
    left: 40%;
    transform: scale(0.6);
  }
  .screen-container-cat {
    .screen-container-cat-pos {
      position: absolute;
      right: -30px;
      // bottom: -400px;
      bottom: -380px;
    }
    .screen-container-cat-in {
      position: absolute;
      animation-name: cat_in;
      animation-duration: 0.8s;
      right: -2000px;
      animation-delay: 700ms;
      animation-timing-function: ease;
      animation-fill-mode: forwards;
    }
  }
  .screen-container-sun {
    width: 110px;
    height: 110px;
    background: #fbf3e4;
    border-radius: 50px;
    position: absolute;
    top: 40%;
    left: 40%;
  }
  .screen-container-main {
    position: absolute;
    left: 15vh;
    animation-name: to_top;
    animation-delay: 2.5s;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
    opacity: 0;
    img {
      display: block;
      width: 70%;
    }
    .screen-container-main-desc {
      margin-top: 40px;
    }
    .screen-container-main-footer {
      position: absolute;
      margin-top: 40px;
      width: 60%;
      .screen-container-main-footer-btn {
        padding: 15px 45px;
        font-size: 20px;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
