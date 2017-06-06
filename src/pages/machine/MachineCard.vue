<template>
    <div class="bsc-machine-card">
        <div class="card-title">
            <span><Icon :class="{ alive: data.status === 'alive', down: data.status !== 'alive' }" type="heart"></Icon> {{data.hostname.slice(data.hostname.indexOf('-',14) + 1)}}</span>
        </div>
        <div class="card-chart">
            <chart :options="memOptions" auto-resize></chart>
            <div class="data-scale">
                <span>{{data.mem.percent}}%</span>
                <span>已用内存</span>
            </div>
        </div>
        <div class="card-tooltip">
            <span>
                <i class="tooltip-color"></i>
                已用:{{bytes(data.mem.total - data.mem.available)}}</span>
            <span>总内存:{{bytes(data.mem.total)}}</span>
        </div>
        <div class="card-cpu">
            <span>CPU load: {{data.cpu.load}}</span>
        </div>
        <div class="card-partition" v-if="partitionList.length > 0">
            <span>磁盘信息</span>
            <partition-node v-for="node in partitionList" :data="node" :key="node.ts"></partition-node>
        </div>
        <div class="card-ip">
            <div v-for="pubip in data.pub_ips">Public IP: {{pubip}}</div>
            <div v-for="innip in data.inn_ips">Inner IP: {{innip}}</div>
        </div>
        <div class="card-footer">
            <div v-openBtn class="button-open">
                <Icon type="chevron-down"></Icon>
            </div>
            <div class="card-network dn">
                <div class="row-network">
                    <span>网卡</span>
                    <span>发送</span>
                    <span>接收</span>
                </div>
                <div class="row-network" v-for="(value, key) in data.net.io">
                    <span>{{key}}</span>
                    <span>{{bytes(value.bytes_sent)}}</span>
                    <span>{{bytes(value.bytes_recv)}}</span>
                </div>
                <div v-cloBtn class="button-close">
                    <Icon type="chevron-up"></Icon>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import { bytes } from '@/service/bucketService'
import partitionNode from './PartitionNode'
export default {
    data () {
        return {}
    },
    props: ['data'],
    computed: {
        partitionList: function () {
            return this.data.partitions.ok.concat(this.data.partitions.bad).slice(0, 50)
        },
        memOptions: function () {
            return {
                tooltip: {
                    show: false
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['70%', '80%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        color: ['#20a0ff', '#ffde2a'],
                        data: [
                            { value: this.data.mem.total - this.data.mem.available, name: 'used' },
                            { value: this.data.mem.available, name: 'unused' }
                        ]
                    }
                ]
            }
        }
    },
    components: {
        chart: ECharts,
        partitionNode
    },
    directives: {
        cloBtn: {
            bind: function (el) {
                el.onclick = (e) => {
                    el.parentNode.classList.toggle('dn')
                    el.parentNode.parentNode.childNodes[0].classList.toggle('dn')
                }
            }
        },
        openBtn: {
            bind: function (el) {
                el.onclick = (e) => {
                    el.classList.toggle('dn')
                    el.parentNode.childNodes[2].classList.toggle('dn')
                }
            }
        }
    },
    methods: {
        bytes: bytes
    }
}

</script>
<style lang="less" scoped>
@import '../../styles/index.less';

.@{css-prefix}machine-card {


    .card-title {
        padding: 16px 16px 0 16px;
        .sc(14px, #475669);

        .alive {
            color: #00924c;
        }

        .down {
            color: #b93600;
        }
    }

    .card-chart {
        .wh(100%, 165px);

        .data-scale {
            position: relative;
            top: -105px;

            & > span {
                display: block;
                text-align: center;
            }
            
            & > span:first-child {
                font-size: 20px;
                font-weight: 500;
            }

            & > span:last-child {
                .sc(12px,#a2a8bb);
                font-weight: normal;
            }
        }
    }

    .card-tooltip {
        padding: 0 30px;
        margin-bottom: 15px;
        .sc(12px, #a2a8bb);

        & > span:last-child {
            float: right;
        }

        .tooltip-color {
            display: inline-block;
            position: relative;
            top: 2px;
            .wh(12px,12px);
            border-radius: 2px;
            background-color: @primary-color;
        }
    }

    .card-cpu {
        text-align: center;
        margin-bottom: 10px;
        span {
            .sc(14px,#475669)
        }
    }

    .card-partition {
        position: relative;
        border-top: @common-border;
        min-height: 100%;
        width: 100%;
        .fb(flex-start, flex-start);
        flex-wrap: wrap;
        padding: 30px 16px 16px 16px;

        & > span {
            position: absolute;
            top: 10px;
        }
    }

    .card-ip {
        border-top: @common-border;
        .sc(13px, #475669);
        padding-left: 16px;

        & > div {
            height: 30px;
            line-height: 30px;
        }

        & > div:not(:first-child) {
            border-top: @common-border;
        }
    }

    .card-footer {
        background: #f9fafc;
        .sc(13px, #475669);

        .card-footer-button {
            height: 30px;
            line-height: 30px;
            text-align: center;
            cursor: pointer;
        }

        .button-open {
            .card-footer-button();
        }

        .button-close {
            .card-footer-button();
            border-top: @common-border;
        }

        .card-network {
            background: #f9fafc;
            width: 298px;
            .sc(13px, #475669);
            line-height: 30px;
            z-index: 100;
            border: @common-border;

            .row-network {
                width: 100%;
                .fb(center, center);

                & > span {
                    flex: 1;
                    padding: 0 16px;
                    border-top: @common-border;
                }

                & > span:first-child {
                    flex: 1;
                }

                & > span:not(:last-child) {
                    border-top: @common-border;
                }
            }
        }
    }
}

.echarts {
    width: initial;
    height: 165px;
}

.dn {
    display: none
}
</style>
