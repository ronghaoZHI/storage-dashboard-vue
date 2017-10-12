<template>
    <div class="bsc-group">
        <div class="header">
            <div class="search">
                <Select :prepend="true" v-model="searchType" style="width:180px;margin-right:8px;">
                    <Icon slot="prepend" size="18" type="ios-grid-view"></Icon>
                    <Option value="group_id">Group ID</Option>
                    <Option value="node_id">Node ID</Option>
                    <Option value="partition_id">Partition ID</Option>
                </Select>
                <Input v-model="searchValue" :placeholder="'请输入'+ searchType" style="width:260px"></Input>
                <Button type="primary" @click="getGroupList">搜索</Button>
            </div>
            <div class="status">
                <span class="group-status-prefix">group 状态:</span>
                <button v-bind:class="{statusButtonFocus: read_only === 'None'}" @click="read_only = 'None'">全部(先不要点我哦)</button>
                <button v-bind:class="{statusButtonFocus: read_only === 1}" @click="read_only = 1">只读</button>
                <button v-bind:class="{statusButtonFocus: read_only === 0}" @click="read_only = 0">可写</button>
            </div>
        </div>
        <div class="content">
            <div class="section-chart-tab">
                <button v-bind:class="{buttonFocus: showChart === 0}" @click="tabToggle(0,'capacityLine')">创建时间升序</button>
                <button v-bind:class="{buttonFocus: showChart === 1}" @click="tabToggle(1,'uploadTrafficLine')">CPU</button>
                <button v-bind:class="{buttonFocus: showChart === 2}" @click="tabToggle(2,'downloadTrafficLine')">IO</button>
                <button v-bind:class="{buttonFocus: showChart === 3}" @click="tabToggle(3,'downloadsLine')">容量</button>
                <div class="refresh-section">
                    <span @click="getGroupList"><Icon type="refresh" size="20"></Icon></span>
                </div>
            </div>
            <div class="section-chart">
                <Spin size="bigger" fix v-if="spinShow"></Spin>
                <div class="card-chart" v-show="showChart === 0">
                    <group-card v-for="group in groupList" :key="group.group_id" :data="group"></group-card>
                    <div class="show-more" v-show="nextGroupId !== null" @click="getGroupList(true)">
                        <p>show more</p>
                        <Icon type="chevron-down"></Icon>
                    </div>
                </div>
                <div class="card-chart" v-show="showChart === 1">
                    
                </div>
                <div class="card-chart" v-show="showChart === 2">
                    
                </div>
                <div class="card-chart" v-show="showChart === 3"></div>
                    
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
            showChart: 0,
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
        async getGroupList (isAppend = false) {
            this.spinShow = true
            this.$Loading.start()
            try {
                let groupData = await this.$http.get(GROUP_LIST, { params: {
                    start_group_id: this.searchValue.replace(/\s+/g, '') || this.nextGroupId || 0,
                    [this.searchType]: this.searchValue.replace(/\s+/g, ''),
                    count: this.pageCount,
                    read_only: this.read_only
                }})
                this.nextGroupId = groupData.next_group_id
                this.groupList = isAppend ? this.groupList.concat(groupData.group) : groupData.group
                this.spinShow = false
                this.$Loading.finish()
            } catch (error) {
                this.spinShow = false
                this.$Loading.error()
            }
        }
    },
    watch: {
        'read_only' (to, from) {
            this.start_group_id = 0
            this.searchValue = ''
            this.getGroupList()
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';

@group-common-border: 1px solid #d3dce6;

.@{css-prefix}group {

    .header {
        padding: 0 10px;
        border: @group-common-border;

        .search {
            padding: 12px 0;
            border-bottom: 1px dashed #d3dce6;
        }

        .status {
            padding: 6px 0;

            .group-status-prefix {
                height: 32px;
                line-height: 32px;
                font-size: 12px;
                color: #8492a6;
            }

            & > button {
                padding: 2px 6px;
                margin: 0 6px;
                cursor: pointer;
                background-image: none;
                border: none;
                border-radius: 3px;
                white-space: nowrap;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                font-size: 12px;
                background: #fff;
                color: #475669;
            }

            & > button:focus,
            .statusButtonFocus {
                outline: 0;
                background: @primary-color;
                color: #fff;
            }
        }
    }

    .content {
        margin-top: 16px;

        .section-chart-tab {
            width: 100%;
            height: 40px;
            display: inline-flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            border: @group-common-border;
            border-bottom: 0;

            button {
                flex: 1;
                height: 40px;
                text-align: center;
                vertical-align: middle;
                -ms-touch-action: manipulation;
                touch-action: manipulation;
                cursor: pointer;
                background-image: none;
                border: none;
                border-right: @group-common-border;
                border-bottom: @group-common-border;
                white-space: nowrap;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                font-size: 14px;
                transform: translateZ(0);
                transition: color .2s linear, background-color .2s linear;
                color: #a1acb5;
                background-color: #f9fafc;
            }

            .refresh-section {
                flex: 3;
                height: 40px;
                border-bottom: @group-common-border;
                background-color: #f9fafc;

                span {
                    float: right;
                    margin: 10px 10px 0 0;
                    color: @primary-color;
                    cursor: pointer;
                }
            }

            &>button:nth-last-child(1) {
                border-right: 0;
            }

            button:focus,
            .buttonFocus {
                outline: 0;
                background: #fff;
                border-bottom: 0;
                color: #475669;
            }
        }

        .section-chart {
            margin-top: 1px;
            position: relative;

            .card-chart {
                width: 100%;
                .fb(flex-start, flex-start);
                flex-wrap: wrap;
                padding: 10px;
                border: @group-common-border;
                border-top: 0;
                transition: all .2s ease-in-out;

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
