import Vue from 'vue'
import Vuex from 'vuex'
import { handler } from '@/service/Aws'
import { getCookie, getUsers } from 'helper'
import createAlert from '@/service/createAlert'
import menu from '../service/menu'

Vue.use(Vuex)

function checkSessionStorage() {
  let _store = JSON.parse(sessionStorage.getItem('store'))
  if (_store && Object.keys(_store).length > 0) {
    return _store
  } else {
    return {
      token: sessionStorage.getItem('token'),
      theme: sessionStorage.getItem('theme') || 'dark',
      lang: getCookie('uc_lang') || 'cn',
      menuList: [],
      miniMenu: false,
      current: {}, // current user
      manager: [], // admin user list.
      users: [], // admin user bound user
      keys: [], // keys for aws sdk
      perms: [], // permission
      buckets: {},
      logs: [],
    }
  }
}

const hasPermission = (role, route) => {
  if (route.meta && route.meta.role) {
    return (
      new Set(route.meta.role.concat(role)).size <
      route.meta.role.length + role.length
    )
  } else {
    return true
  }
}

const getRole = () => {
  // if user's type is subuser, 'user.state.perm'.length === 0
  const perm = store ? store.state.perms || [] : []
  if (Array.isArray(perm)) {
    return perm.length > 0 ? perm : ['SUBUSER']
  } else {
    createAlert('菜单 - 权限字段错误')
    return []
  }
}

const getMenuList = () => {
  const role = getRole()
  const accessMenu = menu.filter((m) => {
    if (hasPermission(role, m)) {
      if (m.children && m.children.length > 0) {
        m.children = m.children.filter((child) => {
          return hasPermission(role, child) ? child : false
        })
        return m
      } else {
        return m
      }
    }
    return false
  })
  return accessMenu
}

const store = new Vuex.Store({
  state: {
    ...checkSessionStorage(),
  },
  actions: {
    setToken({ commit }, token) {
      token.length > 1 && commit('SET_TOKEN', token)
    },
    toggleTheme({ commit }, theme) {
      commit('TOGGLE_THEME', theme)
    },
    refreshMenu({ commit }) {
      commit('REFRESH_MENU')
    },
    toggleMiniMenu({ commit }, miniMenu) {
      commit('TOGGLE_MINIMENU', miniMenu)
    },
    logout({ commit }) {
      commit('LOGOUT')
    },
    cleanState({ commit }) {
      commit('SET_VALUES', { buckets: {} })
      commit('REFRESH_MENU')
    },
    setBaseInfo({ commit }, data) {
      commit('SET_VALUES', data)
    },
    async getBuckets({ commit, state }, forceUpdate = false) {
      if (Object.keys(state.buckets).length === 0 || forceUpdate) {
        let buckets = await handler('listBuckets')
        commit('SET_VALUES', { buckets: buckets })
        return buckets
      } else {
        return state.buckets
      }
    },
    addErrorLog({ commit }, log) {
      commit('ADD_ERROR_LOG', log)
    },
    async getUsers({ commit, state }, update = false) {
      if (Object.keys(state.users).length === 0 || update) {
        let users = await getUsers()
        commit('SET_VALUES', { users })
        return users
      } else {
        return state.users
      }
    },
  },
  mutations: {
    SET_TOKEN(state, token) {
      sessionStorage.setItem('token', token)
      state.token = token
    },
    TOGGLE_THEME(state, theme) {
      state.theme = theme
      sessionStorage.setItem('theme', theme)
    },
    REFRESH_MENU(state) {
      state.menuList = getMenuList()
    },
    TOGGLE_MINIMENU(state, miniMenu) {
      state.miniMenu = miniMenu
      sessionStorage.setItem('miniMenu', miniMenu)
    },
    SET_VALUES(state, data) {
      const _state = Object.assign(state, data)
      sessionStorage.setItem('store', JSON.stringify(_state))
      state = _state
    },
    LOGOUT(state) {
      sessionStorage.removeItem('store')
      sessionStorage.removeItem('token')
      state.token = ''
      state.manager = []
      state.keys = []
      state.users = []
      Object.keys(state.current).forEach((k) => Vue.delete(state.current, k))
    },
    ADD_ERROR_LOG: (state, log) => {
      state.logs.push(log)
    },
  },
  getters: {
    mode: (state) =>
      state.manager.length !== 0 || state.users.length !== 0
        ? 'manage'
        : 'normal',
    isSameUser: (state) =>
      state.manager.length > 0 &&
      state.current.username === state.manager[0].username,
    menuList: (state) => state.menuList,
    buckets(state) {
      return state.buckets.Buckets || []
    },
    users: (state) => {
      return state.users || []
    },
  },
})

export default store
