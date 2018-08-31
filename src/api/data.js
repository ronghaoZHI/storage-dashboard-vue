import { group } from './util'
import request from '@/service/request'

export function postAccess(data, customer) {
  return request(group('access', customer), {
    method: 'post',
    data,
  })
}

export function postRetrieve(data, customer) {
  return request(group('retrieve', customer), {
    method: 'post',
    data,
  })
}
