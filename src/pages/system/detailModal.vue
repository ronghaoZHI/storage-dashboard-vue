<template>
<div>
    <div class="section-separator">
        <div class="separator-body">
            <span class="separator-icon"></span>
            <span class="separator-info" style="font-size: 18px">{{$t('SYSTEM.BASIC_INFO')}}</span>
        </div>
    </div>
    <div class="group">
        <div class="info-title">{{titles.groupTitle}}</div>
        <div class="content">
            <div class="group-item" v-for="bi in data.basicInfo" :key="bi.name">
                <span class="separator-icon"></span>
                <Tooltip v-if="bi.tooltip" :content="bi.tooltip" placement="top">
                    <span >{{bi.name}}: </span>
                </Tooltip>
                <span v-else>{{bi.name}}: </span>
                <span :class="{redFont: bi.isRed}">{{bi.value}}</span>
            </div>
        </div>
    </div>
    <div class="group" style="border-top:0">
        <div class="info-title">{{titles.partitionTitle}}</div>
        <Spin size="bigger" fix v-if="spinGroup" class="search-spin"></Spin>
        <div class="content content-scroll">
            <ul class="partition-title">
                <li v-for="dh in data.detailHead" :key="dh.name" >{{dh.name}}</li>
            </ul>
            <h1 class="no-data" v-if="data.tableData.length === 0">No Group</h1>
            <ul class="partition-list" v-for="td in data.tableData" :key="td.partition_idx">
                <li v-for='dh in data.detailHead' :key="dh.name">{{td[dh.value]}}</li>
            </ul>
        </div>
    </div>
</div>
</template>
<script>
export default {
    data () {
        return {
        }
    },
    props: ['titles', 'data', 'spinGroup']
}
</script>
<style lang="less" scoped>
    .group{
        position: relative;
    }
    .no-data{
        padding-bottom:60px;
    }
</style>



