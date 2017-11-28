<template>
    <div class="bsc-dashboard">
        <Spin size="bigger" fix v-if="spinShow"></Spin>
        <div class="toolbar">
            <div class="button-datepicker">
                <Select :prepend="true" v-model="selectedBucket" style="width:30%;float:left;margin-right:16px;" @on-change="getInitData">
                    <Icon slot="prepend" type="ios-folder"></Icon>
                    <Option v-for="item in bucketList" :value="item.Name" :key="item.Name">{{ item.Name }}</Option>
                </Select>
                <Date-picker v-model="dateSelect" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="Select time" :options="dateOptions" style="width: 40%;float:left;"></Date-picker>
                <Button type="primary" style="float:left;margin-left:16px;" @click="exportCsv">{{ $t("DASHBOARD.EXPORT_DATA")}}</Button>
            </div>
            <div class="button-daterange">
                <Button-group>
                    <Button v-bind:class="{buttonFocus: dateSelect[0].getTime() === dateDefault.today[0].getTime()}" @click="dateSelect = dateDefault.today">{{ $t("DASHBOARD.TODAY")}}</Button>
                    <Button v-bind:class="{buttonFocus: dateSelect[0].getTime() === dateDefault.seven_days[0].getTime()}" @click="dateSelect = dateDefault.seven_days">{{ $t("DASHBOARD.SEVEN_DAYS")}}</Button>
                    <Button v-show="!isFristDay" v-bind:class="{buttonFocus: dateSelect[0].getTime() === dateDefault.this_month[0].getTime()}" @click="dateSelect = dateDefault.this_month" >{{ $t("DASHBOARD.THIS_MONTH")}}</Button>
                    <Button v-bind:class="{buttonFocus: dateSelect[0].getTime() === dateDefault.thirty_days[0].getTime()}" @click="dateSelect = dateDefault.thirty_days">{{ $t("DASHBOARD.THIRTY_DAYS")}}</Button>
                </Button-group>
            </div>
        </div>
        <div class="overview">
            <div>
                <Tooltip :content='$t("DASHBOARD.CAPACITY_ALL_INFO")'>
                    <div class="content">
                        <span>{{originOverview.capacity && originOverview.capacity[0]}}</span>
                        <span>{{originOverview.capacity && originOverview.capacity[1]}}</span>
                        <p>{{ $t("DASHBOARD.CAPACITY_ALL")}}<Icon type="ios-help"></Icon></p>
                    </div>
                </Tooltip>
            </div>
            <div>
                <Tooltip :content='$t("DASHBOARD.INFLOWS_ALL_INFO")'>
                    <div class="content">
                        <span>{{originOverview.inflows && originOverview.inflows[0]}}</span>
                        <span>{{originOverview.inflows && originOverview.inflows[1]}}</span>
                        <p>{{ $t("DASHBOARD.INFLOWS_ALL")}}<Icon type="ios-help"></Icon></p>
                    </div>
                </Tooltip>
            </div>
            <div>
                <Tooltip :content='$t("DASHBOARD.OUTFLOWS_ALL_INFO")'>
                    <div class="content">
                        <span>{{originOverview.outflows && originOverview.outflows[0]}}</span>
                        <span>{{originOverview.outflows && originOverview.outflows[1]}}</span>
                        <p>{{ $t("DASHBOARD.OUTFLOWS_ALL")}}<Icon type="ios-help"></Icon></p>
                    </div>
                </Tooltip>
            </div>
            <div>
                <Tooltip :content='$t("DASHBOARD.REQUESTS_ALL_INFO")'>
                    <div class="content">
                        <span>{{originOverview.requests && originOverview.requests[0]}}</span>
                        <span>{{originOverview.requests && originOverview.requests[1]}}</span>
                        <p>{{ $t("DASHBOARD.REQUESTS_ALL")}}<Icon type="ios-help"></Icon></p>
                    </div>
                </Tooltip>
            </div>
            <div>
                <Tooltip :content='$t("DASHBOARD.FILES_ALL_INFO")'>
                    <div class="content">
                        <span>{{originOverview.files && originOverview.files[0]}}</span>
                        <span>{{originOverview.files && originOverview.files[1]}}</span>
                        <p>{{ $t("DASHBOARD.FILES_ALL")}}<Icon type="ios-help"></Icon></p>
                    </div>
                </Tooltip>
            </div>
        </div>
        <div class="section-chart-tab">
            <button v-bind:class="{buttonFocus: showChart === 0}" @click="tabToggle(0,'capacityLine')">{{ $t("DASHBOARD.CAPACITY")}}</button>
            <button v-bind:class="{buttonFocus: showChart === 1}" @click="tabToggle(1,'inflowsLine')">{{ $t("DASHBOARD.INFLOWS")}}</button>
            <button v-bind:class="{buttonFocus: showChart === 2}" @click="tabToggle(2,'outflowsLine')">{{ $t("DASHBOARD.OUTFLOWS")}}</button>
            <button v-bind:class="{buttonFocus: showChart === 3}" @click="tabToggle(3,'requestsLine')">{{ $t("DASHBOARD.REQUESTS")}}</button>
            <button v-bind:class="{buttonFocus: showChart === 4}" @click="tabToggle(4,'filesLine')">{{ $t("DASHBOARD.FILES")}}</button>
        </div>
        <div class="section-chart">
            <div class="card-chart" v-show="showChart === 0">
                <chart :options="capacityOptions" auto-resize ref="capacityLine"></chart>
            </div>
            <div class="card-chart" v-show="showChart === 1">
                <chart :options="inflowsOptions" auto-resize ref="inflowsLine"></chart>
            </div>
            <div class="card-chart" v-show="showChart === 2">
                <chart :options="outflowsOptions" auto-resize ref="outflowsLine"></chart>
            </div>
            <div class="card-chart" v-show="showChart === 3">
                <chart :options="requestsOptions" auto-resize ref="requestsLine"></chart>
            </div>
            <div class="card-chart" v-show="showChart === 4">
                <chart :options="filesOptions" auto-resize ref="filesLine"></chart>
            </div>
        </div>
    </div>
