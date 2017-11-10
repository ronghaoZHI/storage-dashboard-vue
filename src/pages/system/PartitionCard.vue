<template>
    <div class="bsc-system-card bsc-partition-card" :class="waitingCard">
        <div class="header">
            <Icon  type="android-star" size="16"></Icon>
            <span>{{myData.inn_ips[0]}}:{{myData.partition_path}}</span>
            <Button type="text" size="small" @click="openDetail" v-if="myData.is_del !== 1">{{$t('SYSTEM.DETAILS')}}</Button>
        </div>
        <div class="content">
            <div class="files">
                <div class="progress">
                    <span class="file-count io-count" :class="{redBack: myData.ioutil > 90}">
                        IO : {{myData.ioutil}}%
                    </span><span class="file-count capacity-count" :class="{redBack: myData.used_rate > 99}">{{$t('SYSTEM.CAPACITY')}} : {{myData.used_rate}}%</span>
                    CPU : {{myData.cpu}}%
                </div>
            </div>
            <div class="details">
                <p><span>ID : </span>{{myData.partition_id}}</p>  
                <p><span>IDC : </span>{{myData.idc}}</p>
                <p><span>{{$t('SYSTEM.USED_TOTAL_CAPACITY')}} : </span>{{myData.space}}/{{myData.capacity}}</p>
                <p><span>{{$t('SYSTEM.MEDIA_TYPE')}} : </span>{{myData.media_type}}</p>
                <p><span>{{$t('SYSTEM.IS_NORMAL')}} : </span><span :class="{redFont: !!myData.fail}">{{myData.failFont}}</span></p>
                <p><span>group{{$t('SYSTEM.NUM')}} : </span>{{myData.group_num}}</p>
            </div>
        </div>
        <div class="footer">
            <i-switch size="large" v-model="isWrite" @on-change="usedSet" id="isWrite">
                <span slot="open">{{$t('SYSTEM.WRITABLE')}}</span>
                <span slot="close">{{$t('SYSTEM.READONLY')}}</span>
            </i-switch>
            <div>
                <Button type="ghost" size="small" v-if="!isWrite && myData.group_num !== 0" @click="usedMove">{{$t('SYSTEM.MIGRATE')}}</Button>
                <Button type="ghost" class="delete" size="small" v-if="!isWrite && myData.group_num === 0" @click="usedDeletedConfirm">{{$t('PUBLIC.DELETE')}}</Button>
            </div>
        </div>
        <div class="deleting-content">
            <Spin size="large"></Spin>
            <span v-if="myData.is_del === 1">{{$t('SYSTEM.DELETING')}}</span>
            <span v-else>{{$t('SYSTEM.MIGRATION')}}</span>
        </div>
        <Modal v-model="showDetailModal" :title="$t('SYSTEM.PARTITION_DETAILS')" width="900">
            <detail-modal :titles='modalTitles' :data='modalData' :spinGroup="spinGroup" class="partition-modal"></detail-modal>
        </Modal>
    </div>
</template>
<script>
import detailModal from './detailModal'
import { bytes } from '@/service/bucketService'
import {PARTITION_USED_MOVE, PARTITION_USED_SET, PARTITION_USED_DELETED} from '@/service/API'

