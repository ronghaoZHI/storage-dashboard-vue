<template>
    <div class="bsc-system bsc-partition">
        <div class="header">
            <div class="status">
                <span class="group-status-prefix">{{$t('SYSTEM.PARTITION_STATE')}}:</span>
                <button v-bind:class="{statusButtonFocus: tabName === 'used'}" @click="tabToggle('used')">{{$t('SYSTEM.PARTITION_USED')}}</button>
                <button v-bind:class="{statusButtonFocus: tabName === 'unused'}" @click="tabToggle('unused')">{{$t('SYSTEM.PARTITION_UNUSED')}}</button>
                <button v-bind:class="{statusButtonFocus: tabName === 'deleted'}" @click="tabToggle('deleted')">{{$t('SYSTEM.PARTITION_DELETED')}}</button>
            </div>
            <div class="search" v-if="tabName !== 'deleted'" @keyup.enter="searchList">
                <Select :prepend="true" style="width:180px;margin-right:8px;" v-model="search.idc" @on-change="searchList">
                    <Icon slot="prepend" size="18" type="android-person"></Icon>
                    <Option value="ignore" key="ignore">{{$t('SYSTEM.IDC_ALL')}}</Option>
                    <Option v-for="idc in idcAll" :value="idc" :key="idc">{{idc}}</Option>
                </Select>
                <Select :prepend="true" style="width:180px;margin-right:8px;" v-model="search.media_type" @on-change="searchList">
                    <Icon slot="prepend" size="18" type="soup-can"></Icon>
                    <Option v-for="media in typeArray" :value="media.value" :key="media.value">{{media.name}}</Option>
                </Select>
                <Select :prepend="true" style="width:180px;margin-right:8px;" v-if="tabName === 'used'" v-model="search.read_only" @on-change="searchList">
                    <Icon slot="prepend" size="18" type="compose"></Icon>
                    <Option v-for="read in readArray" :value="read.value" :key="read.value">{{read.name}}</Option>
                </Select>
                <Select :prepend="true" style="width:180px;margin-right:8px;" v-if="tabName === 'used'" v-model="search.fail" @on-change="searchList">
                    <Icon slot="prepend" size="18" type="android-radio-button-on"></Icon>
                    <Option v-for="fail in failArray" :value="fail.value" :key="fail.value">{{fail.name}}</Option>
                </Select>
                <Input v-model="search.ip" :placeholder="$t('SYSTEM.SERVER_IP')" style="width:260px"></Input>
                <Button type="primary" @click="searchList" v-if="tabName === 'used'">{{$t('SYSTEM.SEARCH')}}</Button>
                <Button type="primary" @click="resetParams" v-if="tabName === 'used'">{{$t('PUBLIC.RESET')}}</Button>
                <Button type="primary" @click="showType = 'card'" v-if="showType === 'table'">卡片展示</Button>
                <Button type="primary" @click="showType = 'table'" v-if="showType === 'card'">列表展示</Button>
            </div>
            <div class="search search-unused" v-if="tabName === 'unused'">
                {{$t('SYSTEM.OVERALL_CAPACITY')}}: {{capacity}}
                <span class="title">{{$t('SYSTEM.TOTAL_CAPACITY')}}</span>
                <InputNumber :max="lowerCapacityMax" :min="0" v-model="search.min_capacity"></InputNumber>
                <span>T</span><span class="separate">—</span>
                <InputNumber :min="upperCapacityMin" v-model="search.max_capacity"></InputNumber>
                <span>T</span>
                <span class="title">{{$t('SYSTEM.AVAILABLE')}}</span>
                <InputNumber :max="lowerFreeMax" :min="0" v-model="search.min_free"></InputNumber>
                <span>T</span><span class="separate">—</span> 
                <InputNumber :min="upperFreeMin" v-model="search.max_free"></InputNumber>
                <span>T</span>
                <Button type="primary" @click="searchList" class="search-button">{{$t('SYSTEM.SEARCH')}}</Button>
                <Button type="primary" @click="resetParams">{{$t('PUBLIC.RESET')}}</Button>
            </div>
        </div>
        <div class="content">
            <Spin size="bigger" fix v-if="spinContent" class="search-spin"></Spin>
            <div v-if="tabName === 'used'">
                <div class="idc-list">
                    <idc-card v-for="idc in idcList" :data="idc" :key="idc.idc"></idc-card>
                </div>
                <Table v-if="showType === 'table'" border :context="self" :stripe="true" :columns="usedHeader" :data="partitionList" :no-data-text='$t("STORAGE.NO_LIST")'></Table>
                <div class="section-chart-tab" v-if="showType === 'card'">
                    <button v-bind:class="{buttonFocus: showChart === 'ioutil'}" @click="chartToggle('ioutil')">IO {{$t('SYSTEM.DESCENDINHG_ORDER')}}</button>
                    <button v-bind:class="{buttonFocus: showChart === 'cpu'}" @click="chartToggle('cpu')">CPU Load {{$t('SYSTEM.DESCENDINHG_ORDER')}}</button>
                    <button v-bind:class="{buttonFocus: showChart === 'used_rate'}" @click="chartToggle('used_rate')">{{$t('SYSTEM.CAPACITY_UTILIZATION_RATE')}} {{$t('SYSTEM.DESCENDINHG_ORDER')}}</button>
                    <div class="refresh-section">
                        <span @click="getUsedList"><Icon type="refresh" size="20"></Icon></span>
                    </div>
                </div>
                <div class="section-chart" v-if="showType === 'card'">
                    <div class="card-chart">
                        <h1 class="no-data" v-if="partitionList.length === 0">No Data</h1>
                        <partition-card v-else v-for="partition in partitionList" :data="partition" :detail="usedDetail" :spinGroup="spinGroup" :key="partition.partition_id"></partition-card>
                        <br>
                        <Page v-if="pageTotal > 1" class="page" :total="listNum" :page-size="20" @on-change="pageChange" show-elevator></Page>
                    </div>
                </div>
            </div>
            <partition-unused v-if="tabName === 'unused'" :data="unusedList"></partition-unused>
            <partition-deleted v-if="tabName === 'deleted'" :data="deletedList"></partition-deleted>
        </div>
        <Page v-if="tabName === 'unused' && pageTotal > 1" class="page" :total="pageTotal" @on-change="pageChange" show-elevator></Page>
        <Modal v-model="showDetailModal" :title="$t('SYSTEM.PARTITION_DETAILS')" width="800">
            <detail-modal :titles='modalTitles' :data='modalData' :spinGroup="spinGroup" class="partition-modal"></detail-modal>
            <div slot="footer">
                <Button type="primary" @click="showDetailModal = false">{{$t('PUBLIC.CLOSE')}}</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import partitionCard from './PartitionCard'
