<template>
    <div class="bsc-login" @keyup.enter="loginSubmit('loginForm')">
        <div class="card-login" v-if="showUserSelect">
            <div class="tab-register">
                <div class="header">
                    <img src="../../assets/logo.png" alt="logo" />
                    <Input
                        v-if="subUserList.length > 0"
                        v-model="searchSubUserInput"
                        @on-change="handleSearchSubUser"
                        placeholder="search here"
                        style="width:300px">
                    </Input>
                    <a @click="toUserMange">{{$t("LOGIN.USER_MANAGE")}}</a>
                </div>
                <div class="wrap">
                    <div class="body">
                        <div v-if="subUserList.length > 0" class="card-user" v-for="user in searchedSubUserList" :key="user.ts" @click="selectSubUser(user)">
                            <span class="info"><Icon type="person"></Icon> {{user.username}}</span>
                            <span class="info"><Icon type="briefcase"></Icon> {{user.company}}</span>
                            <span class="icon" v-show="user.info && user.info.type === 'super'"><Icon type="star"></Icon></span>
                        </div>
                        <div v-if="subUserList.length <= 0" class="warning" @click="toUserMange()">暂无绑定用户,<span>点击绑定或新增用户</span></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { USERINFO, BOUND_USER, SSO_CHECK_LOGIN } from '@/service/API'
import { getCookie } from '@/service/Helper'
import user from '@/store/modules/user'
import Vue from 'vue'
export default {
    data () {
        return {
            lang: getCookie('uc_lang') || 'cn',
            searchSubUserInput: '',
            searchedSubUserList: user.state.subUserList || [],
            selectedCustomer: '',
            showUserSelect: false,
            userInfo: user.state || {},
            subUserList: user.state.subUserList || []
        }
    },
    created () {
        this.saveToken()
    },
    methods: {
        async saveToken () {
            let _token = this.$route.query.ticket || this.$store.token
            let _router = this.$route.query.callback || '/bucket'

            if (_token) {
                try {
                    await this.$store.dispatch('setToken', _token)
                    this.$http.defaults.headers.common['Authorization'] = _token
                    this.getUserInfo()
                } catch (error) {
                    console.log(error)
                }
            } else {
                window.location = SSO_CHECK_LOGIN(_router)
            }
        },
        async getUserInfo () {
            this.$Loading.start()
            this.$http.get(USERINFO).then(res => {
                res.type === 'admin' ? this.adminMode(res) : this.toIndex(res)
                this.$Loading.finish()
            }, error => {
                this.$Loading.error()
                this.$Message.error(error)
            })
        },
        async adminMode (data) {
            let res = await this.$http.get(BOUND_USER)
            this.userInfo = data
            if (res.length > 0) {
                this.subUserList = res
                this.searchedSubUserList = res
                this.showUserSelect = true
                await this.$store.dispatch('setUserInfo', {
                    ...data,
                    subUserList: this.subUserList
                })
            } else {
                this.toIndex(data, 'user')
            }
        },
        handleSearchSubUser () {
            if (!this.searchSubUserInput) {
                this.searchedSubUserList = this.subUserList
                return
            }
            let searchArr = this.searchSubUserInput.split('')
            let reg = new RegExp(searchArr.join('.*'))
            this.searchedSubUserList = this.subUserList.filter(item => reg.test(item.username) || reg.test(item.company))
        },
        selectSubUser (user) {
            this.toIndex({
                ...this.userInfo,
                subUser: user,
                subUserList: this.subUserList
            })
        },
        async toIndex (user, router = '/') {
            router = user.type === 'admin' && !user.subUser ? '/user' : user.type === 'sub' ? 'bucket' : '/overview'
            await this.$store.dispatch('setUserInfo', user)
            await this.$store.dispatch('cleanState')

            let redirect = this.$route.query.callback // get redirect path
            !!redirect ? this.$router.push(redirect) : this.$router.push(router)
            Vue.config.lang = this.lang
        },
        changeLang (lang) {
            Vue.config.lang = lang
            this.lang = lang
            sessionStorage.removeItem('lang')
            sessionStorage.setItem('lang', lang)
        },
        refreshMenu () {
            this.$store.dispatch('refreshMenu')
        },
        showPw () {
            let $input = $('.input-password')[0]
            if ($input.type === 'password') {
                this.showPassword = true
                $input.type = 'text'
            } else {
                this.showPassword = false
                $input.type = 'password'
            }
        },
        async toUserMange () {
            delete user.state.subUser
            await this.$store.dispatch('setUserInfo', user.state)
            await this.$store.dispatch('cleanState')
            Vue.config.lang = this.lang
            this.$router.push('user')
        }
    }
}
</script>
<style lang="less" scoped>
@login-card-height: 600px;
@login-card-width: 900px;
@login-card-padding: 48px;
@login-card-bg: #2e373e;
@login-card-login-text-color: #8492a6;
@login-card-register-item-width: 180px;
@login-card-register-item-height: 80px;
@login-card-register-text-color: #c0ccda;
@login-card-register-input-backgrand: #414d56;
@login-card-register-input-backgrand-hover: #52626d;

.@{css-prefix}login {
    .wh(100%,100%);
    .fb(center,center);
    background: url('../../assets/login-bg.png') no-repeat;
    background-size: cover;

    .card-login {
        position: relative;
        .wh(@login-card-width,@login-card-height);
        background-color: @login-card-bg;
        padding: 40px @login-card-padding;

        .tab-register {
            .header {
                height: 60px;
                border-bottom: 1px solid #52626d;

                & > img {
                    position: absolute;
                    left: @login-card-padding;
                }

                & > a {
                    .sc(18px,@primary-color);
                    position: absolute;
                    top: @login-card-padding + 3px;
                    right: @login-card-padding;
                    cursor: pointer;
                }
            }

            .wrap {
                height: 460px;
                overflow-y: auto;

                .body {
                    width: 100%;
                    display: inline-flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: flex-start;
                    align-items: flex-start;
                    padding: 10px 0 0 12px;

                    & > .card-user {
                        position: relative;
                        .wh(@login-card-register-item-width,@login-card-register-item-height);
                        background-color: @login-card-register-input-backgrand;
                        border-radius: @common-radius;
                        .sc(16px,#fff);
                        margin: 8px 6px;
                        cursor: pointer;

                        &:hover {
                            background-color: @login-card-register-input-backgrand-hover;
                        }

                        & > span:first-child {
                            margin-top: 12px;
                        }
                        & > span:nth-child(2) {
                            margin-top: 8px;
                        }

                        .info {
                            display: inline-block;
                            .wh(98%,@login-card-register-item-height / 2 - 15);
                            line-height: @login-card-register-item-height / 2 - 15;
                            vertical-align: bottom;
                            padding: 0 16px;
                            text-align: left;
                            text-overflow: ellipsis;
                            overflow:hidden;
                            white-space:nowrap;

                            i {
                                position: relative;
                                top: 1px;
                                padding-right: 4px;
                            }
                        }

                        .icon {
                            position: absolute;
                            color: #fff;
                            top: 6px;
                            right: 12px;
                        }
                    }

                    .warning {
                        .sc(16px, #fff);

                        span {
                            color: @primary-color;
                            cursor: pointer;
                        }
                    }
                }
            }

        }
    }
}

input:-webkit-autofill {
    box-shadow: 0 0 0 1000px @login-card-bg inset !important;
    -webkit-text-fill-color: @login-card-login-text-color !important;
}
</style>
