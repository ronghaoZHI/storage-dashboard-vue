<template>
    <div class="bsc-job-edit bsc-edit">
        <div class="layout-bsc-toolbar">
            <Breadcrumb>
                <Breadcrumb-item href="/video/JobList">{{$t('VIDEO.JOB_CONF')}}</Breadcrumb-item>
                <Breadcrumb-item>{{$t('VIDEO.JOB_CREATE')}}</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <Form ref="jobForm" :model="job" :rules="ruleValidate" :label-width="170">
            <div class="separator-line"></div>
            <div class="editBlock">
                <div class="section-separator">
                    <div class="separator-body">
                        <span class="separator-icon"></span>
                        <span class="separator-info">{{$t('VIDEO.BASIC_SET')}}</span>
                    </div>
                </div>
                <div class="form-item">
                    <FormItem :label="$t('VIDEO.JOB_PIPE')" prop="PipelineId" required>
                        <Select v-model="job.PipelineId" class="line-width" @on-change="pipeChange">
                            <Option v-for="item in pipes" :value="item.Id" :key="item.Id">{{ item.Name }}</Option>
                        </Select>
                    </FormItem>
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
                    <span class="form-label required-item">{{$t('VIDEO.SRC_FILE')}} : </span>
                    <div class="section-search">
                        <span class="bsc-input">
                            <input type="text" v-model="searchValue" />
                            <Button type="text" size="small" @click="getFiles(searchValue)"><Icon type="search" :size="iconSize"></Icon></Button>
                        </span>
                    </div>
                    <p class="style-name-info" v-if="fileInfo">{{$t('VIDEO.SEARCH_INFO')}}</p>
                </div>
                <div class="form-item">
                    <FormItem prop="Inputs">
                        <Select v-model="job.Inputs[0].Key" class="line-width">
                            <Option v-for="file in fileList" :value="file.Key" :key="file.Key">{{ file.Key }}</Option>
                        </Select>
                    </FormItem>
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
                    <span class="form-label">{{$t('VIDEO.OUTPUT_KEY_PREFIX')}} : </span>
                    <Input v-model="job.OutputKeyPrefix" :placeholder='$t("VIDEO.OUTPUT_KEY_PREFIX")' class="line-width"></Input>
                </div>
                <div class="form-item">
                    <span class="form-label">{{$t('VIDEO.OUTPUT_RULES')}} : </span>
                    <div class="table-box line-width">
                        <Table border size='small' :context="self" :stripe="true" :columns="outputsHeader" :data="job.Outputs" :no-data-text='$t("VIDEO.AT_LEAST_ONE_RULE")'></Table>
                    </div>
                    <br>
                    <p class="style-name-info redFont" v-if="HLSError">{{$t('VIDEO.AUTO_OUTPUT_RULES_DESCRIPTION')}}</p>
                    <Button class="button-add-item" icon="plus" size="small" @click="addOutput">{{$t('PUBLIC.ADD')}}</Button>
                </div>
                <div class="form-item">
                    <span class="form-label">{{$t('VIDEO.VIDEO_SCREENSHOTS_RULES')}} : </span>
                    <div class="table-box line-width">
                        <Table border size='small' :context="self" :stripe="true" :columns="shotsHeader" :data="job.Snapshots" :no-data-text='$t("VIDEO.AT_LEAST_ONE_RULE")'></Table>
                    </div>
                    <br>
                    <p class="style-name-info redFont" v-if="osError">{{$t('VIDEO.AT_LEAST_ONE_RULE')}}</p>
                    <Button class="button-add-item" icon="plus" size="small" @click="addShot">{{$t('PUBLIC.ADD')}}</Button>
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
                    <i-switch v-model="MPOpen" style="margin-top:3px;">
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
                    <FormItem :label="$t('VIDEO.HLS_FILE_NAME')" prop="Playlists.Name" required>
                        <Input v-model="job.Playlists.Name" placeholder="MasterPlaylist" class="line-width"></Input>
                    </FormItem>
                </div>
                <div class="form-item" v-if="MPOpen">
                    <FormItem :label="`${$t('VIDEO.OUTPUT_FILE_NAME')} : `" prop="Playlists.OutputKeys" required>
                        <Select v-model="job.Playlists.OutputKeys" multiple class="line-width">
                            <Option v-for="ots in MPNames" :value="ots" :key="ots">{{ ots }}</Option>
                        </Select>
                    </FormItem>
                </div>
            </div>
            <div class="separator-line"></div>
            <div class="editBlock">
                <Button class="button-save" type="primary" @click="beforeSubmit" >{{$t('VIDEO.SAVE')}}</Button>
            </div>
        </Form>
        <Modal v-model="showOutputsModal" :title='$t("VIDEO.OUTPUT_RULES")' width="700" class="edit-modal">
            <Form ref="outputForm" :model="outputModal" :label-width="155" :rules="ruleValidate">
                <FormItem :label="$t('VIDEO.TRANSCODING_TEMPLATE') + ' : '" prop="PresetId" required>
                    <Select v-model="outputModal.PresetId" class="line-width" @on-change="templateChange" filterable>
                        <Option v-for="template in templateInfo.templateList" :value="template.Id" :key="template.Id">{{template.Name}}</Option>
                    </Select>
                </FormItem>
                <FormItem :label="$t('VIDEO.OUTPUT_FILE_NAME') + ' : '" prop="Key" required>
                    <Input v-model="outputModal.Key" :placeholder='$t("VIDEO.OUTPUT_FILE_NAME")' class="line-width"></Input>
                </FormItem>
                <FormItem :label="$t('VIDEO.HLS_SLICE_LENGTH') + ' : '" prop="SegmentDuration" v-if="HLSShow">
                    <Slider v-model="outputModal.SegmentDuration" :min='0' :max='50' class="my-slider" show-input></Slider>
                </FormItem>
                <FormItem label="视频剪辑 : ">
                    <i-switch v-model="isComposition" style="margin-top:3px;">
                    <span slot="open">{{$t('VIDEO.ON')}}</span>
                    <span slot="close">{{$t('VIDEO.OFF')}}</span>
                    </i-switch>
                </FormItem>
                <FormItem label="剪辑开始时间 : " v-if="isComposition">
                    <TimePicker type="time" placeholder="时分秒" :value="outputModal.StartTime" @on-change="value => timeChange(value, 'StartTime')" style="width: 168px"></TimePicker> .
                    <InputNumber v-model="outputModal.StartTimeMS" :min="0"></InputNumber> ms
                </FormItem>
                <FormItem label="剪辑时长 : " v-if="isComposition">
                    <TimePicker type="time" placeholder="时分秒" :value="outputModal.Duration" @on-change="value => timeChange(value, 'Duration')" style="width: 168px"></TimePicker> .
                    <InputNumber v-model="outputModal.DurationMS" :min="0"></InputNumber> ms
                </FormItem>
                <p class="page-info" v-if="isAutoCodec" style="padding-left:155px">转码模版的视频编码方式为“不变”时不能添加水印</p>
                <FormItem label="水印 : ">
                    <i-switch v-model="isWaterMarkerOpen" style="margin-top:3px;" :disabled="isAutoCodec">
                    <span slot="open">{{$t('VIDEO.ON')}}</span>
                    <span slot="close">{{$t('VIDEO.OFF')}}</span>
                    </i-switch>
                </FormItem>
                <FormItem label="文件Key : " prop="InputKey" v-if="isWaterMarkerOpen">
                    <Input v-model="outputModal.InputKey" placeholder='水印图片要和视频源文件在一个bucket里，输入文件key即可，例如abc.png' class="line-width" :disabled="isAutoCodec"></Input>
                </FormItem>
            </Form>
            <div slot="footer" class="copy-modal-footer">
                <Button type="primary" @click="beforeUpdateOutputs">{{$t('VIDEO.OK')}}</Button>
            </div>
        </Modal>
        <Modal v-model="showShotsModal" :title='$t("VIDEO.SNAPSHOTS_RULES")' width="700" class="edit-modal">
            <Form ref="shotsForm" :model="shotModal" :label-width="0" :rules="ruleValidate" inline>
                <div class="form-item mar-b-0">
                    <span class="form-label required-item">{{$t('VIDEO.OUTPUT_FILE_NAME_SUFFIX')}} : </span>
                    <FormItem prop="Key" required>
                        <Input v-model="shotModal.Key" :placeholder='$t("VIDEO.OUTPUT_FILE_NAME_SUFFIX")' style="width:160px;"></Input>
                    </FormItem>
                    <Select v-model="shotModal.Format" style="width:100px;display:inline-block">
                        <Option v-for="format in formatList" :value="format" :key="format">{{format}}</Option>
                    </Select>
                </div>
                <div class="form-item mar-b-0">
                    <span class="form-label">{{$t('VIDEO.SCREENSHOT_START_TIME')}} : </span>
                    <FormItem prop="Time">
                        <InputNumber v-model="shotModal.Time"></InputNumber> S
                    </FormItem>
                </div>
            <div class="form-item">
                    <span class="form-label">{{$t('VIDEO.SCREENSHOT_INTERVAL')}} : </span>
                    <InputNumber :min='1' v-model="shotModal.Interval"></InputNumber> S
                </div>
                <div class="form-item">
                    <span class="form-label">{{$t('VIDEO.SCREENSHOT_MAX_NUMBER')}} : </span>
                    <InputNumber :min='1' v-model="shotModal.Number"></InputNumber>
                </div>
                <div class="form-item mar-b-0">
                    <span class="form-label">{{$t('VIDEO.RESOLUTION')}} : </span>
                    <Radio-group v-model="shotModal.Resolution">
                        <Radio label="auto">{{$t('VIDEO.UNALTERED')}}</Radio>
                        <Radio label="value"></Radio>
                    </Radio-group>
                    <FormItem prop="width">
                        <InputNumber v-model="shotModal.width" :disabled="shotModal.Resolution === 'auto'" :placeholder='$t("VIDEO.WIDTH")'></InputNumber>
                    </FormItem>
                    <FormItem prop="height">
                        <InputNumber v-model="shotModal.height" :disabled="shotModal.Resolution === 'auto'" :placeholder='$t("VIDEO.HEIGHT")'></InputNumber>
                    </FormItem>
                </div>
                <div class="form-item">
                    <span class="form-label">{{$t('VIDEO.ASPECT_RATIO')}} : </span>
                    <Radio-group v-model="shotModal.AspectRatio">
                        <Radio v-for='asp in aspectRatioList' :key="asp.value" :label='asp.value'>{{asp.name}}</Radio>
                    </Radio-group>
                </div>
            </Form>
            <div slot="footer" class="copy-modal-footer">
                <Button type="primary" @click="beforeUpdateShots">{{$t('VIDEO.OK')}}</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { listPipelines, getTemplateInfo, formateSS, getSS } from '@/pages/video/data'
