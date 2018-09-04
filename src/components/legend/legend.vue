<template>
  <div class="bsc-legend">
    <div class="legend-item"
         v-for="item in data"
         :key="item.text">
      <Icon :type="item.icon"
            size="14"></Icon>
      <span class="legend-text">{{$t(item.text)}}</span>
      <span v-if="item !== data[data.length-1]"
            class="legend-separator">|</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data'],
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';
.dark .@{css-prefix}legend {
  color: @text-color-secondary-dark;
}

.@{css-prefix}legend {
  display: inline-flex;
  align-items: center;
  line-height: 30px;
  padding: 0 15px;
  color: @text-color-secondary;
  .legend-item {
    display: flex;
    align-items: center;

    .legend-text {
      padding-left: 5px;
    }

    .legend-separator {
      margin: 0 8px;
    }
  }
}
</style>
