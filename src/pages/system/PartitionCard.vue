<template>
    <div class="bsc-system-card bsc-partition-card">
        <div class="header">
            <Icon  type="android-star" size="16"></Icon>
            <span>{{basicInfomodel.inn_ips[0]}}:{{basicInfomodel.path}}</span>
            <Button type="text" size="small" @click="showDetailModal=true">详细信息</Button>
        </div>
        <div class="content">
            <div class="files">
                <div class="progress">
                    <span class="file-count io-count">
                        IO:{{basicInfomodel.ioutil}}
                    </span><span class="file-count capacity-count">容量:{{basicInfomodel.space_rate}}</span>
                    CPU: {{basicInfomodel.cpu}}
                </div>
            </div>
            <div class="details">
                <p><span>ID : </span>{{basicInfomodel.partition_id}}</p>
                <p><span>IDC : </span>{{basicInfomodel.idc}}</p>
                <p class="half"><span>类型 : </span>{{basicInfomodel.media_type}}</p>
                <p class="half"><span>已用／总容量 : </span>{{basicInfomodel.space_used}}</p>
                <p class="half"><span>可用 : </span>{{basicInfomodel.fail === '1' ? '可用' : '故障'}}</p>
                <p class="half"><span>group个数 : </span>{{basicInfomodel.group.length}}</p>
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
        <Modal v-model="showDetailModal" title='使用磁盘详细信息' width="900">
            <detail-modal :titles='modalTitles' :data='modalData' class="partition-modal"></detail-modal>
        </Modal>
    </div>
</template>
<script>
import detailModal from './detailModal'
export default {
    data () {
        return {
            showDetailModal: false,
            basicInfomodel: basicInfomodel,
            modalTitles: {subTitle1: '磁盘基础信息', subTitle2: '对应group信息'}
        }
    },
    components: {detailModal},
    computed: {
        modalData () {
            let tableData = _.map(basicInfomodel.group, (item) => {
                let newItem = _.cloneDeep(item)
                newItem.traffic_status = item.traffic_status || ''
                newItem.readonly = item.readonly === '1' ? '可写' : '只读'
                newItem.fail = newItem.fail === '1' ? '可用' : '故障'
                return newItem
            })
            let basicInfo = [{name: 'ID', value: basicInfomodel.partition_id},
                {name: 'path', value: basicInfomodel.path},
                {name: 'IDC', value: basicInfomodel.idc},
                {name: 'IP', value: basicInfomodel.inn_ips[0]},
                {name: '容量', value: basicInfomodel.space_rate},
                {name: 'CPU', value: basicInfomodel.cpu},
                {name: '类型', value: basicInfomodel.media_type},
                {name: 'IO', value: basicInfomodel.ioutil},
                {name: '读写', value: basicInfomodel.readonly},
                {name: '可用', value: basicInfomodel.fail}]
            return {tableData, basicInfo, detailHead}
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
const detailHead = [{name: 'ID', value: 'group_id'},
    {name: '文件数', value: 'num_used'},
    {name: '容量', value: 'space_used'},
    {name: '状态', value: 'fail'},
    {name: '创建时间', value: 'ts'},
    {name: '迁移进度', value: 'traffic_status'}]
const groupsInfo = [{
    num_used: '9',
    readonly: '1',
    group_id: '19',
    space_used: '194.6K',
    ts: '2017-04-24 13:05:12',
    traffic_status: 50}, {
    num_used: '9',
    readonly: '0',
    group_id: '19',
    space_used: '194.6K',
    ts: '2017-04-24 13:05:12',
    traffic_status: 50}]
const basicInfomodel = {ips: ['172.17.199.191'],
    fail: 1,
    pub_ips: [],
    partition_id: 'bc0fe57900014001915800163e30b328',
    path: '/s2/drive/002',
    inn_ips: ['172.17.199.191'],
    readonly: 0,
    node_id: '00163e30b328',
    idc_type: 'center',
    media_type: 'ATA',
    idc: '.shijiazhuang.xunjie',
    space_used: '50T／100T',
    space_rate: '20',
    ioutil: 0.68,
    cpu: 0.68,
    group: groupsInfo}
</script>
<style lang="less" scoped>
.@{css-prefix}partition-card{
    .content {
        .files {
            padding-top:10px;
        }
    }
}
</style>
