<template>
    <div class="bsc-login" @keyup.enter="loginSubmit('loginForm')">
        <div class="card-login">
            <div class="tab-login">
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
                            <input type="checkbox" id="bsc-checkbox"/>
                            <label for="bsc-checkbox"><span></span>保持登录</label>
                        </div>
                        <div class="login">
                            <button @click="loginSubmit('loginForm')">{{$t("LOGIN.BUTTON_LOGIN")}}</button>
                        </div>
                        <div class="register">
                            没有账号？<a>立即申请</a>
                        </div>
                    </form>
                </div>
                <div class="footer">
                    Copyright © 2015-2017 BaishanCloud. All rights Reserved.
                </div>
            </div>
            <div class="tab-register dn">
                <div class="header">
                    <img src="../../assets/logo.png" alt="logo" />
                    <span>选择您要进行的操作(二选一)</span>
                </div>
                <div class="body">
                    <div class="body-left">
                        <select name="select">
                            <option value="value1">Value 1</option> 
                            <option value="value2" selected>Value 2</option>
                            <option value="value3">Value 3</option>
                        </select>
                    </div>
                    <div class="body-right"></div>
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
            loginForm: {
                email: '',
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
                this.$http.post(LOGIN, { ...this.loginForm }).then(res => {
                    this.$store.dispatch('setUserInfo', res.data)
                    let redirect = this.$route.query.redirect // get redirect path
                    !!redirect ? this.$router.push(redirect) : this.$router.push('/')
                    Vue.config.lang = this.lang
                }, error => {
                    this.$Message.error(error)
                })
            } else {
                this.$Message.error(this.$t('LOGIN.VALIDATE_FAILED'))
            }
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
@login-card-register-text-color: #a3afbb;

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
                }

                .body-left {
                    
                }
            } 
        }
    }
}
</style>
