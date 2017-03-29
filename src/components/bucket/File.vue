<template>    
    <div>
        <div class="layout-bsc-toolbar">
            <div>
                <Button>Upload file</Button>
                <Button>Create folder</Button>
                <Button>Delete file</Button>
            </div>
            <Breadcrumb>
                <Breadcrumb-item href="#">Bucket list</Breadcrumb-item>
                <Breadcrumb-item>{{bucket}}</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <Table :show-header="showHeader" :context="self" :columns="header" :data="contents" ></Table>
    </div>
</template>
<script>
import { handler } from '../service/Aws'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
export default {
    data() {
        return{
            contents: [],
            self: this,
            showHeader: false,
            header: [
                {
                    title: 'Key',
                    key: 'Key'
                },{
                    title: 'Size',
                    key: 'Size'
                },{
                    title: 'Create time',
                    key: 'LastModified'
                },{
                    title: 'Actions',
                    key: 'actions',
                    width: 150,
                    align: 'center',
                    render (row, column, index) {
                        return `<i-button size="small">查看</i-button>`;
                    }
                }
            ],
        }
    },
    computed: {
      bucket: function(){
        return this.$route.params.bucket
      }
    },
    mounted(){
        this.getData()
    },
    components:{
        bucket: function(){
            return this.$route.params.bucket
        }
    },
    methods: {
        async getData() {
            let res = await handler('listObjects',{Bucket: this.bucket})
            this.contents = _.forEach(res.Contents,(item) => {
                item.Size = bytes(item.Size)
                item.LastModified = moment(item.LastModified).format('YYYY-MM-DD HH:mm')
            })
        }
    }
}

const bytes = (bytes) => {
    if (typeof bytes !== 'number') {
        bytes = parseFloat(bytes)
    }

    if (bytes < 1) {
        return '0 B'
    } else if (isNaN(bytes) || !isFinite(bytes)) {
        return '-'
    }

    let isNegative = bytes < 0;
    if (isNegative) {
        bytes = -bytes;
    }

    let units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    let exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
    let number = (bytes / Math.pow(1024, Math.floor(exponent))).toFixed(1)

    return (isNegative ? '-' : '') + number + ' ' + units[exponent]
}
</script>
<style lang="less" scoped>
    .layout-bsc-toolbar{
        button{
            margin-right: 8px;
        }
    }
</style>