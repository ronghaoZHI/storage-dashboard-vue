const bytes = (bytes) => {
    if (typeof bytes !== 'number') {
        bytes = parseFloat(bytes)
    }

    if (bytes < 1) {
        return '0 B'
    } else if (isNaN(bytes) || !isFinite(bytes)) {
        return '-'
    }

    let units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    let exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
    let number = (bytes / Math.pow(1024, Math.floor(exponent))).toFixed(1)

    return number + ' ' + units[exponent]
}

const keyFilter = (key, prefix) => key.slice(prefix.length)

// shit 
const convertPrefix2Router = (prefix) => {
    if (!!prefix) {
        let prefixArray = prefix.split('/')
        let routeArray = []

        prefixArray.pop()
        _.each(prefixArray, (item, index) => {
            let copyArray = _.clone(prefixArray)
            copyArray.length = index + 1
            routeArray.push({
                text: item,
                prefix: copyArray.join('/') + '/'
            })
        })
        return routeArray
    } else {
        return []
    }
}

const fileHeaderSetting = [{
        type: 'selection',
        width: 60,
        align: 'center'
    },
    {
        title: 'Key',
        key: 'Key',
        width: 240,
        ellipsis: true,
        sortable: true,
        render(row, column, index) {
            return row.Type === 'file' ? `<Icon type="document"></Icon> <strong>${row.Key}</strong>` : `<Icon type="folder"></Icon> <strong>${row.Key}</strong>`;
        }
    }, {
        title: 'Size',
        width: 90,
        align: 'right',
        key: 'convertSize'
    }, {
        title: 'Create time',
        key: 'LastModified',
        align: 'right',
        width: 140,
        sortable: true
    }, {
        title: 'Actions',
        key: 'actions',
        width: 170,
        align: 'right',
        render(row, column, index) {
            return row.Type === 'folder' ? `<i-button size="small"><Icon type="ios-trash" :size="iconSize"></Icon></i-button>` :
                `<i-button size="small"><Icon type="gear-a" :size="iconSize"></Icon></i-button> 
                        <i-button size="small"><Icon type="ios-cloud-download" :size="iconSize"></Icon></i-button>
                        <i-button size="small"><Icon type="eye" :size="iconSize"></Icon></i-button>
                        <i-button size="small"><Icon type="link" :size="iconSize"></Icon></i-button>
                        <i-button size="small"><Icon type="ios-trash" :size="iconSize"></Icon></i-button>`;
        }
    }
]

export { bytes, convertPrefix2Router, fileHeaderSetting, keyFilter }