import iView from 'iview'
import { HOST } from './HOST'
import AWS from 'aws-sdk'
import { ACCESSKEY } from './API'
import axios from './axios-bsc'
import store from '@/store'
import router from '@/router'

let key = {}

export const clear = () => key = {}

export const getKey = () => {
    return axios.get(ACCESSKEY).then(res => key = res.data[0], error => {
        iView.Message.error(error.message)
        store.dispatch('logout').then(res => {
            router.push({
                path: '/login',
                query: { redirect: router.fullPath }
            })
        })
        return error
    })
}

export const config = ({ accesskey, secretkey }, timeout = 10000, region = 'us-west-1') => {
    AWS.config.update({ accessKeyId: accesskey, secretAccessKey: secretkey })
    AWS.config.region = region
    AWS.config.httpOptions = { timeout: timeout }
    AWS.config.endpoint = 'http://' + HOST.awsHost
    AWS.config.s3ForcePathStyle = true
    return new AWS.S3()
}

export const getAWS = async(timeout = 10000) => {
    if (!key.accesskey) {
        key = await getKey()
    }
    return config(key, timeout)
}

export const handler = async(method, params = '') => {
    try {
        const s3 = await getAWS()
        return await new Promise((resolve, reject) => s3[method](params, (error, data) => {
            error && iView.Message.error(error.message, 5)
            return error ? reject(error) : resolve(data)
        }))
    } catch (error) {
        iView.Message.error(error.message, 5)
        return Promise.reject(error)
    }
}