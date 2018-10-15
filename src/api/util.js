import { HOST } from '@/service/HOST'
import store from '@/store'

const HTTP_VERSION = `${location.protocol}//`
const VERSION = '/v2/'
const VERSION_TRANSCODER = '/2012-09-25/'

export const group = (url, customer = false, bucket = false) =>
  `${HTTP_VERSION}${HOST.apiHost}${VERSION}${url}${
    customer ? '?customer=' + store.state.current.username : ''
  }${
    customer
      ? bucket
        ? '&bucket=' + bucket
        : ''
      : bucket
        ? '?bucket=' + bucket
        : ''
  }`
export const groupSSO = (url) => `${HOST.ssoHost}/web/${url}`
export const groupTranscoder = (url) =>
  `${HTTP_VERSION}${HOST.transcoderHOST}${VERSION_TRANSCODER}${url}`
export const groupImgx = (url) => `${HTTP_VERSION}${HOST.imgxHOST}${url}`
