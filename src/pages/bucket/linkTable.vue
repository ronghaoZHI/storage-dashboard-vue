<template>
    <div>
        <div class="new-item">
            <Form :ref="formName" :model="newItem" :rules="rules" class="ip-form">
                <FormItem prop="ip" class="ip-item">
                    <Input type="textarea" v-model="newItem.ip" class="new-ip" :placeholder="$t('SETTINGS.NEW_IP_PLACEHOLDER')" :autosize="true" style="width: 330px"></Input>
                </FormItem>
            </Form>
            <Checkbox v-model="newItem.upload">{{$t('SETTINGS.UPLOAD')}}</Checkbox>
            <Checkbox v-model="newItem.download">{{$t('SETTINGS.DOWNLOAD')}}</Checkbox>
            <Checkbox v-model="newItem.delete">{{$t('SETTINGS.DELETE')}}</Checkbox>
            <Button size="small" type="primary" @click="addIPVertify">{{$t('PUBLIC.ADD')}}</Button>
        </div>
        <p class="page-info">{{$t('SETTINGS.WHITE_BLACK_LIST_INFO')}}</p>
        <p class="page-info">{{info}}</p>
        <Table border :stripe="true" :columns="listHeader" :data="listData" :no-data-text='$t("STORAGE.NO_LIST")'></Table>
    </div>
</template>
<script>
export default {
    props: ['listData', 'formName', 'info'],
    data () {
        return {
            iconSize: 18,
            itemEdit: {},
            newIps: [],
            newItem: {
                ip: '',
                upload: true,
                download: true,
                delete: true
            },
            rules: {
                ip: [
                    { validator: this.validateIP, trigger: 'change' }
                ]
            },
            listHeader: [{
                title: 'IP',
                width: '40%',
                key: 'ip'
            }, {
                title: this.$t('SETTINGS.ACCESS'),
                render: (h, params) => {
                    let itemData = this.listData[params.row._index]
                    let buttons = itemData.edit ? h('div', {
                        style: {
                            display: 'inline-block'
                        }
                    }, [h('i-button', {
                        style: {
                            margin: '0 6px'
                        },
                        props: {
                            size: 'small',
                            icon: 'checkmark-round'
                        },
                        on: {
                            click: async () => {
                                await this.$parent.accessSet()
                                itemData.edit = false
                            }
                        }
                    }), h('i-button', {
                        style: {
                            margin: '0 6px'
                        },
                        props: {
                            size: 'small',
                            icon: 'close-round'
                        },
                        on: {
                            click: () => {
                                itemData.upload = itemData.before.upload
                                itemData.delete = itemData.before.delete
                                itemData.download = itemData.before.download
                                itemData.edit = false
                            }
                        }
                    })]) : h('i-button', {
                        props: {
                            size: 'small'
                        },
                        on: {
                            click: () => {
                                itemData.before = {
                                    upload: itemData.upload,
                                    delete: itemData.delete,
                                    download: itemData.download
                                }
                                itemData.edit = true
                            }
                        }
                    }, [h('Icon', {
                        props: {
                            type: 'compose',
                            size: this.iconSize
                        }
                    })])
                    return h('div', [
                        h('Checkbox', {
                            props: {
                                value: itemData.upload,
                                disabled: !itemData.edit
                            },
                            on: {
                                input: value => {
                                    itemData.upload = value
                                }
                            }
                        }, [this.$t('SETTINGS.UPLOAD')]),
                        h('Checkbox', {
                            props: {
                                value: itemData.download,
                                disabled: !itemData.edit
                            },
                            on: {
                                input: value => {
                                    itemData.download = value
                                }
                            }
                        }, [this.$t('SETTINGS.DOWNLOAD')]),
                        h('Checkbox', {
                            props: {
                                value: itemData.delete,
                                disabled: !itemData.edit
                            },
                            on: {
                                input: value => {
                                    itemData.delete = value
                                }
                            }
                        }, [this.$t('SETTINGS.DELETE')]),
                        buttons
                    ])
                }
            }, {
                title: this.$t('VIDEO.OPERATION'),
                width: '82px',
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
                                this.listDeleteConfirm(params.row._index)
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
    computed: {
        bucket () {
            return this.$route.params.bucket
        }
    },
    created () {
    },
    methods: {
        addIPVertify () {
            this.$refs[this.formName].validate((valid) => {
                if (!valid) {
                    this.$Message.error(this.$t('SETTINGS.IP_INVALID'))
                } else {
                    this.addIP()
                }
            })
        },
        addIP () {
            this.newIps.forEach(ip => {
                this.listData.push({
                    ip,
                    upload: this.newItem.upload,
                    delete: this.newItem.delete,
                    download: this.newItem.download,
                    edit: false,
                    before: {
                        upload: this.newItem.upload,
                        delete: this.newItem.delete,
                        download: this.newItem.download
                    }
                })
            })
            this.$parent.accessSet()
        },
        validateIP (rule, value, callback) {
            this.newIps = value.replace(/\r\n/ig, ';').replace(/\n/g, ';').replace(/\r/g, ';').replace('/\u21b5/g', ';').split(';')
            let ipsSet = new Set(this.newIps)
            let exits = !this.newIps.every(ip => !this.listData.find(item => {
                if (item.ip === ip) return true
                if (item.ip.includes('*')) {
                    for (let i = 0; i < 4; i++) {
                        let itemIp = item.ip.split('.')
                        let testIp = ip.split('.')
                        itemIp.splice(i, 1)
                        testIp.splice(i, 1)
                        if (itemIp.join('.') === testIp.join('.')) return true
                    }
                }
            }))
            if (!this.newIps.every(ip => ipReg.test(ip) && ip.split('.').indexOf('*') === ip.split('.').lastIndexOf('*'))) {
                callback(new Error(this.$t('SETTINGS.IP_INVALID')))
            } else if (exits) {
                callback(new Error(this.$t('SETTINGS.IP_EXISTS')))
            } else if (ipsSet.size !== this.newIps.length) {
                callback(new Error(this.$t('SETTINGS.IP_REPEAT')))
            } else {
                callback()
            }
        },
        listDeleteConfirm (index) {
            this.$Modal.confirm({
                content: this.$t('SETTINGS.COMFIRM_DELETE_HOTLINK', {ip: this.listData[index].ip}),
                okText: this.$t('PUBLIC.CONFIRMED'),
                cancelText: this.$t('PUBLIC.CANCLE'),
                title: this.$t('PUBLIC.DELETE'),
                onOk: () => {
                    this.listData.splice(index, 1)
                    this.$parent.accessSet()
                }
            })
        }
    }
}

const ipReg = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|\*)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|\*)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|\*)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|\*)$/

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
