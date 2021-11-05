<template>
  <div class="star-sidebar">
    <div class="star-sidebar-logo">
      <img src="../assets/sidebar/logo.png" />
      <img src="../assets/sidebar/logo-title.png" />
    </div>
    <ul class="star-sidebar-menu">
      <li v-for="(d, i) in menus" :key="i" @click="pushPage(d.path)">
        <template v-if="!d.children">
          <div class="star-sidebar-menu-item">
            <star-light-block
              v-if="d.path === state.currentRoute"
            ></star-light-block>
            <span class="star-sidebar-menu-item-label">{{ $t(d.label) }}</span>
          </div>
        </template>
        <template v-if="d.children && d.children.length">
          <div class="star-sidebar-submenu" @click="setCollapseStatus(d.label)">
            <span>
              {{ $t(d.label) }}
            </span>
            <svg-icon
              :name="
                !state.collapseObj[d.label]
                  ? 'slider-arrow-down'
                  : 'slider-arrow-up'
              "
              class="icon"
            ></svg-icon>
          </div>
          <div
            :style="{
              height: state.collapseObj[d.label]
                ? `${46 * d.children.length}px`
                : '0px',
            }"
            class="star-sidebar-submenu-item-wrap"
            :class="{ isActive: state.collapseObj[d.label] }"
          >
            <div
              v-for="dd in d.children"
              :key="dd"
              class="star-sidebar-submenu-item"
              @click.prevent="pushPage(dd.path)"
            >
              <star-light-block
                v-if="showRouterTag(dd.path, state.currentRoute)"
              ></star-light-block>
              <span class="star-sidebar-submenu-label">{{ $t(dd.label) }}</span>
            </div>
          </div>
        </template>
      </li>
    </ul>
    <div class="star-sidebar-icons">
      <a href="https://twitter.com/Kiko_Swap" target="_blank"
        ><img src="../assets/sidebar/twitter.png" alt=""
      /></a>
      <a href="https://t.me/kikoswap" target="_blank"
        ><img src="../assets/sidebar/telegram.png" alt=""
      /></a>
      <a href="https://medium.com/@kikoswap" target="_blank"
        ><img src="../assets/sidebar/medium.png" alt=""
      /></a>
    </div>
  </div>
</template>
<script setup>
/* eslint-disable */
import { computed, reactive, onMounted } from "vue";
import StarLightBlock from "@StarUI/StarLightBlock.vue";
import menus from "./menu.js";
import { useRouter, useRoute } from "vue-router";
import SvgIcon from "@components/SvgIcon/Index.vue";
import { has, isObject } from "lodash";
const router = useRouter();
const route = useRoute();

const state = reactive({
  menus,
  currentRoute: computed(() => route.path),
  collapseObj: {},
});
const pushPage = (path) => {
  if (!path) return;
  if (isObject(path)) {
    router.push(path);
  } else {
    router.push({
      path,
    });
  }
};
const setCollapseStatus = (label) => {
  if (has(state.collapseObj, label)) {
    state.collapseObj[label] = !state.collapseObj[label];
  } else {
    state.collapseObj[label] = true;
  }
};
const showRouterTag = (path, currentRoute) => {
  if (isObject(path)) {
    if (currentRoute.indexOf(path.name) > -1) {
      return true;
    }
  }
  if (currentRoute.indexOf(path) > -1) {
    return true;
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
@import "~@/styles/mixin.scss";
.star-sidebar {
  user-select: none;
  width: 200px;
  height: 100%;
  background: $white;
  box-shadow: 0px -1px 0px 0px rgba(222, 213, 219, 0.29);
  // border-radius: 0px 30px 30px 0px;
  overflow: hidden;
  .star-sidebar-logo {
    height: 100px;
    display: flex;
    align-items: center;
    padding: 0px 15px;
    .img {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
    img:first-child {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    img:last-child {
      margin-left: 20px;
      width: 75px;
    }
  }
  .star-sidebar-menu {
    color: $text-brown-color;
    font-size: 16px;
    font-weight: 600;
    .star-sidebar-menu-item {
      display: flex;
      align-items: center;
      height: 46px;
      padding: 0px 15px;
      .star-sidebar-menu-item-label {
        margin-left: 20px;
      }
      &:hover {
        @include commonHoverStyle();
        opacity: 0.5;
      }
    }
    .star-sidebar-submenu {
      height: 46px;
      padding: 0px 15px;
      justify-content: space-between;
      padding-right: 30px;
      display: flex;
      align-items: center;
      margin-left: 20px;

      .icon {
        width: 10px;
        height: 10px;
      }
      &:hover {
        opacity: 0.5;
        cursor: pointer;
      }
    }
    .star-sidebar-submenu-item-wrap {
      transition: height 0.3s ease-in-out;
      overflow: hidden;
      padding-left: 20px;
      &.isActive {
        background: $sidebar-submenu-active-bgcolor;
      }
      .star-sidebar-submenu-item {
        height: 46px;
        padding: 0px 15px;
        display: flex;
        align-items: center;
        position: relative;
        .star-sidebar-submenu-label {
          margin-left: 20px;
        }
        &:hover {
          @include commonHoverStyle();
          opacity: 0.5;
        }
      }
    }
  }
  .star-sidebar-icons {
    width: 160px;
    position: fixed;
    bottom: 33px;
    display: inline-flex;
    margin-left: 18px;
    justify-content: space-between;
    img {
      width: 40px;
      height: 40px;
    }
  }
}
</style>
