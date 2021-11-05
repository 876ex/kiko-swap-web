<template>
  <div class="liquidity-content-core-delete">
    <div class="liquidity-content-core-delete-tips">
      <span>{{ $t("请输入需要移除的LP数量") }}</span>
      <ElTooltip effect="light" placement="right-start">
        <template #content>
          <div :style="'max-width: 400px'">
            {{
              $t(
                "移除流动性资金将会根据LP Token数量按当前流动性资金池中的代币兑换比例换回代币"
              )
            }}
          </div>
        </template>
        <template #default>
          <svg-icon name="question" class="question"></svg-icon>
        </template>
      </ElTooltip>
    </div>
    <star-space :size="20"></star-space>
    <div class="liquidity-content-core-delete-input">
      <div class="liquidity-content-core-delete-title">
        <span v-if="state.lpDelInfo.poolAmount">
          {{ $t("余额") }}: {{ state.lpDelInfo.poolAmount }}
        </span>
      </div>
      <div class="liquidity-content-core-delete-main">
        <star-input
          class="liquidity-content-core-delete-main-input"
          placeholder="0.0"
          :value="state.inpVal"
          :max="state.lpDelInfo.poolAmount"
          @inputEvent="inputEvent($event)"
        ></star-input>
        <div class="liquidity-content-core-delete-main-currencyselect">
          <span>
            {{ state.lpDelInfo.lpToken }}
          </span>
          <!-- <svg-icon name="arrowdownselect"></svg-icon> -->
        </div>
      </div>
    </div>
    <star-space :size="20"></star-space>
    <div class="liquidity-content-core-delete-item">
      <span>
        {{ state.lpDelInfo.A.data }}
      </span>
      <span>{{ state.lpDelInfo.A.key }}</span>
    </div>
    <div class="change-content">
      <svg-icon name="cross" class="icon"></svg-icon>
    </div>
    <div class="liquidity-content-core-delete-item">
      <span>
        {{ state.lpDelInfo.B.data }}
      </span>
      <span>{{ state.lpDelInfo.B.key }}</span>
    </div>
  </div>
</template>
<script setup>
import { computed, reactive, onUnmounted, onMounted } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import StarSpace from "@StarUI/StarSpace.vue";
import { useStore } from "vuex";
import StarInput from "@StarUI/StarInput";
import { ElTooltip } from "element-plus";
const store = useStore();

let state = reactive({
  walletStatus: computed(() => store.state.StoreWallet.walletStatus),
  lpDelInfo: computed(() => store.state.StoreLiquidity.lpDelInfo),
  poolType: computed(() => store.state.StoreLiquidity.poolType),
  inpVal: computed(() => store.state.StoreLiquidity.delInpVal),
});

const inputEvent = (val) => {
  store.dispatch("StoreLiquidity/setDelPoolTokenData", { value: val });
};

// delete或add去循环请求最新的XY
onMounted(() => {
  store.dispatch("StoreLiquidity/getLiquidityXYThrottle");
  store.dispatch("StoreLiquidity/getTotalAmountWithLPToken");
  state.delTimer = setInterval(() => {
    store.dispatch("StoreLiquidity/getLiquidityXYThrottle");
    store.dispatch("StoreLiquidity/getTotalAmountWithLPToken");
  }, 5000);
});

onUnmounted(() => {
  if (state.delTimer) {
    clearInterval(state.delTimer);
  }
  store.commit("StoreLiquidity/CLEAR_DELETE_INFO");
});
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
@import "~@/styles/mixin.scss";
.liquidity-content-core-btn {
  .star-button {
    width: 100%;
    padding: 15px 0px;
  }
}

.change-content {
  padding: 20px 0px;
  text-align: center;
  .icon {
    cursor: default;
  }
}
.liquidity-content-core-delete {
  .liquidity-content-core-delete-tips {
    margin-left: 20px;
    .question {
      margin-left: 5px;
    }
  }
  .liquidity-content-core-delete-item {
    color: $text-black-color;
    width: 100%;
    background: $btn-gray2-bgcolor;
    height: 60px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 17px;
    box-sizing: border-box;
    span {
      font-size: 20px;
    }
    span:first-child {
      color: $text-gray-color;
    }
    span:last-child {
      color: $text-black-color;
    }
  }
}
.liquidity-content-core-delete-input {
  border-radius: 16px;
  height: 90px;
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border-radius: 19px;
  border: 1px solid #ededed;
  .liquidity-content-core-delete-title {
    display: flex;
    justify-content: flex-end;
  }
  .liquidity-content-core-delete-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    .liquidity-content-core-delete-main-input {
      ::v-deep(.el-input__inner) {
        border-color: #fff;
      }
      width: 230px;
    }
    .liquidity-content-core-delete-main-currencyselect {
      margin-left: 2px;
      &:hover {
        opacity: 0.6;
      }
      span {
        text-align: center;
        font-size: 16px;
        display: inline-block;
      }
    }
  }
}
</style>
