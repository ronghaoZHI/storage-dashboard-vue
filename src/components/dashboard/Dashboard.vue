<template>
    <div>
        <div class="layout-bsc-toolbar">
            <div class="button-datepicker">
                <Select v-model="bucket" style="width:40%;float:left;margin-right:16px;" @on-change="getInitData">
                    <Option v-for="item in bucketList" :value="item.Name" :key="item.Name">{{ item.Name }}</Option>
                </Select>
                <Date-picker v-model="dateSelect" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="Select time" :options="dateOptions" style="width: 50%;float:left;"></Date-picker>
            </div>
    
            <div class="button-daterange">
                <Button-group>
                    <Button v-if="dateSelect == dateDefault.seven_days" type="primary" @click="dateSelect = dateDefault.seven_days">Last 7 days</Button>
                    <Button v-else @click="dateSelect = dateDefault.seven_days">Last 7 days</Button>
                    <Button v-if="isFristDay" @click="dateSelect = dateDefault.this_month" type="primary" disabled>This month</Button>
                    <Button v-else-if="dateSelect == dateDefault.this_month" type="primary" @click="dateSelect = dateDefault.this_month">This month</Button>
                    <Button v-else @click="dateSelect = dateDefault.this_month">This month</Button>
                    <Button v-if="dateSelect == dateDefault.thirty_days" type="primary" @click="dateSelect = dateDefault.thirty_days">Last 30 days</Button>
                    <Button v-else @click="dateSelect = dateDefault.thirty_days">Last 30 days</Button>
                </Button-group>
            </div>
        </div>
        <div class="section-separator">
            <span class="separator-icon"></span>
            <span class="separator-info">Overview</span>
        </div>
        <div class="section-overview">
            <div>
                <p><span class="big-blue">{{convertData(originOverview.capacity ) }}</span></p>
                <p class="info"><span>Total capacity</span>
                    <Tooltip placement="right">
                        <span><Icon type="ios-help"></Icon></span>
                        <div slot="content">
                            <p style="white-space: normal !important;">The bytes stored until the last selected date.</p>
                        </div>
                    </Tooltip>
                </p>
            </div>
            <div>
                <p><span class="big-blue">{{convertData(originOverview.upload_space)}}</span></p>
                <p class="info"><span>Total upload traffic</span>
                    <Tooltip placement="bottom">
                        <span><Icon type="ios-help"></Icon></span>
                        <div slot="content">
                            <p style="white-space: normal !important;">The bytes uploaded within selected date range.</p>
                        </div>
                    </Tooltip>
                </p>
            </div>
            <div>
                <p><span class="big-blue">{{convertData(originOverview.download_space)}}</span></p>
                <p class="info"><span>Total download traffic</span>
                    <Tooltip placement="bottom">
                        <span><Icon type="ios-help"></Icon></span>
                        <div slot="content">
                            <p style="white-space: normal !important;">The bytes downloaded traffic within selected date range.</p>
                        </div>
                    </Tooltip>
                </p>
            </div>
            <div>
                <p><span class="big-blue">{{convertData(originOverview.download_count)}}</span></p>
                <p class="info"><span>Total Downloads</span>
                    <Tooltip placement="bottom">
                        <span><Icon type="ios-help"></Icon></span>
                        <div slot="content">
                            <p style="white-space: normal !important;">The number of download requests within selected date range.</p>
                        </div>
                    </Tooltip>
                </p>
            </div>
            <div>
                <p><span class="big-blue">{{convertData(originOverview.upload_count)}}</span></p>
                <p class="info"><span>Total Uploads</span>
                    <Tooltip placement="left">
                        <span><Icon type="ios-help"></Icon></span>
                        <div slot="content">
                            <p style="white-space: normal !important;">The number of upload requests within selected date range.</p>
                        </div>
                    </Tooltip>
                </p>
            </div>
        </div>
        <div class="section-separator">
            <span class="separator-icon"></span>
            <span class="separator-info">Data charts</span>
        </div>
        <div class="section-chart-tab">
            <button v-bind:class="{buttonFocus: showChart === 0}" @click="tabToggle(0,'capacityLine')">Capacity</button>
            <button v-bind:class="{buttonFocus: showChart === 1}" @click="tabToggle(1,'uploadTrafficLine')">Upload traffic</button>
            <button v-bind:class="{buttonFocus: showChart === 2}" @click="tabToggle(2,'downloadTrafficLine')">Download traffic</button>
            <button v-bind:class="{buttonFocus: showChart === 3}" @click="tabToggle(3,'downloadsLine')">Downloads</button>
            <button v-bind:class="{buttonFocus: showChart === 4}" @click="tabToggle(4,'uploadsLine')">Uploads</button>
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
import { handler } from '../service/Aws'
import { getAnalysisUrl } from '../service/API'
import { bytes, times, date } from '../service/bucketService'
export default {
    data() {
        return {
            showChart: 0,
            bucketList: this.bucketList,
            bucket: 'All Buckets',
            dateDefault: {
                seven_days: [lastNDays(7), lastNDays(1)],
                this_month: [new Date(new Date().setDate(1)), lastNDays(1)],
                thirty_days: [lastNDays(30), lastNDays(1)],
            },
            dateSelect: this.dateSelect,
            originOverview: {},
            dateOptions: {
                disabledDate(date) {
                    return date && date.valueOf() > Date.now() - 86400000;
                }
            },
            capacityData: this.capacityData,
            uploadSpaceData: this.uploadSpaceData,
            downloadSpaceData: this.downloadSpaceData,
            downloadCountData: this.downloadCountData,
            uploadCountData: this.uploadCountData,
            capacityOptions: lineOptions,
            uploadTrafficOptions: lineOptions,
            downloadTrafficOptions: lineOptions,
            downloadsOptions: lineOptions,
            uploadsOptions: lineOptions
        }
    },
    components: {
        chart: ECharts
    },
    computed: {
        dateRange() {
            return formatDate(this.dateSelect[0]) + '-' + formatDate(this.dateSelect[1])
        },
        isFristDay() {
            return new Date().getDate == 1
        }
    },
    mounted() {
        this.dateSelect = this.dateDefault.seven_days
        this.getBucketList()
        this.getInitData()
    },
    methods: {
        async getBucketList() {
            try {
                let res = await handler('listBuckets')
                this.bucketList = [...res.Buckets, { Name: 'All Buckets' }]
            } catch (error) {
                this.$Message.error("Get bucket list fail")
            };
        },
        async getInitData() {
            let self = this
            self.showChart = 0
            Promise.all([this.$http.get(this.getApiURL('overview')).then(res => {
                self.originOverview = res.data.data.data
            }), this.$http.get((this.getApiURL('capacity'))).then(res => {
                self.capacityData = res.data.data
                self.capacityOptions = InitOptions(self.capacityData)
            }), this.$http.get((this.getApiURL('upload_space'))).then(res => {
                self.uploadSpaceData = res.data.data
                self.uploadTrafficOptions = InitOptions(self.uploadSpaceData)
            }), this.$http.get((this.getApiURL('download_space'))).then(res => {
                self.downloadSpaceData = res.data.data
                self.downloadTrafficOptions = InitOptions(self.downloadSpaceData)
            }), this.$http.get((this.getApiURL('download_count'))).then(res => {
                self.downloadCountData = res.data.data
                self.downloadsOptions = InitOptions(self.downloadCountData)
            }), this.$http.get((this.getApiURL('upload_count'))).then(res => {
                self.uploadCountData = res.data.data
                self.uploadsOptions = InitOptions(self.uploadCountData)
            })]).then(res => {}, error => {
                if (error.message === 'Request failed with status code 401') {
                    self.$Message.warning('Need to login again')
                    self.$router.push({
                        path: '/login',
                        query: { redirect: '/dashboard' }
                    })
                }
            })
        },
        convertData(item) {
            if (!item) {
                return '000'
            }
            return item.unit == 'byte' ? bytes(item.value) : times(item.value)
        },
        getApiURL(operation) {
            let path = operation
            if (this.bucket && this.bucket !== 'All Buckets') {
                path += '/' + this.bucket
            }
            return getAnalysisUrl(path + '?custom_range=' + this.dateRange)
        },
        tabToggle(index,ref) {
            let vm = this
            vm.showChart = index
            setTimeout(() => { vm.$refs[ref].resize() },100)
        }
    },
    watch: {
        'dateSelect'(to, from) {
            this.getInitData()
        },
        'capacityData'(to, from) {
            chartReload(to.data, this.$refs.capacityLine)
        },
        'uploadSpaceData'(to, from) {
            chartReload(to.data, this.$refs.uploadTrafficLine)
        },
        'downloadSpaceData'(to, from) {
            chartReload(to.data, this.$refs.downloadTrafficLine)
        },
        'downloadCountData'(to, from) {
            chartReload(to.data, this.$refs.downloadsLine)
        },
        'uploadCountData'(to, from) {
            chartReload(to.data, this.$refs.uploadsLine)
        }
    }
}

