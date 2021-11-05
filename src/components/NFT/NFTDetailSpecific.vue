<template>
  <div class="rarevalue-total">
    <div class="total-score">
      <span class="title">{{ $t("得分") }}</span
      ><br />
      <span class="value">{{ rarevalue_total_score }}</span>
    </div>
    <div class="total-ranking">
      <span class="title">{{ $t("得分排名") }}</span
      ><br />
      <span class="value">{{ rarevalue_total_rank }}</span>
    </div>
  </div>
  <div class="rarevalue-table">
    <div class="rarevalue-table-item" v-for="(r, i) in rarevalue_list" :key="i">
      <span class="rarevalue-project">{{ r.title }}</span>
      <span class="rarevalue-project-value">{{ r.value }}</span>
      <span class="rarevalue-project-score">{{ r.score }}</span>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({
  box_detail: Object,
});

const rarevalue_list = computed(() => {
  return [
    {
      title: t("背景"),
      value: props.box_detail.properties.background || "--",
      score: props.box_detail.properties.backgroundScore || "--",
    },
    {
      title: t("皮肤"),
      value: props.box_detail.properties.fur || "--",
      score: props.box_detail.properties.furScore || "--",
    },
    {
      title: t("衣服"),
      value: props.box_detail.properties.clothes || "--",
      score: props.box_detail.properties.clothesScore || "--",
    },
    {
      title: t("表情"),
      value: props.box_detail.properties.facialExpression || "--",
      score: props.box_detail.properties.facialExpressionScore || "--",
    },
    {
      title: t("头部"),
      value: props.box_detail.properties.head || "--",
      score: props.box_detail.properties.headScore || "--",
    },
    {
      title: t("配饰"),
      value: props.box_detail.properties.accessories || "--",
      score: props.box_detail.properties.accessoriesScore || "--",
    },
    {
      title: t("眼部"),
      value: props.box_detail.properties.eyes || "--",
      score: props.box_detail.properties.eyesScore || "--",
    },
  ];
});
// 稀有值分数
const rarevalue_total_score = computed(() => {
  return props.box_detail.score;
});
// 稀有值排名
const rarevalue_total_rank = computed(() => {
  return props.box_detail.rank;
});
</script>
<style lang="scss" scoped>
.specific-rarevalue {
  .rarevalue-total {
    display: flex;
    margin-bottom: 16px;
    .total-score {
      margin-right: 72px;
    }
    .value {
      margin-top: 6px;
      font-size: 24px;
      font-weight: bold;
    }
  }
  .rarevalue-table {
    width: 411px;
    .rarevalue-table-item {
      height: 48px;
      line-height: 48px;
      box-shadow: 0px 0.5px 0px 0px #391b0f;
      display: flex;
      justify-content: space-between;
      span {
        display: inline-block;
        flex: 1;
      }
    }
  }
}
</style>
