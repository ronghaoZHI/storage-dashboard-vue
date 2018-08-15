import { getS3, handler, transcoder } from '@/service/Aws'
import { HOST } from '@/service/HOST'
import iView from 'iview-bsc'

const getBucketPolicy = async (bucket) => {
  let s3 = await getS3({ timeout: 10000, host: HOST.policyHOST })
  return new Promise((resolve, reject) =>
    s3.getBucketPolicy({ Bucket: bucket }, (error, data) => {
      return error && error.code !== 'PolicyNotFound'
        ? reject(error)
        : resolve({ bucket, data: data })
    })
  )
}

const putBucketPolicy = async (bucket, data) => {
  const policy = {
    name: 'post_upload_transcoding',
    value: data
  }
  try {
    return handler(
      'putBucketPolicy',
      { Bucket: bucket, Policy: JSON.stringify(policy) },
      HOST.policyHOST
    )
  } catch (error) {
    return Promise.reject(error)
  }
}

const getTranscodes = async (bucket) => {
  try {
    let res = await getBucketPolicy(bucket)
    const policy =
      res.data && res.data.Policy ? JSON.parse(res.data.Policy) : {}
    let transcodes = []
    if (
      policy &&
      policy.post_upload_transcoding &&
      policy.post_upload_transcoding.length > 0
    ) {
      transcodes = policy.post_upload_transcoding
    }
    return transcodes
  } catch (error) {
    iView.Message.error(error.message, 5)
  }
}
let pipeList = []
const listPipelines = async () => {
  pipeList = []
  await listPipelinePage()
  return pipeList
}
const listPipelinePage = async (pageToken) => {
  try {
    let res = !pageToken
      ? await transcoder('listPipelines')
      : await transcoder('listPipelines', { PageToken: pageToken })
    pipeList.push(...res.Pipelines)
    if (!!res.NextPageToken) {
      await listPipelinePage(res.NextPageToken)
    }
  } catch (error) {
    iView.Message.error(error.message, 5)
  }
}

const getTemplateInfo = async () => {
  templateList = []
  await getTemplatePage()
  let [templateContainer, templateName, templateVideoCodec] = [[], [], []]
  templateList.forEach((item) => {
    templateContainer[item.Id] = item.Container
  })
  templateList.forEach((item) => {
    templateName[item.Id] = item.Name
    templateVideoCodec[item.Id] = item.Video.Codec
  })
  return { templateList, templateContainer, templateVideoCodec, templateName }
}

let templateList = []
const getTemplatePage = async (pageToken) => {
  let res = !pageToken
    ? await transcoder('listPresets')
    : await transcoder('listPresets', { PageToken: pageToken })
  templateList.push(...res.Presets)
  if (!!res.NextPageToken) {
    await getTemplatePage(res.NextPageToken)
  }
}
const formateSS = (SS) => {
  let s = Math.floor(SS / 1000)
  return [
    `${Math.floor(s / 3600)}:${Math.floor(s / 60) % 60}:${s % 60}`,
    `${SS % 1000}`
  ]
}
const getSS = (time, SS) => {
  let timeArray = time.split(':').map((item) => Number(item))
  return (
    (timeArray[0] * 3600 + timeArray[1] * 60 + timeArray[2]) * 1000 +
    Number(SS)
  ).toString()
}
export {
  getBucketPolicy,
  putBucketPolicy,
  getTranscodes,
  listPipelines,
  getTemplateInfo,
  formateSS,
  getSS
}
