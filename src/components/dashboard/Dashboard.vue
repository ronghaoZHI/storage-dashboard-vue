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
                    <Button v-bind:class="{buttonFocus: dateSelect === dateDefault.seven_days}" @click="dateSelect = dateDefault.seven_days">{{ $t("DASHBOARD.SEVEN_DAYS")}}</Button>
                    <Button :disabled="isFristDay" v-bind:class="{buttonFocus: dateSelect === dateDefault.this_month}" @click="dateSelect = dateDefault.this_month" >{{ $t("DASHBOARD.THIS_MONTH")}}</Button>
                    <Button v-bind:class="{buttonFocus: dateSelect === dateDefault.thirty_days}" @click="dateSelect = dateDefault.thirty_days">{{ $t("DASHBOARD.THIRTY_DAYS")}}</Button>
                </Button-group>
            </div>
        </div>
        <div class="section-overview">
            <div>
                <p><span class="big-blue">{{convertData(originOverview.capacity ) }}</span></p>
                <p class="info">
                    <span>{{ $t("DASHBOARD.CAPACITY_ALL")}}</span>
                    <span><Icon type="ios-help"></Icon></span>
                    <Tooltip placement="right" class="relative-tooltip">
                        <span class="hidden"><Icon type="ios-help"></Icon></span>
                        <div slot="content">
                            <p style="white-space: normal !important;">{{ $t("DASHBOARD.CAPACITY_ALL_INFO")}}</p>
                        </div>
                    </Tooltip>
                </p>
            </div>
            <div>
                <p><span class="big-blue">{{convertData(originOverview.upload_space)}}</span></p>
                <p class="info">
                    <span>{{ $t("DASHBOARD.UPLOAD_SPACE_ALL")}}</span>
                    <span><Icon type="ios-help"></Icon></span>
                    <Tooltip placement="bottom" class="relative-tooltip">
                        <span class="hidden"><Icon type="ios-help"></Icon></span>
                        <div slot="content">
                            <p style="white-space: normal !important;">{{ $t("DASHBOARD.UPLOAD_SPACE_ALL_INFO")}}</p>
                        </div>
                    </Tooltip>
                </p>
            </div>
            <div>
                <p><span class="big-blue">{{convertData(originOverview.download_space)}}</span></p>
                <p class="info">
                    <span>{{ $t("DASHBOARD.DOWNLOAD_SPACE_ALL")}}</span>
                    <span><Icon type="ios-help"></Icon></span>
                    <Tooltip placement="bottom" class="relative-tooltip">
                        <span class="hidden"><Icon type="ios-help"></Icon></span>
                        <div slot="content">
                            <p style="white-space: normal !important;">{{ $t("DASHBOARD.DOWNLOAD_SPACE_ALL_INFO")}}</p>
                        </div>
                    </Tooltip>
                </p>
            </div>
            <div>
                <p><span class="big-blue">{{convertData(originOverview.download_count)}}</span></p>
                <p class="info">
                    <span>{{ $t("DASHBOARD.DOWNLOAD_COUNT_ALL")}}</span>
                    <span><Icon type="ios-help"></Icon></span>
                    <Tooltip placement="bottom" class="relative-tooltip">
                        <span class="hidden"><Icon type="ios-help"></Icon></span>
                        <div slot="content">
                            <p style="white-space: normal !important;">{{ $t("DASHBOARD.DOWNLOAD_COUNT_ALL_INFO")}}</p>
                        </div>
                    </Tooltip>
                </p>
            </div>
            <div>
                <p><span class="big-blue">{{convertData(originOverview.upload_count)}}</span></p>
                <p class="info">
                    <span>{{ $t("DASHBOARD.UPLOAD_COUNT_ALL")}}</span>
                    <span><Icon type="ios-help"></Icon></span>
                    <Tooltip placement="left" class="relative-tooltip">
                        <span class="hidden"><Icon type="ios-help"></Icon></span>
                        <div slot="content">
                            <p style="white-space: normal !important;">{{ $t("DASHBOARD.UPLOAD_COUNT_ALL_INFO")}}</p>
                        </div>
                    </Tooltip>
                </p>
            </div>
        </div>
        <div class="section-chart-tab">
            <button v-bind:class="{buttonFocus: showChart === 0}" @click="tabToggle(0,'capacityLine')">{{ $t("DASHBOARD.CAPACITY")}}</button>
            <button v-bind:class="{buttonFocus: showChart === 1}" @click="tabToggle(1,'uploadTrafficLine')">{{ $t("DASHBOARD.UPLOAD_SPACE")}}</button>
            <button v-bind:class="{buttonFocus: showChart === 2}" @click="tabToggle(2,'downloadTrafficLine')">{{ $t("DASHBOARD.DOWNLOAD_SPACE")}}</button>
            <button v-bind:class="{buttonFocus: showChart === 3}" @click="tabToggle(3,'downloadsLine')">{{ $t("DASHBOARD.DOWNLOAD_COUNT")}}</button>
            <button v-bind:class="{buttonFocus: showChart === 4}" @click="tabToggle(4,'uploadsLine')">{{ $t("DASHBOARD.UPLOAD_COUNT")}}</button>
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
                this.$Message.error(this.$t("DASHBOARD.GET_BUCKET_FAILED"))
            };
        },
        async getInitData() {
            if(!this.dateSelect){
                return
            }
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
                self.$Message.warning(error)
                self.$router.push({
                    path: '/login',
                    query: { redirect: '/dashboard' }
                })
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
            to[0] && this.getInitData()
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
const formatDate = date => date && date.getFullYear() + fixDate(date.getMonth() + 1) + fixDate(date.getDate())
const lastNDays = n => new Date(new Date().getTime() - 3600 * 1000 * 24 * n)
const lineOptions = {
    tooltip: {
        trigger: "axis",
        textStyle:{
            color: '#fff',
            fontSize:14,
        },
        padding:10,
    },
    grid: {
        top: "45",
        left: "10",
        right: "40",
        bottom: "10",
        containLabel: true
    },
    xAxis: {
        type: 'time',
        offset:5,
        axisLine:{
            lineStyle:{
                color:"#8492a6"
            }
        },
        axisTick:{
            show: false,
        },
        axisLabel: {
            textStyle: {
                color: "#8492a6"
            },
            formatter: function (value) {
                return date(value)
            }
        },
    },
    yAxis: {
        type: "value",
        min: 0,
        offset:5,
        nameTextStyle: {
            color: "#333"
        },
        axisLine: {
            show: false,
            lineStyle:{
                color:"#8492a6"
            }
        },
        axisTick:{
            show: false,
        },
        axisLabel: {
            textStyle: {
                color: "#8492a6"
            },
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
                let res = '时间 : ' + date(params[0].value[0])
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
    newOptions.title = data.unit == 'byte' ? {} : { textStyle:{fontSize:12,color:'#8492a6',fontWeight:'normal',},text: "Unit : times", padding: [10, 0, 0, 5],}
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
            font-size:14px;
            color:#475669;
            height:30px;
            background: #fff;
            line-height: 16px;
            border: 1px solid #d3dce6;
            border-left:none;
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

.section-overview {
    width: 100%;
    display: -webkit-flex;
    display: flex;
    padding: 23px 15px;
    border-top: 1px solid #e5e9f2;
    border-bottom: 1px solid #e5e9f2;
    margin: 10px 0 15px 0;
    height:140px;
    &>div {
        flex-grow: 1;
        text-align: center;
        border-right: 1px solid #e5e9f2;
        padding: 5px;
        height:92px;
    }
    &>div:nth-last-child(1) {
        border-right: 0;
    }
    .big-blue {
        font-size: 30px;
        color: #20a0ff;
        font-family: Arial, Helvetica, sans-serif
    }
    .info {
        font-size: 14px;
        color: #8492a6;
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
    border: 1px solid #d3dce6;
    border-bottom:0;
    button {
        width: 100%;
        height: 100%;
        text-align: center;
        vertical-align: middle;
        -ms-touch-action: manipulation;
        touch-action: manipulation;
        cursor: pointer;
        background-image: none;
        border:none;
        border-right: 1px solid #d3dce6;
        border-bottom: 1px solid #d3dce6;
        white-space: nowrap;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        font-size: 14px;
        transform: translateZ(0);
        transition: color .2s linear,background-color .2s linear;
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
    border-top:0;
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
.relative-tooltip{
    margin-left:-15px;
}
.hidden{
    visibility:hidden;
}
</style>
