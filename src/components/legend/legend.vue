<template>
    <div class="legend">
        <div class="legend-item" v-for="item in data">
            <Icon :type="item.legendIcon" size="14"></Icon><span class="legend-text">{{item.legendText}}</span><span v-if="item !== data[data.length-1]" class="legend-separator">|</span>
        </div>
    </div>
</template>

<script>
export default {
    props: ['data']
}
</script>

<style lang="less" scoped>
.legend {
    display: inline-flex;
    align-items: center;
    line-height: 30px;
    border: 1px solid #d3dce6;
    padding: 0 15px;
    border-radius: 4px;
    .legend-item {
        display: flex;
        align-items: center;
    }
    .legend-text {
        padding-left: 5px;
    }
    .legend-separator {
        margin: 0 8px;
    }
}
</style>