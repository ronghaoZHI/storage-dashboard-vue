// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store/'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import _ from 'lodash'

window._ = _
Vue.use(Vuex)
Vue.use(iView)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    next();
})

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish();
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: { App },
});