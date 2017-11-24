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
                    <span class="file-count">{{$t('SYSTEM.FILE_NUMBERS')}}: {{thousands(data.num_used)}}</span>
                    {{$t('SYSTEM.USED_CAPACITY')}}: {{bytes(data.space_used)}}
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
                    <li v-bind:class="{'redFont': pt.used_rate > 99}">{{pt.used_rate}}%</li>
                    <li v-bind:class="{'redFont': pt.ioutil > 90}">{{pt.ioutil}}%</li>
                    <li v-bind:class="{'redFont': pt.cpu > 20}">{{pt.cpu.toFixed(2)}}%</li>
                    <li v-if="data.traffic && pt.partition_id === data.traffic.src_partition_id[0]">{{$t('SYSTEM.MIGRATION')}}</li>
                    <li v-else><span class="ip-button" @click="migrate(pt,index)">{{$t('SYSTEM.MIGRATE')}}</span></li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <span>{{data.readonly === 0 ? $t('SYSTEM.WRITEABLE') : $t('SYSTEM.READ_ONLY')}}</span>
            <Button v-show="this.data.readonly === 0" type="ghost" size="small" @click="setReadOnly">{{$t('SYSTEM.SET_READ_ONLY')}}</Button>
        </div>
        <Modal v-model="showDetailModal" :title='$t("SYSTEM.DETAILS")' width="970">
            <detail-modal :titles='modalTitles' :data='modalData' class="group-modal"></detail-modal>
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
            <div slot="footer">
                <Button type="primary" @click="showDetailModal = false">{{$t('PUBLIC.CLOSE')}}</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { GROUP_MOVE, GROUP_READ_ONLY } from '@/service/API'
import { bytes, thousands } from '@/service/bucketService'
import detailModal from './detailModal'
export default {
    data () {
        return {
            showDetailModal: false,
            status: this.data.readonly === 0 ? this.$t('SYSTEM.WRITEABLE') : this.$t('SYSTEM.READ_ONLY'),
            modalTitles: { groupTitle: this.$t('SYSTEM.GROUP_INFO_TITLE'), partitionTitle: this.$t('SYSTEM.PARTITION_INFO') },
            detailHead: [
                {name: 'Partition ID', value: 'partition_id'},
                {name: this.$t('SYSTEM.MEDIA_TYPE'), value: 'media_type'},
                {name: 'IDC', value: 'idc'},
                {name: 'IP', value: 'inn_ips'},
                {name: 'IO', value: 'ioutil'},
                {name: this.$t('SYSTEM.CAPACITY'), value: 'space'},
                {name: 'CPU', value: 'cpu'},
                {name: this.$t('SYSTEM.RW_STATUS'), value: 'status'},
                {name: this.$t('SYSTEM.IS_DEL'), value: 'isUse'}
            ]
        }
    },
    components: { detailModal },
    props: ['data'],
    computed: {
        modalData () {
            let tableData = _.map(this.data.partition, (item) => {
                let newItem = _.cloneDeep(item)
                newItem.inn_ips = item.inn_ips[0]
                newItem.ioutil = `${item.ioutil}%`
                newItem.space = `${item.used_rate}%`
                newItem.cpu = `${(Math.round(item.cpu * 100) / 100).toFixed(2) || 0}%`
                newItem.status = item.readonly === 0 ? this.$t('SYSTEM.WRITEABLE') : this.$t('SYSTEM.READ_ONLY')
                newItem.isUse = item.is_del === 0 ? this.$t('SYSTEM.NORMAL') : this.$t('SYSTEM.DELETED')
                return newItem
            })
            let basicInfo = [{name: 'Group ID', value: this.data.group_id},
                {name: this.$t('SYSTEM.GROUP_STATUS'), value: this.data.readonly === 0 ? this.$t('SYSTEM.WRITEABLE') : this.$t('SYSTEM.READ_ONLY')},
                {name: this.$t('SYSTEM.FILE_NUMBERS'), value: thousands(this.data.num_used)},
                {name: this.$t('SYSTEM.USED_CAPACITY'), value: bytes(this.data.space_used)},
                {name: this.$t('SYSTEM.CREATE_TIME'), value: this.data.ts}]
            return {
                tableData,
                basicInfo,
                detailHead: this.detailHead
            }
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
                this.status = this.$t('SYSTEM.READ_ONLY')
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
            }
        },
        bytes: bytes,
        thousands: thousands
    }
}
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
                    width: 90px;
                    text-align: left;
                }

                li:nth-child(2) {
                    width: 55px;
                }

                li:nth-child(3),li:nth-child(4) {
                    width: 50px;
                }
                li:nth-child(5) {
                    width: 58px;
                }
            }

            .ip-title {
                background: #f9fafc;
                text-align: center;
            }

            .ip-list {
                text-align: right;
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
