import iView from 'iview-bsc'
import xml2js from 'xml2js'
import { sentMessage } from './Helper'

const codeMessage = {
  OFF_LINE: '抱歉，您貌似还没连接到网络，请检查网络连接',
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '抱歉，您貌似还没有登录',
  403: '抱歉，您没有权限访问该页面',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
}

const xmlParser = new xml2js.Parser({
  explicitArray: false,
  ignoreAttrs: true,
})
const xml2json = (data) => {
  let jsonData = {}
  xmlParser.parseString(data, (err, result) => {
    jsonData = err ? false : result
  })
  return jsonData
}

export default function createError(responseError) {
  let [code, errorMsg, response] = ['', '', {}]

  // 请求已经发送，并且服务器有返回
  if (responseError.response || responseError.status) {
    response = responseError.response || responseError
    // 接口的返回内容
    const body = response.data

    if (body && xml2json(body)) {
      errorMsg = xml2json(body).Error.Message
    } else if (body && typeof body === 'object') {
      // 有的接口错误描述还被包了一层，所以也尝试解析
      const realBody = body.data
      if (realBody && typeof realBody === 'object') {
        const msg =
          realBody.message ||
          realBody.error_description ||
          realBody.error_message ||
          realBody.msg ||
          realBody.description
        const errorCode = realBody.code || realBody.code

        if (msg) {
          errorMsg = msg
        }

        if (errorCode) {
          code = errorCode
        }
      }

      // 如果message code有任何一个还没有取到
      if (!errorMsg || !code) {
        const msg =
          body.message ||
          body.error_description ||
          body.error_message ||
          body.message ||
          body.msg ||
          body.description
        const errorCode = body.code || body.code

        if (!errorMsg) {
          errorMsg = msg
        }

        if (!code) {
          code = errorCode
        }
      }
    }

    if (!response.code) {
      code = response.status
    }
  } else if (responseError.request) {
    // 请求已发送但是没有收到服务器响应
    if ('onLine' in navigator && navigator.onLine === false) {
      code = 'OFF_LINE'
    } else if (responseError.code === 'ECONNABORTED') {
      code = 504
      errorMsg = `网络请求超时(${
        responseError.config.timeout
      }ms)，请确认网络正常并重试`
    }
  } else {
    // 请求未发出
    errorMsg = responseError
  }

  if (!code) {
    code = -1
  }

  if (!errorMsg) {
    errorMsg =
      codeMessage[code] || response.statusText || `抱歉，当前请求异常(${code})`
  }

  sentMessage(errorMsg, responseError)
  iView.Notice.error({
    title: `请求错误 ${code}`,
    desc: errorMsg,
  })

  const error = new Error(errorMsg)
  error.name = code
  error.message = errorMsg
  error.response = response

  return Promise.reject(error)
}
