import { group } from './util'
import request from '@/service/request'

export function loginByUsername(data) {
  return request(group('auth/login'), {
    method: 'post',
    data,
  })
}

export function getUserInfo(customer) {
  return request(group('profile', customer), {
    method: 'get',
  })
}

export function getAccesskey(customer) {
  return request(group('accesskey', customer), {
    method: 'get',
  })
}

export function postAccesskey(customer) {
  return request(group('accesskey', customer), {
    method: 'post',
  })
}

export function deleteAccesskey(params, customer) {
  return request(group('accesskey', customer), {
    method: 'delete',
    params,
  })
}