</template>
<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/map'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import read from '../../assets/dashboard/read.png'
import readDark from '../../assets/dashboard/read-dark.png'
import write from '../../assets/dashboard/write.png'
import writeDark from '../../assets/dashboard/write-dark.png'
import deleteRequset from '../../assets/dashboard/delete-request.png'
import deleteRequsetDark from '../../assets/dashboard/delete-request-dark.png'
import deleteTraffic from '../../assets/dashboard/delete-traffic.png'
import deleteTrafficDark from '../../assets/dashboard/delete-traffic-dark.png'
import { getBucketList } from '@/service/Data'
import { getBillOldUrl, getBillUrl } from '@/service/API'
import user from '@/store/modules/user'
import { bytes, times, timesK, dateTime, bytesSpliteUnits, timesSpliteUnits } from '@/service/bucketService'
import Csv from './csv'
import fileSaver from 'file-saver'
export default {
    data () {
        return {
            showChart: 0,
            dateDividedBefore: '20171120',
            dateDivided: '20171121',
            bucketList: this.bucketList,
            selectedBucket: 'All Buckets',
            dateDefault: {
                today: [lastNDays(0), lastNDays(0)],
                seven_days: [lastNDays(6), lastNDays(0)],
                this_month: [new Date(new Date().setDate(1)), lastNDays(0)],
                thirty_days: [lastNDays(29), lastNDays(0)]
            },
            dateSelect: [lastNDays(0), lastNDays(0)],
            originOverview: {},
            dateOptions: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now()
                }
            },
            exportData: [],
            spinShow: true,
            capacityOptions: lineOptions,
            inflowsOptions: lineOptions,
            outflowsOptions: lineOptions,
            requestsOptions: lineOptions,
            filesOptions: lineOptions
        }
    },
    components: {
        chart: ECharts
    },
    computed: {
        dateRange () {
            return formatDate(this.dateSelect[0]) + '-' + formatDate(this.dateSelect[1])
        },
        isFristDay () {
            return new Date().getDate() === 1
        },
        imgSrc: function () {
            return this.$store.state.theme === 'dark' ? [readDark, writeDark, deleteRequsetDark, deleteTrafficDark] : [read, write, deleteRequset, deleteTraffic]
        },
        theme: function () {
            return this.$store.state.theme
        },
        xLabelRotate: function () {
            return (this.dateSelect[1] - this.dateSelect[0]) / 86400000 + 1 >= 15
        }
    },
    created () {
        this.convertBucketList()
        this.getInitData()
    },
    methods: {
        async convertBucketList () {
            try {
                let res = await getBucketList()
                this.bucketList = [{ Name: 'All Buckets' }, ...res.Buckets]
            } catch (error) {
                console.log(error)
                this.$Message.error(this.$t('DASHBOARD.GET_BUCKET_FAILED'))
            }
        },
        async getInitData () {
            this.spinShow = true
            if (!this.dateSelect) return

            let dateStart = formatDate(this.dateSelect[0])
            let dateEnd = formatDate(this.dateSelect[1])

            if (dateEnd < this.dateDivided) {
                // old storage
                try {
                    await Promise.all([this.$http.get(this.getApiURL('old', this.dateRange)).then(res => {
                        // overview data old
                        this.originOverview = {
                            capacity: this.convertData(res.total.space_used, true, 'byte'),
                            inflows: this.convertData(res.sum.flow_up, true, 'byte'),
                            outflows: this.convertData(res.sum.flow_down, true, 'byte'),
                            requests: this.convertData(res.sum.read_count + res.sum.write_count + res.sum.delete_count, true, 'times'),
                            files: this.convertData(res.total.num_used, true, '个')
                        }
                        // echarts data old
                        _.extend(this, res)
                        this.setOptions('old')
                    })]).then(res => {
                        // export data old
                        this.exportData = []
                        _.each(this.time_nodes.map(time => time * 1000), (time, index) => {
                            this.exportData.push({
                                time: dateTime(time),
                                '存储容量（字节）': this.distributed.space_used[index],
                                '流入流量（字节）': this.distributed.flow_up[index],
                                '流出流量（字节）': this.distributed.flow_down[index],
                                '读请求数（次）': this.distributed.read_count[index],
                                '写请求数（次）': this.distributed.write_count[index],
                                '删除请求数（次）': this.distributed.delete_count[index],
                                '文件数（个）': this.distributed.num_used[index]
                            })
                        })
                        this.spinShow = false
                    })
                } catch (error) {
                    console.log(error)
                    this.spinShow = false
                    this.$Message.warning(this.$t('STORAGE.GET_DATA_ERROR'))
                }
            } else if (dateStart >= this.dateDivided) {
                // new storage
                try {
                    await Promise.all([this.$http.get(this.getApiURL('new', this.dateRange)).then(res => {
                        // overview data new
                        this.originOverview = {
                            capacity: this.convertData(res.total.space_used, true, 'byte'),
                            inflows: this.convertData(res.sum.flow_up_cdn + res.sum.flow_up_pub, true, 'byte'),
                            outflows: this.convertData(res.sum.flow_down_cdn + res.sum.flow_down_pub, true, 'byte'),
                            requests: this.convertData(res.sum.get_count + res.sum.head_count + res.sum.post_count + res.sum.put_count + res.sum.delete_count + res.sum.list_count, true, 'times'),
                            files: this.convertData(res.total.num_used, true, '个')
                        }
                        // echarts data new
                        _.extend(this, res)
                        this.setOptions('new')
                    })]).then(res => {
                        // export data new
                        this.exportData = []
                        _.each(this.time_nodes.map(time => time * 1000), (time, index) => {
                            let exportData = {
                                time: dateTime(time),
                                '存储容量（字节）': this.distributed.space_used[index],
                                '流入流量（字节）': this.distributed.flow_up_cdn[index] + this.distributed.flow_up_pub[index],
                                '公网流入流量（字节）': this.distributed.flow_up_pub[index],
                                '流出流量（字节）': this.distributed.flow_down_cdn[index] + this.distributed.flow_down_pub[index],
                                '公网流出流量（字节）': this.distributed.flow_down_pub[index],
                                '读请求数（次）': this.distributed.get_count[index] + this.distributed.head_count[index],
                                '写请求数（次）': this.distributed.post_count[index] + this.distributed.put_count[index],
                                '删除请求数（次）': this.distributed.delete_count[index],
                                '列文件请求数（次）': this.distributed.delete_count[index],
                                '文件数（个）': this.distributed.num_used[index]
                            }
                            _.forEach(this.distributed.up_cdn, (value, key) => {
                                exportData[`${key}流入流量（字节）`] = value[index]
                            })
                            _.forEach(this.distributed.down_cdn, (value, key) => {
                                exportData[`${key}流出流量（字节）`] = value[index]
                            })
                            this.exportData.push(exportData)
                        })
                        this.spinShow = false
                    })
                } catch (error) {
                    console.log(error)
                    this.spinShow = false
                    this.$Message.warning(this.$t('STORAGE.GET_DATA_ERROR'))
                }
            } else {
                // old and new storage
                let originOverviewOld = {}
                let originOverviewNew = {}
                let echartDataOld = {}
                let echartDataNew = {}
                let oldTimeLength = ''
                try {
                    await Promise.all([this.$http.get(this.getApiURL('old', dateStart + '-' + this.dateDividedBefore)).then(res => {
                        // overview data old
                        originOverviewOld = {
                            inflows: res.sum.flow_up,
                            outflows: res.sum.flow_down,
                            requests: res.sum.read_count + res.sum.write_count + res.sum.delete_count
                        }
                        // echarts data old
                        echartDataOld = {
                            time_nodes: res.time_nodes,
                            space_used: res.distributed.space_used,
                            flow_up: res.distributed.flow_up,
                            flow_down: res.distributed.flow_down,
                            read_count: res.distributed.read_count,
                            write_count: res.distributed.write_count,
                            delete_count: res.distributed.delete_count,
                            num_used: res.distributed.num_used
                        }
                        oldTimeLength = res.time_nodes.length
                    }), this.$http.get(this.getApiURL('new', this.dateRange)).then(res => {
                        // overview data new
                        originOverviewNew = {
                            capacity: res.total.space_used,
                            inflows: res.sum.flow_up_cdn + res.sum.flow_up_pub,
                            outflows: res.sum.flow_down_cdn + res.sum.flow_down_pub,
                            requests: res.sum.get_count + res.sum.head_count + res.sum.post_count + res.sum.put_count + res.sum.delete_count + res.sum.list_count,
                            files: res.total.num_used
                        }
                        // echarts data new
                        echartDataNew = {
                            time_nodes: res.time_nodes,
                            space_used: res.distributed.space_used,
                            flow_up: this.combineTwoArray(res.distributed.flow_up_cdn, res.distributed.flow_up_cdn),
                            flow_up_pub: res.distributed.flow_up_cdn,
                            up_cdn: res.distributed.up_cdn,
                            flow_down: this.combineTwoArray(res.distributed.flow_down_cdn, res.distributed.flow_down_pub),
                            flow_down_pub: res.distributed.flow_down_pub,
                            down_cdn: res.distributed.down_cdn,
                            read_count: this.combineTwoArray(res.distributed.get_count, res.distributed.head_count),
                            write_count: this.combineTwoArray(res.distributed.post_count, res.distributed.put_count),
                            delete_count: res.distributed.delete_count,
                            list_count: res.distributed.list_count,
                            num_used: res.distributed.num_used
                        }
                    })]).then(res => {
                        // overview data total
                        this.originOverview = {
                            capacity: this.convertData(originOverviewNew.capacity, true, 'byte'),
                            inflows: this.convertData(originOverviewOld.inflows + originOverviewNew.inflows, true, 'byte'),
                            outflows: this.convertData(originOverviewOld.outflows + originOverviewNew.outflows, true, 'byte'),
                            requests: this.convertData(originOverviewOld.requests + originOverviewNew.requests, true, 'time'),
                            files: this.convertData(originOverviewNew.files, true, 'time')
                        }
                        // echarts data total
                        let echartData = {
                            time_nodes: echartDataOld.time_nodes.concat(echartDataNew.time_nodes),
                            space_used: echartDataOld.space_used.concat(echartDataNew.space_used),
                            flow_up: echartDataOld.flow_up.concat(echartDataNew.flow_up),
                            flow_up_pub: echartDataNew.flow_up_pub,
                            up_cdn: echartDataNew.up_cdn,
                            flow_down: echartDataOld.flow_down.concat(echartDataNew.flow_down),
                            flow_down_pub: echartDataNew.flow_down_pub,
                            down_cdn: echartDataNew.down_cdn,
                            read_count: echartDataOld.read_count.concat(echartDataNew.read_count),
                            write_count: echartDataOld.write_count.concat(echartDataNew.write_count),
                            delete_count: echartDataOld.delete_count.concat(echartDataNew.delete_count),
                            list_count: echartDataNew.list_count,
                            num_used: echartDataOld.num_used.concat(echartDataNew.num_used)
                        }
                        _.extend(this, echartData)
                        this.setOptions('oldAndNew')
                        // export data total
                        this.exportData = []
                        _.each(echartData.time_nodes.map(time => time * 1000), (time, index) => {
                            let exportData = {
                                time: dateTime(time),
                                '存储容量（字节）': echartData.space_used[index],
                                '流入流量（字节）': echartData.flow_up[index],
                                '公网流入流量（字节）': index < oldTimeLength ? '' : echartData.flow_up_pub[index - oldTimeLength],
                                '流出流量（字节）': echartData.flow_down[index],
                                '公网流出流量（字节）': index < oldTimeLength ? '' : echartData.flow_down_pub[index - oldTimeLength],
                                '读请求数（次）': echartData.read_count[index],
                                '写请求数（次）': echartData.write_count[index],
                                '删除请求数（次）': echartData.delete_count[index],
                                '列文件请求数（次）': index < oldTimeLength ? '' : echartData.delete_count[index - oldTimeLength],
                                '文件数（个）': echartData.num_used[index]
                            }
                            _.forEach(echartData.up_cdn, (value, key) => {
                                exportData[`${key}流入流量（字节）`] = index < oldTimeLength ? '' : value[index - oldTimeLength]
                            })
                            _.forEach(echartData.down_cdn, (value, key) => {
                                exportData[`${key}流出流量（字节）`] = index < oldTimeLength ? '' : value[index - oldTimeLength]
                            })
                            this.exportData.push(exportData)
                        })
                        this.spinShow = false
                    })
                } catch (error) {
                    console.log(error)
                    this.spinShow = false
                    this.$Message.warning(this.$t('STORAGE.GET_DATA_ERROR'))
                }
            }
        },
        setOptions (url) {
            if (url === 'old') {
                this.capacityOptions = initOptions(this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.space_used, 'byte', '存储容量'), this.theme, this.xLabelRotate)
                this.inflowsOptions = initOptions(this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.flow_up, 'byte', '流入流量'), this.theme, this.xLabelRotate)
                this.outflowsOptions = initOptions(this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.flow_down, 'byte', '流出流量'), this.theme, this.xLabelRotate)
                this.requestsOptions = initNewOptions(
                    this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.read_count, 'times', '读请求数'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.write_count, 'times', '写请求数'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.delete_count, 'times', '删除请求数'),
                    '',
                    this.theme,
                    this.xLabelRotate
                )
                this.filesOptions = initOptions(this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.num_used, '个', '文件数'), this.theme, this.xLabelRotate)
            } else if (url === 'new') {
                let newOneDayFlag = formatDate(this.dateSelect[0]) === formatDate(this.dateSelect[1])
                this.capacityOptions = initOptions(this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.space_used, 'byte', '存储容量'), this.theme, this.xLabelRotate, newOneDayFlag)
                this.inflowsOptions = initNewOptions(
                    this.combineTimeDataUnitLabel(this.time_nodes, this.combineTwoArray(this.distributed.flow_up_cdn, this.distributed.flow_up_pub), 'byte', '流入流量'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.flow_up_pub, 'byte', '公网流入流量'),
                    this.combineTimeDataUnitLabelToObjectArray(this.time_nodes, this.distributed.up_cdn, 'byte', 'up'),
                    '',
                    this.theme,
                    this.xLabelRotate,
                    newOneDayFlag
                )
                this.outflowsOptions = initNewOptions(
                    this.combineTimeDataUnitLabel(this.time_nodes, this.combineTwoArray(this.distributed.flow_down_cdn, this.distributed.flow_down_pub), 'byte', '流出流量'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.flow_down_pub, 'byte', '公网流出流量'),
                    this.combineTimeDataUnitLabelToObjectArray(this.time_nodes, this.distributed.down_cdn, 'byte', 'down'),
                    '',
                    this.theme,
                    this.xLabelRotate,
                    newOneDayFlag
                )
                this.requestsOptions = initNewOptions(
                    this.combineTimeDataUnitLabel(this.time_nodes, this.combineTwoArray(this.distributed.get_count, this.distributed.head_count), 'times', '读请求数'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.combineTwoArray(this.distributed.post_count, this.distributed.put_count), 'times', '写请求数'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.delete_count, 'times', '删除请求数'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.list_count, 'times', '列文件请求数'),
                    this.theme,
                    this.xLabelRotate,
                    newOneDayFlag
                )
                this.filesOptions = initOptions(this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.num_used, '个', '文件数'), this.theme, this.xLabelRotate, newOneDayFlag)
            } else {
                this.capacityOptions = initOptions(this.combineTimeDataUnitLabel(this.time_nodes, this.space_used, 'byte', '存储容量'), this.theme, this.xLabelRotate)
                this.inflowsOptions = initNewOptions(
                    this.combineTimeDataUnitLabel(this.time_nodes, this.flow_up, 'byte', '流入流量'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.flow_up_pub, 'byte', '公网流入流量'),
                    this.combineTimeDataUnitLabelToObjectArray(this.time_nodes, this.up_cdn, 'byte', 'up'),
                    '',
                    this.theme,
                    this.xLabelRotate
                )
                this.outflowsOptions = initNewOptions(
                    this.combineTimeDataUnitLabel(this.time_nodes, this.flow_down, 'byte', '流出流量'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.flow_down_pub, 'byte', '公网流出流量'),
                    this.combineTimeDataUnitLabelToObjectArray(this.time_nodes, this.down_cdn, 'byte', 'down'),
                    '',
                    this.theme,
                    this.xLabelRotate
                )
                this.requestsOptions = initNewOptions(
                    this.combineTimeDataUnitLabel(this.time_nodes, this.read_count, 'times', '读请求数'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.write_count, 'times', '写请求数'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.delete_count, 'times', '删除请求数'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.list_count, 'times', '列文件请求数'),
                    this.theme,
                    this.xLabelRotate
                )
                this.filesOptions = initOptions(this.combineTimeDataUnitLabel(this.time_nodes, this.num_used, '个', '文件数'), this.theme, this.xLabelRotate)
            }
        },
        combineTwoArray (array1, array2) {
            let combinedData = []
            _.forEach(array1, (value, key) => {
                combinedData.push(value + array2[key])
            })
            return combinedData
        },
        combineTimeDataUnitLabel (time, data, unit, label) {
            let _time = time.length === data.length ? time : time.slice(time.length - data.length)
            let combinedData = []
            _.forEach(_time, (value, key) => {
                combinedData.push([value * 1000, data[key]])
            })
            let object = {
                label: label,
                unit: unit,
                data: combinedData
            }
            return object
        },
        combineTimeDataUnitLabelToObjectArray (time, data, unit, upOrDown) {
            let objectArray = []
            _.forEach(data, (value, key) => {
                let _time = time.length === value.length ? time : time.slice(time.length - value.length)
                let combinedData = []
                _.forEach(_time, (value, index) => {
                    combinedData.push([value * 1000, data[key][index]])
                })
                let object = {
                    label: key + (upOrDown === 'up' ? '流入流量' : '流出流量'),
                    unit: unit,
                    data: combinedData
                }
                objectArray.push(object)
            })
            return objectArray
        },
        convertData (value, splite = false, unit) {
            if (!value) {
                return ['0']
            }
            return splite ? unit === 'byte' ? bytesSpliteUnits(value) : timesSpliteUnits(value) : unit === 'byte' ? bytes(value) : times(value)
        },
        getApiURL (url, range) {
            let path = ''
            path += '?custom_range=' + range
            if (this.selectedBucket && this.selectedBucket !== 'All Buckets') {
                path += '&bucket=' + this.selectedBucket
            }
            if (user.state.type === 'admin') {
                path += '&customer=' + user.state.subUser.username
            }
            return url === 'new' ? getBillUrl(path) : getBillOldUrl(path)
        },
        tabToggle (index, ref) {
            let vm = this
            vm.showChart = index
            setTimeout(() => { vm.$refs[ref].resize() }, 100)
        },
        exportCsv () {
            let content = Csv(_.keys(this.exportData[0]), this.exportData, ',')
            let file = new File(Array.from(content), user.state.username + '-' + this.dateRange + '.csv', {type: 'text/csv;charset=utf-8'})
            fileSaver.saveAs(file)
        }
    },
    watch: {
        'dateSelect' (to, from) {
            to[0] && this.getInitData()
        },
        'theme' (to, from) {
            let dateStart = formatDate(this.dateSelect[0])
            let dateEnd = formatDate(this.dateSelect[1])
            let url = dateEnd < this.dateDivided ? 'old' : dateStart >= this.dateDivided ? 'new' : 'oldAndNew'
            this.setOptions(url)
        }
    }
}

