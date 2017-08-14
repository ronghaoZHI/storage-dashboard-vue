import axios from 'axios'
import iView from 'iview'
import store from '@/store'
import router from '@/router'
import {aws4} from '@/service/aws4/aws4'
import { getKey } from '@/service/Aws'
// for cros cookie
axios.defaults.withCredentials = true
axios.interceptors.request.use(async(config) => {
    if (/transcoder-ss\.bscstorage\.com/.test(config.url)) {
        config.headers = await getHeaders(config)
        config.withCredentials = false
    }
    return config
}, error => Promise.reject(error))
axios.interceptors.response.use(response => response.data, error => {
    if ((error.response && error.response.status === 401) || error.message === 'Network Error') {
        iView.Message.warning('Need login again')
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
const getHeaders = async(config) => {
    let key = await getKey()
    let myMethod = config.method.toUpperCase()
    let myPath = config.url.split('.com')[1]
    let myHost = config.url.split('http://')[1].split('/')[0]
    const data = config.data
    let signed = aws4.sign({
        host: myHost,
        method: myMethod,
        path: myPath,
        body: JSON.stringify(data)
    }, {
        secretAccessKey: key.secretkey,
        accessKeyId: key.accesskey
    })
    return signed.headers
}
export default axios
