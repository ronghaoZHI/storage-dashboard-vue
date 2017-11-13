<template>
    <div class="bsc-pipeline-list">
        <div class="layout-bsc-toolbar">
            <Button class="button-bsc-add-bucket" type="primary" @click="goPipelineEdit('none')">{{$t('VIDEO.NEW_PIPELINE')}}</Button>
            <legend-list :data="legendList"></legend-list>
        </div>
        <Table border :context="self" :stripe="true" :columns="listHeader" :data="pipelineList" :no-data-text='$t("STORAGE.NO_LIST")'></Table>
        <div class="section-paging">
            <Tooltip :content='$t("STORAGE.HOME_PAGE")' placement="top"><Button v-show="pageTokenArray.length > 0" @click="listPipelines('');pageTokenArray.length = 0" type="ghost"><Icon type="home" size="18"></Icon></Button></Tooltip>
            <Tooltip :content='$t("STORAGE.PRE_PAGE")' placement="top"><Button v-show="pageTokenArray.length > 0" @click="previousPage()" type="ghost"><Icon type="arrow-left-b" size="18"></Icon></Button></Tooltip>
            <Tooltip :content='$t("STORAGE.NEXT_PAGE")' placement="top"><Button v-show="pageToken" @click="nextPage()" type="ghost"><Icon type="arrow-right-b" size="18"></Icon></Button></Tooltip>
        </div>
    </div>
</template>

