import iView from 'iview'
import { HOST } from './HOST'
import AWS from 'aws-sdk'
import { ACCESSKEY } from './API'
import axios from './axios-bsc'
import store from '@/store'
import user from '@/store/modules/user'
import router from '@/router'

let key = {}

export const clear = () => key = {}

export const getKey = () => {
    return axios.get(ACCESSKEY).then(res => key = res[0], error => {
        iView.Message.warning(error.message)
        store.dispatch('logout').then(res => {
            router.push({
                path: '/login',
                query: { redirect: router.fullPath }
            })
        })
        return error
    })
}

export const config = ({ accesskey, secretkey }, timeout = 10000, host = HOST.awsHost, s3ForcePathStyle, region = 'us-west-1') => {
    AWS.config.update({ accessKeyId: accesskey, secretAccessKey: secretkey })
    AWS.config.region = region
    AWS.config.httpOptions = { timeout: timeout }
    AWS.config.endpoint = 'http://' + host
    AWS.config.s3ForcePathStyle = s3ForcePathStyle
    return new AWS.S3()
}

export const getAWS = async(timeout = 10000, host = HOST.awsHost, s3ForcePathStyle = true) => {
    if (user.state.type === 'admin') {
        key = user.state.subUser.keys[0]
    } else if (!key.accesskey) {
        key = await getKey()
    }
    return config(key, timeout, host, s3ForcePathStyle)
}

export const handler = async(method, params = '', host = HOST.awsHost, s3ForcePathStyle = true, timeout = 10000) => {
    try {
        const s3 = await getAWS(timeout, host, s3ForcePathStyle)
        return new Promise((resolve, reject) => s3[method](params, (error, data) => {
            error && iView.Message.error(error.message, 5)
            return error ? reject(error) : resolve(data)
        }))
    } catch (error) {
        iView.Message.error(error.message, 5)
        return Promise.reject(error)
    }
}

export const transcoder = async(method, params = '') => {
    await getAWS(1000, HOST.transcoderHOST, false)
    try {
        let elastictranscoder = new AWS.ElasticTranscoder({paramValidation: false, convertResponseTypes: false})
        return await new Promise((resolve, reject) => elastictranscoder[method](params, (error, data) => {
            error && iView.Message.error(error.message, 5)
            return error ? reject(error) : resolve(data)
        }))
    } catch (error) {
        iView.Message.error(error.message, 5)
        return Promise.reject(error)
    }
}
