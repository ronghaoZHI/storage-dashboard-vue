import axios from 'axios'
import store from '@/store'
import { aws4 } from '@/service/aws4/aws4'
import { getKey } from '@/service/Aws'
import { logout, isSSOLogin } from '@/service/Helper'
import createError from './createError'

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
function getSSOUrlConfig(config) {
  config.withCredentials = true
  return config
}
async function requestConf(config) {
  // transcoder url ? getTranscoderUrlConfig : isLogin(SSO) ? next : login
  return /transcoder-ss\.bscstorage\.com/.test(config.url)
    ? getTranscodeUrlConfig(config)
    : /uc\.portal\.baishancloud\.com/.test(config.url)
      ? getSSOUrlConfig(config)
      : isSSOLogin
        ? config
        : logout('Login status is invalid')
}

let http = axios.create()

// for cros cookie
http.interceptors.request.use(
  (config) => {
    // set storage-api token
    if (store.state && !/uc\.portal\.baishancloud\.com/.test(config.url)) {
      config.headers.common['Authorization'] = store.state.token
    }
    return requestConf(config)
  },
  (error) => Promise.reject(error),
)

http.interceptors.response.use((response) => {
  let data = response.data

  if (data && typeof data === 'object') {
    if (data.code) {
      return createError(response)
    }

    return data.data || data
  }
}, createError)

export default http
