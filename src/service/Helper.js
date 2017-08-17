import store from '@/store'
import iView from 'iview'
import { clear } from '@/service/Aws'
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
    store.dispatch('logout').then(() => clear()).then(() => window.location = SSO_LOGOUT)
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
