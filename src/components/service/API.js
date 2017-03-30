import { HOST } from './HOST'

const VERSION = '/v1/'

const group = (url) => 'http://' + HOST.apiHost + VERSION + url

export const LOGIN = group('auth/login')
export const USERINFO = group('profile')
export const ACCESSKEY = group('accesskey')
export const ANALYSIS = group('analysis/{operation}')