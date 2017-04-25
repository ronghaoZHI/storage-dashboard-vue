<template>
    <div @keyup.enter="searchValue !== '' && searchFile(searchValue)">
        <div class="layout-bsc-toolbar">
            <Breadcrumb>
                <Breadcrumb-item href="/">Bucket list</Breadcrumb-item>
                <Breadcrumb-item :href="getUrl('noprefix')">{{bucket}}</Breadcrumb-item>
                <Breadcrumb-item v-for="bc in breadcrumb" :href="getUrl(bc.prefix)" :key="bc.text">{{bc.text}}</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <Row class="toolbar-nav">
            <Col span="10">
                <div>
                    <Button type="primary" @click="upload">Upload file</Button>
                    <Button type="primary" @click="createFolderModal = true">Create folder</Button>
                    <Button @click="batchDeleteFileConfirm" :disabled="!selectedFileList.length > 0"  type="warning">Delete file</Button>
                    <Button @click="batchDownload" :disabled="!selectedFileList.length > 0"  type="warning">Download file</Button>
                </div>
            </Col>
            <Col span="14" style="text-align:right">
                <div class="section-search">
                    <Input v-model="searchValue" style="width: 400px">
                        <span slot="prepend">Search file: {{prefix}}</span>
                        <Button @click="searchFile(searchValue)" :disabled="searchValue === ''" slot="append" icon="ios-search"></Button>
                    </Input>
                    <Button class="button-reset" @click="searchValue = '';searchMode = false;getData()">Reset</Button>
                </div>
            </Col>
        </Row>
        <Modal v-model="copyModal">
            <div style="text-align:left">
                Copy {{selectedFileKey}} link?
            </div>
            <div slot="footer" class="copy-modal-footer">
                <Button type="text" @click="copyModal = false">
                    <span>Cancle</span>
                </Button>
                <Button type="info" @click="copyModal = false;$Message.success('Copied')" :data-clipboard-text="clipUrl" v-clip>Copy!</Button>
            </div>
        </Modal>
        <Modal v-model="createFolderModal" title="Add folder" ok-text="OK" @on-ok="addFolder" @on-cancel="createFolderValue = ''" cancel-text="Cancel">
            <Input v-model="createFolderValue" @on-change="check" placeholder="Requires folder name"></Input>
            <span class="info-input-error">{{inputCheck ? 'Requires 1 characters' : ''}}</span>
        </Modal>
        <Modal v-model="showImageModal" :title="selectedFileKey || 'no title'" width="900">
            <div class="section-img">
                <img :src="clipUrl" />
            </div>
            <div slot="footer" class="copy-modal-footer">
                <Button type="primary" @click="showImageModal = false;clipUrl = ''">
                    <span>Close</span>
                </Button>
            </div>
        </Modal>
        <a download id="element-download" style="display:none"><span id="span-download"></span></a>
        <Table :show-header="showHeader" :stripe="true" :context="self" :highlight-row="true" :columns="fileHeader" :data="fileList" @on-selection-change="select" no-data-text="No file"></Table>
        <div class="section-paging">
            <Tooltip content="Home page" placement="top"><Button v-show="makerArray.length > 0" @click="getData('',searchValue);makerArray.length = 0" type="ghost"><Icon type="home" size="18"></Icon></Button></Tooltip>
            <Tooltip content="Previous page" placement="top"><Button v-show="makerArray.length > 0" @click="previousPage()" type="ghost"><Icon type="arrow-left-b" size="18"></Icon></Button></Tooltip>
            <Tooltip content="Next page" placement="top"><Button v-show="nextMarker" @click="nextPage()" type="ghost"><Icon type="arrow-right-b" size="18"></Icon></Button></Tooltip>
        </div>
    </div>
