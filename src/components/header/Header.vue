<template>
    <div>
        <div class="layout-header">
            <div class="layout-header-left">
            </div>
            <div class="layout-header-right">
                <div class="button-document" @click="openDoc">
                    <Tooltip :content='$t("STORAGE.DOCUMENTATION")' placement="bottom">
                        <Icon type="help-circled" :size="18"></Icon>
                    </Tooltip>
                </div>
                <Dropdown style="margin-left: 3px"
                          @on-click="menuClick"
                          placement="bottom-end">
                    <a class="dropdown-link"
                       href="javascript:void(0)">{{uname}}</a>
                    <Icon type="chevron-down"
                          class="icon-top-down"></Icon>
                    <Dropdown-menu slot="list">
                        <Dropdown-item v-show="isAdminMode" name="selectSubUser">{{$t("NAV.RESELECT_USER")}}</Dropdown-item>
                        <Dropdown-item name="rePasssword">{{$t("NAV.CHANGE_PASSWORD")}}</Dropdown-item>
                        <Dropdown-item name="logout">{{$t("NAV.LOGOUT")}}</Dropdown-item>
                    </Dropdown-menu>
                </Dropdown>
            </div>
        </div>
        <Modal v-model="rePasswordModal"
               :title='$t("NAV.CHANGE_PASSWORD")'
               @on-ok="changePassword"
               @on-cancel="rePasswordModal = false">
            <Form ref="rePasswordForm"
                  :model="rePasswordForm"
                  :rules="ruleValidate"
                  :label-width="80">
                <Form-item :label='$t("LOGIN.KEY")'
                           prop="password">
                    <Input v-model="rePasswordForm.password"
                           :placeholder='$t("NAV.NEW_PASSWORD")'></Input>
                </Form-item>
            </Form>
        </Modal>
    </div>
</template>
<script>
import { REPASSWORD } from '@/service/API'
import { logout } from '@/service/Helper'
import user from '@/store/modules/user'
export default {
    data () {
        return {
            rePasswordModal: false,
            isAdminMode: user.state.type === 'admin',
            rePasswordForm: {
                password: ''
            },
            ruleValidate: {
                password: [
                    { required: true, len: 6, message: 'Requires 6 charactors', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        uname: function () {
            return user.state.type === 'admin' && user.state.subUser ? `${this.username} -- ${user.state.subUser.username}` : this.username
        }
    },
    props: ['username'],
    methods: {
        async menuClick (name) {
            if (name === 'logout') {
                logout()
            } else if (name === 'rePasssword') {
                this.rePasswordModal = true
            } else if (name === 'selectSubUser') {
                this.$router.push('/login')
            }
        },
        async changePassword () {
            if (this.rePasswordForm.password.length < 6) {
                this.$Message.error(this.$t('NAV.PASSWORD_CHECK'))
                return false
            }
            try {
                await this.$http.post(REPASSWORD, {email: user.state.email, password: this.rePasswordForm.password})
                logout()
            } catch (error) {
                console.log(error)
                this.$Message.error(this.$t('NAV.CHANGE_PASSWORD_FAILED'))
            }
        },
        openDoc () {
            window.open('http://doc.bscstorage.com')
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';

.layout-header {
    .fb(space-between,center);
    .wh(100%,60px);
    background: @primary-color;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
    position: fixed;
    z-index: 1000;
    padding-right: @layout-margin-left;
    .layout-header-right {
        margin-right: 16px;
        .fb(center,center);
    }
    .dropdown-link {
        .sc(18px,@menu-text-color);
    }
}

.button-document {
    .sc(18px,@menu-text-color);
    font-weight: bolder;
    padding-right: 10px;
    margin-right: 10px;
    border-right: 1px solid #1b8de2;
    cursor: pointer;
    i {
        position: relative;
        top: 1px;
        left: -4px;
    }
}

.layout-header-left {
    a {
        .fb(center,center);
        .sc(18px,@menu-text-color);
        font-weight: bolder;
        .wh(140px,60px);
    }
    .active{
        background-color: #1d8ce0;
    }
}
.icon-top-down {
    .sc(16px,@menu-text-color);
    padding-left: 8px;
}
</style>
