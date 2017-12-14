<template>
    <div class="bsc-overview">
        <Row>
            <Col span="19" class="left-section">
                <div class="storage">
                    <div class="section-separator">
                        <div class="separator-body">
                            <span class="separator-icon"></span>
                            <span class="separator-info">本月存储使用统计</span>
                        </div>
                    </div>
                    <div class="storage-card">
                        <div class="title">
                            <div class="images"></div>
                            <div class="texts">
                                <p class="label">
                                    本月存储容量
                                </p>
                                <p class="numbers">
                                    {{originOverview.capacity[0]}} <span>{{originOverview.capacity[1]}}</span>
                                </p>
                            </div>
                        </div>
                        <div class="charts"></div>
                    </div>
                    <div class="storage-card">
                        <div class="title">
                            <div class="images"></div>
                            <div class="texts">
                                <p class="label">
                                    本月外网容量
                                </p>
                                <p class="numbers">
                                    {{originOverview.traffic[0]}} <span>{{originOverview.traffic[1]}}</span>
                                </p>
                            </div>
                        </div>
                        <div class="charts"></div>
                    </div>
                    <div class="storage-card">
                        <div class="title">
                            <div class="images"></div>
                            <div class="texts">
                                <p class="label">
                                    本月请求数
                                </p>
                                <p class="numbers">
                                    {{originOverview.request[0]}} <span>{{originOverview.request[1]}}</span>
                                </p>
                            </div>
                        </div>
                        <div class="charts"></div>
                    </div>
                </div>
                <div class="file-ruler">
                    <div class="section-separator">
                        <div class="separator-body">
                            <span class="separator-icon"></span>
                            <span class="separator-info">文件访问规则配置</span>
                        </div>
                    </div>
                    <div class="card-section">
                        <div class="file-ruler-card">
                            <p class="file-ruler-card-title">权限设置</p>
                            <div class="file-ruler-card-body">
                                <p><span>{{permissionsList.length}}</span>个 Bucket 已配置</p>
                            </div>
                            <div class="file-ruler-card-hover">
                                <Button type="primary" @click="showPermissionModal = true">查看详情</Button>
                            </div>
                        </div>
                        <div class="file-ruler-card">
                            <p class="file-ruler-card-title">自定义域名</p>
                            <div class="file-ruler-card-body">
                                <p><span>0</span>个 Bucket 已配置</p>
                            </div>
                            <div class="file-ruler-card-hover waiting">
                                <p class="waiting">敬请期待</p>
                            </div>
                        </div>
                        <div class="file-ruler-card">
                            <p class="file-ruler-card-title">404回源</p>
                            <div class="file-ruler-card-body">
                                <p><span>{{sourceList.length}}</span>个 Bucket 已配置</p>
                            </div>
                            <div class="file-ruler-card-hover">
                                <Button type="primary" @click="showSourceModal = true">查看详情</Button>
                            </div>
                        </div>
                        <div class="file-ruler-card">
                            <p class="file-ruler-card-title">IP黑白名单</p>
                            <div class="file-ruler-card-body">
                                <p><span>{{accessList.length}}</span>个 Bucket 已配置</p>
                            </div>
                            <div class="file-ruler-card-hover">
                                <Button type="primary" @click="showAccessModal = true">查看详情</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="file-handle">
                    <div class="section-separator">
                        <div class="separator-body">
                            <span class="separator-icon"></span>
                            <span class="separator-info">文件处理</span>
                        </div>
                    </div>
                    <div class="card-section">
                        <div class="file-ruler-card">
                            <p class="file-ruler-card-title">图片服务</p>
                            <div class="file-ruler-card-body">
                                <p>支持在 OSS 端对图片文件进行缩放、裁切、水印等处理</p>
                            </div>
                            <div class="file-ruler-card-hover">
                                <Button type="primary" @click="showPictureModal = true">查看详情</Button>
                            </div>
                        </div>
                        <div class="file-ruler-card">
                            <p class="file-ruler-card-title">图片鉴黄</p>
                            <div class="file-ruler-card-body">
                                <p>智能内容识别服务，快速识别色情图片</p>
                            </div>
                            <div class="file-ruler-card-hover phone">
                                <p class="waiting">联系商务</p>
                            </div>
                        </div>
                        <div class="file-ruler-card">
                            <p class="file-ruler-card-title">媒体转码</p>
                            <div class="file-ruler-card-body">
                                <p>支持自动转码和主动转码，将多媒体数据转码成多种终端播放格式</p>
                            </div>
                            <div class="file-ruler-card-hover">
                                <Button type="primary" @click="gotoVideoTemplate">查看详情</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
            <Col span="5" class="right-section">
                <div class="button-section">
                    <a href="http://doc.bscstorage.com/faq-pub.html"><Button type="ghost">FAQ</Button></a>
                    <a href="http://doc.bscstorage.com/doc/s2/demo/python.html"><Button type="ghost">SDK</Button></a>
                    <a href="http://doc.bscstorage.com/console-use/console-use.html"><Button type="ghost">控制台使用手册</Button></a>
                </div>
                <div class="bucket-section">
                    <div class="section-separator">
                        <div class="separator-body">
                            <span class="separator-icon"></span>
                            <span class="separator-info">我的存储</span>
                        </div>
                    </div>
                    <div class="bucket" @click="gotoBucket">
                        <p>{{bucketNum}}</p>
                        <p>Bucket</p>
                    </div>
                    <div class="buttons">
                        <Button size="small" type="primary" @click="createBucketModal = true">新建 Bucket</Button>
                        <Button size="small" type="ghost" @click="gotoKeychain">我的密钥</Button>
                    </div>
                </div>
                <div class="update-history">
                    <div class="section-separator">
                        <div class="separator-body">
                            <span class="separator-icon"></span>
                            <span class="separator-info">产品更新</span>
                        </div>
                    </div>
                    <TimelineItem color="green">
                    <Icon type="trophy" slot="dot"></Icon>
                    <span>发布里程碑版本</span>
                </TimelineItem>
                <TimelineItem>发布1.0版本</TimelineItem>
                <TimelineItem>发布2.0版本</TimelineItem>
                <TimelineItem>发布3.0版本</TimelineItem>
                </div>
            </Col>
        </Row>
        <Modal v-model="showPermissionModal" title='权限' width="700" class="permission-modal">
            <Table :stripe="true" :columns="permissionHeader" :data="permissionsList"></Table>
        </Modal>
        <Modal v-model="showSourceModal" title='镜像回源' width="700" class="permission-modal">
            <Table :stripe="true" :columns="sourceHeader" :data="sourceList"></Table>
        </Modal>
        <Modal v-model="showAccessModal" title='防盗链' width="700" class="permission-modal">
            <Table :stripe="true" :columns="accessHeader" :data="accessList"></Table>
        </Modal>
        <Modal v-model="showPictureModal" title='图片处理' width="500" class="permission-modal">
            <Table :stripe="true" :columns="pictureHeader" :data="bucketList"></Table>
        </Modal>
        <Modal v-model="createBucketModal" :title='$t("STORAGE.ADD_BUCKET")' @on-ok="addBucket" @on-cancel="inputCheck=false;createBucketValue = ''">
            <Input v-model="createBucketValue" autofocus @on-enter="addBucket" :placeholder='$t("STORAGE.ADD_BUCKET_PLACEHOLDER")' pattern="/^([a-z0-9][a-z0-9\-]*[.])*([a-z0-9][a-z0-9\-]*)*$/">
            </Input>
            <span class="info-input-error">{{inputCheck ? $t("STORAGE.ADD_BUCKET_CHECK") : ''}}</span>
        </Modal>
    </div>
