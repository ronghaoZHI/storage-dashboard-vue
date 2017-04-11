<template>
    <div>
        <div class="layout-bsc-toolbar">
            <div>
                <Button>Back</Button>
            </div>
        </div>
        <div class="section-file-upload" draggable="true" v-upload="self">
            <input type="file"
                   multiple="multiple"
                   class="ivu-upload-input">
            <div style="padding: 50px 0px;"><i class="ivu-icon ivu-icon-ios-cloud-upload"
                   style="font-size: 52px; color: rgb(51, 153, 255);"></i>
                <p>Click or drag the file here to upload</p>
                <p>{{fileList.length}}</p>
            </div>
        </div>
            <ul>
                <li v-for="file in fileList">{{file.name}}</li>
            </ul>
    </div>
</template>
<script>
export default {
    data() {
        return {
            fileList: [],
            self: this
        }
    },
    directives:{
        upload: {
            bind: function (el,binding) {
                el.addEventListener("drop",function(e){
                    //binding.value => vue.self
                    e.preventDefault()
                    binding.value.fileList = e.dataTransfer.files

                    console.log(binding.value)
                })
            }
        }
    },
    methods: {
        beforeUpload() {
            return false
        }
    }
}

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
    .ivu-upload-input{
        display: none;
    }
    p{
        font-size: 16px;
    }
}
.section-file-upload:hover{
    border: 1px dashed #39f;
}
</style>