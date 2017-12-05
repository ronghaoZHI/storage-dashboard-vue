import { HOST } from './HOST'

const VERSION = '/v1/'
const VERSION_TRANSCODER = '/2012-09-25/'

const group = (url) => '//' + HOST.apiHost + VERSION + url
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

export const getAnalysisUrl = (url) => group(`analysis/${url}`)

export const getTranscoderAnalysisUrl = (url) => group(`transcoder/analysis/${url}`)

export const getTranscoderUrl = (url) => groupTranscoder(url)
