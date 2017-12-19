<template>
    <div>
        <Spin size="bigger" fix v-if="spinGroup" class="search-spin"></Spin>
        <div class="section-separator">
            <div class="separator-body">
                <span class="separator-icon"></span>
                <span class="separator-info">{{$t('SETTINGS.WHITE_BLACK')}}</span>
            </div>
        </div>
        <div class="is-open">
            <span class="setting-name">{{$t('STORAGE.ISOPEN')}}</span>
            <i-switch size="large" v-model="enabled" @on-change="listEnabled">
                <span slot="open">{{$t('STORAGE.OPEN')}}</span>
                <span slot="close">{{$t('STORAGE.CLOSE')}}</span>
            </i-switch>
        </div>
        <div class="section-separator">
            <div class="separator-body">
                <span class="separator-icon"></span>
                <span class="separator-info">{{$t('SETTINGS.IP_WHITE_LIST')}}</span>
            </div>
        </div>
        <link-table :listData="whiteList" formName="whiteForm" :info="$t('SETTINGS.WHITE_LIST_INFO')"></link-table>
        <div class="section-separator mar-t-35">
            <div class="separator-body">
                <span class="separator-icon"></span>
                <span class="separator-info">{{$t('SETTINGS.IP_BLACK_LIST')}}</span>
            </div>
        </div>
        <link-table :listData="blackList" formName="blackForm" :info="$t('SETTINGS.BLACK_LIST_INFO')"></link-table>
    </div>
</template>
<script>
import { ACCESS_LIST, ADD_SERVICE } from '@/service/API'
import user from '@/store/modules/user'
import linkTable from './linkTable'
export default {
    data () {
        return {
            whiteList: [],
            blackList: [],
            iconSize: 18,
            spinGroup: false,
            enabled: false
        }
    },
    computed: {
        bucket () {
            return this.$route.params.bucket
        }
    },
    created () {
        this.getList()
    },
    components: {linkTable},
    methods: {
        async getList () {
            this.$Loading.start()
            this.spinGroup = true
            const params = {
                action: 'get',
                bucket: this.bucket,
                user: user.state.username
            }
            try {
                let listData = await this.$http.post(ACCESS_LIST, params)
                this.enabled = listData.enabled
                this.whiteList = []
                this.blackList = []
                let whiteIP = new Set(listData.download_file.white_list.concat(listData.delete_file.white_list).concat(listData.upload_file.white_list))
                let blackIP = new Set(listData.download_file.black_list.concat(listData.delete_file.black_list).concat(listData.upload_file.black_list))
                this.whiteList = list2Front(whiteIP, listData, 'white_list')
                this.blackList = list2Front(blackIP, listData, 'black_list')
                this.$Loading.finish()
                this.spinGroup = false
            } catch (error) {
                this.$Loading.error()
                this.spinGroup = false
            }
        },
        async listEnabled () {
            if (this.enabled) {
                const params = {service: 'access_control'}
                await this.$http.post(ADD_SERVICE, params)
            }
            const params = {
                action: this.enabled ? 'enable' : 'disable',
                bucket: this.bucket,
                user: user.state.username
            }
            await this.$http.post(ACCESS_LIST, params)
        },
        async accessSet () {
            this.$Loading.start()
            let saved = _.cloneDeep(savedDefult)
            saved = list2Saved(this.whiteList, saved, 'white_list')
            saved = list2Saved(this.blackList, saved, 'black_list')
            let params = {
                action: 'set',
                ips: saved,
                bucket: this.bucket,
                user: user.state.username
            }
            try {
                await this.$http.post(ACCESS_LIST, params)
                this.$Loading.finish()
                this.$Message.success(this.$t('SETTINGS.SAVED'))
            } catch (error) {
                this.$Loading.error()
                this.getList()
            }
        }
    }
}
const list2Front = (ipList, listData, api) => {
    let front = []
    ipList.forEach(key => {
        let item = {
            ip: key,
            upload: listData.upload_file[api].includes(key),
            delete: listData.delete_file[api].includes(key),
            download: listData.download_file[api].includes(key),
            edit: false,
            before: {
                upload: listData.upload_file[api].includes(key),
                delete: listData.delete_file[api].includes(key),
                download: listData.download_file[api].includes(key)
            }
        }
        front.push(item)
    })
    front = convertGroup(front)
    return front
}
const list2Saved = (list, saved, api) => {
    list.forEach(item => {
        if (item.ip.includes('*')) {
            let relIp
            for (let i = 0; i < 256; i++) {
                relIp = item.ip.replace('*', i)
                if (item.download) {
                    saved.download_file[api].push(relIp)
                }
                if (item.delete) {
                    saved.delete_file[api].push(relIp)
                }
                if (item.upload) {
                    saved.upload_file[api].push(relIp)
                }
            }
        } else {
            if (item.download) {
                saved.download_file[api].push(item.ip)
            }
            if (item.delete) {
                saved.delete_file[api].push(item.ip)
            }
            if (item.upload) {
                saved.upload_file[api].push(item.ip)
            }
        }
    })
    return saved
}
const convertGroup = (list) => {
    list.forEach(testItem => {
        for (let j = 0; j < 4; j++) {
            let sameIpArray = []
            let testIP = testItem.ip
            testIP = testIP.split('.')
            testIP.splice(j, 1)
            testIP = testIP.join('.')
            list.forEach(item => {
                let itemIP = item.ip
                itemIP = itemIP.split('.')
                itemIP.splice(j, 1)
                itemIP = itemIP.join('.')
                if (itemIP === testIP && item.upload === testItem.upload && item.delete === testItem.delete && item.download === testItem.download) {
                    sameIpArray.push(item.ip.split('.')[j])
                }
            })
            if (sameIpArray.length === 256) {
                let flag = true
                for (let i = 0; i < 256; i++) {
                    if (!sameIpArray.includes(i.toString())) {
                        flag = false
                        break
                    }
                }
                if (flag) {
                    let ip = testItem.ip.split('.')
                    ip.splice(j, 1, '*')
                    list = list.filter((item) => {
                        let deleteIp = testItem.ip.split('.')
                        deleteIp.splice(j, 1)
                        let itemIp = item.ip.split('.')
                        itemIp.splice(j, 1)
                        return itemIp.join('.') !== deleteIp.join('.')
                    })
                    list.push({
                        ip: ip.join('.'),
                        upload: testItem.upload,
                        delete: testItem.delete,
                        download: testItem.download,
                        edit: false,
                        before: {
                            upload: testItem.upload,
                            delete: testItem.delete,
                            download: testItem.download
                        }
                    })
                }
            }
        }
    })
    return list
}
const savedDefult = {
    download_file: {
        white_list: [],
        black_list: []
    },
    delete_file: {
        white_list: [],
        black_list: []
    },
    upload_file: {
        white_list: [],
        black_list: []
    }
}
</script>
<style lang="less" scoped>
.mar-t-35{
    margin-top: 35px;
}
.new-item{
    margin: 10px 0 20px;
    .new-ip {
        margin-right: 8px;
        width: 200px
    }
    .ip-form {
        display: inline-block;
        .ip-item {
            margin-bottom: 0
        }
    }
}
.is-open{
    margin-bottom: 10px;
    span.setting-name{
        font-size: 14px;
        line-height: 40px;
        margin-right: 8px;
    }
}
.settings-btn{
    display: block;
    margin: 35px auto 0;
}
</style>
