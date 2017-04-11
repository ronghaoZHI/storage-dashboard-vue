import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store/'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import _ from 'lodash'
import axios from './components/service/axios-bsc'

window._ = _
Vue.use(Vuex)
Vue.use(iView)
Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: { App }
});