<template>
    <div class="bsc-system-card bsc-group-card">
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
                <ul class="ip-list" v-for="(pt,index) in data.partition" :key="pt.partition_idx">
                    <li>{{pt.inn_ips[0]}}/{{pt.partition_idx}}</li>
                    <li>{{Math.floor(pt.space * 100)}}%</li>
                    <li>{{Math.floor(pt.ioutil * 100)}}%</li>
                    <li>{{Math.round(pt.cpu * 100) / 100}}</li>
                    <li v-if="data.traffic && pt.partition_id === data.traffic[0].src_partition_ids[0]">迁移中</li>
                    <li v-else><span class="ip-button" @click="migrate(pt,index)">迁移</span></li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <span>{{data.readonly === 0 ? '可写' : '只读'}}</span>
            <Button v-show="this.data.readonly === 0" type="ghost" size="small" @click="setReadOnly">设置为只读</Button>
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
                        <span class="separator-icon"></span>状态： {{data.readonly === 0 ? '可写' : '只读'}}
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
                        <li>{{data.readonly === 0 ? '可写' : '只读'}}</li>
                        <li>{{isUse}}</li>
                    </ul>
                </div>
            </div>
            <div class="section-separator" style="margin-top:24px;" v-if="data.traffic && data.traffic.length >= 0">
                <div class="separator-body">
                    <span class="separator-icon"></span>
                    <span class="separator-info" style="font-size: 18px">迁移信息</span>
                </div>
            </div>
            <div class="group" v-if="data.traffic && data.traffic.length >= 0">
                <div class="content">
                    <div class="group-item">
                        <span class="separator-icon"></span>Partition: {{data.traffic[0].src_partition_ids[0]}}
                    </div>
                    <div class="group-item">
                        <span class="separator-icon"></span>目标 Partition: {{data.traffic[0].target_partition_id}}
                    </div>
                    <div class="group-item">
                        <span class="separator-icon"></span>迁移进度: {{data.traffic[0].process}}%
                    </div>
                    <div class="group-item">
                        <span class="separator-icon"></span>已进行时间: {{data.traffic[0].spent_time}}
                    </div>
                    <div class="group-item">
                        <span class="separator-icon"></span>移动速度: {{data.traffic[0].speed}}/S
                    </div>
                    <div class="group-item">
                        <span class="separator-icon"></span>剩余完成时间: {{data.traffic[0].left_time}}
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
import { GROUP_MOVE, GROUP_READ_ONLY } from '@/service/API'
export default {
    data () {
        return {
            showDetailModal: false,
            status: this.data.readonly === 0 ? '可写' : '只读',
            isUse: this.data.is_del === 0 ? '正常' : '删除'
        }
    },
    props: ['data'],
    methods: {
        async migrate (partition, index) {
            try {
                this.$Loading.start()
                await this.$http.post(GROUP_MOVE, {
                    group_id: this.data.group_id,
                    src_partition_id: partition.partition_id
                })
                this.data.partition[0].readonly = 1
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
            }
        },
        async setReadOnly () {
            try {
                this.$Loading.start()
                await this.$http.post(GROUP_READ_ONLY, {
                    group_id: this.data.group_id
                })
                this.data.readonly = 1
                this.status = '只读'
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
            }
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';


.@{css-prefix}group-card {
    .content {
        .files {
            .progress {
                .file-count {
                    width: 50%;
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
                    display: block;
                    float: left;

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

                li:nth-child(2),li:nth-child(3),li:nth-child(4) {
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
}



</style>
