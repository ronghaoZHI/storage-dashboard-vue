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
                        <span>{{originOverview.space_used && originOverview.space_used[0]}}</span>
                        <span>{{originOverview.space_used && originOverview.space_used[1]}}</span>
                        <p>{{ $t("DASHBOARD.CAPACITY_ALL")}}<Icon type="ios-help"></Icon></p>
                    </div>
                </Tooltip>
            </div>
            <div>
                <Tooltip :content='$t("DASHBOARD.UPLOAD_SPACE_ALL_INFO")'>
                    <div class="content">
                        <span>{{originOverview.flow_up && originOverview.flow_up[0]}}</span>
                        <span>{{originOverview.flow_up && originOverview.flow_up[1]}}</span>
                        <p>{{ $t("DASHBOARD.UPLOAD_SPACE_ALL")}}<Icon type="ios-help"></Icon></p>
                    </div>
                </Tooltip>
            </div>
            <div>
                <Tooltip :content='$t("DASHBOARD.DOWNLOAD_SPACE_ALL_INFO")'>
                    <div class="content">
                        <span>{{originOverview.flow_down && originOverview.flow_down[0]}}</span>
                        <span>{{originOverview.flow_down && originOverview.flow_down[1]}}</span>
                        <p>{{ $t("DASHBOARD.DOWNLOAD_SPACE_ALL")}}<Icon type="ios-help"></Icon></p>
                    </div>
                </Tooltip>
            </div>
            <div>
                <Tooltip :content='$t("DASHBOARD.DOWNLOAD_COUNT_ALL_INFO")'>
                    <div class="content">
                        <span>{{originOverview.read_count && originOverview.read_count[0]}}</span>
                        <span>{{originOverview.read_count && originOverview.read_count[1]}}</span>
                        <p>{{ $t("DASHBOARD.DOWNLOAD_COUNT_ALL")}}<Icon type="ios-help"></Icon></p>
                    </div>
                </Tooltip>
            </div>
            <div>
                <Tooltip :content='$t("DASHBOARD.UPLOAD_COUNT_ALL_INFO")'>
                    <div class="content">
                        <span>{{originOverview.write_count && originOverview.write_count[0]}}</span>
                        <span>{{originOverview.write_count && originOverview.write_count[1]}}</span>
                        <p>{{ $t("DASHBOARD.UPLOAD_COUNT_ALL")}}<Icon type="ios-help"></Icon></p>
                    </div>
                </Tooltip>
            </div>
            <div>
                <Tooltip :content='$t("DASHBOARD.DELETE_COUNT_ALL_INFO")'>
                    <div class="content">
                        <span>{{originOverview.delete_count && originOverview.delete_count[0]}}</span>
                        <span>{{originOverview.delete_count && originOverview.delete_count[1]}}</span>
                        <p>{{ $t("DASHBOARD.DELETE_COUNT_ALL")}}<Icon type="ios-help"></Icon></p>
                    </div>
                </Tooltip>
            </div>
            <div>
                <Tooltip :content='$t("DASHBOARD.DELETE_SPACE_ALL_INFO")'>
                    <div class="content">
                        <span>{{originOverview.delete_space && originOverview.delete_space[0]}}</span>
                        <span>{{originOverview.delete_space && originOverview.delete_space[1]}}</span>
                        <p>{{ $t("DASHBOARD.DELETE_SPACE_ALL")}}<Icon type="ios-help"></Icon></p>
                    </div>
                </Tooltip>
            </div>
        </div>
        <div class="section-chart-tab">
            <button v-bind:class="{buttonFocus: showChart === 0}" @click="tabToggle(0,'capacityLine')">{{ $t("DASHBOARD.CAPACITY")}}</button>
            <button v-bind:class="{buttonFocus: showChart === 1}" @click="tabToggle(1,'uploadTrafficLine')">{{ $t("DASHBOARD.UPLOAD_SPACE")}}</button>
            <button v-bind:class="{buttonFocus: showChart === 2}" @click="tabToggle(2,'downloadTrafficLine')">{{ $t("DASHBOARD.DOWNLOAD_SPACE")}}</button>
            <button v-bind:class="{buttonFocus: showChart === 3}" @click="tabToggle(3,'downloadsLine')">{{ $t("DASHBOARD.DOWNLOAD_COUNT")}}</button>
            <button v-bind:class="{buttonFocus: showChart === 4}" @click="tabToggle(4,'uploadsLine')">{{ $t("DASHBOARD.UPLOAD_COUNT")}}</button>
            <button v-bind:class="{buttonFocus: showChart === 5}" @click="tabToggle(5,'deleteCountLine')">{{ $t("DASHBOARD.DELETE_COUNT")}}</button>
            <button v-bind:class="{buttonFocus: showChart === 6}" @click="tabToggle(6,'deleteSpaceLine')">{{ $t("DASHBOARD.DELETE_SPACE")}}</button>
        </div>
        <div class="section-chart">
            <div class="card-chart" v-show="showChart === 0">
                <chart :options="capacityOptions" auto-resize ref="capacityLine"></chart>
            </div>
            <div class="card-chart" v-show="showChart === 1">
                <chart :options="uploadTrafficOptions" auto-resize ref="uploadTrafficLine"></chart>
            </div>
            <div class="card-chart" v-show="showChart === 2">
                <chart :options="downloadTrafficOptions" auto-resize ref="downloadTrafficLine"></chart>
            </div>
            <div class="card-chart" v-show="showChart === 3">
                <chart :options="downloadsOptions" auto-resize ref="downloadsLine"></chart>
            </div>
            <div class="card-chart" v-show="showChart === 4">
                <chart :options="uploadsOptions" auto-resize ref="uploadsLine"></chart>
            </div>
            <div class="card-chart" v-show="showChart === 5">
                <chart :options="deleteCountOptions" auto-resize ref="deleteCountLine"></chart>
            </div>
            <div class="card-chart" v-show="showChart === 6">
                <chart :options="deleteSpaceOptions" auto-resize ref="deleteSpaceLine"></chart>
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
import { bytes, times, timesK, date, bytesSpliteUnits, timesSpliteUnits } from '@/service/bucketService'
import Csv from './csv'
import fileSaver from 'file-saver'
export default {
    data () {
        return {
            showChart: 0,
            dateDividedBefore: '20171031',
            dateDivided: '20171101',
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
            uploadTrafficOptions: lineOptions,
            downloadTrafficOptions: lineOptions,
            downloadsOptions: lineOptions,
            uploadsOptions: lineOptions,
            deleteCountOptions: lineOptions,
            deleteSpaceOptions: lineOptions
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
            return (this.dateSelect[1] - this.dateSelect[0]) / 86400000 + 1 >= 20
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
                            space_used: this.convertData(res.total.space_used, true, 'byte'),
                            flow_up: this.convertData(res.sum.flow_up, true, 'byte'),
                            flow_down: this.convertData(res.sum.flow_down, true, 'byte'),
                            read_count: this.convertData(res.sum.read_count, true, 'time'),
                            write_count: this.convertData(res.sum.write_count, true, 'time'),
                            delete_count: this.convertData(res.sum.delete_count, true, 'time'),
                            delete_space: this.convertData(res.sum.delete_space, true, 'byte')
                        }
                        // echarts data old
                        _.extend(this, res)
                        this.setOptions('old')
                    })]).then(res => {
                        // export data old
                        this.exportData = []
                        _.each(this.time_nodes.map(time => time * 1000), (time, index) => {
                            this.exportData.push({
                                time: date(time),
                                capacity: this.distributed.space_used[index],
                                uploadTraffic: this.distributed.flow_up[index],
                                downloadTraffic: this.distributed.flow_down[index],
                                readRequest: this.distributed.read_count[index],
                                writeRequest: this.distributed.write_count[index],
                                deleteRequest: this.distributed.delete_count[index],
                                deleteCapacity: this.distributed.delete_space[index]
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
                            space_used: this.convertData(res.total.space_used, true, 'byte'),
                            flow_up: this.convertData(res.sum.flow_up_cdn + res.sum.flow_up_pub, true, 'byte'),
                            flow_down: this.convertData(res.sum.flow_down_cdn + res.sum.flow_down_pub, true, 'byte'),
                            read_count: this.convertData(res.sum.get_count + res.sum.head_count, true, 'time'),
                            write_count: this.convertData(res.sum.post_count + res.sum.put_count, true, 'time'),
                            delete_count: this.convertData(res.sum.delete_count, true, 'time'),
                            delete_space: this.convertData(res.sum.delete_space, true, 'byte')
                        }
                        // echarts data new
                        _.extend(this, res)
                        this.setOptions('new')
                    })]).then(res => {
                        // export data new
                        this.exportData = []
                        _.each(this.time_nodes.map(time => time * 1000), (time, index) => {
                            this.exportData.push({
                                time: date(time),
                                capacity: this.distributed.space_used[index],
                                uploadTraffic: this.distributed.flow_up_cdn[index] + this.distributed.flow_up_pub[index],
                                cdnUploadTraffic: this.distributed.flow_up_cdn[index],
                                pubUploadTraffic: this.distributed.flow_up_pub[index],
                                downloadTraffic: this.distributed.flow_down_cdn[index] + this.distributed.flow_down_pub[index],
                                cdnDownloadTraffic: this.distributed.flow_down_cdn[index],
                                pubDownloadTraffic: this.distributed.flow_down_pub[index],
                                readRequest: this.distributed.get_count[index] + this.distributed.head_count[index],
                                getRequest: this.distributed.get_count[index],
                                headRequest: this.distributed.head_count[index],
                                writeRequest: this.distributed.post_count[index] + this.distributed.put_count[index],
                                postRequest: this.distributed.post_count[index],
                                putRequest: this.distributed.put_count[index],
                                deleteRequest: this.distributed.delete_count[index],
                                deleteCapacity: this.distributed.delete_space[index]
                            })
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
                try {
                    await Promise.all([this.$http.get(this.getApiURL('old', dateStart + '-' + this.dateDividedBefore)).then(res => {
                        // overview data old
                        originOverviewOld = {
                            space_used: res.total.space_used,
                            flow_up: res.sum.flow_up,
                            flow_down: res.sum.flow_down,
                            read_count: res.sum.read_count,
                            write_count: res.sum.write_count,
                            delete_count: res.sum.delete_count,
                            delete_space: res.sum.delete_space
                        }
                        // echarts data old
                        echartDataOld = {
                            time_nodes: res.time_nodes,
                            space_used: res.distributed.space_used,
                            flow_up: res.distributed.flow_up,
                            flow_up_cdn: (new Array(res.time_nodes.length)),
                            flow_up_pub: (new Array(res.time_nodes.length)),
                            flow_down: res.distributed.flow_down,
                            flow_down_cdn: new Array(res.time_nodes.length),
                            flow_down_pub: new Array(res.time_nodes.length),
                            read_count: res.distributed.read_count,
                            get_count: new Array(res.time_nodes.length),
                            head_count: new Array(res.time_nodes.length),
                            write_count: res.distributed.write_count,
                            post_count: new Array(res.time_nodes.length),
                            put_count: new Array(res.time_nodes.length),
                            delete_count: res.distributed.delete_count,
                            delete_space: res.distributed.delete_space
                        }
                    }), this.$http.get(this.getApiURL('new', this.dateRange)).then(res => {
                        // overview data new
                        originOverviewNew = {
                            space_used: res.total.space_used,
                            flow_up: res.sum.flow_up_cdn + res.sum.flow_up_pub,
                            flow_down: res.sum.flow_down_cdn + res.sum.flow_down_pub,
                            read_count: res.sum.get_count + res.sum.head_count,
                            write_count: res.sum.post_count + res.sum.put_count,
                            delete_count: res.sum.delete_count,
                            delete_space: res.sum.delete_space
                        }
                        // echarts data new
                        echartDataNew = {
                            time_nodes: res.time_nodes,
                            space_used: res.distributed.space_used,
                            flow_up: this.combineTwoArray(res.distributed.flow_up_cdn, res.distributed.flow_up_cdn),
                            flow_up_cdn: res.distributed.flow_up_cdn,
                            flow_up_pub: res.distributed.flow_up_cdn,
                            flow_down: this.combineTwoArray(res.distributed.flow_down_cdn, res.distributed.flow_down_pub),
                            flow_down_cdn: res.distributed.flow_down_cdn,
                            flow_down_pub: res.distributed.flow_down_pub,
                            read_count: this.combineTwoArray(res.distributed.get_count, res.distributed.head_count),
                            get_count: res.distributed.get_count,
                            head_count: res.distributed.head_count,
                            write_count: this.combineTwoArray(res.distributed.post_count, res.distributed.put_count),
                            post_count: res.distributed.post_count,
                            put_count: res.distributed.put_count,
                            delete_count: res.distributed.delete_count,
                            delete_space: res.distributed.delete_space
                        }
                    })]).then(res => {
                        // overview data total
                        this.originOverview = {
                            space_used: this.convertData(originOverviewNew.space_used, true, 'byte'),
                            flow_up: this.convertData(originOverviewOld.flow_up + originOverviewNew.flow_up, true, 'byte'),
                            flow_down: this.convertData(originOverviewOld.flow_down + originOverviewNew.flow_down, true, 'byte'),
                            read_count: this.convertData(originOverviewOld.read_count + originOverviewNew.read_count, true, 'time'),
                            write_count: this.convertData(originOverviewOld.write_count + originOverviewNew.write_count, true, 'time'),
                            delete_count: this.convertData(originOverviewOld.delete_count + originOverviewNew.delete_count, true, 'time'),
                            delete_space: this.convertData(originOverviewOld.delete_space + originOverviewNew.delete_space, true, 'byte')
                        }
                        // echarts data total
                        let echartData = {
                            time_nodes: echartDataOld.time_nodes.concat(echartDataNew.time_nodes),
                            space_used: echartDataOld.space_used.concat(echartDataNew.space_used),
                            flow_up: echartDataOld.flow_up.concat(echartDataNew.flow_up),
                            flow_up_cdn: echartDataOld.flow_up_cdn.concat(echartDataNew.flow_up_cdn),
                            flow_up_pub: echartDataOld.flow_up_pub.concat(echartDataNew.flow_up_pub),
                            flow_down: echartDataOld.flow_down.concat(echartDataNew.flow_down),
                            flow_down_cdn: echartDataOld.flow_down_cdn.concat(echartDataNew.flow_down_cdn),
                            flow_down_pub: echartDataOld.flow_down_pub.concat(echartDataNew.flow_down_pub),
                            read_count: echartDataOld.read_count.concat(echartDataNew.read_count),
                            get_count: echartDataOld.get_count.concat(echartDataNew.get_count),
                            head_count: echartDataOld.head_count.concat(echartDataNew.head_count),
                            write_count: echartDataOld.write_count.concat(echartDataNew.write_count),
                            post_count: echartDataOld.post_count.concat(echartDataNew.post_count),
                            put_count: echartDataOld.put_count.concat(echartDataNew.put_count),
                            delete_count: echartDataOld.delete_count.concat(echartDataNew.delete_count),
                            delete_space: echartDataOld.delete_space.concat(echartDataNew.delete_space)
                        }
                        _.extend(this, echartData)
                        this.setOptions('oldAndNew')
                        // export data total
                        this.exportData = []
                        _.each(echartData.time_nodes.map(time => time * 1000), (time, index) => {
                            this.exportData.push({
                                time: date(time),
                                capacity: echartData.space_used[index],
                                uploadTraffic: echartData.flow_up[index],
                                cdnUploadTraffic: echartData.flow_up_cdn[index],
                                pubUploadTraffic: echartData.flow_up_pub[index],
                                downloadTraffic: echartData.flow_down[index],
                                cdnDownloadTraffic: echartData.flow_down_cdn[index],
                                pubDownloadTraffic: echartData.flow_down_pub[index],
                                readRequest: echartData.read_count[index],
                                getRequest: echartData.get_count[index],
                                headRequest: echartData.head_count[index],
                                writeRequest: echartData.write_count[index],
                                postRequest: echartData.post_count[index],
                                putRequest: echartData.put_count[index],
                                deleteRequest: echartData.delete_count[index],
                                deleteCapacity: echartData.delete_space[index]
                            })
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
                this.uploadTrafficOptions = initOptions(this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.flow_up, 'byte', '上传流量'), this.theme, this.xLabelRotate)
                this.downloadTrafficOptions = initOptions(this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.flow_down, 'byte', '下载流量'), this.theme, this.xLabelRotate)
                this.downloadsOptions = initOptions(this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.read_count, 'time', '读取请求'), this.theme, this.xLabelRotate)
                this.uploadsOptions = initOptions(this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.write_count, 'time', '写入请求'), this.theme, this.xLabelRotate)
                this.deleteCountOptions = initOptions(this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.delete_count, 'time', '删除请求'), this.theme, this.xLabelRotate)
                this.deleteSpaceOptions = initOptions(this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.delete_space, 'byte', '删除容量'), this.theme, this.xLabelRotate)
            } else if (url === 'new') {
                this.capacityOptions = initOptions(this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.space_used, 'byte', '存储容量'), this.theme, this.xLabelRotate)
                this.uploadTrafficOptions = initNewOptions(
                    this.combineTimeDataUnitLabel(this.time_nodes, this.combineTwoArray(this.distributed.flow_up_cdn, this.distributed.flow_up_pub), 'byte', '上传流量'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.flow_up_cdn, 'byte', 'cdn上传流量'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.flow_up_pub, 'byte', 'pub上传流量'),
                    this.theme,
                    this.xLabelRotate
                )
                this.downloadTrafficOptions = initNewOptions(
                    this.combineTimeDataUnitLabel(this.time_nodes, this.combineTwoArray(this.distributed.flow_down_cdn, this.distributed.flow_down_pub), 'byte', '下载流量'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.flow_down_cdn, 'byte', 'cdn下载流量'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.flow_down_pub, 'byte', 'pub下载流量'),
                    this.theme,
                    this.xLabelRotate
                )
                this.downloadsOptions = initNewOptions(
                    this.combineTimeDataUnitLabel(this.time_nodes, this.combineTwoArray(this.distributed.get_count, this.distributed.head_count), 'time', '读取请求'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.get_count, 'time', 'get读取请求'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.head_count, 'time', 'head读取请求'),
                    this.theme,
                    this.xLabelRotate
                )
                this.uploadsOptions = initNewOptions(
                    this.combineTimeDataUnitLabel(this.time_nodes, this.combineTwoArray(this.distributed.post_count, this.distributed.put_count), 'time', '写入请求'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.post_count, 'time', 'post写入请求'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.put_count, 'time', 'put写入请求'),
                    this.theme,
                    this.xLabelRotate
                )
                this.deleteCountOptions = initOptions(this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.delete_count, 'time', '删除请求'), this.theme, this.xLabelRotate)
                this.deleteSpaceOptions = initOptions(this.combineTimeDataUnitLabel(this.time_nodes, this.distributed.delete_space, 'byte', '删除容量'), this.theme, this.xLabelRotate)
            } else {
                this.capacityOptions = initOptions(this.combineTimeDataUnitLabel(this.time_nodes, this.space_used, 'byte', '存储容量'), this.theme, this.xLabelRotate)
                this.uploadTrafficOptions = initNewOptions(
                    this.combineTimeDataUnitLabel(this.time_nodes, this.flow_up, 'byte', '上传流量'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.flow_up_cdn, 'byte', 'cdn上传流量'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.flow_up_pub, 'byte', 'pub上传流量'),
                    this.theme,
                    this.xLabelRotate
                )
                this.downloadTrafficOptions = initNewOptions(
                    this.combineTimeDataUnitLabel(this.time_nodes, this.flow_down, 'byte', '下载流量'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.flow_down_cdn, 'byte', 'cdn下载流量'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.flow_down_pub, 'byte', 'pub下载流量'),
                    this.theme,
                    this.xLabelRotate
                )
                this.downloadsOptions = initNewOptions(
                    this.combineTimeDataUnitLabel(this.time_nodes, this.read_count, 'time', '读取请求'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.get_count, 'time', 'get读取请求'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.head_count, 'time', 'head读取请求'),
                    this.theme,
                    this.xLabelRotate
                )
                this.uploadsOptions = initNewOptions(
                    this.combineTimeDataUnitLabel(this.time_nodes, this.write_count, 'time', '写入请求'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.post_count, 'time', 'post写入请求'),
                    this.combineTimeDataUnitLabel(this.time_nodes, this.put_count, 'time', 'put写入请求'),
                    this.theme,
                    this.xLabelRotate
                )
                this.deleteCountOptions = initOptions(this.combineTimeDataUnitLabel(this.time_nodes, this.delete_count, 'time', '删除请求'), this.theme, this.xLabelRotate)
                this.deleteSpaceOptions = initOptions(this.combineTimeDataUnitLabel(this.time_nodes, this.delete_space, 'byte', '删除容量'), this.theme, this.xLabelRotate)
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
            let combinedData = []
            _.forEach(time, (value, key) => {
                combinedData.push([value * 1000, data[key]])
            })
            let object = {
                label: label,
                unit: unit,
                data: combinedData
            }
            return object
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
            this.setOptions()
        },
        'xLabelRotate' (to, from) {
            this.setOptions()
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
        top: '20',
        left: '10',
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
                return date(value)
            }
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
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
const initOptions = (data, theme, xLabelRotate) => {
    let themeLineOptions = theme === 'dark' ? _.defaultsDeep({}, lineOptions, darkLineOptions) : _.defaultsDeep({}, lineOptions)
    if (xLabelRotate) {
        themeLineOptions = _.defaultsDeep(themeLineOptions, xLabelRotateOptions)
        themeLineOptions.grid.right = '80'
        themeLineOptions.grid.bottom = '40'
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
                let res = 'Date : ' + date(params[0].value[0])
                _.each(params, function (item) {
                    res += '<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + item.seriesName + ' : '
                    res += data.unit === 'byte' ? bytes(item.value[1], 3) : times(item.value[1])
                })
                return res
            }
        },
        yAxis: {
            axisLabel: {
                formatter: function (value) {
                    return data.unit === 'byte' ? bytes(value) : timesK(value) + ' times'
                }
            }
        }
    })
    return newOptions
}

