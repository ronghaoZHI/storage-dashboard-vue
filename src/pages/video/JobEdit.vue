<template>
    <div class="bsc-job-edit bsc-edit">
        <div class="layout-bsc-toolbar">
            <Breadcrumb>
                <Breadcrumb-item href="/video/JobList">主动转码配置</Breadcrumb-item>
                <Breadcrumb-item>新建转码</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <div class="section-separator">
                <div class="separator-body">
                    <span class="separator-icon"></span>
                    <span class="separator-info">基础配置</span>
                </div>
            </div>
            <div class="form-item">
                <span class="form-label">转码管道 : </span>
                <Select v-model="job.PipelineId" class="line-width" @on-change="pipeChange">
                    <Option v-for="item in pipes" :value="item.Id" :key="item.Id">{{ item.Name }}</Option>
                </Select>
            </div>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <div class="section-separator">
                <div class="separator-body">
                    <span class="separator-icon"></span>
                    <span class="separator-info">{{$t('VIDEO.INPUT_CONFIGURATION')}}</span>
                </div>
            </div>
            <div class="form-item">
                <span class="form-label">源文件名 : </span>
                <div class="section-search">
                    <span class="bsc-input">
                        <input type="text" v-model="searchValue" />
                        <Button type="text" size="small" @click="getFiles(searchValue)"><Icon type="search" :size="iconSize"></Icon></Button>
                    </span>
                </div>
                <p class="style-name-info" v-if="fileInfo">文件数大于50请使用搜索(前缀匹配)</p>
            </div>
            <div class="form-item">
                <span class="form-label"></span>
                <Select v-model="job.Inputs[0].Key" class="line-width">
                    <Option v-for="file in fileList" :value="file.Key" :key="file.Key">{{ file.Key }}</Option>
                </Select>
            </div>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <div class="section-separator">
                <div class="separator-body">
                    <span class="separator-icon"></span>
                    <span class="separator-info">{{$t('VIDEO.OUTPUT_CONFIGURATION')}}</span>
                </div>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.OUTPUT_FILE_KEY_PREFIX')}} : </span>
                <Input v-model="job.OutputKeyPrefix" :placeholder='$t("VIDEO.OUTPUT_FILE_KEY_PREFIX")' class="line-width"></Input>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.OUTPUT_RULES')}} : </span>
                <div class="table-box line-width">
                    <Table border size='small' :context="self" :stripe="true" :columns="outputsHeader" :data="job.Outputs" :no-data-text='$t("VIDEO.AT_LEAST_ONE_RULE")'></Table>
                </div>
                <br>
