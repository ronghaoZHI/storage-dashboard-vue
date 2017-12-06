<template>
    <div>
        <div class="section-separator">
            <div class="separator-body">
                <span class="separator-icon"></span>
                <span class="separator-info">{{$t('SETTINGS.WHITE_BLACK')}}</span>
            </div>
        </div>
        <div class="is-open">
            <span class="setting-name">{{$t('STORAGE.ISOPEN')}}</span>
            <i-switch size="large" v-model="enabled">
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
        <div class="new-item">
            <Form ref="whiteForm" :model="newWhite" :rules="whiteRules" class="ip-form">
                <FormItem prop="ip" class="ip-item">
                    <Input v-model="newWhite.ip" class="new-ip" :placeholder="$t('SETTINGS.NEW_IP_PLACEHOLDER')" @keyup.enter="addWhite"></Input>
                </FormItem>
            </Form>
            <Checkbox v-model="newWhite.upload">{{$t('SETTINGS.UPLOAD')}}</Checkbox>
            <Checkbox v-model="newWhite.download">{{$t('SETTINGS.DOWNLOAD')}}</Checkbox>
            <Checkbox v-model="newWhite.delete">{{$t('SETTINGS.DELETE')}}</Checkbox>
        </div>
        <Table border :stripe="true" :columns="whiteHeader" :data="whiteList" :no-data-text='$t("STORAGE.NO_LIST")'></Table>
        <div class="section-separator mar-t-35">
            <div class="separator-body">
                <span class="separator-icon"></span>
                <span class="separator-info">{{$t('SETTINGS.IP_BLACK_LIST')}}</span>
            </div>
        </div>
        <div class="new-item" @keyup.enter="addBlack">
            <Form ref="blackForm" :model="newBlack" :rules="blackRules" class="ip-form">
                <FormItem prop="ip" class="ip-item">
                    <Input v-model="newBlack.ip"  class="new-ip" :placeholder="$t('SETTINGS.NEW_IP_PLACEHOLDER')"></Input>
                </FormItem>
            </Form>
            <Checkbox v-model="newBlack.upload">{{$t('SETTINGS.UPLOAD')}}</Checkbox>
            <Checkbox v-model="newBlack.download">{{$t('SETTINGS.DOWNLOAD')}}</Checkbox>
            <Checkbox v-model="newBlack.delete">{{$t('SETTINGS.DELETE')}}</Checkbox>
        </div>
        <Table border :stripe="true" :columns="blackHeader" :data="blackList" :no-data-text='$t("STORAGE.NO_LIST")'></Table>
        <Button type="primary" class="settings-btn" @click="accessSet()">{{$t('SETTINGS.SAVE')}}</Button>
    </div>
