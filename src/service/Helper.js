import store from '@/store'
import iView from 'iview-bsc'
import { clear } from '@/service/Aws'
import router from '@/router'
import {
  ssoLogout,
  getListSubUser,
  getListBoundUser,
  getListAllUser,
} from 'api'
import createAlert from './createAlert'

export const logout = async (message) => {
  message
    ? iView.Modal.error({
        title: 'Need login',
        content: `${message},need to login again`,
        onOk: () => dataClearAndLocation(),
        okText: 'OK',
      })
    : dataClearAndLocation()
}

export const isSSOLogin = () => {
  return getCookie('uc_baishan').length > 0
}

async function dataClearAndLocation() {
  await store.dispatch('logout')
  await clear()
  if (window.dashboard_conf.onlineMode === 'True') {
    ssoLogout()
  }
  router.push({
    path: '/login',
    query: { redirect: router.fullPath },
  })
}

export function createCookie(name, value) {
  let date = new Date()
  date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000)
  let expires = `;expires=${date.toUTCString()}`
  document.cookie = `${name}=${value}${expires}; path=/`
}

export function getCookie(name) {
  if (document.cookie.length > 0) {
    let start = document.cookie.indexOf(name + '=')
    if (start !== -1) {
      start = start + name.length + 1
      let end = document.cookie.indexOf(';', start)
      if (end === -1) end = document.cookie.length
      return unescape(document.cookie.substring(start, end))
    }
  }
  return ''
}

export function checkRole(role, checkManager = false) {
  function checkManagerFunc() {
    if (store.state.manager.length > 0) {
      return store.state.manager[0].perms
    } else {
      createAlert('无 Manager 字段')
      return []
    }
  }

  const perm = checkManager
    ? checkManagerFunc()
    : store.state.perms && store.state.perms.length > 0
      ? store.state.perms
      : ['SUBUSER']
  if (Array.isArray(perm) && typeof role === 'string') {
    return perm.includes(role)
  } else if (Array.isArray(perm) && Array.isArray(role)) {
    return new Set(perm.concat(role)).size < perm.length + role.length
  } else {
    createAlert('权限字段错误')
    return false
  }
}

export async function getUsers() {
  return checkRole('LIST_USERS')
    ? await getListAllUser()
    : checkRole('BIND_USER')
      ? await getListBoundUser()
      : checkRole('READ_USER') && checkRole('SUB')
        ? [
            ...(await getListSubUser().map((user) => {
              return { ...user, type: 0 }
            })),
            ...(await getListBoundUser().map((user) => {
              return { ...user, type: 1 }
            })),
          ]
        : await getListSubUser()
}

export function sentMessage(message, stak = '') {
  if (process.env.NODE_ENV === 'production') {
    const msg = {
      attachments: [
        {
          fallback: 'Required plain-text summary of the attachment.',
          color: '#36a64f',
          pretext: '出错了',
          author_name: 'CWN-Alert',
          author_link: 'http://flickr.com/bobby/',
          author_icon: 'http://flickr.com/icons/bobby.jpg',
          title: '错误',
          text: message,
          fields: [
            {
              title: 'Url',
              value: window.location.href,
              short: false,
            },
            {
              title: 'store',
              value: JSON.stringify({
                user: store.state.user,
              }),
              short: false,
            },
            {
              title: 'stack',
              value: JSON.stringify(stak),
              short: false,
            },
          ],
          image_url: 'http://my-website.com/path/to/image.jpg',
          thumb_url: 'http://example.com/path/to/thumb.png',
          footer: 'CWN-dashboard',
          footer_icon:
            'https://platform.slack-edge.com/img/default_application_icon.png',
          ts: 123456789,
        },
      ],
    }
    fetch(
      'https://hooks.slack.com/services/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',
      {
        method: 'post',
        body: JSON.stringify(msg),
      },
    )
  }
}
