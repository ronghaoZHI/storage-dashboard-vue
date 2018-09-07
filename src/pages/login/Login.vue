<template>
  <div class="bsc-login"
       @keyup.enter="loginSubmit('loginForm')">
    <div class="card-login">
      <div class="tab-login"
           v-if="!showSelectUser">
        <div class="header">
          <img src="../../assets/logo.png"
               alt="logo" />
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
          <form class="form-login"
                v-model="loginForm"
                ref="loginForm">
            <div class="email">
              <span>
                <Icon type="email"
                      :size="18"></Icon>
              </span>
              <input v-bfocus
                     type="text"
                     v-model="loginForm.username"
                     required
                     autofocus
                     placeholder="email / username" />
            </div>
            <div class="password">
              <span>
                <Icon type="unlocked"
                      :size="18"></Icon>
              </span>
              <input v-bfocus
                     class="input-password"
                     oninvalid="setCustomValidity('Requires 6 characters')"
                     onchange="try{setCustomValidity('')}catch(e){}"
                     type="password"
                     v-model="loginForm.password"
                     required
                     minlength="6"
                     placeholder="password" />
              <span @click="showPw"
                    :class="{ showPw:showPassword }">
                <Icon type="eye"
                      :size="18"></Icon>
              </span>
            </div>
            <div class="keep">
              <input type="checkbox"
                     v-model="keepEmail"
                     @click="keep"
                     id="bsc-checkbox" />
              <label for="bsc-checkbox">
                <span></span>{{$t("LOGIN.KEEP_EMAIL")}}</label>
            </div>
            <div class="login">
              <a @click.stop="loginSubmit('loginForm')">{{$t("LOGIN.BUTTON_LOGIN")}}</a>
            </div>
            <div class="register dn">
              没有账号？
              <a>立即申请</a>
            </div>
          </form>
        </div>
        <div class="footer">
          Copyright © 2015-2017 BaishanCloud. All rights Reserved.
        </div>
      </div>
      <div class="tab-register"
           v-if="showSelectUser">
        <div class="header">
          <img src="../../assets/logo.png"
               alt="logo" />
          <Input v-if="subUserList.length > 0"
                 v-model="searchSubUserInput"
                 @on-change="handleSearchSubUser"
                 placeholder="search here"
                 style="width:300px" />
          <a @click="toUserMange">{{$t("LOGIN.USER_MANAGE")}}</a>
        </div>
        <div class="wrap">
          <div class="body">
            <div v-if="subUserList.length > 0"
                 class="card-wrap">
              <div class="card-user"
                   v-for="user in searchedSubUserList"
                   :key="user.ts"
                   @click="selectSubUser(user)">
                <span class="info">
                  <Icon type="person"></Icon> {{user.username}}</span>
                <span class="info">
                  <Icon type="briefcase"></Icon> {{user.company}}</span>
                <span class="icon"
                      v-show="user.perm && user.perms.includes('SUB')">
                  <Icon type="star"></Icon>
                </span>
              </div>
            </div>
            <div v-if="subUserList.length <= 0"
                 class="warning"
                 @click="toUserMange()">暂无绑定用户,
              <span>点击绑定或新增用户</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { loginByUsername, getAccesskey, getUserInfo } from 'api/login'
