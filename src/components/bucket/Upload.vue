<template>
    <div>
        <div class="layout-bsc-toolbar">
            <div>
                <Button @click="back">Back</Button>
            </div>
        </div>
        <div class="section-file-upload"
             draggable="true"
             v-upload="self">
            <input type="file"
                   multiple="multiple"
                   class="ivu-upload-input">
            <div style="padding: 50px 0px;"><i class="ivu-icon ivu-icon-ios-cloud-upload"
                   style="font-size: 52px; color: rgb(51, 153, 255);"></i>
                <p>Click or drag the file here to upload</p>
            </div>
        </div>
        <div class="section-file-list">
            <Table :context="self"
                   :show-header="false"
                   no-data-text="No data"
                   :highlight-row="true"
                   :columns="header"
                   :data="fileList"></Table>
        </div>
    </div>
</template>
<script>
import { getAWS } from '../service/Aws'
import moment from 'moment'
import { bytes } from '../service/bucketService'
export default {
    data() {
        return {
            fileList: [],
            self: this,
            iconSize: 18,
            header: headSetting
        }
    },
    directives: {
        upload: {
            bind: function (el, binding) {
                el.ondrop = (e) => {
                    e.preventDefault()
                    pushFile2Vue(e.dataTransfer.files)
                },
                el.onclick = (e) => {
                    let fileInput = el.children[0]
                    //click events bubble up the ancestry tree and the change event will trigge twice
                    //how to change this listener function to arrow function ?
                    fileInput.addEventListener("click", (e) => {e.stopPropagation()}, false)
                    fileInput.onchange = (e) => {pushFile2Vue(e.target.files)}

                    fileInput.click()
                }
                const pushFile2Vue = (files) => {
                    console.log(files)
                    //binding.value => vue(this)
                    //but using dataset is best 
                    Array.from(files).forEach((item) => {
                        binding.value.fileList.push({
                            name: item.name,
                            lastModifiedDate: moment(item.lastModifiedDate).format('YYYY-MM-DD HH:mm'),
                            size: bytes(item.size),
                            progress: 0,
                            file: item
                        })
                    })
                }
            }
        }
    },
    methods: {
        deleteFile() {

        },
        back() {
            this.$router.push({ name: 'file', params: { bucket: this.$route.params.bucket, prefix: this.$route.params.prefix } })
        },
        async uploadFile(item) {
            let file = item.file
            let params = {
                Bucket: this.$route.params.bucket,
                Key: file.name,
                ContentType: file.type,
                Body: file
            }
            let aws = await getAWS(360000)
            return aws.upload(params, {
                partSize: 10000 * 1024 * 1024
            }).on('httpUploadProgress', function (evt) {
                item.progress = parseInt((evt.loaded * 100) / evt.total)
            }).promise()
        }
    },
    watch: {
        'fileList'(to, from) {
            let self = this
            if (to.length > 0) {
                to.forEach((file) => {
                    self.uploadFile(file).then(res => self.$Message.success(`Upload ${file.name} success`),error => self.$Message.error(`Upload ${file.name} fail`,5))
                })
            }
        }
    }
}

const headSetting = [
    {
        title: 'File name',
        key: 'name'
    }, {
        title: 'LastModifiedDate',
        width: 150,
        key: 'lastModifiedDate'
    }, {
        title: 'Size',
        align: 'right',
        width: 150,
        key: 'size'
    },
    {
        title: 'Progress',
        width: 350,
        key: 'progress',
        render(row, column, index) {
            return `<Progress :percent="100"></Progress>`
        }
    }
    , {
        title: 'Actions',
        key: 'actions',
        width: 100,
        align: 'left',
        render(row, column, index) {
            return `<i-button style="margin: 0 6px;" size="small" @click.stop="deleteFile(${index})"><Icon type="ios-trash" :size="iconSize"></Icon></i-button>`;
        }
    }
]

</script>
<style lang="less" scoped>
.section-file-upload {
    width: 100%;
    height: 200px;
    border: 1px dashed #d7dde4;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    transition: border-color .2s ease;
    .ivu-upload-input {
        display: none;
    }
    p {
        font-size: 16px;
    }
}

.section-file-list {
    margin-top: 5px;
}

.section-file-upload:hover {
    border: 1px dashed #39f;
}
</style>