import { getAWS, handler } from '@/service/Aws'
import { HOST } from '@/service/HOST'
import iView from 'iview'

const getBucketPolicy = async(bucket) => {
    let aws = await getAWS(10000, HOST.policyHOST)
    console.log(aws)
    return new Promise((resolve, reject) => aws.getBucketPolicy({Bucket: bucket}, (error, data) => {
        return error && error.code !== 'PolicyNotFound' ? reject(error) : resolve({bucket, data: data})
    }))
}

const putBucketPolicy = async(bucket, data) => {
    const policy = {
        name: 'post_upload_transcoding',
        value: data
    }
    try {
        return handler('putBucketPolicy', {Bucket: bucket, Policy: JSON.stringify(policy)}, HOST.policyHOST)
    } catch (error) {
        return Promise.reject(error)
    }
}

const getTranscodes = async(bucket) => {
    try {
        let res = await getBucketPolicy(bucket)
        const policy = res.data && res.data.Policy ? JSON.parse(res.data.Policy) : {}
        let transcodes = []
        if (policy && policy.post_upload_transcoding && policy.post_upload_transcoding.length > 0) {
            transcodes = policy.post_upload_transcoding
        }
        return transcodes
    } catch (error) {
        iView.Message.error(error.message, 5)
    }
}

export { getBucketPolicy, putBucketPolicy, getTranscodes }
