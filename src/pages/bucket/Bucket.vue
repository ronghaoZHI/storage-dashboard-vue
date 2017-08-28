<template>
    <div class="bsc-bucket">
        <div class="layout-bsc-toolbar" v-if="!isSubUser">
            <div>
                <Button class="button-bsc-add-bucket" type="primary" @click="createBucketModal = true">{{$t("STORAGE.ADD_BUCKET")}}</Button>
                <Tooltip :content='$t("STORAGE.FOLDER_INFO")' :disabled="!!selectedBucket.Name" placement="top"><Button class="button-bsc-add-bucket" :disabled="!selectedBucket.Name" type="primary" @click="goBucketSettings()">{{$t("STORAGE.BUCKET_SETTING")}}</Button></Tooltip>
                <Tooltip :content='$t("STORAGE.FOLDER_INFO")' :disabled="!!selectedBucket.Name" placement="top"><Button class="button-bsc-add-bucket" :disabled="!selectedBucket.Name" type="primary" @click="goPictureStyles()">{{$t("STORAGE.PIC_STYLE")}}</Button></Tooltip>
                <Tooltip :content='$t("STORAGE.FOLDER_INFO")' :disabled="!!selectedBucket.Name" placement="top"><Button class="button-bsc-add-bucket" :disabled="!selectedBucket.Name" @click="deleteBucketConfirm()">{{$t("STORAGE.DELETE_BUCKET")}}</Button></Tooltip>
            </div>
        </div>
        <div class="bsc-flex-section">
            <div class="bucket" v-cbutton v-for="bucket in bucketList" @click="rowClick(bucket)" v-on:dblclick="dbClick(bucket)">
                <span class="span-filename">{{bucket.Name}}</span>
            </div>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </div>
        <Modal v-model="createBucketModal" :title='$t("STORAGE.ADD_BUCKET")' @on-ok="addBucket" @on-cancel="createBucketValue = ''">
            <Input v-model="createBucketValue" @on-change="check" :placeholder='$t("STORAGE.ADD_BUCKET_PLACEHOLDER")' pattern="/^([a-z0-9][a-z0-9\-]*[.])*([a-z0-9][a-z0-9\-]*)*$/">
            </Input>
            <span class="info-input-error">{{inputCheck ? $t("STORAGE.ADD_BUCKET_CHECK") : ''}}</span>
        </Modal>
    </div>