const fixDate = n => n < 10 ? '0' + n : '' + n
const formatDate = date => date && date.getFullYear() + fixDate(date.getMonth() + 1) + fixDate(date.getDate())
const lastNDays = n => new Date(new Date().getTime() - 3600 * 1000 * 24 * n)
const lineOptions = {
    tooltip: {
        trigger: 'axis',
        textStyle: {
            color: '#fff',
            fontSize: 14
        },
        axisPointer: {
            lineStyle: {
                color: '#1e9fff'
            },
            z: 0
        },
        backgroundColor: 'rgba(71, 86, 105, 0.8)',
        padding: 10
    },
    grid: {
        top: '40',
        left: '20',
        right: '40',
        bottom: '10',
        containLabel: true
    },
    xAxis: {
        type: 'time',
        offset: 5,
        axisLine: {
            lineStyle: {
                color: '#8492a6'
            }
        },
        interval: 86400000,
        axisTick: {
            show: false
        },
        axisLabel: {
            textStyle: {
                color: '#8492a6',
                fontSize: 14
            },
            formatter: function (value) {
                return dateTime(value)
            }
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        minInterval: 1,
        offset: 5,
        nameTextStyle: {
            color: '#8492a6',
            fontSize: 14
        },
        axisLine: {
            show: false,
            lineStyle: {
                color: '#8492a6'
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            textStyle: {
                color: '#8492a6',
                fontSize: 14
            }
        }
    }
}
const darkLineOptions = {
    grid: {
        show: true,
        backgroundColor: '#293137',
        borderColor: '#52626d'
    },
    xAxis: {
        splitLine: {
            lineStyle: {
                color: '#52626d'
            }
        }
    },
    yAxis: {
        splitLine: {
            lineStyle: {
                color: '#52626d'
            }
        }
    }
}
const xLabelRotateOptions = {
    xAxis: {
        axisLabel: {
            rotate: -30
        }
    }
}

// old storage
const initOptions = (data, theme, xLabelRotate, newOneDayFlag) => {
    let themeLineOptions = theme === 'dark' ? _.defaultsDeep({}, lineOptions, darkLineOptions) : _.defaultsDeep({}, lineOptions)
    if (xLabelRotate || (newOneDayFlag && data.data.length >= 15)) {
        themeLineOptions = _.defaultsDeep(themeLineOptions, xLabelRotateOptions)
        themeLineOptions.grid.right = '80'
        themeLineOptions.grid.bottom = '40'
    }
    if (newOneDayFlag) {
        themeLineOptions.xAxis.interval = 3600000
    }
    let newOptions = _.defaultsDeep({}, themeLineOptions, {
        series: [{
            type: 'line',
            data: data.data,
            name: data.label,
            smooth: true,
            sampling: 'average',
            itemStyle: {
                normal: {
                    color: '#2c96ef'
                }
            },
            lineStyle: {
                normal: {
                    color: '#20a0ff'
                }
            },
            areaStyle: {
                normal: {
                    color: '#20a0ff',
                    opacity: 0.5
                }
            }
        }],
        tooltip: {
            formatter: function (params, ticket, callback) {
                let res = newOneDayFlag ? 'Time : ' + dateTime(params[0].value[0]) : 'Date : ' + dateTime(params[0].value[0])
                _.each(params, function (item) {
                    res += '<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + item.seriesName + ' : '
                    res += data.unit === 'byte' ? bytes(item.value[1], 3) : times(item.value[1])
                })
                return res
            }
        },
        yAxis: {
            name: data.unit === 'byte' ? '' : data.unit === 'times' ? '单位：次' : '单位：个',
            axisLabel: {
                formatter: function (value) {
                    return data.unit === 'byte' ? bytes(value) : timesK(value)
                }
            }
        }
    })
    return newOptions
}

// new storage
const initNewOptions = (dataPart, dataPart1, dataPart2, dataPart3, theme, xLabelRotate, newOneDayFlag) => {
    let themeLineOptions = theme === 'dark' ? _.defaultsDeep({}, lineOptions, darkLineOptions) : _.defaultsDeep({}, lineOptions)
    if (xLabelRotate || (newOneDayFlag && dataPart.data.length >= 15)) {
        themeLineOptions = _.defaultsDeep(themeLineOptions, xLabelRotateOptions)
        themeLineOptions.grid.right = '80'
        themeLineOptions.grid.bottom = '40'
    }
    if (newOneDayFlag) {
        themeLineOptions.xAxis.interval = 3600000
    }
    themeLineOptions.grid.top = '60'
    let seriesArray = [{
        type: 'line',
        data: dataPart.data,
        name: dataPart.label,
        smooth: true,
        sampling: 'average',
        areaStyle: {
            normal: {
                color: '#20a0ff',
                opacity: 0.5
            }
        }
    }, {
        type: 'line',
        data: dataPart1.data,
        name: dataPart1.label,
        smooth: true,
        sampling: 'average',
        areaStyle: {
            normal: {
                color: '#20a0ff',
                opacity: 0.5
            }
        }
    }]
    if (dataPart2 instanceof Array) {
        _.forEach(dataPart2, (value, index) => {
            let seriesItem = {
                type: 'line',
                data: dataPart2[index].data,
                name: dataPart2[index].label,
                smooth: true,
                sampling: 'average',
                areaStyle: {
                    normal: {
                        color: '#20a0ff',
                        opacity: 0.5
                    }
                }
            }
            seriesArray.push(seriesItem)
        })
    } else {
        let seriesItem = [{
            type: 'line',
            data: dataPart2.data,
            name: dataPart2.label,
            smooth: true,
            sampling: 'average',
            areaStyle: {
                normal: {
                    color: '#20a0ff',
                    opacity: 0.5
                }
            }
        }, {
            type: 'line',
            data: dataPart3.data,
            name: dataPart3.label,
            smooth: true,
            sampling: 'average',
            areaStyle: {
                normal: {
                    color: '#20a0ff',
                    opacity: 0.5
                }
            }
        }]
        seriesArray = seriesArray.concat(seriesItem)
    }
    let legendData = [dataPart.label, dataPart1.label]
    if (dataPart2 instanceof Array) {
        _.forEach(dataPart2, (value, index) => {
            legendData.push(dataPart2[index].label)
        })
    } else {
        legendData = legendData.concat([dataPart2.label, dataPart3.label])
    }
    let newOptions = _.defaultsDeep({}, themeLineOptions, {
        color: ['#9f61fc', '#1e9fff', '#0cce66', '#f85959', '#ffac2a', '#8492a6', '#c4cfdf'],
        legend: {
            data: legendData,
            top: '20px',
            textStyle: {
                color: '#1E9FFF',
                fontSize: 14
            },
            icon: 'square',
            itemGap: 40
        },
        series: seriesArray,
        tooltip: {
            formatter: function (params, ticket, callback) {
                let res = newOneDayFlag ? 'Time : ' + dateTime(params[0].value[0]) : 'Date : ' + dateTime(params[0].value[0])
                _.each(params, function (item) {
                    res += '<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + item.seriesName + ' : '
                    res += dataPart.unit === 'byte' ? bytes(item.value[1], 3) : times(item.value[1])
                })
                return res
            }
        },
        yAxis: {
            name: dataPart.unit === 'byte' ? '' : dataPart.unit === 'times' ? '单位：次' : '单位：个',
            axisLabel: {
                formatter: function (value) {
                    return dataPart.unit === 'byte' ? bytes(value) : timesK(value)
                }
            }
        }
    })
    return newOptions
}
</script>
<style lang='less' scoped>
@overview-height: 120px;

.dark .@{css-prefix}dashboard {
    .toolbar {
        .button-daterange {
            button {
                border: 1px solid #52626d;
                border-left: none;
                background: #414d56;
                color: #fff;
            }
            button:first-child {
                border-left: 1px solid #52626d;
            }
        }
    }

    .overview {
        border: @common-border-dark;
        background-color: #303b40;

        &>div {
            border-right: @common-border-dark;
            .content {
                p {
                    color: #8492a6;
                }
                
                span {
                    color: #ffba42;
                }
            }
        }
    }

    .section-chart-tab {
        border: @common-border-dark;
        border-bottom: 0;
        button {
            border: none;
            border-right: @common-border-dark;
            border-bottom: @common-border-dark;
            color: @text-color-dark;
            background-color: #414d56;
        }
        &>button:nth-last-child(1) {
            border-right: 0;
        }
        button:focus,
        .buttonFocus {
            background-color: #39434b;
            border-bottom: 0;
            color: @text-color-dark;
        }
    }

    .card-chart {
        border: @common-border-dark;
        border-top: 0;
    }
}

.@{css-prefix}dashboard {
    .toolbar {
        margin-bottom: 20px;
        height: 32px;

        .button-datepicker {
            width: 60%;
        }

        .button-daterange {
            float: right;

            button {
                margin: 0;
                font-size: 14px;
                color: #475669;
                height: 30px;
                background: #fff;
                line-height: 16px;
                border: 1px solid #d3dce6;
                border-left: none;
            }
            button:first-child {
                border-left: 1px solid #d3dce6;
            }
        }

        button:focus,
        .buttonFocus {
            outline: 0;
            background: #20a0ff !important;
            border-color: #20a0ff !important;
            color: #fff !important;
        }
    }

    .overview {
        width: 100%;
        display: inline-flex;
        border: @common-border;
        height: @overview-height;

        &>div {
            display: inline-flex;
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: center;
            border-right: @common-border;

            .content {
                text-align: center;

                p {
                    font-size: 14px;
                    color: #a1acb5;

                    i {
                        margin-left: 4px;
                    }
                }

                span:first-child {
                    font: 40px bolder;
                }

                span:nth-child(2) {
                    font: 16px bolder;
                }
            }
        }

        &>div:last-child {
            border: 0;
        }
    }

    .section-chart-tab {
        width: 100%;
        height: 48px;
        display: inline-flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        margin-top: 20px;
        border: 1px solid #d3dce6;
        border-bottom: 0;
        button {
            width: 100%;
            height: 100%;
            text-align: center;
            vertical-align: middle;
            -ms-touch-action: manipulation;
            touch-action: manipulation;
            cursor: pointer;
            background-image: none;
            border: none;
            border-right: 1px solid #d3dce6;
            border-bottom: 1px solid #d3dce6;
            white-space: nowrap;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            font-size: 14px;
            transform: translateZ(0);
            transition: color .2s linear, background-color .2s linear;
            color: #a1acb5;
            background-color: #f9fafc;
            border-radius: 0;
        }
        &>button:nth-last-child(1) {
            border-right: 0;
        }
        button:focus,
        .buttonFocus {
            outline: 0;
            background: #fff;
            border-bottom: 0;
            color: #475669;
        }
    }

    .card-chart {
        width: 100%;
        padding: 4px 4px 10px;
        border: 1px solid #d3dce6;
        border-top: 0;
        margin-bottom: 16px;
        transition: all .2s ease-in-out;
        span {
            display: inline-block;
            margin-top: 10px;
            margin-left: 10px;
            font-size: 20px;
        }
        .echarts {
            width: initial;
            margin-left: 8px;
        }
    }
}
</style>
