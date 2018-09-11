import Vue from 'vue'
import moment from 'moment-timezone'

const time = (time, digit = 1) => {
  let timeArray = timeSpliteUnits(time, digit)

  return timeArray[0] + ' ' + timeArray[1]
}
const timeSpliteUnits = (t, digit = 1) => {
  let time = t
  if (typeof time !== 'number') {
    time = parseFloat(time)
  }

  if (time < 1) {
    return '0 s'
  } else if (isNaN(time) || !isFinite(time)) {
    return '-'
  }

  const units = ['s', 'min', 'h']
  const exponent = Math.min(
    Math.floor(Math.log(time) / Math.log(60)),
    units.length - 1,
  )
  const number = (time / Math.pow(60, Math.floor(exponent))).toFixed(digit)

  return [number, units[exponent]]
}
const thousands = (numbers) =>
  `${numbers}`.replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) {
    return s + ','
  })
const bytes = (bytes, digit = 1) => {
  if (bytes === undefined) return '-'
  let bytesArray = bytesSpliteUnits(bytes, digit)

  return bytesArray[0] + ' ' + bytesArray[1]
}
const bytesSpliteUnits = (bt, digit = 1) => {
  let bytes = bt
  if (typeof bytes !== 'number') {
    bytes = parseFloat(bytes)
  }

  if (bytes < 1) {
    return '0 B'
  } else if (isNaN(bytes) || !isFinite(bytes)) {
    return '-'
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  )
  const number = (bytes / Math.pow(1024, Math.floor(exponent))).toFixed(digit)

  return [number, units[exponent]]
}
const bps = (bytes, digit = 1) => {
  if (bytes === undefined) return '-'
  let bpsArray = bpsSpliteUnits(bytes, digit)

  return bpsArray[0] + ' ' + bpsArray[1]
}
const bpsSpliteUnits = (bs, digit = 1) => {
  let bps = bs
  if (typeof bps !== 'number') {
    bps = parseFloat(bps)
  }

  if (bps < 1) {
    return '0 bps'
  } else if (isNaN(bps) || !isFinite(bps)) {
    return '-'
  }

  const units = [
    'bps',
    'Kbps',
    'Mbps',
    'Gbps',
    'Tbps',
    'Pbps',
    'Ebps',
    'Zbps',
    'Ybps',
  ]
  const exponent = Math.min(
    Math.floor(Math.log(bps) / Math.log(1024)),
    units.length - 1,
  )
  const number = (bps / Math.pow(1024, Math.floor(exponent))).toFixed(digit)

  return [number, units[exponent]]
}
const times = (t) => {
  let times = t
  if (times === undefined) return '-'
  times = typeof times === 'string' ? times : times.toString()
  let len = times.length
  if (len < 3) return times
  let result =
    len % 3 === 0 ? times.substr(0, len % 3) : times.substr(0, len % 3) + ','
  for (let i = len % 3; i < len - 1; i += 3) {
    result += i === len - 3 ? times.substr(i, 3) : times.substr(i, 3) + ','
  }
  return result
}
const timesK = (t, digit = 1) => {
  let times = t
  if (typeof times !== 'number') {
    times = parseFloat(times)
  }
  if (times < 1) {
    return 0
  } else if (isNaN(times) || !isFinite(times)) {
    return '-'
  }

  const units = ['', 'K', 'M', 'BN']
  const exponent = Math.min(
    Math.floor(Math.log(times) / Math.log(1000)),
    units.length - 1,
  )
  const number = (times / Math.pow(1000, Math.floor(exponent))).toFixed(digit)

  return number + ' ' + units[exponent]
}
const timesSpliteUnits = (t, digit = 1) => {
  let times = t
  if (typeof times !== 'number') {
    times = parseFloat(times)
  }
  if (times < 1) {
    return [0]
  } else if (isNaN(times) || !isFinite(times)) {
    return ['-']
  }

  const units = ['', 'K', 'M', 'BN']
  const exponent = Math.min(
    Math.floor(Math.log(times) / Math.log(1000)),
    units.length - 1,
  )
  let specialDigit = units[exponent] ? digit : 0
  const number = (times / Math.pow(1000, Math.floor(exponent))).toFixed(
    specialDigit,
  )
  return [number, units[exponent]]
}
const date = (value, type = 'YMD') => {
  let date = new Date(
    moment(value)
      .tz('Asia/Shanghai')
      .format(),
  )
  let texts = [
    date.getFullYear(),
    checkDate(date.getMonth() + 1),
    checkDate(date.getDate()),
  ]
  if (type === 'MD') {
    texts = [checkDate(date.getMonth() + 1), checkDate(date.getDate())]
  }
  return texts.join('-')
}

const dateTime = (value) => {
  let date = new Date(
    moment(value)
      .tz('Asia/Shanghai')
      .format(),
  )
  let dateTexts = [checkDate(date.getMonth() + 1), checkDate(date.getDate())]
  let timeTexts = [checkDate(date.getHours()), checkDate(date.getMinutes())]
  return dateTexts.join('-') + ' ' + timeTexts.join(':')
}

const dateTimeYear = (value) => {
  let date = new Date(
    moment(value)
      .tz('Asia/Shanghai')
      .format(),
  )
  let dateTexts = [
    date.getFullYear(),
    checkDate(date.getMonth() + 1),
    checkDate(date.getDate()),
  ]
  let timeTexts = [checkDate(date.getHours()), checkDate(date.getMinutes())]
  return dateTexts.join('-') + ' ' + timeTexts.join(':')
}

const checkDate = (value) => {
  return value > 9 ? value : '0' + value
}

const removeItemFromArray = (array, item) =>
  array.splice(array.indexOf(item), 1)

Vue.filter('userType', (Grantee) => {
  if (
    Grantee.URI &&
    Grantee.URI === 'http://acs.amazonaws.com/groups/global/AllUsers'
  ) {
    return 'All Users'
  } else if (
    Grantee.Type === 'Group' &&
    (Grantee.URI &&
      Grantee.URI ===
        'http://acs.amazonaws.com/groups/global/AuthenticatedUsers')
  ) {
    return 'Auth Users'
  } else if (Grantee.ID) {
    return Grantee.ID
  }
})

const keyFilter = (key, prefix) => key.slice(prefix.length)

// shit
const convertPrefix2Router = (prefix) => {
  if (prefix) {
    let prefixArray = prefix.split('/')
    let routeArray = []

    prefixArray.pop()
    _.each(prefixArray, (item, index) => {
      let copyArray = _.clone(prefixArray)
      copyArray.length = index + 1
      routeArray.push({
        text: item,
        prefix: copyArray.join('/') + '/',
      })
    })
    return routeArray
  } else {
    return []
  }
}
const prefix = {
  overlay: 'imgx/overlay/',
  rules: 'imgx/cmd_template/',
}
const Utf8ArrayToStr = (array) => {
  let [out, i, len, c, char2, char3] = ['', 0, array.length, '', '', '']
  while (i < len) {
    c = array[i++]
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c)
        break
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++]
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f))
        break
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++]
        char3 = array[i++]
        out += String.fromCharCode(
          ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0),
        )
        break
    }
  }
  return out
}
export {
  time,
  bytes,
  bps,
  times,
  timesK,
  date,
  dateTime,
  dateTimeYear,
  convertPrefix2Router,
  keyFilter,
  removeItemFromArray,
  prefix,
  Utf8ArrayToStr,
  bytesSpliteUnits,
  bpsSpliteUnits,
  timesSpliteUnits,
  thousands,
}
