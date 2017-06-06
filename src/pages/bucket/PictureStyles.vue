<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Breadcrumb>
                <Breadcrumb-item href="/">{{$t("STORAGE.TITLE")}}</Breadcrumb-item>
                <Breadcrumb-item>{{$t("STORAGE.PIC_STYLE")}} ({{bucket}})</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <div class="toolbar-nav">
            <Button type="primary" @click="goCreateStyle">{{$t("STORAGE.CREATE_STYLE")}}</Button>
            <Button type="primary" @click="uploadModal" >{{$t("STORAGE.IMPORT_STYLE")}}</Button>
        </div>
        <Table border :show-header="showHeader" :stripe="true" :context="self" :highlight-row="true" :columns="styleHeader" :data="styleList" :no-data-text='$t("STORAGE.NO_STYLE")'></Table>
        <Modal v-model="showImageModal" :title='selectedStyleName' width="900">
            <div class="section-img">
                <img :src="clipUrl" />
            </div>
            <div slot="footer"></div>
        </Modal>
        <Modal v-model="showUploadModal" :title='$t("STORAGE.FILE_PERMISSION")' width="700">
            <upload v-if="showUploadModal" v-on:uploadSuccess="uploadSuccess" :bucket="bucket" :prefix="prefix"></upload>
            <div slot="footer" class="copy-modal-footer">
                 <Button style="visibility:hidden" type="primary"></Button>
            </div>
        </Modal>
        <a download id="element-download" style="display:none"><span id="span-download"></span></a>
    </div>
</template>