·                <p class="style-name-info redFont" v-if="HLSError">{{$t('VIDEO.AUTO_OUTPUT_RULES_DESCRIPTION')}}</p>
                <Button class="button-add-item" shape="circle" icon="plus" type="primary" size="small" @click="addOutput">{{$t('VIDEO.ADD')}}</Button>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.VIDEO_SCREENSHOTS_RULES')}} : </span>
                <div class="table-box line-width">
                    <Table border size='small' :context="self" :stripe="true" :columns="shotsHeader" :data="job.Snapshots" :no-data-text='$t("VIDEO.AT_LEAST_ONE_RULE")'></Table>
                </div>
                <br>
                <p class="style-name-info redFont" v-if="osError">{{$t('VIDEO.AT_LEAST_ONE_RULE')}}</p>
                <Button class="button-add-item" shape="circle" icon="plus" type="primary" size="small" @click="addShot">{{$t('VIDEO.ADD')}}</Button>
            </div>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <div class="section-separator">
                <div class="separator-body">
                    <span class="separator-icon"></span>
                    <span class="separator-info">{{$t('VIDEO.MASTER_PLAYLIST_CONFIGURATION')}}</span>
                </div>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.WHETHER_TO_OPEN')}} : </span>
                <i-switch v-model="MPOpen">
                    <span slot="open">{{$t('VIDEO.ON')}}</span>
                    <span slot="close">{{$t('VIDEO.OFF')}}</span>
                </i-switch>
            </div>
            <div class="form-item" v-if="MPOpen">
                <span class="form-label">{{$t('VIDEO.SLICE_FORMAT')}} : </span>
                <Radio-group v-model="job.Playlists.Format">
                    <Radio key="HLSv3" label='HLSv3'>HLSv3</Radio>
                </Radio-group>
            </div>
            <div class="form-item" v-if="MPOpen">
                <span class="form-label">MasterPlaylist文件名 : </span>
                <Input v-model="job.Playlists.Name" placeholder="MasterPlaylist" class="line-width"></Input>
                <p class="style-name-info redFont" v-if="MPNameError">{{$t('VIDEO.MP_NAME_INFO')}}</p>
            </div>
            <div class="form-item" v-if="MPOpen">
                <span class="form-label">输出文件名 : </span>
                <Select v-model="job.Playlists.OutputKeys" multiple class="line-width">
                    <Option v-for="ots in MPNames" :value="ots" :key="ots">{{ ots }}</Option>
                </Select>
            </div>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <Button class="button-bsc-add-bucket" type="primary" @click="beforeSubmit" :disabled="sbumitDisabled">{{$t('VIDEO.SAVE')}}</Button>
        </div>
        <Modal v-model="showOutputsModal" :title='$t("VIDEO.OUTPUT_RULES")' width="700" class="my-modal">
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.TRANSCODING_TEMPLATE')}} : </span>
                <Select v-model="outputModal.PresetId" class="line-width" @on-change="templateChange" filterable>
                    <Option v-for="template in templateInfo.templateList" :value="template.Id" :key="template.Id">{{template.Name}}</Option>
                </Select>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t("VIDEO.OUTPUT_FILE_NAME")}} : </span>
                <Input v-model="outputModal.Key" :placeholder='$t("VIDEO.OUTPUT_FILE_NAME")' class="line-width"></Input>
            </div>
            <div class="form-item" v-if="HLSShow" >
                <span class="form-label">{{$t('VIDEO.HLS_SLICE_LENGTH')}} : </span>
                <Slider v-model="outputModal.SegmentDuration" :min='0' :max='50' class="my-slider"></Slider>
                <Input-number :min='0' :max='50' v-model="outputModal.SegmentDuration"></Input-number>
                <p class="style-name-info redFont" v-if="outputsDisabled">{{$t('VIDEO.HLS_SLICE_LENGTH_CANNOT_BE_0')}}</p>
            </div>
            <div style="height:90px;"></div>
            <div slot="footer" class="copy-modal-footer">
                <Button type="primary" @click="updateOutputs" :disabled="outputsDisabled">{{$t('VIDEO.OK')}}</Button>
            </div>
        </Modal>
        <Modal v-model="showShotsModal" :title='$t("VIDEO.SNAPSHOTS_RULES")' width="700" class="my-modal">
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.OUTPUT_FILE_NAME_SUFFIX')}} : </span>
                <Input v-model="shotModal.Key" :placeholder='$t("VIDEO.OUTPUT_FILE_NAME_SUFFIX")' style="width:160px;"></Input>
                <Select v-model="shotModal.Format" style="width:100px;display:inline-block">
                    <Option v-for="format in formatList" :value="format" :key="format">{{format}}</Option>
                </Select>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.SCREENSHOT_START_TIME')}} : </span>
                <Input-number :min='1' v-model="shotModal.Time"></Input-number> S
            </div>
           <div class="form-item">
                <span class="form-label">{{$t('VIDEO.SCREENSHOT_INTERVAL')}} : </span>
                <Input-number :min='1' v-model="shotModal.Interval"></Input-number> S
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.SCREENSHOT_MAX_NUMBER')}} : </span>
                <Input-number :min='1' v-model="shotModal.Number"></Input-number>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.RESOLUTION')}} : </span>
                <Radio-group v-model="shotModal.Resolution">
                    <Radio label="auto">{{$t('VIDEO.UNALTERED')}}</Radio>
                    <Radio label="value"></Radio>
                </Radio-group>
                <Input-number :min='1' v-model="shotModal.width" :disabled="shotModal.Resolution === 'auto'" :placeholder='$t("VIDEO.WIDTH")'></Input-number>
                <Input-number :min='1' v-model="shotModal.height" :disabled="shotModal.Resolution === 'auto'" :placeholder='$t("VIDEO.HEIGHT")'></Input-number>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.ASPECT_RATIO')}} : </span>
                <Radio-group v-model="shotModal.AspectRatio">
                    <Radio v-for='asp in aspectRatioList' :key="asp.value" :label='asp.value'>{{asp.name}}</Radio>
                </Radio-group>
            </div>
            <div slot="footer" class="copy-modal-footer">
                <Button type="primary" @click="updateShots">{{$t('VIDEO.OK')}}</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import InputNumber from '@/components/input-number/input-number.vue'
