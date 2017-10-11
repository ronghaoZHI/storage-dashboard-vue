import { HOST } from './HOST'

const VERSION = '/v1/'
const VERSION_TRANSCODER = '/2012-09-25/'

const group = (url) => 'http://' + HOST.apiHost + VERSION + url
const groupTranscoder = (url) => 'http://' + HOST.transcoderHOST + VERSION_TRANSCODER + url

export const LOGIN = group('auth/login')
export const LOGOUT = group('auth/logout')
export const REPASSWORD = group('user/update/password')
export const USERINFO = group('profile')
export const ACCESSKEY = group('accesskey')
export const SSO_CHECK_LOGIN = (callback = '') => `http://uc.baishancloud.com/web/user/checkLogin?language=1&appId=${window.dashboard_conf.appID}`
export const SSO_LOGOUT = `http://uc.baishancloud.com/web/user/logout?language=1&appId=${window.dashboard_conf.appID}`

export const CREATE_USER = group('administrator/create/user')
export const REDIRECT_BUCKET = group('superuser/redirect/bucket')
export const NODE = group('administrator/list/node')
export const PARTITION = group('administrator/list/partition')
export const BOUND_USER = group('administrator/list/bound_user')
export const SUB_USER = group('superuser/list/sub_user')
export const CREATE_SUB_USER = group('superuser/create/sub_user')
export const SUB_USER_ACL = group('superuser/list/sub_user_acl')
export const UPDATE_SUB_USER_ACL = group('superuser/update/sub_user_acl')
export const ALL_USER = group('administrator/list/user')
export const BIND_USER = group('administrator/bind/user')
export const UNBIND_USER = group('administrator/unbind/user')

export const GROUP_LIST = group('group/list')

export const getAnalysisUrl = (url) => group(`analysis/${url}`)

export const getTranscoderAnalysisUrl = (url) => group(`transcoder/analysis/${url}`)

export const getTranscoderUrl = (url) => groupTranscoder(url)
