<template>
    <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
        <Row type="flex" class="layout-row">
            <i-col :span="spanLeft" class="layout-menu-left">
                <Menu active-name="bucket" theme="light" width="auto" @on-select="goRouter">
                    <div class="layout-logo-left">
                        <img class="logo-big" src="../../assets/logo.png" height="30px" />
                        <img class="logo-samll"  src="../../assets/logo-small.png" height="30px" />
                    </div>
                    <Menu-item name="bucket">
                        <Icon type="soup-can-outline" :size="iconSize"></Icon>
                        <span class="layout-text">我的存储</span>
                    </Menu-item>
                    <Menu-item name="dashboard">
                        <Icon type="podium" :size="iconSize"></Icon>
                        <span class="layout-text">统计分析</span>
                    </Menu-item>
                    <Menu-item name="keychain">
                        <Icon type="key" class="menu-icon-fix" :size="iconSize"></Icon>
                        <span class="layout-text">密钥管理</span>
                    </Menu-item>
                </Menu>
            </i-col>
            <i-col :span="spanRight">
                <div class="layout-right">
                    <div class="layout-header">
                        <i-button type="text" @click="toggleClick" class="button-toggle">
                            <Icon type="navicon" size="32"></Icon>
                        </i-button>
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
export default {
    data () {
        return {
                spanLeft: 5,
                spanRight: 19,
            }
        },
    computed: {
        iconSize () {
            return this.spanLeft === 5 ? 24 : 36;
        }
    },
    methods: {
        toggleClick () {
            if (this.spanLeft === 5) {
                this.spanLeft = 2;
                this.spanRight = 22;
            } else {
                this.spanLeft = 5;
                this.spanRight = 19;
            }
        },
        goRouter (link) {
            this.$router.push({name: link})
        }
    }
};
</script>

<style lang="less">
    .layout{
        position: relative;
        overflow: hidden;
        height: 100%;
    }
    .layout-row{
        height: 100%;
    }
    .layout-right{
        display: flex;
        flex-direction: column;
        text-align: left;
        height:100%;
    }
    .layout-bsc-toolbar{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    .layout-content{
        flex: 1;
        min-height: 200px;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-text{
        display: inline-block;
        line-height: 24px
    }
    .layout-menu-left{
        background: #fff;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .button-toggle{
        margin-top: 7px;
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        border-radius: 3px;
        margin: 15px auto;
    }
    .layout-ceiling-main a{
        color: #9ba7b5;
    }
    .logo-samll{
        display: none;
    }
    .layout-hide-text{
        .layout-text{
            display: none;
        }
        .layout-logo-left {
            text-align: center;
        }
        .layout-logo-left > .logo-big{
            display: none;
        }
        .layout-logo-left > .logo-samll{
            display: inline-block;
            
        }
    }
    .ivu-col{
        transition: width .2s ease-in-out;
    }
    .ivu-menu-item{
        display: inline-flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
        span{
            margin-left: 5px;
        }
        .menu-icon-fix{
            width: 21px;
        }
    }

    /* fix table width bug when toggle menu */
    .ivu-table table{
      width: 100% !important;
    }
</style>
