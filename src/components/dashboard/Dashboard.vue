<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Col span="12">
            <Select v-model="bucket"
                    style="width:200px"
                    @on-change="getInitData">
                <Option v-for="item in bucketList"
                        :value="item.Name"
                        :key="item.Name">{{ item.Name }}</Option>
            </Select>
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
            </Col>
            <Col span="12">
            <Date-picker v-model="dateSelect"
                         format="yyyy/MM/dd"
                         type="daterange"
                         placement="bottom-end"
                         placeholder="Select time"
                         style="width: 200px"></Date-picker>
            </Col>
        </div>
        <div class="flex border-top-bottom padding15">
            <div class="border-right">
                <p><span class="big-blue"></span></p>
                <p><span class="info">vfdvgf</span></p>
            </div>
            <div class="border-right">
                <p><span class="big-blue">dfdgv</span></p>
                <p><span class="info">vfdvgf</span></p>
            </div>
            <div class="border-right">
                <p><span class="big-blue">dfdgv</span></p>
                <p><span class="info">vfdvgf</span></p>
            </div>
            <div class="border-right">
                <p><span class="big-blue">dfdgv</span></p>
                <p><span class="info">vfdvgf</span></p>
            </div>
            <div class="">
                <p><span class="big-blue">dfdgv</span></p>
                <p><span class="info">vfdvgf</span></p>
            </div>
        </div>
    </div>
</template>
<script>
import { HOST } from '../service/HOST'
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
            dateSelect: [lastNDays(7), lastNDays(1)],
            overview: this.overview,
        }
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
        this.getBucketList()
        this.getInitData()
    },
    methods: {
        async getBucketList() {
            try {
                let res = await handler('listBuckets')
                this.bucketList = [...res.Buckets, { Name: 'All Buckets' }]
            } catch (error) {
                this.$Message.error("Get bucket list fail");
            }
        },
        async getInitData() {
            let _this = this
            Promise.all([this.$http.get(this.getApiURL('overview')).then(res =>{
                console.log("overview", res.data.data.data)
                _this.overview = res.data.data.data;
            }), this.$http.get((this.getApiURL('capacity'))).then(function (res) {
                // console.log("capacity",res)
                // this.splineCapacityOptions = setEcOptions(res);
            }), this.$http.get((this.getApiURL('upload_space'))).then(function (res) {
                // console.log("upload_space",res)
                // this.splineUploadSpaceOptions = setEcOptions(res);
            }), this.$http.get((this.getApiURL('download_space'))).then(function (res) {
                // console.log("download_space",res)
                // this.splineDownloadSpaceOptions = setEcOptions(res);
            }), this.$http.get((this.getApiURL('download_count'))).then(function (res) {
                // console.log("download_count",res)
                // this.splineDownloadCountOptions = setEcOptions(res);
            }), this.$http.get((this.getApiURL('upload_count'))).then(function (res) {
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
    display: -webkit-flex;
    display: flex;
}

.border-top-bottom {
    border-top: 1px solid #d3dce6;
    border-bottom: 1px solid #d3dce6;
}

.padding15 {
    padding: 15px;
}

.border-right {
    border-right: 1px solid #d3dce6;
}

.big-blue {
    font-size: 18px;
    color: #20a0ff;
}

.span-info {
    font-size: 12px;
    color: #99a9bf;
}
</style>
