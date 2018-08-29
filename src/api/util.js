import { HOST } from '@/service/HOST'

const HTTP_VERSION = `${location.protocol}//`
const VERSION = '/v2/'
const VERSION_TRANSCODER = '/2012-09-25/'

export const group = (url, customer = '') =>
  `${HTTP_VERSION}${HOST.apiHost}${VERSION}${url}${
  customer ? '?customer=' + customer : ''
  }`
export const groupTranscoder = (url) =>
  `${HTTP_VERSION}${HOST.transcoderHOST}${VERSION_TRANSCODER}${url}`
export const groupImgx = (url) => `${HTTP_VERSION}${HOST.imgxHOST}${url}`
