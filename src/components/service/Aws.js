import { HOST } from './HOST'
import AWS from 'aws-sdk'
import { ACCESSKEY } from './API'
import axios from './axios-bsc'

let key

export const clear = () => key = undefined

export const getKey = () => {
    return axios.get(ACCESSKEY).then(res => key = res.data[0])
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
    if (!key) {
        key = await getKey()
    }
    return config(key, timeout)
}

export const handler = async(method, params = '') => {
    try {
        let s3 = await getAWS()
        return await new Promise((resolve, reject) => s3[method](params, (err, data) => err ? reject(err) : resolve(data)))
    } catch (error) {
        return Promise.reject(error)
    }
}