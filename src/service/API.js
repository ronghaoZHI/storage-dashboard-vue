import { HOST } from './HOST'

const VERSION = '/v1/'

const group = (url) => 'http://' + HOST.apiHost + VERSION + url

export const LOGIN = group('auth/login')
export const LOGOUT = group('auth/logout')
export const REPASSWORD = group('user/update/password')
export const USERINFO = group('profile')
export const ACCESSKEY = group('accesskey')
export const sso = (callback = '') => `http://sso.qingcdn.com/web/user/checkLogin?appId=2&callback=${callback}`

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

export const getAnalysisUrl = (url) => group(`analysis/${url}`)
