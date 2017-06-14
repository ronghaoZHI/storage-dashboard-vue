<template>
    <div class="bsc-partition-node">
        <span v-pinter="data" @click="showDetail(data)"></span>
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
                const nodeWidth = Math.floor((data.space / data.capacity) * 30) + 1
                if (data.ioutil !== undefined) {
                    const colorList = ['#76d0a3', '#76d0a3', '#76d0a3', '#76d0a3', '#3dbd7d', '#00a854', '#00a854', '#faaf76', '#f78e3d', '#f56a00']
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
    .wh(40px,20px);
    border: @common-border;
    margin: 2px;

    & > span {
        width: 30px;
        height: 10px;
        display: inline-block;
        margin: 4px 0 0 4px;
        background-color: red;
        cursor: pointer;
    }
}
</style>
