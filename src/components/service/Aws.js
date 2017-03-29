import { HOST } from './HOST'
import AWS from 'aws-sdk'

let key

export const clear = () => key = undefined

export const getKey = () => {
    return new Promise((resolve, reject) => {
        return resolve({
            accesskey: "m47qygx91jaz25reiuon",
            secretkey: "I3GdHsh72jKs4BEr87gxbh5osy+CPrYywWIL3Mko"
        })
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