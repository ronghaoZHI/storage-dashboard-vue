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
                    <Button type="primary"
                            style="margin:0;"
                            @click="dateSelect = dateDefault.seven_days">Last 7 days</Button>
                    <Button type="primary"
                            style="margin:0;"
                            v-if="isFristDay"
                            @click="dateSelect = dateDefault.this_month"
                            disabled>This month</Button>
                    <Button type="primary"
                            style="margin:0;"
                            @click="dateSelect = dateDefault.this_month">This month</Button>
                    <Button type="primary"
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
        <chart :options="polar"></chart>
    </div>
</template>
<script>
import { handler } from '../service/Aws'
import { HOST } from '../service/HOST'
import { bytes, times } from '../service/bucketService'

export default {
    data() {
        let data = []

        for (let i = 0; i <= 360; i++) {
            let t = i / 180 * Math.PI
            let r = Math.sin(2 * t) * Math.cos(2 * t)
            data.push([r, i])
        }

        return {
            polar: {
                title: {
                    text: '极坐标双数值轴'
                },
                legend: {
                    data: ['line']
                },
                polar: {
                    center: ['50%', '54%']
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                angleAxis: {
                    type: 'value',
                    startAngle: 0
                },
                radiusAxis: {
                    min: 0
                },
                series: [
                    {
                        coordinateSystem: 'polar',
                        name: 'line',
                        type: 'line',
                        showSymbol: false,
                        data: data
                    }
                ],
                animationDuration: 2000
            },

            bucketList: this.bucketList,
            bucket: 'All Buckets',
            dateDefault: {
                seven_days: [lastNDays(7), lastNDays(1)],
                this_month: [new Date(new Date().setDate(1)), lastNDays(1)],
                thirty_days: [lastNDays(30), lastNDays(1)],
            },
            dateSelect: [lastNDays(7), lastNDays(1)],
            originOverview: {},
            dateOptions: {
                disabledDate(date) {
                    return date && date.valueOf() > Date.now() - 86400000;
                }
            }
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
        }
    },
    mounted() {
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
                console.log("capacity", res.data.data.data)
                // this.splineCapacityOptions = setEcOptions(res);
            }), this.$http.get((this.getApiURL('upload_space'))).then(res => {
                // console.log("upload_space",res)
                // this.splineUploadSpaceOptions = setEcOptions(res);
            }), this.$http.get((this.getApiURL('download_space'))).then(res => {
                // console.log("download_space",res)
                // this.splineDownloadSpaceOptions = setEcOptions(res);
            }), this.$http.get((this.getApiURL('download_count'))).then(res => {
                // console.log("download_count",res)
                // this.splineDownloadCountOptions = setEcOptions(res);
            }), this.$http.get((this.getApiURL('upload_count'))).then(res => {
                // console.log("upload_count",res)
                // this.splineUploadCountOptions = setEcOptions(res);
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
        }
    }
}

const fixDate = n => n < 10 ? "0" + n : "" + n
const formatDate = date => date.getFullYear() + fixDate(date.getMonth() + 1) + fixDate(date.getDate())
const lastNDays = n => new Date(new Date().getTime() - 3600 * 1000 * 24 * n)

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
    width:300px;
  height: 300px;
}
</style>
