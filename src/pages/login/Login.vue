<template>
    <div class="bsc-login" @keyup.enter="loginSubmit('loginForm')">
        <div class="card-login">
            <div class="tab-login" v-if="isLogin">
                <div class="header">
                    <img src="../../assets/logo.png" alt="logo" />
                    <span>Language</span>
                    <div class="select-language">
                        <div class="border-triangle-external"></div>
                        <div class="border-triangle"></div>
                        <span @click="changeLang('en')">English</span>
                        <span @click="changeLang('cn')">中文</span>
                    </div>
                </div>
                <div class="body">
                    <span class="slogn">WELCOME TO<br/>THE BAISHANCLOUD DIGITAL WORLD</span>
                    <form class="form-login" v-model="loginForm" ref="loginForm">
                        <div class="email">
                            <span><Icon type="email" :size="18"></Icon></span>
                            <input v-bfocus type="email" oninvalid="setCustomValidity('Requires your correct email')" onchange="try{setCustomValidity('')}catch(e){}" v-model="loginForm.email" required autofocus placeholder="email"/>
                        </div>
                        <div class="password">
                            <span><Icon type="unlocked" :size="18"></Icon></Icon></span>
                            <input v-bfocus class="input-password" oninvalid="setCustomValidity('Requires 6 characters')" onchange="try{setCustomValidity('')}catch(e){}" type="password" v-model="loginForm.password" required minlength="6" placeholder="password" />
                            <span @click="showPw" :class="{ showPw:showPassword }"><Icon type="eye" :size="18"></Icon></span>
                        </div>
                        <div class="keep">
                            <input type="checkbox" v-model="keepEmail" @click="keep" id="bsc-checkbox"/>
                            <label for="bsc-checkbox"><span></span>{{$t("LOGIN.KEEP_EMAIL")}}</label>
                        </div>
                        <div class="login">
                            <button @click="loginSubmit('loginForm')">{{$t("LOGIN.BUTTON_LOGIN")}}</button>
                        </div>
                        <div class="register dn">
                            没有账号？<a>立即申请</a>
                        </div>
                    </form>
                </div>
                <div class="footer">
                    Copyright © 2015-2017 BaishanCloud. All rights Reserved.
                </div>
            </div>
            <div class="tab-register" v-if="!isLogin">
                <div class="header">
                    <img src="../../assets/logo.png" alt="logo" />
                    <span>选择您要进行的操作(二选一)</span>
                </div>
                <div class="body">
                    <div class="body-left">
                        <div class="title">选择(一)</div>
                        <div class="select-label">查看客户使用情况:</div>
                        <div class="select-group">
                            <select>
                                <option value="volvo">Volvo</option>
                                <option value="saab">Saab</option>
                                <option value="mercedes">Mercedes</option>
                                <option value="audi">Audi</option>
                            </select>
                        </div>
                        <button>确定</button>
                    </div>
                    <div class="body-right">
                        <div class="title">选择(二):给新客户申请账号</div>
                        <div class="input-group">
                            <span>公司名:</span>
                            <input />
                            <div>*必须与工商执照一致</div>
                        </div>
                        <div class="input-group">
                            <span>邮箱地址:</span>
                            <input />
                        </div>
                        <div class="input-group">
                            <span>用户名:</span>
                            <input />
                        </div>
                        <div class="input-group">
                            <span>初始密码:</span>
                            <input />
                        </div>
                        <div class="select-label">账户类型:</div>
                        <div class="select-group">
                            <select>
                                <option value="normal">Normal user</option>
                                <option value="super">Super user</option>
                            </select>
                        </div>
                        <button>确定</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { LOGIN } from '@/service/API'
