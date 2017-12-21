<template>
    <div class="bsc-header">
        <div class="layout-header">
            <div class="layout-header-left">
				<Tooltip content="跳转到 CDN Dashboard" placement="bottom" v-show="cdnUrl">
					<a href="http://portal.baishancloud.com">CDN-X</a>
				</Tooltip>
            </div>
            <div class="layout-header-right">
                <div class="button-document" @click="openDoc">
                    <Tooltip :content='$t("STORAGE.DOCUMENTATION")' placement="bottom">
                        <Icon type="help-circled" :size="24"></Icon>
                    </Tooltip>
                </div>
                <div class="button-document">
                    <i-switch v-model="lang" @on-change="toggleLanguage">
                        <span slot="open">中</span>
                        <span slot="close">EN</span>
                    </i-switch>
                </div>
                <div class="button-document" @click="toggleTheme">
                    <Tooltip :content='$t("STORAGE.TOGGLE_THEME")' placement="bottom">
                        <Icon type="android-color-palette" :size="24"></Icon>
                    </Tooltip>
                </div>
                <Dropdown style="margin-left: 13px"
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
                  :label-width="90">
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
import Vue from 'vue'
import { REPASSWORD, BOUND_USER } from '@/service/API'
import { clear } from '@/service/Aws'
import { logout, getCookie, createCookie } from '@/service/Helper'
import user from '@/store/modules/user'
export default {
    data () {
        return {
            rePasswordModal: false,
            lang: getCookie('uc_lang') !== 'en',
            isAdminMode: user.state.type === 'admin',
            cdnUrl: getCookie('uc_cdn_auth') === '1',
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
        },
        theme: function () {
            return this.$store.state.theme
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
                let res = await this.$http.get(BOUND_USER)
                await this.$store.dispatch('setUserInfo', _.extend(user.state, {subUserList: res}))
                await clear()
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
        },
        toggleLanguage (bol) {
            let lang = bol ? 'cn' : 'en'
            Vue.config.lang = lang
            createCookie('uc_lang', lang)
        },
        async toggleTheme () {
            await this.$store.dispatch('toggleTheme', this.$store.state.theme === 'dark' ? 'white' : 'dark')
            if (this.$store.state.theme === 'dark') {
                $('body').addClass('dark')
            } else {
                $('body').removeClass('dark')
            }
        }
    }
}
</script>
<style lang="less" scoped>

.@{css-prefix}header{
    .layout-header {
        .fb(space-between,center);
        .wh(100%,60px);
        background: @primary-color;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
        position: fixed;
        z-index: 1000;
        padding-right: @layout-margin-left;

        .layout-header-left {
            a {
                .fb(center,center);
                .sc(22px,@menu-text-color);
                font-weight: 500;
				.wh(140px,60px);

				&:active {
					background-color: #1b8de2;
				}
            }
        }

        .layout-header-right {
            margin-right: 16px;
            .fb(center,center);

            .button-document {
                .sc(22px,@menu-text-color);
                font-weight: bolder;
                padding: 0 15px;
                border-right: 1px solid #1b8de2;
                cursor: pointer;
                i {
                    position: relative;
                    top: 2px;
                }
            }

            .icon-top-down {
                .sc(16px,@menu-text-color);
                padding-left: 8px;
            }
        }
        .dropdown-link {
            .sc(22px,@menu-text-color);
        }
    }
}
</style>
