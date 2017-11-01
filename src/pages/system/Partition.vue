<template>
    <div class="bsc-system bsc-partition">
        <div class="header">
            <div class="status">
                <span class="group-status-prefix">磁盘状态:</span>
                <button v-bind:class="{statusButtonFocus: tabName === 'used'}" @click="tabToggle('used')">已使用磁盘</button>
                <button v-bind:class="{statusButtonFocus: tabName === 'unused'}" @click="tabToggle('unused')">未使用磁盘</button>
                <button v-bind:class="{statusButtonFocus: tabName === 'deleted'}" @click="tabToggle('deleted')">标删磁盘</button>
            </div>
            <div class="search" v-if="tabName !== 'deleted'">
                <Select :prepend="true" style="width:180px;margin-right:8px;" v-model="search.idc">
                    <Icon slot="prepend" size="18" type="android-person"></Icon>
                    <Option value="ignore" key="ignore">所有IDC</Option>
                    <Option v-for="idc in idcList" :value="idc.idc" :key="idc.idc">{{idc.idc}}</Option>
                </Select>
                <Select :prepend="true" style="width:180px;margin-right:8px;" v-model="search.media_type">
                    <Icon slot="prepend" size="18" type="soup-can"></Icon>
                    <Option v-for="media in typeArray" :value="media.value" :key="media.value">{{media.name}}</Option>
                </Select>
                <Select :prepend="true" style="width:180px;margin-right:8px;" v-if="tabName === 'used'" v-model="search.read_only">
                    <Icon slot="prepend" size="18" type="compose"></Icon>
                    <Option v-for="read in readArray" :value="read.value" :key="read.value">{{read.name}}</Option>
                </Select>
                <Select :prepend="true" style="width:180px;margin-right:8px;" v-if="tabName === 'used'" v-model="search.fail">
                    <Icon slot="prepend" size="18" type="android-radio-button-on"></Icon>
                    <Option v-for="fail in failArray" :value="fail.value" :key="fail.value">{{fail.name}}</Option>
                </Select>
                <Input v-model="search.ip" placeholder="请输入服务器IP" style="width:260px"></Input>
                <Button type="primary" @click="searchList" v-if="tabName === 'used'">搜索</Button>
            </div>
            <div class="search search-unused" v-if="tabName === 'unused'">
                整体容量：{{capacity}}
                <span class="title">总量</span>
                <InputNumber :max="10" :min="0" v-model="search.lower_capacity"></InputNumber>
                <span>T</span><span class="separate">—</span> 
                <InputNumber :max="10" :min="0" v-model="search.upper_capacity"></InputNumber>
                <span>T</span>
                <span class="title">可用</span>
                <InputNumber :max="10" :min="0" v-model="search.lower_free"></InputNumber>
                <span>T</span><span class="separate">—</span> 
                <InputNumber :max="10" :min="0" v-model="search.upper_free"></InputNumber>
                <span>T</span>
                <Button type="primary" @click="searchList" class="search-button">搜索</Button>
            </div>
        </div>
        <div class="content">
            <Spin size="bigger" fix v-if="spinContent" class="search-spin"></Spin>
            <div v-if="tabName === 'used'">
                <div class="idc-list">
                    <idc-card v-for="idc in idcList" :data="idc" :type="idc.SSD && idc.SATA ? 'all' : idc.SSD ? 'SSD' : 'SATA'" :key="idc.idc"></idc-card>
                </div>
                <div class="section-chart-tab">
                    <button v-bind:class="{buttonFocus: showChart === 'ioutil'}" @click="chartToggle('ioutil')">IO使用率</button>
                    <button v-bind:class="{buttonFocus: showChart === 'cpu'}" @click="chartToggle('cpu')">CPU Load</button>
                    <button v-bind:class="{buttonFocus: showChart === 'used_rate'}" @click="chartToggle('used_rate')">容量使用率</button>
                    <div class="refresh-section">
                        <span @click="getUsedList"><Icon type="refresh" size="20"></Icon></span>
                    </div>
                </div>
                <div class="section-chart">
                    <div class="card-chart">
                        <h1 class="no-data" v-if="partitionList.length === 0">No Data</h1>
                        <partition-card v-for="partition in partitionList" :data="partition" :key="partition.partition_id"></partition-card>
                        <br>
                        <Page v-if="pageTotal > 1" class="page" :total="listNum" :page-size="2" @on-change="pageChange" show-elevator></Page>
                    </div>
                </div>
            </div>
            <partition-unused v-if="tabName === 'unused'" :data="unusedList"></partition-unused>
            <partition-deleted v-if="tabName === 'deleted'" :data="deletedList"></partition-deleted>
        </div>
        <Page v-if="tabName === 'unused' && pageTotal > 1" class="page" :total="pageTotal" @on-change="pageChange" show-elevator></Page>
    </div>
