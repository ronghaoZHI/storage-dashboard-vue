import Vue from 'vue'
const bytes = (bytes) => {
    if (typeof bytes !== 'number') {
        bytes = parseFloat(bytes)
    }

    if (bytes < 1) {
        return '0 B'
    } else if (isNaN(bytes) || !isFinite(bytes)) {
        return '-'
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
    const number = (bytes / Math.pow(1024, Math.floor(exponent))).toFixed(1)

    return number + ' ' + units[exponent]
}


const removeItemFromArray = (array, item) => array.splice(array.indexOf(item), 1)

Vue.filter('userType', (Grantee) => {
    if (Grantee.URI && Grantee.URI === 'http://acs.amazonaws.com/groups/global/AllUsers') {
        return 'All Users';
    } else if (Grantee.URI && Grantee.URI === 'http://acs.amazonaws.com/groups/global/AuthenticatedUsers') {
        return 'Auth Users';
    } else if (Grantee.ID) {
        return Grantee.ID;
    }
})


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


export { bytes, convertPrefix2Router, keyFilter, removeItemFromArray }