import Vue from 'vue'
export default {
    data () {
        return {
            lang: 'cn',
            selectedCustomer: '',
            isLogin: true,
            keepEmail: JSON.parse(localStorage.getItem('keepEmail')) || false,
            loginForm: {
                email: localStorage.getItem('loginEmail'),
                password: ''
            },
            showPassword: false
        }
    },
    mounted () {

    },
    directives: {
        bfocus: {
            inserted: function (el) {
                el.onfocus = (e) => {
                    el.parentNode.parentNode.childNodes.forEach((node) => {
                        node.classList && node.classList.contains('input-focus') && node.classList.remove('input-focus')
                    })
                    el.parentNode.classList.add('input-focus')
                }
            }
        }
    },
    methods: {
        async loginSubmit (name) {
            if (this.formValid(name)) {
                // save login email
                this.keepEmail ? localStorage.setItem('loginEmail', this.loginForm.email) : localStorage.setItem('loginEmail', '')
                this.$http.post(LOGIN, { ...this.loginForm }).then(res => {
                    res.data.type === 'admin' ? this.adminMode(res.data) : this.toIndex(res.data)
                }, error => {
                    this.$Message.error(error)
                })
            } else {
                this.$Message.error(this.$t('LOGIN.VALIDATE_FAILED'))
            }
        },
        adminMode (data) {
            this.isLogin = false
        },
        toIndex (data) {
            this.$store.dispatch('setUserInfo', data)
            let redirect = this.$route.query.redirect // get redirect path
            !!redirect ? this.$router.push(redirect) : this.$router.push('/')
            Vue.config.lang = this.lang
        },
        changeLang (lang) {
            Vue.config.lang = lang
            sessionStorage.removeItem('lang')
            sessionStorage.setItem('lang', lang)
        },
        showPw () {
            let input = document.querySelector('.input-password')
            if (input.type === 'password') {
                this.showPassword = true
                input.type = 'text'
            } else {
                this.showPassword = false
                input.type = 'password'
            }
        },
        formValid (name) {
            let isValid = true
            this.$refs[name].querySelectorAll('input').forEach((input) => {
                if (!input.validity.valid) {
                    isValid = false
                }
            })
            return isValid
        },
        keep () {
            localStorage.setItem('keepEmail', this.keepEmail)
        }
    }
}

</script>
<style lang="less" scoped>
@import '../../styles/index.less';

@login-card-height: 640px;
@login-card-width: 1000px;
@login-card-padding: 48px;
@login-card-bg: #2e373e;
@login-card-language-select-background: #384549;
@login-card-login-text-color: #8492a6;
@login-card-login-input-invalid-text-color: #d75000;
@login-card-login-input-width: 380px;
@login-card-register-header-height: 60px;
@login-card-register-text-color: #c0ccda;
@login-card-register-input-backgrand: #414d56;
@login-card-register-input-border: #52626d;

