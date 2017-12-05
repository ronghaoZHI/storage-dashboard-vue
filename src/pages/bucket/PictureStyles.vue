<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Breadcrumb>
                <Breadcrumb-item :href="bucketPath">{{$t("STORAGE.TITLE")}}</Breadcrumb-item>
                <Breadcrumb-item>{{$t("STORAGE.PIC_STYLE")}} ({{bucket}})</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <div class="toolbar-nav">
            <Button type="primary" @click="goCreateStyle">{{$t("STORAGE.CREATE_STYLE")}}</Button>
            <Button type="primary" @click="uploadModal" >{{$t("STORAGE.IMPORT_STYLE")}}</Button>
        </div>
        <Table border :show-header="showHeader" :stripe="true" :context="self" :columns="styleHeader" :data="styleList" :no-data-text='$t("STORAGE.NO_STYLE")'></Table>
        <Modal v-model="showImageModal" :title='selectedStyleName' width="900">
            <div class="section-img">
                <img :src="clipUrl" />
            </div>
            <div slot="footer"></div>
        </Modal>
        <Modal v-model="showUploadModal" title='Upload settings files' width="700">
            <upload accept="application/json" :prefix="prefix" :bucket="bucket" :checkFileType="true" :validateMessage='$t("STORAGE.PIC_UPLOAD_INFO")' :validation="uploadValidation" v-if="showUploadModal" v-on:uploadSuccess="uploadSuccess"></upload>
            <div slot="footer" class="copy-modal-footer">
                 <Button style="visibility:hidden" type="primary"></Button>
            </div>
        </Modal>
        <a download id="element-download" style="display:none"><span id="span-download"></span></a>
    </div>
</template>

