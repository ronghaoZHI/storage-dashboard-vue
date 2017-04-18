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
        <ul class="section-file-list">
            <li v-for="file in fileList"
                class="list-file">
                <span class="span-name">{{file.name}}</span>
                <span class="span-size">{{file.size}}</span>
                <Progress :percent="file.progress">
                    <Icon type="checkmark-circled"></Icon>
                </Progress>
            </li>
        </ul>
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
                        //fileInput.onclick((e,false) => e.stopPropagation()) not work ...
                        fileInput.addEventListener("click", (e) => { e.stopPropagation() }, false)
                        fileInput.onchange = (e) => { pushFile2Vue(e.target.files) }
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
                            file: item,
                            isUpload: false
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
        abort(file) {
            file.request.abort.bind(file.request)
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
            let request = aws.upload(params, {partSize: 10000 * 1024 * 1024})
            request.on('httpUploadProgress', function (evt) {
                item.progress = parseInt((evt.loaded * 100) / evt.total)
                item.request = request
            })
            return request.promise()
        }
    },
    watch: {
        'fileList'(to, from) {
            let self = this
            if (to.length > 0) {
                to.forEach((file) => {
                    if (!file.isUpload) {
                        file.isUpload = true
                        self.uploadFile(file).then(res => self.$Message.success(`Upload ${file.name} success`), error => self.$Message.error(`Upload ${file.name} fail`, 5))
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
    .span-name {
        flex: 5;
    }
    .span-size {
        width: 60px;
        text-align: right;
        padding-right: 10px;
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