<script>
import user from '@/store/modules/user'
import { transcoder } from '@/service/Aws'
import legendList from '@/components/legend/legend'
export default {
    data () {
        return {
            legendList: [{
                legendIcon: 'ios-toggle',
                legendText: this.$t('VIDEO.STATUS')
            }, {
                legendIcon: 'compose',
                legendText: this.$t('PUBLIC.EDIT')
            }, {
                legendIcon: 'ios-trash',
                legendText: this.$t('PUBLIC.DELETE')
            }],
            iconSize: 18,
            self: this,
            pipelineList: [],
            pageToken: '',
            pageTokenArray: [],
            listHeader: [{
                title: this.$t('VIDEO.PIPELINE_ID'),
                key: 'id',
                width: 170
            }, {
                title: this.$t('VIDEO.PIPELINE_NAME'),
                key: 'name',
                width: 120
            }, {
                title: this.$t('VIDEO.INPUT_BUCKET'),
                key: 'input_bucket',
                width: 120
            }, {
                title: this.$t('VIDEO.OUTPUT_BUCKET'),
                key: 'output_bucket',
                width: 120
            }, {
                title: this.$t('VIDEO.PERMISSION_SETTINGS'),
                width: 280,
                render: (h, params) => {
                    return h('Poptip', {
                        style: {
                            padding: '6px 0'
                        },
                        props: {
                            placement: 'right',
                            trigger: 'hover'
                        }
                    }, [h('div', params.row.permission.map(item => h('div', [h('Tag', {
                        props: {
                            type: 'border'
                        }
                    }, `${item.name}:${item.value}`)]))),
                    h('div', {
                        slot: 'content'
                    }, params.row.permissionDetails.map(item => h('p', `${item.name}:${item.value}`)))]
                    )
                }
            }, {
                title: this.$t('VIDEO.ACTIONS'),
                key: 'actions',
                width: 170,
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
                            value: params.row.is_enabled === 'true',
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
                                this.goPipelineEdit(params.row.id)
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
                                this.deletePipelineConfirm(params.row)
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
    components: {
        legendList
    },
    computed: {
        username () {
            return user.state.username
        }
    },
    created () {
        this.listPipelines()
    },
    methods: {
        async listPipelines (pageToken) {
            try {
                this.$Loading.start()
                let res = pageToken ? await transcoder('listPipelines', { PageToken: pageToken }) : await transcoder('listPipelines')
                this.pipelineList = await this.convert2Front(res.Pipelines)
                pageToken && !this.pageTokenArray.includes(pageToken) && this.pageTokenArray.push(pageToken)
                if (res.NextPageToken) {
                    let nextRes = await transcoder('listPipelines', { PageToken: res.NextPageToken })
                    this.pageToken = !nextRes.Pipelines.length ? null : res.NextPageToken
                } else {
                    this.pageToken = null
                }
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
            }
        },
        convert2Front (data) {
            let frontList = []
            data.forEach(item => {
                const permissions = item.ContentConfig.Permissions
                const frontItem = {
                    id: item.Id,
                    name: item.Name,
                    input_bucket: item.InputBucket,
                    output_bucket: item.OutputBucket,
                    is_enabled: item.Status === 'Active' ? 'true' : 'false',
                    permission: [],
                    permissionDetails: []
                }
                frontItem.permission[0] = {name: 'AllUsers', value: '--'}
                frontItem.permission[1] = {name: 'AuthenticatedUsers', value: '--'}
                frontItem.permissionDetails[0] = {name: 'AllUsers', value: '--'}
                frontItem.permissionDetails[1] = {name: 'AuthenticatedUsers', value: '--'}
                _.forEach(permissions, value => {
                    if (value.Grantee === 'AllUsers') {
                        frontItem.permission[0] = {name: value.Grantee, value: value.Access.join()}
                        frontItem.permissionDetails[0] = {name: value.Grantee, value: value.Access.join()}
                    } else if (value.Grantee === 'AuthenticatedUsers') {
                        frontItem.permission[1] = {name: value.Grantee, value: value.Access.join()}
                        frontItem.permissionDetails[1] = {name: value.Grantee, value: value.Access.join()}
                    } else {
                        frontItem.permissionDetails.push({name: value.Grantee, value: value.Access.join()})
                    }
                })
                frontList.push(frontItem)
            })
            return frontList
        },
        previousPage () {
            let pageToken = this.pageTokenArray[this.pageTokenArray.length - 2]
            this.pageTokenArray.pop()
            this.listPipelines(pageToken)
        },
        nextPage () {
            this.listPipelines(this.pageToken)
        },
        goPipelineEdit (id) {
            this.$router.push({ name: 'pipelineEdit', params: { id: id } })
        },
        deletePipelineConfirm (pipeline) {
            this.$Modal.confirm({
                content: this.$t('STORAGE.DELETE_CONFIRMED', { fileName: pipeline.id }),
                okText: this.$t('PUBLIC.CONFIRMED'),
                cancelText: this.$t('PUBLIC.CANCLE'),
                onOk: () => this.deletePipeline(pipeline)
            })
        },
        async deletePipeline (pipeline) {
            try {
                this.$Loading.start()
                await transcoder('deletePipeline', { Id: pipeline.id }, this.$t('VIDEO.PIPELINE_DELETE_ERROR'))
                this.pipelineList.splice(pipeline._index, 1)
                this.$Loading.finish()
                this.$Message.success(this.$t('VIDEO.DELETED_SUCCESSFULLY'))
            } catch (error) {
                this.$Loading.error()
            }
        },
        async changeStatus (data) {
            try {
                this.$Loading.start()
                await transcoder('updatePipelineStatus', { Id: data.id, Status: data.is_enabled === 'true' ? 'Paused' : 'Active' })
                const enable = this.pipelineList[data._index].is_enabled
                this.pipelineList[data._index].is_enabled = enable === 'true' ? 'false' : 'true'
                this.$Loading.finish()
                this.$Message.success(this.$t('VIDEO.SET_UP_SUCCESSFULLY'))
            } catch (error) {
                this.$Loading.error()
                this.$Message.error(this.$t('VIDEO.SET_UP_FAILED'))
            }
        }
    }
}

</script>

<style lang="less" scoped>

@switch-off-color: #aca9a9;

.@{css-prefix}pipeline-list {
    .section-paging {
        .wh(100%,40px);
        .fb(flex-end,center);
        button {
            width: 70px;
            margin-left: 6px;
        }
    }

    .ivu-switch {
        border: 1px solid @switch-off-color;
        background-color: @switch-off-color;
    }

    .ivu-switch-checked {
        border-color: @primary-color;
        background-color: @primary-color;
    }
}
</style>
