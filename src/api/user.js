import { group } from './util'
import request from '@/service/request'

export function postUpdateUser(data, customer) {
  return request(group('/user/update/user', customer), {
    method: 'post',
    data,
  })
}
export function postUpdateSubAcl(data, customer) {
  return request(group('user/update/sub_acl', customer), {
    method: 'post',
    data,
  })
}
export function getListBoundUser(customer) {
  return request(group('user/list/bound_user', customer), {
    method: 'get',
  })
}
export function getListAllUser(customer) {
  return request(group('user/list/user', customer), {
    method: 'get',
  })
}
export function getListSubUser(customer) {
  return request(group('user/list/sub', customer), {
    method: 'get',
  })
}
export function getListSubAcl(customer, bucket) {
  return request(group('user/list/sub_acl', customer, bucket), {
    method: 'get',
  })
}
export function postCreateSub(data, customer) {
  return request(group('user/create/sub', customer), {
    method: 'post',
    data,
  })
}
export function postCreateUser(data, customer) {
  return request(group('user/create/user', customer), {
    method: 'post',
    data,
  })
}
export function postRedirectBucket(data, customer) {
  return request(group('user/redirect/bucket', customer), {
    method: 'post',
    data,
  })
}
export function postBindUser(data, customer) {
  return request(group('user/bind/user', customer), {
    method: 'post',
    data,
  })
}
export function postUnbindUser(data, customer) {
  return request(group('user/unbind/user', customer), {
    method: 'post',
    data,
  })
}
export function postRemoveSub(data, customer) {
  return request(group('user/remove/sub', customer), {
    method: 'post',
    data,
  })
}
export function postRemoveUser(data, customer) {
  return request(group('user/remove/user', customer), {
    method: 'post',
    data,
  })
}
export function postCreateUserSSO(data) {
  return request(group('sso/sso_create/user'), {
    method: 'post',
    data,
  })
}
export function postUpdateUserSSO(data) {
  return request(group('sso/sso_update/user'), {
    method: 'post',
    data,
  })
}
export function getRedirectBucketFilesAcl(bucket, customer) {
  return request(
    group(`user/get/redirect_bucket_acl?bucket=${bucket}&customer=${customer}`),
    {
      method: 'get',
    },
  )
}
export function postAddService(data, customer) {
  return request(group('user/add/service', customer), {
    method: 'post',
    data,
  })
}
export function postRemoveService(data, customer) {
  return request(group('user/remove/service', customer), {
    method: 'post',
    data,
  })
}
