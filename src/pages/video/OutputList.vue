<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Button class="button-bsc-add-bucket" type="primary" @click="goOutputEdit('none', 'none')">{{$t('VIDEO.NEW_CONFIGURATION')}}</Button>
        </div>
        <Table border :context="self" :stripe="true" :highlight-row="true" :columns="listHeader" :data="policyFront" :no-data-text='$t("STORAGE.NO_LIST")'></Table>
    </div>
</template>
<script>
import { getBucketList } from '@/service/Data'
import { getBucketPolicy, putBucketPolicy, getTranscodes } from '@/pages/video/data'
export default {
    data () {
        return {
            iconSize: 18,
            self: this,
            policyFront: this.policyFront,
            listHeader: [{
                title: 'ID',
                key: 'id',
                width: 165
            }, {
                title: 'Status',
                width: 75,
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
                title: 'Input Bucket',
                width: 150,
                key: 'input_bucket'
            }, {
                title: 'Output Bucket',
                width: 150,
                key: 'output_bucket'
            }, {
                title: 'Keys Regex',
                width: 200,
                render: (h, params) => {
                    if (params.row.allowed_keys_regex.length > 0) {
                        return params.row.allowed_keys_regex.map(regex => h('p', `${regex}`))
                    }
                }
            }, {
                title: 'Output key prefix',
                key: 'actions',
                width: 150,
                render: (h, params) => {
                    return h('p', [params.row.output_key_prefix])
                }
            }, {
                title: 'Outputs',
                width: 170,
                render: (h, params) => {
                    if (params.row.outputs && params.row.outputs.length > 0) {
                        return params.row.outputs.map(item => {
                            const sd = item.segment_duration || '-'
                            return h('p', [`keySuffix:${item.key_suffix},`, h('br'), `${this.$t('VIDEO.VIDEO_TRANSCODING_TEMPLATE_ID')}:${item.preset_id},`, h('br'), `${this.$t('VIDEO.HLS_SLICE_LENGTH')}:${sd},`, h('br')])
                        })
                    }
                }
            }, {
                title: 'Actions',
                key: 'actions',
                width: 120,
                align: 'right',
                render: (h, params) => {
                    return h('div', [h('Tooltip', {
                        props: {
                            content: params.row.is_enabled === 'true' ? this.$t('VIDEO.CLOSE') : this.$t('VIDEO.OPEN'),
                            delay: 1000,
                            placement: 'top'
                        }
                    }, [h('i-button', {
                        props: {
                            size: 'small'
                        },
                        on: {
                            click: () => {
                                this.changeStatus(params.row)
                            }
                        }
                    }, [h('Icon', {
                        props: {
                            type: params.row.is_enabled === 'true' ? 'ios-locked' : 'ios-unlocked',
                            size: this.iconSize
                        }
                    })])]), h('Tooltip', {
                        props: {
                            content: this.$t('PUBLIC.EDIT'),
                            delay: 1000,
                            placement: 'top'
                        }
                    }, [h('i-button', {
                        props: {
                            size: 'small'
                        },
                        on: {
                            click: () => {
                                this.goOutputEdit(params.row.input_bucket, params.row.id)
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
                                this.deletePolicyConfirm(params.row)
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
    mounted () {
        this.listPolify()
    },
    methods: {
        async listPolify () {
            const bucketNames = await this.getBucketNames()
            try {
                this.$Loading.start()
                let polifyList = await Promise.all(bucketNames.map(bucket => {
                    return getBucketPolicy(bucket)
                }))
                this.policyFront = this.convert2Front(polifyList)
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
                this.$Message.error(error)
            }
        },
        async getBucketNames () {
            let res = await getBucketList()
            return _.map(res.Buckets, bucket => bucket.Name)
        },
        convert2Front (data) {
            let front = []
            data.map(item => {
                if (item.data) {
                    const policy = JSON.parse(item.data.Policy)
                    const transcode = policy.post_upload_transcoding
                    if (transcode && transcode.length > 0) {
                        transcode.forEach(setting => {
                            setting.input_bucket = item.bucket
                        })
                        front.push(...transcode)
                    }
                }
            })
            return front
        },
        deletePolicyConfirm (policy) {
            this.$Modal.confirm({
                content: this.$t('STORAGE.DELETE_CONFIRMED', {fileName: policy.id}),
                okText: this.$t('PUBLIC.CONFIRMED'),
                cancelText: this.$t('PUBLIC.CANCLE'),
                onOk: () => this.deletePolicy(policy.input_bucket, policy.id, policy._index)
            })
        },
        async deletePolicy (bucket, id, index) {
            try {
                this.$Loading.start()
                let trans = await getTranscodes(bucket)
                if (trans) {
                    let newData = trans.filter(item => {
                        return item.id !== id
                    })
                    await putBucketPolicy(bucket, newData)
                }
                this.policyFront.splice(index, 1)
                this.$Message.success(this.$t('VIDEO.DELETED_SUCCESSFULLY'))
            } catch (error) {
                console.log(error)
                this.$Message.error(this.$t('VIDEO.FAILED_TO_DELETE'))
            }
        },
        async changeStatus (data) {
            this.$Loading.start()
            const bucket = data.input_bucket
            const id = data.id
            try {
                let trans = await getTranscodes(bucket)
                if (trans) {
                    trans.forEach(item => {
                        if (item.id === id) {
                            item.is_enabled = item.is_enabled === 'true' ? 'false' : 'true'
                        }
                    })
                    await putBucketPolicy(bucket, trans)
                    const enable = this.policyFront[data._index].is_enabled
                    this.policyFront[data._index].is_enabled = enable === 'true' ? 'false' : 'true'
                }
                this.$Message.success(this.$t('VIDEO.SET_UP_SUCCESSFULLY'))
            } catch (error) {
                this.$Message.error(this.$t('VIDEO.SET_UP_FAILED'))
            }
        },
        goOutputEdit (bucket, id) {
            this.$router.push({ name: 'outputEdit', params: { bucket: bucket, id: id } })
        }
    }
}

</script>
<style lang="less" scoped>
@import '../../styles/index.less';

</style>