// new storage
const initNewOptions = (dataTotal, dataPart1, dataPart2, theme, xLabelRotate) => {
    let themeLineOptions = theme === 'dark' ? _.defaultsDeep({}, lineOptions, darkLineOptions) : _.defaultsDeep({}, lineOptions)
    if (xLabelRotate) {
        themeLineOptions = _.defaultsDeep(themeLineOptions, xLabelRotateOptions)
        themeLineOptions.grid.right = '80'
        themeLineOptions.grid.bottom = '40'
    }
    themeLineOptions.grid.top = '60'
    let newOptions = _.defaultsDeep({}, themeLineOptions, {
        color: ['#20a0ff', '#9f61fc', '#0cce66'],
        legend: {
            data: [dataTotal.label, dataPart1.label, dataPart2.label],
            top: '20px',
            textStyle: {
                color: '#1E9FFF',
                fontSize: 14
            },
            icon: 'square',
            itemGap: 80
        },
        series: [{
            type: 'line',
            data: dataTotal.data,
            name: dataTotal.label,
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
        }, {
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
        }],
        tooltip: {
            formatter: function (params, ticket, callback) {
                let res = 'Date : ' + date(params[0].value[0])
                _.each(params, function (item) {
                    res += '<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>' + item.seriesName + ' : '
                    res += dataTotal.unit === 'byte' ? bytes(item.value[1], 3) : times(item.value[1])
                })
                return res
            }
        },
        yAxis: {
            axisLabel: {
                formatter: function (value) {
                    return dataTotal.unit === 'byte' ? bytes(value) : timesK(value) + ' times'
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
