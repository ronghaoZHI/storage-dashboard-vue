<template>
    <div class="bsc-system bsc-traffic">
        <div class="header">
            <div class="search">
                <Select :prepend="true" v-model="searchType" style="width:180px;margin-right:8px;">
                    <Icon slot="prepend" size="18" type="ios-grid-view"></Icon>
                    <Option value="group_id">Group ID</Option>
                    <Option value="server_ip">Server IP</Option>
                    <Option value="partition_id">Partition ID</Option>
                </Select>
                <Input v-model="searchValue" :placeholder="$t('SYSTEM.PLEASE_ENTER') + searchType" style="width:260px"></Input>
                <Button type="primary" @click="getFilterTrafficList(true)">{{$t('SYSTEM.SEARCH')}}</Button>
            </div>
            <div class="status">
                <span class="group_status_prefix">{{$t('SYSTEM.GROUP_STATUS')}} :</span>
                <div class="group_status">
                    <button :class="{statusButtonFocus: tabName === 'group_all'}" @click="tabName = 'group_all'; getFilterTrafficList()">{{$t('SYSTEM.ALL')}}</button>
                    <button :class="{statusButtonFocus: tabName === 'preparing to move'}" @click="tabName = 'preparing to move'; getFilterTrafficList()">preparing to move</button>
                    <button :class="{statusButtonFocus: tabName === 'moving'}" @click="tabName = 'moving'; getFilterTrafficList()">moving</button>
                    <button :class="{statusButtonFocus: tabName === 'remove_task'}" @click="tabName = 'remove_task'; getFilterTrafficList()">remove_task</button>
                </div>
            </div>
        </div>
        <div class="content">
            <Spin size="bigger" fix v-if="spinShow"></Spin>
            <Button class="button-refresh" type="ghost" @click="refresh()">{{$t('SYSTEM.REFRESH')}}</Button>
            <Table border :context="self" :stripe="true" :columns="listHeader" :data="trafficList" :no-data-text='$t("STORAGE.NO_LIST")'></Table>
        </div>
    </div>
</template>
<script>
import { TRAFFIC_LIST } from '@/service/API'
export default {
    data () {
        return {
            self: this,
            searchType: 'group_id',
            searchValue: '',
            spinShow: true,
            tabName: 'group_all',
            trafficListAll: [],
            trafficList: [],
            listHeader: [{
                title: 'Group ID',
                key: 'group_id',
                width: 100
            }, {
                title: this.$t('SYSTEM.PROGRESS'),
                key: 'process_percent',
                width: 150,
                sortable: true,
                render: (h, params) => {
                    return h('Progress', {
                        props: {
                            percent: params.row.process_percent
                        }
                    })
                }
            }, {
                title: this.$t('SYSTEM.TIME_SPENT'),
                key: 'spent_time',
                width: 150
            }, {
                title: this.$t('SYSTEM.REMAINING_TIME'),
                key: 'left_time',
                width: 150,
                sortable: true,
                sortMethod: (a, b, type) => a.length !== b.length ? (type === 'asc' ? a.length - b.length : b.length - a.length) : (type === 'asc' ? (a > b ? 1 : -1) : (a < b ? 1 : -1))
            }, {
                title: this.$t('SYSTEM.GROUP_STATUS'),
                key: 'group_status',
                width: 140
            }, {
                title: this.$t('SYSTEM.SOURCE_DISK'),
                key: 'source_disk',
                width: 260,
                render: (h, params) => {
                    return h('Tooltip', {
                        props: {
                            content: `${params.row.source_disk[0]}/${params.row.source_disk[1]}`,
                            placement: 'top-end'
                        }
                    }, params.row.source_disk[2])
                }
            }, {
                title: this.$t('SYSTEM.TARGET_DISK'),
                key: 'target_disk',
                width: 260,
                render: (h, params) => {
                    return h('Tooltip', {
                        props: {
                            content: `${params.row.target_disk[0]}/${params.row.target_disk[1]}`,
                            placement: 'top-end'
                        }
                    }, params.row.target_disk[2])
                }
            }]
        }
    },
    created () {
        this.getTrafficList()
    },
    methods: {
        async getTrafficList (isRefresh = false) {
            this.spinShow = true
            this.$Loading.start()
            try {
                let trafficData = await this.$http.get(TRAFFIC_LIST)
                this.trafficListAll = this.convert2Front(trafficData)
                if (!isRefresh) this.trafficList = this.trafficListAll
                this.spinShow = false
                this.$Loading.finish()
            } catch (error) {
                this.spinShow = false
                this.$Loading.error()
            }
        },
        convert2Front (data) {
            let frontList = []
            _.forEach(data, (value, key) => {
                const frontItem = {
                    group_id: key,
                    process_percent: value.process,
                    spent_time: value.spent_time,
                    left_time: value.left_time,
                    group_status: value.step,
                    source_disk: [value.src_node_ip[0], value.src_partition_idx, value.src_partition_id],
                    target_disk: [value.target_node_ip[0], value.target_partition_idx, value.target_partition_id]
                }
                frontList.push(frontItem)
            })
            return frontList
        },
        getFilterTrafficList (isSearch = false) {
            if (isSearch) this.tabName = 'group_all'
            let _trafficList = this.searchType === 'group_id' ? this.trafficListAll.filter(value => value.group_id >= this.searchValue) : this.searchValue ? this.trafficListAll.filter(value => this.searchType === 'server_ip' ? value.source_disk[0] === this.searchValue : value.source_disk[2] === this.searchValue) : this.trafficListAll
            this.trafficList = this.tabName === 'group_all' ? _trafficList : _trafficList.filter(value => value.group_status === this.tabName)
        },
        async refresh () {
            await this.getTrafficList(true)
            this.getFilterTrafficList()
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';

.@{css-prefix}traffic {
    .header {
        .search {
            border-bottom: 1px dashed #d3dce6;
        }
        .group_status_prefix {
            float: left;
            height: 42px;
            line-height: 42px;
        }
        .group_status {
            display: flex;
            flex-wrap: wrap;
            button {
                padding: 0px 15px;
                margin: 5px 15px;
                height: 32px;
                border: 0;
                background-color: white;
                color: #475669;
                border-radius: 4px;
                &:hover {
                    cursor: pointer;
                    background-color: #eff2fc;
                }
                &:focus {
                    outline: 0;
                }
            }
            button.statusButtonFocus {
                outline: 0;
                background: @primary-color;
                color: #fff;
            }
        }
    }
    .content {
        border-top: 1px solid #d3dce6;
        padding-top: 8px;
        .button-refresh {
            float: right;
        }
        .bsc-table-wrapper {
            top: 8px;
            clear: both;
        }
    }
}
</style>
