<template>
    <div class="layout-header">
        <div class="layout-header-left">
            <a>CDN-X</a>
            <a>CWN-X</a>
            <a>CLN-X</a>
        </div>
        <div class="layout-header-right">

            <Dropdown style="margin-left: 20px"
                      @on-click="menuClick"
                      placement="bottom-end">
                <a class="dropdown-link"
                   href="javascript:void(0)">{{username}}</a>
                <Icon type="chevron-down" class="icon-top-down"></Icon>
                <Dropdown-menu slot="list">
                    <Dropdown-item disabled>Change password</Dropdown-item>
                    <Dropdown-item name="logout">Logout</Dropdown-item>
                </Dropdown-menu>
            </Dropdown>
        </div>
    </div>
</template>
<script>
import { LOGOUT, REPASSWORD } from '../service/API'
import { clear } from '../service/Aws'
export default {
    data() {
        return {

        }
    },
    props: ['username'],
    methods: {
        menuClick: function (name) {
            let self = this
            if (name === 'logout') {
                clear() && self.$http.post(LOGOUT).then(res => {
                    self.$store.dispatch('logout').then(() => {
                        self.$router.push('/login')
                    })
                },error => {
                    this.$Message.error('Logout fail')
                })
            }
        }
    }
}

</script>
<style lang="less" scoped>
.layout-header {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    background: #20a0ff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
    .layout-header-right {
        margin-right: 16px;
    }
    .dropdown-link {
        color: #fff;
        font-size: 18px;
        font-weight: bolder;
    }
}

.layout-header-left {
    a {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        font-weight: bolder;
        height: 60px;
        width: 140px;
        color: #fff;
    }
}
.icon-top-down{
    font-size: 16px;
    padding-left: 8px;
    color: #fff
}
</style>