<script>
import { getAWS, handler } from '@/service/Aws'
import { picStylePrefix, Utf8ArrayToStr } from '@/service/BucketService'
import upload from '@/components/bucket/upload'
export default {
    data () {
        return {
            iconSize: 18,
            self: this,
            showHeader: true,
            styleHeader: styleHeaderSetting,
            styleList: [],
            fontName: this.fontName,
            showImageModal: false,
            clipUrl: '',
            selectedStyleName: '',
            showUploadModal: false,
            prefix: picStylePrefix
        }
    },
    computed: {
        bucket () {
            return this.$route.params.bucket
        }
    },
    components: { upload },
    mounted () {
        this.getList()
    },
    methods: {
        goCreateStyle () {
            this.$router.push({ name: 'editStyles', params: { bucket: this.bucket, ruleName: 'noRuleName', IS: 'noIS' } })
        },
        async getList () {
            try {
                this.$Loading.start()
                let res = await handler('listObjects', {
                    Bucket: this.bucket,
                    Prefix: picStylePrefix
                })
                const fileList = res.Contents
                _.each(fileList, file => {
                    if (file.Key.split('.json').length === 2) {
                        this.getObject(file)
                    }
                })
                this.$Loading.finish()
            } catch (error) {
                this.$Message.error(this.$t('STORAGE.ADD_FOLDER_FAILED'))
            }
        },
        async getObject (file) {
            let params = {
                Bucket: this.bucket,
                Key: file.Key
            }
            let res = await handler('getObject', params)
            let fileJson = JSON.parse(Utf8ArrayToStr(res.Body))
            if (fileJson[0]) {
                let ruleName = file.Key.split(picStylePrefix)[1].split('.json')[0]
                this.styleList.push({'ruleName': ruleName, ...this.convert2list(fileJson)})
            }
        },
        deleteStyleConfirm (style) {
            this.$Modal.confirm({
                content: this.$t('STORAGE.DELETE_CONFIRMED', {fileName: style.ruleName}),
                okText: this.$t('PUBLIC.CONFIRMED'),
                cancelText: this.$t('PUBLIC.CANCLE'),
                onOk: () => this.deleteStyle(style)
            })
        },
        async deleteStyle (style) {
            try {
                await handler('deleteObject', {
                    Bucket: this.bucket,
                    Key: picStylePrefix + style.ruleName + '.json'
                })
                this.styleList.splice(style._index, 1)
                this.$Message.success(this.$t('STORAGE.DELETE_STYLE_SUCCESS'))
            } catch (error) {
                this.$Message.error(this.$t('STORAGE.DELETE_STYLE_FAILED'))
            }
        },
        async exportStyle (style) {
            let url = await getURL(this.bucket, picStylePrefix + style.ruleName + '.json')
            document.querySelector('#element-download').href = url
            document.querySelector('#span-download').click()
        },
        goEdit (style) {
            this.$router.push({ name: 'editStyles', params: { bucket: this.bucket, ruleName: style.ruleName, IS: style.IS } })
        },
        json2instruction (jsonData) {
            let instructionArray = []
            let fontName = ''
            let watermarkerText = ''
            _.each(jsonData, (value, key) => {
                let item = ''
                if (key === 'overlay') {
                    fontName = value
                } else if (key === 'text') {
                    watermarkerText = value
                } else {
                    item = J2I[key] + value
                    instructionArray.push(item)
                }
            })
            if (!!fontName) {
                instructionArray.push('l_text:' + fontName + ':' + watermarkerText)
            }
            return instructionArray.join(',')
        },
        convert2list (data) {
            const listItem = {
                quality: '--',
                format: '原图格式'
            }
            const ISArry = []
            _.each(data, item => {
                ISArry.push(this.json2instruction(item))
                if (!!item.format) {
                    listItem.quality = item.quality
                    listItem.format = item.format
                }
            })
            listItem.IS = ISArry.join('--')
            return listItem
        },
        previewModal (style) {
            this.$Loading.start()
            const ruleIS = style.IS
            this.clipUrl = 'http://imgx-ss.bscstorage.com/imgx-test/' + ruleIS + '/dashboard.jpg'
            this.selectedStyleName = style.ruleName
            this.showImageModal = true
            this.$Loading.finish()
        },
        uploadModal () {
            this.showUploadModal = true
        },
        uploadSuccess (fileName) {
            const file = {Key: picStylePrefix + fileName}
            this.getObject(file)
        }
    },
    watch: {
        // the contents array need refresh when the $route value changed
        '$route' (to, from) {
            to.path !== from.path && this.getData()
        }
    }
}
const getURL = async (bucket, key) => {
    try {
        let params = { Bucket: bucket, Key: key }
        let s3 = await getAWS()
        let url = await s3.getSignedUrl('getObject', params)
        let acl = await handler('getObjectAcl', params)
        let isAllUser = _.find(acl.Grants, (item) => item.Grantee.URI && item.Grantee.URI === 'http://acs.amazonaws.com/groups/global/AllUsers')
        return isAllUser ? url.split('?')[0] : url
    } catch (error) {
        console.log(error)
    }
}
const J2I = {
    crop: 'c_',
    width: 'w_',
    height: 'h_',
    gravity: 'g_',
    x: 'x_',
    y: 'y_',
    quality: 'q_',
    radius: 'r_',
    angle: 'a_',
    effect: 'e_',
    opacity: 'o_',
    border: 'bo_',
    background: 'b_',
    format: 'f_',
    version: 'v_',
    transformation: 't_'
}
const styleHeaderSetting = [{
    title: 'Rule name(规则名)',
    key: 'ruleName',
    width: 150
}, {
    title: 'Picture styles(图片样式)',
    width: 300,
    ellipsis: true,
    key: 'IS'
}, {
    title: 'Quality(图片质量)',
    key: 'quality',
    width: 150
}, {
    title: 'Format(图片格式)',
    key: 'format',
    width: 150
}, {
    title: 'Operate(操作)',
    key: 'actions',
    width: 170,
    align: 'right',
    render (row, column, index) {
        return `<Tooltip :content='$t("STORAGE.IMG_PREVIEW")' :delay="1000" placement="top"><i-button size="small" @click="previewModal(row)"><Icon type="eye" :size="iconSize"></Icon></i-button></Tooltip>
                <Tooltip :content='$t("STORAGE.EXPORT_STYLE")' :delay="1000" placement="top"><i-button size="small" @click="exportStyle(row)"><Icon type="ios-cloud-download" :size="iconSize"></Icon></i-button></Tooltip>
                <Tooltip :content='$t("STORAGE.EDIT")' :delay="1000" placement="top"><i-button @click="goEdit(row)" size="small"><Icon type="gear-a" :size="iconSize"></Icon></i-button></Tooltip>
                <Tooltip :content='$t("STORAGE.DELETE_STYLE")' :delay="1000" placement="top"><i-button size="small" @click="deleteStyleConfirm(row)"><Icon type="ios-trash" :size="iconSize"></Icon></i-button></Tooltip>`
    }
}
]
</script>

<style lang="less" scoped>
.layout-bsc-toolbar {
    padding-bottom: 8px;
    border-bottom: 1px solid #f2f1f6;
}
</style>
