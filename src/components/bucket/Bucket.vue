<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Button class="button-bsc-add-bucket">Add bucket</Button>
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
    </div>
</template>
<script>
import { handler } from '../service/Aws'
import moment from 'moment'
export default {
    data() {
        return {
            self: this,
            showHeader: false,
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
                    width: 350,
                    align: 'center',
                    render(row, column, index) {
                        return `<i-button style="margin: 0 6px;" size="small">File management</i-button>
                        <i-button style="margin: 0 6px;" size="small" @click.stop="bucketSetting(${index})">Bucket setting</i-button>
                        <i-button style="margin: 0 6px;" size="small" @click.stop="deleteBucket(${index})">Delete</i-button>`;
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