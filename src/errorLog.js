import Vue from 'vue'
import store from './store'

Vue.config.errorHandler = function(err, vm, info) {
  if (process.env.NODE_ENV === 'production') {
    Vue.nextTick(() => {
      store.dispatch('addErrorLog', {
        err,
        vm,
        info,
        url: window.location.href,
      })
      console.error(err, info) // eslint-disable-line no-console
    })
  }
}
