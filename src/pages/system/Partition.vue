<template>
    <div class="bsc-system bsc-partition">
        <div class="header">
            <div class="status">
                <span class="group-status-prefix">磁盘状态:</span>
                <button v-bind:class="{statusButtonFocus: tabName === 'used'}" @click="tabName = 'used'">已使用磁盘</button>
                <button v-bind:class="{statusButtonFocus: tabName === 'unused'}" @click="tabName = 'unused'">未使用磁盘</button>
                <button v-bind:class="{statusButtonFocus: tabName === 'deleted'}" @click="tabName = 'deleted'">标删磁盘</button>
            </div>
            <div class="search" v-if="tabName !== 'deleted'">
                <Select :prepend="true" style="width:180px;margin-right:8px;">
                    <Icon slot="prepend" size="18" type="android-person"></Icon>
                    <Option v-for="idc in idcArray" :value="idc.value" :key="idc.value">{{idc.name}}</Option>
                </Select>
                <Select :prepend="true" style="width:180px;margin-right:8px;">
                    <Icon slot="prepend" size="18" type="soup-can"></Icon>
                    <Option v-for="idc in typeArray" :value="idc.value" :key="idc.value">{{idc.name}}</Option>
                </Select>
                <Select :prepend="true" style="width:180px;margin-right:8px;" v-if="tabName === 'used'">
                    <Icon slot="prepend" size="18" type="compose"></Icon>
                    <Option v-for="idc in statusArray" :value="idc.value" :key="idc.value">{{idc.name}}</Option>
                </Select>
                <Select :prepend="true" style="width:180px;margin-right:8px;" v-if="tabName === 'used'">
                    <Icon slot="prepend" size="18" type="android-radio-button-on"></Icon>
                    <Option v-for="idc in faultArray" :value="idc.value" :key="idc.value">{{idc.name}}</Option>
                </Select>
                <Input v-model="searchValue" placeholder="请输入服务器IP" style="width:260px"></Input>
                <Button type="primary" @click="getPartitionList" v-if="tabName === 'used'">搜索</Button>
            </div>
            <div class="search search-unused" v-if="tabName === 'unused'">
                整体容量：100T
                <span class="title">总量</span>
                <InputNumber :max="10" :min="0" v-model="value1"></InputNumber>
                <span>T</span><span class="separate">—</span> 
                <InputNumber :max="10" :min="0" v-model="value1"></InputNumber>
                <span>T</span>
                <span class="title">可用</span>
                <InputNumber :max="10" :min="0" v-model="value1"></InputNumber>
                <span>T</span><span class="separate">—</span> 
                <InputNumber :max="10" :min="0" v-model="value1"></InputNumber>
                <span>T</span>
                <Button type="primary" @click="getPartitionList" class="search-button">搜索</Button>
            </div>
        </div>
        <partition-used v-if="tabName === 'used'"></partition-used>
        <partition-unused v-if="tabName === 'unused'"></partition-unused>
        <partition-deleted v-if="tabName === 'deleted'"></partition-deleted>
        <!-- <partition-card ></partition-card> -->
    </div>
</template>
<script>
import partitionUsed from './PartitionUsed'
import partitionUnused from './partitionUnused'
import partitionDeleted from './partitionDeleted'
import partitionCard from './PartitionCard'
export default {
    data () {
        return {
            tabName: 'used',
            idcArray: [{name: '所有IDC', value: 'all'}, {name: 'xp.zhang', value: 'xp.zhang'}],
            typeArray: [{name: '所有类型磁盘', value: 'all'}, {name: 'SATA', value: 'SATA'}, {name: 'SSD', value: 'SSD'}],
            statusArray: [{name: '所有读写状态', value: 'all'}, {name: '只读', value: 'read'}, {name: '可写', value: 'write'}],
            faultArray: [{name: '所有故障状态', value: 'all'}, {name: '正常', value: 'normal'}, {name: '故障', value: 'fault'}],
            searchValue: ''
        }
    },
    created () {
    },
    components: {
        partitionUsed, partitionUnused, partitionDeleted, partitionCard
    },
    methods: {
        tabToggle (index, ref) {
            this.tabName = index
        },
        getPartitionList () {
        }
    },
    watch: {
    }
}
</script>
<style lang="less" scoped>
.@{css-prefix}partition {
    .header {
        .search {
            border-top: 1px dashed #d3dce6;
        }
        .search-unused{
            border-top: 1px dashed #d3dce6;
            span{
                padding-left: 5px;
            }
            span.separate{
                padding: 0 8px
            }
            span.title{
                margin-left: 20px;
                padding: 0 5px;
            }
            .search-button{
                margin-left:20px;
            }
        }
    }
}
</style>
