<template>
  <div class="bsc-picture-preview">
    <div class="content">
      <div class="close-preview"
           @click="close">
        <Icon type="close"
              size="50"></Icon>
      </div>
      <div class="picture-show-box">
        <Spin size="bigger"
              fix
              v-if="spinShow"></Spin>
        <img class="box-picture"
             :src="pictureUrl"
             @load="adaptPage();spinShow=false;">
      </div>
    </div>
    <div class="right-gallery-list">
      <p class="gallery-list-item"
         v-for="(item, index) in pictureUrlList"
         :key="item"
         @click="changePicture(item, index)">
        <img class="gallery-list-img"
             :src="item">
      </p>
    </div>
    <div class="bottom-gallery-details">
      <div class="details-number">{{selectedPictureIndex}} / {{pictureNumber}}</div>
      <div class="details-actions">
        <Tooltip class="actions-icon"
                 content="放大"
                 placement="top">
          <div @click="larger()">
            <Icon type="plus"
                  size="28"></Icon>
          </div>
        </Tooltip>
        <Tooltip class="actions-icon"
                 content="缩小"
                 placement="top">
          <div @click="smaller()">
            <Icon type="minus"
                  size="28"></Icon>
          </div>
        </Tooltip>
        <Tooltip class="actions-icon"
                 content="实际大小"
                 placement="top">
          <div @click="actualSize()">
            <Icon type="android-contract"
                  size="28"></Icon>
          </div>
        </Tooltip>
        <Tooltip class="actions-icon"
                 content="适应页面"
                 placement="top">
          <div @click="adaptPage()">
            <Icon type="android-expand"
                  size="28"></Icon>
          </div>
        </Tooltip>
        <Tooltip class="actions-icon"
                 content="下载原图"
                 placement="top">
          <div @click="download()">
            <Icon type="ios-cloud-download"
                  size="28"></Icon>
          </div>
        </Tooltip>
      </div>
    </div>
    <a download
       id="element-download"
       style="display:none">
      <span id="span-download"></span>
    </a>
  </div>
</template>

<script>
import { getS3, handler } from '@/service/Aws'
export default {
  props: ['selectedIndex', 'fileList', 'bucket', 'prefix'],
  data() {
    return {
      pictureUrlList: [],
      pictureUrl: this.pictureUrl,
      pictureNumber: 0,
      selectedPictureIndex: 0,
      width: 0,
      height: 0,
      spinShow: true
    }
  },
  watch: {
    width(to, from) {
      to >= 5000
        ? $('.actions-icon:eq(0)').addClass('disable')
        : $('.actions-icon:eq(0)').removeClass('disable')
      to <= 120
        ? $('.actions-icon:eq(1)').addClass('disable')
        : $('.actions-icon:eq(1)').removeClass('disable')
      to === this.computeActualSize()
        ? $('.actions-icon:eq(2)').addClass('disable')
        : $('.actions-icon:eq(2)').removeClass('disable')
      to.toFixed() ===
      (this.computeActualSize() > 1280
        ? (
            $('.picture-show-box, .big-picture-show-box').width() * 0.7
          ).toFixed()
        : this.computeActualSize().toFixed())
        ? $('.actions-icon:eq(3)').addClass('disable')
        : $('.actions-icon:eq(3)').removeClass('disable')
      to < $('.picture-show-box, .big-picture-show-box').width() &&
      this.height < $('.picture-show-box, .big-picture-show-box').height()
        ? $('.picture-show-box, .big-picture-show-box')
            .addClass('picture-show-box')
            .removeClass('big-picture-show-box')
        : $('.picture-show-box, .big-picture-show-box')
            .addClass('big-picture-show-box')
            .removeClass('picture-show-box')
    },
    height(to, from) {
      this.width < $('.picture-show-box, .big-picture-show-box').width() &&
      to < $('.picture-show-box, .big-picture-show-box').height()
        ? $('.picture-show-box, .big-picture-show-box')
            .addClass('picture-show-box')
            .removeClass('big-picture-show-box')
        : $('.picture-show-box, .big-picture-show-box')
            .addClass('big-picture-show-box')
            .removeClass('picture-show-box')
    }
  },
  created() {
    // ESC close
    document.addEventListener('keydown', this.EscClose)
    this.getUrlList()
  },
  methods: {
    async getUrlList() {
      let num = 0
      this.fileList.forEach((file, index) => {
        if (file.isImage && file.isImage === true) {
          num += 1
          if (index === this.selectedIndex) {
            this.selectedPictureIndex = num
          }
        }
      })
      this.pictureUrlList.length = this.pictureNumber = num
      this.pictureUrl = await getURL(
        this.bucket,
        this.fileList[this.selectedIndex],
        this.prefix
      )
      $(`.gallery-list-item:eq(${this.selectedPictureIndex - 1})`).addClass(
        'active'
      )
      this.pictureUrlList = await Promise.all(
        Array.map(
          this.fileList.filter((file) => file.isImage && file.isImage === true),
          (imageFile) => getURL(this.bucket, imageFile, this.prefix)
        )
      )
    },
    changePicture(item, index) {
      this.pictureUrl = item
      this.selectedPictureIndex = index + 1
      $('.gallery-list-item').removeClass('active')
      $(`.gallery-list-item:eq(${index})`).addClass('active')
      this.adaptPage()
    },
    computeActualSize() {
      let image = new Image()
      image.src = this.pictureUrl
      return image.width
    },
    EscClose(e) {
      if (e.keyCode === 27) {
        this.close()
      }
    },
    close() {
      this.$emit('close')
    },
    larger() {
      let width = $('.box-picture').width()
      $('.box-picture').width(
        (this.width = width >= 5000 ? width : width * 1.25)
      )
      this.height = $('.box-picture').height()
    },
    smaller() {
      let width = $('.box-picture').width()
      $('.box-picture').width((this.width = width <= 120 ? width : width * 0.8))
      this.height = $('.box-picture').height()
    },
    actualSize() {
      $('.box-picture').width((this.width = this.computeActualSize()))
      this.height = $('.box-picture').height()
    },
    adaptPage() {
      let width = this.computeActualSize()
      $('.box-picture').width(width > 1280 ? '70%' : width)
      this.width = $('.box-picture').width()
      this.height = $('.box-picture').height()
    },
    download() {
      document.querySelector('#element-download').href = this.pictureUrl
      document.querySelector('#span-download').click()
    }
  }
}
const getURL = async (bucket, file, prefix) => {
  try {
    let params = { Bucket: bucket, Key: prefix + file.Key }
    let s3 = await getS3()
    let url = await s3.getSignedUrl('getObject', params)
    let acl = await handler('getObjectAcl', params)
    let isAllUser = _.find(
      acl.Grants,
      (item) =>
        item.Grantee.URI &&
        item.Grantee.URI === 'http://acs.amazonaws.com/groups/global/AllUsers'
    )
    return isAllUser ? url.split('?')[0] : url
  } catch (error) {
    console.log(error)
    this.$Loading.error()
    return Promise.reject(error)
  }
}
</script>

