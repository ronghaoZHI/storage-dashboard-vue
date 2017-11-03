<template>
    <div class="bsc-system-card bsc-partition-card" :class="waitingCard">
        <div class="header">
            <Icon  type="android-star" size="16"></Icon>
            <span>{{myData.inn_ips[0]}}:{{myData.partition_path}}</span>
            <Button type="text" size="small" @click="showDetailModal=true" v-if="myData.is_del !== 1">详细信息</Button>
        </div>
        <div class="content">
            <div class="files">
                <div class="progress">
                    <span class="file-count io-count" :class="{redBack: myData.ioutil > 90}">
                        IO : {{myData.ioutil}}
                    </span><span class="file-count capacity-count" :class="{redBack: myData.used_rate > 99}">容量 : {{myData.used_rate}}%</span>
                    CPU : {{myData.cpu}}
                </div>
            </div>
            <div class="details">
                <p><span>ID : </span>{{myData.partition_id}}</p>
                <p><span>IDC : </span>{{myData.idc}}</p>
                <p><span>已用／总容量 : </span>{{myData.used}}/{{myData.capacity}}</p>
                <p><span>类型 : </span>{{myData.media_type}}</p>
                <p><span>可用 : </span><span :class="{redFont: !!myData.fail}">{{myData.failFont}}</span></p>
                <p><span>group个数 : </span>{{myData.group.length}}</p>
            </div>
        </div>
        <div class="footer">
            <i-switch size="large" v-model="isWrite" @on-change="usedSet" id="isWrite">
                <span slot="open">可写</span>
                <span slot="close">只读</span>
            </i-switch>{{isWrite}}
            <div>
                <Button type="ghost" size="small" v-if="!isWrite && myData.group.length !== 0 && !isTraffic" @click="usedMove">迁移</Button>
                <Button type="ghost" class="delete" size="small" v-if="!isWrite && myData.group.length === 0" @click="usedDeletedConfirm">删除</Button>
            </div>
        </div>
        <div class="deleting-content">
            <Spin size="large"></Spin>
            <span v-if="myData.is_del === 1">正在删除</span>
            <span v-else>正在迁移</span>
        </div>
        <Modal v-model="showDetailModal" title='使用磁盘详细信息' width="900">
            <detail-modal :titles='modalTitles' :data='modalData' class="partition-modal"></detail-modal>
        </Modal>
    </div>
</template>
<script>
import detailModal from './detailModal'
import { bytes } from '@/service/bucketService'
import {PARTITION_USED_MOVE, PARTITION_USED_SET, PARTITION_USED_DELETED} from '@/service/API'

export default {
    props: ['data'],
    data () {
        return {
            isWrite: this.data.readonly === 0,
            showDetailModal: false,
            modalTitles: {subTitle1: '磁盘基础信息', subTitle2: '对应group信息'},
            isTraffic: this.trafficComputed(),
            waitingCard: ''
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
                newData.used = bytes(this.data.used)
                newData.capacity = bytes(this.data.capacity)
                newData.failFont = !!this.data.fail ? '故障' : '可用'
                newData.readonlyFont = this.data.readonly === 1 ? '只读' : '可写'
                return newData
            },
            set (value) {
                this.update(value)
            }
        },
        modalData () {
            let tableData = _.map(this.myData.group, (item) => {
                let newItem = _.cloneDeep(item)
                newItem.traffic_status = item.traffic_status || ''
                newItem.readonly = item.readonly === '1' ? '可写' : '只读'
                return newItem
            })
            let basicInfo = [{name: 'ID', value: this.myData.partition_id},
                {name: 'path', value: this.myData.partition_path},
                {name: 'IDC', value: this.myData.idc},
                {name: 'IP', value: this.myData.inn_ips[0]},
                {name: '容量', value: this.myData.used_rate},
                {name: 'CPU', value: this.myData.cpu, tooltip: '磁盘所在服务器的CPU'},
                {name: '类型', value: this.myData.media_type},
                {name: 'IO', value: this.myData.ioutil},
                {name: '读写', value: this.myData.readonlyFont},
                {name: '可用', value: this.myData.failFont, isRed: this.myData.fail}]
            return {tableData, basicInfo, detailHead}
        }
    },
    methods: {
        trafficComputed () {
            return this.data.group.length !== 0 && this.data.group.every(item => {
                return item.traffic_status
            })
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
                this.$Message.success('设置成功')
            } catch (error) {
                this.$parent.getUsedList()
                this.spinShow = false
                this.$Loading.error()
                this.$Message.error('设置失败')
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
                this.isTraffic = true
                this.waitingCard = 'bsc-waiting-card'
                this.spinShow = false
                this.$Loading.finish()
                this.$Message.success('设置成功')
            } catch (error) {
                this.spinShow = false
                this.$Loading.error()
                this.$Message.error('设置失败')
            }
        },
        usedDeletedConfirm () {
            this.$Modal.confirm({
                content: '确定要删除磁盘么',
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
                this.$Message.success('设置成功')
            } catch (error) {
                this.spinShow = false
                this.$Loading.error()
                this.$Message.error('设置失败')
            }
        }

    },
    watch: {
        data: {
            handler (to, from) {
                this.waitingCard = waitingComputed(to)
                this.isWrite = to.readonly === 0
            },
            deep: true
        }
    }
}
const waitingComputed = (data) => {
    let flg = false
    if (data.is_del === 1) {
        return 'bsc-waiting-card'
    }
    if (data.group.length !== 0) {
        flg = data.group.every(item => {
            return !!item.traffic_status
        })
    }
    return flg ? 'bsc-waiting-card' : ''
}
const detailHead = [{name: 'ID', value: 'group_id'},
    {name: '文件数', value: 'num_used'},
    {name: '容量', value: 'space_used'},
    {name: '状态', value: 'readonly'},
    {name: '创建时间', value: 'ts'},
    {name: '迁移进度', value: 'traffic_status'}]
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
