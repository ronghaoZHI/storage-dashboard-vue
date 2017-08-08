<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Button class="button-bsc-add-bucket" type="primary" @click="goPipelineEdit('none', 'none')">{{$t('VIDEO.NEW_PIPELINE')}}</Button>
        </div>
        <Table border :context="self" :stripe="true" :highlight-row="true" :columns="listHeader" :data="pipelineList" :no-data-text='$t("STORAGE.NO_LIST")'></Table>
    </div>
</template>

<script>
import user from '@/store/modules/user'
import { transcoder } from '@/service/Aws'
export default {
    data () {
        return {
            iconSize: 18,
            self: this,
            pipelineList: [],
            pageToken: '',
            listHeader: [{
                title: '管道ID',
                key: 'id',
                width: 160
            }, {
                title: '管道名称',
                key: 'name',
                width: 120
            }, {
                title: '输入Bucket',
                key: 'input_bucket',
                width: 120
            }, {
                title: '输出Bucket',
                key: 'output_bucket',
                width: 120
            }, {
                title: '权限设置',
                width: 250,
                render: (h, params) => {
                    return h('Poptip', {
                        props: {
                            placement: 'right',
                            trigger: 'hover'
                        }
                    }, [h('div', params.row.permission.map(item => h('Tag', {
                        props: {
                            type: 'border'
                        }
                    }, `${item.name}:${item.value}`))),
                        h('div', {
                            slot: 'content'
                        }, params.row.permissionDetails.map(item => h('p', `${item.name}:${item.value}`)))]
                    )
                }
            }, {
                title: '状态',
                width: 50,
                render: (h, params) => {
                    if (params.row.is_enabled === 'true') {
                        return h('Icon', {
                            props: {
                                type: 'record',
                                size: '14'
                            },
                            style: {
                                color: '#19be6b'
                            }
                        })
                    } else {
                        return h('Icon', {
                            props: {
                                type: 'record',
                                size: '14'
                            },
                            style: {
                                color: '#ed3f14'
                            }
                        })
                    }
                }
            }, {
                title: '操作',
                key: 'actions',
                width: 150,
                align: 'right',
                render: (h, params) => {
                    return h('div', [h('Tooltip', {
                        props: {
                            content: params.row.is_enabled === 'true' ? this.$t('VIDEO.CLOSE') : this.$t('VIDEO.OPEN'),
                            delay: 1000,
                            placement: 'top'
                        },
                        'class': {
                            'mar-r-5': true
                        }
                    }, [h('i-switch', {
                        props: {
                            value: params.row.is_enabled === 'true'
                        },
                        on: {
                            input: () => {
                                this.changeStatus(params.row)
                            }
                        }
                    })]), h('Tooltip', {
                        props: {
                            content: this.$t('PUBLIC.EDIT'),
                            delay: 1000,
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
                                this.goPipelineEdit(params.row.input_bucket, params.row.id)
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
                            delay: 1000,
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
    computed: {
        username () {
            return user.state.username
        }
    },
    created () {
        this.listPipelines(this.pageToken)
    },
    methods: {
        async listPipelines (pageToken) {
            try {
                this.$Loading.start()
                let res = pageToken ? await transcoder('listPipelines', { PageToken: pageToken }) : await transcoder('listPipelines')
                this.pipelineList = await this.convert2Front(res.Pipelines)
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
                _.forEach(permissions, value => {
                    if (permissionMust.includes(value.Grantee)) {
                        frontItem.permission.push({name: value.Grantee, value: value.Access.join()})
                        frontItem.permissionDetails.push({name: value.Grantee, value: value.Access.join()})
                    } else if (value.Grantee === this.username) {
                        frontItem.permission.push({name: value.Grantee, value: value.Access.join()})
                        frontItem.permissionDetails.push({name: value.Grantee, value: value.Access.join()})
                    } else {
                        frontItem.permissionDetails.push({name: value.Grantee, value: value.Access.join()})
                    }
                })
                frontList.push(frontItem)
            })
            return frontList
        },
        goPipelineEdit (bucket, id) {
            this.$router.push({ name: 'pipelineEdit', params: { bucket: bucket, id: id } })
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
                await transcoder('deletePipeline', { Id: pipeline.id })
                this.pipelineList.splice(pipeline._index, 1)
                this.$Loading.finish()
                this.$Message.success(this.$t('VIDEO.DELETED_SUCCESSFULLY'))
            } catch (error) {
                this.$Loading.error()
                this.$Message.error(this.$t('VIDEO.FAILED_TO_DELETE'))
            }
        },
        async changeStatus (data) {
            try {
                this.$Loading.start()
                await transcoder('updatePipelineStatus', { Id: data.id, Status: data.is_enabled === 'true' ? 'Active' : 'Paused' })
                const enable = this.pipelineList[data._index].is_enabled
                this.pipelineList[data._index].is_enabled = enable === 'true' ? 'false' : 'true'
                this.$Loading.finish()
                this.$Message.success('设置成功')
            } catch (error) {
                this.$Loading.error()
                this.$Message.error('设置失败')
            }
        }
    }
}

const permissionMust = ['AllUsers', 'AuthenticatedUsers']
</script>

<style lang="less" scope>
@import '../../styles/index.less';
</style>
