<template>
    <div class="bsc-system bsc-group">
        <div class="header">
            <div class="search">
                <Select :prepend="true" v-model="searchType" style="width:180px;margin-right:8px;">
                    <Icon slot="prepend" size="18" type="ios-grid-view"></Icon>
                    <Option value="group_id">Group ID</Option>
                    <Option value="node_ip">Node IP</Option>
                    <Option value="partition_id">Partition ID</Option>
                </Select>
                <Input v-model="searchValue" :placeholder="$t('SYSTEM.PLEASE_ENTER')+ searchType" style="width:260px"></Input>
                <Button type="primary" @click="getGroupList(false)">{{$t('SYSTEM.SEARCH')}}</Button>
            </div>
            <div class="status">
                <span class="group-status-prefix">{{$t('SYSTEM.GROUP_STATUS')}}:</span>
                <button v-bind:class="{statusButtonFocus: read_only === 0}" @click="read_only = 0">{{$t('SYSTEM.WRITEABLE')}}</button>
                <button v-bind:class="{statusButtonFocus: read_only === 1}" @click="read_only = 1">{{$t('SYSTEM.READ_ONLY')}}</button>
                <button v-bind:class="{statusButtonFocus: read_only === 'ignore'}" @click="read_only = 'ignore'">{{$t('SYSTEM.ALL')}}</button>
            </div>
        </div>
        <div class="content">
            <Spin size="bigger" fix v-if="spinShow"></Spin>
            <div class="section-chart-tab">
                <button v-bind:class="{buttonFocus: showChart === 'group_id'}" @click="tabToggle('group_id')">{{$t('SYSTEM.CREATE_TIME')}}</button>
                <button v-bind:class="{buttonFocus: showChart === 'cpu'}" @click="tabToggle('cpu')">CPU</button>
                <button v-bind:class="{buttonFocus: showChart === 'ioutil'}" @click="tabToggle('ioutil')">IO</button>
                <button v-bind:class="{buttonFocus: showChart === 'space'}" @click="tabToggle('space')">Capacity</button>
                <div class="refresh-section">
                    <span @click="getGroupList(false, true)"><Icon type="refresh" size="20"></Icon></span>
                </div>
            </div>
            <div class="section-chart">
                <div class="card-chart">
                    <group-card v-for="group in groupList" :key="group.group_id" :data="group" :sortBy="showChart"></group-card>
                    <div class="show-more" v-show="nextGroupId !== null" @click="getGroupList(true)">
                        <p>show more</p>
                        <Icon type="chevron-down"></Icon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { GROUP_LIST } from '@/service/API'
import groupCard from './GroupCard'
export default {
    data () {
        return {
            searchType: 'group_id',
            searchValue: '',
            read_only: 'ignore',
            showChart: 'group_id',
            groupList: [],
            nextGroupId: 0,
            spinShow: true,
            pageCount: 20
        }
    },
    created () {
        this.getGroupList()
    },
    components: {
        groupCard
    },
    methods: {
        tabToggle (index, ref) {
            this.showChart = index
        },
        async getGroupList (isAppend = false, cleanParams = false) {
            this.spinShow = true
            this.$Loading.start()
            try {
                let groupData = await this.$http.get(GROUP_LIST, { params: {
                    start_group_id: this.searchType === 'group_id' ? this.searchValue.replace(/\s+/g, '') || this.nextGroupId || 0 : 0,
                    [this.searchType]: this.searchValue.replace(/\s+/g, ''),
                    count: this.pageCount,
                    read_only: this.read_only
                }})
                this.nextGroupId = groupData.next_group_id
                this.addPartitionCountToGroup(groupData.group)
                this.groupList = isAppend ? this.getSortedGroupList(this.groupList.concat(groupData.group), this.showChart) : this.getSortedGroupList(groupData.group, this.showChart)
                this.spinShow = false
                this.$Loading.finish()
            } catch (error) {
                this.spinShow = false
                this.$Loading.error()
            }
        },
        addPartitionCountToGroup (list) {
            list.forEach(group => {
                group.cpu = 0
                group.ioutil = 0
                group.space = 0
                group.partition.length > 0 && group.partition.forEach(partition => {
                    if (partition.cpu > group.cpu) group.cpu = partition.cpu
                    if (partition.ioutil > group.ioutil) group.ioutil = partition.ioutil
                    if (partition.space > group.space) group.space = partition.space
                })
            })
        },
        getSortedGroupList (list, sortBy) {
            return list.length > 0 && list.sort((a, b) => {
                if (sortBy === 'group_id') {
                    return a.group_id - b.group_id
                } else {
                    return b[sortBy] - a[sortBy]
                }
            })
        },
        cleanParams () {
            this.nextGroupId = 0
            this.start_group_id = 0
            this.searchValue = ''
        }
    },
    watch: {
        'read_only' (to, from) {
            this.cleanParams()
            this.getGroupList(false, true)
        },
        'showChart' (to, from) {
            this.cleanParams()
            this.getSortedGroupList(this.groupList, to)
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';

.@{css-prefix}group {
    .header {
        .search {
            border-bottom: 1px dashed #d3dce6;
        }
    }
    .content {
        .section-chart {
            .card-chart {
                .show-more {
                    width: 250px;
                    height: 180px;
                    line-height: 30px;
                    padding-top: 60px;
                    font-size: 24px;
                    text-align: center;
                    cursor: pointer;
                    margin: 60px;
                    font-weight: bold;

                    &:hover {
                        border: @group-common-border;
                    }
                }
            }
        }
    }
}
</style>
