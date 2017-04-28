<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Button class="button-bsc-add-bucket" type="primary"
                    @click="createBucketModal = true">Add bucket</Button>
            <Breadcrumb>
                <Breadcrumb-item>Bucket list</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <Table :show-header="false"
               :context="self"
               :columns="header"
               :data="bucketList"
               @on-row-click="rowClick"
               no-data-text="Please create your first bucket"></Table>
        <Modal v-model="createBucketModal"
               title="Add bucket"
               ok-text="OK"
               @on-ok="addBucket"
               @on-cancel="createBucketValue = ''"
               cancel-text="Cancel">
            <Input v-model="createBucketValue"
                   @on-change="check"
                   placeholder="Requires bucket name">
            </Input>
            <span class="info-input-error">{{inputCheck ? 'Requires 3 characters' : ''}}</span>
        </Modal>
    </div>
</template>
<script>
import { handler } from '../service/Aws'
import { removeItemFromArray } from '../service/bucketService'
import moment from 'moment'
export default {
    data() {
        return {
            createBucketValue: '',
            createBucketModal: false,
            inputCheck: false,
            self: this,
            iconSize: 18,
            header: headSetting,
            bucketList: this.bucketList
        }
    },
    mounted() {
        this.getBucketList()
    },
    methods: {
        async getBucketList() {
            try {
                this.$Loading.start()
                let res = await handler('listBuckets')
                this.bucketList = _.forEach(res.Buckets, (item) => {
                    return item.CreationDate = moment(item.CreationDate).format('YYYY-MM-DD HH:mm')
                })
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
                console.log(error)
            }
        },
        deleteBucketConfirm(item) {
            this.$Modal.confirm({
                content: `Are you sure you want to delete [${item.Name}]?`,
                okText: 'Submit',
                cancelText: 'Cancle',
                onOk: () => this.deleteBucket(this.bucketList[item])
            })
        },
        async deleteBucket(bucket){
            try {
                let buckets = await handler('listObjects', { Bucket: bucket.Name })
                let response = await buckets.Contents.length ? batchDeletion(buckets.Contents, bucket.Name) : Promise.resolve()
                // the bucket has cache when the objects just deleted
                response.then(res => {
                    setTimeout(() => {handler('deleteBucket', { Bucket: bucket.Name })},1000)
                })
                // the bucket list also has cache ...
                removeItemFromArray(this.bucketList,bucket)
            } catch (error) {
                console.log(error)
                this.$Message.error(error.message)
            }
        },
         goBucketSettings(item) {
            const bucket = this.bucketList[item]
            this.$store.dispatch('selectBucket', bucket)
            this.$router.push({ name: 'bucketSettings', params: { bucket: bucket.Name} })
        },
        rowClick(item) {
            this.$store.dispatch('selectBucket', item)
            this.$router.push({ name: 'file', params: { bucket: item.Name, prefix: 'noprefix' } })
        },
        addBucket() {
            // the 'this' in arrow function is not point to vue
            let _this = this
           if (this.createBucketValue.length > 2) {
                handler('createBucket', { Bucket: this.createBucketValue }).then(() => {
                    _this.$Message.success('Add bucket success')
                    _this.getBucketList()
                    _this.createBucketValue = ''
                }, error => {
                    _this.$Message.error(error.message)
                })
            } else {
                this.$Message.warning('Requires 3 characters')
            }
        },
        check() {
            this.inputCheck = this.createBucketValue.length > 2 ? false : true
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
        render(row, column, index) {
            return `<Tooltip content="File list" :delay="1000" placement="top"><i-button style="margin: 0 6px;" size="small"><Icon type="ios-list" :size="iconSize"></Icon></i-button></Tooltip>
                        <Tooltip content="Bucket setting" :delay="1000" placement="top"><i-button style="margin: 0 6px;" size="small" @click.stop="goBucketSettings(${index})"><Icon type="gear-a" :size="iconSize"></Icon></i-button></Tooltip>
                        <Tooltip content="Delete bucket" :delay="1000" placement="top"><i-button style="margin: 0 6px;" size="small" @click.stop="deleteBucketConfirm(${index})"><Icon type="ios-trash" :size="iconSize"></Icon></i-button></Tooltip>`;
        }
    }
]

</script>
<style lang="less" scoped>
.info-input-error {
    display: block;
    margin-top: 6px;
    color: red;
}

.ivu-table-row:hover{
    cursor: pointer;
}
</style>

