<template>
    <div class="bsc-back-source">
        <Button class="button-add-rule" type="primary" @click="show404ModalFunc()">{{$t('STORAGE.ADD_RULE')}}</Button>
        <legend-list class="legend-list" :data="legendList"></legend-list>
        <Table border :context="self" :stripe="true" :columns="list404Header" :data="fetchRuleList" :no-data-text='$t("STORAGE.NO_LIST")'></Table>
        <Modal v-model="show404Modal" :title='$t("STORAGE.BACK_SOURCE")' width="600" class="edit-modal">
            <Form ref="formValidate404" :model="formValidate404" :rules="ruleValidate404" :label-width="100">
                <FormItem :label='$t("STORAGE.SOURCE_MODE")' prop="fetch_mode">
                    <RadioGroup v-model="formValidate404.fetch_mode">
                        <Radio label="fetch_200">{{$t("STORAGE.MIRROR")}}</Radio>
                        <Radio label="fetch_302">{{$t("STORAGE.REDIRECTION")}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem :label='$t("STORAGE.SOURCE_ADDRESS")' prop="domain">
                    <Input v-model="formValidate404.domain" :placeholder='$t("STORAGE.ENTER_SOURCE_DOMAIN")'></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="validate404Rule('formValidate404', isEdit)">{{$t('VIDEO.OK')}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { FETCH_404 } from '@/service/API'
import legendList from '@/components/legend/legend'
export default {
    data () {
        return {
            self: this,
            legendList: [{
                icon: 'ios-toggle',
                text: 'VIDEO.STATUS'
            }, {
                icon: 'compose',
                text: 'PUBLIC.EDIT'
            }, {
                icon: 'ios-trash',
                text: 'PUBLIC.DELETE'
            }],
            isEdit: false,
            editId: '',
            show404Modal: false,
            formValidate404: {
                fetch_mode: '',
                domain: ''
            },
            ruleValidate404: {
                fetch_mode: [
                    { required: true, message: this.$t('STORAGE.MODE_CANNOT_EMPTY'), trigger: 'change' }
                ],
                domain: [
                    { required: true, message: this.$t('STORAGE.ADDRESS_CANNOT_EMPTY'), trigger: 'blur' }
                ]
            },
            fetchRuleList: [],
            list404Header: [{
                title: this.$t('STORAGE.SOURCE_ADDRESS'),
                key: 'domain',
                width: '50%'
            }, {
                title: this.$t('STORAGE.SOURCE_MODE'),
                key: 'fetch_mode',
                width: '30%',
                render: (h, params) => {
                    return h('div', params.row.fetch_mode === 'fetch_200' ? this.$t('STORAGE.MIRROR') : this.$t('STORAGE.REDIRECTION'))
                }
            }, {
                title: this.$t('STORAGE.TABLE_ACTION'),
                key: 'actions',
                width: '20%',
                render: (h, params) => {
                    return h('div', [h('Tooltip', {
                        props: {
                            content: this.$t('VIDEO.STATUS'),
                            delay: 500,
                            placement: 'top'
                        },
                        'class': {
                            'mar-r-8': true
                        }
                    }, [h('i-switch', {
                        props: {
                            value: params.row.is_active === 1,
                            size: 'large'
                        },
                        on: {
                            input: () => {
                                this.changeStatus(params.row)
                            }
                        }
                    }, [h('span', {
                        slot: 'open'
                    }, this.$t('VIDEO.OPEN')), h('span', {
                        slot: 'close'
                    }, this.$t('VIDEO.CLOSE'))])]), h('Tooltip', {
                        props: {
                            content: this.$t('PUBLIC.EDIT'),
                            delay: 500,
                            placement: 'top'
                        },
                        'class': {
                            'mar-r-8': true
                        }
                    }, [h('i-button', {
                        props: {
                            size: 'small'
                        },
                        on: {
                            click: () => {
                                this.edit404Rule(params.row)
                            }
                        }
                    }, [h('Icon', {
                        props: {
                            type: 'compose',
                            size: this.iconSize
                        }
                    })])]), h('Tooltip', {
                        props: {
                            content: this.$t('PUBLIC.DELETE'),
                            delay: 500,
                            placement: 'top'
                        }
                    }, [h('i-button', {
                        props: {
                            size: 'small'
                        },
                        on: {
                            click: () => {
                                this.delete404RuleConfirm(params.row)
                            }
                        }
                    }, [h('Icon', {
                        props: {
                            type: 'ios-trash',
                            size: this.iconSize
                        }
                    })])])])
                }
            }],
            iconSize: 16
        }
    },
    components: {legendList},
    computed: {
        bucket () {
            return this.$route.params.bucket
        }
    },
    created () {
        this.list404Rules()
    },
    methods: {
        async list404Rules () {
            let rule = {
                action: 'list',
                bucket: this.bucket
            }
            try {
                this.$Loading.start()
                let fetchData = await this.$http.post(FETCH_404, rule)
                this.fetchRuleList = this.convert2Front(fetchData)
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
            }
        },
        convert2Front (data) {
            let frontList = []
            data.forEach(value => {
                const frontItem = {
                    fetch_mode: value.fetch_mode,
                    domain: value.domain,
                    is_active: value.is_active,
                    id: value.id
                }
                frontList.push(frontItem)
            })
            return frontList
        },
        show404ModalFunc () {
            this.show404Modal = true
            this.formValidate404.fetch_mode = ''
            this.formValidate404.domain = '',
            this.isEdit = false
        },
        validate404Rule (name, isEdit) {
            this.$refs[name].validate((valid) => {
                valid ? this.add404Rule(isEdit) : this.$Message.error(this.$t('STORAGE.FORM_FAIL'))
            })
        },
        async add404Rule (isEdit) {
            let rule = {
                action: !isEdit ? 'add' : 'set',
                bucket: this.bucket,
                id: !isEdit ? '' : this.editId,
                domain: this.formValidate404.domain,
                fetch_mode: this.formValidate404.fetch_mode,
                uri_pattern: '/(.*)'
            }
            try {
                this.$Loading.start()
                await this.$http.post(FETCH_404, rule)
                !isEdit ? this.$Message.success(this.$t('STORAGE.CREATE_SUCCESS')) : this.$Message.success(this.$t('STORAGE.SET_SUCCESS'))
                this.show404Modal = false
                this.list404Rules()
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
                !isEdit ? this.$Message.error(this.$t('STORAGE.CREATE_FAIL')) : this.$Message.error(this.$t('STORAGE.SET_FAIL'))
            }
        },
        async changeStatus (row) {
            let rule = {
                action: row.is_active === 1 ? 'unactive' : 'active',
                bucket: this.bucket,
                id: row.id
            }
            try {
                this.$Loading.start()
                await this.$http.post(FETCH_404, rule)
                const active = this.fetchRuleList[row._index].is_active
                if (this.fetchRuleList.length > 1) {
                    this.fetchRuleList.forEach(value => value.is_active = 0)
                }
                this.fetchRuleList[row._index].is_active = active === 1 ? 0 : 1
                this.$Loading.finish()
                this.$Message.success(this.$t('STORAGE.SWITCH_STATE_SUCCESS'))
            } catch (error) {
                this.$Loading.error()
                this.$Message.error(this.$t('STORAGE.SWITCH_STATE_FAIL'))
            }
        },
        async edit404Rule (row) {
            this.show404Modal = true
            this.formValidate404.fetch_mode = this.fetchRuleList[row._index].fetch_mode
            this.formValidate404.domain = this.fetchRuleList[row._index].domain
            this.isEdit = true,
            this.editId = row.id
        },
        delete404RuleConfirm (row) {
            this.$Modal.confirm({
                content: this.$t('STORAGE.COMFIRM_DELETE_404_RULE'),
                okText: this.$t('PUBLIC.CONFIRMED'),
                cancelText: this.$t('PUBLIC.CANCLE'),
                onOk: () => this.delete404Rule(row)
            })
        },
        async delete404Rule (row) {
            let rule = {
                action: 'remove',
                bucket: this.bucket,
                id: row.id
            }
            try {
                this.$Loading.start()
                await this.$http.post(FETCH_404, rule)
                this.fetchRuleList.splice(row._index, 1)
                this.$Loading.finish()
                this.$Message.success(this.$t('STORAGE.DELETE_SUCCESS'))
            } catch (error) {
                this.$Loading.error()
                this.$Message.error(this.$t('STORAGE.DELETE_FAIL'))
            }
        }
    }
}
</script>

<style lang="less" scoped>
.@{css-prefix}back-source {
    .button-add-rule {
        margin-bottom: 10px
    }
    .legend-list {
        float: right
    }
}
</style>
