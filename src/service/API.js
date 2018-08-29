import { HOST } from './HOST'

const HTTP_VERSION = `${location.protocol}//`
const VERSION = '/v2/'
const VERSION_TRANSCODER = '/2012-09-25/'

const group = (url) => HTTP_VERSION + HOST.apiHost + VERSION + url
const groupTranscoder = (url) =>
  HTTP_VERSION + HOST.transcoderHOST + VERSION_TRANSCODER + url
const groupImgx = (url) => HTTP_VERSION + HOST.imgxHOST + url

export const LOGIN = group('auth/login')
export const LOGOUT = group('auth/logout')
export const REPASSWORD = group('user/update/user')
export const USERINFO = group('profile')
export const getAccesskey = (username = '') =>
  group(username ? `accesskey?customer=${username}` : 'accesskey')
export const getSSOLoginUrl = (callback = '') =>
  `https://uc.baishancloud.com/web/user/checkLogin?language=1&appId=${
    window.dashboard_conf.appID
  }`
export const SSO_LOGOUT = `https://uc.portal.baishancloud.com/web/user/logout?language=1&appId=${
  window.dashboard_conf.appID
}`

export const SSO_UPDATE_USER = group('sso/sso_update/user')

export const REDIRECT_BUCKET = group('user/redirect/bucket')
export const NODE = group('node/list')
export const PARTITION = group('list/partition')
export const SUB_USER = group('user/list/sub')
export const CREATE_SUB_USER = group('user/create/sub_user')
export const SUB_USER_ACL = group('user/list/sub_acl')
export const UPDATE_SUB_USER_ACL = group('user/update/sub_acl')
export const CREATE_USER = group('user/create/user')
export const BOUND_USER = group('user/list/bound_user')
export const ALL_USER = group('user/list/user')
export const BIND_USER = group('user/bind/user')
export const UNBIND_USER = group('user/unbind/user')

export const GROUP_LIST = group('group/list')
export const GROUP_MOVE = group('group/move')
export const GROUP_READ_ONLY = group('group/read_only')

export const TRAFFIC_LIST = group('traffic/list')

export const PARTITION_IDC_LIST = group('partition/used/stats')
export const PARTITION_USED_DETAIL = group('partition/used/detail')
export const PARTITION_USED_LIST = group('partition/used/list')
export const PARTITION_USED_SET = group('partition/used/set')
export const PARTITION_USED_MOVE = group('partition/used/move')
export const PARTITION_USED_DELETED = group('partition/used/delete')
export const PARTITION_UNUSED_LIST = group('partition/unused/list')
export const PARTITION_UNUSED_ADD = group('partition/unused/add')
export const PARTITION_DELETED_LIST = group('partition/deleted/list')

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
