<template>
    <div class="layout">
        <Row type="flex" class="layout-row">
            <menu-left></menu-left>
            <div class="layout-container">
                <div class="flex-box">
                    <header-top :username='username'></header-top>
                    <div class="layout-content">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </Row>
    </div>
</template>
<script>
import user from '@/store/modules/user'
import headerTop from '../header'
import menuLeft from '../menu'
export default {
    data () {
        return {}
    },
    components: { headerTop, menuLeft },
    computed: {
        username () {
            return user.state.username
        }
    }
}
</script>

<style lang="less">
@import '../../styles/index.less';

.layout {
    height: 100%;
}

.layout-row {
    min-height: 100%;
    .layout-container {
        flex: 1;
        margin-left: @layout-margin-left;
    }
}

.flex-box {
    .ff(flex);
    text-align: left;
}

.layout-bsc-toolbar {
    .fb(space-between,center,flex);
    margin-bottom: 14px;
}

.layout-content {
    flex: 1;
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    margin-top: 60px;
}

.layout-content-main {
    padding: 10px;
}

.layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
}

.layout-text {
    display: inline-block;
    line-height: 24px
}

.toolbar-nav {
    margin-bottom: 14px;
}

.section-separator {
    width: 100%;
    height: 16px;
    display: inline-flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .separator-body {
        display: inline-flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        .separator-icon {
            display: inline-block;
            .wh(3px,16px);
            background: #20a0ff;
            margin-top: 3px;
            margin-right: 8px;
        }
        .separator-info {
            .sc(16px,#657180);
        }
    }
    
}

.info-input-error {
    height: 18px;
    display: block;
    margin-top: 6px;
    color: red;
}

.table-permission {
    width: 100%;
    margin-bottom: 34px;
    .sc(14px,#475669);
    background-color: #fff;
    border: 1px solid #e5e9f2;
    border-collapse: collapse;
}

.table-permission th {
    white-space: nowrap;
    overflow: hidden;
    background-color: #eff2f7;
    font-weight: normal
}

.table-permission tr {
    border-bottom: 1px solid #e5e9f2;
}

.table-permission tbody tr:nth-last-child(1) {
    border-bottom: none;
}

.table-permission td,
.table-permission th {
    min-width: 0;
    height: 40px;
    text-align: left;
    text-overflow: ellipsis;
    vertical-align: middle;
    padding-left: 10px;
    overflow: hidden;
    white-space: normal;
    word-break: break-all;
    word-wrap: normal;
    border-bottom: none;
}

.clearfix{
    overflow: auto;
    zoom: 1;
}

</style>
