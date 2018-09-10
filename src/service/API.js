import { HOST } from './HOST'

const HTTP_VERSION = `${location.protocol}//`
const VERSION = '/v2/'
const VERSION_TRANSCODER = '/2012-09-25/'

const group = (url) => HTTP_VERSION + HOST.apiHost + VERSION + url
const groupTranscoder = (url) =>
  HTTP_VERSION + HOST.transcoderHOST + VERSION_TRANSCODER + url
const groupImgx = (url) => HTTP_VERSION + HOST.imgxHOST + url

export const FETCH_404 = group('retrieve')
export const ACCESS_LIST = group('access')

export const ADD_SERVICE = group('user/add/service')

export const IMGX_PREVIEW = groupImgx('/image-example/')

export const CUSTOM_DOMAIN = group('custom_domain')

export const getAnalysisUrl = (url) => group(`analysis/${url}`)

export const getTranscoderAnalysisUrl = (url) =>
  group(`transcoder/analysis/${url}`)

export const getBillTranscoderUrl = (url) => group(`bill/transcode${url}`)

export const getTranscoderUrl = (url) => groupTranscoder(url)

export const getBillOldUrl = (url) => group(`bill/storage_old${url}`)

export const getBillUrl = (url) => group(`bill/storage${url}`)

export const getBillBandwidthUrl = (url) =>
  group(`bill/storage_bandwidth${url}`)

export const getSuperSubUserUrl = (superName) =>
  group(`superuser/list/sub_user?customer=${superName}`)
