<template>
    <div class="bsc-group-card">
        <div class="header">
            <Icon type="android-star" size="16"></Icon>
            <span>{{data.group_id}}</span>
        </div>
        <div class="content">
            <div class="files">
                <span>创建时间: {{data.ts}}</span>
                <div class="progress">
                    <span class="file-count">文件个数: {{data.num_used}}个</span>
                    容量: 150G
                </div>
            </div>
            <div class="ip">
                <ul class="ip-title">
                    <li>IP/编号</li>
                    <li>容量</li>
                    <li>IO</li>
                    <li>CPU</li>
                    <li>操作</li>
                </ul>
                <ul class="ip-list" v-for="pt in data.partition" :key="pt.partition_idx">
                    <li>{{pt.inn_ips[0]}}/{{pt.partition_idx}}</li>
                    <li>{{Math.floor(pt.space * 100)}}%</li>
                    <li>{{Math.floor(pt.ioutil * 100)}}%</li>
                    <li>{{Math.floor(pt.cpu * 100)}}</li>
                    <li><span class="ip-button">移除</span></li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <Button v-if="data.readonly === 1" type="ghost" size="small">可写(设置只读)</Button>
            <span v-else>只读</span>
            <Button type="ghost" size="small">详细信息</Button>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {}
    },
    props: ['data']
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';
@group-common-border: 1px solid #d3dce6;

.@{css-prefix}group-card {
    width: 350px;
    border: @group-common-border;
    margin: 10px;

    .header, .footer {
        height: 36px;
        line-height: 36px;
        padding: 0 10px;
        background: #f9fafc;
        border-bottom: @group-common-border;
    }

    .content {

        .files {
            padding: 0 10px;
            padding-bottom: 10px;
            border-bottom: @group-common-border;

            & > span {
                display: block;
                position: relative;
                padding: 10px 0 6px;
            }

            .progress {
                height: 24px;
                background-color: #eff3f7;

                .file-count {
                    width: 50%;
                    display: inline-block;
                    height: 24px;
                    line-height: 24px;
                    color: #fff;
                    font-weight: bold;
                    background: #6bbefc;
                    padding: 0 4px;
                }
            }
        }

        .ip {
            padding: 10px;

            .ip-title,.ip-list {
                height: 30px;
                line-height: 30px;
                padding: 0 10px;
                border: @group-common-border;

                li {
                    display: inline-block;

                    .ip-button {
                        color: @primary-color;
                        cursor: pointer;

                        &:hover {
                            color: #7ec2f3;
                        }
                    }
                }

                li:nth-child(1) {
                    width: 110px;
                }

                li:nth-child(2),li:nth-child(3), li:nth-child(4) {
                    width: 50px;
                }
            }

            .ip-title {
                background: #f9fafc;
            }

            .ip-list {
                border-top: 0; 
            }
        }
    }

    .footer {
        width: 100%;
        .fb(space-between,center);
        border-top: @group-common-border;
        border-bottom: 0;

        button:nth-child(1) {
            background: #fff;
        }
    }
}
</style>
