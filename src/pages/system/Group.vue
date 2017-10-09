<template>
    <div class="bsc-group">
        <div class="header">
            <div class="search">
                <Select :prepend="true" v-model="searchType" style="width:180px;margin-right:8px;">
                    <Icon slot="prepend" size="18" type="ios-grid-view"></Icon>
                    <Option value="ddd">222</Option>
                </Select>
                <Select :prepend="true" v-model="searchType" style="width:360px;">
                    <Icon slot="prepend" size="18" type="ios-search-strong"></Icon>
                    <Option value="ddd">222</Option>
                </Select>
                <Button type="primary">搜索</Button>
            </div>
            <div class="status">
                <span class="group-status-prefix">group 状态:</span>
                <Button type="text" size="small">全部</Button>
                <Button type="primary" size="small">只读</Button>
                <Button type="text" size="small">可写</Button>
            </div>
        </div>
        <div class="content"></div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            searchType: 'ddd',
            statue: 'all'
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';

.@{css-prefix}group {
    width: 100%;
    padding: 0 10px;
    border: 1px solid #d3dce6;

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
</style>
