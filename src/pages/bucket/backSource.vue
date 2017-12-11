<template>
    <div class="bsc-back-source">
        <Button class="button-add-rule" type="primary" @click="show404ModalFunc()">{{$t('STORAGE.ADD_RULE')}}</Button>
        <legend-list class="legend-list" :data="legendList"></legend-list>
        <p class="page-info">{{$t('SETTINGS.BACK_SOURCE_INFO')}}</p>
        <Table border :context="self" :stripe="true" :columns="list404Header" :data="fetchRuleList" :no-data-text='$t("STORAGE.NO_LIST")'></Table>
        <Modal v-model="show404Modal" :title='$t("STORAGE.BACK_SOURCE")' width="650" class="edit-modal">
            <Form ref="formValidate404" :model="formValidate404" :rules="ruleValidate404" :label-width="150">
                <FormItem :label='$t("STORAGE.SOURCE_MODE")' prop="fetch_mode">
                    <RadioGroup v-model="formValidate404.fetch_mode">
                        <Radio label="fetch_200">200
                            <Tooltip>
                                <Icon type="ios-help-outline"></Icon>
                                <div slot="content">
                                    <p style="white-space: normal !important;">{{$t("SETTINGS.FETCH_200_INFO")}}</p>
                                </div>
                            </Tooltip>
                        </Radio>
                        <Radio label="fetch_302">302
                            <Tooltip>
                                <Icon type="ios-help-outline"></Icon>
                                <div slot="content">
                                    <p style="white-space: normal !important;">{{$t("SETTINGS.FETCH_302_INFO")}}</p>
                                </div>
                            </Tooltip>
                        </Radio>
                        <Radio label="fetch_404">404
                            <Tooltip>
                                <Icon type="ios-help-outline"></Icon>
                                <div slot="content">
                                    <p style="white-space: normal !important;">{{$t("SETTINGS.FETCH_404_INFO")}}</p>
                                </div>
                            </Tooltip>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <div class="form-item" v-show="formValidate404.fetch_mode !== 'fetch_302'">
                    <span class="form-label">{{$t("STORAGE.SOURCE_HEADER")}}</span>
                    <Input v-model="requestHeader" class="line-width" style="width:400px" placeholder="Host:www.example.com" @on-enter="addHeaderTag()"></Input>
                    <p class="style-error-info redFont" v-if="requestHeader && requestHeaderFormatError">{{$t('STORAGE.CORRECT_FORMAT_HEADER')}}</p>
                    <p class="style-error-info redFont" v-if="requestHeader && !requestHeaderFormatError">{{$t('STORAGE.PRESS_ENTER_KEY')}}</p>
                    <p class="info">{{$t('STORAGE.ENTER_KEY')}}</p>
                    <div class="tag-margin-left">
                        <Tag type="border" color="blue" v-for="item in formValidate404.request_headers" :key="item" :name="item" closable @on-close="deleteHeaderTag(item)">{{item}}</Tag>
                    </div>
                </div>
                <FormItem :label='$t("STORAGE.SOURCE_DOMAIN")' prop="domain">
                    <Input v-model="formValidate404.domain" style="width:400px" :placeholder="$t('STORAGE.ONLY_HTTP_HTTPS')"></Input>
                    <p class="redFont" v-if="domainError">{{$t('STORAGE.ONLY_HTTP_HTTPS')}}</p>
                </FormItem>
                <FormItem :label='$t("STORAGE.URI_PATTERN")' prop="uri_pattern">
                    <Input v-model="formValidate404.uri_pattern" style="width:400px" placeholder="/(.*)"></Input>
                    <Tooltip placement="bottom-end">
                        <Icon type="ios-help-outline" style="width:30px;padding-left:4px;"></Icon>
                        <div slot="content">
                            <p style="white-space: normal !important;">{{$t("SETTINGS.URI_PATTERN_INFO")}}</p>
                        </div>
                    </Tooltip>
                </FormItem>
                <FormItem :label='$t("STORAGE.ALLOW_METHOD")' prop="allow_method">
                    <CheckboxGroup v-model="formValidate404.allow_method">
                        <Checkbox label="GET"></Checkbox>
                        <Checkbox label="HEAD"></Checkbox>
                    </CheckboxGroup>
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
                request_headers: [],
                domain: '',
                uri_pattern: '',
                allow_method: []
            },
            requestHeader: '',
            requestHeaderFormatError: false,
            domainError: false,
            ruleValidate404: {
                fetch_mode: [
                    { required: true, message: this.$t('STORAGE.MODE_CANNOT_EMPTY'), trigger: 'change' }
                ],
                domain: [
                    { required: true, message: this.$t('STORAGE.DOMAIN_CANNOT_EMPTY'), trigger: 'blur change' },
                    { type: 'url', message: this.$t('STORAGE.ENTER_CORRECT_DOMAIN'), trigger: 'blur' }
                ],
                allow_method: [
                    { required: true, type: 'array', min: 1, message: this.$t('STORAGE.ALLOW_METHOD_CANNOT_EMPTY'), trigger: 'change' }
                ]
            },
            fetchRuleList: [],
            list404Header: [{
                title: this.$t('STORAGE.SOURCE_MODE'),
                key: 'fetch_mode',
                width: 120,
                render: (h, params) => {
                    return h('div', params.row.fetch_mode === 'fetch_200' ? 200 : params.row.fetch_mode === 'fetch_302' ? 302 : 404)
                }
            }, {
                title: this.$t('STORAGE.SOURCE_HEADER'),
                key: 'request_headers',
                width: 160,
                render: (h, params) => {
                    return h('div', {style: {padding: '8px 0'}}, _.map(params.row.request_headers, (value, key) => [h('div', {style: {margin: '2px 0'}}, `${key}:${value}`)]), h('br'))
                }
            }, {
                title: this.$t('STORAGE.SOURCE_DOMAIN'),
                key: 'domain',
                width: 160
            }, {
                title: this.$t('STORAGE.URI_PATTERN'),
                key: 'uri_pattern',
                width: 160
            }, {
                title: this.$t('STORAGE.ALLOW_METHOD'),
                key: 'allow_method',
                width: 160
            }, {
                title: this.$t('STORAGE.TABLE_ACTION'),
                key: 'actions',
                width: 160,
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
    watch: {
        'requestHeader' (to, from) {
            this.requestHeaderFormatError = !(to.split(':').length && to.split(':')[0] && to.split(':')[1])
        },
        'formValidate404.domain' (to, from) {
            this.domainError = this.formValidate404.domain && !this.formValidate404.domain.match('http')
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
                this.fetchRuleList = await this.$http.post(FETCH_404, rule)
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
            }
        },
        addHeaderTag () {
            if (!this.requestHeaderFormatError) {
                this.formValidate404.request_headers.push(this.requestHeader)
                this.requestHeader = ''
            }
        },
        deleteHeaderTag (value) {
            const index = this.formValidate404.request_headers.indexOf(value)
            this.formValidate404.request_headers.splice(index, 1)
        },
        show404ModalFunc () {
            this.show404Modal = true
            this.formValidate404 = {
                fetch_mode: '',
                request_headers: [],
                domain: '',
                uri_pattern: '',
                allow_method: []
            }
            this.isEdit = false
        },
        validate404Rule (name, isEdit) {
            this.$refs[name].validate((valid) => {
                valid ? this.add404Rule(isEdit) : this.$Message.error(this.$t('STORAGE.FORM_FAIL'))
            })
        },
        async add404Rule (isEdit) {
            if (this.domainError) return
            let rule = {
                action: !isEdit ? 'add' : 'set',
                bucket: this.bucket,
                id: !isEdit ? '' : this.editId,
                fetch_mode: this.formValidate404.fetch_mode,
                request_headers: {},
                domain: this.formValidate404.domain,
                uri_pattern: this.formValidate404.uri_pattern ? this.formValidate404.uri_pattern : '/(.*)',
                allow_method: this.formValidate404.allow_method.join()
            }
            if (rule.fetch_mode !== 'fetch_302' && this.formValidate404.request_headers.length > 0) {
                this.formValidate404.request_headers.forEach(value => {
                    rule.request_headers[value.split(':')[0]] = value.split(':')[1]
                })
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
        edit404Rule (row) {
            this.show404Modal = true
            this.formValidate404.fetch_mode = this.fetchRuleList[row._index].fetch_mode
            if (this.fetchRuleList[row._index].request_headers) {
                this.formValidate404.request_headers = []
                _.forEach(this.fetchRuleList[row._index].request_headers, (value, key) => {
                    this.formValidate404.request_headers.push(`${key}:${value}`)
                })
            }
            this.formValidate404.domain = this.fetchRuleList[row._index].domain
            this.formValidate404.uri_pattern = this.fetchRuleList[row._index].uri_pattern
            this.formValidate404.allow_method = this.fetchRuleList[row._index].allow_method.split(',')
            this.isEdit = true,
            this.editId = row.id
        },
        delete404RuleConfirm (row) {
            this.$Modal.confirm({
                content: this.$t('STORAGE.COMFIRM_DELETE_404_RULE'),
                okText: this.$t('PUBLIC.CONFIRMED'),
                cancelText: this.$t('PUBLIC.CANCLE'),
                title: this.$t('PUBLIC.DELETE'),
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
        margin-bottom: 8px
    }
    .legend-list {
        float: right
    }
    .page-info {
        margin-bottom: 8px
    }
}
.bsc-radio-wrapper {
    margin-right: 20px;
}
.bsc-checkbox-wrapper {
    margin-right: 30px;
}
.edit-modal {
    .form-item {
        .form-label {
            width: 145px
        }
        .style-error-info {
            margin: 5px 0 5px 148px
        }
        .info {
            margin: 5px 0 5px 148px
        }
        .tag-margin-left {
            margin-left: 148px
        }
    }
}
</style>
