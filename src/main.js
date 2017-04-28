import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store/'
import 'core-js/es6/promise'
import iView from 'iview'
import Bluebird from 'bluebird'
import 'iview/dist/styles/iview.css'
import _ from 'lodash'
import axios from './components/service/axios-bsc'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'

window._ = _
window.Promise = Bluebird
Vue.use(Vuex)
Vue.use(iView)
Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.component('chart', ECharts)


new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: { App }
});