export default {
    props: ['data', 'detail', 'spinGroup'],
    data () {
        return {
            isWrite: this.data.readonly === 0,
            showDetailModal: false,
            modalTitles: {subTitle1: this.$t('SYSTEM.BASE_INFO'), subTitle2: this.$t('SYSTEM.GROUP_INFO')},
            waitingCard: this.data.is_del === 1 || !this.data.not_moving ? 'bsc-waiting-card' : '',
            detailHead: [{name: 'ID', value: 'group_id'},
                {name: this.$t('SYSTEM.FILE_NUM'), value: 'num_used'},
                {name: this.$t('SYSTEM.CAPACITY'), value: 'space_used'},
                {name: this.$t('SYSTEM.STATE'), value: 'readonly'},
                {name: this.$t('SYSTEM.CREATION_TIME'), value: 'ts'},
                {name: this.$t('SYSTEM.MIGRATION_PROGRESS'), value: 'traffic_status'}]
        }
    },
    components: {detailModal},
    created () {
    },
    computed: {
        myData: {
            get () {
                let newData = _.cloneDeep(this.data)
                newData.ioutilFont = `${this.data.ioutil}%`
                newData.space = bytes(this.data.space)
                newData.capacity = bytes(this.data.capacity)
                newData.failFont = !!this.data.fail ? this.$t('SYSTEM.FAULT') : this.$t('SYSTEM.NORMAL')
                newData.readonlyFont = this.data.readonly === 1 ? this.$t('SYSTEM.READONLY') : this.$t('SYSTEM.WRITABLE')
                return newData
            },
            set (value) {
                this.update(value)
            }
        },
        modalData () {
            let tableData = _.map(this.detail, (item) => {
                let newItem = _.cloneDeep(item)
                newItem.traffic_status = item.traffic_status || ''
                newItem.readonly = item.readonly === '1' ? this.$t('SYSTEM.WRITABLE') : this.$t('SYSTEM.READONLY')
                return newItem
            })
            let basicInfo = [{name: 'ID', value: this.myData.partition_id},
                {name: 'path', value: this.myData.partition_path},
                {name: 'IDC', value: this.myData.idc},
                {name: 'IP', value: this.myData.inn_ips[0]},
                {name: this.$t('SYSTEM.CAPACITY'), value: this.myData.used_rate},
                {name: 'CPU', value: this.myData.cpu, tooltip: this.$t('SYSTEM.PARTITION_CPU_INFO')},
                {name: this.$t('SYSTEM.MEDIA_TYPE'), value: this.myData.media_type},
                {name: 'IO', value: this.myData.ioutil},
                {name: this.$t('SYSTEM.WRITABLE'), value: this.myData.readonlyFont},
                {name: this.$t('SYSTEM.IS_NORMAL'), value: this.myData.failFont, isRed: this.myData.fail}]
            let detailHead = this.detailHead
            return {tableData, basicInfo, detailHead}
        }
    },
    methods: {
        openDetail () {
            this.$parent.getUsedDetail(this.myData.partition_id)
            this.showDetailModal = true
        },
        async usedSet (newWrite) {
            this.spinShow = true
            this.$Loading.start()
            try {
                let params = {
                    read_only: newWrite ? 0 : 1,
                    partition_id: this.myData.partition_id
                }
                await this.$http.post(PARTITION_USED_SET, params)
                this.spinShow = false
                this.$Loading.finish()
                this.$Message.success(this.$t('SYSTEM.SUCCESS'))
            } catch (error) {
                this.$parent.getUsedList()
                this.spinShow = false
                this.$Loading.error()
                this.$Message.error(this.$t('SYSTEM.FAILURE'))
            }
        },
        async usedMove () {
            this.spinShow = true
            this.$Loading.start()
            try {
                let params = {
                    partition_id: this.myData.partition_id
                }
                await this.$http.post(PARTITION_USED_MOVE, params)
                this.waitingCard = 'bsc-waiting-card'
                this.spinShow = false
                this.$Loading.finish()
                this.$Message.success(this.$t('SYSTEM.SUCCESS'))
            } catch (error) {
                this.spinShow = false
                this.$Loading.error()
                this.$Message.error(this.$t('SYSTEM.FAILURE'))
            }
        },
        usedDeletedConfirm () {
            this.$Modal.confirm({
                content: this.$t('SYSTEM.PARTITION_DELETE_CONFIRM'),
                okText: this.$t('PUBLIC.CONFIRMED'),
                cancelText: this.$t('PUBLIC.CANCLE'),
                onOk: () => this.usedDeleted()
            })
        },
        async usedDeleted () {
            this.spinShow = true
            this.$Loading.start()
            try {
                let params = {
                    partition_id: this.myData.partition_id
                }
                await this.$http.post(PARTITION_USED_DELETED, params)
                this.myData.is_del = 1
                this.waitingCard = 'bsc-waiting-card'
                this.spinShow = false
                this.$Loading.finish()
                this.$Message.success(this.$t('SYSTEM.SUCCESS'))
            } catch (error) {
                this.spinShow = false
                this.$Loading.error()
                this.$Message.error(this.$t('SYSTEM.FAILURE'))
            }
        }

    },
    watch: {
        data: {
            handler (to, from) {
                this.waitingCard = to.is_del === 1 || !to.not_moving ? 'bsc-waiting-card' : ''
                this.isWrite = to.readonly === 0
            },
            deep: true
        }
    }
}
</script>
<style lang="less" scoped>
.@{css-prefix}partition-card{
    position: relative;
    .content {
        .files {
            padding-top:10px;
        }
    }
    .deleting-content {
        width:100%;
        position: absolute;
        top: 36px;
        left: 0;
        bottom: 0;
        background: rgba(255,255,255,0.9);
        color: #000;
        display: none;
        span {
            padding-top:10px;
            color: rgba(100,100,100,0.7);
            font-size: 16px;
        }
    }
}
.@{css-prefix}waiting-card {
    .deleting-content {
        .fb(center,center,flex, column)
    }

}

</style>
