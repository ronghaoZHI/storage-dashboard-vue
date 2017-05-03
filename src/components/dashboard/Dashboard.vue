<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Col span="12">
            <Select v-model="bucket"
                    style="width:50%;float:left;"
                    @on-change="getInitData">
                <Option v-for="item in bucketList"
                        :value="item.Name"
                        :key="item.Name">{{ item.Name }}</Option>
            </Select>
            <Date-picker v-model="dateSelect"
                         format="yyyy/MM/dd"
                         type="daterange"
                         placement="bottom-end"
                         placeholder="Select time"
                         :options="dateOptions"
                         style="width: 50%;float:left;"></Date-picker>
            </Col>
            <Col span="12">
            <div class="pull-right">
                <Button-group>
                    <Button v-if="dateSelect == dateDefault.seven_days"
                            type="primary"
                            style="margin:0;"
                            @click="dateSelect = dateDefault.seven_days">Last 7 days</Button>
                    <Button v-else
                            style="margin:0;"
                            @click="dateSelect = dateDefault.seven_days">Last 7 days</Button>
                    <Button type="primary"
                            style="margin:0;"
                            v-if="isFristDay"
                            @click="dateSelect = dateDefault.this_month"
                            disabled>This month</Button>
                    <Button v-else-if="dateSelect == dateDefault.this_month"
                            type="primary"
                            style="margin:0;"
                            @click="dateSelect = dateDefault.this_month">This month</Button>
                    <Button v-else
                            style="margin:0;"
                            @click="dateSelect = dateDefault.this_month">This month</Button>
                    <Button v-if="dateSelect == dateDefault.thirty_days"
                            type="primary"
                            style="margin:0;"
                            @click="dateSelect = dateDefault.thirty_days">Last 30 days</Button>
                    <Button v-else
                            style="margin:0;"
                            @click="dateSelect = dateDefault.thirty_days">Last 30 days</Button>
                </Button-group>
            </div>
            </Col>
        </div>
        <div class="flex border-top-bottom padding15">
            <div class="grow1 center border-right padding15">
                <p><span class="big-blue">{{overview.capacity.value}}</span></p>
                <p class="info"><span>Total capacity</span>
                    <Tooltip placement="right">
                        <span><Icon type="ios-help"></Icon></span>
                        <div slot="content">
                            <p style="white-space: normal !important;">The bytes stored until the last selected date.</p>
                        </div>
                    </Tooltip>
                </p>
            </div>
            <div class="grow1 center border-right padding15">
                <p><span class="big-blue">{{overview.upload_space.value}}</span></p>
                <p class="info"><span>Total upload traffic</span>
                    <Tooltip placement="bottom">
                        <span><Icon type="ios-help"></Icon></span>
                        <div slot="content">
                            <p style="white-space: normal !important;">The bytes uploaded within selected date range.</p>
                        </div>
                    </Tooltip>
                </p>
            </div>
            <div class="grow1 center border-right padding15">
                <p><span class="big-blue">{{overview.download_space.value}}</span></p>
                <p class="info"><span>Total download traffic</span>
                    <Tooltip placement="bottom">
                        <span><Icon type="ios-help"></Icon></span>
                        <div slot="content">
                            <p style="white-space: normal !important;">The bytes downloaded traffic within selected date range.</p>
                        </div>
                    </Tooltip>
                </p>
            </div>
            <div class="grow1 center border-right padding15">
                <p><span class="big-blue">{{overview.download_count.value}}</span></p>
                <p class="info"><span>Total Downloads</span>
                    <Tooltip placement="bottom">
                        <span><Icon type="ios-help"></Icon></span>
                        <div slot="content">
                            <p style="white-space: normal !important;">The number of download requests within selected date range.</p>
                        </div>
                    </Tooltip>
                </p>
            </div>
            <div class="grow1 center padding15">
                <p><span class="big-blue">{{overview.upload_count.value}}</span></p>
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
        <Col span="12"
             class="dashboard-tabs demo-tabs-style2"
             style="margin-top:20px;">
        <Tabs size="small">
            <Tab-pane label="Capacity"
                      name="capacity">
                <chart :options="capacityOptions"
                       ref="capacityLine"></chart>
            </Tab-pane>
            <Tab-pane label="Upload traffic"
                      name="uploadTraffic">
                <chart :options="uploadTrafficOptions"
                       ref="uploadTrafficLine"></chart>
            </Tab-pane>
            <Tab-pane label="Download traffic"
                      name="downloadTraffic">
                <chart :options="downloadTrafficOptions"
                       ref="downloadTrafficLine"></chart>
            </Tab-pane>
            <Tab-pane label="Downloads"
                      name="downloads">
                <!--<chart :options="downloadsOptions"
                           ref="downloadsLine"></chart>-->
            </Tab-pane>
            <Tab-pane label="Uploads"
                      name="uploads">
                <!--<chart :options="uploadsOptions"
                           ref="uploadsLine"></chart>-->
            </Tab-pane>
        </Tabs>
        </Col>
    </div>
