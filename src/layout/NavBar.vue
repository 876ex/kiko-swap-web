<template>
  <div class="star-nav">
    <!-- <star-button type="dark">
      {{ $t("链接钱包") }}
    </star-button> -->

    <connect-wallet> </connect-wallet>
    <star-drop-down
      :menus="state.languages"
      @clickEvent="changeLang"
      :activeValue="state.currLang"
    >
      <template #placeholder>
        <star-button type="light" class="lang" style="background: #f9efe4">
          {{ lang }}
        </star-button>
      </template>
    </star-drop-down>
    <div class="star-nav-setting" @click="changeSettingVisible(true)">
      <svg-icon name="setting"></svg-icon>
    </div>
    <setting-dialog
      :dialogVisible="state.isShowSettings"
      @handleClose="changeSettingVisible(false)"
    />
  </div>
</template>

<script setup>
/* eslint-disable */
// import { defineEmits } from "vue";
import StarButton from "@StarUI/StarButton.vue";
import ConnectWallet from "@components/ConnectWallet.vue";
import StarDropDown from "@StarUI/StarDropDown.vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import session from "@utils/session";
import SettingDialog from "@components/SettingDialog.vue";
import {
  computed,
  onMounted,
  reactive,
  defineProps,
  defineEmits,
  h,
  ref,
  getCurrentInstance,
} from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import i18n from "../i18n";

const store = useStore();

let state = reactive({
  languages: computed(() => store.state.StoreApp.languages),
  currLang: computed(() => store.state.StoreApp.currLang),
  isShowSettings: computed(() => store.state.StoreApp.isShowSettings),
});
const lang = computed(() => {
  return state.languages.filter((d) => d.value === state.currLang)[0].label;
});

let dialogVisible = ref(false);

const changeLang = (value) => {
  if (value !== state.currLang) {
    session.setItem("language", value);
    store.dispatch("StoreApp/changeLanguage", value);
    i18n.global.locale.value = value;
  }
};

const changeSettingVisible = (type) => {
  store.commit("StoreApp/CHANGE_SETTING_VISIBLE", type);
};
</script>

<style lang="scss" scoped>
.star-nav {
  // position: fixed;
  top: 0;
  right: 30px;
  display: flex;
  position: absolute;
  align-items: center;
  // z-index: 4;
  height: 72px;
  // background: #f9efe4;
  // width: calc(100% - 230px);
  justify-content: flex-end;
  .lang {
    margin-left: 25px;
    box-sizing: border-box;
    height: 35px;
    line-height: 35px;
    padding: 0 16px;
    width: 100px;
  }
  .star-nav-setting {
    margin-left: 15px;
    width: 40px;
    height: 35px;
    background: #e9ded1;
    border-radius: 8px;
    text-align: center;
    line-height: 35px;
    &:hover {
      opacity: 0.7;
      cursor: pointer;
    }
    ::v-deep(.el-dialog__header) {
      text-align: left !important;
    }
    ::v-deep(.setting) {
      p {
        text-align: left;
      }
    }
  }
}
</style>
