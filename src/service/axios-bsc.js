import axios from 'axios'
import iView from 'iview'
import store from '@/store'
import router from '@/router'
// for cros cookie
axios.defaults.withCredentials = true
axios.interceptors.request.use(config => config, error => Promise.reject(error))
axios.interceptors.response.use(response => response.data, error => {
    if ((error.response && error.response.status === 401) || error.message === 'Network Error') {
        iView.Message.warning(error.response ? error.message : 'Need login again')
        store.dispatch('logout').then(res => {
            router.push({
                path: '/login',
                query: { redirect: router.fullPath }
            })
        })
    } else if (error.request) {
        iView.Message.warning('The network may be broken, please try again')
    } else {
        iView.Message.error(error.response.data.error)
    }
    return Promise.reject(error.response.data.error)
})

export default axios
