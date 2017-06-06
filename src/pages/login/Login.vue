<template>
    <div class="bsc-login" @keyup.enter="handleSubmit('formInline')">
        <div class="card-login">
            <div class="tab-login">
                <div class="header">
                    <img src="../../assets/logo.png" alt="logo" />
                    <span>Language</span>
                </div>
                <div class="body">
                    <span class="slogn">WELCOME TO<br/>THE BAISHANCLOUD DIGITAL WORLD</span>
                    <form class="form-login">
                        <div class="input-email">
                            <span><Icon type="email" :size="18"></Icon></span>
                            <input v-bfocus />
                        </div>
                        <div class="input-password">
                            <span><Icon type="unlocked" :size="18"></Icon></Icon></span>
                            <input v-bfocus />
                        </div>
                        <div class="checkbox-keep">
                            <input id="keep" type="checkbox">
                            <label for="kep">保持登录</label>
                        </div>
                        <div class="button-login">
                            <button>登录</button>
                        </div>
                        <div class="register"></div>
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
            selectedCustomer: ''
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
        async handleSubmit (name) {
            let self = this
            this.$refs[name].validate((valid) => {
                if (valid) {
                    self.$http.post(LOGIN, {...self.formInline}).then(res => {
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
            })
        },
        changeLang () {
            Vue.config.lang = this.lang
            sessionStorage.removeItem('lang')
            sessionStorage.setItem('lang', this.lang)
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
@login-card-login-text-color: #8492a6;
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
                    & > div {
                    }

                    .input-email,
                    .input-password {
                        margin: 0 auto;
                        padding-bottom: 14px;
                        .fb(flex-start,flex-end,flex);
                        .wh(@login-card-login-input-width,80px);
                        border-bottom: 1px solid @login-card-login-text-color;

                        & > span {
                            flex: 1;
                        }

                        input {
                            flex: 7;
                            height: 24px;
                            .sc(18px,@login-card-login-text-color);
                            background: @login-card-bg;
                            border: 0;
                            
                            &:focus {
                                outline-offset: 0;
                                outline: -webkit-focus-ring-color auto 0;
                            }
                        }
                    }

                    .input-focus {
                        border-bottom: 2px solid @primary-color;

                        & > span {
                            color: @primary-color;
                        }
                    }

                    .checkbox-keep {
                        height: 20px;
                        .sc(14px,@login-card-login-text-color);
                        margin-right: @login-card-width / 2 - @login-card-padding - @login-card-login-input-width / 2 + 20px;
                        margin-top: 6px;
                        .fb(flex-end,center,flex);

                        input {
                            .wh(14px,14px);
                            margin-right: 10px;
                        }
                    }

                    .button-login {
                        margin-top: 30px;

                        button {
                            .wh(280px,40px);
                            .sc(18px,#fff);
                            background: @primary-color;
                            border: 0;

                            &:focus {
                                outline-offset: 0;
                                outline: -webkit-focus-ring-color auto 0;
                            }
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
