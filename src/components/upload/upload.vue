<template>
  <div class="bsc-upload">
    <div class="section-file-upload"
         draggable="true"
         v-upload="self">
      <input type="file"
             class="bsc-upload-input"
             :multiple="multiple"
             :accept="accept">
      <slot></slot>
      <div class="upload-area"
           style="padding: 50px 0px;">
        <Icon type="upload"></Icon>
        <p>{{$t("STORAGE.FILE_UPLOAD_LIM")}}</p>
        <p class="upload-info">{{validateMessage}}</p>
      </div>
    </div>
    <div class="section-file-list"
         v-show="showUploadList && fileList.length > 0">
      <ul>
        <li v-for="file in fileList"
            :key="file.name"
            class="list-file">
          <span class="upload-span-name">{{file.name}}</span>
          <span class="upload-span-size">{{file.size}}</span>
          <Progress :percent="file.progress">
            <Icon type="checkmark-circled"></Icon>
          </Progress>
          <span class="upload-span-status">{{file.progress === 100 ? 'Success' : file.request && file.request.faileded ? 'failed' : 'Uploading'}}</span>
        </li>
      </ul>
    </div>
    <slot name="tip"></slot>
  </div>
</template>
<script>
import { getS3 } from '@/service/Aws'
import moment from 'moment'
import { bytes } from '@/service/bucketService'
export default {
  name: 'Upload',
  directives: {
    upload: {
      bind: function(el, binding) {
        el.ondrop = (e) => {
          e.preventDefault()
          Array.from(e.dataTransfer.items).forEach((item) => {
            let entry = item.webkitGetAsEntry()
            entry && traverseFileTree(entry)
          })
        }
        el.onclick = (e) => {
          let fileInput = el.children[0]
          // click events bubble up the ancestry tree and the change event will trigge twice
          // fileInput.onclick((e,false) => e.stopPropagation()) not work ...
          fileInput.addEventListener(
            'click',
            (e) => {
              e.stopPropagation()
            },
            false,
          )
          fileInput.onchange = (e) => {
            const files = e.target.files

            if (!files) {
              return
            }
            pushFile2Vue(files)
            fileInput.value = null
          }
          fileInput.click()
        }

        const traverseFileTree = (item, path = '') => {
          if (item.isFile && item.name !== '.DS_Store') {
            pushFile2Vue(item, path)
          } else if (item.isDirectory) {
            // get folder contents
            let dirReader = item.createReader()
            dirReader.readEntries((entries) => {
              Array.from(entries).forEach((file) =>
                traverseFileTree(file, path + item.name + '/'),
              )
            })
          }
        }

        const pushFile2Vue = (target, path) => {
          // binding.value => vue(this)
          // but using dataset is best
          // when file upload by drag, we must get file itself by file.file()
          !target.isFile
            ? Array.from(target).forEach((item) => {
                binding.value.fileList.push({
                  name: item.name,
                  lastModifiedDate: moment(item.lastModifiedDate).format(
                    'YYYY-MM-DD HH:mm',
                  ),
                  size: bytes(item.size),
                  progress: 0,
                  file: item,
                  isUpload: false,
                })
              })
            : target.file(
                (item) => {
                  binding.value.fileList.push({
                    name: path + item.name,
                    lastModifiedDate: moment(item.lastModifiedDate).format(
                      'YYYY-MM-DD HH:mm',
                    ),
                    size: bytes(item.size),
                    progress: 0,
                    file: item,
                    isUpload: false,
                  })
                },
                (error) => {
                  console.log(error)
                },
              )
        }
      },
    },
  },
  props: {
    bucket: {
      type: String,
      required: true,
    },
    prefix: {
      type: String,
      default: '',
    },
    aclType: {
      type: String,
      default: 'public-read',
    },
    checkFileType: {
      type: Boolean,
      default: false,
    },
    validation: {
      type: RegExp,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    showUploadList: {
      type: Boolean,
      default: true,
    },
    accept: {
      type: String,
    },
    validateMessage: {
      type: String,
    },
  },
  data() {
    return {
      fileList: [],
      self: this,
    }
  },
  watch: {
    fileList(to, from) {
      if (to.length > 0) {
        to.forEach((file) => {
          if (!file.isUpload) {
            file.isUpload = true
            if (
              !this.checkFileType ||
              (this.checkFileType && this.validation.test(file.name))
            ) {
              this.uploadFile(file).then(
                (res) => {
                  this.$emit('uploadSuccess', file.name)
                },
                (e) => {
                  console.log(e)
                  this.$Message.error(
                    this.$t('STORAGE.UPLOAD_FAILED', { fileName: file.name }),
                    5,
                  )
                },
              )
            } else {
              this.fileList.splice(this.fileList.indexOf(file), 1)
              this.$Message.error(this.validateMessage)
            }
          }
        })
      }
    },
  },
  methods: {
    async uploadFile(item) {
      let file = item.file
      let params = {
        ACL: this.aclType,
        Bucket: this.bucket,
        Key: this.prefix + item.name,
        ContentType: file.type,
        Body: file,
      }
      let options = { partSize: 64 * 1024 * 1024, queueSize: 3 }
      let aws = await getS3({ timeout: 3600000 })
      let request = aws.upload(params, options)
      request.on('httpUploadProgress', function(evt) {
        item.progress = parseInt((evt.loaded * 100) / evt.total)
        item.request = request
      })
      return request.promise()
    },
    clearFiles() {
      this.fileList = []
    },
  },
}
</script>
<style lang="less" scoped>
.dark .@{css-prefix}upload {
  .section-file-upload {
    border: 2px dashed @border-color-dark;

    &:hover {
      border: 2px dashed #39f;
    }
  }

  .section-file-list {
    .list-file {
      background: @secondary-color-dark;
    }
  }
}

.@{css-prefix}upload {
  .section-file-upload {
    .wh(100%, 200px);
    border: 2px dashed #d7dde4;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s ease;

    .bsc-upload-input {
      display: none;
    }

    p {
      font-size: 16px;
    }

    p.upload-info {
      padding-top: 10px;
      font-size: 12px;
    }

    .upload-area {
      padding: 50px 0px;

      i {
        font-size: 52px;
        color: rgb(51, 153, 255);
      }
    }

    &:hover {
      border: 2px dashed #39f;
    }
  }

  .section-file-list {
    max-height: 300px;
    margin-top: 5px;
    overflow-y: auto;

    & > ul {
      height: 100%;
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
        .overflow();
        flex: 5;
      }

      .upload-span-size {
        width: 60px;
        text-align: right;
        margin-right: 40px;
      }

      .upload-span-status {
        width: 80px;
      }

      div {
        flex: 6;
      }
    }
  }
}
</style>
