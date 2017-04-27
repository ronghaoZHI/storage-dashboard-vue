<template>
    <div class="layout">
        <Row type="flex"
             class="layout-row">
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
import user from '../../store/modules/user'
import headerTop from './Header'
import menuLeft from './Menu'
export default {
    data() {
        return {
            
        }
    },
    components: {headerTop,menuLeft},
    computed: {
        username () {
            return user.state.username
        }
    },
};
</script>

<style lang="less">
.layout {
    height:100%;
}

.layout-row {
    min-height:100%;
    display: inline-flex;
    flex-direction: column;
    .layout-container{
        flex: 1;
    }
}

.flex-box {
    display: flex;
    flex-direction: column;
    text-align: left;
}

.layout-bsc-toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.layout-content {
    flex: 1;
    padding: 15px;
    background: #fff;
    border-radius: 4px;
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
    margin-bottom: 8px;
}

.info-input-error {
    height: 18px;
    display: block;
    margin-top: 6px;
    color: red;
}

/* fix table width bug when toggle menu */

.ivu-table table {
    width: 100% !important;
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
        top: 4px !important;
    }
}

.ivu-modal-close {
    i {
        font-weight: bolder !important;
        color: #fff !important;
    }
}

.ivu-modal-header {
    height: 40px;
    background: #20a0ff;
    padding: 10px 20px !important;
    div {
        color: #fff;
    }
}
.ivu-modal-body{
    padding:8px !important;
}
.ivu-modal-footer {
    border-top: 0 !important;
}
</style>
