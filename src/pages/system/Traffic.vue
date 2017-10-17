<template>
    <div class="bsc-system bsc-traffic">
        <div class="header">
            <div class="search">
                <Select :prepend="true" v-model="searchType" style="width:180px;margin-right:8px;">
                    <Icon slot="prepend" size="18" type="ios-grid-view"></Icon>
                    <Option value="group_id">Group ID</Option>
                    <Option value="node_id">Node ID</Option>
                    <Option value="partition_id">Partition ID</Option>
                </Select>
                <Input v-model="searchValue" :placeholder="'请输入'+ searchType" style="width:260px"></Input>
                <Button type="primary">搜索</Button>
            </div>
            <div class="status">
                <span class="group_status_prefix">group 状态:</span>
                <div class="group_status">
                    <button :class="{statusButtonFocus: tabName === 'group_all'}" @click="tabName = 'group_all'">全部</button>
                    <button :class="{statusButtonFocus: tabName === 'group_status_1'}" @click="tabName = 'group_status_1'">group_status_1</button>
                    <button :class="{statusButtonFocus: tabName === 'group_status_2'}" @click="tabName = 'group_status_2'">group_status_2</button>
                    <button :class="{statusButtonFocus: tabName === 'group_status_3'}" @click="tabName = 'group_status_3'">group_status_3</button>
                    <button :class="{statusButtonFocus: tabName === 'group_status_4'}" @click="tabName = 'group_status_4'">group_status_4</button>
                    <button :class="{statusButtonFocus: tabName === 'group_status_5'}" @click="tabName = 'group_status_5'">group_status_5</button>
                    <button :class="{statusButtonFocus: tabName === 'group_status_6'}" @click="tabName = 'group_status_6'">group_status_6</button>
                    <button :class="{statusButtonFocus: tabName === 'group_status_7'}" @click="tabName = 'group_status_7'">group_status_7</button>
                    <button :class="{statusButtonFocus: tabName === 'group_status_8'}" @click="tabName = 'group_status_8'">group_status_8</button>
                    <button :class="{statusButtonFocus: tabName === 'group_status_9'}" @click="tabName = 'group_status_9'">group_status_9</button>
                    <button :class="{statusButtonFocus: tabName === 'group_status_10'}" @click="tabName = 'group_status_10'">group_status_10</button>
                    <button :class="{statusButtonFocus: tabName === 'group_status_11'}" @click="tabName = 'group_status_11'">group_status_11</button>
                    <button :class="{statusButtonFocus: tabName === 'group_status_12'}" @click="tabName = 'group_status_12'">group_status_12</button>
                </div>
            </div>
        </div>
        <div class="content">
            <Button class="button-refresh" type="ghost">刷新</Button>
            <Table border :context="self" :stripe="true" :columns="listHeader" :data="trafficList" :no-data-text='$t("STORAGE.NO_LIST")'></Table>
            <Page class="page" :total="dataCount" :page-size="pageSize" show-total show-elevator @on-change="changepage"></Page>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            self: this,
            searchType: 'group_id',
            searchValue: '',
            spinShow: true,
            tabName: 'group_all',
            dataCount: 0,
            pageSize: 2,
            trafficList: [],
            ajaxTrafficList: [],
            testData: [{
                move_task_id: '21',
                group_id: '1',
                progress_percent: 10,
                time_used: '08:50:08',
                time_need: '08:50:08',
                group_status: 'dispatch_task',
                source_disk: '10.104.16.170/001',
                target_disk: '10.104.16.170/002'
            }, {
                move_task_id: '03',
                group_id: '2',
                progress_percent: 100,
                time_used: '08:50:06',
                time_need: '08:50:06',
                group_status: 'recovering',
                source_disk: '10.104.16.170/001',
                target_disk: '10.104.16.170/002'
            }, {
                group_id: '3',
                progress_percent: 30
            }, {
                group_id: '4',
                progress_percent: 40
            }, {
                group_id: '5',
                progress_percent: 50
            }],
            listHeader: [{
                title: 'move_task_id',
                key: 'move_task_id',
                width: 100
            }, {
                title: 'group_id',
                key: 'group_id',
                width: 100
            }, {
                title: '进度百分比',
                key: 'progress_percent',
                width: 120,
                sortable: true,
                render: (h, params) => {
                    return h('Progress', {
                        props: {
                            percent: params.row.progress_percent
                        }
                    })
                }
            }, {
                title: '已用时间',
                key: 'time_used',
                width: 100
            }, {
                title: '预计还需时间',
                key: 'time_need',
                width: 100,
                sortable: true
            }, {
                title: 'group状态',
                key: 'group_status',
                width: 100
            }, {
                title: '源磁盘',
                key: 'source_disk',
                width: 120
            }, {
                title: '目标磁盘',
                key: 'target_disk',
                width: 120
            }]
        }
    },
    created () {
        this.getTrafficList()
    },
    methods: {
        getTrafficList () {
            this.ajaxTrafficList = this.testData
            this.dataCount = this.testData.length
            if (this.dataCount < this.pageSize) {
                this.trafficList = this.ajaxTrafficList
            } else {
                this.trafficList = this.ajaxTrafficList.slice(0, this.pageSize)
            }
        },
        changepage (index) {
            let _start = (index - 1) * this.pageSize
            let _end = index * this.pageSize
            this.trafficList = this.ajaxTrafficList.slice(_start, _end)
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
        .page {
            margin: 20px;
            text-align: center;
        }
    }
}
</style>
