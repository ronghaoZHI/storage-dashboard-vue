import 'es6-promise/auto'

import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store/'
import 'core-js/es6/promise'
import VueI18n from 'vue-i18n'
import iView from 'iview-bsc'
import Bluebird from 'bluebird'
import _ from 'lodash'
import axios from '@/service/request'
import './errorLog'
import { messages } from '@/service/translate'
import $ from 'jquery'
import { getCookie } from '@/service/Helper'
import 'iview-bsc/dist/styles/iview.css'

window._ = _
window.$ = $
window.Promise = Bluebird

Vue.use(VueI18n)
Vue.use(Vuex)
Vue.use(iView)

Vue.config.productionTip = false
Vue.prototype.$http = axios

iView.LoadingBar.config({
  color: '#fff',
  failedColor: '#f0ad4e',
  height: 3,
})

Object.keys(messages).forEach(function(lang) {
  Vue.locale(lang, messages[lang])
})
Vue.config.lang = getCookie('uc_lang') || 'cn'

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app')
