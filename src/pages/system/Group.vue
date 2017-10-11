<template>
    <div class="bsc-group">
        <div class="header">
            <div class="search">
                <Select :prepend="true" v-model="searchType" style="width:180px;margin-right:8px;">
                    <Icon slot="prepend" size="18" type="ios-grid-view"></Icon>
                    <Option value="group_id">group_id</Option>
                    <Option value="node_id">node_id</Option>
                    <Option value="partition_id">partition_id</Option>
                </Select>
                <Input v-model="searchValue" :placeholder="'请输入'+ searchType" style="width:260px"></Input>
                <Button type="primary">搜索</Button>
            </div>
            <div class="status">
                <span class="group-status-prefix">group 状态:</span>
                <Button type="text" size="small">全部</Button>
                <Button type="primary" size="small">只读</Button>
                <Button type="text" size="small">可写</Button>
            </div>
        </div>
        <div class="content">
            <div class="section-chart-tab">
                <button v-bind:class="{buttonFocus: showChart === 0}" @click="tabToggle(0,'capacityLine')">创建时间升序</button>
                <button v-bind:class="{buttonFocus: showChart === 1}" @click="tabToggle(1,'uploadTrafficLine')">CPU</button>
                <button v-bind:class="{buttonFocus: showChart === 2}" @click="tabToggle(2,'downloadTrafficLine')">IO</button>
                <button v-bind:class="{buttonFocus: showChart === 3}" @click="tabToggle(3,'downloadsLine')">容量</button>
                <div class="refresh-section">
                    <Icon type="refresh" size="20"></Icon>
                </div>
            </div>
            <div class="section-chart">
                <div class="card-chart" v-show="showChart === 0">
                    <group-card v-for="group in groupList" :key="group.group_id" :data="group"></group-card>
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
            statue: 'all',
            showChart: 0,
            groupList: []
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
        async getGroupList () {
            this.spinShow = true
            this.$Loading.start()
            try {
                let groupData = await this.$http.get(GROUP_LIST, {params: {
                    start_group_id: 0,
                    count: 20
                }})
                this.groupList = groupData.group.reverse()
                this.spinShow = false
                this.$Loading.finish()
            } catch (error) {
                this.spinShow = false
                this.$Loading.error()
            }
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
                margin: 0 4px;
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

                i {
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

        .card-chart {
            width: 100%;
            .fb(flex-start, flex-start);
            flex-wrap: wrap;
            padding: 10px;
            border: @group-common-border;
            border-top: 0;
            transition: all .2s ease-in-out;
        }
    }
}
</style>