const fixDate = n => n < 10 ? "0" + n : "" + n
const formatDate = date => date.getFullYear() + fixDate(date.getMonth() + 1) + fixDate(date.getDate())
const lastNDays = n => new Date(new Date().getTime() - 3600 * 1000 * 24 * n)
const lineOptions = {
    tooltip: {
        trigger: "axis",
    },
    grid: {
        top: "30",
        left: "0",
        right: "40",
        bottom: "10",
        containLabel: true
    },
    xAxis: {
        type: 'time',
        axisLabel: {
            textStyle: {
                color: '#5c6076'
            },
            formatter: function (value) {
                return date(value)
            }
        },
    },
    yAxis: {
        type: "value",
        min: 0,
        nameTextStyle: {
            color: "#333"
        },
        ayisLine: {
            show: false
        },
        axisLabel: {
            textStyle: {
                color: '#5c6076'
            },
        },
        axisLine: {
            lineStyle: {
                color: '#384157'
            }
        },
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
                color: "#2c96ef"
            }
        },
        lineStyle: {
            normal: {
                color: "#2c96ef"
            }
        },
        areaStyle: {
            normal: {
                color: "#83C6F9",
                opacity: 0.8
            }
        }
    }]
}
const InitOptions = data => {
    let newOptions = _.defaultsDeep({}, lineOptions, {
        series: [{
            data: data.data,
            name: data.label,
        }],
        tooltip: {
            formatter: function (params, ticket, callback) {
                let res = date(params[0].value[0])
                _.each(params, function (item) {
                    res += '<br/>' + item.seriesName + ' : '
                    res += data.unit == 'byte' ? bytes(item.value[1]) : times(item.value[1])
                });
                return res;
            }
        },
        yAxis: {
            axisLabel: {
                formatter: function (value) {
                    return data.unit == 'byte' ? bytes(value) : times(value)
                }
            },
        },
    })
    newOptions.title = data.unit == 'byte' ? {} : { subtext: "Unit:times", padding: [-28, 0, 0, 0], }
    return newOptions
}

