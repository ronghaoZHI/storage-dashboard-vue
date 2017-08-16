import { getAWS, handler, transcoder } from '@/service/Aws'
import { HOST } from '@/service/HOST'
import iView from 'iview'

const getBucketPolicy = async (bucket) => {
    let aws = await getAWS(10000, HOST.policyHOST)
    return new Promise((resolve, reject) => aws.getBucketPolicy({Bucket: bucket}, (error, data) => {
        return error && error.code !== 'PolicyNotFound' ? reject(error) : resolve({bucket, data: data})
    }))
}

const putBucketPolicy = async (bucket, data) => {
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

const getTranscodes = async (bucket) => {
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
let pipeList = []
const listPipelines = async (pageToken) => {
    try {
        let res = !pageToken ? await transcoder('listPipelines') : await transcoder('listPipelines', {PageToken: pageToken})
        pipeList.push(...res.Pipelines)
        if (!!res.NextPageToken) {
            await listPipelines(res.NextPageToken)
        }
        return pipeList
    } catch (error) {
        iView.Message.error(error.message, 5)
    }
}

const getTemplateInfo = async () => {
    templateList = []
    await getTemplatePage()
    let [templateContainer, templateName] = [[], []]
    templateList.forEach(item => {
        templateContainer[item.Id] = item.Container
    })
    templateList.forEach(item => {
        templateName[item.Id] = item.Name
    })
    return {templateList, templateContainer, templateName}
}

let templateList = []
const getTemplatePage = async (pageToken) => {
    let res = !pageToken ? await transcoder('listPresets') : await transcoder('listPresets', {PageToken: pageToken})
    templateList.push(...res.Presets)
    if (!!res.NextPageToken) {
        await getTemplatePage(res.NextPageToken)
    }
}
export { getBucketPolicy, putBucketPolicy, getTranscodes, listPipelines, getTemplateInfo }
