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
                    <Option value="all" key="all">所有IDC</Option>
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
                <Button type="primary" @click="getUsedList" v-if="tabName === 'used'">搜索</Button>
            </div>
            <div class="search search-unused" v-if="tabName === 'unused'">
                整体容量：100T
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
                <Button type="primary" @click="getUnusedList" class="search-button">搜索</Button>
            </div>
        </div>
        <div class="content" v-if="tabName === 'used'">
            <div class="idc-list">
                <idc-card v-for="idc in idcList" :data="idc" :type="idc.SSD && idc.SATA ? 'all' : idc.SSD ? 'SSD' : 'SATA'" :key="idc.idc"></idc-card>
            </div>
            <div class="section-chart-tab">
                <button v-bind:class="{buttonFocus: showChart === 'ioutil'}" @click="chartToggle('io')">IO使用率</button>
                <button v-bind:class="{buttonFocus: showChart === 'cpu'}" @click="chartToggle('cpu')">CPU Load</button>
                <button v-bind:class="{buttonFocus: showChart === 'capacity'}" @click="chartToggle('capacity')">容量使用率</button>
                <div class="refresh-section">
                    <span @click="getUsedList"><Icon type="refresh" size="20"></Icon></span>
                </div>
            </div>
            <div class="section-chart">
                <Spin size="bigger" fix v-if="spinShow"></Spin>
                <div class="card-chart">
                    <partition-card v-for="partition in partitionList" :data="partition" :key="partition.id"></partition-card>
                    <br>
                    <Page class="page" :total="pageTotal" show-elevator show-sizer></Page>
                </div>
            </div>
        </div>
        <partition-unused v-if="tabName === 'unused'" :data="unusedList"></partition-unused>
        <partition-deleted v-if="tabName === 'deleted'" :data="deletedList"></partition-deleted>
    </div>
</template>
<script>
import partitionCard from './PartitionCard'
import idcCard from './IdcCard'
import partitionUnused from './partitionUnused'
import partitionDeleted from './partitionDeleted'
import {PARTITION_USED_LIST, PARTITION_UNUSED_LIST, PARTITION_DELETED_LIST} from '@/service/API'
export default {
    data () {
        return {
            tabName: 'used',
            typeArray: [{name: '所有类型磁盘', value: 'all'}, {name: 'SATA', value: 'SATA'}, {name: 'SSD', value: 'SSD'}],
            readArray: [{name: '所有读写状态', value: 'none'}, {name: '只读', value: 1}, {name: '可写', value: 0}],
            failArray: [{name: '所有故障状态', value: 'none'}, {name: '正常', value: 0}, {name: '故障', value: 1}],
            search: {
                idc: 'all',
                media_type: 'all',
                read_only: 'none',
                fail: 'none',
                ip: '',
                lower_capacity: '',
                upper_capacity: '',
                lower_free: '',
                upper_free: ''
            },
            showChart: 'ioutil',
            spinShow: false,
            pageCount: '1',
            partitionList: [],
            pageTotal: 1,
            unusedList: [],
            deletedList: []
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
            return this.search.ip.length === 0 ? 'all' : this.search.ip
        }
    },
    methods: {
        chartToggle (index) {
            this.showChart = index
            this.getUsedList()
        },
        tabToggle (index) {
            this.tabName = index
            console.log(this.tabName === 'used')
            if (index === 'used') {
                this.getUsedList()
            } else if (index === 'unused') {
                this.getUnusedList()
            } else {
                this.getDeletedList()
            }
        },
        getUsedList () {
            console.log('used')
            this.spinShow = true
            this.$Loading.start()
            try {
                const listURL = PARTITION_USED_LIST
                const params = {
                    order_by: this.showChart,
                    idc: this.search.idc,
                    media_type: this.search.media_type,
                    fail: this.search.fail === 'none' ? this.search.fail : !!this.search.fail,
                    read_only: this.search.read_only,
                    ip: this.IPparam,
                    page: this.pageCount,
                    count: 20
                }
                console.log(listURL, params)
                this.idcList = Object.values(listData.idc_statc)
                this.partitionList = listData.partition
                this.pageTotal = Math.ceil(listData.number / 20)
                this.spinShow = false
                this.$Loading.finish()
            } catch (error) {
                this.spinShow = false
                this.$Loading.error()
            }
        },
        getUnusedList () {
            this.spinShow = true
            this.$Loading.start()
            console.log('unused')
            try {
                const listURL = PARTITION_UNUSED_LIST
                const params = {
                    idc: this.search.idc,
                    media_type: this.search.media_type,
                    ip: this.IPparam,
                    lower_capacity: this.search.lower_capacity || 'none',
                    upper_capacity: this.search.upper_capacity || 'none',
                    lower_free: this.search.lower_free || 'none',
                    upper_free: this.search.upper_free || 'none',
                    page: this.pageCount,
                    count: 20
                }
                console.log(listURL, params)
                this.unusedList = unusedData.partition
                this.spinShow = false
                this.$Loading.finish()
            } catch (error) {
                this.spinShow = false
                this.$Loading.error()
            }
        },
        getDeletedList () {
            this.spinShow = true
            this.$Loading.start()
            try {
                const listURL = PARTITION_DELETED_LIST
                console.log(listURL)
                this.deletedList = deletedData.partition
                this.spinShow = false
                this.$Loading.finish()
            } catch (error) {
                this.spinShow = false
                this.$Loading.error()
            }
        }
    },
    watch: {
    }
}
const deletedData = {
    partition: [{
        ips: ['172.17.199.191'],
        pub_ips: [],
        path: '/s2/drive/002',
        inn_ips: ['172.17.199.191'],
        media_type: 'SATA',
        idc: '.shijiazhuang.xunjie'
    }, {
        ips: ['172.17.199.191'],
        pub_ips: [],
        path: '/s2/drive/002',
        inn_ips: ['172.17.199.191'],
        media_type: 'SATA',
        idc: '.shijiazhuang.xunjie'
    }]
}
const unusedData = {
    number: 10000,
    partition: [
        {
            ips: ['172.17.199.191'],
            pub_ips: [],
            path: '/s2/drive/002',
            inn_ips: ['172.17.199.191'],
            media_type: 'SATA',
            idc: '.shijiazhuang.xunjie',
            space_used: '50T／100T'
        },
        {
            ips: ['172.17.199.191'],
            pub_ips: [],
            path: '/s2/drive/002',
            inn_ips: ['172.17.199.191'],
            media_type: 'SATA',
            idc: '.shijiazhuang.xunjie',
            space_used: '50T／100T'
        }
    ]}