</template>
<script>
import partitionCard from './PartitionCard'
import idcCard from './IdcCard'
import partitionUnused from './partitionUnused'
import partitionDeleted from './partitionDeleted'
import { bytes } from '@/service/bucketService'
import {PARTITION_USED_LIST, PARTITION_UNUSED_LIST, PARTITION_DELETED_LIST} from '@/service/API'
export default {
    data () {
        return {
            tabName: 'used',
            typeArray: [{name: '所有类型磁盘', value: 'ignore'}, {name: 'SATA', value: 'SATA'}, {name: 'SSD', value: 'SSD'}],
            readArray: [{name: '所有读写状态', value: 'ignore'}, {name: '只读', value: 1}, {name: '可写', value: 0}],
            failArray: [{name: '所有故障状态', value: 'ignore'}, {name: '正常', value: 0}, {name: '故障', value: 1}],
            search: {
                idc: 'ignore',
                media_type: 'ignore',
                read_only: 'ignore',
                fail: 'ignore',
                ip: '',
                lower_capacity: '',
                upper_capacity: '',
                lower_free: '',
                upper_free: ''
            },
            showChart: 'ioutil',
            spinContent: false,
            pageCount: 1,
            partitionList: [],
            pageTotal: 1,
            listNum: 0,
            unusedList: [],
            deletedList: [],
            idcList: [],
            capacity: 0
        }
    },
    created () {
        this.getUsedList()
    },
    components: {
        partitionCard, idcCard, partitionUnused, partitionDeleted
    },
    computed: {
        IPparam () {
            return this.search.ip.length === 0 ? 'ignore' : this.search.ip
        }
    },
    methods: {
        chartToggle (index) {
            this.showChart = index
            this.pageCount = 1
            this.getUsedList()
        },
        tabToggle (index) {
            this.tabName = index
            this.pageCount = 1
            if (index === 'used') {
                this.getUsedList()
            } else if (index === 'unused') {
                this.getUnusedList()
            } else {
                this.getDeletedList()
            }
        },
        searchList () {
            this.pageCount = 1
            if (this.tabName === 'used') {
                this.getUsedList()
            } else {
                this.getUnusedList()
            }
        },
        pageChange (pageCount) {
            this.pageCount = pageCount
            if (this.tabName === 'used') {
                this.getUsedList()
            } else {
                this.getUnusedList()
            }
        },
        async getUsedList () {
            this.spinContent = true
            this.$Loading.start()
            try {
                const listURL = PARTITION_USED_LIST
                const params = {
                    order_by: this.showChart,
                    idc: this.search.idc,
                    media_type: this.search.media_type,
                    fail: this.search.fail,
                    read_only: this.search.read_only,
                    ip: this.IPparam,
                    page: this.pageCount,
                    count: 2
                }
                let listData = await this.$http.get(listURL, {params})
                this.idcList = Object.values(listData.idc_stats)
                this.partitionList = listData.partition || []
                this.listNum = listData.total_count || 0
                this.pageTotal = listData.total_count ? Math.ceil(listData.total_count / 2) : 1
                console.log('this.pageTotal', this.pageTotal)
                this.spinContent = false
                this.$Loading.finish()
            } catch (error) {
                this.spinContent = false
                this.$Loading.error()
            }
        },
        async getUnusedList () {
            this.spinContent = true
            this.$Loading.start()
            try {
                const listURL = PARTITION_UNUSED_LIST
                const params = {
                    idc: this.search.idc,
                    media_type: this.search.media_type,
                    ip: this.IPparam,
                    lower_capacity: this.search.lower_capacity || 'ignore',
                    upper_capacity: this.search.upper_capacity || 'ignore',
                    lower_free: this.search.lower_free || 'ignore',
                    upper_free: this.search.upper_free || 'ignore',
                    page: this.pageCount,
                    count: 2
                }
                let unusedData = await this.$http.get(listURL, {params})
                this.unusedList = unusedData.partition || []
                this.listNum = unusedData.total_count || 0
                this.pageTotal = unusedData.total_count ? Math.ceil(unusedData.total_count / 2) : 1
                this.capacity = unusedData.stats ? bytes(unusedData.stats.capacity) : 0
                this.spinContent = false
                this.$Loading.finish()
            } catch (error) {
                this.spinContent = false
                this.$Loading.error()
            }
        },
        async getDeletedList () {
            this.spinContent = true
            this.$Loading.start()
            try {
                const listURL = PARTITION_DELETED_LIST
                let deletedData = await this.$http.get(listURL)
                this.deletedList = deletedData.partition || []
                this.spinContent = false
                this.$Loading.finish()
            } catch (error) {
                this.spinContent = false
                this.$Loading.error()
            }
        }
    },
    watch: {
    }
}
</script>
<style lang="less" scoped>
.@{css-prefix}partition {
    position: relative;
    min-height: calc( 100vh - 60px);
    .header {
        .search {
            border-top: 1px dashed #d3dce6;
        }
        .search-unused{
            border-top: 1px dashed #d3dce6;
            span{
                padding-left: 5px;
            }
            span.separate{
                padding: 0 8px
            }
            span.title{
                margin-left: 20px;
                padding: 0 5px;
            }
            .search-button{
                margin-left:20px;
            }
        }
    }
    .content {
        position: relative;
    }
    .page{
        width:100%;
        text-align: center;
        margin:30px 0 20px;
        opacity: 0.3;
        position: fixed;
        bottom: 50px;
    }
    .page:hover{
        opacity: 1;
    }
}
</style>
