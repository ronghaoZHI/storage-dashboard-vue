import { group, groupTranscoder, groupImgx } from './util'
import request from '@/service/request'

export function getBillTranscoderUrl(url = '') {
  return group(`bill/transcode${url}`)
}
export function postTranscoderUrl(url = '', data) {
  return request(groupTranscoder(`${url}`), {
    method: 'post',
    data,
  })
}
export function getTranscoderUrl(url = '') {
  return request(groupTranscoder(`${url}`), {
    method: 'get',
  })
}
export function putTranscoderUrl(url = '', data) {
  return request(groupTranscoder(`${url}`), {
    method: 'put',
    data,
  })
}

export function getBillOldUrl(url = '') {
  return group(`bill/storage_old${url}`)
}
export function getBillBandwidthUrl(url = '') {
  return group(`bill/storage_bandwidth${url}`)
}
export function getBillUrl(url = '') {
  return group(`bill/storage${url}`)
}
export function getImgxPreviewUrl() {
  return groupImgx('/image-example/')
}