<style lang="less" scoped>
.@{css-prefix}picture-preview {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  padding: 0;
  background-color: rgba(0, 0, 0, 0.8);
  .content {
    height: 100%;
    width: 100%;
    padding-right: 140px;
    padding-bottom: 60px;

    .close-preview {
      position: absolute;
      top: 30px;
      left: 30px;
      color: #999;
      width: 40px;
      z-index: 100;

      &:hover {
        color: #fff;
        cursor: pointer;
      }
    }

    .picture-show-box {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      position: relative;

      .bsc-spin-fix {
        background-color: rgba(0, 0, 0, 0.6);
      }

      .box-picture {
        display: block;
      }
    }

    .big-picture-show-box {
      height: 100%;
      overflow: auto;

      .box-picture {
        display: block;
        margin: auto;
      }
    }
  }

  .right-gallery-list {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 140px;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #0a0a0a;
    box-shadow: 0 0 18px rgba(0, 0, 0, 0.6);

    .gallery-list-item {
      margin: 10px;
      width: 120px;
      height: 70px;
      overflow: hidden;
      border: 1px solid hsla(0, 0%, 100%, 0.3);
      cursor: pointer;

      .gallery-list-img {
        opacity: 0.6;
        width: 100%;
        display: block;
        margin: auto;
      }

      &:hover {
        .gallery-list-img {
          opacity: 1;
        }
      }
    }

    .active {
      border: 1px solid #fff;
      .gallery-list-img {
        opacity: 1;
      }
    }
  }

  .bottom-gallery-details {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 60px;
    font-size: 16px;
    color: #fff;
    text-align: center;
    line-height: 60px;
    background-color: #1a1a1a;
    margin-right: 140px;

    .details-number {
      float: left;
      margin-left: 30px;
      font-size: 20px;
    }

    .details-actions {
      float: right;
      margin-right: 30px;

      .actions-icon {
        div {
          color: #999;
          height: 60px;
          padding-top: 5px;
          width: 60px;
          display: inline-block;
          margin-right: 0px;
          outline: 0;
        }

        &:hover {
          div {
            color: #fff;
          }
          background-color: #000;
          cursor: pointer;
        }
      }

      .disable {
        opacity: 0.3;

        div {
          cursor: default;
        }
      }
    }
  }
}
</style>
