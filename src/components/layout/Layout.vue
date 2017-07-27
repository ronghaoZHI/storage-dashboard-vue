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



/* fix table width bug when toggle menu */

.ivu-btn-primary {
    background-color: #20a0ff !important;
    border-color: #20a0ff !important;
}

.ivu-btn-primary.disabled,
.ivu-btn-primary.disabled.active,
.ivu-btn-primary.disabled:active,
.ivu-btn-primary.disabled:focus,
.ivu-btn-primary.disabled:hover,
.ivu-btn-primary[disabled],
.ivu-btn-primary[disabled].active,
.ivu-btn-primary[disabled]:active,
.ivu-btn-primary[disabled]:focus,
.ivu-btn-primary[disabled]:hover,
fieldset[disabled] .ivu-btn-primary,
fieldset[disabled] .ivu-btn-primary.active,
fieldset[disabled] .ivu-btn-primary:active,
fieldset[disabled] .ivu-btn-primary:focus,
fieldset[disabled] .ivu-btn-primary:hover {
    background-color: #f7f7f7 !important;
    border-color: #d7dde4 !important;
}

.ivu-table table {
    width: 100% !important;
}

.ivu-table td,
.ivu-table th {
    height: 40px !important;
}

.ivu-checkbox-wrapper {
    margin-right: 0 !important;
}

.ivu-loading-bar-inner-color-primary {
    height: 3px !important;
    background-color: #fff !important;
}

.ivu-input-group-append,
.ivu-input-group-prepend {
    border-radius: 0 !important;
}

.ivu-table-row:hover {
    cursor: pointer;
}

.ivu-modal-content {
    border-radius: 0 !important;
}

.ivu-modal-content {
    .ivu-modal-close {
        right: 20px !important;
        top: 0 !important;
    }
}


.ivu-modal-close {
    i {
        font-weight: bolder !important;
        color: #fff !important;
    }
}

.ivu-modal-header {
    height: 32px;
    background: #20a0ff;
    padding: 6px 20px !important;
    div {
        color: #fff;
    }
}

.ivu-modal-body {
    padding: 20px 20px 8px 20px !important;
}

.ivu-modal-footer {
    background: #f9fafc;
    border-top: 0 !important;
    padding: 6px 18px 6px 18px !important;
    button {
        min-width: 58px;
        padding: 4px 7px !important;
        font-size: 12px !important;
        border-radius: 3px !important;
    }
}

.ivu-modal-confirm-footer {
    min-width: 58px;
    padding: 4px 7px !important;
    font-size: 12px !important;
    border-radius: 3px !important;
}

.clearfix{
    overflow: auto;
    zoom: 1;
}

</style>
