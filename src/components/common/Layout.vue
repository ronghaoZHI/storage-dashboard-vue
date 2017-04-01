<template>
    <div class="layout"
         :class="{'layout-hide-text': spanLeft < 5}">
        <Row type="flex"
             class="layout-row">
            <i-col :span="spanLeft"
                   class="layout-menu-left">
                <Menu active-name="bucket"
                      theme="light"
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
            </i-col>
            <i-col :span="spanRight">
                <div class="layout-right">
                    <div class="layout-header">
                        <div class="layout-header-left">
                            <i-button type="text"
                                      @click="toggleClick">
                                <Icon type="navicon"
                                      size="32"></Icon>
                            </i-button>
                            <h2>{{title}}</h2>
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
            </i-col>
        </Row>
    </div>
</template>
<script>
import user from '../../store/modules/user'
export default {
    data() {
        return {
            spanLeft: 5,
            spanRight: 19,
            username: user.state.userInfo.username,
            title: this.$route.meta.title
        }
    },
    computed: {
        iconSize() {
            return this.spanLeft === 5 ? 24 : 36;
        }
    },
    methods: {
        toggleClick() {
            console.log(this.$route);
            if (this.spanLeft === 5) {
                this.spanLeft = 2;
                this.spanRight = 22;
            } else {
                this.spanLeft = 5;
                this.spanRight = 19;
            }
        },
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
}

.layout-right {
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

.layout-menu-left {
    background: #fff;
}

.layout-header {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
    .layout-header-left {
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
    }
    .layout-header-right {
        margin-right: 16px;
    }
    .dropdown-link {
        color: #657180;
        font-size: 14px;
        font-weight: bolder;
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

.layout-hide-text {
    .layout-text {
        display: none;
    }
    .layout-logo-left {
        text-align: center;
    }
    .layout-logo-left>.logo-big {
        display: none;
    }
    .layout-logo-left>.logo-samll {
        display: inline-block;
    }
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
