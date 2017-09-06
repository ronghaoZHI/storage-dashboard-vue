import store from '@/store'
import iView from 'iview-bsc'
import { clear } from '@/service/Aws'
import router from '@/router'
import { SSO_LOGOUT } from '@/service/API'

export const logout = async (message) => {
    message ? iView.Modal.error({
        title: 'Need login',
        content: `${message},need to login again`,
        onOk: () => dataClearAndLocation(),
        okText: 'OK'
    }) : dataClearAndLocation()
}

export const isSSOLogin = () => {
    return getCookie('uc_baishan').length > 0
}

function dataClearAndLocation () {
    store.dispatch('logout').then(() => clear()).then(() => {
        if (window.dashboard_conf.onlineMode === 'True') {
            window.location = SSO_LOGOUT
        } else {
            router.push({
                path: '/login',
                query: { redirect: router.fullPath }
            })
        }
    })
}

export function createCookie (name, value) {
    let date = new Date()
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000))
    let expires = `;expires=${date.toUTCString()}`
    document.cookie = `${name}=${value}${expires}; path=/`
}

export function getCookie (name) {
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
