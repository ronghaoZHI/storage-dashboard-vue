import { HOST } from './HOST'

const VERSION = '/v1/'

const group = (url) => 'http://' + HOST.apiHost + VERSION + url

export const LOGIN = group('auth/login')
export const LOGOUT = group('auth/logout')
export const REPASSWORD = group('user/update/password')
export const USERINFO = group('profile')
export const ACCESSKEY = group('accesskey')
export const CREATE_USER = group('administrator/create/user')
export const REDIRECT_BUCKET = group('administrator/redirect/bucket')
export const NODE = group('administrator/list/node')
export const PARTITION = group('administrator/list/partition')
export const getAnalysisUrl = (url) => group(`analysis/${url}`)