</template>
<script>
import { handler } from '../service/Aws'
import { HOST } from '../service/HOST'
import { bytes, times, date } from '../service/bucketService'
export default {
    data() {
        return {
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
            capacityOptions: _.cloneDeep(lineOptions),
            uploadTrafficOptions: _.cloneDeep(lineOptions),
            downloadTrafficOptions: _.cloneDeep(lineOptions),
            downloadsOptions: lineOptions,
            uploadsOptions: lineOptions,
        }
    },
    computed: {
        dateRange() {
            return formatDate(this.dateSelect[0]) + '-' + formatDate(this.dateSelect[1])
        },
        isFristDay() {
            return new Date().getDate == 1
        },
        overview() {
            _.forIn(this.originOverview, item => {
                item.value = item.unit == 'byte' ? bytes(item.value) : times(item.value)
            })
            return this.originOverview
        },
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
            let _this = this
            Promise.all([this.$http.get(this.getApiURL('overview')).then(res => {
                _this.originOverview = res.data.data.data
            }), this.$http.get((this.getApiURL('capacity'))).then(res => {
                _this.capacityData = res.data.data
                _this.capacityOptions = InitOptions(_this.capacityData)
            }), this.$http.get((this.getApiURL('upload_space'))).then(res => {
                _this.uploadSpaceData = res.data.data
                _this.uploadTrafficOptions = InitOptions(_this.uploadSpaceData)
            }), this.$http.get((this.getApiURL('download_space'))).then(res => {
                _this.downloadSpaceData = res.data.data
                _this.downloadTrafficOptions = InitOptions(_this.downloadSpaceData)
            }), this.$http.get((this.getApiURL('download_count'))).then(res => {
                _this.downloadCountData = res.data.data
                _this.downloadsOptions = InitOptions(_this.downloadCountData)
            }), this.$http.get((this.getApiURL('upload_count'))).then(res => {
                _this.uploadCountData = res.data.data
                _this.uploadsOptions = InitOptions(_this.uploadCountData)
            })]);
        },
        getApiURL(operation) {
            var path = '/v1/analysis/' + operation;
            if (this.bucket && this.bucket !== 'All Buckets') {
                path += '/' + this.bucket;
            }
            return 'http://' + HOST.apiHost + path + '?custom_range=' + this.dateRange
        },
    },
    watch: {
        // the contents array need refresh when the $route value changed
        '$route'(to, from) {
            to.path !== from.path && this.getData()
        },
        'dateSelect'(to, from) {
            this.getInitData()
        },
        'capacityData'(to, from) {
            let newOption = {
                series: [{
                    data: to.data
                }]
            }
            let line = this.$refs.capacityLine
            line.mergeOptions(newOption)
        },
        'uploadSpaceData'(to, from) {
            let newOption = {
                series: [{
                    data: to.data
                }]
            }
            let line = this.$refs.uploadTrafficLine
            line.mergeOptions(newOption)
        },
        'downloadSpaceData'(to, from) {
            let newOption = {
                series: [{
                    data: to.data
                }]
            }
            let line = this.$refs.downloadTrafficLine
            line.mergeOptions(newOption)
        }, 'downloadCountData'(to, from) {
            let newOption = {
                series: [{
                    data: to.data
                }]
            }
            let line = this.$refs.uploadTrafficLine
            line.mergeOptions(newOption)
        },
        'uploadCountData'(to, from) {
            let newOption = {
                series: [{
                    data: to.data
                }]
            }
            let line = this.$refs.downloadTrafficLine
            line.mergeOptions(newOption)
        },
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
                var res = date(params[0].value[0])
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
</script>
<style lang="less" scoped>
.flex {
    width: 100%;
    display: -webkit-flex;
    display: flex;
}

.grow1 {
    flex-grow: 1;
}

.border-top-bottom {
    border-top: 1px solid #d3dce6;
    border-bottom: 1px solid #d3dce6;
}

.center {
    text-align: center;
}

.padding15 {
    padding: 15px;
}

.border-right {
    border-right: 1px solid #d3dce6;
}

.big-blue {
    font-size: 30px;
    color: #20a0ff;
    font-family: Arial, Helvetica, sans-serif
}

.info {
    font-size: 12px;
    color: #99a9bf;
}

.pull-right {
    float: right;
}

.echarts {
    width: 300px;
    height: 300px;
}

.dashboard-tabs>.ivu-tabs-nav .ivu-tabs-tab {
    margin-right: 0 !important;
    border: 0 !important;
    border-right: 1px solid #d7dde4 !important;
    border-radius: none !important;
    background: #f5f7f9;
}
.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content {
        height: 120px;
        margin-top: -16px;
    }

</style>