const chartReload = (data, chart) => {
    chart && chart.mergeOptions({ series: [{ ...data }] })
}
</script>
<style lang="less" scoped>
.layout-bsc-toolbar {
    .button-datepicker {
        width: 50%;
    }
    .button-daterange {
        button {
            margin: 0;
        }
    }
}

.section-overview {
    width: 100%;
    display: -webkit-flex;
    display: flex;
    padding: 20px 15px;
    border-top: 1px solid #d3dce6;
    border-bottom: 1px solid #d3dce6;
    margin: 6px 0 8px 0;
    &>div {
        flex-grow: 1;
        text-align: center;
        border-right: 1px solid #d3dce6;
        padding: 15px;
    }
    &>div:nth-last-child(1) {
        border-right: 0;
    }
    .big-blue {
        font-size: 36px;
        color: #20a0ff;
        font-family: Arial, Helvetica, sans-serif
    }
    .info {
        font-size: 12px;
        color: #99a9bf;
    }
}

.section-chart-tab {
    width: 100%;
    height: 40px;
    display: inline-flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-top: 6px;
    button {
        width: 100%;
        height: 100%;
        text-align: center;
        vertical-align: middle;
        -ms-touch-action: manipulation;
        touch-action: manipulation;
        cursor: pointer;
        background-image: none;
        border: 1px solid transparent;
        white-space: nowrap;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        font-size: 15px;
        font-weight: bold;
        transform: translateZ(0);
        transition: color .2s linear,background-color .2s linear,border .2s linear;
        color: #657180;
        background-color: #fff;
        border-color: #d7dde4;
    }
    button:focus,
    .buttonFocus {
        outline: 0;
        background: #20a0ff;
        border-color: #20a0ff;
        color: #fff;
    }
}

.card-chart {
    width: 100%;
    padding: 4px;
    border: 1px solid #d7dde4;
    margin-bottom: 16px;
    border-color: #e3e8ee;
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
</style>
