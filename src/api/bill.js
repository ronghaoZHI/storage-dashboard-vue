import { group } from './util'
import request from '@/service/request'

export function loginByUsername(data) {
  return request(group('auth/login'), {
    method: 'post',
    data,
  })
}
