import axios from 'axios'
import iView from 'iview'
import store from '@/store'
import {aws4} from '@/service/aws4/aws4'
import { getKey } from '@/service/Aws'
import { logout, isSSOLogin } from '@/service/Helper'

// for cros cookie
axios.interceptors.request.use(config => {
    return /transcoder-ss.bscstorage.com/.test(config.url) ? getConfig(config) : isSSOLogin ? config : logout('Login status is invalid')
}, error => Promise.reject(error))
axios.interceptors.response.use(response => errorHandle(response.data), error => {
    if ((error.response && error.response.status === 401) || error.message === 'Network Error') {
        logout('The network may be broken')
    } else if (error.request) {
        iView.Message.warning('The network may be broken, please try again')
    } else {
        iView.Message.error(error.response.data.error)
    }
    return Promise.reject(error.response.data.error)
})

const getConfig = async (config) => {
    let headers = await getHeaders(config)
    config.headers.Authorization = headers.Authorization
    config.headers['Content-Type'] = headers['Content-Type']
    config.headers['X-Amz-Date'] = headers['X-Amz-Date']
    config.withCredentials = false
    return config
}

axios.defaults.headers.common['Authorization'] = store.state.token

const errorHandle = (data) => {
    if (data.error) {
        let code = data.error.status_code
        code === 400 || code === 401 || code === 403 ? logout(data.error.show_msg) : iView.Message.error(data.error.show_msg)
        return Promise.reject(data.error)
    } else {
        return data.data || data
    }
}

const getHeaders = async (config) => {
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
