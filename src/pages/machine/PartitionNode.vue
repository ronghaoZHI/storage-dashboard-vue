<template>
    <div class="bsc-partition-node">
        <span v-pinter="data"></span>
    </div>
</template>
<script>
export default {
    data () {
        return {}
    },
    props: ['data'],
    directives: {
        pinter: {
            inserted: function (el, binding) {
                const data = binding.value
                const nodeWidth = Math.floor((data.space / data.capacity) * 30) + 10
                const colorList = ['#007b43', '#00a854', '#00a854', '#00a854', '#00a854', '#00a854', '#00a854', '#faaf76', '#d75000', '#7a0000']
                el.style.backgroundColor = colorList[data.ioutil / 100]
                el.style.width = nodeWidth + 'px'
            }
        }
    },
    methods: { }
}

</script>
<style lang="less" scoped>
@import '../../styles/index.less';

.@{css-prefix}partition-node {
    .wh(40px,20px);
    border: @common-border;
    margin: 2px;

    & > span {
        width: 30px;
        height: 10px;
        display: inline-block;
        margin: 4px 0 0 4px;
        background-color: red;
    }
}
</style>
