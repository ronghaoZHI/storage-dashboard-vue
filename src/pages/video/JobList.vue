<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Button class="button-bsc-add-bucket" type="primary" @click="goJobEdit">创建任务</Button>
            <div>
                <span class="quary-name">管道 : </span>
                <Select v-model="pipeId" style="width:200px" @on-change="listJobsByPipeline">
                    <Option v-for="item in pipes" :value="item.Id" :key="item.Id">{{ item.Name }}</Option>
                </Select>
            </div>
        </div>
        <Table border :context="self" :stripe="true" :highlight-row="true" :columns="listHeader" :data="jobList" :no-data-text='$t("STORAGE.NO_LIST")'></Table>
        <div class="section-paging">
            <Tooltip :content='$t("STORAGE.HOME_PAGE")' placement="top"><Button v-show="pageToken.length > 0" @click="listJobsByPipeline(pipeId);pageToken.length = 0" type="ghost"><Icon type="home" size="18"></Icon></Button></Tooltip>
            <Tooltip :content='$t("STORAGE.PRE_PAGE")' placement="top"><Button v-show="pageToken.length > 0" @click="previousPage" type="ghost"><Icon type="arrow-left-b" size="18"></Icon></Button></Tooltip>
            <Tooltip :content='$t("STORAGE.NEXT_PAGE")' placement="top"><Button v-show="nextPageToken" @click="nextPage" type="ghost"><Icon type="arrow-right-b" size="18"></Icon></Button></Tooltip>
        </div>
    </div>
</template>
<script>
import { transcoder } from '@/service/Aws'
import { listPipelines, getTemplateInfo } from '@/pages/video/data'
export default {
    data () {
        return {
            iconSize: 18,
            self: this,
            jobList: [],
            pipes: [],
            pipeId: '',
            nextPageShow: false,
            pageToken: [],
            nextPageToken: '',
            listHeader: [{
                title: '转码ID',
                width: 100,
                key: 'Id'
            }, {
                title: '输出文件名',
                width: 300,
                render: (h, params) => {
                    return h('div', params.row.outputNames.map(item => h('Tag', {
                        props: {
                            type: 'border'
                        }
                    }, item)))
                }
            }, {
                title: '管道ID',
                width: 100,
                key: 'PipelineId'
            }, {
                title: '转码模版',
                width: 300,
                render: (h, params) => {
                    return h('div', params.row.templates.map(item => h('Tag', {
                        props: {
                            type: 'border'
                        }
                    }, item)))
                }
            }, {
                title: '状态',
                width: 100,
                key: 'Status'
            }, {
                title: '创建时间',
                width: 100,
                key: 'cTime'
            }, {
                title: '操作',
                key: 'actions',
                width: 80,
                align: 'right',
                render: (h, params) => {
                    return h('Tooltip', {
                        props: {
                            content: '取消',
                            delay: 1000,
                            placement: 'top'
                        }
                    }, [h('i-button', {
                        props: {
                            size: 'small'
                        },
                        on: {
                            click: () => {
                                this.deleteJobConfirm(params.row)
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
        this.listJobs()
    },
    methods: {
        async listJobs () {
            this.pipes = await listPipelines()
            if (this.pipes.length > 0) {
                this.pipeId = this.pipes[0].Id
                await this.listJobsByPipeline(this.pipeId)
            }
        },
        async listJobsByPipeline (id, pageToken) {
            try {
                this.$Loading.start()
                let res
                if (!pageToken) {
                    res = await transcoder('listJobsByPipeline', {PipelineId: id})
                } else {
                    res = await transcoder('listJobsByPipeline', {PipelineId: id, PageToken: pageToken})
                }
                this.jobList = await convert2Front(res.Jobs)
                this.nextPageToken = res.NextPageToken
                this.$Loading.finish()
            } catch (error) {
                console.log(error)
                this.$Loading.error()
            }
        },
        previousPage () {
            let page = this.pageToken[this.pageToken.length - 2]
            this.pageToken.pop()
            this.listJobsByPipeline(this.pipeId, page)
        },
        nextPage () {
            this.nextPageToken && this.pageToken.push(this.nextPageToken)
            this.listJobsByPipeline(this.pipeId, this.nextPageToken)
        },
        goJobEdit () {
            this.$router.push({ name: 'jobEdit', params: { id: 'none' } })
        },
        async deletePreset (rule) {
            try {
                this.$Loading.start()
                await transcoder('deletePreset', {Id: rule.id})
                this.templateList.splice(rule._index, 1)
                this.$Loading.finish()
                this.$Message.success(this.$t('VIDEO.DELETED_SUCCESSFULLY'))
            } catch (error) {
                this.$Loading.error()
            }
        },
        async createPipe () {
            try {
                this.$Loading.start()
                await transcoder('createPipeline', pipelinesData)
                this.$Loading.finish()
                this.$Message.success('创建成功')
            } catch (error) {
                this.$Loading.error()
            }
        },
        async createJob (job) {
            try {
                this.$Loading.start()
                await transcoder('createJob', createData)
                this.$Loading.finish()
                this.$Message.success('操作成功')
            } catch (error) {
                this.$Loading.error()
            }
        },
        async cancelJob (job) {
            try {
                this.$Loading.start()
                await transcoder('cancelJob', {Id: job.Id})
                this.jobList.splice(job._index, 1)
                this.$Loading.finish()
                this.$Message.success('操作成功')
            } catch (error) {
                this.$Loading.error()
            }
        },
        deleteJobConfirm (job) {
            this.$Modal.confirm({
                content: this.$t('STORAGE.DELETE_CONFIRMED', {fileName: job.name}),
                okText: this.$t('PUBLIC.CONFIRMED'),
                cancelText: this.$t('PUBLIC.CANCLE'),
                onOk: () => this.cancelJob(job)
            })
        }
    }
}

const convert2Front = async (data) => {
    let frontList = []
    if (data && data.length > 0) {
        const templateInfo = await getTemplateInfo()
        data.forEach(item => {
            let front = {}

            front.Id = item.Id
            front.PipelineId = item.PipelineId
            front.Status = item.Status

            let date = new Date(parseInt(item.Timing.SubmittedTimeMillis))
            const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
            front.cTime = `${date.getFullYear()}-${month}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

            front.outputNames = item.Outputs.map(item => {
                return item.Key
            })
            front.templates = item.Outputs.map(item => {
                return `${item.PresetId}:${templateInfo.templateName[item.PresetId]}`
            })

            frontList.push(front)
        })
    }

    return frontList
}
const createData = {
    Inputs: [{
        Key: 'path/source'
    }],
    OutputKeyPrefix: 'path/output',
    Outputs: [{
        Key: 'outputName',
        PresetId: '623',
        SegmentDuration: '20'
    }],
    Snapshots: [{
        Key: 'SnapshotsName',
        Format: 'jpg',
        Time: '1233',
        Interval: '12',
        Number: '1000'
    }],
    PipelineId: '1164000000039767922'
}
const pipelinesData = {
    Name: ' forJob',
    InputBucket: 'policytest',
    OutputBucket: 'policytest',
    ContentConfig: {
        Permissions: [
            {
                GranteeType: 'Group',
                Grantee: 'AllUsers',
                Access: ['FullControl']
            }
        ]
    },
    SuccessCallbackUrl: '',
    FailureCallbackUrl: ''
}
</script>
<style lang="less" scoped>

.quary-name{
    margin-right: 10px;
    font-size: 13px;
    line-height: 32px;
}
</style>

