<template>
    <div>
        <div class="layout-bsc-toolbar">
            <div>
                <Button @click="upload()">Upload file</Button>
                <Button>Create folder</Button>
                <Button>Delete file</Button>
            </div>
            <Breadcrumb>
                <Breadcrumb-item href="#">Bucket list</Breadcrumb-item>
                <Breadcrumb-item :href="getUrl('noprefix')">{{bucket}}</Breadcrumb-item>
                <Breadcrumb-item v-for="bc in breadcrumb"
                                 :href="getUrl(bc.prefix)"
                                 :key="bc.text">{{bc.text}}</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <Table :show-header="showHeader"
               :stripe="true"
               :context="self"
               :highlight-row="true"
               :columns="fileHeader"
               :data="contents"
               no-data-text="No data"
               @on-row-click="rowClick"></Table>
    </div>
</template>
<script>
import { handler } from '../service/Aws'
import { bytes,keyFilter,convertPrefix2Router,fileHeaderSetting } from '../service/bucketService'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
export default {
    data() {
        return {
            contents: [],
            self: this,
            showHeader: true,
            iconSize: 18,
            fileHeader: fileHeaderSetting
        }
    },
    computed: {
        bucket: function () {
            return this.$route.params.bucket
        },
        prefix: function () {
            return this.$route.params.prefix === 'noprefix' ? '' : this.$route.params.prefix
        },
        breadcrumb: function () {
            return convertPrefix2Router(this.prefix)
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        async getData() {
            let res = await handler('listObjects', {
                Bucket: this.bucket,
                Delimiter: '/',
                Marker: this.prefix,
                Prefix: this.prefix
            })
            this.contents = _.forEach(res.CommonPrefixes, (foler) => {
                foler.Key = keyFilter(foler.Prefix)
                foler.Type = 'folder'
                foler.LastModified = ''
                foler.convertSize = ''
            }).concat(_.forEach(res.Contents, (item) => {
                item.Key = keyFilter(item.Key)
                item.convertSize = bytes(item.Size)
                item.Type = 'file'
                item.LastModified = moment(item.LastModified).format('YYYY-MM-DD HH:mm')
            }))
        },
        rowClick(item) {
            item.Type === 'folder' && this.$router.push({ name: 'file', params: { bucket: this.bucket, prefix: item.Prefix } })
        },
        getUrl(prefix) {
            return `#/bucket/${this.bucket}/prefix/${prefix.replace('/', '%2F')}`
        },
        upload() {
            this.$router.push({ name: 'upload', params: { bucket: this.bucket, prefix: this.$route.params.prefix } })
        }
    },
    watch: {
        // the contents array need refresh when the $route value changed
        '$route'(to, from) {
            to.path !== from.path && this.getData()
        }
    }
}

</script>
<style lang="less">
.layout-bsc-toolbar {
    button {
        margin-right: 8px;
    }
}
</style>