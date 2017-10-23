<template>
    <div class="bsc-idc-card">
        <div class="header">
            <span>IDC : </span>
        </div>
        <!--SATA & SSD-->
        <div class="content two-type" v-if="type === 'two'">
            <div class="idc-circel idc-content-left">
                <i-circle :percent="80" :size="80">
                    <span class="circle-inner">SATA</span>
                </i-circle>
                <div class="idc-detail">
                    <p>SATA磁盘</p>
                    <p>容量使用率 ：80%</p>
                    <p>已用／总容量 ：80T/100T</p>
                </div>
            </div>
            <div class="idc-circel idc-content-right">
                <i-circle :percent="80" :size="80" stroke-color='#FFDE29'>
                    <span class="circle-inner">SSD</span>
                </i-circle>
                <div class="idc-detail">
                    <p>SSD磁盘</p>
                    <p>容量使用率 ：80%</p>
                    <p>已用／总容量 ：80T/100T</p>
                </div>
            </div>
        </div>
        <!--SATA or SSD-->
        <div class="content one-type" v-else>
            <div class="idc-circel idc-content-left">
                <i-circle :percent="80" :size="80">
                    <span class="circle-inner">SATA</span>
                </i-circle>
            </div>
            <div class="idc-detail idc-content-right">
                <p>SATA磁盘</p>
                <p>容量使用率 ：80%</p>
                <p>已用／总容量 ：80T/100T</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['type']
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';
@border-color: #d3dce6;
.@{css-prefix}idc-card {
    display: inline-block;
    width: 320px;
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
            padding: 16px 8PX;
            p{
                line-height: 20px;
            }
        }
        &.two-type {
            .idc-circel{
                position: relative;
                width: 50%;
                .idc-detail{
                    height: 92px;
                    box-sizing: border-box;
                    background: rgba(255,255,255,0.95);
                    position: absolute;
                    white-space: nowrap;
                    top: 0;
                    opacity: 0;
                    z-index: 1;
                    overflow: hidden;
                    transition: opacity 1s ease-out;
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
                opacity: 0.95;
            }
        }
        &.one-type {
            .idc-content-left{
                width: 45%;
            }
            .idc-content-right{
                width: 55%;
            }
        }
    }
    
}
</style>
