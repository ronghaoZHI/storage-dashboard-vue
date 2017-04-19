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
    position: relative;
    overflow: hidden;
    height: 100%;
}

.layout-row {
    height: 100%;
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
    height: 100%;
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
    min-height: 200px;
    margin: 15px;
    overflow: hidden;
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

/* fix table width bug when toggle menu */

.ivu-table table {
    width: 100% !important;
}
</style>