const listData = {
    number: 10000,
    partition: [
        {
            ips: ['172.17.199.191'],
            is_del: 0,
            pub_ips: [],
            partition_id: 'bc0fe57900014001915800163e30b328',
            partition_idx: '002',
            partition_path: '/s2/drive/002',
            inn_ips: ['172.17.199.191'],
            readonly: 1,
            fail: false,
            node_id: '00163e30b328',
            idc_type: 'center',
            media_type: 'ATA',
            idc: '.shijiazhuang.xunjie',
            used_rate: 68,
            capacity: 123456765432, // (前端单位换算,原值单位为Byte)
            used: 3423456, // (前端单位换算,原值单位为Byte)
            ioutil: 0.92,
            cpu: 1.68,
            group: []
        }, {
            ips: ['172.17.199.191'],
            is_del: 0,
            pub_ips: [],
            partition_id: 'bc0fe57900014001915800163e30b328',
            partition_idx: '002',
            partition_path: '/s2/drive/002',
            inn_ips: ['172.17.199.191'],
            readonly: 0,
            fail: true,
            node_id: '00163e30b328',
            idc_type: 'center',
            media_type: 'ATA',
            idc: '.shijiazhuang.xunjie',
            used_rate: 99.3,
            capacity: 123456765432, // (前端单位换算,原值单位为Byte)
            used: 3423456, // (前端单位换算,原值单位为Byte)
            ioutil: 0.68,
            cpu: 1.68,
            group: [{
                num_used: '9',
                readonly: '1',
                group_id: '19',
                space_used: '194.6K',
                ts: '2017-04-24 13:05:12',
                traffic_status: 50}, {num_used: '9',
                readonly: '1',
                group_id: '19',
                space_used: '194.6K',
                ts: '2017-04-24 13:05:12'}
            ]
        }],
    idc_statc: {
        '.ningbo.yinzhou': {
            idc: '.ningbo.yinzhou',
            SATA: {
                used: '7.06G',
                capacity: '20.0G',
                used_rate: 35
            },
            SSD: {
                used: '7.06G',
                capacity: '20.0G',
                used_rate: 35
            }
        },
        '.shanghai.yinzhou': {
            idc: '.shanghai.yinzhou',
            SATA: {
                used: '7.06G',
                capacity: '20.0G',
                used_rate: 35
            }
        },
        '.shijiazhuang.yinzhou': {
            idc: '.shijiazhuang.yinzhou',
            SSD: {
                used: '7.06G',
                capacity: '20.0G',
                used_rate: 35
            }
        }
    }
}
</script>
<style lang="less" scoped>
.@{css-prefix}partition {
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
    .page{
        width:100%;
        text-align: center;
        margin:30px 0 20px;
    }
}
</style>
