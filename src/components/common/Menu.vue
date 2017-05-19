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
import iconMachine from '../../assets/icon-machine.png'
import iconPartition from '../../assets/icon-partition.png'
import user from '@/store/modules/user'
export default {
    data() {
        return {
            iconSize: 24,
            activeName: this.$route.meta.ali,
            menuList: user.state.type === 'normal' ? ONLINE_USER : ONLINE_ADMIN,
        }
    },
    methods: {
        goRouter(link) {
            this.$router.push({ name: link })
        },
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

const machine = {
    index: 4,
    name: 'machine',
    icon: iconMachine
}

const partition = {
    index: 5,
    name: 'partition',
    icon: iconPartition
}
const ONLINE_USER = [bucket, dashboard, keychain]
const ONLINE_ADMIN = [bucket, dashboard, keychain, machine, partition]
const OFFLINE_USER = [bucket, keychain]
</script>
<style lang="less" scoped>
.layout-menu {
    width: 200px;
    background: #2e373e;
    position: fixed;
    height: 100%;
    .ivu-menu-dark {
        background: #2e373e;
    }
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu),
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):hover,
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu),
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu):hover {
        border-left: 4px solid #39f;
        border-right: 0;
        background: #3a434b;
        color: #fff;
    }
}

.layout-logo-left {
    width: 90%;
    height: 30px;
    border-radius: 3px;
    margin: 15px auto;
}

.layout-ceiling-main a {
    color: #9ba7b5;
}

.ivu-col {
    transition: width .2s ease-in-out;
}

.ivu-menu-item {
    border-left: 4px solid #2e373e;
    display: inline-flex;
    flex-direction: row;
    justify-content: left;
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