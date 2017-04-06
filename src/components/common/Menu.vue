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
                <Icon type="soup-can-outline"
                      :size="iconSize"></Icon>
                <span class="layout-text">My Storage</span>
            </Menu-item>
            <Menu-item name="dashboard">
                <Icon type="podium"
                      :size="iconSize"></Icon>
                <span class="layout-text">Dashboard</span>
            </Menu-item>
            <Menu-item name="keychain">
                <Icon type="key"
                      class="menu-icon-fix"
                      :size="iconSize"></Icon>
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
    background: #464c5b;
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
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    span {
        margin-left: 5px;
    }
    .menu-icon-fix {
        width: 21px;
    }
}
</style>