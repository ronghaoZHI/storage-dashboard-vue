import iView from 'iview-bsc'

export default function createAlert(message, status = 'alert') {
  iView.Notice.error({
    title: `内部错误 ${status}`,
    desc: message,
  })
}
