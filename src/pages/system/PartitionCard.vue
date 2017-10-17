<template>
    <div class="bsc-system-card bsc-partition-card">
        <div class="header">
            <Icon  type="android-star" size="16"></Icon>
            <span></span>
            <Button type="text" size="small" @click="showDetailModal=true">详细信息</Button>
        </div>
        <div class="content">
            <div class="files">
                <div class="progress">
                    <span class="file-count io-count">
                        IO:90%
                    </span><span class="file-count capacity-count">容量:1%</span>
                    CPU: 800
                </div>
            </div>
            <div class="details">
                <p><span>ID:</span>:ofkofjij304567</p>
                <p><span>IDC:</span>:xp.zhang</p>
                <p class="half"><span>类型:</span>SSD</p>
                <p class="half"><span>已用／总容量:</span>:5T/8T</p>
                <p class="half"><span>状态:</span>:正常</p>
                <p class="half"><span>group个数:</span>:100</p>
            </div>
        </div>
        <div class="footer">
            <i-switch size="large">
                <span slot="open">可写</span>
                <span slot="close">只读</span>
            </i-switch>
            <div>
                <Button type="ghost" size="small">迁移</Button>
                <Button type="ghost" class="delete" size="small">删除</Button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'partition-card',
    data () {
        return {
            showDetailModal: false
        }
    },
    created () {
        this.test()
    },
    methods: {
        test () {
            console.log('fidfaofh')
        }
    }
}
</script>
<style lang="less" scoped>


.@{css-prefix}partition-card{
    .content{
        // margin-bottom:6px;
        .files{
            .progress{
                .io-count{
                    width:33%;
                }
                .capacity-count{
                    width:33%;
                    background: #e5e9f2;
                    color: @text-color;
                }
            }
        }
        .details{
            padding: 10px;
            p{
                font-size: 14px;
                line-height:35px;
                span{
                    color: #8492a6;
                }
            }
            p.half{
                display:inline-block;
                width:calc(50% - 10px);
            }
        }
        
    }
    .footer{
        .delete{
            color: #fff;
            background-color:#f85959;
            border-color: #f85959;
        }
    }
}


</style>