<script>
import { getS3, handler } from '@/service/Aws'
import { prefix, Utf8ArrayToStr } from '@/service/bucketService'
import { I2J, previewAccessKey, previewSecretKey } from './Consts'
import upload from '@/components/upload/upload'
import iView from 'iview-bsc'
import { IMGX_PREVIEW } from '@/service/API'
export default {
    data () {
        return {
            iconSize: 18,
            self: this,
            showHeader: true,
            styleList: [],
            fontName: this.fontName,
            showImageModal: false,
            clipUrl: '',
            selectedStyleName: '',
            showUploadModal: false,
            prefix: prefix.rules,
            uploadValidation: /\.(json|JSON)$/,
            styleHeader: [{
                title: 'Name',
                key: 'ruleName',
                width: 150
            }, {
                title: 'Styles',
                width: 300,
                ellipsis: true,
                key: 'IS'
            }, {
                title: 'Quality',
                key: 'quality',
                width: 150
            }, {
                title: 'Format',
                key: 'format',
                width: 150
            }, {
                title: 'Actions',
                key: 'actions',
                width: 170,
                render: (h, params) => {
                    return h('div', [
                        h('Tooltip', {
                            props: {
                                content: this.$t('STORAGE.IMG_PREVIEW'),
                                delay: 1000,
                                placement: 'top'
                            },
                            'class': {
                                'mar-r-5': true
                            }
                        }, [h('i-button', {
                            props: {
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.previewModal(params.row)
                                }
                            }
                        }, [h('Icon', {
                            props: {
                                type: 'eye',
                                size: this.iconSize
                            }
                        })
                        ])
                        ]),
                        h('Tooltip', {
                            props: {
                                content: this.$t('STORAGE.EXPORT_STYLE'),
                                delay: 1000,
                                placement: 'top'
                            },
                            'class': {
                                'mar-r-5': true
                            }
                        }, [h('i-button', {
                            props: {
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.exportStyle(params.row)
                                }
                            }
                        }, [h('Icon', {
                            props: {
                                type: 'share',
                                size: this.iconSize
                            }
                        })
                        ])
                        ]), h('Tooltip', {
                            props: {
                                content: this.$t('STORAGE.EDIT'),
                                delay: 1000,
                                placement: 'top'
                            },
                            'class': {
                                'mar-r-5': true
                            }
                        }, [h('i-button', {
                            props: {
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.goEdit(params.row)
                                }
                            }
                        }, [h('Icon', {
                            props: {
                                type: 'compose',
                                size: this.iconSize
                            }
                        })
                        ])
                        ]), h('Tooltip', {
                            props: {
                                content: this.$t('STORAGE.DELETE_STYLE'),
                                delay: 1000,
                                placement: 'top'
                            }
                        }, [h('i-button', {
                            props: {
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.deleteStyleConfirm(params.row)
                                }
                            }
                        }, [h('Icon', {
                            props: {
                                type: 'ios-trash',
                                size: this.iconSize
                            }
                        })
                        ])
                        ])
                    ])
                }
            }]
        }
    },
    computed: {
        bucket () {
            return this.$route.params.bucket
        },
        bucketPath () {
            return `/bucket/${this.$route.params.bucket}`
        }
    },
    components: { upload },
    created () {
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
                    Prefix: prefix.rules
                })
                const fileList = res.Contents
                _.each(fileList, file => {
                    // make sure this is a json file
                    /.json$/.test(file.Key) && this.getObject(file)
                })
                this.$Loading.finish()
            } catch (error) {
                this.$Message.error(this.$t('STORAGE.GET_RULES_FAILED'))
            }
        },
        async getObject (file) {
            let params = {
                Bucket: this.bucket,
                Key: file.Key
            }
            let res = await handler('getObject', params)
            let fileJson = JSON.parse(Utf8ArrayToStr(res.Body))
            let ruleName = file.Key.split(prefix.rules)[1].split('.json')[0]
            this.styleList.push({'ruleName': ruleName, ...this.convert2list(fileJson)})
        },
        convert2list (data) {
            const listItem = {
                quality: '--',
                format: this.$t('STORAGE.FORMAT_ORIGINAL')
            }
            const ISArry = []
            const overlayList = new Set()
            _.each(data, item => {
                const itemConvert = this.json2instruction(item)
                ISArry.push(itemConvert.instruction)
                if (!!itemConvert.overlayFileName) {
                    overlayList.add(itemConvert.overlayFileName)
                }
                if (!!item.format) {
                    listItem.quality = item.quality || ''
                    listItem.format = item.format
                }
            })
            listItem.overlayList = overlayList
            listItem.IS = ISArry.join('--')
            return listItem
        },
        deleteStyleConfirm (style) {
            this.$Modal.confirm({
                content: this.$t('STORAGE.DELETE_CONFIRMED', {fileName: style.ruleName}),
                okText: this.$t('PUBLIC.CONFIRMED'),
                cancelText: this.$t('PUBLIC.CANCLE'),
                title: this.$t('PUBLIC.DELETE'),
                onOk: () => this.deleteStyle(style)
            })
        },
        async deleteStyle (style) {
            try {
                await handler('deleteObject', {
                    Bucket: this.bucket,
                    Key: prefix.rules + style.ruleName + '.json'
                })
                this.styleList.splice(style._index, 1)
                this.$Message.success(this.$t('STORAGE.DELETE_STYLE_SUCCESS'))
            } catch (error) {
                this.$Message.error(this.$t('STORAGE.DELETE_STYLE_FAILED'))
            }
        },
        async exportStyle (style) {
            let url = await getURL(this.bucket, prefix.rules + style.ruleName + '.json')
            document.querySelector('#element-download').href = url
            document.querySelector('#span-download').click()
        },
        goEdit (style) {
            this.$router.push({ name: 'editStyles', params: { bucket: this.bucket, ruleName: style.ruleName, IS: style.IS } })
        },
        json2instruction (jsonData) {
            let instructionArray = []
            let overlayFileName = ''
            _.each(jsonData, (value, key) => {
                let item = ''
                if (key === 'overlay') {
                    overlayFileName = /^text:.*/.test(value) ? /^text:(.*):(.*)/.exec(value)[1] + '.json' : value + '.png'
                }
                item = _.invert(I2J)[key] + value
                instructionArray.push(item)
            })
            return {
                instruction: instructionArray.join(','),
                overlayFileName
            }
        },
        async previewModal (style) {
            this.$Loading.start()
            if (style.overlayList.size > 0) {
                var promises = []
                style.overlayList.forEach(item => {
                    promises.push(this.putOverlayObject(item))
                })
                await Promise.all(promises)
            }
            this.clipUrl = IMGX_PREVIEW + style.IS + '/dashboard.jpg?' + Date.now()
            this.selectedStyleName = style.ruleName
            this.showImageModal = true
            this.$Loading.finish()
        },
        async putOverlayObject (fileName) {
            const file = await handler('getObject', {
                Bucket: this.bucket,
                Key: prefix.overlay + fileName
            })
            const s3 = await getS3({key: {accesskey: previewAccessKey, secretkey: previewSecretKey}})
            return new Promise((resolve, reject) => s3.putObject({
                Bucket: 'image-example',
                Key: prefix.overlay + fileName,
                ContentType: file.ContentType,
                Body: file.Body
            }, (error, data) => {
                error && iView.Message.error(error.message, 5)
                return error ? reject(error) : resolve(data)
            }))
        },
        uploadModal () {
            this.showUploadModal = true
        },
        uploadSuccess (fileName) {
            const file = {Key: this.prefix + fileName}
            this.getObject(file).then(res => {
                this.showUploadModal = false
            })
        }
    }
}

const getURL = async (bucket, key) => {
    try {
        let params = { Bucket: bucket, Key: key }
        let s3 = await getS3()
        let url = await s3.getSignedUrl('getObject', params)
        let acl = await handler('getObjectAcl', params)
        let isAllUser = _.find(acl.Grants, (item) => item.Grantee.URI && item.Grantee.URI === 'http://acs.amazonaws.com/groups/global/AllUsers')
        return isAllUser ? url.split('?')[0] : url
    } catch (error) {
        console.log(error)
    }
}
</script>

<style lang="less" scoped>

.dark .layout-bsc-toolbar {
    border-bottom: @common-border-dark;
}

.layout-bsc-toolbar {
    padding-bottom: 8px;
    border-bottom: 1px solid #f2f1f6;
}
</style>
