<template>
    <div>
        <div class="layout-bsc-toolbar">
            <div>
                <Button>Back</Button>
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
                   :data="formatedFileList"></Table>
        </div>
    </div>
</template>
<script>
import { handler } from '../service/Aws'
import moment from 'moment'
import { bytes } from '../service/bucketService'
export default {
    data() {
        return {
            fileList: [],
            formatedFileList: [],
            self: this,
            iconSize: 18,
            header: headSetting
        }
    },
    directives: {
        upload: {
            bind: function (el, binding) {
                el.addEventListener("drop", function (e) {
                    e.preventDefault()

                    //binding.value => vue(this)
                    //but using dataset is best 
                    binding.value.fileList = e.dataTransfer.files
                    console.log(Array.from(e.dataTransfer.files))
                    Array.from(e.dataTransfer.files).forEach((item) => {
                        console.log(item)
                        binding.value.formatedFileList.push({
                            name: item.name,
                            lastModifiedDate: moment(item.lastModifiedDate).format('YYYY-MM-DD HH:mm'),
                            size: bytes(item.size),
                            progress: 100
                        })
                    })
                })
            }
        }
    },
    methods: {
        deleteFile() {

        }
    },
    watch: {
        'fileList'(to, from) {
            console.log(to)
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
        render(row,column,index) {
            console.log('pro',row)
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