</template>
<script>
import { handler } from '@/service/Aws'
import { removeItemFromArray } from '@/service/bucketService'
import { getBucketList } from '@/service/Data'
import moment from 'moment'
import userStore from '@/store/modules/user'
export default {
    data () {
        return {
            adminMode: false,
            isSubUser: userStore.state.type === 'sub',
            createBucketValue: '',
            createBucketModal: false,
            selectedBucket: {},
            inputCheck: false,
            self: this,
            iconSize: 18,
            spinShow: true
        }
    },
    created () {
        this.convertBucketList()
    },
    directives: {
        cbutton: {
            bind: function (el) {
                $(el).click(() => {
                    $(el).toggleClass('bucket-selected')
                    Array.from($(el).siblings()).forEach((node) => {
                        node !== el && $(node).removeClass('bucket-selected')
                    })
                })
            }
        }
    },
    methods: {
        async convertBucketList () {
            try {
                this.$Loading.start()
                this.spinShow = true
                let res = await getBucketList()
                this.bucketList = _.forEach(res.Buckets, (item) => {
                    item.selected = false
                    item.CreationDate = moment(item.CreationDate).format('YYYY-MM-DD HH:mm')
                    return item
                })
                this.$Loading.finish()
                this.spinShow = false
            } catch (error) {
                this.$Loading.error()
                this.spinShow = false
            }
        },
        deleteBucketConfirm () {
            const item = this.selectedBucket
            this.$Modal.confirm({
                content: this.$t('STORAGE.DELETE_CONFIRMED', { fileName: item.Name }),
                okText: this.$t('PUBLIC.CONFIRMED'),
                cancelText: this.$t('PUBLIC.CANCLE'),
                onOk: () => this.deleteBucket(item)
            })
        },
        async deleteBucket (bucket) {
            try {
                this.$Loading.start()
                let buckets = await handler('listObjects', { Bucket: bucket.Name })
                let response = await buckets.Contents.length ? batchDeletion(buckets.Contents, bucket.Name) : Promise.resolve()
                // the bucket has cache when the objects just deleted
                response.then(res => {
                    setTimeout(() => { handler('deleteBucket', { Bucket: bucket.Name }) }, 1000)
                })
                // the bucket list also has cache ...
                removeItemFromArray(this.bucketList, bucket)

                this.selectedBucket = {}
                _.each(document.querySelector('.bsc-flex-section').childNodes, (node) => {
                    node.classList.remove('bucket-selected')
                })
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
            }
        },
        goBucketSettings () {
            const bucket = this.selectedBucket
            this.$store.dispatch('selectBucket', bucket)
            this.$router.push({ name: 'bucketSettings', params: { bucket: bucket.Name } })
        },
        goPictureStyles () {
            const bucket = this.selectedBucket
            this.$store.dispatch('selectBucket', bucket)
            this.$router.push({ name: 'pictureStyles', params: { bucket: bucket.Name } })
        },
        rowClick (item) {
            this.selectedBucket = this.selectedBucket === item ? {} : item
        },
        async addBucket () {
            // the 'this' in arrow function is not point to vue
            let self = this
            if (this.createBucketValue.length > 2) {
                await handler('createBucket', { Bucket: this.createBucketValue })
                self.$Message.success(this.$t('STORAGE.ADD_BUCKET_SUCCESS'))
                await this.$store.dispatch('setBucketList', await handler('listBuckets'))
                self.convertBucketList()
                self.createBucketValue = ''
            } else {
                this.$Message.warning(this.$t('STORAGE.ADD_BUCKET_CHECK'))
            }
        },
        check () {
            this.inputCheck = !this.createBucketValue.length > 2
        },
        dbClick (item) {
            this.$router.push({ name: 'file', params: { bucket: item.Name, prefix: 'noprefix' } })
        },
        async getBucketPolify () {
            try {
                let res = await handler('getBucketPolicy', {
                    Bucket: this.selectedBucket.Name
                })
                var polify = JSON.parse(res.Policy)
            } catch (error) {
                this.$Message.error(this.$t('STORAGE.GET_ADULT_FAILED'))
            }
            return polify
        }
    }
}

const batchDeletion = (list, bucket) => {
    return Promise.all(Array.map(list, function (item) {
        return handler('deleteObject', {
            Bucket: bucket,
            Key: item.Key || item.Prefix
        })
    }))
}
</script>

<style lang="less" scoped>
@import '../../styles/index.less';

@layout-bsc-toolbar-border-bottom-color: #f2f1f6;
@bucket-hover-background-color: #f5f5f5;
@bucket-selected-background-color: #f5f5f5;
@bucket-span-filename-color: #657180;
@bucket-card-width: 120px;
@bucket-card-height: 120px;

.@{css-prefix}bucket{
    .layout-bsc-toolbar {
        padding-bottom: 20px;
        border-bottom: 1px solid @layout-bsc-toolbar-border-bottom-color;
        margin-bottom: 0;

        button {
            margin-right: 1px;
        }
    }

    .bsc-flex-section {
        min-height: 100%;
        width: 100%;
        .fb(flex-start,flex-start);
        flex-wrap: wrap;

        .bucket {
            .wh(@bucket-card-width,@bucket-card-height);
            font-size: 14px;
            border-radius: 5px;
            margin: 4px;
            padding: 5px;
            background: url('../../assets/Bucket_folder.png') no-repeat center;
            background-size: 66px 66px;

            &:hover{
                background-color: @bucket-hover-background-color;
            }

            .span-filename {
                display: inline-block;
                position: relative;
                text-align: center;
                color: @bucket-span-filename-color;
                font-style: normal;
                font-weight: 400;
                top: 85px;
                left: 0;
                width: 110px;
                .overflow()
            }
        }

        .bucket-selected {
            background-color: @bucket-selected-background-color;
        }
    }

    .info-input-error {
        display: block;
        margin-top: 6px;
        color: red;
    }
}
</style>
