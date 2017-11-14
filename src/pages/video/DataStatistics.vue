<template>
    <div class="bsc-data-statistics">
        <Spin size="bigger" fix v-if="spinShow"></Spin>
        <div class="toolbar">
            <div class="button-datepicker">
                <Date-picker v-model="dateSelect" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="Select time" :options="dateOptions" style="width:100%;"></Date-picker>
            </div>
            <div class="button-daterange">
                <Button-group>
                    <Button v-bind:class="{buttonFocus: dateSelect === dateDefault.seven_days}" @click="dateSelect = dateDefault.seven_days">{{ $t("DASHBOARD.SEVEN_DAYS")}}</Button>
                    <Button v-show="!isFristDay" v-bind:class="{buttonFocus: dateSelect === dateDefault.this_month}" @click="dateSelect = dateDefault.this_month" >{{ $t("DASHBOARD.THIS_MONTH")}}</Button>
                    <Button v-bind:class="{buttonFocus: dateSelect === dateDefault.thirty_days}" @click="dateSelect = dateDefault.thirty_days">{{ $t("DASHBOARD.THIRTY_DAYS")}}</Button>
                </Button-group>
            </div>
            <div class="button-export-data">
                <Button @click="exportCsv">{{ $t("DASHBOARD.EXPORT_DATA")}}</Button>
            </div>
        </div>
        <div class="section-chart-tab">
            <button v-bind:class="{buttonFocus: showChart === 0}" @click="tabToggle(0,'overviewLine')">{{ $t("DASHBOARD.TRANSCODER_OVERVIEW")}}</button>
            <button v-bind:class="{buttonFocus: showChart === 1}" @click="tabToggle(1,'distributionLine')">{{ $t("DASHBOARD.TRANSCODER_DISTRIBUTION")}}</button>
            <button disabled></button>
        </div>
        <div class="section-chart">
            <div class="card-chart" v-show="showChart === 0">
                <chart :options="overviewOptions" auto-resize ref="overviewLine"></chart>
            </div>
            <div class="card-chart" v-show="showChart === 1">
                <chart :options="distributionOptions" auto-resize ref="distributionLine"></chart>
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
import { getTranscoderAnalysisUrl } from '@/service/API'
import { time, date } from '@/service/bucketService'
import Csv from '@/pages/dashboard/csv'
import fileSaver from 'file-saver'
import user from '@/store/modules/user'
export default {
    data () {
        return {
            showChart: 0,
            dateDefault: {
                seven_days: [lastNDays(7), lastNDays(1)],
                this_month: [new Date(new Date().setDate(1)), lastNDays(1)],
                thirty_days: [lastNDays(30), lastNDays(1)]
            },
            dateSelect: this.dateSelect,
            dateOptions: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now() - 86400000
                }
            },
            data: [],
            spinShow: true,
            overviewOptions: lineOptions,
            distributionOptions: lineOptions
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
        this.dateSelect = this.dateDefault.seven_days
        this.getInitData()
    },
    methods: {
        async getInitData () {
            this.spinShow = true
            if (!this.dateSelect) return
            this.showChart = 0

            try {
                await Promise.all([this.$http.get(this.getApiURL('overview')).then(res => {
                    this.overviewData = res
                    this.overviewOptions = InitOverviewOptions(this.overviewData)
                }), this.$http.get((this.getApiURL('distribution'))).then(res => {
                    this.distributionData = res
                    this.distributionOptions = InitDistributionOptions(this.distributionData)
                })]).then(res => {
                    this.data = []
                    _.each(this.overviewData.video_transcoding.map(data => data[0]), (time, index) => {
                        this.data.push({
                            date: date(time),
                            '视频转码任务数(个)': this.overviewData.video_transcoding[index][1],
                            '音频转码任务数(个)': this.overviewData.audio_transcoding[index][1],
                            '视频截图张数(个)': this.overviewData.snapshot[index][1],
                            '转封装任务数(个)': this.overviewData.container_only[index][1],
                            '音视频元信息接口调用次数(个)': this.overviewData.get_metadata[index][1],
                            'SD240(s)': this.distributionData.SD240[index][1],
                            'SD480(s)': this.distributionData.SD480[index][1],
                            'SD(s)': this.distributionData.SD[index][1],
                            'HD(s)': this.distributionData.HD[index][1],
                            '2K(s)': this.distributionData['2K'][index][1],
                            '4K(s)': this.distributionData['4K'][index][1],
                            'audio(s)': this.distributionData.audio[index][1]
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
        getApiURL (operation) {
            let path = operation
            path += '?custom_range=' + this.dateRange
            if (user.state.type === 'admin') {
                path += '&customer=' + user.state.subUser.username
            }
            return getTranscoderAnalysisUrl(path)
        },
        tabToggle (index, ref) {
            let vm = this
            vm.showChart = index
            setTimeout(() => { vm.$refs[ref].resize() }, 100)
        },
        exportCsv () {
            let content = Csv(_.keys(this.data[0]), this.data, ',')
            let file = new File(Array.from(content), this.dateRange + '.csv', {type: 'text/csv;charset=utf-8'})
            fileSaver.saveAs(file)
        }
    },
    watch: {
        'dateSelect' (to, from) {
            to[0] && this.getInitData()
        },
        'overviewData' (to, from) {
            chartReload(to.data, this.$refs.overviewLine)
        },
        'distributionData' (to, from) {
            chartReload(to.data, this.$refs.distributionLine)
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
        top: '60',
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
    }
}
const InitOverviewOptions = data => {
    let newOptions = _.defaultsDeep({}, lineOptions, {
        tooltip: {
            formatter: function (params, ticket, callback) {
                let res = 'Date : ' + date(params[0].value[0])
                _.each(params, function (item) {
                    res += '<br/>' + item.seriesName + ' : '
                    res += item.value[1]
                })
                return res
            }
        },
        yAxis: {
            name: '个'
        },
        color: ['#9f61fc', '#1e9fff', '#0cce66', '#ffac2a', '#8492a6'],
        legend: {
            data: ['视频转码任务数', '音频转码任务数', '视频截图张数', '转封装任务数', '音视频元信息接口调用次数'],
            top: '20px',
            textStyle: {
                color: '#1E9FFF',
                fontSize: 14
            },
            icon: 'square',
            itemGap: 40
        },
        series: [{
            name: '视频转码任务数',
            type: 'line',
            areaStyle: {
                normal: {
                    color: '#83C6F9',
                    opacity: 0.8
                }
            },
            data: data.video_transcoding
        }, {
            name: '音频转码任务数',
            type: 'line',
            areaStyle: {
                normal: {
                    color: '#83C6F9',
                    opacity: 0.8
                }
            },
            data: data.audio_transcoding
        }, {
            name: '视频截图张数',
            type: 'line',
            areaStyle: {
                normal: {
                    color: '#83C6F9',
                    opacity: 0.8
                }
            },
            data: data.snapshot
        }, {
            name: '转封装任务数',
            type: 'line',
            areaStyle: {
                normal: {
                    color: '#83C6F9',
                    opacity: 0.8
                }
            },
            data: data.container_only
        }, {
            name: '音视频元信息接口调用次数',
            type: 'line',
            areaStyle: {
                normal: {
                    color: '#83C6F9',
                    opacity: 0.8
                }
            },
            data: data.get_metadata
        }]
    })
    return newOptions
}
const InitDistributionOptions = data => {
    let newOptions = _.defaultsDeep({}, lineOptions, {
        tooltip: {
            formatter: function (params, ticket, callback) {
                let res = 'Date : ' + date(params[0].value[0])
                _.each(params, function (item) {
                    res += '<br/>' + item.seriesName + ' : '
                    res += time(item.value[1], 2)
                })
                return res
            }
        },
        yAxis: {
            axisLabel: {
                formatter: function (value) {
                    return time(value)
                }
            }
        },
        color: ['#9f61fc', '#1e9fff', '#0cce66', '#1212ee', '#ffac2a', '#8492a6', '#c4cfdf'],
        legend: {
            data: ['SD240', 'SD480', 'SD', 'HD', '2K', '4K', 'audio'],
            top: '20px',
            textStyle: {
                color: '#1E9FFF',
                fontSize: 14
            },
            icon: 'square',
            itemGap: 40
        },
        series: [{
            name: 'SD240',
            type: 'line',
            areaStyle: {
                normal: {
                    color: '#83C6F9',
                    opacity: 0.8
                }
            },
            data: data.SD240
        }, {
            name: 'SD480',
            type: 'line',
            areaStyle: {
                normal: {
                    color: '#83C6F9',
                    opacity: 0.8
                }
            },
            data: data.SD480
        }, {
            name: 'SD',
            type: 'line',
            areaStyle: {
                normal: {
                    color: '#83C6F9',
                    opacity: 0.8
                }
            },
            data: data.SD
        }, {
            name: 'HD',
            type: 'line',
            areaStyle: {
                normal: {
                    color: '#83C6F9',
                    opacity: 0.8
                }
            },
            data: data.HD
        }, {
            name: '2K',
            type: 'line',
            areaStyle: {
                normal: {
                    color: '#83C6F9',
                    opacity: 0.8
                }
            },
            data: data['2K']
        }, {
            name: '4K',
            type: 'line',
            areaStyle: {
                normal: {
                    color: '#83C6F9',
                    opacity: 0.8
                }
            },
            data: data['4K']
        }, {
            name: 'audio',
            type: 'line',
            areaStyle: {
                normal: {
                    color: '#83C6F9',
                    opacity: 0.8
                }
            },
            data: data.audio
        }]
    })
    return newOptions
}

const chartReload = (data, chart) => {
    chart && chart.mergeOptions({ series: [{ ...data }] })
}
</script>
<style lang='less' scoped>
@overview-height: 180px;

@overview-height: 180px;

.dark .@{css-prefix}data-statistics {
    .toolbar {
        .button-daterange {
            button {
                border: 1px solid @body-background-dark;
                border-left: none;
            }
            button:first-child {
                border-left: 1px solid @body-background-dark;
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
            background-color: @body-background-dark;
        }
        &>button:nth-last-child(1) {
            border-right: 0;
        }
        &>button:nth-last-child(2):focus,
        &>button:nth-last-child(2).buttonFocus {
            border-right: 1px solid #52626d;
        }
        button:focus,
        .buttonFocus {
            background-color: @secondary-color-dark;
            border-bottom: 0;
            color: @text-color-dark;
        }
    }

    .card-chart {
        border: @common-border-dark;
        border-top: 0;
    }
}

.@{css-prefix}data-statistics {
    .toolbar {
        margin-bottom: 16px;
        height: 32px;
        .button-datepicker {
            width: 430px;
            float: left;
            margin-right: 16px;
        }
        .button-daterange {
            float: left;
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
        .button-export-data {
            float: right;
        }
    }

    .section-chart-tab {
        width: 100%;
        height: 40px;
        margin-top: 16px;
        border: 1px solid #d3dce6;
        border-bottom: 0;
        button {
            float: left;
            width: 20%;
            height: 100%;
            text-align: center;
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
            width: 60%;
            cursor: default;
        }
        &>button:nth-last-child(2) {
            border-right: 0;
        }
        &>button:nth-last-child(2):focus,
        &>button:nth-last-child(2).buttonFocus {
            border-right: 1px solid #d3dce6;
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
