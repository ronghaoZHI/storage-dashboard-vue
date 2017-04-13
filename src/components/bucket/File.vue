<template>
    <div>
        <div class="layout-bsc-toolbar">
            <div>
                <Button @click="upload">Upload file</Button>
                <Button>Create folder</Button>
                <Button>Delete file</Button>
            </div>
            <Breadcrumb>
                <Breadcrumb-item href="#">Bucket list</Breadcrumb-item>
                <Breadcrumb-item :href="getUrl('noprefix')">{{bucket}}</Breadcrumb-item>
                <Breadcrumb-item v-for="bc in breadcrumb"
                                 :href="getUrl(bc.prefix)"
                                 :key="bc.text">{{bc.text}}</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <Table :show-header="showHeader"
               :stripe="true"
               :context="self"
               :highlight-row="true"
               :columns="fileHeader"
               :data="contents"
               no-data-text="No data"
               @on-row-click="rowClick"></Table>
    </div>
</template>
<script>
import { handler } from '../service/Aws'
import { bytes,keyFilter,convertPrefix2Router } from '../service/bucketService'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
export default {
    data() {
        return {
            contents: [],
            self: this,
            showHeader: true,
            iconSize: 18,
            fileHeader: fileHeaderSetting
        }
    },
    computed: {
        bucket: function () {
            return this.$route.params.bucket
        },
        prefix: function () {
            return this.$route.params.prefix === 'noprefix' ? '' : this.$route.params.prefix
        },
        breadcrumb: function () {
            return convertPrefix2Router(this.prefix)
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        async getData() {
            let self = this
            let res = await handler('listObjects', {
                Bucket: this.bucket,
                Delimiter: '/',
                Marker: this.prefix,
                Prefix: this.prefix
            })
            this.contents = _.forEach(res.CommonPrefixes, (foler) => {
                foler.Key = keyFilter(foler.Prefix,self.prefix)
                foler.Type = 'folder'
                foler.LastModified = ''
                foler.convertSize = ''
            }).concat(_.forEach(res.Contents, (item) => {
                item.Key = keyFilter(item.Key,self.prefix)
                item.convertSize = bytes(item.Size)
                item.Type = 'file'
                item.LastModified = moment(item.LastModified).format('YYYY-MM-DD HH:mm')
            }))
        },
        rowClick(item) {
            item.Type === 'folder' && this.$router.push({ name: 'file', params: { bucket: this.bucket, prefix: item.Prefix } })
        },
        getUrl(prefix) {
            return `#/bucket/${this.bucket}/prefix/${prefix.replace('/', '%2F')}`
        },
        upload() {
            this.$router.push({ name: 'upload', params: { bucket: this.bucket, prefix: this.$route.params.prefix } })
        }
    },
    watch: {
        // the contents array need refresh when the $route value changed
        '$route'(to, from) {
            to.path !== from.path && this.getData()
        }
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

</script>
<style lang="less">
.layout-bsc-toolbar {
    button {
        margin-right: 8px;
    }
}
</style>