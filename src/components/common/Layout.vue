<template>
    <div class="layout">
        <Row type="flex"
             class="layout-row">
            <div class="layout-menu">
                <Menu active-name="bucket"
                      theme="dark"
                      width="auto"
                      @on-select="goRouter">
                    <div class="layout-logo-left">
                        <img class="logo-big"
                             src="../../assets/logo.png"
                             height="30px" />
                        <img class="logo-samll"
                             src="../../assets/logo-small.png"
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
            <div class="layout-container">
                <div class="flex-box">
                    <div class="layout-header">
                        <div class="layout-header-left">
                            <a>CDN-X</a>
                            <a>CWN-X</a>
                            <a>CLN-X</a>
                        </div>
                        <div class="layout-header-right">
                            <Dropdown style="margin-left: 20px"
                                      placement="bottom-end">
                                <a class="dropdown-link"
                                   href="javascript:void(0)">{{username}}</a>
                                <Dropdown-menu slot="list">
                                    <Dropdown-item disabled>Change password</Dropdown-item>
                                    <Dropdown-item divided>Logout</Dropdown-item>
                                </Dropdown-menu>
                            </Dropdown>
                        </div>
                    </div>
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
export default {
    data() {
        return {
            username: user.state.userInfo.username,
            title: this.$route.meta.title,
            iconSize: 24
        }
    },
    methods: {
        goRouter(link) {
            this.$router.push({ name: link })
        }
    }
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

.layout-menu {
    width: 200px;
    background: #464c5b;
}

.layout-header {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
    .layout-header-right {
        margin-right: 16px;
    }
    .dropdown-link {
        color: #657180;
        font-size: 14px;
        font-weight: bolder;
    }
}

.layout-header-left{
    a {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        height: 60px;
        width: 90px;
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

.logo-samll {
    display: none;
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


/* fix table width bug when toggle menu */

.ivu-table table {
    width: 100% !important;
}
</style>