.@{css-prefix}login {
    .wh(100%,100%);
    .fb(center,center);
    background: url('../../assets/login-bg.png') no-repeat;

    .card-login {
        position: relative;
        .wh(@login-card-width,@login-card-height);
        background-color: @login-card-bg;
        padding: 40px @login-card-padding;

        .tab-login {
            .header {
                height: 25px;

                & > img {
                    float: left;
                }

                & > span {
                    .sc(18px,#fff);
                    font-weight: 500;
                    float: right;
                    cursor: pointer;
                    padding-bottom: 20px;

                    &:hover + .select-language {
                        display: block;
                    }
                }

                .select-language {
                    display: none;
                    position: relative;
                    left: @login-card-width - 2 * @login-card-padding - 100;
                    top: 40px;
                    width: 100px; 
                    height: 60px; 
                    border: 1px solid @login-card-login-text-color;
                    border-radius: 5px;
                    background-color: @login-card-language-select-background;

                    &:hover {
                        display: block;
                    }

                    &:target {
                        display: none;
                    }

                    div.border-triangle-external {
                        display: block;
                        position: absolute;
                        left: 60px;
                        top: -21px;
                        width: 0px;
                        height: 0px;
                        border: 10px solid;
                        border-color: transparent transparent @login-card-login-text-color transparent;
                    }

                    div.border-triangle {
                        display: block;
                        position: absolute;
                        left: 60px;
                        top: -20px;
                        width: 0px;
                        height: 0px;
                        border: 10px solid;
                        border-color: transparent transparent @login-card-language-select-background transparent;
                    }

                    & > span {
                        position: relative;
                        top: -34px;
                        display: inline-block;
                        .wh(80%,28px);
                        line-height: 28px;
                        .sc(14px,@login-card-login-text-color);
                        cursor: pointer;

                        &:hover {
                            color: #fff;
                        }
                    }

                    & > span:last-child {
                        border-top: 1px solid #424e55;
                    }
                }
            }

            .body {
                .slogn {
                    display: block;
                    margin-top: 54px;
                    font-size: 24px;
                    font-weight: 500;
                }

                .form-login {
                    .email,
                    .password {
                        margin: 0 auto;
                        padding-bottom: 14px;
                        .fb(flex-start,flex-end,flex);
                        .wh(@login-card-login-input-width,80px);
                        border-bottom: 1px solid @login-card-login-text-color;

                        & > span {
                            flex: 1;
                        }

                        input {
                            height: 24px;
                            .sc(18px,@login-card-login-text-color);
                            background: @login-card-bg;
                            border: 0;
                            
                            &:focus {
                                outline-offset: 0;
                                outline: -webkit-focus-ring-color auto 0;
                            }
                        }

                        & > input:invalid {
                            color: @login-card-login-input-invalid-text-color;
                        }
                    }

                    .email {
                        input {
                            flex: 7;
                        }
                    }

                    .password {
                        input {
                            flex: 6;
                        }

                        & > span:last-child {
                            cursor: pointer;
                        }

                        .showPw {
                            color: @primary-color;
                        }
                    }

                    .input-focus {
                        border-bottom: 2px solid @primary-color;

                        & > span:first-child {
                            color: @primary-color;
                        }
                    }

                    .keep {
                        height: 20px;
                        margin-right: @login-card-width / 2 - @login-card-padding - @login-card-login-input-width / 2 + 20px;
                        margin-top: 12px;
                        .sc(14px,@login-card-login-text-color);
                        .fb(flex-end,center,flex);

                        input[type="checkbox"] {
                            display:none;
                        }

                        input[type="checkbox"] + label span {
                            display: inline-block;
                            width: 19px;
                            height: 19px;
                            margin: -2px 10px 0 0;
                            vertical-align: middle;
                            background: url('../../assets/login-checkbox.png') no-repeat left center;
                            cursor: pointer;
                        }

                        input[type="checkbox"]:checked + label span {
                            background: url('../../assets/login-checkbox-checked.png') no-repeat left center;
                        }

                        & > label {
                            cursor: pointer;
                        }
                    }

                    .login {
                        margin-top: 24px;

                        button {
                            .wh(280px,40px);
                            .sc(18px,#fff);
                            cursor: pointer;
                            background: @primary-color;
                            border: 0;

                            &:focus {
                                outline-offset: 0;
                                outline: -webkit-focus-ring-color auto 0;
                            }

                            &:hover {
                                background-color: #57a3f3;
                                border-color: #57a3f3;
                            }
                        }
                    }

                    .register {
                        margin-top: 20px;
                        .sc(14px,#8492a6);

                        a {
                            color: @primary-color;
                        }
                    }
                }
            }

            .footer {
                position: absolute;
                bottom: 36px;
                width: @login-card-width - (2 * @login-card-padding);
                color: @login-card-login-text-color;
                font-size: 14px;
            }
        }

        .tab-register {
            .header {
                height: 60px;
                border-bottom: 1px solid @login-card-register-text-color;

                & > img {
                    position: absolute; 
                    left: @login-card-padding;
                }

                & > span {
                    display: inline-block;
                    margin-top: 20px;
                    .sc(18px,@login-card-register-text-color);
                    font-weight: 500;
                }
            }  

            .body {
                height: @login-card-height - (2 * @login-card-padding) - @login-card-register-header-height;

                .body-left,
                .body-right {
                    width: 50%;
                    float: left;
                    margin: 14px 0;

                    input {
                        .wh(100%,36px);
                        background: @login-card-register-input-backgrand;
                        border: 1px solid @login-card-register-input-border;
                        padding: 6px 8px;
                        .sc(16px,@login-card-register-text-color);
                        border-radius: @common-radius;
                        overflow: hidden;

                        &:focus {
                            outline-offset: 0;
                            outline: -webkit-focus-ring-color auto 0;
                        }
                    }

                    button {
                        cursor: pointer;
                        .wh(180px,36px);
                        border-radius: @common-radius;
                        border: 0;
                        .sc(14px,#fff);
                        background: @primary-color;
                        margin-top: 20px;

                        &:focus {
                            outline-offset: 0;
                            outline: -webkit-focus-ring-color auto 0;
                        }

                        &:hover {
                            background-color: #57a3f3;
                            border-color: #57a3f3;
                        }
                    }

                    .title {
                        text-align: left;
                        .sc(18px,@login-card-register-text-color)
                    }

                    .select-label {
                        margin: 10px 0;
                        text-align: left;
                        .sc(14px,@login-card-register-text-color)
                    }

                    .select-group {
                        border: 1px solid @login-card-register-input-border;
                        width: 100%;
                        border-radius: @common-radius;
                        overflow: hidden;
                        background: @login-card-register-input-backgrand;

                        select {
                            padding: 5px 8px;
                            width: 100%;
                            .sc(16px,@login-card-register-text-color);
                            border: none;
                            box-shadow: none;
                            background-image: none;
                            -webkit-appearance: none;
                            background: @login-card-register-input-backgrand;
                            
                            &:focus {
                                outline: none;
                            }
                        }
                    }
                }

                .body-left {
                    padding-right: 48px;
                }

                .body-right {
                    padding-left: 48px;
                    border-left: 1px dashed #8492a6;

                    .input-group {
                        margin: 10px 0;
                        & > span {
                            margin-bottom: 6px;
                            float: left;
                            .sc(14px,@login-card-register-text-color)
                        }

                        & > div {
                            margin: 5px 20px 0 0;
                            text-align: right;
                            .sc(12px,#8492a6);
                        }
                    }
                }
            } 
        }
    }
}
</style>
