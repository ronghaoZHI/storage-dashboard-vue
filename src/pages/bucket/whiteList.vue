<template>
    <div>
        <div class="section-separator">
            <div class="separator-body">
                <span class="separator-icon"></span>
                <span class="separator-info">IP白名单</span>
            </div>
        </div>
        <div class="new-item" @keyup.enter="addWhite">
            <Form ref="whiteForm" :model="newWhite" :rules="whiteRules" class="ip-form">
                <FormItem prop="ip" class="ip-item">
                    <Input v-model="newWhite.ip" class="new-ip" placeholder="请输入要添加的IP"></Input>
                </FormItem>
            </Form>
            <Checkbox v-model="newWhite.upload">上传</Checkbox>
            <Checkbox v-model="newWhite.download">下载</Checkbox>
            <Checkbox v-model="newWhite.delete">删除</Checkbox>
        </div>
        <Table border :stripe="true" :columns="whiteHeader" :data="whiteList" :no-data-text='$t("STORAGE.NO_LIST")'></Table>
        <div class="section-separator mar-t-35">
            <div class="separator-body">
                <span class="separator-icon"></span>
                <span class="separator-info">IP黑名单</span>
            </div>
        </div>
        <div class="new-item" @keyup.enter="addBlack">
            <Form ref="blackForm" :model="newBlack" :rules="blackRules" class="ip-form">
                <FormItem prop="ip" class="ip-item">
                    <Input v-model="newBlack.ip"  class="new-ip" placeholder="请输入要添加的IP"></Input>
                </FormItem>
            </Form>
            <Checkbox v-model="newBlack.upload">上传</Checkbox>
            <Checkbox v-model="newBlack.download">下载</Checkbox>
            <Checkbox v-model="newBlack.delete">删除</Checkbox>
        </div>
        <Table border :stripe="true" :columns="blackHeader" :data="blackList" :no-data-text='$t("STORAGE.NO_LIST")'></Table>
        <Button type="primary" class="mar-t-35" @click="accessSet()">保存</Button>
    </div>
</template>
<script>
import { ACCESS_LIST } from '@/service/API'
import user from '@/store/modules/user'
export default {
    data () {
        return {
            whiteList: [],
            blackList: [],
            iconSize: 18,
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
                title: '权限',
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
                        }, ['上传']),
                        h('Checkbox', {
                            props: {
                                value: params.row.download
                            },
                            on: {
                                input: value => {
                                    this.whiteList[params.row._index].download = value
                                }
                            }
                        }, ['下载']),
                        h('Checkbox', {
                            props: {
                                value: params.row.delete
                            },
                            on: {
                                input: value => {
                                    this.whiteList[params.row._index].delete = value
                                }
                            }
                        }, ['删除'])
                    ])
                }
            }, {
                title: this.$t('VIDEO.OPERATION'),
                key: 'actions',
                width: 80,
                align: 'right',
                render: (h, params) => {
                    return h('div', {
                        props: {
                            content: this.$t('VIDEO.CANCEL'),
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
                title: '权限',
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
                        }, ['上传']),
                        h('Checkbox', {
                            props: {
                                value: params.row.download
                            },
                            on: {
                                input: value => {
                                    this.blackList[params.row._index].download = value
                                }
                            }
                        }, ['下载']),
                        h('Checkbox', {
                            props: {
                                value: params.row.delete
                            },
                            on: {
                                input: value => {
                                    this.blackList[params.row._index].delete = value
                                }
                            }
                        }, ['删除'])
                    ])
                }
            }, {
                title: this.$t('VIDEO.OPERATION'),
                key: 'actions',
                width: 80,
                align: 'right',
                render: (h, params) => {
                    return h('div', {
                        props: {
                            content: this.$t('VIDEO.CANCEL'),
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
                this.whiteList = []
                this.blackList = []
                let whiteIP = new Set(listData.download_file.white_list.concat(listData.delete_file.white_list).concat(listData.upload_file.white_list))
                let blackIP = new Set(listData.download_file.black_list.concat(listData.delete_file.black_list).concat(listData.upload_file.black_list))
                whiteIP.forEach(key => {
                    let item = {
                        ip: key,
                        upload: listData.upload_file.white_list.includes(key),
                        delete: listData.delete_file.white_list.includes(key),
                        download: listData.download_file.white_list.includes(key)
                    }
                    this.whiteList.push(item)
                })
                blackIP.forEach(key => {
                    let item = {
                        ip: key,
                        upload: listData.upload_file.black_list.includes(key),
                        delete: listData.delete_file.black_list.includes(key),
                        download: listData.download_file.black_list.includes(key)
                    }
                    this.blackList.push(item)
                })
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
                this.$Message.error('获取列表失败！')
            }
        },
        async accessSet () {
            this.$Loading.start()
            console.log(this.whiteList, this.blackList)
            let saved = {
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
            this.whiteList.map(item => {
                if (item.download) {
                    saved.download_file.white_list.push(item.ip)
                }
                if (item.delete) {
                    saved.delete_file.white_list.push(item.ip)
                }
                if (item.upload) {
                    saved.upload_file.white_list.push(item.ip)
                }
            })
            this.blackList.map(item => {
                if (item.download) {
                    saved.download_file.black_list.push(item.ip)
                }
                if (item.delete) {
                    saved.delete_file.black_list.push(item.ip)
                }
                if (item.upload) {
                    saved.upload_file.black_list.push(item.ip)
                }
            })
            let params = {
                action: 'set',
                ips: saved,
                bucket: this.bucket,
                user: user.state.username
            }
            try {
                await this.$http.post(ACCESS_LIST, params)
                this.$Loading.finish()
                this.$Message.success('修改成功！')
            } catch (error) {
                this.$Loading.error()
                this.$Message.error('提交失败！')
            }
        },
        addBlack () {
            this.$refs['blackForm'].validate((valid) => {
                if (!valid) {
                    this.$Message.error('IP已存在！')
                } else {
                    this.blackList.push(_.cloneDeep(this.newBlack))
                }
            })
        },
        addWhite () {
            this.$refs['whiteForm'].validate((valid) => {
                if (!valid) {
                    this.$Message.error('IP已存在！')
                } else {
                    this.whiteList.push(_.cloneDeep(this.newWhite))
                }
            })
        },
        validateWhiteIP (rule, value, callback) {
            if (!!this.whiteList.find(item => item.ip === value)) {
                callback(new Error('IP已存在！'))
            } else {
                callback()
            }
        },
        validateBlackIP (rule, value, callback) {
            if (!!this.blackList.find(item => item.ip === value)) {
                callback(new Error('IP已存在！'))
            } else {
                callback()
            }
        },
        listDelete (list, index) {
            list.splice(index, 1)
        }
    }
}
// const apiData = {
//     download_file: {
//         white_list: ['3.4.5.6', '127.0.0.1'],
//         black_list: []
//     },
//     delete_file: {
//         white_list: [],
//         black_list: ['2.3.4.5']
//     },
//     upload_file: {
//         white_list: ['127.0.0.1'],
//         black_list: ['2.3.4.5']
//     }
// }
</script>
<style lang="less" scoped>
.mar-t-35{
    margin-top: 35px;
}
.new-item{
    margin: 10px 0;
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
</style>
