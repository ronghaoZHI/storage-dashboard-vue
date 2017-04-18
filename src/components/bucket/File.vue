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
        <Modal v-model="CopyModal">
            <div style="text-align:left">
                Copy {{selectedFile.Key}} link?
            </div>
            <div slot="footer" class="copy-modal-footer">
                <Button type="text" >
                    <span>Cancle</span>
                </Button>
                <Button type="info" @click="CopyModal = false"
                        :data-clipboard-text="clipUrl"
                        v-clip>Copy!</Button>
            </div>
        </Modal>
        <Table :show-header="showHeader"
               :stripe="true"
               :context="self"
               :highlight-row="true"
               :columns="fileHeader"
               :data="fileList"
               no-data-text="No data"
               @on-row-click="rowClick"></Table>
    </div>
</template>
<script>
import { getAWS, handler } from '../service/Aws'
import { bytes, keyFilter, convertPrefix2Router, removeItemFromArray } from '../service/bucketService'
import { mapGetters, mapActions } from 'vuex'
import Clipboard from 'clipboard'
import moment from 'moment'
export default {
    data() {
        return {
            clipUrl: '',
            CopyModal: false,
            selectedFile: {},
            fileList: [],
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
            this.fileList = _.forEach(res.CommonPrefixes, (foler) => {
                foler.Key = keyFilter(foler.Prefix, self.prefix)
                foler.Type = 'folder'
                foler.LastModified = ''
                foler.convertSize = ''
            }).concat(_.forEach(res.Contents, (item) => {
                item.Key = keyFilter(item.Key, self.prefix)
                item.convertSize = bytes(item.Size)
                item.Type = 'file'
                item.LastModified = moment(item.LastModified).format('YYYY-MM-DD HH:mm')
            }))
        },
        async clipModal(file) {
            this.$Loading.start()
            this.clipUrl = await getURL(this.bucket, file)
            this.selectedFile = file
            this.CopyModal = true
            this.$Loading.finish()
        },
        deleteFileConfirm(file) {
            this.$Modal.confirm({
                content: `Are you sure you want to delete [${file.Key}]?`,
                okText: 'Submit',
                cancelText: 'Cancle',
                onOk: () => this.deleteFile(file)
            })
        },
        async deleteFile(file) {
            await handler('deleteObject', { Bucket: this.bucket, Key: file.Key })
            removeItemFromArray(this.fileList, file)
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
    directives: {
        clip: {
            bind: function (el) {
                new Clipboard(el)
            }
        }
    },
    watch: {
        // the fileList array need refresh when the $route value changed
        '$route'(to, from) {
            to.path !== from.path && this.getData()
        }
    }
}


const getURL = async (bucket, file) => {
    try {
        let params = { Bucket: bucket, Key: file.Key || file.Prefix }
        let s3 = await getAWS()
        let url = await s3.getSignedUrl('getObject', params)
        let acl = await handler('getObjectAcl', params)
        let isAllUser = _.find(acl.Grants, (item) => item.Grantee.URI && item.Grantee.URI === 'http://acs.amazonaws.com/groups/global/AllUsers')
        return isAllUser ? url.split('?')[0] : url
    } catch (error) {
        console.log(error)
        this.$Message.error(error.message)
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
        return row.Type === 'folder' ? '<i-button size="small"><Icon type="ios-trash" :size="iconSize"></Icon></i-button>' :
            `<i-button size="small"><Icon type="gear-a" :size="iconSize"></Icon></i-button> 
                        <i-button size="small"><Icon type="ios-cloud-download" :size="iconSize"></Icon></i-button>
                        <i-button size="small"><Icon type="eye" :size="iconSize"></Icon></i-button>
                        <i-button size="small" @click="clipModal(fileList[${index}])"><Icon type="link" :size="iconSize"></Icon></i-button>
                        <i-button size="small" @click="deleteFileConfirm(fileList[${index}])"><Icon type="ios-trash" :size="iconSize"></Icon></i-button>`;
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
.copy-modal-footer{
    border-top: 0
}
</style>