<template>
  <div class="bsc-header">
    <div class="layout-header"
         :class="{'layout-header-mini': miniMenu}">
      <div class="layout-header-left">
        <a @click="getCDNUrl()">{{$t('NAV.CDN')}}</a>
        <a disabled
           class="active">{{$t('NAV.CWN')}}</a>
        <Tooltip :content="$t('OVERVIEW.COMING_SOON')"
                 placement="bottom">
          <a disabled>{{$t('NAV.CLN')}}</a>
        </Tooltip>
      </div>
      <div class="layout-header-right">
        <div class="button-document"
             @click="openDoc">
          <Tooltip :content="$t('STORAGE.DOCUMENTATION')"
                   placement="bottom">
            <Icon type="help-circled"
                  :size="24"></Icon>
          </Tooltip>
        </div>
        <div class="button-document">
          <i-switch v-model="lang"
                    @on-change="toggleLanguage">
            <span slot="open">中</span>
            <span slot="close">EN</span>
          </i-switch>
        </div>
        <div class="button-document"
             @click="toggleTheme">
          <Tooltip :content="$t('STORAGE.TOGGLE_THEME')"
                   placement="bottom">
            <Icon type="android-color-palette"
                  :size="24"></Icon>
          </Tooltip>
        </div>
        <Dropdown style="margin-left:20px"
                  @on-click="menuClick"
                  placement="bottom-end">
          <a class="dropdown-link"
             href="javascript:void(0)">{{uname}}</a>
          <Icon type="chevron-down"
                class="icon-top-down"></Icon>
          <Dropdown-menu slot="list">
            <Dropdown-item v-show="isAdminMode"
                           name="selectSubUser">{{$t("NAV.RESELECT_USER")}}</Dropdown-item>
            <Dropdown-item name="rePasssword">{{$t("NAV.CHANGE_PASSWORD")}}</Dropdown-item>
            <Dropdown-item name="logout">{{$t("NAV.LOGOUT")}}</Dropdown-item>
          </Dropdown-menu>
        </Dropdown>
      </div>
    </div>
    <Modal v-model="rePasswordModal"
           :title="$t('NAV.CHANGE_PASSWORD')"
           @on-ok="changePassword"
           @on-cancel="rePasswordModal = false">
      <Form ref="rePasswordForm"
            :model="rePasswordForm"
            :rules="ruleValidate"
            :label-width="90">
        <Form-item :label="$t('LOGIN.KEY')"
                   prop="password">
          <Input v-model="rePasswordForm.password"
                 :placeholder="$t('NAV.NEW_PASSWORD')" />
        </Form-item>
      </Form>
    </Modal>
  </div>
</template>
<script>
import Vue from 'vue'
import { BOUND_USER } from '@/service/API'
import { repassword } from 'api/login'
import { clear } from '@/service/Aws'
import { logout, getCookie, createCookie, checkRole } from 'helper'
import store from '@/store'
export default {
  data() {
    return {
      rePasswordModal: false,
      lang: store.state.lang === 'cn',
      cdnUrl: getCookie('uc_cdn_auth') === '1',
      rePasswordForm: {
        password: '',
      },
      ruleValidate: {
        password: [
          {
            required: true,
            len: 6,
            message: 'Requires 6 charactors',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  computed: {
    uname() {
      return this.$store.state.current.username
    },
    theme() {
      return this.$store.state.theme
    },
    miniMenu() {
      return this.$store.state.miniMenu
    },
    isAdminMode() {
      return checkRole('LIST_USERS', this.$store.getters.mode === 'manage')
    },
  },
  methods: {
    async menuClick(name) {
      if (name === 'logout') {
        logout()
      } else if (name === 'rePasssword') {
        this.rePasswordModal = true
      } else if (name === 'selectSubUser') {
        let res = await this.$http.get(BOUND_USER)
        this.$store.dispatch('setBaseInfo', { users: res })
        await clear()
        const bundUserPath =
          window.dashboard_conf.onlineMode === 'True' ? '/bridge' : '/login'
        this.$router.push(bundUserPath)
      }
    },
    getCDNUrl() {
      window.location = !this.cdnUrl
        ? 'https://portal.qingcdn.com/products/cdnx/index.html'
        : 'https://portal.baishancloud.com'
    },
    async changePassword() {
      if (this.rePasswordForm.password.length < 6) {
        this.$Message.error(this.$t('NAV.PASSWORD_CHECK'))
        return false
      }
      try {
        await repassword({
          email: store.state.current.email,
          password: this.rePasswordForm.password,
        })
        logout()
      } catch (error) {
        console.log(error)
        this.$Message.error(this.$t('NAV.CHANGE_PASSWORD_FAILED'))
      }
    },
    openDoc() {
      window.open('http://doc.bscstorage.com')
    },
    toggleLanguage(bol) {
      let lang = bol ? 'cn' : 'en'
      Vue.config.lang = lang
      createCookie('uc_lang', lang)
    },
    async toggleTheme() {
      await this.$store.dispatch(
        'toggleTheme',
        this.$store.state.theme === 'dark' ? 'white' : 'dark',
      )
      if (this.$store.state.theme === 'dark') {
        $('body').addClass('dark')
      } else {
        $('body').removeClass('dark')
      }
    },
  },
}
</script>
<style lang="less" scoped>
.@{css-prefix}header {
  .layout-header {
    .fb(space-between, center);
    .wh(100%, 60px);
    background: #20a0ff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    position: fixed;
    z-index: 1000;
    padding-right: @layout-margin-left;

    .layout-header-left {
      a {
        display: inline-block;
        line-height: 60px;
        .sc(18px, #d3ebfb);
        font-weight: 500;
        .wh(140px, 60px);
        background-repeat: no-repeat;
        background-size: 30px 30px;
        background-position: 20px center;
        padding-left: 60px;

        &:active {
          background-color: #1b8de2;
          color: #fff;
        }
      }

      & > a:nth-child(1) {
        background-image: url('../../assets/CDN.svg');
      }

      & > a.active {
        background-image: url('../../assets/CWN-active.svg');
      }

      & > div a {
        background-image: url('../../assets/CLN.svg');
      }

      .active {
        background-color: #1b8de2;
        color: #fff;
      }
    }

    .layout-header-right {
      margin-right: 16px;
      .fb(center, center);

      .button-document {
        .sc(22px, @menu-text-color);
        font-weight: bolder;
        padding: 0 20px;
        border-right: 1px solid #1b8de2;
        cursor: pointer;
        i {
          position: relative;
          top: 2px;
        }
      }

      .icon-top-down {
        .sc(18px, @menu-text-color);
        padding-left: 8px;
      }
    }
    .dropdown-link {
      .sc(16px, @menu-text-color);
    }
  }
  .layout-header-mini {
    padding-right: 60px;
  }
}
</style>
<style lang="less">
.bsc-switch .bsc-switch-checked {
  border-color: #fff;
}
</style>
