import axios from 'axios'
import iView from 'iview-bsc'
import store from '@/store'
import { aws4 } from '@/service/aws4/aws4'
import { getKey } from '@/service/Aws'
import { logout, isSSOLogin } from '@/service/Helper'

const STATUS_CODE = {
    '400': 'INVALID REQUEST',
    '401': 'Unauthorized',
    '403': 'Forbidden',
    '404': 'NOT FOUND',
    '500': 'SERVER ERROR'
}

// for cros cookie
axios.interceptors.request.use(config => {
    return requestConf(config)
}, error => Promise.reject(error))
axios.interceptors.response.use(response => errorHandle(response.data), error => {
    if ((error.response && error.response.status === 401) || error.message === 'Network Error') {
        logout('The network may be broken')
    } else if (error.request) {
        iView.Message.warning('The network may be broken, please try again')
    } else {
        iView.Message.error(error.response.data.error)
    }
    console.log('response', error)
    return Promise.reject(error.response.data.error)
})

// set storage-api token
axios.defaults.headers.common['Authorization'] = store.state.token


async function requestConf (config) {
    // transcoder url ? getTranscoderUrlConfig : isLogin(SSO) ? next : login
    return /transcoder-ss.bscstorage.com/.test(config.url) ? getTranscodeUrlConfig(config) : isSSOLogin ? config : logout('Login status is invalid')
}

async function getTranscodeUrlConfig (config) {
    let headers = await getS3ByHttpHeaders(config)
    config.headers.Authorization = headers.Authorization
    config.headers['Content-Type'] = headers['Content-Type']
    config.headers['X-Amz-Date'] = headers['X-Amz-Date']
    config.withCredentials = false
    return config
}

// get aws sign for http request 
// transcode need some params that can't sent by aws sdk
async function getS3ByHttpHeaders (config) {
    let key = await getKey()
    let signed = aws4.sign({
        host: config.url.split('http://')[1].split('/')[0],
        method: config.method.toUpperCase(),
        path: config.url.split('.com')[1],
        body: JSON.stringify(config.data)
    }, {
        secretAccessKey: key.secretkey,
        accessKeyId: key.accesskey
    })
    return signed.headers
}

// storage-api convert error to success
function errorHandle (data) {
    if (data.error) {
        !data.error.retryable ? logout(STATUS_CODE[`${data.error.status_code}`] + ',' + data.error.show_msg) : iView.Message.error(data.error.show_msg)
        return Promise.reject(data.error)
    } else {
        return data.data || data
    }
}

export default axios