import { getSSOLoginUrl } from 'api/sso'
import { getListSubUser, getListBoundUser } from 'api/user'
import { checkRole } from 'helper'
import store from '@/store'
import Vue from 'vue'
export default {
  directives: {
    bfocus: {
      inserted: function(el) {
        $(el).on('focus', () => {
          _.each(
            $(el)
              .parent()
              .parent()
              .children(),
            (node) => {
              $(node).hasClass('input-focus') &&
                $(node).removeClass('input-focus')
            },
          )
          $(el)
            .parent()
            .addClass('input-focus')
        })
      },
    },
  },
  data() {
    return {
      lang: store.state.lang,
      selectedCustomer: '',
      keepEmail: JSON.parse(localStorage.getItem('keepEmail')) || false,
      loginForm: {
        username: localStorage.getItem('loginEmail'),
        password: '',
      },
      showPassword: false,
      searchSubUserInput: '',
    }
  },
  computed: {
    subUserList: {
      get() {
        return this.$store.state.users || []
      },
      set() {},
    },
    isSub() {
      const currentPerms = this.$store.state.current.perms
      return currentPerms === null || currentPerms.length === 0
    },
    showSelectUser: {
      get() {
        return this.$store.getters.mode === 'manage'
      },
      set() {},
    },
    searchedSubUserList: {
      get() {
        return this.$store.state.users || []
      },
      set() {},
    },
  },
  mounted() {
    window.dashboard_conf.onlineMode === 'True' && this.saveToken()
  },
  methods: {
    async saveToken() {
      let _token = this.$route.query.ticket || this.$store.state.token

      if (_token) {
        await this.$store.dispatch('setToken', _token)
        this.$http.defaults.headers.common['Authorization'] = _token
        this.getUserInfoByToken()
      } else {
        window.location = getSSOLoginUrl()
      }
    },
    async getUserInfoByToken() {
      let res = await getUserInfo()
      this.setBaseInfo(res)
    },
    async loginSubmit(name) {
      if (this.formValid(name)) {
        this.$Loading.start()
        // save user email
        this.keepEmail
          ? localStorage.setItem('loginEmail', this.loginForm.username)
          : localStorage.setItem('loginEmail', '')
        loginByUsername({ ...this.loginForm }).then(
          (res) => {
            this.setBaseInfo(res)
            this.$Loading.finish()
          },
          () => {
            this.$Loading.error()
          },
        )
      } else {
        this.$Message.error(this.$t('LOGIN.VALIDATE_FAILED'))
      }
    },
    setBaseInfo(res) {
      this.$store
        .dispatch('setBaseInfo', {
          current: res,
          token: res.token,
          perms: res.perms || [],
        })
        .then(() => {
          checkRole(['LIST_USERS', 'SUB'])
            ? this.adminMode(res)
            : checkRole('OPS')
              ? this.toIndex(res, '/system/group')
              : this.toIndex(res)
        })
    },
    async adminMode(data) {
      await this.$store.dispatch('setToken', data.token)
      this.$store.dispatch('setBaseInfo', { manager: [data] })
      this.$http.defaults.headers.common['Authorization'] = data.token
      let res = checkRole('LIST_USERS')
        ? await getListBoundUser()
        : await getListSubUser()
      if (res.length > 0) {
        this.subUserList = res
        this.searchedSubUserList = res
        this.showSelectUser = false
        this.$store.dispatch('setBaseInfo', {
          users: res,
        })
      } else {
        this.switchUser(data, 'user')
      }
    },
    handleSearchSubUser() {
      if (!this.searchSubUserInput) {
        this.searchedSubUserList = this.subUserList
        return
      }
      let searchArr = this.searchSubUserInput.split('')
      let reg = new RegExp(searchArr.join('.*'))
      this.searchedSubUserList = this.subUserList.filter(
        (item) => reg.test(item.username) || reg.test(item.company),
      )
    },
    async selectSubUser(user) {
      const _state = this.$store.state
      await this.$store.dispatch('setBaseInfo', {
        current: user,
        manager: [..._state.manager, _state.current],
        perms: user.perms || [],
      })
      const keys = await getAccesskey(user.username)
      await this.$store.dispatch('setBaseInfo', {
        keys,
      })
      this.switchUser()
    },
    async toIndex(data, router = '/overview') {
      await this.$store.dispatch('setBaseInfo', data)
      await this.$store.dispatch('setToken', data.token)
      this.$http.defaults.headers.common['Authorization'] = data.token
      await this.$store.dispatch('cleanState')

      this.$router.push(this.isSub ? '/bucket' : router)
      Vue.config.lang = this.lang
    },
    async switchUser(data = {}, router = '/overview') {
      Object.keys(data).length > 0 &&
        (await this.$store.dispatch('setBaseInfo', data))
      await this.$store.dispatch('cleanState')

      this.$router.push(this.isSub ? '/bucket' : router)
      Vue.config.lang = this.lang
    },
    changeLang(lang) {
      Vue.config.lang = lang
      this.lang = lang
      sessionStorage.removeItem('lang')
      sessionStorage.setItem('lang', lang)
    },
    refreshMenu() {
      this.$store.dispatch('refreshMenu')
    },
    showPw() {
      let $input = $('.input-password')[0]
      if ($input.type === 'password') {
        this.showPassword = true
        $input.type = 'text'
      } else {
        this.showPassword = false
        $input.type = 'password'
      }
    },
    formValid(name) {
      let isValid = true
      _.each($(this.$refs[name]).find('input'), (input) => {
        if (!input.validity.valid) {
          isValid = false
        }
      })
      return isValid
    },
    keep() {
      localStorage.setItem('keepEmail', this.keepEmail)
    },
    async toUserMange() {
      const _state = this.$store.state
      _state.manager.length > 0 &&
        (await this.$store.dispatch('setBaseInfo', {
          current: _state.manager[0],
          perms: _state.manager[0].perms,
        }))
      const keys = await getAccesskey(this.$store.state.current.username)
      await this.$store.dispatch('setBaseInfo', { keys: keys })
      await this.$store.dispatch('cleanState')
      Vue.config.lang = this.lang
      this.$router.push('user')
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';
@login-card-height: 600px;
@login-card-width: 900px;
@login-card-padding: 48px;
@login-card-bg: #2e373e;
@login-card-language-select-background: #384549;
@login-card-login-text-color: #8492a6;
@login-card-login-input-invalid-text-color: #d75000;
@login-card-login-input-width: 380px;
@login-card-register-item-width: 180px;
@login-card-register-item-height: 80px;
@login-card-register-text-color: #c0ccda;
@login-card-register-input-backgrand: #414d56;
@login-card-register-input-backgrand-hover: #52626d;

.@{css-prefix}login {
  .wh(100%, 100%);
  .fb(center, center);
  background: #a1c2d0 no-repeat;
  background-size: cover;

  .card-login {
    position: relative;
    .wh(@login-card-width, @login-card-height);
    background-color: @login-card-bg;
    padding: 40px @login-card-padding;

    .tab-login {
      .header {
        height: 25px;

        & > img {
          float: left;
        }

        & > span {
          .sc(18px, #fff);
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
            border-color: transparent transparent @login-card-login-text-color
              transparent;
          }

          div.border-triangle {
            display: block;
            position: absolute;
            left: 60px;
            top: -20px;
            width: 0px;
            height: 0px;
            border: 10px solid;
            border-color: transparent transparent
              @login-card-language-select-background transparent;
          }

          & > span {
            position: relative;
            top: -34px;
            display: inline-block;
            .wh(80%, 28px);
            line-height: 28px;
            .sc(14px, @login-card-login-text-color);
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
            .fb(flex-start, flex-end, flex);
            .wh(@login-card-login-input-width, 80px);
            border-bottom: 1px solid @login-card-login-text-color;

            & > span {
              flex: 1;
            }

            input {
              height: 24px;
              .sc(18px, @login-card-login-text-color);
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
            margin-right: @login-card-width / 2 - @login-card-padding -
              @login-card-login-input-width / 2 + 20px;
            margin-top: 12px;
            .sc(14px, @login-card-login-text-color);
            .fb(flex-end, center, flex);

            input[type='checkbox'] {
              display: none;
            }

            input[type='checkbox'] + label span {
              display: inline-block;
              width: 19px;
              height: 19px;
              margin: -2px 10px 0 0;
              vertical-align: middle;
              background: url('../../assets/login-checkbox.png') no-repeat left
                center;
              cursor: pointer;
            }

            input[type='checkbox']:checked + label span {
              background: url('../../assets/login-checkbox-checked.png')
                no-repeat left center;
            }

            & > label {
              cursor: pointer;
            }
          }

          .login {
            margin-top: 24px;

            a {
              display: inline-block;
              line-height: 40px;
              .wh(280px, 40px);
              .sc(18px, #fff);
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
            .sc(14px, #8492a6);

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
        border-bottom: 1px solid #52626d;

        & > img {
          position: absolute;
          left: @login-card-padding;
        }

        & > a {
          .sc(18px, @primary-color);
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
          padding: 10px 0 0 12px;

          .card-wrap {
            display: inline-flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-items: flex-start;
            width: 100%;
          }

          .card-user {
            position: relative;
            .wh(
              @login-card-register-item-width,
              @login-card-register-item-height
            );
            background-color: @login-card-register-input-backgrand;
            border-radius: @common-radius;
            .sc(16px, #fff);
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
              .wh(98%, @login-card-register-item-height / 2 - 15);
              line-height: @login-card-register-item-height / 2 - 15;
              vertical-align: bottom;
              padding: 0 16px;
              text-align: left;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;

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
