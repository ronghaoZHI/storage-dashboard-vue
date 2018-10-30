import iView from 'iview-bsc'
import { HOST } from './HOST'
import AWS from 'aws-sdk'
import { getAccesskey } from 'api'
import store from '@/store'
import { logout, isSSOLogin } from '@/service/Helper'

let awsKey = {}

export const clear = () => (awsKey = {})

export const getKey = async () => {
  awsKey = store.state.keys[0]
  return !isSSOLogin
    ? logout('Login status is invalid')
    : (awsKey =
        store.getters.mode === 'manage'
          ? (awsKey = store.state.keys[0])
          : awsKey && awsKey.accesskey
            ? awsKey
            : getAccesskey().then((res) => (awsKey = res[0])))
}

export const config = async ({
  key,
  timeout = 100000,
  host = HOST.awsHost,
  s3ForcePathStyle,
  region = 'us-west-1',
}) => {
  let _key =
    key && key.accesskey && key.accesskey.length > 0 ? key : await getKey()
  AWS.config.update({
    accessKeyId: _key.accesskey,
    secretAccessKey: _key.secretkey,
  })
  AWS.config.region = region
  AWS.config.httpOptions = { timeout: timeout }
  AWS.config.endpoint = location.protocol + '//' + host
  AWS.config.s3ForcePathStyle = s3ForcePathStyle
}

export const getS3 = async ({
  timeout = 100000,
  key = awsKey,
  host = HOST.awsHost,
  s3ForcePathStyle = true,
} = {}) => {
  await config({ key, timeout, host, s3ForcePathStyle })
  return new AWS.S3()
}

export const handler = async (
  method,
  params = '',
  host = HOST.awsHost,
  s3ForcePathStyle = true,
  timeout = 100000,
) => {
  try {
    const s3 = await getS3({ timeout, host, s3ForcePathStyle })
    return new Promise((resolve, reject) =>
      s3[method](params, (error, data) => {
        error && iView.Message.error(error.message, 5)
        return error ? reject(error) : resolve(data)
      }),
    )
  } catch (error) {
    iView.Message.error(error.message || error.show_msg, 5)
    return Promise.reject(error)
  }
}

export const transcoder = async (
  method,
  params = '',
  errorMsg = 'Bad Request',
  host = HOST.transcoderHOST,
  timeout = 10000,
) => {
  await config({ timeout, host })
  try {
    let elastictranscoder = new AWS.ElasticTranscoder({
      paramValidation: false,
      convertResponseTypes: false,
    })
    return await new Promise((resolve, reject) =>
      elastictranscoder[method](params, (error, data) => {
        if (error) {
          error.message === 'Conflict' || error.message === 'Bad Request'
            ? iView.Message.error(errorMsg)
            : iView.Message.error(error.message, 5)
        }
        return error ? reject(error) : resolve(data)
      }),
    )
  } catch (error) {
    return Promise.reject(error)
  }
}
