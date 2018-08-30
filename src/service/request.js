import axios from 'axios'
import iView from 'iview-bsc'
import store from '@/store'
import { aws4 } from '@/service/aws4/aws4'
import { getKey } from '@/service/Aws'
import { logout, isSSOLogin } from '@/service/Helper'
import createError from './createError'
import { sentMessage } from './Helper'

const STATUS_CODE = {
  401: '抱歉，您貌似还没有登录',
  403: '抱歉，您没有权限访问该页面',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
}

// get aws sign for http request
// transcode need some params that can't sent by aws sdk
async function getS3ByHttpHeaders(config) {
  let key = await getKey()
  let signed = aws4.sign(
    {
      host: config.url.split('//')[1].split('/')[0],
      method: config.method.toUpperCase(),
      path: config.url.split('.com')[1],
      body: JSON.stringify(config.data),
    },
    {
      secretAccessKey: key.secretkey,
      accessKeyId: key.accesskey,
    },
  )
  return signed.headers
}

async function getTranscodeUrlConfig(config) {
  let headers = await getS3ByHttpHeaders(config)
  config.headers.Authorization = headers.Authorization
  config.headers['Content-Type'] = headers['Content-Type']
  config.headers['X-Amz-Date'] = headers['X-Amz-Date']
  config.withCredentials = false
  return config
}

async function requestConf(config) {
  // transcoder url ? getTranscoderUrlConfig : isLogin(SSO) ? next : login
  return /transcoder-ss\.bscstorage\.com/.test(config.url)
    ? getTranscodeUrlConfig(config)
    : isSSOLogin
      ? config
      : logout('Login status is invalid')
}

let http = axios.create()

// for cros cookie
http.interceptors.request.use(
  (config) => {
    return requestConf(config)
  },
  (error) => Promise.reject(error),
)

// storage-api convert error to success
function errorHandle(data) {
  if (data.error && data.error.status_code >= 400) {
    const [code, msg] = [
      STATUS_CODE[data.error.status_code] || '',
      data.error.show_msg || data.error.msg.message || data.error.msg,
    ]
    sentMessage(msg, data)
    iView.Message.error(`${code} ${msg}`, 1000)
    return Promise.reject(data.error)
  } else {
    return data.data || data
  }
}

http.interceptors.response.use(
  (response) => errorHandle(response.data),
  createError,
)

// set storage-api token
http.defaults.headers.common['Authorization'] = store.state.token

export default http
