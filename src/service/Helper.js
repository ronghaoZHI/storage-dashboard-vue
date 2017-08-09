import store from '@/store'
import iView from 'iview'
import { clear } from '@/service/Aws'
import { SSO_LOGOUT } from '@/service/API'

export const logout = async(message) => {
    message ? iView.Modal.error({
        title: 'Need login',
        content: `${message},need to login again`,
        onOk: dataClearAndLocation()
    }) : dataClearAndLocation()
}

function dataClearAndLocation () {
    store.dispatch('logout').then(() => clear()).then(() => window.location = SSO_LOGOUT).catch(() => {
        window.location = SSO_LOGOUT
    })
}
