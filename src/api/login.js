import { group } from './util'
import request from '@/service/request'

export function loginByUsername(data) {
  return request(group('auth/login'), {
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request(group('profile'), {
    method: 'get',
  })
}
