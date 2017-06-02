<template>
    <div class="bsc-machine-card">
        <div class="card-title">
            <span>iZ25sdfasdf9zZ</span>
            <span>CPU Load:0.53</span>
        </div>
        <div class="card-chart">
            <chart :options="pieOptions" auto-resize></chart>
            <span class="data-scale">71%</span>
        </div>
        <div class="card-tooltip">
            <span>
                <i class="tooltip-color"></i>
                已用:2.5GB</span>
            <span>总容量:3.5GB</span>
        </div>
        <div class="card-ip">
            <div>Public IP:101.200.190.134</div>
            <div>Inner IP:101.200.190.134</div>
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
                <div class="row-network">
                    <span>eth01</span>
                    <span>256.0 B</span>
                    <span>352.0 B</span>
                </div>
                <div class="row-network">
                    <span>eth02</span>
                    <span>256.0 B</span>
                    <span>352.0 B</span>
                </div>
                <div v-cloBtn class="button-close">
                    <Icon type="chevron-up"></Icon>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
export default {
    data () {
        return {
            pieOptions: pieOptions
        }
    },
    components: {
        chart: ECharts
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
    methods: {}
}

const pieOptions = {
    tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
    },
    series: [
        {
            type: 'pie',
            radius: ['50%', '80%'],
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
                { value: 335, name: '已用' },
                { value: 310, name: '未用' }
            ]
        }
    ]
}

</script>
<style lang="less" scoped>
@import '../../styles/index.less';

.@{css-prefix}machine-card {
    .card-title {
        padding: 16px 16px 0 16px;
        .sc(14px, #475669);

        & > span:last-child {
            float: right;
        }
    }

    .card-chart {
        .wh(100%, 165px);

        .data-scale {
            position: relative;
            top: -98px;
            left: 130px;
            font-size: 20px;
            font-weight: 500;
        }
    }

    .card-tooltip {
        padding: 0 30px;
        margin-bottom: 15px;
        .sc(14px, #475669);

        & > span:last-child {
            float: right;
        }

        .tooltip-color {
            display: inline-block;
            position: relative;
            top: 2px;
            height: 14px;
            width: 14px;
            border-radius: 2px;
            background-color: @primary-color;
        }
    }

    .card-ip {
        .wh(100%, 60px);
        border-top: @common-border;
        .sc(13px, #475669);
        padding-left: 16px;

        & > div {
            height: 30px;
            line-height: 30px;
        }

        & > div:last-child {
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
            position: absolute;
            background: #f9fafc;
            width: 298px;
            .sc(13px, #475669);
            line-height: 30px;
            z-index: 10000;
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
                    flex: 2;
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