import { handler } from '@/service/Aws'
import { getTranscoderUrl } from '@/service/API'
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
            isWaterMarkerOpen: false,
            isAutoCodec: false,
            isComposition: false, // video Composition 视频剪辑
            ruleValidate: {
                'Playlists.Name': [
                    { validator: this.validateName, trigger: 'change' }
                ],
                'Playlists.OutputKeys': [
                    { validator: this.validateOutputKeys, trigger: 'change' }
                ],
                Inputs: [
                    { validator: this.validateInputs, trigger: 'change' }
                ],
                SegmentDuration: [
                    { validator: this.validateSegment, trigger: 'blur' }
                ],
                InputKey: [
                    { validator: this.validateInputKey, trigger: 'change' }
                ],
                PresetId: [
                    { required: true, message: this.$t('VIDEO.PERSET_REQUIRED'), trigger: 'change' }
                ],
                Key: [
                    { required: true, message: this.$t('VIDEO.KEY_SUFFIX_REQUIRED'), trigger: 'change' }
                ],
                Time: [
                    { type: 'number', min: 1, message: this.$t('PUBLIC.NOT_LESS', {num: '1'}), trigger: 'change' }
                ],
                width: [
                    { validator: this.validateWidth, trigger: 'change' }
                ],
                height: [
                    { validator: this.validateWidth, trigger: 'change' }
                ]
            },
            aspectRatioList: [{name: this.$t('VIDEO.UNALTERED'), value: 'auto'}, {name: '1:1', value: '1:1'}, {name: '4:3', value: '4:3'}, {name: '3:2', value: '3:2'}, {name: '16:9', value: '16:9'}],
            outputsHeader: [{
                title: this.$t('VIDEO.OUTPUT_FILE_NAME'),
                key: 'Key',
                width: 140
            }, {
                title: this.$t('VIDEO.TRANSCODING_TEMPLATE'),
                key: 'template',
                width: 100
            }, {
                title: this.$t('VIDEO.HLS_SLICE_LENGTH'),
                width: 120,
                key: 'SegmentDuration'
            }, {
                title: '水印文件Key',
                width: 120,
                key: 'watermarkers',
                render: (h, params) => {
                    return h('div', [params.row.Watermarks ? params.row.Watermarks[0].InputKey : '水印未启用'])
                }
            }, {
                title: 'Actions',
                key: 'actions',
                width: 120,
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
        osError () {
            return this.job.Snapshots.length === 0 && this.job.Outputs.length === 0
        }
    },
    created () {
        this.createdMethods()
    },
    methods: {
        async createdMethods () {
            this.templateInfo = await getTemplateInfo()
            let pipesAll = await listPipelines()
            this.pipes = pipesAll.filter(pipe => {
                return pipe.Status === 'Active'
            })
            if (this.pipes[0]) {
                this.job.PipelineId = this.pipes[0].Id
                this.pipeInputBucket = this.pipes[0].InputBucket
            } else {
                this.$Message.warning(this.$t('VIDEO.PIPE_FIRST'))
            }
        },
        async beforeSubmit () {
            this.$refs['jobForm'].validate((valid) => {
                if (!valid) {
                    this.$Message.error(this.$t('PUBLIC.FORM_VALID_FAILED'))
                } else if (this.otherRule()) {
                    this.createJob()
                }
            })
        },
        otherRule () {
            let segments = []
            let segmentsSet = new Set()
            if (this.osError) {
                this.$Message.warning(this.$t('VIDEO.AT_LEAST_ONE_RULE'))
                return false
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
                    return false
                }
                if (segmentsSet.size !== 1) {
                    this.$Message.warning(this.$t('VIDEO.ADAPTIVE_HLS_SLICE_LENGTH_CONSISTENT'))
                    this.HLSError = true
                    return false
                } else if (segments[0] === 0) {
                    this.$Message.warning(this.$t('VIDEO.ADAPTIVE_HLS_SLICE_LENGTH_CANNOT_BE_0'))
                    this.HLSError = true
                    return false
                }
            }
            return true
        },
        async createJob (job) {
            let saved = await this.convert2Save(this.job)
            try {
                this.$Loading.start()
                await this.$http.post(getTranscoderUrl('jobs'), saved)
                this.$Loading.finish()
                this.$Message.success(this.$t('VIDEO.CREATED'))
                this.$router.push({ name: 'job' })
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
            this.isWaterMarkerOpen = false
            this.isComposition = false
            this.HLSError = false
        },
        editOutput (index) {
            this.outputIndex = index
            this.outputModal = _.clone(this.job.Outputs[index])
            this.outputModal.SegmentDuration = parseInt(this.outputModal.SegmentDuration)
            this.outputModal.InputKey = this.outputModal.Watermarks ? this.outputModal.Watermarks[0].InputKey : ''
            this.isWaterMarkerOpen = !!this.outputModal.Watermarks
            if (this.isTS(this.outputModal.PresetId)) {
                this.HLSShow = true
            } else {
                this.HLSShow = false
            }
            this.isAutoCodec = this.isAC(this.outputModal.PresetId)

            this.isComposition = !!this.outputModal.Composition
            this.outputModal.StartTime = this.outputModal.Composition ? formateSS(this.outputModal.Composition[0].TimeSpan.StartTime)[0] : '0:0:0'
            this.outputModal.StartTimeMS = this.outputModal.Composition ? formateSS(this.outputModal.Composition[0].TimeSpan.StartTime)[1] : '0'
            this.outputModal.Duration = this.outputModal.Composition ? formateSS(this.outputModal.Composition[0].TimeSpan.Duration)[0] : '0:0:0'
            this.outputModal.DurationMS = this.outputModal.Composition ? formateSS(this.outputModal.Composition[0].TimeSpan.Duration)[1] : '0'
            this.showOutputsModal = true
            this.HLSError = false
        },
        beforeUpdateOutputs () {
            this.$refs['outputForm'].validate((valid) => {
                if (!valid) {
                    this.$Message.error(this.$t('PUBLIC.FORM_VALID_FAILED'))
                } else {
                    this.updateOutputs()
                }
            })
        },
        updateOutputs () {
            const ln = this.job.Outputs.length
            this.outputModal.template = `${this.outputModal.PresetId}+${this.templateInfo.templateName[this.outputModal.PresetId]}`
            const outputSave = this.isWaterMarkerOpen ? Object.assign(this.outputModal, {Watermarks: [{InputKey: this.outputModal.InputKey}]}) : this.outputModal
            delete outputSave.InputKey
            this.isAutoCodec && delete outputSave.Watermarks
            if (this.isComposition) {
                outputSave.Composition = [{TimeSpan: {StartTime: getSS(this.outputModal.StartTime, this.outputModal.StartTimeMS), Duration: getSS(this.outputModal.Duration, this.outputModal.DurationMS)}}]
            }
            delete outputSave.StartTime
            delete outputSave.StartTimeMS
            delete outputSave.Duration
            delete outputSave.DurationMS
            if (this.outputIndex === ln) {
                this.job.Outputs.push(outputSave)
            } else {
                this.job.Outputs.splice(this.outputIndex, 1, outputSave)
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
        beforeUpdateShots () {
            this.$refs['shotsForm'].validate((valid) => {
                if (!valid) {
                    this.$Message.error(this.$t('PUBLIC.FORM_VALID_FAILED'))
                } else {
                    this.updateShots()
                }
            })
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
            this.isAutoCodec = this.isAC(id)
        },
        timeChange (value, name) {
            this.outputModal[name] = value
        },
        isAC (id) {
            return id ? this.templateInfo.templateVideoCodec[id] === 'auto' : false
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
        },
        validateName (rule, value, callback) {
            if (!value && this.MPOpen) {
                callback(new Error(this.$t('VIDEO.FILE_NAME_SUFFIX_CANNOT_EMPTY')))
            } else {
                callback()
            }
        },
        validateOutputKeys (rule, value, callback) {
            if (value.length === 0 && this.MPOpen) {
                callback(new Error('请选择输出文件名'))
            } else {
                callback()
            }
        },
        validateInputs (rule, value, callback) {
            if (!value[0].Key) {
                callback(new Error(this.$t('VIDEO.SRC_FILE_INFO')))
            } else {
                callback()
            }
        },
        validateSegment (rule, value, callback) {
            if (this.isTS(this.outputModal.PresetId) && this.MPOpen && value === 0) {
                callback(new Error(this.$t('VIDEO.HLS_SLICE_LENGTH_CANNOT_BE_0')))
            } else {
                callback()
            }
        },
        validateWidth (rule, value, callback) {
            if (this.shotModal.Resolution !== 'auto') {
                if (!Number.isInteger(value)) {
                    callback(new Error(this.$t('PUBLIC.NUM_PLEASE')))
                } else {
                    if (value < 1) {
                        callback(new Error(this.$t('PUBLIC.NOT_LESS', {num: '1'})))
                    } else {
                        callback()
                    }
                }
            } else {
                callback()
            }
        },
        validateInputKey (rule, value, callback) {
            if (!this.isAutoCodec && this.isWaterMarkerOpen && !value) {
                callback(new Error('请填写水印文件key'))
            } else {
                callback()
            }
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
    Playlists: {Format: 'HLSv3', Name: '', OutputKeys: []},
    PipelineId: ''
}

const outputsDefult = {
    Key: '',
    PresetId: '',
    SegmentDuration: 0,
    StartTime: '0:0:0',
    StartTimeMS: '0',
    Duration: '0:0:0',
    DurationMS: '0'
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

@edit-output-item-span: 170px;
@edit-output-item-margin: 175px;
@edit-modal-item-span: 155px;

.@{css-prefix}job-edit {
    .section-search .bsc-input {
        width: 475px;
    }
    .button-save{
        margin-left: 390px;
        transform: translateX(-50%);
    }
}
</style>