</template>
<script>
import { ACCESS_LIST, ADD_SERVICE } from '@/service/API'
import user from '@/store/modules/user'
export default {
    data () {
        return {
            whiteList: [],
            blackList: [],
            iconSize: 18,
            enabled: false,
            newBlack: {
                ip: '',
                upload: false,
                download: false,
                delete: false
            },
            newWhite: {
                ip: '',
                upload: false,
                download: false,
                delete: false
            },
            whiteRules: {
                ip: [
                    { validator: this.validateWhiteIP, trigger: 'change' }
                ]
            },
            blackRules: {
                ip: [
                    { validator: this.validateBlackIP, trigger: 'change' }
                ]
            },
            whiteHeader: [{
                title: 'IP',
                width: 150,
                key: 'ip'
            }, {
                title: this.$t('SETTINGS.ACCESS'),
                width: 150,
                render: (h, params) => {
                    return h('div', [
                        h('Checkbox', {
                            props: {
                                value: params.row.upload
                            },
                            on: {
                                input: value => {
                                    this.whiteList[params.row._index].upload = value
                                }
                            }
                        }, [this.$t('SETTINGS.UPLOAD')]),
                        h('Checkbox', {
                            props: {
                                value: params.row.download
                            },
                            on: {
                                input: value => {
                                    this.whiteList[params.row._index].download = value
                                }
                            }
                        }, [this.$t('SETTINGS.DOWNLOAD')]),
                        h('Checkbox', {
                            props: {
                                value: params.row.delete
                            },
                            on: {
                                input: value => {
                                    this.whiteList[params.row._index].delete = value
                                }
                            }
                        }, [this.$t('SETTINGS.DELETE')])
                    ])
                }
            }, {
                title: this.$t('VIDEO.OPERATION'),
                width: 80,
                align: 'right',
                render: (h, params) => {
                    return h('Tooltip', {
                        props: {
                            content: this.$t('PUBLIC.DELETE'),
                            delay: 1000,
                            placement: 'top'
                        }
                    }, [h('i-button', {
                        props: {
                            size: 'small'
                        },
                        on: {
                            click: () => {
                                this.listDelete(this.whiteList, params.row._index)
                            }
                        }
                    }, [h('Icon', {
                        props: {
                            type: 'ios-trash',
                            size: this.iconSize
                        }
                    })])])
                }
            }],
            blackHeader: [{
                title: 'IP',
                width: 150,
                key: 'ip'
            }, {
                title: this.$t('SETTINGS.ACCESS'),
                width: 150,
                render: (h, params) => {
                    return h('div', [
                        h('Checkbox', {
                            props: {
                                value: params.row.upload
                            },
                            on: {
                                input: value => {
                                    this.blackList[params.row._index].upload = value
                                }
                            }
                        }, [this.$t('SETTINGS.UPLOAD')]),
                        h('Checkbox', {
                            props: {
                                value: params.row.download
                            },
                            on: {
                                input: value => {
                                    this.blackList[params.row._index].download = value
                                }
                            }
                        }, [this.$t('SETTINGS.DOWNLOAD')]),
                        h('Checkbox', {
                            props: {
                                value: params.row.delete
                            },
                            on: {
                                input: value => {
                                    this.blackList[params.row._index].delete = value
                                }
                            }
                        }, [this.$t('SETTINGS.DELETE')])
                    ])
                }
            }, {
                title: this.$t('VIDEO.OPERATION'),
                key: 'actions',
                width: 80,
                align: 'right',
                render: (h, params) => {
                    return h('Tooltip', {
                        props: {
                            content: this.$t('PUBLIC.DELETE'),
                            delay: 1000,
                            placement: 'top'
                        }
                    }, [h('i-button', {
                        props: {
                            size: 'small'
                        },
                        on: {
                            click: () => {
                                this.listDelete(this.blackList, params.row._index)
                            }
                        }
                    }, [h('Icon', {
                        props: {
                            type: 'ios-trash',
                            size: this.iconSize
                        }
                    })])])
                }
            }]
        }
    },
    created () {
        this.getList()
    },
    props: ['bucket'],
    methods: {
        async getList () {
            this.$Loading.start()
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
            } catch (error) {
                this.$Loading.error()
            }
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
                this.listEnabled()
                await this.$http.post(ACCESS_LIST, params)
                this.$Loading.finish()
                this.$Message.success(this.$t('SETTINGS.SAVED'))
            } catch (error) {
                this.$Loading.error()
            }
        },
        addBlack () {
            this.$refs['blackForm'].validate((valid) => {
                if (!valid) {
                    this.$Message.error(this.$t('SETTINGS.IP_INVALID'))
                } else {
                    this.blackList.push(_.cloneDeep(this.newBlack))
                }
            })
        },
        addWhite () {
            this.$refs['whiteForm'].validate((valid) => {
                if (!valid) {
                    this.$Message.error(this.$t('SETTINGS.IP_INVALID'))
                } else {
                    this.whiteList.push(_.cloneDeep(this.newWhite))
                }
            })
        },
        validateWhiteIP (rule, value, callback) {
            if (!ipReg.test(value)) {
                callback(new Error(this.$t('SETTINGS.IP_INVALID')))
            } else if (!!this.whiteList.find(item => item.ip === value)) {
                callback(new Error(this.$t('SETTINGS.IP_EXISTS')))
            } else {
                callback()
            }
        },
        validateBlackIP (rule, value, callback) {
            if (!ipReg.test(value)) {
                callback(new Error(this.$t('SETTINGS.IP_INVALID')))
            } else if (!!this.blackList.find(item => item.ip === value)) {
                callback(new Error(this.$t('SETTINGS.IP_EXISTS')))
            } else {
                callback()
            }
        },
        listDelete (list, index) {
            list.splice(index, 1)
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
            download: listData.download_file[api].includes(key)
        }
        front.push(item)
    })
    return front
}
const list2Saved = (list, saved, api) => {
    list.map(item => {
        if (item.download) {
            saved.download_file[api].push(item.ip)
        }
        if (item.delete) {
            saved.delete_file[api].push(item.ip)
        }
        if (item.upload) {
            saved.upload_file[api].push(item.ip)
        }
    })
    return saved
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
const ipReg = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

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
