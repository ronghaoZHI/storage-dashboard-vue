<template>
  <div class="bsc-login"
       @keyup.enter="loginSubmit('loginForm')">
    <Spin size="large"
          fix
          v-if="spinShow"></Spin>
    <div class="tab-login"
         v-if="!showSelectUser">
      <div class="header">
        <img src="../../assets/portal_logo.png"
             alt="logo" />
        <span>{{$t("LOGIN.LANGUAGE")}}</span>
        <div class="select-language">
          <div class="border-triangle-external"></div>
          <div class="border-triangle"></div>
          <span @click="changeLang('en')">English</span>
          <span @click="changeLang('cn')">中文</span>
        </div>
      </div>
      <div class="body">
        <span class="slogn">WELCOME TO<br />THE BAISHANCLOUD DIGITAL WORLD</span>
        <form class="form-login"
              v-model="loginForm"
              ref="loginForm">
          <div class="email">
            <span>
              <Icon type="ios-person"
                    :size="18"></Icon>
            </span>
            <input v-bfocus
                   type="text"
                   v-model="loginForm.username"
                   required
                   autofocus
                   :placeholder="$t('LOGIN.USERNAME')"
                   minlength="2"
                   id="username" />
          </div>
          <div class="password">
            <span>
              <Icon type="unlocked"
                    :size="18"></Icon>
            </span>
            <input v-bfocus
                   class="input-password"
                   type="password"
                   v-model="loginForm.password"
                   required
                   minlength="6"
                   :placeholder="$t('LOGIN.USERPWD')"
                   id="password" />
            <span @click="showPw"
                  :class="{ showPw:showPassword }">
              <Icon type="eye"
                    :size="18"></Icon>
            </span>
          </div>
          <div class="checkCode"
               v-if="needCheckCode">
            <span>
              <Icon type="key"
                    :size="18"></Icon>
            </span>
            <input v-bfocus
                   class="input-checkCode"
                   type="text"
                   v-model="loginForm.checkCode"
                   :required=needCheckCode
                   minlength="5"
                   :placeholder="$t('LOGIN.CHECKCODE')"
                   id="checkCode" />
            <span @click.stop="changeCheckCode">
              <img class="checkCodeImg"
                   :src="checkCodeUrl"
                   alt="验证码">
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
            <Button class="login-button"
                    :loading="isSubmiting"
                    @click.stop="loginSubmit('loginForm')">{{$t("LOGIN.BUTTON_LOGIN")}}</Button>
          </div>
          <div class="register dn">
            没有账号？
            <a>立即申请</a>
          </div>
        </form>
      </div>
      <div class="footer">
        <div class="foot-text">
          Copyright © 2015-{{currentYear}} BaishanCloud. All rights Reserved.
        </div>
      </div>
    </div>

    <div class="card-login">
      <div class="tab-register"
           v-if="showSelectUser">
        <div class="header">
          <img src="../../assets/logo.png"
               alt="logo" />
          <Input v-if="subUserList.length > 0"
                 v-model="searchSubUserInput"
                 @on-change="handleSearchSubUser"
                 placeholder="search here"
                 class="search-input" />
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
                  <Icon type="person"></Icon> {{user.username}}
                </span>
                <span class="info">
                  <Icon type="briefcase"></Icon> {{user.company}}
                </span>
                <span class="icon"
                      v-show="user.type && user.type===1">
                  <Icon type="star"></Icon>
                </span>
              </div>
            </div>
            <div v-if="subUserList.length === 0 && !this.userFetching"
                 class="warning"
                 @click="toUserMange()">暂无绑定用户,
              <span>点击绑定或新增用户</span>
            </div>
            <div v-else-if="this.userFetching"
                 class="warning">
              <Spin size="large"
                    fix></Spin>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="openSmsModel"
           title="验证信息"
           ok-text="确定"
           @on-ok="loginBySms"
           :styles="{top:'330px',width:'385px'}">
      <div class="sms-model-wrap"
           @keyup.enter="loginBySms()">
        <span class="sms-tip">{{ smsTextTip }}</span>
        <div class="sms-input-wrap">
          <span style="">验证码：</span>
          <Input size="large"
                 type="text"
                 v-model="smscode"
                 :maxlength=6
                 autofocus
                 placeholder="message number"
                 class="sms-input" />
        </div>
        <span class="sms-send-tip">没有收到手机短信验证码？请尝试
          <a v-show="sending">发送中...</a>
          <a v-show="!sending"
             @click.stop="sendSms">再次发送</a>
        </span>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  loginByUsername,
  getAccesskey,
  getUserInfo,
  postLoginSSO,
  getCheckCodeUrl,
  getCheckSms,
  getSendSms,
  postCheckLogin,
} from 'api'
import { checkRole, logout } from 'helper'
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
      spinShow: false,
      currentYear: new Date().getFullYear().toString(),
      smscode: '',
      isSubmiting: false,
      sending: false,
      smsTextTip: '',
      needCheckCode: false,
      checkCodeUrl: '',
      openSmsModel: false,
      lang: store.state.lang,
      selectedCustomer: '',
      keepEmail: JSON.parse(localStorage.getItem('keepEmail')) || false,
      loginForm: {
        username: localStorage.getItem('loginEmail'),
        password: '',
        checkCode: '',
      },
      showPassword: false,
      userFetching: false,
      searchSubUserInput: '',
      searchedSubUserList: [],
    }
  },
  beforeRouteEnter(to, from, next) {
    next(
      (vm) =>
        window.dashboard_conf.onlineMode !== 'False' &&
        !from.name &&
        vm.initCheck(),
    )
  },
  created() {
    if (window.dashboard_conf.onlineMode === 'False') {
      this.needCheckCode = false
    }
    this.searchedSubUserList = this.subUserList
  },
  computed: {
    subUserList: {
      get() {
        return this.$store.getters.users || []
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
  },
  methods: {
    async initCheck() {
      try {
        this.spinShow = true
        let { isLogin, captcha, ticket } = await postCheckLogin()
        this.needCheckCode = captcha
        await Promise.all([
          ticket && this.$store.dispatch('setBaseInfo', { token: ticket }),
          captcha && this.changeCheckCode(),
          isLogin && this.getInfo(),
        ])
        this.spinShow = false
      } catch (error) {
        this.spinShow = false
      }
    },
    loginBySms() {
      this.openSmsModel = false
      getCheckSms(parseInt(this.smscode)).then(
        (res) => {
          let { ticket } = res
          this.$store.state.token = ticket
          return this.saveToken()
        },
        async (err) => {
          let { message, code } = err
          if (code === -4001) {
            this.smsTextTip = message
            ;[this.openSmsModel, this.sending, this.smscode] = [
              false,
              false,
              '',
            ]
            await this.changeCheckCode()
            this.loginForm = {
              ...this.loginForm,
              checkCode: '',
            }
          } else if (code === -1) {
            this.$Message.error(message)
            this.openSmsModel = true
            this.smscode = ''
          }
        },
      )
    },
    sendSms() {
      this.sending = true
      getSendSms().then((err) => {
        let { message, code } = err
        if (code && message) {
          this.sending = false
        }
      })
    },
    async loginSubmit(name) {
      if (this.formValid(name)) {
        this.keepEmail
          ? localStorage.setItem('loginEmail', this.loginForm.username)
          : localStorage.setItem('loginEmail', '')
        try {
          this.isSubmiting = true
          window.dashboard_conf.onlineMode === 'True'
            ? this.saveToken()
            : loginByUsername({
                username: this.loginForm.username,
                password: this.loginForm.password,
              }).then(async (res) => {
                await this.setBaseInfo(res)
                let keys = await getAccesskey()
                return this.$store.dispatch('setBaseInfo', { keys: keys })
              })
        } catch (error) {
          this.isSubmiting = false
        }
      } else {
      }
    },
    async saveToken() {
      let _token = this.$store.state.token
      if (_token) {
        return this.setInfo(_token)
      } else {
        return this.getTicketSSO()
      }
    },
    async getInfo() {
      let _token = this.$store.state.token
      if (!_token) {
        return
      } else {
        return this.setInfo(_token)
      }
    },
    async setInfo(_token) {
      await this.$store.dispatch('setToken', _token)
      try {
        await this.setBaseInfo({
          ...(await getUserInfo()),
          token: _token,
        })
        const keys = await getAccesskey()
        await this.$store.dispatch('setBaseInfo', { keys: keys })
      } catch (error) {
        this.$Message.error(error.message)
        logout()
      }
    },
    async getTicketSSO() {
      const data = {
        appId: window.dashboard_conf.appID,
        name: this.loginForm.username,
        pwd: this.loginForm.password,
        keepLogin: false,
        language: 1,
      }
      this.needCheckCode
        ? Object.assign(data, { captcha: this.loginForm.checkCode })
        : data
      return await postLoginSSO(data).then(
        (res) => {
          let { ticket } = res
          this.$store.state.token = ticket
          return this.saveToken()
        },
        async (err) => {
          this.isSubmiting = false
          let { message, code } = err
          await this.changeCheckCode()
          if (code === -4000) {
            this.smsTextTip = message
            this.openSmsModel = true
          } else if (code === -1002) {
            this.needCheckCode = true
            this.$Message.error(message)
          } else if (code === -1) {
            this.$Message.error(message)
          }
          return Promise.reject(err)
        },
      )
    },
    async changeCheckCode() {
      this.checkCodeUrl = await getCheckCodeUrl()
    },
    async setBaseInfo(res) {
      this.$store
        .dispatch('setBaseInfo', {
          current: res,
          token: res.token,
          perms: res.perms || [],
        })
        .then(() => {
          checkRole(['LIST_USERS', 'SUB', 'BIND_USER'])
            ? this.adminMode(res)
            : checkRole('OPS')
              ? this.toIndex(res, '/system/group')
              : this.toIndex(res)
        })
    },
    async adminMode(data) {
      let res
      try {
        this.userFetching = true
        await this.$store.dispatch('setToken', data.token)
        this.$store.dispatch('setBaseInfo', { manager: [data] })
        res = await this.$store.dispatch('getUsers')
        this.userFetching = false
      } catch (error) {
        this.userFetching = false
      }
      if (res.length > 0) {
        this.searchedSubUserList = this.subUserList = res
        this.showSelectUser = false
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
        if ($(input).attr('id') === 'username' && !input.validity.valid) {
          this.$Message.error('请核对用户名')
          isValid = false
          return isValid
        } else if (
          $(input).attr('id') === 'password' &&
          !input.validity.valid
        ) {
          this.$Message.error('请核对密码')
          isValid = false
          return isValid
        } else if (
          $(input).attr('id') === 'checkCode' &&
          !input.validity.valid
        ) {
          this.$Message.error('请核对验证码')
          isValid = false
          return isValid
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
@login-card-width: 950px;
@login-card-padding: 48px;
@login-card-bg: #2e373e;
@login-card-language-select-background: #384549;
@login-card-login-text-color: #8492a6;
@login-card-login-input-invalid-text-color: #d75000;
@login-card-login-input-width: 320px;
@login-card-register-item-width: 200px;
@login-card-register-item-height: 80px;
@login-card-register-text-color: #c0ccda;
@login-card-register-input-backgrand: #414d56;
@login-card-register-input-backgrand-hover: #52626d;
@login-bg: #04050e;
.@{css-prefix}login {
  .wh(100%, 100%);
  .fb(center, center);
  // background: #a1c2d0 no-repeat;
  background: @login-bg no-repeat;
  background-size: cover;
  .tab-login {
    .wh(100%, 100%);
    background-color: @login-bg;
    background-image: url(../../assets/bg_sky.jpg);
    background-size: 100%, 100%;
    padding: 35px;
    .header {
      height: 1.6vw;

      & > img {
        float: left;
        height: 1.6vw;
      }

      & > span {
        .sc(1vw, #737e8c);
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
        width: 100px;
        height: 60px;
        border: 1px solid @login-card-login-text-color;
        border-radius: 5px;
        background-color: @login-card-language-select-background;
        position: absolute;
        right: 30px;
        top: 75px;
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
      position: relative;
      z-index: 1;
      min-width: 1210px;
      .slogn {
        color: #b1bbc9;
        display: block;
        margin-top: 5%;
        font-size: 2.3rem;
        font-weight: 500;
        line-height: 2;
      }

      .form-login {
        min-width: 1210px;
        margin-top: 15px;
        .email,
        .password,
        .checkCode {
          margin: 0 auto;
          padding-bottom: 10px;
          .fb(flex-start, flex-end, flex);
          .wh(@login-card-login-input-width, 60px);
          border-bottom: 1px solid @login-card-login-text-color;
          line-height: 1;
          & > span {
            flex: 1;
          }

          input {
            .sc(16px, @login-card-login-text-color);
            background: @login-bg;
            border: 0px;
            padding: 5px 5px 0 5px;
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
        .checkCode {
          input {
            flex: 6;
          }
          .checkCodeImg {
            width: 90px;
            height: 33px;
            position: absolute;
            transform: translate(-90%, -90%);
            cursor: pointer;
          }
        }
        & > span:last-child {
          cursor: pointer;
        }
        .input-focus {
          border-bottom: 2px solid @primary-color;

          & > span:first-child {
            color: @primary-color;
          }
        }

        .keep {
          margin: 12px auto 0 auto;
          clear: both;
          height: 20px;
          width: @login-card-login-input-width;
          font-size: 14px;
          // padding-left: 170px;
          color: #8492a6;
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
            background: url('../../assets/login-checkbox-checked.png') no-repeat
              left center;
          }

          & > label {
            cursor: pointer;
            float: right;
          }
        }

        .login {
          margin-top: 24px;

          .login-button {
            .wh(210px, 36px);
            .sc(18px, #fff);
            cursor: pointer;
            background: rgba(32, 160, 255, 0.35);
            border: 0;
            border-radius: 0;

            &:focus {
              outline-offset: 0;
              outline: -webkit-focus-ring-color auto 0;
            }

            &:hover {
              background-color: rgba(32, 160, 255, 0.45);
              border-color: rgba(32, 160, 255, 0.45);
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
      z-index: 0;
      position: fixed;
      bottom: 0;
      left: 0;
      height: 30%;
      background-image: url('../../assets/bg_earth.png');
      background-size: 100%;
      background-repeat: no-repeat;
      font-size: 14px;
      width: 100%;
      min-width: 1280px;
      color: @login-card-login-text-color;
      .foot-text {
        position: fixed;
        bottom: 50px;
        width: 100%;
        min-width: 1280px;
      }
    }
  }
  .card-login {
    .tab-register {
      position: relative;
      width: 880px;
      background-color: @login-card-bg;
      padding: 20px;
      .header {
        position: relative;
        left: 8px;
        height: 60px;
        width: 824px;
        border-bottom: 1px solid #52626d;

        .search-input {
          width: 300px;
        }
        & > img {
          position: absolute;
          left: 0px;
        }

        & > a {
          .sc(18px, @primary-color);
          position: absolute;
          top: 6px;
          right: 0px;
          cursor: pointer;
        }
      }

      .wrap {
        height: 460px;
        overflow-y: auto;
        margin-right: -8px;

        .body {
          .card-wrap {
            display: inline-flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-items: flex-start;
            width: 100%;
            overflow-y: auto;
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
            margin: 15px 0px 0px 8px;
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
            text-align: center;

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
.sms-model-wrap {
  .sms-tip {
    font-size: 1em;
    display: block;
  }
  .sms-input-wrap {
    line-height: 35px;
    margin-top: 10px;
    padding-top: 2px;

    & > span {
      display: inline-block;
      font-size: 1.1em;
    }
    .sms-input {
      width: 300px;
      height: 40px;
      display: inline-block;
    }
  }
  .sms-send-tip {
    margin-top: 5px;
    font-size: 1em;
    display: block;
  }
}
input:-webkit-autofill {
  box-shadow: 0 0 0 1000px @login-bg inset !important;
  -webkit-text-fill-color: @login-card-login-text-color !important;
}
</style>
