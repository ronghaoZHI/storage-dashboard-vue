<template>
    <div class="bsc-group-card">
        <div class="header">
            <Icon  type="android-star" size="16"></Icon>
            <span>{{data.group_id}}</span>
            <Button type="text" size="small" @click="showDetailModal=true">详细信息</Button>
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
                    <li>{{Math.round(pt.cpu * 100) / 100}}</li>
                    <li><span class="ip-button">迁移</span></li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <span>{{status}}</span>
            <Button type="ghost" size="small">设置为只读</Button>
        </div>
        <Modal v-model="showDetailModal" title='详细信息' width="900">
            <div class="section-separator">
                <div class="separator-body">
                    <span class="separator-icon"></span>
                    <span class="separator-info" style="font-size: 18px">基础信息</span>
                </div>
            </div>
            <div class="group">
                <div class="info-title">group 信息</div>
                <div class="content">
                    <div class="group-item">
                        <span class="separator-icon"></span>Group ID: {{data.group_id}}
                    </div>
                    <div class="group-item">
                        <span class="separator-icon"></span>状态： {{status}}
                    </div>
                    <div class="group-item">
                        <span class="separator-icon"></span>文件数: {{data.num_used}}
                    </div>
                    <div class="group-item">
                        <span class="separator-icon"></span>容量: 150G
                    </div>
                    <div class="group-item">
                        <span class="separator-icon"></span>创建时间: {{data.ts}}
                    </div>
                </div>
            </div>
            <div class="group" style="border-top:0">
                <div class="info-title">对应磁盘信息</div>
                <div class="content">
                    <ul class="partition-title">
                        <li>ID</li>
                        <li>类型</li>
                        <li>IDC</li>
                        <li>IP</li>
                        <li>IO</li>
                        <li>容量</li>
                        <li>CPU</li>
                        <li>读写状态</li>
                        <li>可用状态</li>
                    </ul>
                    <ul class="partition-list" v-for="pt in data.partition" :key="pt.partition_idx">
                        <li>{{pt.partition_id}}</li>
                        <li>{{pt.media_type}}</li>
                        <li>{{pt.idc}}</li>
                        <li>{{pt.inn_ips[0]}}</li>
                        <li>{{Math.floor(pt.ioutil * 100)}}%</li>
                        <li>{{Math.floor(pt.space * 100)}}%</li>
                        <li>{{Math.round(pt.cpu * 100) / 100}}</li>
                        <li>{{status}}</li>
                        <li>{{isUse}}</li>
                    </ul>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
    data () {
        return {
            showDetailModal: false,
            status: this.data.readonly === 0 ? '可写' : '只读',
            isUse: this.data.is_del === 0 ? '正常' : '删除'
        }
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

    .header {
        i  {
            color: #00a854;
        }

        .i-not-ok {
            color: #f85959;
        }

        button {
            position: relative;
            float: right;
            top: 5px;
            color: @primary-color;
        }
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

.group {
    border: @group-common-border;
    padding: 0 10px 10px 10px;

    .info-title {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        color: #475669;
        border-bottom: 1px solid #e5e9f2;
    }

    .content {
        margin-top: 12px;

        .group-item {
            display: inline-block;
            width: 49%;
            margin-bottom: 16px;
            height: 14px;
            line-height: 14px;
            font-size: 14px;

            .separator-icon {
                display: inline-block;
                position: relative;
                top: 2px;
                width: 3px;
                height: 14px;
                background: #20a0ff;
                margin-right: 4px;
            }
        }

        .partition-title,
        .partition-list {
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
                width: 240px;
            }

            li:nth-child(3),
            li:nth-child(4){
                width: 115px;
            }

            li:nth-child(2),
            li:nth-child(5),
            li:nth-child(6),
            li:nth-child(7),
            li:nth-child(8),
            li:nth-child(9) {
                width: 53px;
            }
        }

        .partition-title {
            background: #f9fafc;
        }

        .partition-list {
            border-top: 0;
        }
    }
}


</style>
