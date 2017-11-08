<template>
    <div>
        <Button class="button-add-rule" type="primary" @click="show404ModalFunc()">{{$t('STORAGE.ADD_RULE')}}</Button>
        <Table border :context="self" :stripe="true" :columns="list404Header" :data="fetchRuleList" :no-data-text='$t("STORAGE.NO_LIST")'></Table>
        <Modal v-model="show404Modal" title="404回源" width="600" class="edit-modal">
            <Form ref="formValidate404" :model="formValidate404" :rules="ruleValidate404" :label-width="120">
                <FormItem label="回源方式" prop="fetch_mode">
                    <RadioGroup v-model="formValidate404.fetch_mode">
                        <Radio label="fetch_200">镜像回源</Radio>
                        <Radio label="fetch_302">重定向回源</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="回源地址" prop="domain">
                    <Input v-model="formValidate404.domain" placeholder="请填写回源域名"></Input>
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
export default {
    data () {
        return {
            self: this,
            isEdit: false,
            editId: '',
            show404Modal: false,
            formValidate404: {
                fetch_mode: '',
                domain: ''
            },
            ruleValidate404: {
                fetch_mode: [
                    { required: true, message: '回源方式不能为空！', trigger: 'change' }
                ],
                domain: [
                    { required: true, message: '回源地址不能为空！', trigger: 'blur' }
                ]
            },
            fetchRuleList: [],
            list404Header: [{
                title: '回源地址',
                key: 'domain',
                width: 200
            }, {
                title: '回源方式',
                key: 'fetch_mode',
                width: 200,
                render: (h, params) => {
                    return h('div', params.row.fetch_mode === 'fetch_200' ? '镜像回源' : '重定向回源')
                }
            }, {
                title: '操作',
                key: 'actions',
                width: 200,
                align: 'right',
                render: (h, params) => {
                    return h('div', [h('Tooltip', {
                        props: {
                            content: this.$t('VIDEO.STATUS'),
                            delay: 500,
                            placement: 'top'
                        },
                        'class': {
                            'mar-r-5': true
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
                            'mar-r-5': true
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
            }]
        }
    },
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
                valid ? this.add404Rule(isEdit) : this.$Message.error('表单验证失败！')
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
                !isEdit ? this.$Message.success('创建成功！') : this.$Message.success('设置成功！')
                this.show404Modal = false
                this.list404Rules()
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
                !isEdit ? this.$Message.error('创建失败！') : this.$Message.error('设置失败！')
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
                this.$Message.success('切换状态成功！')
            } catch (error) {
                this.$Loading.error()
                this.$Message.error('切换状态失败！')
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
                content: '确定要删除这条404回源规则吗？',
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
                this.$Message.success('删除成功！')
            } catch (error) {
                this.$Loading.error()
                this.$Message.error('删除失败！')
            }
        }
    }
}
</script>

<style>
.button-add-rule {
    margin-bottom: 10px
}
</style>