</template>
<script>
import { getAWS, handler } from '../service/Aws'
import { bytes, keyFilter, convertPrefix2Router, removeItemFromArray } from '../service/bucketService'
import Clipboard from 'clipboard'
import moment from 'moment'
export default {
    data() {
        return {
            clipUrl: '',
            searchValue: '',
            copyModal: false,
            nextMarker: '',
            makerArray: [],
            showImageModal: false,
            createFolderModal: false,
            searchMode: false,
            createFolderValue: '',
            selectedFileKey: '',
            selectedFileList: [],
            inputCheck: false,
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
        async getData(nextMarker, searchValue = '') {
            this.$Loading.start()
            //this.setLoading(true)
            try {
                let self = this
                let res = await handler('listObjects', {
                    Bucket: this.bucket,
                    Delimiter: '/',
                    MaxKeys: 100,
                    Marker: nextMarker || this.prefix,
                    Prefix: this.prefix + searchValue
                })
                this.nextMarker = res.NextMarker
                this.fileList = await _.forEach(res.CommonPrefixes, (foler) => {
                    foler.Key = keyFilter(foler.Prefix, self.prefix)
                    foler.Type = 'folder'
                    foler.LastModified = ''
                    foler.convertSize = ''
                }).concat(_.forEach(res.Contents, (item) => {
                    item.Key = keyFilter(item.Key, self.prefix)
                    item.convertSize = bytes(item.Size)
                    item.Type = 'file'
                    item.isImage = isImage(item)
                    item.LastModified = moment(item.LastModified).format('YYYY-MM-DD HH:mm')
                }))
                document.querySelector("#app").scrollTop = 0;
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
                console.log(error)
            }
        },
        previousPage() {
            let maker = this.makerArray[this.makerArray.length - 2]
            this.makerArray.pop()
            this.getData(maker,this.searchValue)
        },
        nextPage() {
            this.nextMarker && this.makerArray.push(this.nextMarker)
            this.getData(this.nextMarker,this.searchValue)
        },
        searchFile(value) {
            this.searchMode = true
            this.getData(this.prefix, value)
        },
        async addFolder() {
            if (!this.createFolderValue) return
            try {
                await handler('putObject', { Bucket: this.bucket, Key: this.prefix + this.createFolderValue + '/', Body: '' })
                this.$Message.success('Create a folder successfully')
                this.getData()
            } catch (error) {
                this.$Message.error('Create a folder failed')
            }
        },
        async clipModal(file) {
            this.$Loading.start()
            this.clipUrl = await getURL(this.bucket, file, this.prefix)
            this.selectedFileKey = file.Key
            this.copyModal = true
            this.$Loading.finish()
        },
        download(url) {
            document.querySelector("#element-download").href = url
            document.querySelector("#span-download").click()
        },
        async downloadFile(file) {
            let self = this
            if (file.Type === 'file') {
                let url = await getURL(this.bucket, file, this.prefix)
                this.download(url)
            } else {
                let res = await handler('listObjects', {
                    Bucket: this.bucket,
                    Prefix: this.prefix + file.Prefix,
                    Delimiter: '/',
                    Marker: this.prefix + file.Prefix,
                })
                _.each(res.Contents, async file => {
                    let url = await getURL(self.bucket, file, self.prefix)
                    self.download(url)
                })
            }
        },
        async imageModal(file) {
            this.$Loading.start()
            this.clipUrl = await getURL(this.bucket, file, this.prefix)
            this.selectedFileKey = file.Key
            this.showImageModal = true
            this.$Loading.finish()
        },
        batchDeleteFileConfirm() {
            this.$Modal.confirm({
                content: `Are you sure you want to delete the selected files?`,
                okText: 'Yes',
                cancelText: 'Cancle',
                onOk: () => this.batchDelete()
            })
        },
        deleteFileConfirm(file) {
            this.$Modal.confirm({
                content: `Are you sure you want to delete [${file.Key}]?`,
                okText: 'Yes',
                cancelText: 'Cancle',
                onOk: () => this.deleteFile(file)
            })
        },
        async deleteFile(file) {
            try {
                if (file.Type === 'file') {
                    await handler('deleteObject', { Bucket: this.bucket, Key: this.prefix + file.Key })
                } else {
                    let res = await handler('listObjects', {
                        Bucket: this.bucket,
                        Prefix: file.Prefix
                    })
                    batchDeleteFileHandle(res.Contents, this.bucket, this.prefix)
                }
                this.fileList.splice(file._index, 1)
                this.$Message.success('Delete file successfully')
            } catch (error) {
                this.$Message.error('Delete file failed')
            }
        },
        async batchDelete() {
            let self = this
            await Promise.all(Array.map(self.selectedFileList, (file) => self.deleteFile(file)))
            self.getData()
        },
        async batchDownload() {
            let self = this
            await Promise.all(Array.map(self.selectedFileList, (file) => self.downloadFile(file)))
        },
        openFolder(item) {
            this.$router.push({ name: 'file', params: { bucket: this.bucket, prefix: item.Prefix } })
        },
        getUrl(prefix) {
            return `/bucket/${this.bucket}/prefix/${prefix.replace('/', '%2F')}`
        },
        upload() {
            this.$router.push({ name: 'upload', params: { bucket: this.bucket, prefix: this.$route.params.prefix } })
        },
        check() {
            this.inputCheck = this.createFolderValue.length > 0 ? false : true
        },
        select(selection) {
            this.selectedFileList = selection
        },
        setLoading(bol) {
            this.$store.dispatch('setLoading', bol)
        },
        goFilePermissions(item){
            this.$router.push({ name: 'FilePermissions', params: { bucket: this.bucket, prefix: this.$route.params.prefix, key: item.Key} })
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

const batchDeleteFileHandle = async (list, bucket, prefix) => {
    await Promise.all(Array.map(list, (file) => handler('deleteObject', { Bucket: bucket, Key: file.Key })))
}

const isImage = (file) => /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.Key) ? true : false

const getURL = async (bucket, file, prefix) => {
    try {
        let params = { Bucket: bucket, Key: prefix + file.Key }
        let s3 = await getAWS()
        let url = await s3.getSignedUrl('getObject', params)
        let acl = await handler('getObjectAcl', params)
        let isAllUser = _.find(acl.Grants, (item) => item.Grantee.URI && item.Grantee.URI === 'http://acs.amazonaws.com/groups/global/AllUsers')
        return isAllUser ? url.split('?')[0] : url
    } catch (error) {
        console.log(error)
    }
}

const fileHeaderSetting = [{
    type: 'selection',
    width: 40,
    align: 'center'
},
{
    title: 'Key',
    key: 'Key',
    width: 240,
    ellipsis: true,
    sortable: true,
    render(row, column, index) {
        return row.Type === 'file' ? `<Icon type="document"></Icon> <strong>${row.Key}</strong>` : `<Icon type="folder"></Icon> <span class="link-folder" @click="openFolder(row)">${row.Key}</span>`;
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
        return row.Type === 'folder' ? `<Tooltip content="Delete folder" :delay="1000" placement="top"><i-button size="small" @click="deleteFileConfirm(row)"><Icon type="ios-trash" :size="iconSize"></Icon></i-button></Tooltip>` :
            `<Tooltip content="File setting" :delay="1000" placement="top"><i-button @click="goFilePermissions(row)" size="small"><Icon type="gear-a" :size="iconSize"></Icon></i-button></Tooltip>
                        <Tooltip content="Download file" :delay="1000" placement="top"><i-button size="small" @click="downloadFile(row)"><Icon type="ios-cloud-download" :size="iconSize"></Icon></i-button></Tooltip>
                        <Tooltip content="Image preview" :delay="1000" placement="top"><i-button size="small" :disabled="row && !row.isImage" @click="imageModal(row)"><Icon type="eye" :size="iconSize"></Icon></i-button></Tooltip>
                        <Tooltip content="Copy file link" :delay="1000" placement="top"><i-button size="small" @click="clipModal(row)"><Icon type="link" :size="iconSize"></Icon></i-button></Tooltip>
                        <Tooltip content="Delete file" :delay="1000" placement="top"><i-button size="small" @click="deleteFileConfirm(row)"><Icon type="ios-trash" :size="iconSize"></Icon></i-button></Tooltip>`;
    }
}
]

</script>
<style lang="less" scoped>
.section-img {
    width: 100%;
    text-align: center;
    img {
        max-width: 844px;
        max-height: 600px;
    }
}

.section-search {
    width: 465px;
    display: inline-flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.link-folder {
    font-weight: bold;
    color: #1088E9;
    cursor: pointer;
}

.button-reset {
    margin-top: 2px;
    background-color: #eee !important;
    border-radius: 0 !important;
}

.layout-bsc-toolbar {
    padding-bottom: 8px;
    border-bottom: 1px solid #f2f1f6;
    button {
        margin-right: 1px;
    }
}

.section-paging {
    height: 40px;
    width: 100%;
    display: inline-flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    button {
        width: 70px;
        margin-left: 6px;
    }
}

.ivu-modal-footer {
    border-top: 0 !important;
}
</style>

