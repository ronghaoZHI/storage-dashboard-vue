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
                    <header-top :username='userInfo.username'></header-top>
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
import {mapState, mapActions} from 'vuex'
export default {
    data() {
        return {
            title: this.$route.meta.title,
            iconSize: 24
        }
    },
    mounted(){
        this.getUserInfo();
    },
    components: {headerTop},
    computed: {
        userInfo () {
            return user.state.userInfo
        }
    },
    methods: {
        goRouter(link) {
            this.$router.push({ name: link })
        },
         ...mapActions([
            'getUserInfo'
        ])
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
