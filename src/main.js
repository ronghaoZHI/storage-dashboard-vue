import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store/'
import 'core-js/es6/promise'
import VueI18n from 'vue-i18n'
import iView from 'iview'
import Bluebird from 'bluebird'
import 'iview/dist/styles/iview.css'
import _ from 'lodash'
import axios from './components/service/axios-bsc'
import { messages } from './components/service/translate'

window._ = _
window.Promise = Bluebird
Vue.use(VueI18n)
Vue.use(Vuex)
Vue.use(iView)
Vue.config.productionTip = false
Vue.prototype.$http = axios
Object.keys(messages).forEach(function(lang) {
    Vue.locale(lang, messages[lang])
})
new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: { App }
});