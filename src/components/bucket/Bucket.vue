<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Button class="button-bsc-add-bucket" @click="createBucketModal = true">Add bucket</Button>
            <Breadcrumb>
                <Breadcrumb-item>Bucket list</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <Table :show-header="showHeader"
               :context="self"
               :columns="header"
               :data="bucketList"
               @on-row-click="rowClick"
               no-data-text="Please create your first bucket"></Table>
        <Modal v-model="createBucketModal"
               title="Add bucket"
               ok-text="OK"
               cancel-text="Cancel">
            <Input v-model="createBucketValue" placeholder="Please fill in the bucket name" style="width: 300px"></Input>
            <span v-show="createBucketValue.length < 3">Requires 3 characters</span>
        </Modal>
    </div>
</template>
<script>
import { handler } from '../service/Aws'
import moment from 'moment'
export default {
    data() {
        return {
            createBucketValue: '',
            createBucketModal: false,
            self: this,
            showHeader: false,
            iconSize: 18,
            header: [
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
                        return `<i-button style="margin: 0 6px;" size="small"><Icon type="document" :size="iconSize"></Icon></i-button>
                        <i-button style="margin: 0 6px;" size="small" @click.stop="bucketSetting(${index})"><Icon type="gear-a" :size="iconSize"></Icon></i-button>
                        <i-button style="margin: 0 6px;" size="small" @click.stop="deleteBucket(${index})"><Icon type="ios-trash" :size="iconSize"></Icon></i-button>`;
                    }
                }
            ],
            bucketList: this.bucketList
        }
    },
    mounted() {
        this.getBucketList()
    },
    methods: {
        async getBucketList() {
            let res = await handler('listBuckets')
            this.bucketList = _.forEach(res.Buckets, (item) => {
                return item.CreationDate = moment(item.CreationDate).format('YYYY-MM-DD HH:mm')
            })
        },
        bucketSetting() {

        },
        deleteBucket() { },
        rowClick(item) {
            this.$store.dispatch('selectBucket', item)
            this.$router.push({ name: 'file', params: { bucket: item.Name, prefix: 'noprefix' } })
        }
    }
}

</script>
<style lang="less" scoped>

</style>