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
                <Button type="primary" style="width:80px;float:left;margin-left:16px;" @click="exportCsv">{{ $t("DASHBOARD.EXPORT_DATA")}}</Button>
            </div>
            <div class="button-daterange">
                <Button-group>
                    <Button v-bind:class="{buttonFocus: dateSelect[0].getTime() === dateDefault.today[0].getTime()}" @click="dateSelect = dateDefault.today">{{ $t("DASHBOARD.TODAY")}}</Button>
                    <Button v-bind:class="{buttonFocus: dateSelect[0].getTime() === dateDefault.seven_days[0].getTime()}" @click="dateSelect = dateDefault.seven_days">{{ $t("DASHBOARD.SEVEN_DAYS")}}</Button>
                    <Button v-bind:class="{buttonFocus: dateSelect[0].getTime() === dateDefault.this_month[0].getTime()}" @click="dateSelect = dateDefault.this_month" >{{ $t("DASHBOARD.THIS_MONTH")}}</Button>
                    <Button v-bind:class="{buttonFocus: dateSelect[0].getTime() === dateDefault.thirty_days[0].getTime()}" @click="dateSelect = dateDefault.thirty_days">{{ $t("DASHBOARD.THIRTY_DAYS")}}</Button>
                </Button-group>
            </div>
        </div>
        <div class="overview">
            <div>
                <img v-bind:src="imgSrc[0]" alt="capacity">
                <Tooltip :content='$t("DASHBOARD.CAPACITY_ALL_INFO")' placement="top-end">
                    <p>{{ $t("DASHBOARD.CAPACITY_ALL")}}<Icon type="ios-help-outline"></Icon></p>
                </Tooltip>
                <div class="content">
                    <span>{{originOverview.capacity && originOverview.capacity[0]}}</span>
                    <span>{{originOverview.capacity && originOverview.capacity[1]}}</span>
                </div>
            </div>
            <div>
                <img v-bind:src="imgSrc[1]" alt="inflows">
                <Tooltip :content='$t("DASHBOARD.INFLOWS_ALL_INFO")' placement="top-end">
                    <p>{{ $t("DASHBOARD.INFLOWS_ALL")}}<Icon type="ios-help-outline"></Icon></p>
                </Tooltip>
                <div class="content">
                    <span>{{originOverview.inflows && originOverview.inflows[0]}}</span>
                    <span>{{originOverview.inflows && originOverview.inflows[1]}}</span>
                </div>
            </div>
            <div>
                <img v-bind:src="imgSrc[2]" alt="outflows">
                <Tooltip :content='$t("DASHBOARD.OUTFLOWS_ALL_INFO")' placement="top-end">
                    <p>{{ $t("DASHBOARD.OUTFLOWS_ALL")}}<Icon type="ios-help-outline"></Icon></p>
                </Tooltip>
                <div class="content">
                    <span>{{originOverview.outflows && originOverview.outflows[0]}}</span>
                    <span>{{originOverview.outflows && originOverview.outflows[1]}}</span>
                </div>
            </div>
            <div>
                <img v-bind:src="imgSrc[3]" alt="requests">
                <Tooltip :content='$t("DASHBOARD.REQUESTS_ALL_INFO")' placement="top-end">
                    <p>{{ $t("DASHBOARD.REQUESTS_ALL")}}<Icon type="ios-help-outline"></Icon></p>
                </Tooltip>
                <div class="content">
                    <span>{{originOverview.requests && originOverview.requests[0]}}</span>
                    <span>{{originOverview.requests && originOverview.requests[1]}}</span>
                </div>
            </div>
            <div>
                <img v-bind:src="imgSrc[4]" alt="files">
                <Tooltip :content='$t("DASHBOARD.FILES_ALL_INFO")' placement="top-end">
                    <p>{{ $t("DASHBOARD.FILES_ALL")}}<Icon type="ios-help-outline"></Icon></p>
                </Tooltip>
                <div class="content">
                    <span>{{originOverview.files && originOverview.files[0]}}</span>
                    <span>{{originOverview.files && originOverview.files[1]}}</span>
                </div>
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
import capacitySec from '../../assets/dashboard/capacity-sec.png'
import capacitySecDark from '../../assets/dashboard/capacity-sec-dark.png'
import inflows from '../../assets/dashboard/inflows.png'
import inflowsDark from '../../assets/dashboard/inflows-dark.png'
import outflows from '../../assets/dashboard/outflows.png'
import outflowsDark from '../../assets/dashboard/outflows-dark.png'
import requests from '../../assets/dashboard/requests.png'
import requestsDark from '../../assets/dashboard/requests-dark.png'
import files from '../../assets/dashboard/files.png'
import filesDark from '../../assets/dashboard/files-dark.png'
import { getBucketList } from '@/service/Data'
import { getBillOldUrl, getBillUrl } from '@/service/API'
import user from '@/store/modules/user'
import { bytes, times, timesK, dateTime, dateTimeYear, bytesSpliteUnits, timesSpliteUnits } from '@/service/bucketService'
import Csv from './csv'
import fileSaver from 'file-saver'
export default {
    data () {
        return {
            showChart: 0,
            dateDividedBefore: '20171130',
            dateDivided: '20171201',
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
        imgSrc: function () {
            return this.$store.state.theme === 'dark' ? [capacitySecDark, inflowsDark, outflowsDark, requestsDark, filesDark] : [capacitySec, inflows, outflows, requests, files]
        },
        theme: function () {
            return this.$store.state.theme
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

            if (formatDate(this.dateSelect[1]) < this.dateDivided) {
                // old storage
                try {
                    await Promise.all([this.$http.get(this.getApiURL('old', this.dateRange)).then(res => {
                        // overview data old
                        this.originOverview = {
                            capacity: this.convertData(res.total.space_used, true),
                            inflows: this.convertData(res.sum.flow_up, true),
                            outflows: this.convertData(res.sum.flow_down, true),
                            requests: this.convertData(res.sum.read_count + res.sum.write_count + res.sum.delete_count, true, 'times'),
                            files: this.convertData(res.total.num_used, true, '')
                        }
                        // echarts data old
                        _.extend(this, res)
                        this.setOptions('old')
                    })]).then(res => {
                        // export data old
                        this.exportData = []
                        _.each(this.time_nodes.map(time => time * 1000), (time, index) => {
                            let exportData = {
                                time: dateTimeYear(time)
                            }
                            exportData[exportDic.capacity] = this.distributed.space_used[index]
                            exportData[exportDic.inflows] = this.distributed.flow_up[index]
                            exportData[exportDic.outflows] = this.distributed.flow_down[index]
                            exportData[exportDic.readRequests] = this.distributed.read_count[index]
                            exportData[exportDic.writeRequests] = this.distributed.write_count[index]
                            exportData[exportDic.deleteRequests] = this.distributed.delete_count[index]
                            exportData[exportDic.files] = this.distributed.num_used[index]
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
                let resOld = {}
                let resNew = {}
                let oldTimeLength = 0
                try {
                    if (formatDate(this.dateSelect[0]) >= this.dateDivided) {
                        // new storage
                        await Promise.all([this.$http.get(this.getApiURL('new', this.dateRange)).then(res => {
                            resNew = res
                        })])
                    } else {
                        // old and new storage
                        await Promise.all([this.$http.get(this.getApiURL('old', formatDate(this.dateSelect[0]) + '-' + this.dateDividedBefore)).then(res => {
                            resOld = res
                            oldTimeLength = res.time_nodes.length
                        }), this.$http.get(this.getApiURL('new', this.dateRange)).then(res => {
                            resNew = res
                        })])
                    }
                    // overview data total
                    this.originOverview = {
                        capacity: this.convertData(resNew.total.space_used, true),
                        inflows: this.convertData(resOld.sum === undefined ? resNew.sum.flow_up_cdn + resNew.sum.flow_up_pub : resOld.sum.flow_up + resNew.sum.flow_up_cdn + resNew.sum.flow_up_pub, true),
                        outflows: this.convertData(resOld.sum === undefined ? resNew.sum.flow_down_cdn + resNew.sum.flow_down_pub : resOld.sum.flow_down + resNew.sum.flow_down_cdn + resNew.sum.flow_down_pub, true),
                        requests: this.convertData(resOld.sum === undefined ? resNew.sum.get_count + resNew.sum.head_count + resNew.sum.post_count + resNew.sum.put_count + resNew.sum.delete_count + resNew.sum.list_count : resOld.sum.read_count + resOld.sum.write_count + resOld.sum.delete_count + resNew.sum.get_count + resNew.sum.head_count + resNew.sum.post_count + resNew.sum.put_count + resNew.sum.delete_count + resNew.sum.list_count, true, 'times'),
                        files: this.convertData(resNew.total.num_used, true, '')
                    }
                    // echarts data total
                    let echartData = {
                        time_nodes: resOld.time_nodes === undefined ? resNew.time_nodes : resOld.time_nodes.concat(resNew.time_nodes),
                        space_used: resOld.distributed === undefined ? resNew.distributed.space_used : resOld.distributed.space_used.concat(resNew.distributed.space_used),
                        flow_up: resOld.distributed === undefined ? this.combineTwoArray(resNew.distributed.flow_up_cdn, resNew.distributed.flow_up_pub) : resOld.distributed.flow_up.concat(this.combineTwoArray(resNew.distributed.flow_up_cdn, resNew.distributed.flow_up_pub)),
                        flow_up_pub: resNew.distributed.flow_up_pub,
                        up_cdn: resNew.distributed.up_cdn,
                        flow_down: resOld.distributed === undefined ? this.combineTwoArray(resNew.distributed.flow_down_cdn, resNew.distributed.flow_down_pub) : resOld.distributed.flow_down.concat(this.combineTwoArray(resNew.distributed.flow_down_cdn, resNew.distributed.flow_down_pub)),
                        flow_down_pub: resNew.distributed.flow_down_pub,
                        down_cdn: resNew.distributed.down_cdn,
                        read_count: resOld.distributed === undefined ? this.combineTwoArray(resNew.distributed.get_count, resNew.distributed.head_count) : resOld.distributed.read_count.concat(this.combineTwoArray(resNew.distributed.get_count, resNew.distributed.head_count)),
                        write_count: resOld.distributed === undefined ? this.combineTwoArray(resNew.distributed.post_count, resNew.distributed.put_count) : resOld.distributed.write_count.concat(this.combineTwoArray(resNew.distributed.post_count, resNew.distributed.put_count)),
                        delete_count: resOld.distributed === undefined ? resNew.distributed.delete_count : resOld.distributed.delete_count.concat(resNew.distributed.delete_count),
                        list_count: resNew.distributed.list_count,
                        num_used: resOld.distributed === undefined ? resNew.distributed.num_used : resOld.distributed.num_used.concat(resNew.distributed.num_used)
                    }
                    _.extend(this, echartData)
                    this.setOptions('oldAndNew')
                    // export data total
                    this.exportData = []
                    _.each(echartData.time_nodes.map(time => time * 1000), (time, index) => {
                        let exportData = {
                            time: dateTimeYear(time)
                        }
                        exportData[exportDic.capacity] = echartData.space_used[index]
                        exportData[exportDic.inflows] = echartData.flow_up[index]
                        exportData[exportDic.pubInflows] = index < oldTimeLength ? '' : echartData.flow_up_pub[index - oldTimeLength]
                        _.forEach(echartData.up_cdn, (value, key) => {
                            exportData[`${key}${exportDic.inflows}`] = index < oldTimeLength ? '' : value[index - oldTimeLength]
                        })
                        exportData[exportDic.outflows] = echartData.flow_down[index]
                        exportData[exportDic.pubOutflows] = index < oldTimeLength ? '' : echartData.flow_down_pub[index - oldTimeLength]
                        _.forEach(echartData.down_cdn, (value, key) => {
                            exportData[`${key}${exportDic.outflows}`] = index < oldTimeLength ? '' : value[index - oldTimeLength]
                        })
                        exportData[exportDic.readRequests] = echartData.read_count[index]
                        exportData[exportDic.writeRequests] = echartData.write_count[index]
                        exportData[exportDic.deleteRequests] = echartData.delete_count[index]
                        exportData[exportDic.listRequests] = index < oldTimeLength ? '' : echartData.list_count[index - oldTimeLength]
                        exportData[exportDic.files] = echartData.num_used[index]
                        this.exportData.push(exportData)
                    })
                    this.spinShow = false
                } catch (error) {
                    console.log(error)
                    this.spinShow = false
                    this.$Message.warning(this.$t('STORAGE.GET_DATA_ERROR'))
                }
            }
        },
        setOptions (url) {
            let newOneDayFlag = formatDate(this.dateSelect[0]) === formatDate(this.dateSelect[1]) && formatDate(this.dateSelect[0]) >= this.dateDivided
            this.capacityOptions = initOptions({
                dataPart: this.combineTimeDataUnitLabel(url === 'old' ? this.distributed.space_used : this.space_used, '存储容量'),
                theme: this.theme,
                newOneDayFlag: newOneDayFlag
            })
            this.inflowsOptions = initOptions({
                dataPart: this.combineTimeDataUnitLabel(url === 'old' ? this.distributed.flow_up : this.flow_up, '流入流量'),
                dataPart1: url === 'old' ? '' : this.combineTimeDataUnitLabel(this.flow_up_pub, '公网流入流量'),
                dataPart2: url === 'old' ? '' : this.combineTimeDataUnitLabelToObjectArray(this.up_cdn, 'up'),
                theme: this.theme,
                newOneDayFlag: newOneDayFlag
            })
            this.outflowsOptions = initOptions({
                dataPart: this.combineTimeDataUnitLabel(url === 'old' ? this.distributed.flow_down : this.flow_down, '流出流量'),
                dataPart1: url === 'old' ? '' : this.combineTimeDataUnitLabel(this.flow_down_pub, '公网流出流量'),
                dataPart2: url === 'old' ? '' : this.combineTimeDataUnitLabelToObjectArray(this.down_cdn, 'down'),
                theme: this.theme,
                newOneDayFlag: newOneDayFlag
            })
            this.requestsOptions = initOptions({
                dataPart: this.combineTimeDataUnitLabel(url === 'old' ? this.distributed.read_count : this.read_count, '读请求数', 'times'),
                dataPart1: this.combineTimeDataUnitLabel(url === 'old' ? this.distributed.write_count : this.write_count, '写请求数', 'times'),
                dataPart2: this.combineTimeDataUnitLabel(url === 'old' ? this.distributed.delete_count : this.delete_count, '删除请求数', 'times'),
                dataPart3: url === 'old' ? '' : this.combineTimeDataUnitLabel(this.list_count, '列文件请求数', 'times'),
                theme: this.theme,
                newOneDayFlag: newOneDayFlag
            })
            this.filesOptions = initOptions({
                dataPart: this.combineTimeDataUnitLabel(url === 'old' ? this.distributed.num_used : this.num_used, '文件数', ''),
                theme: this.theme,
                newOneDayFlag: newOneDayFlag
            })
        },
        combineTwoArray (array1, array2) {
            let combinedData = []
            _.forEach(array1, (value, key) => {
                combinedData.push(value + array2[key])
            })
            return combinedData
        },
        combineTimeDataUnitLabel (data, label, unit = 'byte', time = this.time_nodes) {
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
        combineTimeDataUnitLabelToObjectArray (data, upOrDown, unit = 'byte', time = this.time_nodes) {
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
        convertData (value, splite = false, unit = 'byte') {
            if (!value) {
                return ['0']
            }
            return splite ? unit === 'byte' ? bytesSpliteUnits(value, 3) : timesSpliteUnits(value, 3) : unit === 'byte' ? bytes(value) : times(value)
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
            let url = formatDate(this.dateSelect[1]) < this.dateDivided ? 'old' : 'oldAndNew'
            this.setOptions(url)
        }
    }
}

const exportDic = {
    capacity: '存储容量（字节）',
    inflows: '流入流量（字节）',
    pubInflows: '公网流入流量（字节）',
    outflows: '流出流量（字节）',
    pubOutflows: '公网流出流量（字节）',
    readRequests: '读请求数（次）',
    writeRequests: '写请求数（次）',
    deleteRequests: '删除请求数（次）',
    listRequests: '列文件请求数（次）',
    files: '文件数（个）'
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
        right: '50',
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

const initOptions = ({dataPart, dataPart1, dataPart2, dataPart3, theme, newOneDayFlag}) => {
    let themeLineOptions = theme === 'dark' ? _.defaultsDeep({}, lineOptions, darkLineOptions) : _.defaultsDeep({}, lineOptions)
    let n = Math.floor((dataPart.data.length - 1) / 7) + 1
    themeLineOptions.xAxis.interval = 86400000 * n
    if (newOneDayFlag) {
        themeLineOptions.xAxis.interval = 3600000 * n
    }
    themeLineOptions.grid.top = '60'
    let legendData = []
    let seriesArray = []
    if (!dataPart1) {
        legendData = [dataPart.label]
        seriesArray = [{
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
        }]
    } else {
        legendData = [dataPart.label, dataPart1.label]
        seriesArray = [{
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
                legendData.push(dataPart2[index].label)
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
            legendData = legendData.concat([dataPart2.label, dataPart3.label])
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
    }
    let newOptions = _.defaultsDeep({}, themeLineOptions, {
        color: ['#1e9fff', '#9f61fc', '#0cce66', '#f85959', '#ffac2a', '#8492a6', '#c4cfdf'],
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
                let res = '时间：' + dateTimeYear(params[0].value[0])
                _.each(params, function (item) {
                    res += '<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + item.seriesName + '： '
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
@overview-height: 160px;

.dark .@{css-prefix}dashboard {
    .toolbar {
        border-bottom: @common-border-dark;
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

        &>div {
            border: 0;
            background-color: #313a41;
            .content {
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
            background-color: #313a41;
            border-bottom: 0;
            color: @text-color-dark;
        }
    }

    .card-chart {
        background-color: #313a41;
        border: @common-border-dark;
        border-top: 0;
    }
}

.@{css-prefix}dashboard {
    .toolbar {
        padding-bottom: 50px;
        margin-bottom: 50px;
        border-bottom: @common-border;
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
                height: 32px;
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
        height: @overview-height;

        &>div {
            border: 1px solid #d3dce6;
            margin-right: 20px;
            padding-top: 20px;
            padding-right: 30px;
            position: relative;
            text-align: right;
            width: 100%;
            height: 100%;
            min-width: 220px;

            img {
                position: absolute;
                top: -32px;
                left: 30px;
            }

            p {
                font-size: 18px;
                color: #8492a6;
                float: right;

                i {
                    margin-left: 4px;
                }
            }

            .content {
                margin-top: 40px;

                p {
                    color: #8492a6;
                }

                span {
                    color: #475669;
                }

                span:first-child {
                    font: 36px bolder;
                }

                span:nth-child(2) {
                    font: 24px bolder;
                }
            }
        }
        &>div:last-child {
            margin-right: 0;
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

@media (max-width:1775px) {
    .@{css-prefix}dashboard {
        .overview {
            &>div {
                padding-top: 80px;

                .content {
                    margin-top: -8px;
                }
            }
        }
    }
}

@media (max-width:1620px) {
    .@{css-prefix}dashboard {
        .overview {
            &>div {
                padding-right: 20px;

                p {
                font-size: 18px;
                }

                .content {
                    span:first-child {
                        font: 32px bolder;
                    }

                    span:nth-child(2) {
                        font: 20px bolder;
                    }
                }
            }
        }
    }
}
</style>