import { listPipelines, getTemplateInfo } from '@/pages/video/data'
import { transcoder, handler } from '@/service/Aws'

export default {
    data () {
        return {
            iconSize: 18,
            self: this,
            pipes: [],
            job: _.cloneDeep(jobDefult),
            showOutputsModal: false,
            showShotsModal: false,
            fileModelShow: false,
            outputModal: _.clone(outputsDefult),
            shotModal: _.clone(shotDefult),
            HLSShow: false,
            HLSError: false,
            pipeInputBucket: '',
            formatList: ['png', 'jpg'],
            templateInfo: {},
            MPOpen: false,
            MPNames: [],
            fileList: [],
            fileInfo: false,
            searchValue: '',
            aspectRatioList: [{name: this.$t('VIDEO.UNALTERED'), value: 'auto'}, {name: '1:1', value: '1:1'}, {name: '4:3', value: '4:3'}, {name: '3:2', value: '3:2'}, {name: '16:9', value: '16:9'}],
            outputsHeader: [{
                title: '输出文件名',
                key: 'Key',
                width: 120
            }, {
                title: this.$t('VIDEO.TRANSCODING_TEMPLATE'),
                key: 'template',
                width: 100
            }, {
                title: this.$t('VIDEO.HLS_SLICE_LENGTH'),
                width: 100,
                key: 'SegmentDuration'
            }, {
                title: 'Actions',
                key: 'actions',
                width: 100,
                align: 'right',
                render: (h, params) => {
                    return h('div', [h('Tooltip', {
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
                                this.editOutput(params.row._index)
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
                                this.deleteOutput(params.row._index)
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
            shotsHeader: [{
                title: this.$t('VIDEO.OUTPUT_FILE_NAME_SUFFIX'),
                key: 'Key',
                width: 140
            }, {
                title: this.$t('VIDEO.FORMAT'),
                key: 'Format',
                width: 70
            }, {
                title: this.$t('VIDEO.SCREENSHOT_START_TIME_SECOND'),
                width: 160,
                key: 'Time'
            }, {
                title: this.$t('VIDEO.SCREENSHOT_INTERVAL_SECOND'),
                width: 140,
                key: 'Interval'
            }, {
                title: this.$t('VIDEO.SCREENSHOT_MAX_NUMBER'),
                width: 120,
                key: 'Number'
            }, {
                title: this.$t('VIDEO.SCREENSHOT_RESOLUTION'),
                width: 100,
                key: 'Resolution'
            }, {
                title: this.$t('VIDEO.ASPECT_RATIO'),
                width: 80,
                key: 'AspectRatio'
            }, {
                title: 'Actions',
                key: 'actions',
                width: 100,
                align: 'right',
                render: (h, params) => {
                    return h('div', [h('Tooltip', {
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
                                this.editShot(params.row._index)
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
                                this.deleteShot(params.row._index)
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
        outputsDisabled () {
            return this.isTS(this.outputModal.PresetId) && this.outputModal.SegmentDuration === 0 && this.MPOpen
        },
        sbumitDisabled () {
            return this.regError || this.MPNameError
        },
        MPNameError () {
            return this.MPOpen && !this.job.Playlists.Name
        },
        osError () {
            return this.job.Snapshots.length === 0 && this.job.Outputs.length === 0
        }
    },
    components: { InputNumber },
    created () {
        this.createdMethods()
    },
    methods: {
        async createdMethods () {
            this.pipes = await listPipelines()
            this.job.PipelineId = this.pipes[0].Id
            this.pipeInputBucket = this.pipes[0].InputBucket
            this.templateInfo = await getTemplateInfo()
            this.getFiles()
        },
        async beforeSubmit () {
            let segments = []
            let segmentsSet = new Set()

            if (!this.job.Inputs[0].Key) {
                this.$Message.warning('请选择输入源文件')
                return
            }
            if (this.MPOpen) {
                this.job.Outputs.forEach(item => {
                    if (this.isTS(item.PresetId)) {
                        segments.push(item.SegmentDuration || 0)
                        segmentsSet.add(item.SegmentDuration || 0)
                    }
                })
                if (segments.length === 0) {
                    this.$Message.warning(this.$t('VIDEO.ADAPTIVE_EXIST_TS_FORMAT'))
                    this.HLSError = true
                    return
                }
                if (segmentsSet.size !== 1) {
                    this.$Message.warning(this.$t('VIDEO.ADAPTIVE_HLS_SLICE_LENGTH_CONSISTENT'))
                    this.HLSError = true
                    return
                } else if (segments[0] === 0) {
                    this.$Message.warning(this.$t('VIDEO.ADAPTIVE_HLS_SLICE_LENGTH_CANNOT_BE_0'))
                    this.HLSError = true
                    return
                }
            }

            if (this.osError) {
                this.$Message.warning(this.$t('VIDEO.AT_LEAST_ONE_RULE'))
                return
            }
            let saved = await this.convert2Save(this.job)
            this.createJob(saved)
        },
        async createJob (job) {
            try {
                this.$Loading.start()
                await transcoder('createJob', job)
                this.$Loading.finish()
                this.$Message.success('操作成功')
            } catch (error) {
                this.$Loading.error()
            }
        },
        convert2Save (data) {
            const front = _.clone(data)
            let saved = _.clone(data)

            if (data.Outputs.length === 0) {
                delete saved.Outputs
            } else {
                saved.Outputs = front.Outputs.map(item => {
                    let res = _.clone(item)
                    if (item.SegmentDuration && item.SegmentDuration !== 0) {
                        res.SegmentDuration = item.SegmentDuration.toString()
                    } else {
                        delete res.SegmentDuration
                    }
                    delete res.template
                    return res
                })
            }
            if (data.Snapshots.length === 0) {
                delete saved.Snapshots
            } else {
                saved.Snapshots = front.Snapshots.map(item => {
                    let res = _.clone(item)
                    res.Interval = item.Interval.toString()
                    res.Number = item.Number.toString()
                    res.Time = item.Time.toString()
                    return res
                })
            }

            if (!this.MPOpen) {
                delete saved.Playlists
            } else {
                saved.Playlists = [{...front.Playlists}]
            }
            return saved
        },
        async addOutput () {
            this.outputModal = _.clone(outputsDefult)
            this.outputIndex = this.job.Outputs.length
            this.showOutputsModal = true
            this.HLSError = false
        },
        editOutput (index) {
            this.outputIndex = index
            this.outputModal = _.clone(this.job.Outputs[index])
            this.outputModal.SegmentDuration = parseInt(this.outputModal.SegmentDuration)
            if (this.isTS(this.outputModal.PresetId)) {
                this.HLSShow = true
            } else {
                this.HLSShow = false
            }
            this.showOutputsModal = true
            this.HLSError = false
        },
        updateOutputs () {
            const ln = this.job.Outputs.length
            this.outputModal.template = `${this.outputModal.PresetId}+${this.templateInfo.templateName[this.outputModal.PresetId]}`
            if (this.outputIndex === ln) {
                this.job.Outputs.push(this.outputModal)
            } else {
                this.job.Outputs.splice(this.outputIndex, 1, this.outputModal)
            }
            this.showOutputsModal = false
            this.updateMPNames(this.job.Outputs)
        },
        deleteOutput (index) {
            this.job.Outputs.splice(index, 1)
            this.updateMPNames(this.job.Outputs)
        },
        addShot () {
            this.shotModal = _.clone(shotDefult)
            this.shotIndex = this.job.Snapshots.length
            this.showShotsModal = true
        },
        updateShots () {
            const ln = this.job.Snapshots.length
            let data = _.clone(this.shotModal)
            if (data.Resolution !== 'auto') {
                data.Resolution = `${data.width}*${data.height}`
            }
            delete data.width
            delete data.height
            if (this.shotIndex === ln) {
                this.job.Snapshots.push(data)
            } else {
                this.job.Snapshots.splice(this.shotIndex, 1, data)
            }
            this.showShotsModal = false
        },
        editShot (index) {
            this.shotIndex = index
            this.shotModal = _.clone(this.job.Snapshots[index])
            if (this.shotModal.Resolution !== 'auto') {
                this.shotModal.width = this.shotModal.Resolution.split('*')[0]
                this.shotModal.height = this.shotModal.Resolution.split('*')[1]
                this.shotModal.Resolution = 'value'
            }
            this.showShotsModal = true
        },
        deleteShot (index) {
            this.job.Snapshots.splice(index, 1)
        },
        templateChange (id) {
            this.HLSShow = this.isTS(id)
            if (!this.HLSShow) {
                this.outputModal.SegmentDuration = 0
            }
        },
        isTS (id) {
            return id ? this.templateInfo.templateContainer[id] === 'ts' : false
        },
        async pipeChange () {
            await _.forEach(this.pipes, pipe => {
                if (pipe.Id === this.job.PipelineId) {
                    this.pipeInputBucket = pipe.InputBucket
                }
            })
            this.getFiles()
        },
        updateMPNames () {
            const tc = this.templateInfo.templateContainer
            this.MPNames = []
            this.job.Outputs.forEach(item => {
                if (tc[item.PresetId] === 'ts') {
                    this.MPNames.push(item.Key)
                }
            })
        },
        async getFiles (searchValue = '') {
            let res = await handler('listObjects', {
                Bucket: this.pipeInputBucket,
                MaxKeys: 50,
                Prefix: searchValue
            })
            this.fileList = res.Contents
            this.fileInfo = !!res.IsTruncated
        }
    }
}
const jobDefult = {
    Inputs: [{
        Key: ''
    }],
    OutputKeyPrefix: '',
    Outputs: [],
    Snapshots: [],
    Playlists: {Format: '', Name: '', OutputKeys: []},
    PipelineId: ''
}

const outputsDefult = {
    Key: '',
    PresetId: '',
    SegmentDuration: 0
}

const shotDefult = {
    Key: '',
    Format: 'jpg',
    Time: '0',
    Interval: '1',
    Number: '1',
    Resolution: 'auto',
    AspectRatio: 'auto',
    width: '',
    height: ''
}

</script>
<style lang="less" scoped>
@import '../../styles/index.less';
@edit-output-item-span: 160px;

.@{css-prefix}job-edit {
    .section-search .bsc-input {
        width: 475px;
    }
    .editBlock {
        .form-item {
            .style-name-info {
                padding: 5px 0 0 @edit-output-item-span;
            }
        }
        .form-label {
            width: @edit-output-item-span !important;
        }
    }
}
</style>

