import { group } from './util'
import request from '@/service/request'

export function updateUser(data) {
  return request(group('sso/sso_update/user'), {
    method: 'post',
    data,
  })
}

export function getSSOLoginUrl() {
  return `https://uc.baishancloud.com/web/user/checkLogin?language=1&appId=${
    window.dashboard_conf.appID
  }`
}

export function ssoLogout() {
  return `https://uc.portal.baishancloud.com/web/user/logout?language=1&appId=${
    window.dashboard_conf.appID
  }`
}
