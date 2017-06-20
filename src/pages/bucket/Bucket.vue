<template>
    <div>
        <div class="layout-bsc-toolbar">
            <div>
                <Button class="button-bsc-add-bucket" type="primary" @click="createBucketModal = true">{{$t("STORAGE.ADD_BUCKET")}}</Button>
                <Tooltip :content='$t("STORAGE.FOLDER_INFO")' :disabled="!!selectedBucket.Name" placement="top"><Button class="button-bsc-add-bucket" :disabled="!selectedBucket.Name" type="primary" @click="goBucketSettings()">{{$t("STORAGE.BUCKET_SETTING")}}</Button></Tooltip>
                <Tooltip :content='$t("STORAGE.FOLDER_INFO")' :disabled="!!selectedBucket.Name" placement="top"><Button class="button-bsc-add-bucket" :disabled="!selectedBucket.Name" @click="deleteBucketConfirm()">{{$t("STORAGE.DELETE_BUCKET")}}</Button></Tooltip>
            </div>
        </div>
        <div class="bsc-flex-section">
            <div class="bucket" v-cbutton v-for="bucket in bucketList" @click="rowClick(bucket)" v-on:dblclick="dbClick(bucket)">
                <span class="span-filename">{{bucket.Name}}</span>
            </div>
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
import moment from 'moment'
export default {
    data () {
        return {
            adminMode: false,
            createBucketValue: '',
            createBucketModal: false,
            selectedBucket: {},
            inputCheck: false,
            self: this,
            iconSize: 18,
            header: headSetting,
            bucketList: this.bucketList
        }
    },
    mounted () {
        this.getBucketList()
    },
    directives: {
        cbutton: {
            bind: function (el, binding) {
                el.onclick = (e) => {
                    el.classList.toggle('bucket-selected')
                    _.each(el.parentNode.childNodes, (node) => {
                        node !== el && node.classList.remove('bucket-selected')
                    })
                }
            }
        }
    },
    methods: {
        async getBucketList () {
            try {
                this.$Loading.start()
                let res = await handler('listBuckets')
                this.bucketList = _.forEach(res.Buckets, (item) => {
                    item.selected = false
                    item.CreationDate = moment(item.CreationDate).format('YYYY-MM-DD HH:mm')
                    return item
                })
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
                console.log(error)
            }
        },
        deleteBucketConfirm () {
            const item = this.selectedBucket
            this.getBucketPolify().then(bucketPolify => {
                if (bucketPolify.union && bucketPolify.union.picAdult) {
                    this.$Modal.warning({
                        content: this.$t('STORAGE.DELETE_BUCKET_INFO', {fileName: item.Name, unionName: bucketPolify.union.picAdult}),
                        okText: this.$t('PUBLIC.CONFIRMED')
                    })
                } else {
                    this.$Modal.confirm({
                        content: this.$t('STORAGE.DELETE_CONFIRMED', {fileName: item.Name}),
                        okText: this.$t('PUBLIC.CONFIRMED'),
                        cancelText: this.$t('PUBLIC.CANCLE'),
                        onOk: () => this.deleteBucket(item)
                    })
                }
            })
        },
        async deleteBucket (bucket) {
            try {
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
            } catch (error) {
                console.log(error)
                this.$Message.error(error.message)
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
        addBucket () {
            // the 'this' in arrow function is not point to vue
            let self = this
            if (this.createBucketValue.length > 2) {
                handler('createBucket', { Bucket: this.createBucketValue }).then(() => {
                    self.$Message.success(this.$t('STORAGE.ADD_BUCKET_SUCCESS'))
                    self.getBucketList()
                    self.createBucketValue = ''
                }, error => {
                    self.$Message.error(error.message)
                })
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

const headSetting = [
    {
        title: 'Bucket name',
        key: 'Name'
    }, {
        title: 'Create time',
        align: 'right',
        key: 'CreationDate'
    }, {
        title: 'Actions',
        key: 'actions',
        width: 200,
        align: 'center',
        render (row, column, index) {
            return `<Tooltip :content='$t("STORAGE.FILE_LIST")' :delay="1000" placement="top"><i-button style="margin: 0 6px;" size="small"><Icon type="ios-list" :size="iconSize"></Icon></i-button></Tooltip>
                        <Tooltip :content='$t("STORAGE.BUCKET_SETTING")' :delay="1000" placement="top"><i-button style="margin: 0 6px;" size="small" @click.stop="goBucketSettings(${index})"><Icon type="gear-a" :size="iconSize"></Icon></i-button></Tooltip>
                        <Tooltip :content='$t("STORAGE.DELETE_BUCKET")' content="Delete bucket" :delay="1000" placement="top"><i-button style="margin: 0 6px;" size="small" @click.stop="deleteBucketConfirm(${index})"><Icon type="ios-trash" :size="iconSize"></Icon></i-button></Tooltip>`
        }
    }
]

</script>
<style lang="less" scoped>
.bsc-flex-section {
    min-height: 100%;
    width: 100%;
    display: inline-flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
}

.bucket {
    width: 120px;
    height: 120px;
    font-size: 14px;
    border-radius: 5px;
    margin: 4px;
    padding: 5px;
    background: url('../../assets/Bucket_folder.png') no-repeat center;
    background-size: 66px 66px;
    .span-filename {
        display: inline-block;
        position: relative;
        text-align: center;
        color: #657180;
        font-style: normal;
        font-weight: 400;
        top: 85px;
        left: 0;
        width: 110px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis
    }
}

.layout-bsc-toolbar {
    padding-bottom: 20px;
    border-bottom: 1px solid #f2f1f6;
    margin-bottom: 0;
    button {
        margin-right: 1px;
    }
}

.bucket:hover,
.bucket-selected {
    background-color: #f5f5f5;
}

.info-input-error {
    display: block;
    margin-top: 6px;
    color: red;
}

.ivu-table-row:hover {
    cursor: pointer;
}
</style>