</template>
<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/map'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import { getBucketList } from '@/service/Data'
import { getAnalysisUrl, FETCH_404, ACCESS_LIST } from '@/service/API'
import { handler } from '@/service/Aws'
import user from '@/store/modules/user'
import { bytes, times, bytesSpliteUnits, timesSpliteUnits } from '@/service/bucketService'
export default {
    data () {
        return {
            thisMonth: [new Date(new Date().setDate(1)), lastNDays(1)],
            originOverview: {
                capacity: [],
                traffic: [],
                request: []
            },
            permissionsList: [],
            bucketList: [],
            sourceList: [],
            accessList: [],
            showPermissionModal: false,
            showSourceModal: false,
            showAccessModal: false,
            showPictureModal: false,
            createBucketModal: false,
            createBucketValue: '',
            permissionHeader: [{
                title: 'Name',
                width: 90,
                key: 'name'
            }, {
                title: 'Grants',
                render: (h, params) => {
                    let allUser = params.row.permissions.allUser
                    let authUser = params.row.permissions.AuthUser
                    return h('div', [`allUser:${allUser.length > 0 ? allUser.join(',') : '--'};AuthUser:${authUser.length > 0 ? authUser.join(',') : '--'}`])
                }
            }, {
                title: 'Actions',
                key: 'actions',
                width: 80,
                align: 'right',
                render: (h, params) => {
                    return h('i-button', {
                        props: {
                            size: 'small'
                        },
                        on: {
                            click: () => {
                                this.gotoBucketPermissionsSetting(params.row)
                            }
                        }
                    }, [h('Icon', {
                        props: {
                            type: 'ios-cog',
                            size: 18
                        }
                    })
                    ])
                }
            }],
            sourceHeader: [{
                title: 'Name',
                width: 90,
                key: 'name'
            }, {
                title: '回源方式',
                render: (h, params) => {
                    return h('div', [h('div'), [`回源方式：${params.row.source.domain}`], h('div', [`响应方式：${params.row.source.fetch_mode.split('_')[1]}`])])
                }
            }, {
                title: 'Actions',
                key: 'actions',
                width: 80,
                align: 'right',
                render: (h, params) => {
                    return h('i-button', {
                        props: {
                            size: 'small'
                        },
                        on: {
                            click: () => {
                                this.gotoBucketSourceSetting(params.row)
                            }
                        }
                    }, [h('Icon', {
                        props: {
                            type: 'ios-cog',
                            size: 18
                        }
                    })
                    ])
                }
            }],
            accessHeader: [{
                title: 'Name',
                width: 90,
                key: 'name'
            }, {
                title: 'IP黑名单',
                render: (h, params) => {
                    return h('div', params.row.blackList.map(item => h('div', [`${item.ip}:${item.access}`])))
                }
            }, {
                title: 'IP白名单',
                render: (h, params) => {
                    return h('div', params.row.whiteList.map(item => h('div', [`${item.ip}:${item.access}`])))
                }
            }, {
                title: 'Actions',
                key: 'actions',
                width: 80,
                align: 'right',
                render: (h, params) => {
                    return h('i-button', {
                        props: {
                            size: 'small'
                        },
                        on: {
                            click: () => {
                                this.gotoBucketAccessSetting(params.row)
                            }
                        }
                    }, [h('Icon', {
                        props: {
                            type: 'ios-cog',
                            size: 18
                        }
                    })
                    ])
                }
            }],
            pictureHeader: [
                {
                    title: 'Name',
                    width: 90,
                    key: 'Name'
                },
                {
                    title: 'Actions',
                    key: 'actions',
                    width: 80,
                    align: 'right',
                    render: (h, params) => {
                        return h('i-button', {
                            props: {
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.gotoBucketPictureStyle(params.row)
                                }
                            }
                        }, [h('Icon', {
                            props: {
                                type: 'ios-cog',
                                size: 18
                            }
                        })
                        ])
                    }
                }
            ]
        }
    },
    computed: {
        dateRange () {
            return formatDate(this.thisMonth[0]) + '-' + formatDate(this.thisMonth[1])
        },
        inputCheck () {
            !(this.createBucketValue.length >= 3)
        },
        bucketNum () {
            return this.bucketList.length
        }
    },
    created () {
        this.convertBucketList()
        this.getOverviewsData()
    },
    methods: {
        async convertBucketList () {
            try {
                let res = await getBucketList()
                res.Buckets.forEach((item) => {
                    this.getBucketAcl(item.Name).then(acl => {
                        this.convertGrants(acl.Grants)
                        acl.Grants.length > 1 && this.permissionsList.push({
                            name: item.Name,
                            permissions: this.convertGrants(acl.Grants)
                        })
                    })
                    this.getBucketSource(item.Name).then(source => {
                        source.length > 0 && source.map(sourceItem => {
                            !!sourceItem.is_active && this.sourceList.push({
                                name: item.Name,
                                source: sourceItem
                            })
                        })
                    })
                    this.getAccessList(item.Name).then(access => {
                        this.convertAccess(item.Name, access)
                    })
                })
                this.bucketList = [...res.Buckets]
            } catch (error) {
                console.log(error)
                this.$Message.error(this.$t('DASHBOARD.GET_BUCKET_FAILED'))
            }
        },
        getOverviewsData () {
            try {
                this.$http.get(this.getApiURL('overview')).then(res => {
                    let data = res.data
                    this.originOverview = {
                        capacity: this.convertData(data.capacity, true),
                        traffic: this.convertData({
                            value: data.upload_space.value + data.download_space.value,
                            unit: data.upload_space.unit
                        }, true),
                        request: this.convertData({
                            value: data.download_count.value + data.delete_count.value + data.upload_count.value,
                            unit: data.download_count.unit
                        }, true)
                    }
                })
            } catch (error) {
                console.log(error)
            }
        },
        gotoBucketPermissionsSetting (data) {
            this.$router.push({ name: 'bucketSettings', params: { bucket: data.name, tabName: 'permission' } })
        },
        gotoBucketSourceSetting (data) {
            this.$router.push({ name: 'bucketSettings', params: { bucket: data.name, tabName: 'backSource' } })
        },
        gotoBucketAccessSetting (data) {
            this.$router.push({ name: 'bucketSettings', params: { bucket: data.name, tabName: 'whiteList' } })
        },
        gotoBucketPictureStyle (data) {
            this.$router.push({ name: 'pictureStyles', params: { bucket: data.Name } })
        },
        gotoVideoTemplate (data) {
            this.$router.push({ name: 'template' })
        },
        gotoBucket () {
            this.$router.push({ name: 'bucket' })
        },
        gotoKeychain () {
            this.$router.push({ name: 'keychain' })
        },
        convertGrants (grants) {
            let permissions = {
                allUser: [],
                AuthUser: []
            }
            _.each(grants, grant => {
                if (grant.Grantee.URI && grant.Grantee.URI === 'http://acs.amazonaws.com/groups/global/AllUsers') {
                    if (grant.Permission === 'READ') {
                        permissions.allUser.push(this.$t('STORAGE.READ'))
                    } else if (grant.Permission === 'WRITE') {
                        permissions.allUser.push(this.$t('STORAGE.WRITE'))
                    } else if (grant.Permission === 'FULL_CONTROL') {
                        permissions.allUser.push(this.$t('STORAGE.READ'), this.$t('STORAGE.WRITE'))
                    }
                } else if (grant.Grantee.URI && grant.Grantee.URI === 'http://acs.amazonaws.com/groups/global/AuthenticatedUsers') {
                    if (grant.Permission === 'READ') {
                        permissions.AuthUser.push(this.$t('STORAGE.READ'))
                    } else if (grant.Permission === 'WRITE') {
                        permissions.AuthUser.push(this.$t('STORAGE.WRITE'))
                    } else if (grant.Permission === 'FULL_CONTROL') {
                        permissions.AuthUser.push(this.$t('STORAGE.READ'), this.$t('STORAGE.WRITE'))
                    }
                }
            })
            return permissions
        },
        convertData (item, splite = false) {
            if (!item) return '000'
            return splite ? item.unit === 'byte' ? bytesSpliteUnits(item.value) : timesSpliteUnits(item.value) : item.unit === 'byte' ? bytes(item.value) : times(item.value)
        },
        getApiURL (operation) {
            let path = operation += '?custom_range=' + this.dateRange
            if (user.state.type === 'admin') {
                path += '&customer=' + user.state.subUser.username
            }
            return getAnalysisUrl(path)
        },
        async getBucketAcl (name) {
            try {
                return await handler('getBucketAcl', {
                    Bucket: name
                })
            } catch (error) {
                console.log(error)
            }
        },
        async getBucketSource (name) {
            let rule = {
                action: 'list',
                bucket: name
            }
            try {
                return await this.$http.post(FETCH_404, rule)
            } catch (error) {
                console.log(error)
            }
        },
        async getAccessList (name) {
            const params = {
                action: 'get',
                bucket: name,
                user: user.state.username
            }
            try {
                return await this.$http.post(ACCESS_LIST, params)
            } catch (error) {
                console.log(error)
            }
        },
        convertAccess (bucket, access) {
            let blackIPs = [...access.delete_file.black_list, ...access.download_file.black_list, ...access.upload_file.black_list]
            let whiteIPs = [...access.delete_file.white_list, ...access.download_file.white_list, ...access.upload_file.white_list]
            let blackList = []
            let whiteList = []
            blackIPs[0] && blackList.push({ip: blackIPs[0], access: this.accessValue(blackIPs[0], access)})
            blackIPs[1] && blackList.push({ip: blackIPs[1], access: this.accessValue(blackIPs[1], access)})
            whiteIPs[0] && whiteList.push({ip: whiteIPs[0], access: this.accessValue(whiteIPs[0], access, 'white_list')})
            whiteIPs[1] && whiteList.push({ip: whiteIPs[1], access: this.accessValue(whiteIPs[1], access, 'white_list')})
            if (blackList.length > 0 || whiteList.length > 0) {
                this.accessList.push({
                    name: bucket,
                    blackList,
                    whiteList
                })
            }
        },
        accessValue (ip, access, listName = 'black_list') {
            let value = []
            access.upload_file[listName].includes(ip) && value.push(this.$t('SETTINGS.UPLOAD'))
            access.download_file[listName].includes(ip) && value.push(this.$t('SETTINGS.DOWNLOAD'))
            access.delete_file[listName].includes(ip) && value.push(this.$t('SETTINGS.DELETE'))
            return value.join(',')
        },
        async addBucket () {
            this.createBucketModal = false
            if (this.createBucketValue.length > 2) {
                await handler('createBucket', { Bucket: this.createBucketValue })
                this.bucketList.push({Name: this.createBucketValue})
                this.$Message.success(this.$t('STORAGE.ADD_BUCKET_SUCCESS'))
                this.createBucketValue = ''
            } else {
                this.$Message.warning(this.$t('STORAGE.ADD_BUCKET_CHECK'))
            }
        }
    },
    components: {
        chart: ECharts
    }
}
const fixDate = n => n < 10 ? '0' + n : '' + n
const lastNDays = n => new Date(new Date().getTime() - 3600 * 1000 * 24 * n)
const formatDate = date => date && date.getFullYear() + fixDate(date.getMonth() + 1) + fixDate(date.getDate())
</script>
<style scoped lang="less">
.@{css-prefix}overview {
    .left-section {
        padding-right: 20px;

        & > div {
            border: @common-border;
            padding: 16px;
            margin-bottom: 20px;
        }

        .storage {
            .storage-card {
                display: inline-block;
                border: @common-border;
                width: calc(~'33% - 11px');
                height: 300px;

                .title {
                    height: 100px;
                    width: calc(~'100% - 20px');
                    border-bottom: @common-border;
                    margin: 0 10px;
                    .fb(center,center);

                    .images {
                        height: 100px;
                        background-size: 60px;
                        flex: 7;
                    }

                    .texts {
                        display: inline-block;
                        height: 100px;
                        flex: 13;

                        .label {
                            position: relative;
                            left: 20px;
                            top: 20px;
                            font-size: 14px;
                            color: #475669;
                        }

                        .numbers {
                            position: relative;
                            left: 20px;
                            top: 20px;
                            font-size: 34px;
                            color: #475669;

                            span {
                                font-size: 14px;
                            }
                        }
                    }
                }
            }

            .storage-card:nth-child(2) .images {
                background: url('../../assets/overview/capacity.png') center center no-repeat;
            }

            .storage-card:nth-child(3) .images {
                background: url('../../assets/overview/traffic.png') center center no-repeat;
            }

            .storage-card:nth-child(4) .images {
                background: url('../../assets/overview/request.png') center center no-repeat;
            }

            .storage-card:not(:last-child) {
                margin-right: 16px;
            }
        }

        .file-ruler-card {
            height: 150px;
            text-align: center;
            border: @common-border;
            flex: 1;
            margin-right: 20px;
            position: relative;
            box-sizing: content-box;

            &-title {
                height: 40px;
                background-color: #eff2f7;
                color: #475669;
                font-size: 14px;
                line-height: 40px;
            }

            &-body {
                height: 110px;
                width: 100%;
                background-size: 70px auto;
                background-position: 10px center;
                background-repeat: no-repeat;
                .fb(flex-start, center);
                text-align: left;

                p {
                    flex: 13;
                    padding-left: 90px;
                    span {
                        color: #20a0ff;
                    }
                }

            }

            &-hover{
                position: absolute;
                top: 40px;
                left: 0;
                width: 100%;
                height: 110px;
                background-color: #fff;
                opacity: 0;
                .fb(center, center, inline-flex, column);

                &.waiting {
                    background: url('../../assets/overview/waiting.png') center 20px no-repeat #fff;
                }
                &.phone {
                    background: url('../../assets/overview/phone-white.png') center 20px no-repeat #fff;
                }
                p {
                    color: #475669;
                    position: absolute;
                    top: 66px;
                }
            }
            &:last-child {
                margin-right: 0;
            }
            &:hover {
                background-color: #fff;
                border-color: #54b6ff;

                .file-ruler-card-title{
                    background-color: #54b6ff;
                    color: #fff;
                }

                .file-ruler-card-hover{
                    opacity: 1;
                }
            }
        }
        .file-ruler {
            .card-section{
                width: 100%;
                .fb(space-between, center);
            }

            .file-ruler-card {
                &:nth-child(1) {
                    .file-ruler-card-body {
                        background-image: url('../../assets/overview/permisson.png');
                    }
                }
                &:nth-child(2) {
                    .file-ruler-card-body {
                        background-image: url('../../assets/overview/www.png');
                    }
                }
                &:nth-child(3) {
                    .file-ruler-card-body {
                        background-image: url('../../assets/overview/404.png');
                    }
                }
                &:nth-child(4) {
                    .file-ruler-card-body {
                        background-image: url('../../assets/overview/IP.png');
                    }
                }
            }
        }

        .file-handle {

            .card-section {
                width: 100%;
                .fb(space-between, center);
            }

            .file-ruler-card{
                &-body p{
                    padding-right: 10px;
                }
                &-body {
                    text-align: center;
                }
                &:nth-child(1) {
                    .file-ruler-card-body {
                        background-image: url('../../assets/overview/pic.png');
                    }
                }
                &:nth-child(2) {
                    .file-ruler-card-body {
                        background-image: url('../../assets/overview/sex.png');
                    }
                }
                &:nth-child(3) {
                    .file-ruler-card-body {
                        background-image: url('../../assets/overview/video.png');
                    }
                }
            }
        }
    }

    .right-section {
        .button-section {
            button {
                margin-right: 4px;
                border-radius: 3px;
            }
        }
        .bucket-section,
        .update-history {
            border: @common-border;
            margin-top: 12px;
            padding: 16px;

            .section-separator {
                margin-bottom: 20px;
                padding-bottom: 14px;
                border-bottom: @common-border;
            }
        }

        .bucket-section {
            height: 250px;
            text-align: center;

            .bucket {
                height: 120px;
                width: 120px;
                text-align: center;
                margin: 5px auto 0 auto;
                background-color: #f9fafc;
                background-image: url('../../assets/bucket.png');
                background-repeat: no-repeat;
                background-position: center 25px;
                background-size: 50px;
                cursor: pointer;

                p:first-child {
                    position: relative;
                    top: 42px;
                    font-size: 18px;
                    font-weight: bold;
                    color: #fff;
                }

                p:last-child {
                    position: relative;
                    top: 52px;
                    font-size: 14px;
                    color: #475669;
                }
            }

            .buttons {
                margin-top: 20px;

                button:last-child {
                    margin-left: 8px;
                }
            }
        }
    }
}
.dark .@{css-prefix}overview {
    .left-section {
        padding-right: 20px;

        & > div {
            border-color: transparent;
        }

        .storage {
            .storage-card {
                border-color: @card-border-color-dark;
                background-color: @card-bg-dark;

                .title {
                    border-color: @card-border-color-dark;
                    .texts {
                        .label {
                            color: #8492a6;
                        }

                        .numbers {
                            color: #ffba42;
                        }
                    }
                }
            }

            .storage-card:nth-child(2) .images {
                background-image: url('../../assets/overview/capacity-dark.png');
            }

            .storage-card:nth-child(3) .images {
                background-image: url('../../assets/overview/traffic-dark.png');
            }

            .storage-card:nth-child(4) .images {
                background-image: url('../../assets/overview/request-dark.png');
            }
        }

        .file-ruler-card {
            border-color: @card-border-color-dark;
            background-color: @card-bg-dark;
            color: #8491a6;

            &-title {
                background-color: #293137;
                color: #8491a6;
            }

            &-hover{
                background-color: #293137;

                &.waiting {
                    background-img: url('../../assets/overview/waiting-dark.png');
                }
                &.phone {
                    background-img: url('../../assets/overview/phone-dark.png');
                }
                p {
                    color: #8492a6;
                }
            }
            &:hover {
                background-color: #fff;
                border-color: #54b6ff;

                .file-ruler-card-title{
                    background-color: #20a0ff;
                }
            }
        }
        .file-ruler {
            .file-ruler-card {
                &:nth-child(1) {
                    .file-ruler-card-body {
                        background-image: url('../../assets/overview/permisson-dark.png');
                    }
                }
                &:nth-child(2) {
                    .file-ruler-card-body {
                        background-image: url('../../assets/overview/www-dark.png');
                    }
                }
                &:nth-child(3) {
                    .file-ruler-card-body {
                        background-image: url('../../assets/overview/404-dark.png');
                    }
                }
                &:nth-child(4) {
                    .file-ruler-card-body {
                        background-image: url('../../assets/overview/IP-dark.png');
                    }
                }
            }
        }

        .file-handle {
            .file-ruler-card{
                &-body {
                    text-align: center;
                }
                &:nth-child(1) {
                    .file-ruler-card-body {
                        background-image: url('../../assets/overview/pic-dark.png');
                    }
                }
                &:nth-child(2) {
                    .file-ruler-card-body {
                        background-image: url('../../assets/overview/sex-dark.png');
                    }
                }
                &:nth-child(3) {
                    .file-ruler-card-body {
                        background-image: url('../../assets/overview/video-dark.png');
                    }
                }
            }
        }
    }

    .right-section {
        .button-section {
            button {
                margin-top: 42px;
            }
        }
        .bucket-section,
        .update-history {
            border: none;
            background-color: @card-bg-dark;

            .section-separator {
                border-color: @card-border-color-dark;
            }
        }

        .bucket-section {
            .bucket {
                background-color: transparent;
                border: @common-border-dark;

                p:first-child {
                    color: #fff;
                    text-shadow: 0 0 1px 0px rgba(0,0,0,0.24)
                }

                p:last-child {
                    color: @text-color-dark;
                }
            }
        }
    }
}
</style>


