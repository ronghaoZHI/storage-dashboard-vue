<template>
    <div class="bsc-system bsc-group">
        <div class="header-card-wrap">
            <div class="header-card">
                <div>
                    <Icon type="ios-analytics" :size="iconSize" :color="iconColor"></Icon>
                </div>
                <div>
                    <p>group数</p>
                    <p>42个</p>
                </div>
            </div>
            <div class="header-card">
                <div>
                    <Icon type="aperture" :size="iconSize" :color="iconColor"></Icon>
                </div>
                <div>
                    <p>group平均大小</p>
                    <p>10G</p>
                </div>
            </div>
            <div class="header-card">
                <div>
                    <Icon type="filing" :size="iconSize" :color="iconColor"></Icon>
                </div>
                <div>
                    <p>group最大大小</p>
                    <p>60G</p>
                </div>
            </div>
            <div class="header-card">
                <div>
                    <Icon type="soup-can" :size="iconSize" :color="iconColor"></Icon>
                </div>
                <div>
                    <p>group5分位大小</p>
                    <p>871KB</p>
                </div>
            </div>
            <div class="header-card">
                <div>
                    <Icon type="soup-can" :size="iconSize" :color="iconColor"></Icon>
                </div>
                <div>
                    <p>group9分位大小</p>
                    <p>40G</p>
                </div>
            </div>
        </div>
        <div class="header">
            <div class="search" @keyup.enter="getGroupList(false)">
                <Select :prepend="true" v-model="searchType" style="width:180px;margin-right:8px;">
                    <Icon slot="prepend" size="18" type="ios-grid-view"></Icon>
                    <Option value="group_id">Group ID</Option>
                    <Option value="node_ip">Server IP</Option>
                    <Option value="partition_id">Partition ID</Option>
                </Select>
                <Input v-model="searchValue" :placeholder="$t('SYSTEM.PLEASE_ENTER')" style="width:260px"></Input>
                <Button type="primary" @click="getGroupList(false)">{{$t('SYSTEM.SEARCH')}}</Button>
                <Button type="primary" @click="resetParams()">{{$t('PUBLIC.RESET')}}</Button>
                <p class="redFont search-info" v-if="searchValueError">{{$t('SYSTEM.GROUP_ID_SEARCH_INFO')}}</p>
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
                <button v-bind:class="{buttonFocus: showChart === 'group_id'}" @click="tabToggle('group_id')">{{$t('SYSTEM.CREATE_TIME')}} {{$t('SYSTEM.DESCENDINHG_ORDER')}}</button>
                <button v-bind:class="{buttonFocus: showChart === 'cpu'}" @click="tabToggle('cpu')">CPU Load {{$t('SYSTEM.DESCENDINHG_ORDER')}}</button>
                <button v-bind:class="{buttonFocus: showChart === 'ioutil'}" @click="tabToggle('ioutil')">IO {{$t('SYSTEM.DESCENDINHG_ORDER')}}</button>
                <button v-bind:class="{buttonFocus: showChart === 'space'}" @click="tabToggle('space')">{{$t('SYSTEM.CAPACITY_UTILIZATION_RATE')}} {{$t('SYSTEM.DESCENDINHG_ORDER')}}</button>
                <div class="refresh-section">
                    <span @click="getGroupList(false, true)"><Icon type="refresh" size="20"></Icon></span>
                </div>
            </div>
            <div class="section-chart">
                <div class="card-chart">
                    <h1 class="no-data" v-if="groupList.length === 0">No Groups</h1>
                    <group-card v-for="group in groupList" :key="group.group_id" :data="group" :sortBy="showChart"></group-card>
                    <div class="show-more" v-show="nextGroupId !== null && nextGroupId !== undefined " @click="getGroupList(true)">
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
            read_only: 0,
            showChart: 'group_id',
            groupList: [],
            nextGroupId: 0,
            spinShow: true,
            pageCount: 20,
            iconSize: 36,
            iconColor: '#6bbefc'
        }
    },
    created () {
        this.getGroupList()
    },
    computed: {
        searchValueError () {
            return this.searchType === 'group_id' && !!this.searchValue && !parseInt(this.searchValue.replace(/\s+/g, ''))
        }
    },
    components: {
        groupCard
    },
    methods: {
        tabToggle (index, ref) {
            this.showChart = index
        },
        async getGroupList (isAppend = false, cleanParams = false) {
            if (this.searchValueError) {
                this.$Message.warning(this.$t('SYSTEM.GROUP_ID_SEARCH_INFO'))
                return
            }
            try {
                this.spinShow = true
                this.$Loading.start()
                let groupData = await this.$http.get(GROUP_LIST, { params: {
                    start_group_id: isAppend ? this.nextGroupId : this.searchType === 'group_id' && !!this.searchValue ? parseInt(this.searchValue.replace(/\s+/g, '')) : 0,
                    [this.searchType]: this.searchValue.replace(/\s+/g, '') || 'ignore',
                    count: this.pageCount,
                    read_only: this.read_only
                }})
                this.nextGroupId = groupData.next_group_id
                if (groupData.group) {
                    this.addPartitionCountToGroup(groupData.group)
                    this.groupList = isAppend ? this.getSortedGroupList(this.groupList.concat(groupData.group), this.showChart) : this.getSortedGroupList(groupData.group, this.showChart)
                } else {
                    this.groupList = []
                    this.$Message.warning(groupData)
                }
                this.spinShow = false
                this.$Loading.finish()
            } catch (error) {
                console.log(error)
                this.spinShow = false
                this.$Loading.error()
            }
        },
        addPartitionCountToGroup (list) {
            list.forEach(group => {
                group.cpu = 0
                group.ioutil = 0
                group.space = 0
                _.forIn(group.partition, (partition, kes) => {
                    if (partition.cpu > group.cpu) group.cpu = partition.cpu
                    if (partition.ioutil > group.ioutil) group.ioutil = partition.ioutil
                    if (partition.used_rate > group.space) group.space = partition.used_rate
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
        resetParams () {
            this.cleanParams()
            this.searchType = 'group_id'
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
            this.getSortedGroupList(this.groupList, to)
        }
    }
}
</script>
<style lang="less" scoped>
.dark .@{css-prefix}group {
    .header-card-wrap {
        .fb(fast-start, center);
        border-color: @border-color-dark;
        .header-card {
            border-color: @border-color-dark;
            div:last-child {
                p:last-child{
                    color: #ffba42;
                }
            }
        }
        .header-card:last-child {
            border-right: none;
        }
    }
    .header {
        .search {
            border-bottom: @common-border-dark;
        }
    }
    .content {
        .section-chart {
            .card-chart {
                .show-more {
                    color: @text-color-dark;
                    &:hover {
                        border: @common-border-dark;
                    }
                }
            }
        }
    }
}

.@{css-prefix}group {
    .header-card-wrap {
        .fb(fast-start, center);
        width: 100%;
        padding: 15px 0;
        border: @group-common-border;
        margin-bottom: 16px;

        .header-card {
            height: 80px;
            flex: 1;
            border-right: @group-common-border;
            text-align: center;
            padding: 15px;
            .fb(center,center);

            div:first-child {
                text-align: right;
                padding-right: 16px;
            }
            div:last-child {
                text-align: left;

                p:first-child{
                    font-size: 16px;
                    color: #a1acb5;
                }
                p:last-child{
                    font-size: 22px;
                }
            }
        }
        .header-card:last-child {
            border-right: none;
        }
    }
    & > .header {
            .search {
                border-bottom: 1px dashed #d3dce6;
                .search-info{
                    display: inline-block;
                    padding-left: 10px;
                    vertical-align: middle;
                }
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
                    color: @text-color;
                    &:hover {
                        border: @group-common-border;
                    }
                }
            }
        }
    }
}
</style>
