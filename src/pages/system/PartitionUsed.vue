<template>
    <div class="content">
        <div class="idc-list">
            <idc-card type="two"></idc-card>
            <idc-card type="one"></idc-card>
        </div>
        <div class="section-chart-tab">
            <button v-bind:class="{buttonFocus: showChart === 'io'}" @click="tabToggle('io')">IO使用率</button>
            <button v-bind:class="{buttonFocus: showChart === 'cpu'}" @click="tabToggle('cpu')">CPU Load</button>
            <button v-bind:class="{buttonFocus: showChart === 'capacity'}" @click="tabToggle('capacity')">容量使用率</button>
            <div class="refresh-section">
                <span @click="getPartitionList(false, true)"><Icon type="refresh" size="20"></Icon></span>
            </div>
        </div>
        <div class="section-chart">
            <Spin size="bigger" fix v-if="spinShow"></Spin>
            <div class="card-chart">
                <partition-card ></partition-card>
                <partition-card ></partition-card>
                <partition-card ></partition-card>
                <partition-card ></partition-card>
                <partition-card ></partition-card>
                <br>
                <Page class="page" :total="100" show-elevator show-sizer></Page>
            </div>
        </div>
    </div>
</template>
<script>
// import idcCard from './idcCard'
import partitionCard from './PartitionCard'
import idcCard from './IdcCard'
export default {
    name: 'partitionUsed',
    data () {
        return {
            showChart: 'group_id',
            spinShow: false
        }
    },
    created () {
        console.log(partitionCard)
    },
    components: {
        partitionCard, idcCard
    },
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
