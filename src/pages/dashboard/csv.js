// https://github.com/Terminux/react-csv-downloader/blob/master/src/lib/csv.js

const newLine = '\n'

export default function csv(columns, datas, separator = ',', noHeader = false) {
  let columnOrder = []
  let content = []
  let column = []

  columnOrder = columns.map((v) => {
    if (!noHeader) {
      column.push(typeof v.title !== 'undefined' ? v.title : v)
    }
    if (typeof v === 'string') {
      return v
    }
  })
  if (column.length > 0) {
    content.push(column.join(separator))
  }

  if (Array.isArray(datas)) {
    datas
      .map((v) => {
        if (Array.isArray(v)) {
          return v
        }
        return columnOrder.map((k) => {
          if (typeof v[k] !== 'undefined') {
            return v[k]
          }
          return ''
        })
      })
      .forEach((v) => {
        content.push(v.join(separator))
      })
  }
  return content.join(newLine)
}
