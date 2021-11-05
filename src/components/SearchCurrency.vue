<template>
  <div class="star-search" v-if="state.visible">
    <star-dialog
      :title="$t('选择代币')"
      :dialogVisible="state.visible"
      @handleClose="handleClose"
    >
      <template #content>
        <div class="search">
          <p class="input-box">
            <ElInput
              v-model="state.searchValue"
              class="input-el"
              :placeholder="$t('搜索名称或粘贴地址')"
            />
          </p>
          <ul class="list">
            <li
              class="item"
              v-for="(item, i) in state.filterData"
              :key="i"
              @click="handleSelect(item)"
            >
              <img :src="item.icon" alt="" class="icon" />
              <!-- <svg-icon name="BTC" class="icon"></svg-icon> -->
              <p class="info">
                <strong>{{ item.shortName }}</strong>
                <span>{{ item.fullName }}</span>
              </p>
            </li>
          </ul>
        </div>
        <ElEmpty
          v-if="state.listData.length === 0"
          :description="$t('暂无数据')"
        />
      </template>
    </star-dialog>
  </div>
</template>

<script setup>
import starDialog from "@StarUI/StarDialog.vue";
import {
  reactive,
  defineProps,
  onMounted,
  watch,
  defineEmits,
  onUpdated,
} from "vue";
import { ElInput } from "element-plus";
import { ElEmpty } from "element-plus";
import commonApi from "@api/common";

let state = reactive({
  visible: props.dialogVisible,
  searchValue: "",
  listData: [],
  filterData: [],
});
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
});

onMounted(async () => {
  let res = await commonApi.getCurrency();
  if (res.code === 200) {
    state.listData = res.data;
    state.filterData = res.data;
  }
});
watch(
  () => props.dialogVisible,
  (n) => {
    state.visible = n;
  }
);
onUpdated(() => {
  state.searchValue = "";
});
watch(
  () => state.searchValue,
  (n) => {
    state.filterData = state.listData.filter(
      (item) => item.fullName.includes(n) || item.address.indexOf(n) !== -1
    );
  }
);

const emits = defineEmits(["handleClose", "handleSelect"]);

const handleClose = () => {
  emits("handleClose", false);
};

const handleSelect = (item) => {
  emits("handleSelect", item);
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
@import "~@styles/mixin.scss";
.star-search {
  ::v-deep(.el-dialog__body) {
    padding: 14px 0 32px;
  }
  .search {
    .input-box {
      margin-bottom: 20px;
      padding: 0 28px;
    }
    ::v-deep(.el-input__inner) {
      width: 388px;
      height: 44px;
      background: #ededed;
      box-shadow: 0px 1px 0px 0px rgba(255, 255, 255, 0.43),
        0px -2px 0px 0px rgba(0, 0, 0, 0.13);
      border-radius: 16px;
      border-color: #ededed;
      font-size: 16px;
      font-weight: bold;
      color: #000;
    }
    .item {
      width: 100%;
      list-style: none;
      margin-bottom: 10px;
      overflow: hidden;
      display: flex;
      padding: 6px 28px;
      box-sizing: border-box;
      &:hover {
        @include commonHoverStyle();
      }
    }
    .icon {
      margin-right: 20px;
      width: 24px;
      height: 24px;
      margin-top: 9px;
      border-radius: 10px;
    }
    .info {
      strong,
      span {
        display: block;
      }
    }
  }
}
</style>
