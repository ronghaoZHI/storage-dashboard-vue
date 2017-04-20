<template>
    <div class="layout-menu">
        <Menu active-name="bucket"
              theme="dark"
              width="auto"
              @on-select="goRouter">
            <div class="layout-logo-left">
                <img class="logo-big"
                     src="../../assets/logo.png"
                     height="30px" />
            </div>
            <Menu-item name="bucket">
                <img src="../../assets/icon-bucket.png" class="icon-menu" height="15px" />
                <span class="layout-text">My Storage</span>
            </Menu-item>
            <Menu-item name="dashboard">
                <img src="../../assets/icon-dashboard.png" class="icon-menu" height="15px" />
                <span class="layout-text">Dashboard</span>
            </Menu-item>
            <Menu-item name="keychain">
                <img src="../../assets/icon-key.png" class="icon-menu" height="15px" />
                <span class="layout-text">Keychain</span>
            </Menu-item>
        </Menu>
    </div>
</template>
<script>
export default {
    data() {
        return {
            iconSize: 24
        }
    },
    methods: {
        goRouter(link) {
            this.$router.push({ name: link })
        },
    }
}

</script>
<style lang="less" scoped>
.layout-menu {
    width: 200px;
    background: #2e373e;
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
    .icon-menu{
        margin-top: 4px;
        padding-right: 6px;
    }
}
</style>