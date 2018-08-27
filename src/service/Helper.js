import store from '@/store'
import iView from 'iview-bsc'
import { clear } from '@/service/Aws'
import router from '@/router'
import { SSO_LOGOUT } from '@/service/API'

export const logout = async (message) => {
  message
    ? iView.Modal.error({
      title: 'Need login',
      content: `${message},need to login again`,
      onOk: () => dataClearAndLocation(),
      okText: 'OK'
    })
    : dataClearAndLocation()
}

export const isSSOLogin = () => {
  return getCookie('uc_baishan').length > 0
}

async function dataClearAndLocation() {
  const _store = store.default || store
  await _store.dispatch('logout')
  await clear()

  if (window.dashboard_conf.onlineMode === 'True') {
    window.location = SSO_LOGOUT
  } else {
    const _router = router.default || router
    _router.push({
      path: '/login',
      query: { redirect: router.fullPath }
    })
  }
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

export function sentMessage(message, stak = '') {
  if (process.env.NODE_ENV === 'production') {
    const msg = {
      attachments: [
        {
          "fallback": "Required plain-text summary of the attachment.",
          "color": "#36a64f",
          "pretext": "出错了",
          "author_name": "CWN-Alert",
          "author_link": "http://flickr.com/bobby/",
          "author_icon": "http://flickr.com/icons/bobby.jpg",
          "title": "错误",
          "text": message,
          "fields": [
            {
              "title": "Url",
              "value": window.location.href,
              "short": false
            },
            {
              "title": "store",
              "value": JSON.stringify({
                token: store.default.state.token,
                user: store.default.state.user
              }),
              "short": false
            },
            {
              "title": "stack",
              "value": JSON.stringify(stak),
              "short": false
            }
          ],
          "image_url": "http://my-website.com/path/to/image.jpg",
          "thumb_url": "http://example.com/path/to/thumb.png",
          "footer": "CWN-dashboard",
          "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
          "ts": 123456789
        }
      ]
    }
    fetch('https://hooks.slack.com/services/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', {
      method: 'post',
      body: JSON.stringify(msg)
    })
  }
}
