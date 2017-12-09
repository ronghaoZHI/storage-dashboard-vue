<template>
    <div class="bsc-idc-card">
        <div class="header">
            <span>IDC : {{info.idc}}</span>
        </div>
        <!--SATA & SSD-->
        <div class="content two-type" v-if="type === 'all'">
            <div class="idc-circel idc-content-left">
                <i-circle :percent="info.SATA.used_rate || 0" :size="80" :stroke-width="9" :trail-width="8">
                    <span class="circle-inner">SATA</span>
                </i-circle>
                <div class="idc-detail">
                    <p>SATA {{$t('SYSTEM.PARTITION')}}</p>
                    <p>{{$t('SYSTEM.CAPACITY_UTILIZATION_RATE')}} ：{{info.SATA.used_rateFront}}</p>
                    <p>{{$t('SYSTEM.USED_TOTAL_CAPACITY')}} ：{{info.SATA.used}}/{{info.SATA.capacity}}</p>
                </div>
            </div>
            <div class="idc-circel idc-content-right">
                <i-circle :percent="info.SSD.used_rate || 0" :size="80" stroke-color='#FFDE29' :stroke-width="9" :trail-width="8">
                    <span class="circle-inner">SSD</span>
                </i-circle>
                <div class="idc-detail">
                    <p>SSD {{$t('SYSTEM.PARTITION')}}</p>
                    <p>{{$t('SYSTEM.CAPACITY_UTILIZATION_RATE')}} ：{{info.SSD.used_rateFront}}</p>
                    <p>{{$t('SYSTEM.USED_TOTAL_CAPACITY')}} ：{{info.SSD.used}}/{{info.SSD.capacity}}</p>
                </div>
            </div>
        </div>
        <!-- SATA -->
        <div class="content one-type" v-else-if="type === 'SATA'">
            <div class="idc-circel idc-content-left">
                <i-circle :percent="info.SATA.used_rate || 0" :size="80" :stroke-width="9" :trail-width="8">
                    <span class="circle-inner">SATA</span>
                </i-circle>
            </div>
            <div class="idc-detail idc-content-right">
                <p>SATA {{$t('SYSTEM.PARTITION')}}</p>
                <p>{{$t('SYSTEM.CAPACITY_UTILIZATION_RATE')}} ：{{info.SATA.used_rateFront}}</p>
                <p>{{$t('SYSTEM.USED_TOTAL_CAPACITY')}} ：{{info.SATA.used}}/{{info.SATA.capacity}}</p>
            </div>
        </div>
        <!-- SSD -->
        <div class="content one-type" v-else-if="type === 'SSD'">
            <div class="idc-circel idc-content-left">
                <i-circle :percent="info.SSD.used_rate || 0" :size="80" stroke-color='#FFDE29'  :stroke-width="9" :trail-width="8">
                    <span class="circle-inner">SSD</span>
                </i-circle>
            </div>
            <div class="idc-detail idc-content-right">
                <p>SSD {{$t('SYSTEM.PARTITION')}}</p>
                <p>{{$t('SYSTEM.CAPACITY_UTILIZATION_RATE')}} ：{{info.SSD.used_rateFront}}</p>
                <p>{{$t('SYSTEM.USED_TOTAL_CAPACITY')}} ：{{info.SSD.used}}/{{info.SSD.capacity}}</p>
            </div>
        </div>
    </div>
</template>
<script>
import { bytes } from '@/service/bucketService'
export default {
    props: ['data'],
    computed: {
        info () {
            let newData = _.cloneDeep(this.data)
            newData.SSD.used = bytes(this.data.SSD.used)
            newData.SSD.capacity = bytes(this.data.SSD.capacity)
            newData.SSD.used_rateFront = this.data.SSD.used_rate || this.data.SSD.used_rate === 0 ? `${this.data.SSD.used_rate}%` : '-'
            newData.SATA.used = bytes(this.data.SATA.used)
            newData.SATA.capacity = bytes(this.data.SATA.capacity)
            newData.SATA.used_rateFront = this.data.SATA.used_rate || this.data.SATA.used_rate === 0 ? `${this.data.SATA.used_rate}%` : '-'
            return newData
        },
        type () {
            if (this.data.SATA.capacity === 0) {
                return 'SSD'
            } else if (this.data.SSD.capacity === 0) {
                return 'SATA'
            }
            return 'all'
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';
@border-color: #d3dce6;
.@{css-prefix}idc-card {
    display: inline-block;
    border: 1px solid @border-color;
    margin: 0 20px 16px 0;
    .header {
        height: 36px;
        line-height: 36px;
        padding: 0 10px;
        background: #f9fafc;
        border-bottom: 1px solid @border-color;
    }
    .content{
        padding: 16px 0;
        width: 100%;
        .fb(space-between,center);

        .idc-circel{
            padding: 6px;
            .fb(center,center);
            .circle-inner{
                font-size: 14px
            }
        }
        .idc-detail{
            .fb(space-around,flex-start,inline-flex,column);
            font-size: 12px;
            padding: 8PX;
            p{
                line-height: 20px;
            }
        }
        &.two-type {
            width: 400px;
            .idc-circel{
                position: relative;
                width: 50%;
                .idc-detail{
                    height: 0;
                    padding-top: 0;
                    padding-bottom: 0;
                    box-sizing: border-box;
                    background: rgba(255,255,255,0.95);
                    position: absolute;
                    white-space: nowrap;
                    top: 0;
                    opacity: 1;
                    z-index: 1;
                    overflow: hidden;
                    transition: height 0.5s ease-out, padding 0.5s ease-out;
                }
            }
            .idc-content-left{
                box-sizing: border-box;
                border-right: 1px solid @border-color;
                .idc-detail{
                    width: 100%;
                    left: calc(100% + 1px);
                }
            }
            .idc-content-right{
                .idc-detail{
                    left: -100%;
                    width: calc(100% - 1px);;
                }
            }
            .idc-circel:hover .idc-detail{
                height: 96px;
                padding-top: 8px;
                padding-bottom: 8px;
            }
        }
        &.one-type {
            width: 330px;
            .idc-content-left{
                width: 38%;
            }
            .idc-content-right{
                width: 62%;
            }
        }
    }
    
}
.dark{
    .@{css-prefix}idc-card {
        border-color: @border-color-dark;
        color: @text-color-dark;
        .header {
            background: #414e55;
            border-bottom: 1px solid #52626d;
        }
        .content{
            &.two-type {
                .idc-content-left{
                    border-color: @border-color-dark;
                }
                .idc-circel{
                    .idc-detail{
                        background-color: rgba(71,86,105,0.95);
                    }
                }
            }
        }
    }
}
</style>
