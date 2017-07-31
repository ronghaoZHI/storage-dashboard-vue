<template>
    <div class="bsc-partition-node">
        <span v-pinter="data" @click="showDetail(data)"></span>
        <span>{{spacePercent}}-{{ioutil}}</span>
    </div>
</template>
<script>
export default {
    data () {
        return {
            ioutil: this.data.ioutil,
            spacePercent: this.data.space && this.data.capacity ? Math.floor(this.data.space / this.data.capacity * 100) : ''
        }
    },
    props: ['data'],
    directives: {
        pinter: {
            inserted: function (el, binding) {
                const data = binding.value
                const nodeWidth = Math.floor((data.space / data.capacity) * 30)
                if (data.ioutil !== undefined) {
                    const colorList = ['#76d0a3', '#76d0a3', '#76d0a3', '#76d0a3', '#76d0a3', '#76d0a3', '#76d0a3', '#76d0a3', '#76d0a3', '#F1A4A4']
                    el.style.backgroundColor = colorList[Math.floor(data.ioutil / 10)]
                } else {
                    el.style.backgroundColor = '#e5e9f2'
                }
                el.style.width = nodeWidth + 'px'
            }
        }
    },
    methods: {
        showDetail (data) {
            console.log(data)
        }
    }
}

</script>
<style lang="less" scoped>
@import '../../styles/index.less';

.@{css-prefix}partition-node {
    .wh(42px,20px);
    border: @common-border;
    margin: 2px;

    & > span:first-child {
        width: 30px;
        height: 16px;
        display: block;
        margin: 1px 0 0 1px;
        background-color: #F1A4A4;
        cursor: pointer;
    }

    & > span:nth-child(2) {
        display: block;
        position: relative;
        font-size: 12px;
        top: -16px;
        left: 4px;
        width: 32px;
        height: 16px;
    }
}
</style>
