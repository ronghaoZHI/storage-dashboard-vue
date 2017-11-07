<template>
    <div class="bsc-system-card bsc-group-card">
        <div class ="header">
            <Icon  type="android-star" size="16"></Icon>
            <span>{{data.group_id}}</span>
            <Button type="text" size="small" @click="showDetailModal=true">{{$t('SYSTEM.DETAILS')}}</Button>
        </div>
        <div class="content">
            <div class="files">
                <span>{{$t('SYSTEM.CREATE_TIME')}}: {{data.ts}}</span>
                <div class="progress">
                    <span class="file-count">{{$t('SYSTEM.FILE_NUMBERS')}}: {{data.num_used}}</span>
                    {{$t('SYSTEM.CAPACITY')}}: 150G
                </div>
            </div>
            <div class="ip">
                <ul class="ip-title">
                    <li>IP</li>
                    <li>{{$t('SYSTEM.USED_CAPACITY')}}</li>
                    <li>IO</li>
                    <li>CPU</li>
                    <li>Handle</li>
                </ul>
                <ul class="ip-list" v-for="(pt,index) in data.partition" :key="pt.partition_idx">
                    <li>{{pt.inn_ips[0]}}</li>
                    <li>{{pt.used_rate || '-'}}%</li>
                    <li>{{pt.ioutil || '-'}}%</li>
                    <li>{{pt.cpu || '-'}}%</li>
                    <li v-if="data.traffic && pt.partition_id === data.traffic.src_partition_id[0]">{{$t('SYSTEM.MIGRATION')}}</li>
                    <li v-else><span class="ip-button" @click="migrate(pt,index)">{{$t('SYSTEM.MIGRATE')}}</span></li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <span>{{data.readonly === 0 ? $t('SYSTEM.WRITEABLE') : $t('SYSTEM.READ_ONLY')}}</span>
            <Button v-show="this.data.readonly === 0" type="ghost" size="small" @click="setReadOnly">{{$t('SYSTEM.SET_READ_ONLY')}}</Button>
        </div>
        <Modal v-model="showDetailModal" title='详细信息' width="900">
            <detail-modal :titles='modalTitles' :data='modalData' class="group-modal"></detail-modal>
            <div class="section-separator" style="margin-top:24px;" v-if="data.traffic && data.traffic.length >= 0">
                <div class="separator-body">
                    <span class="separator-icon"></span>
                    <span class="separator-info" style="font-size: 18px">{{$t('SYSTEM.MIGRATION')}}</span>
                </div>
            </div>
            <div class="group" v-if="data.traffic">
                <div class="content">
                    <div class="group-item">
                        <span class="separator-icon"></span>Partition: {{data.traffic.src_partition_id[0]}}
                    </div>
                    <div class="group-item">
                        <span class="separator-icon"></span>Target partition: {{data.traffic.target_partition_id}}
                    </div>
                    <div class="group-item">
                        <span class="separator-icon"></span>{{$t('SYSTEM.MIGRATION')}}: {{data.traffic.process}}%
                    </div>
                    <div class="group-item">
                        <span class="separator-icon"></span>{{$t('SYSTEM.TIME_SPENT')}}: {{data.traffic.spent_time}}
                    </div>
                    <div class="group-item">
                        <span class="separator-icon"></span>Speed: {{bytes(data.traffic.speed)}}/S
                    </div>
                    <div class="group-item">
                        <span class="separator-icon"></span>{{$t('SYSTEM.REMAINING_TIME')}}: {{data.traffic.left_time}}
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
import { GROUP_MOVE, GROUP_READ_ONLY } from '@/service/API'
import { bytes } from '@/service/bucketService'
import detailModal from './detailModal'
export default {
    data () {
        return {
            showDetailModal: false,
            status: this.data.readonly === 0 ? this.$t('SYSTEM.WRITEABLE') : this.$t('SYSTEM.READ_ONLY'),
            isUse: this.data.is_del === 0 ? '正常' : '删除',
            modalTitles: {subTitle1: 'group 信息', subTitle2: '对应磁盘信息'}
        }
    },
    components: {detailModal},
    props: ['data'],
    computed: {
        modalData () {
            let tableData = _.map(this.data.partition, (item) => {
                let newItem = _.cloneDeep(item)
                newItem.inn_ips = item.inn_ips[0]
                newItem.ioutil = `${Math.floor(item.ioutil * 100)}%`
                newItem.space = `${Math.floor(item.space * 100)}%`
                newItem.cpu = Math.round(item.cpu * 100) / 100
                newItem.status = this.data.readonly === 0 ? '可写' : '只读'
                newItem.isUse = this.isUse
                return newItem
            })
            let basicInfo = [{name: 'Group ID', value: this.data.group_id},
                {name: '状态', value: this.data.readonly === 0 ? '可写' : '只读'},
                {name: '文件数', value: this.data.num_used},
                {name: '容量', value: '150G'},
                {name: '创建时间', value: this.data.ts}]
            return {tableData, basicInfo, detailHead}
        }
    },
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
        },
        bytes: bytes
    }
}
const detailHead = [{name: 'ID', value: 'partition_id'},
    {name: '类型', value: 'media_type'},
    {name: 'IDC', value: 'idc'},
    {name: 'IP', value: 'inn_ips'},
    {name: 'IO', value: 'ioutil'},
    {name: '容量', value: 'space'},
    {name: 'CPU', value: 'cpu'},
    {name: '读写状态', value: 'status'},
    {name: '可用状态', value: 'isUse'}]
</script>
<style lang="less" scoped>
.dark .@{css-prefix}group-card {
    .header {
        color: @text-color-dark;
    }

    .content {
        color: @text-color-dark;
        .ip {
            .ip-title,.ip-list {
                border: @common-border-dark;
                color: @text-color-dark;
                li {
                    .ip-button {
                        color: @primary-color;

                        &:hover {
                            color: #7ec2f3;
                        }
                    }
                }
            }

            .ip-title {
                background: @secondary-color-dark;
            }
        }
    }

    .footer {
        color: @text-color-dark;
    }
}

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
                    width: 95px;
                }

                li:nth-child(2),li:nth-child(3),li:nth-child(4) {
                    width: 50px;
                }
                li:nth-child(5) {
                    width: 58px;
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
        button:nth-child(1) {
            background: #fff;
        }
    }
}

</style>
