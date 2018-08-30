import group from './util'
import request from '@/service/request'

export function updateUser(data, customer) {
  return request(group('/user/update/user', customer), {
    method: 'post',
    data,
  })
}
export function updateSubAcl(data, customer) {
  return request(group('user/update/sub_acl', customer), {
    method: 'post',
    data,
  })
}
export function listBoundUser(customer) {
  return request(group('user/list/bound_user', customer), {
    method: 'get',
  })
}
export function listAllUser(customer) {
  return request(group('user/list/user', customer), {
    method: 'get',
  })
}
export function listSubUser(customer) {
  return request(group('user/list/sub', customer), {
    method: 'get',
  })
}
// user/list/sub_acl?bucket=xxx&customer=xxx
export function listSubAcl() {
  return request(group('user/list/sub_acl'), {
    method: 'get',
  })
}
export function createSub(data, customer) {
  return request(group('user/create/sub', customer), {
    method: 'post',
    data,
  })
}
export function createUser(data, customer) {
  return request(group('user/create/user', customer), {
    method: 'post',
    data,
  })
}
export function redirectBucket(data, customer) {
  return request(group('user/redirect/bucket', customer), {
    method: 'post',
    data,
  })
}
export function bindUser(data, customer) {
  return request(group('user/bind/user', customer), {
    method: 'post',
    data,
  })
}
export function unbindUser(data, customer) {
  return request(group('user/unbind/user', customer), {
    method: 'post',
    data,
  })
}
export function removeSub(data, customer) {
  return request(group('user/remove/sub', customer), {
    method: 'post',
    data,
  })
}
export function removeUser(data, customer) {
  return request(group('user/remove/user', customer), {
    method: 'post',
    data,
  })
}
export function createUserSSO(data) {
  return request(group('sso/sso_create/user'), {
    method: 'post',
    data,
  })
}
export function updateUserSSO(data) {
  return request(group('sso/sso_update/user'), {
    method: 'post',
    data,
  })
}
export function addService(data, customer) {
  return request(group('user/add/service', customer), {
    method: 'post',
    data,
  })
}
export function removeService(data, customer) {
  return request(group('user/remove/service', customer), {
    method: 'post',
    data,
  })
}
