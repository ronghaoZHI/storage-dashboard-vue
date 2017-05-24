<template>
    <div>
        <div class="layout-bsc-toolbar">
            <div>
                <Button @click="back">{{$t("PUBLIC.BACK")}}</Button>
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
                <p>{{$t("STORAGE.FILE_UPLOAD_LIM")}}</p>
            </div>
        </div>
        <ul class="section-file-list">
            <li v-for="file in fileList"
                class="list-file">
                <span class="upload-span-name">{{file.name}}</span>
                <span class="upload-span-size">{{file.size}}</span>
                <Progress :percent="file.progress">
                    <Icon type="checkmark-circled"></Icon>
                </Progress>
                <span class="upload-span-status">{{file.progress === 100 ? 'Success' : file.request && file.request.faileded ? 'failed' : 'Uploading'}}</span>
                <Button @click="deleteFile(file)" type="text" style="width:48px"><Icon type="close"></Icon></Button>
            </li>
        </ul>
    </div>
</template>
<script>
import { getAWS } from '@/service/Aws'
import moment from 'moment'
import { bytes } from '@/service/bucketService'
export default {
    data() {
        return {
            fileList: [],
            self: this,
        }
    },
    computed: {
        bucket: function () {
            return this.$route.params.bucket
        },
        prefix: function () {
            return this.$route.params.prefix === 'noprefix' ? '' : this.$route.params.prefix
        }
    },
    directives: {
        upload: {
            bind: function (el, binding) {
                el.ondrop = (e) => {
                    e.preventDefault()
                    Array.from(e.dataTransfer.items).forEach((item) => {
                        let entry = item.webkitGetAsEntry()
                        entry && traverseFileTree(entry)
                    })
                }
                el.onclick = (e) => {
                    let fileInput = el.children[0]
                    //click events bubble up the ancestry tree and the change event will trigge twice
                    //fileInput.onclick((e,false) => e.stopPropagation()) not work ...
                    fileInput.addEventListener("click", (e) => { e.stopPropagation() }, false)
                    fileInput.onchange = (e) => { pushFile2Vue(e.target.files) }
                    fileInput.click()
                }

                const traverseFileTree = (item, path = '') => {
                    if (item.isFile && item.name !== '.DS_Store') {
                        pushFile2Vue(item, path)
                    } else if (item.isDirectory) {
                        // get folder contents
                        let dirReader = item.createReader()
                        dirReader.readEntries((entries) => {
                            Array.from(entries).forEach((file) => traverseFileTree(file, path + item.name + "/"))
                        })
                    }
                }

                const pushFile2Vue = (target, path) => {
                    //binding.value => vue(this)
                    //but using dataset is best 

                    //when file upload by drag, we must get file itself by file.file()
                    !target.isFile ? Array.from(target).forEach((item) => {
                        binding.value.fileList.push({
                            name: item.name,
                            lastModifiedDate: moment(item.lastModifiedDate).format('YYYY-MM-DD HH:mm'),
                            size: bytes(item.size),
                            progress: 0,
                            file: item,
                            isUpload: false
                        })
                    }) : target.file((item) => {
                        binding.value.fileList.push({
                            name: path + item.name,
                            lastModifiedDate: moment(item.lastModifiedDate).format('YYYY-MM-DD HH:mm'),
                            size: bytes(item.size),
                            progress: 0,
                            file: item,
                            isUpload: false
                        })
                    },(error) => {
                        console.log(error)
                    })
                }
            }
        }
    },
    methods: {
        deleteFile(file) {
            this.$Message.error('Sorry, we will provide this functionality in the next version')
            //file.request.abort()
        },
        back() {
            this.$router.push({ name: 'file', params: { bucket: this.bucket, prefix: this.$route.params.prefix } })
        },
        async uploadFile(item) {
            console.log(item)
            let file = item.file
            let params = {
                Bucket: this.bucket,
                Key: this.prefix + item.name,
                ContentType: file.type,
                Body: file
            }
            let aws = await getAWS(360000)
            let request = aws.upload(params, {partSize: 10000 * 1024 * 1024})
            request.on('httpUploadProgress', function (evt) {
                item.progress = parseInt((evt.loaded * 100) / evt.total)
                item.request = request
            })
            return request.promise()
        }
    },
    watch: {
        'fileList' (to, from) {
            let self = this
            if (to.length > 0) {
                to.forEach((file) => {
                    if (!file.isUpload) {
                        file.isUpload = true
                        self.uploadFile(file).then(res => res, error => self.$Message.error($t("STORAGE.UPLOAD_FAILED",{fileName:file.name}), 5))
                    }
                })
            }
        }
    }
}

</script>
<style lang="less" scoped>
.section-file-upload {
    width: 100%;
    height: 200px;
    border: 2px dashed #d7dde4;
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
    border: 2px dashed #39f;
}

.upload-hover{
    border: 2px dashed #39f;
}

.list-file {
    width: 100%;
    height: 50px;
    background: #e9e9e9;
    padding: 0 8px;
    margin: 3px 0;
    border-radius: 3px;
    display: inline-flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .upload-span-name {
        flex: 5;
    }
    .upload-span-size {
        width: 60px;
        text-align: right;
        margin-right: 40px;
    }
    .upload-span-status {
        width: 100px;
    }
    button {
        width: 22px;
        border: 0;
        background: 0;
        cursor: pointer;
    }
    button:focus {
        background: #d9d9d9;
        outline: 0
    }
    div {
        flex: 6;
    }
}
</style>