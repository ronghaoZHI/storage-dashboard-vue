<template>
    <div class="bsc-dashboard">
        <Spin size="bigger" fix v-if="spinShow"></Spin>
        <div class="toolbar">
            <div class="button-datepicker">
                <Select :prepend="true" v-model="selectedBucket" style="width:30%;float:left;margin-right:16px;" @on-change="getInitData">
                    <p slot="prepend" style="font-size:12px">数据</p>
                    <Option v-for="item in bucketList" :value="item.Name" :key="item.Name">{{ item.Name }}</Option>
                </Select>
                <Date-picker v-model="dateSelect" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="Select time" :options="dateOptions" style="width: 40%;float:left;"></Date-picker>
                <Button style="width:15%;float:left;margin-left:16px;" @click="exportCsv">{{ $t("DASHBOARD.EXPORT_DATA")}}</Button>
            </div>
            <div class="button-daterange">
                <Button-group>
                    <Button v-bind:class="{buttonFocus: dateSelect[0].getTime() === dateDefault.seven_days[0].getTime()}" @click="dateSelect = dateDefault.seven_days">{{ $t("DASHBOARD.SEVEN_DAYS")}}</Button>
                    <Button v-show="!isFristDay" v-bind:class="{buttonFocus: dateSelect[0].getTime() === dateDefault.this_month[0].getTime()}" @click="dateSelect = dateDefault.this_month" >{{ $t("DASHBOARD.THIS_MONTH")}}</Button>
                    <Button v-bind:class="{buttonFocus: dateSelect[0].getTime() === dateDefault.thirty_days[0].getTime()}" @click="dateSelect = dateDefault.thirty_days">{{ $t("DASHBOARD.THIRTY_DAYS")}}</Button>
                </Button-group>
            </div>
        </div>
        <div class="overview">
            <Row>
                <Col span="7" class="capacity-traffic">
                    <div class="capacity">
                        <Tooltip :content='$t("DASHBOARD.CAPACITY_ALL_INFO")'>
                            <div class="content">
                                <span>{{originOverview.capacity && originOverview.capacity[0]}}</span>
                                <span>{{originOverview.capacity && originOverview.capacity[1]}}</span>
                                <p>{{ $t("DASHBOARD.CAPACITY_ALL")}}<Icon type="ios-help"></Icon></p>
                            </div>
                        </Tooltip>
                    </div>
                    <div class="traffic">
                        <div class="upload-traffic">
                            <Tooltip :content='$t("DASHBOARD.UPLOAD_SPACE_ALL_INFO")'>
                                <div class="content">
                                    <span>{{originOverview.upload_space && originOverview.upload_space[0]}}</span>
                                    <span>{{originOverview.upload_space && originOverview.upload_space[1]}}</span>
                                    <p>{{ $t("DASHBOARD.UPLOAD_SPACE_ALL")}}<Icon type="ios-help"></Icon></p>
                                </div>
                            </Tooltip>
                        </div>
                        <div class="download-traffic">
                            <Tooltip :content='$t("DASHBOARD.DOWNLOAD_SPACE_ALL_INFO")'>
                                <div class="content">
                                    <span>{{originOverview.download_space && originOverview.download_space[0]}}</span>
                                    <span>{{originOverview.download_space && originOverview.download_space[1]}}</span>
                                    <p>{{ $t("DASHBOARD.DOWNLOAD_SPACE_ALL")}}<Icon type="ios-help"></Icon></p>
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                </Col>
                <Col span="17">
                    <div class="view-card">
                        <div>
                            <img src="../../assets/dashboard/read.png" alt="download_count">
                            <Tooltip :content='$t("DASHBOARD.DOWNLOAD_COUNT_ALL_INFO")'>
                                <div class="content">
                                    <span>{{originOverview.download_count && originOverview.download_count[0]}}</span>
                                    <span>{{originOverview.download_count && originOverview.download_count[1]}}</span>
                                    <p>{{ $t("DASHBOARD.DOWNLOAD_COUNT_ALL")}}<Icon type="ios-help"></Icon></p>
                                </div>
                            </Tooltip>
                        </div>
                        <div>
                            <img src="../../assets/dashboard/write.png" alt="upload_count">
                            <Tooltip :content='$t("DASHBOARD.UPLOAD_COUNT_ALL_INFO")'>
                                <div class="content">
                                    <span>{{originOverview.upload_count && originOverview.upload_count[0]}}</span>
                                    <span>{{originOverview.upload_count && originOverview.upload_count[1]}}</span>
                                    <p>{{ $t("DASHBOARD.UPLOAD_COUNT_ALL")}}<Icon type="ios-help"></Icon></p>
                                </div>
                            </Tooltip>
                        </div>
                        <div>
                            <img src="../../assets/dashboard/delete-request.png" alt="delete_count">
                            <Tooltip :content='$t("DASHBOARD.DELETE_COUNT_ALL_INFO")'>
                                <div class="content">
                                    <span>{{originOverview.delete_count && originOverview.delete_count[0]}}</span>
                                    <span>{{originOverview.delete_count && originOverview.delete_count[1]}}</span>
                                    <p>{{ $t("DASHBOARD.DELETE_COUNT_ALL")}}<Icon type="ios-help"></Icon></p>
                                </div>
                            </Tooltip>
                        </div>
                        <div>
                            <img src="../../assets/dashboard/delete-traffic.png" alt="delete_space">
                            <Tooltip :content='$t("DASHBOARD.DELETE_SPACE_ALL_INFO")'>
                                <div class="content">
                                    <span>{{originOverview.delete_space && originOverview.delete_space[0]}}</span>
                                    <span>{{originOverview.delete_space && originOverview.delete_space[1]}}</span>
                                    <p>{{ $t("DASHBOARD.DELETE_SPACE_ALL")}}<Icon type="ios-help"></Icon></p>
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                </Col>
            </Row>
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
                <chart :options="deleteCountOptins" auto-resize ref="deleteCountLine"></chart>
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
import { getBucketList } from '@/service/Data'
import { getAnalysisUrl } from '@/service/API'
import user from '@/store/modules/user'
import { bytes, times, timesK, date, bytesSpliteUnits, timesSpliteUnits } from '@/service/bucketService'
import Csv from './csv'
import fileSaver from 'file-saver'
export default {
    data () {
        return {
            showChart: 0,
            bucketList: this.bucketList,
            selectedBucket: 'All Buckets',
            dateDefault: {
                seven_days: [lastNDays(7), lastNDays(1)],
                this_month: [new Date(new Date().setDate(1)), lastNDays(1)],
                thirty_days: [lastNDays(30), lastNDays(1)]
            },
            dateSelect: [lastNDays(7), lastNDays(1)],
            originOverview: {},
            dateOptions: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now() - 86400000
                }
            },
            exportData: [],
            spinShow: true,
            capacityOptions: lineOptions,
            uploadTrafficOptions: lineOptions,
            downloadTrafficOptions: lineOptions,
            downloadsOptions: lineOptions,
            uploadsOptions: lineOptions,
            deleteCountOptins: lineOptions,
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

            try {
                await Promise.all([this.$http.get(this.getApiURL('overview')).then(res => {
                    // overview data
                    this.originOverview = {
                        capacity: this.convertData(res.data.capacity, true),
                        upload_space: this.convertData(res.data.upload_space, true),
                        download_space: this.convertData(res.data.download_space, true),
                        delete_space: this.convertData(res.data.delete_space, true),
                        upload_count: this.convertData(res.data.upload_count, true),
                        download_count: this.convertData(res.data.download_count, true),
                        delete_count: this.convertData(res.data.delete_count, true)
                    }
                }), this.$http.get(this.getApiURL('entire')).then(res => {
                    // echarts data
                    _.extend(this, res)
                    this.capacityOptions = InitOptions(this.capacity)
                    this.uploadTrafficOptions = InitOptions(this.upload_space)
                    this.downloadTrafficOptions = InitOptions(this.download_space)
                    this.downloadsOptions = InitOptions(this.download_count)
                    this.uploadsOptions = InitOptions(this.upload_count)
                    this.deleteCountOptins = InitOptions(this.delete_count)
                    this.deleteSpaceOptions = InitOptions(this.delete_space)
                })]).then(res => {
                    // export data
                    this.exportData = []
                    _.each(this.capacity.data.map(data => data[0]), (time, index) => {
                        this.exportData.push({
                            time: date(time),
                            capacity: this.capacity.data[index][1],
                            uploadSpace: this.upload_space.data[index][1],
                            downloadSpace: this.download_space.data[index][1],
                            downloadCount: this.download_count.data[index][1],
                            uploadCount: this.upload_count.data[index][1],
                            delete_count: this.delete_count.data[index][1],
                            delete_space: this.delete_space.data[index][1]
                        })
                    })
                    this.spinShow = false
                })
            } catch (error) {
                console.log(error)
                this.spinShow = false
                this.$Message.warning(this.$t('STORAGE.GET_DATA_ERROR'))
            }
        },
        convertData (item, splite = false) {
            if (!item) {
                return '000'
            }
            return splite ? item.unit === 'byte' ? bytesSpliteUnits(item.value) : timesSpliteUnits(item.value) : item.unit === 'byte' ? bytes(item.value) : times(item.value)
        },
        getApiURL (operation) {
            let path = operation
            if (this.selectedBucket && this.selectedBucket !== 'All Buckets') {
                path += '/' + this.selectedBucket
            }
            path += '?custom_range=' + this.dateRange
            if (user.state.type === 'admin') {
                path += '&customer=' + user.state.subUser.username
            }
            return getAnalysisUrl(path)
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
        'capacity' (to, from) {
            chartReload(to.data, this.$refs.capacityLine)
        },
        'upload_space' (to, from) {
            chartReload(to.data, this.$refs.uploadTrafficLine)
        },
        'download_space' (to, from) {
            chartReload(to.data, this.$refs.downloadTrafficLine)
        },
        'download_count' (to, from) {
            chartReload(to.data, this.$refs.downloadsLine)
        },
        'upload_count' (to, from) {
            chartReload(to.data, this.$refs.uploadsLine)
        },
        'delete_count' (to, from) {
            chartReload(to.data, this.$refs.deleteCountLine)
        },
        'delete_space' (to, from) {
            chartReload(to.data, this.$refs.deleteSpaceLine)
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
        axisTick: {
            show: false
        },
        axisLabel: {
            textStyle: {
                color: '#8492a6'
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
            color: '#333'
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
                color: '#8492a6'
            }
        }
    },
    series: [{
        data: [],
        type: 'line',
        smooth: true,
        lineWidth: 1.0,
        symbol: 'none',
        sampling: 'average',
        itemStyle: {
            normal: {
                color: '#2c96ef'
            }
        },
        lineStyle: {
            normal: {
                color: '#2c96ef'
            }
        },
        areaStyle: {
            normal: {
                color: '#83C6F9',
                opacity: 0.8
            }
        }
    }]
}
const InitOptions = data => {
    let newOptions = _.defaultsDeep({}, lineOptions, {
        series: [{
            data: data.data,
            name: data.label
        }],
        tooltip: {
            formatter: function (params, ticket, callback) {
                let res = 'Date : ' + date(params[0].value[0])
                _.each(params, function (item) {
                    res += '<br/>' + item.seriesName + ' : '
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

const chartReload = (data, chart) => {
    chart && chart.mergeOptions({ series: [{ ...data }] })
}
</script>
<style lang='less' scoped>
@import '../../styles/index.less';

@overview-height: 180px;

.@{css-prefix}dashboard {
    .toolbar {
        margin-bottom: 16px;
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
            border-color: #20a0ff;
            color: #fff !important;
        }
    }

    .overview {
        border-top: @common-border;
        height: @overview-height;

        .capacity-traffic {
            margin-top: 16px;
            .fb(space-between, stretch, flex, column);
            border: @common-border;

            .capacity {
                flex: 4;
                background-image: url('../../assets/dashboard/capacity.png');
                background-repeat: no-repeat;
                background-size: 100% 100%;
                border: 0;
                color: #fff;
                text-align: center;
            }

            .traffic {
                flex: 3;

                .upload-traffic,
                .download-traffic {
                    display: inline-block;
                    @border: 2px;
                    width: calc(~'50% - @{border}');
                    text-align: center;
                }

                .upload-traffic {
                    border-right: @common-border;
                }
            }
        }

        .view-card {
            margin-top: 16px;
            margin-left: 16px;
            border: @common-border;

            &>div {
                display: inline-block;
                @border: 3px;
                width: calc(~'25% - @{border}');
                text-align: center;
                border-right: @common-border;

                .bsc-tooltip {
                    display: block;
                }

                .content {
                    margin-top: 10px;
                }
            }

            &>div:last-child {
                border: 0;
            }
        }
    }

    .section-chart-tab {
        width: 100%;
        height: 40px;
        display: inline-flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        margin-top: 16px;
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

@media(max-height:860px) {
    .capacity-traffic {
        height: @overview-height;

        .capacity {
            .content {
                margin-top: 30px;

                span:first-child {
                    font: 26px bolder;
                }

                p {
                    color: #fff;
                }
            }
        }

        .upload-traffic,
        .download-traffic {
            margin-top: 15px;
        }
    }

    .view-card {
        height: @overview-height;

        &>div {
            margin-top: 40px;

            img {
                width: 32px;
            }
        }
    }

    .content {
        text-align: center;

        span:first-child {
            font: 24px bolder;
        }

        span:nth-child(2) {
            font: 14px bolder;
        }

        p {
            color: #a1acb5;

            i {
                margin-left: 4px;
            }
        }
    }
}

@media(min-height:860px) {
    .capacity-traffic {
        height: @overview-height * 1.5;

        .capacity {
            .content {
                margin-top: 30px;

                span:first-child {
                    font: 36px bolder;
                }

                span:nth-child(2) {
                    font: 20px bolder;
                }

                p {
                    color: #fff;
                }
            }
        }

        .upload-traffic,
        .download-traffic {
            margin-top: 30px;
        }
    }

    .view-card {
        height: @overview-height * 1.5;

        &>div {
            margin-top: 60px;

            img {
                width: 72px;
            }
        }
    }

    .content {
        text-align: center;

        span:first-child {
            font: 30px bolder;
        }

        span:nth-child(2) {
            font: 16px bolder;
        }

        p {
            color: #a1acb5;

            i {
                margin-left: 4px;
            }
        }
    }
}
</style>
