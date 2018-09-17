import { group, groupSSO } from './util'
import request from '@/service/request'

export function updateUser(data) {
  return request(group('sso/sso_update/user'), {
    method: 'post',
    data,
  })
}

export function postCheckLogin() {
  return request(groupSSO('app/user/checkLogin'), {
    method: 'post',
    data: {
      appId: window.dashboard_conf.appID,
    },
  })
}

export function postLoginSSO(data) {
  return request(groupSSO('app/user/login'), {
    method: 'post',
    data,
  })
}

export function getCheckCodeUrl() {
  return groupSSO(`captcha?t=${new Date().toString()}`)
}

export function getCheckSms(data) {
  return request(groupSSO('app/smscode/check'), {
    method: 'get',
    data,
  })
}

export function getSendSms() {
  return request(groupSSO('app/smscode/send'), {
    method: 'get',
  })
}

export function ssoLogout() {
  return request(groupSSO('app/user/logout'), {
    method: 'get',
  })
}
