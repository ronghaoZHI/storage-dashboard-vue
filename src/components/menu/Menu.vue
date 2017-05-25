<template>
    <div class="layout-menu">
        <Menu :active-name="activeName" theme="dark" width="auto" @on-select="goRouter">
            <div class="layout-logo-left">
                <img class="logo-big" src="../../assets/logo.png" height="30px" />
            </div>
            <Menu-item v-for="item in menuList" :name="item.name" :key="item.index">
                <img v-bind:src="item.icon" class="icon-menu" height="15px" />
                <span class="layout-text">{{$t("SIDEBAR."+ item.name.toUpperCase())}}</span>
            </Menu-item>
        </Menu>
    </div>
</template>
<script>
import iconBucket from '../../assets/icon-bucket.png'
import iconDashboard from '../../assets/icon-dashboard.png'
import iconKey from '../../assets/icon-key.png'
export default {
    data () {
        return {
            iconSize: 24,
            activeName: this.$route.meta.ali,
            menuList: ONLINE_USER
        }
    },
    methods: {
        goRouter (link) {
            this.$router.push({ name: link })
        }
    }
}

const bucket = {
    index: 1,
    name: 'bucket',
    icon: iconBucket
}

const dashboard = {
    index: 2,
    name: 'dashboard',
    icon: iconDashboard
}

const keychain = {
    index: 3,
    name: 'keychain',
    icon: iconKey
}
const ONLINE_USER = [bucket, dashboard, keychain]
</script>
<style lang="less" scoped>
@import '../../styles/index.less';

.layout-menu {
    .wh(200px, 100%);
    background: @menu-background;
    position: fixed;
    .ivu-menu-dark {
        background: @menu-background;
    }
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu),
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):hover,
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu),
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu):hover {
        border-left: 4px solid #39f;
        border-right: 0;
        background: @menu-background-active;
        color: #fff;
    }
}

.layout-logo-left {
    .wh(90%,30px);
    border-radius: @common-radius;
    margin: 15px auto;
}

.ivu-col {
    transition: width .2s ease-in-out;
}

.ivu-menu-item {
    border-left: 4px solid #2e373e;
    .fb(left,flex-start);
    width: 100%;
    span {
        margin-left: 5px;
    }
    .icon-menu {
        margin-top: 4px;
        padding-right: 6px;
    }
}
</style>
