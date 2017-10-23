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
        <Modal v-model="showDetailModal" :title='$t("SYSTEM.DETAILS")' width="900">
            <div class="section-separator">
                <div class="separator-body">
                    <span class="separator-icon"></span>
                    <span class="separator-info" style="font-size: 18px">{{$t('SYSTEM.BASIC_INFO')}}</span>
                </div>
            </div>
            <div class="group">
                <div class="info-title">Group</div>
                <div class="content">
                    <div class="group-item">
                        <span class="separator-icon"></span>Group ID: {{data.group_id}}
                    </div>
                    <div class="group-item">
                        <span class="separator-icon"></span>{{$t('SYSTEM.GROUP_STATUS')}} {{data.readonly === 0 ? $t('SYSTEM.WRITEABLE') : $t('SYSTEM.READ_ONLY')}}
                    </div>
                    <div class="group-item">
                        <span class="separator-icon"></span>{{$t('SYSTEM.FILE_NUMBERS')}}: {{data.num_used}}
                    </div>
                    <div class="group-item">
                        <span class="separator-icon"></span>{{$t('SYSTEM.CAPACITY')}}: 150G
                    </div>
                    <div class="group-item">
                        <span class="separator-icon"></span>{{$t('SYSTEM.CREATE_TIME')}}: {{data.ts}}
                    </div>
                </div>
            </div>
            <div class="group" style="border-top:0">
                <div class="info-title">{{$t('SYSTEM.PARTITION_INFO')}}</div>
                <div class="content">
                    <ul class="partition-title">
                        <li>ID</li>
                        <li>Type</li>
                        <li>IDC</li>
                        <li>IP</li>
                        <li>IO</li>
                        <li>{{$t('SYSTEM.USED_CAPACITY')}}</li>
                        <li>CPU</li>
                        <li>{{$t('SYSTEM.RW_STATUS')}}</li>
                        <li>{{$t('SYSTEM.IS_DEL')}}</li>
                    </ul>
                    <ul class="partition-list" v-for="pt in data.partition" :key="pt.partition_idx">
                        <li>{{pt.partition_id}}</li>
                        <li>{{pt.media_type}}</li>
                        <li>{{pt.idc}}</li>
                        <li>{{pt.inn_ips[0]}}</li>
                        <li>{{pt.ioutil || '-'}}%</li>
                        <li>{{pt.used_rate || '-'}}%</li>
                        <li>{{pt.cpu || '-'}}%</li>
                        <li>{{pt.readonly === 0 ? $t('SYSTEM.WRITEABLE') : $t('SYSTEM.READ_ONLY')}}</li>
                        <li>{{pt.is_del === 0 ? $t('SYSTEM.NORMAL') : $t('SYSTEM.DELETED')}}</li>
                    </ul>
                </div>
            </div>
            <div class="section-separator" style="margin-top:24px;" v-if="data.traffic">
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
export default {
    data () {
        return {
            showDetailModal: false,
            status: this.data.readonly === 0 ? this.$t('SYSTEM.WRITEABLE') : this.$t('SYSTEM.READ_ONLY')
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
        },
        bytes: bytes
    }
}
</script>
<style lang="less" scoped>
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
}



</style>
