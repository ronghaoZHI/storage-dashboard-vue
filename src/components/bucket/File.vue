<template>
    <div>
        <div class="layout-bsc-toolbar">
            <div>
                <Button>Upload file</Button>
                <Button>Create folder</Button>
                <Button>Delete file</Button>
            </div>
            <Breadcrumb>
                <Breadcrumb-item href="#">Bucket list</Breadcrumb-item>
                <Breadcrumb-item>{{bucket}}</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <Table :show-header="showHeader"
               :stripe="true"
               :context="self"
               :highlight-row="true"
               :columns="fileHeader"
               :data="contents"></Table>
    </div>
</template>
<script>
import { handler } from '../service/Aws'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
export default {
    data() {
        return {
            contents: [],
            self: this,
            showHeader: true,
            iconSize: 16,
            fileHeader: [
                {
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
        }
    },
    computed: {
        bucket: function () {
            return this.$route.params.bucket
        }
    },
    mounted() {
        this.getData()
    },
    components: {
        bucket: function () {
            return this.$route.params.bucket
        }
    },
    methods: {
        async getData() {
            let res = await handler('listObjects', { Bucket: this.bucket, Delimiter: '/' })
            this.contents = _.forEach(res.CommonPrefixes, (foler) => {
                foler.Key = foler.Prefix
                foler.Type = 'folder'
                foler.LastModified = ''
                foler.convertSize = ''
                delete foler.Prefix
            }).concat(_.forEach(res.Contents, (item) => {
                item.convertSize = bytes(item.Size)
                item.Type = 'file'
                item.LastModified = moment(item.LastModified).format('YYYY-MM-DD HH:mm')
            }))
        }
    },
    watch: {
        contents: {
            handler: function (val, oldVal) {
                console.log(val, oldVal)
            },
            deep: true
        }
    }
}

const bytes = (bytes) => {
    if (typeof bytes !== 'number') {
        bytes = parseFloat(bytes)
    }

    if (bytes < 1) {
        return '0 B'
    } else if (isNaN(bytes) || !isFinite(bytes)) {
        return '-'
    }

    let isNegative = bytes < 0;
    if (isNegative) {
        bytes = -bytes;
    }

    let units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    let exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
    let number = (bytes / Math.pow(1024, Math.floor(exponent))).toFixed(1)

    return (isNegative ? '-' : '') + number + ' ' + units[exponent]
}
</script>
<style lang="less" scoped>
.layout-bsc-toolbar {
    button {
        margin-right: 8px;
    }
}
</style>