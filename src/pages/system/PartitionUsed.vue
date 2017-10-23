<template>
    <div>
        <div class="idc-list">
            <!-- <idc-card></idc-card> -->
        </div>
        <div class="content">
            <div class="section-chart-tab">
                <button v-bind:class="{buttonFocus: showChart === 'group_id'}" @click="tabToggle('group_id')">创建时间升序</button>
                <button v-bind:class="{buttonFocus: showChart === 'cpu'}" @click="tabToggle('cpu')">CPU</button>
                <button v-bind:class="{buttonFocus: showChart === 'ioutil'}" @click="tabToggle('ioutil')">IO</button>
                <button v-bind:class="{buttonFocus: showChart === 'space'}" @click="tabToggle('space')">容量</button>
                <div class="refresh-section">
                    <span @click="getPartitionList(false, true)"><Icon type="refresh" size="20"></Icon></span>
                </div>
            </div>
            <div class="section-chart">
                <Spin size="bigger" fix v-if="spinShow"></Spin>
                <div class="card-chart">
                    <!-- <partition-card></partition-card> -->
                    页码
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// import idcCard from './idcCard'
// import partitionCard from './PartitionCard'
export default {
    data () {
        return {
            showChart: 'group_id',
            spinShow: false
        }
    },
    created () {
    },
    // comments: { partitionCard },
    methods: {
        tabToggle (index, ref) {
            this.showChart = index
        },
        getPartitionList () {
        }
    },
    watch: {
    }
}
</script>
<style lang="less" scoped>


</style>