import idcCard from './IdcCard'
import partitionUnused from './partitionUnused'
import partitionDeleted from './partitionDeleted'
import detailModal from './detailModal'
import bytes from 'bytes'
import { thousands } from '@/service/bucketService'
import {PARTITION_IDC_LIST, PARTITION_USED_LIST, PARTITION_USED_DETAIL, PARTITION_UNUSED_LIST, PARTITION_DELETED_LIST, PARTITION_USED_MOVE, PARTITION_USED_SET, PARTITION_USED_DELETED} from '@/service/API'
export default {
    data () {
        return {
            tabName: 'used',
            showDetailModal: false,
            modalTitles: {groupTitle: this.$t('SYSTEM.BASE_INFO'), partitionTitle: this.$t('SYSTEM.GROUP_INFO')},
            typeArray: [{name: this.$t('SYSTEM.ALL_PARTITION_TYPE'), value: 'ignore'}, {name: 'SATA', value: 'SATA'}, {name: 'SSD', value: 'SSD'}],
            readArray: [{name: this.$t('SYSTEM.ALL_WRITE_STATE'), value: 'ignore'}, {name: this.$t('SYSTEM.READONLY'), value: 1}, {name: this.$t('SYSTEM.WRITABLE'), value: 0}],
            failArray: [{name: this.$t('SYSTEM.ALL_FAIL_STATE'), value: 'ignore'}, {name: this.$t('SYSTEM.NORMAL'), value: 0}, {name: this.$t('SYSTEM.DELETED'), value: 1}],
            search: {
                idc: 'ignore',
                media_type: 'ignore',
                read_only: 'ignore',
                fail: 'ignore',
                ip: '',
                min_capacity: '',
                max_capacity: '',
                min_free: '',
                max_free: ''
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
            capacity: 0,
            usedDetail: {},
            idcAll: [],
            spinGroup: false,
            showType: 'card',
            self: this,
            detailItem: {},
            detailHead: [{name: 'Group ID', value: 'group_id'},
                {name: this.$t('SYSTEM.FILE_NUM'), value: 'num_used'},
                {name: this.$t('SYSTEM.CAPACITY'), value: 'space_used'},
                {name: this.$t('SYSTEM.STATE'), value: 'readonly'},
                {name: this.$t('SYSTEM.CREATION_TIME'), value: 'ts'},
                {name: this.$t('SYSTEM.MIGRATION_PROGRESS'), value: 'traffic_status'}],
            usedHeader: [{
                title: 'ID',
                key: 'partition_id',
                width: 260
            }, {
                title: 'IDC',
                key: 'idc',
                width: 180
            }, {
                title: 'IO',
                key: 'ioutil',
                width: 90,
                align: 'right',
                sortable: true,
                render: (h, params) => {
                    const font = params.row.ioutil || params.row.ioutil === 0 ? `${params.row.ioutil}%` : '--'
                    return h('div', {
                        'class': params.row.ioutil > 90 ? 'redFont' : ''
                    }, [font])
                }
            }, {
                title: '容量',
                key: 'used_rate',
                width: 90,
                align: 'right',
                sortable: true,
                render: (h, params) => {
                    const font = params.row.used_rate || params.row.used_rate === 0 ? `${params.row.used_rate}%` : '--'
                    return h('div', {
                        'class': params.row.used_rate > 99 ? 'redFont' : ''
                    }, [font])
                }
            }, {
                title: 'CPU',
                key: 'cpu',
                width: 90,
                align: 'right',
                sortable: true,
                render: (h, params) => {
                    const font = params.row.cpu || params.row.cpu === 0 ? `${params.row.cpu}%` : '--'
                    return h('div', {
                        'class': params.row.cpu > 20 ? 'redFont' : ''
                    }, [font])
                }
            }, {
                title: this.$t('SYSTEM.USED_TOTAL_CAPACITY'),
                key: 'group_id',
                width: 150,
                render: (h, params) => {
                    const font = (params.row.space || params.row.space === 0) && (params.row.capacity || params.row.capacity === 0) ? `${bytes(params.row.space)}/${bytes(params.row.capacity)}` : '--/--'
                    return h('div', [font])
                }
            }, {
                title: this.$t('SYSTEM.MEDIA_TYPE'),
                key: 'media_type',
                width: 80
            }, {
                title: this.$t('SYSTEM.IS_NORMAL'),
                key: 'fail',
                width: 80,
                render: (h, params) => {
                    const font = !!params.row.fail ? this.$t('SYSTEM.DELETED') : this.$t('SYSTEM.NORMAL')
                    return h('div', {
                        'class': !!params.row.fail ? 'redFont' : ''
                    }, [font])
                }
            }, {
                title: this.$t('SYSTEM.NUM'),
                key: 'group_num',
                width: 90
            }, {
                title: this.$t('VIDEO.OPERATION'),
                width: 230,
                align: 'right',
                render: (h, params) => {
                    const buttons = params.row.readonly === 0 ? '' : params.row.group_num === 0 ? h('i-button', {
                        'class': ['delete'],
                        props: {
                            type: 'ghost',
                            size: 'small',
                            disabled: params.row.disabled
                        },
                        on: {
                            click: () => {
                                this.usedDeletedConfirm(params.row._index)
                            }
                        },
                        style: {
                            color: '#fff',
                            'background-color': '#f85959',
                            'border-color': '#f85959'
                        }
                    }, [this.$t('PUBLIC.DELETE')]) : h('i-button', {
                        props: {
                            type: 'ghost',
                            size: 'small',
                            disabled: params.row.disabled
                        },
                        on: {
                            click: () => {
                                this.usedMove(params.row._index)
                            }
                        }
                    }, [this.$t('SYSTEM.MIGRATE')])
                    return h('div', [h('div', {
                        style: {
                            display: 'inline-block',
                            padding: '0 10px 0 0'
                        }
                    }, [buttons]), h('i-switch', {
                        props: {
                            value: params.row.readonly === 0,
                            size: 'large',
                            disabled: params.row.disabled
                        },
                        on: {
                            input: () => {
                                this.usedSetConfirm(params.row._index)
                            }
                        }
                    }, [h('span', {
                        slot: 'open'
                    }, this.$t('SYSTEM.WRITABLE')), h('span', {
                        slot: 'close'
                    }, this.$t('SYSTEM.READONLY'))]), h('i-button', {
                        props: {
                            size: 'small'
                        },
                        on: {
                            click: () => {
                                this.detailItem = params.row
                                this.openDetail(params.row.partition_id)
                            }
                        },
                        style: {
                            margin: '0 0 0 10px'
                        }
                    }, [this.$t('SYSTEM.DETAILS')])
                    ])
                }
            }]
        }
    },
    created () {
        this.searchIdc()
        this.getUsedList()
    },
    components: {
        partitionCard, idcCard, partitionUnused, partitionDeleted, detailModal
    },
    computed: {
        IPparam () {
            return this.search.ip.length === 0 ? 'ignore' : this.search.ip
        },
        lowerCapacityMax () {
            if (!!this.search.max_capacity) {
                return this.search.max_capacity
            }
            return 10000
        },
        upperCapacityMin () {
            if (!!this.search.min_capacity) {
                return this.search.min_capacity
            }
            return 0
        },
        lowerFreeMax () {
            if (!!this.search.max_free) {
                return this.search.max_free
            }
            return 10000
        },
        upperFreeMin () {
            if (!!this.search.min_free) {
                return this.search.min_free
            }
            return 0
        },
        modalData () {
            let tableData = _.map(this.usedDetail, (item) => {
                let newItem = {}
                newItem.group_id = item.group_id
                newItem.ts = item.ts
                newItem.num_used = thousands(item.num_used)
                newItem.space_used = bytes(item.space_used)
                newItem.traffic_status = item.traffic_status || this.$t('SYSTEM.NO_PROGRESS')
                newItem.readonly = item.readonly === '1' ? this.$t('SYSTEM.WRITABLE') : this.$t('SYSTEM.READONLY')
                return newItem
            })
            let basicInfo = [{name: 'Partition ID', value: this.detailItem.partition_id},
                {name: 'path', value: this.detailItem.partition_path},
                {name: 'IDC', value: this.detailItem.idc},
                {name: 'IP', value: this.detailItem.inn_ips ? this.detailItem.inn_ips[0] : ''},
                {name: this.$t('SYSTEM.CAPACITY'), value: this.detailItem.used_rate, isRed: this.detailItem.used_rate > 99},
                {name: 'CPU', value: this.detailItem.cpuFont, tooltip: this.$t('SYSTEM.PARTITION_CPU_INFO'), isRed: this.detailItem.cpu > 20},
                {name: this.$t('SYSTEM.MEDIA_TYPE'), value: this.detailItem.media_type},
                {name: 'IO', value: this.detailItem.ioutil, isRed: this.detailItem.ioutil > 90},
                {name: this.$t('SYSTEM.RW_STATUS'), value: this.detailItem.readonlyFont},
                {name: this.$t('SYSTEM.IS_DEL'), value: this.detailItem.failFont, isRed: this.detailItem.fail}]
            let detailHead = this.detailHead
            return {tableData, basicInfo, detailHead}
        }
    },
    methods: {
        chartToggle (index) {
            this.showChart = index
            this.pageCount = 1
            this.pageTotal = 1
            this.getUsedList()
        },
        tabToggle (index) {
            this.tabName = index
            this.pageCount = 1
            this.pageTotal = 1
            if (index === 'used') {
                this.getUsedList()
            } else if (index === 'unused') {
                this.getUnusedList()
            } else {
                this.getDeletedList()
            }
        },
        async searchList () {
            this.pageCount = 1
            this.pageTotal = 1
            if (this.tabName === 'used') {
                this.spinContent = true
                await this.searchIdc()
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
        async searchIdc () {
            await this.getIdcList()
            if (this.search.idc !== 'ignore') {
                this.idcList = this.idcList.filter(item => {
                    return item.idc === this.search.idc
                })
            }
            if (this.search.media_type !== 'ignore') {
                const type = this.search.media_type
                this.idcList = this.idcList.filter(item => {
                    return item[type].capacity !== 0
                })
            } else {
                this.idcList = this.idcList.filter(item => {
                    return item.SSD.capacity !== 0 || item.SATA.capacity !== 0
                })
            }
        },
        async getIdcList () {
            this.spinContent = true
            this.$Loading.start()
            try {
                let listData = await this.$http.get(PARTITION_IDC_LIST)
                this.idcList = Object.entries(listData).map(item => {
                    let objItem = {}
                    objItem.idc = item[0]
                    objItem.SATA = item[1].SATA || {}
                    objItem.SSD = item[1].SSD || {}
                    return objItem
                })
                this.idcAll = Object.keys(listData)
                this.spinContent = false
                this.$Loading.finish()
            } catch (error) {
                this.spinContent = false
                this.$Loading.error()
            }
        },
        async getUsedDetail (id) {
            this.spinGroup = true
            this.$Loading.start()
            try {
                const params = {
                    partition_id: id
                }
                this.usedDetail = await this.$http.get(PARTITION_USED_DETAIL, {params})
                this.spinGroup = false
                this.$Loading.finish()
            } catch (error) {
                this.spinGroup = false
                this.$Loading.error()
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
                    count: 20
                }
                let listData = await this.$http.get(listURL, {params})
                this.partitionList = listData.partition || []
                this.partitionList.map(item => {
                    item.disabled = false
                })
                this.listNum = listData.total_count || 0
                this.pageTotal = listData.total_count ? Math.ceil(listData.total_count / 20) : 1
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
                    min_capacity: this.search.min_capacity ? bytes(`${this.search.min_capacity}TB`) : 'ignore',
                    max_capacity: this.search.max_capacity ? bytes(`${this.search.max_capacity}TB`) : 'ignore',
                    min_free: this.search.min_free ? bytes(`${this.search.min_free}TB`) : 'ignore',
                    max_free: this.search.max_free ? bytes(`${this.search.max_free}TB`) : 'ignore',
                    page: this.pageCount,
                    count: 20
                }
                let unusedData = await this.$http.get(listURL, {params})
                this.unusedList = unusedData.partition || []
                this.listNum = unusedData.total_count || 0
                this.pageTotal = unusedData.total_count ? Math.ceil(unusedData.total_count / 20) : 1
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
                this.deletedList = typeof (deletedData) === 'string' ? [] : deletedData
                this.spinContent = false
                this.$Loading.finish()
            } catch (error) {
                this.spinContent = false
                this.$Loading.error()
            }
        },
        resetParams () {
            this.search = {
                idc: 'ignore',
                media_type: 'ignore',
                read_only: 'ignore',
                fail: 'ignore',
                ip: '',
                min_capacity: '',
                max_capacity: '',
                min_free: '',
                max_free: ''
            }
        },
        openDetail (id) {
            this.getUsedDetail(id)
            this.showDetailModal = true
        },
        usedSetConfirm (index) {
            const readonly = this.partitionList[index].readonly
            const contentText = !!readonly ? this.$t('SYSTEM.WRITABLE') : this.$t('SYSTEM.READONLY')
            this.$Modal.confirm({
                content: this.$t('SYSTEM.WRITABLE_CONFIRM', {state: contentText}),
                okText: this.$t('PUBLIC.CONFIRMED'),
                cancelText: this.$t('PUBLIC.CANCLE'),
                title: this.$t('SYSTEM.WRITABLE_CONFIRM_TITLE'),
                onCancel: () => {
                    this.partitionList[index].readonly = !!readonly ? 0 : 1
                    this.partitionList[index].readonly = readonly
                },
                onOk: () => this.usedSet(index)
            })
        },
        async usedSet (index) {
            this.spinShow = true
            this.$Loading.start()
            const oldValue = this.partitionList[index].readonly
            const newValue = !!oldValue ? 0 : 1
            try {
                let params = {
                    read_only: newValue,
                    partition_id: this.partitionList[index].partition_id
                }
                await this.$http.post(PARTITION_USED_SET, params)
                this.partitionList[index].readonly = newValue
                this.spinShow = false
                this.$Loading.finish()
                this.$Message.success(this.$t('SYSTEM.SUCCESS'))
            } catch (error) {
                this.$parent.getUsedList()
                this.spinShow = false
                this.$Loading.error()
                this.$Message.error(this.$t('SYSTEM.FAILURE'))
            }
        },
        async usedMove (index) {
            this.spinShow = true
            this.$Loading.start()
            try {
                let params = {
                    partition_id: this.partitionList[index].partition_id
                }
                await this.$http.post(PARTITION_USED_MOVE, params)
                this.partitionList[index].disabled = true
                this.spinShow = false
                this.$Loading.finish()
                this.$Message.success(this.$t('SYSTEM.SUCCESS'))
            } catch (error) {
                this.spinShow = false
                this.$Loading.error()
                this.$Message.error(this.$t('SYSTEM.FAILURE'))
            }
        },
        usedDeletedConfirm (id) {
            this.$Modal.confirm({
                content: this.$t('SYSTEM.PARTITION_DELETE_CONFIRM'),
                okText: this.$t('PUBLIC.CONFIRMED'),
                cancelText: this.$t('PUBLIC.CANCLE'),
                title: this.$t('PUBLIC.DELETE'),
                onOk: () => this.usedDeleted(id)
            })
        },
        async usedDeleted (index) {
            this.spinShow = true
            this.$Loading.start()
            try {
                let params = {
                    partition_id: this.partitionList[index].partition_id
                }
                await this.$http.post(PARTITION_USED_DELETED, params)
                this.partitionList[index].disabled = true
                this.spinShow = false
                this.$Loading.finish()
                this.$Message.success(this.$t('SYSTEM.SUCCESS'))
            } catch (error) {
                this.spinShow = false
                this.$Loading.error()
                this.$Message.error(this.$t('SYSTEM.FAILURE'))
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
    }
}
.dark{
    .@{css-prefix}partition {
        position: relative;
        min-height: calc( 100vh - 60px);
        .header {
            .search {
                border-top: 1px dashed #52626d;
            }

            .search-unused{
                color: @text-color-dark;
            }
        }
    }
}
.delete{
    color: #fff;
    background-color:#f85959 !important;
    border-color: #f85959;
}
</style>
