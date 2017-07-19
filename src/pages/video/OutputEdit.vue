<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Breadcrumb>
                <Breadcrumb-item href="/video/Output">自动转码配置</Breadcrumb-item>
                <Breadcrumb-item>新建模版</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <div class="section-separator">
                <span class="separator-icon"></span>
                <span class="separator-info">输入配置</span>
            </div>
            <div class="form-item">
                <span class="form-label">允许转码的路径规则 : </span>
                <Radio-group v-model="auxiliary.reg">
                    <Radio key="extension" label='extension'>按文件扩展名配置</Radio>
                    <Radio key="regular" label='regular'>正则表达式配置</Radio>
                </Radio-group>
            </div>
            <div class="form-item">
                <span class="form-label"></span>
                <Input v-if="auxiliary.reg === 'extension'" v-model="auxiliary.path" placeholder="路径" class="sub-setting-input"></Input>
                <Input v-if="auxiliary.reg === 'extension'" v-model="auxiliary.extension" placeholder="扩展名" class="sub-setting-input"></Input>
                <span v-if="auxiliary.reg === 'extension'">(多个扩展名使用“|”分割)</span>
                <Input v-if="auxiliary.reg === 'regular'" v-model="auxiliary.regular" placeholder="正则表达式" class="sub-setting-input"></Input>
                <span class="style-name-info redFont" v-if="regError">表达式错误</span>
            </div>
            <div class="form-item">
                <span class="form-label">输入Bucket : </span>
                <Select v-model="inputBucket" class="line-width">
                    <Option v-for="bucket in bucketList" :value="bucket" :key="bucket">{{bucket}}</Option>
                </Select>
            </div>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <div class="section-separator">
                <span class="separator-icon"></span>
                <span class="separator-info">输出配置</span>
            </div>
            <div class="form-item">
                <span class="form-label">输出文件key前缀 : </span>
                <Input v-model="transcode.output_key_prefix" placeholder="输出文件key前缀" class="line-width"></Input>
            </div>
            <div class="form-item">
                <span class="form-label">输出Bucket : </span>
                <Select v-model="transcode.output_bucket" class="line-width">
                    <Option v-for="bucket in bucketList" :value="bucket" :key="bucket">{{bucket}}</Option>
                </Select>
            </div>
            <div class="form-item">
                <span class="form-label">输出规则 : </span>
                <div class="table-box line-width">
                    <Table border size='small' :context="self" :stripe="true" :columns="outputsHeader" :data="transcode.outputs" no-data-text='输出规则和视频截图规则至少存在一个'></Table>
                </div>
                <br>
                <p class="style-name-info redFont button-add-item" v-if="HLSError">设置自动转码后，输出规则中至少有一项模版输出为TS，且所有HLS切片时长需保持一致，且不能为0</p>
                <Button class="button-add-item" shape="circle" icon="plus" type="primary" size="small" @click="addOutput">添加</Button>
            </div>
            <div class="form-item">
                <span class="form-label">视频截图规则 : </span>
                <div class="table-box line-width">
                    <Table border size='small' :context="self" :stripe="true" :columns="shotsHeader" :data="transcode.snapshots" no-data-text='输出规则和视频截图规则至少存在一个'></Table>
                </div>
                <br>
                <p class="style-name-info redFont button-add-item" v-if="osError">输出规则和视频截图规则至少存在一个</p>
                <Button class="button-add-item" shape="circle" icon="plus" type="primary" size="small" @click="addShot">添加</Button>
            </div>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <div class="section-separator">
                <span class="separator-icon"></span>
                <span class="separator-info">更多配置</span>
            </div>
            <div class="form-item">
                <span class="form-label">转码后是否删除原始文件 : </span>
                <Radio-group v-model="transcode.delete_origin">
                    <Radio key="true" label='true'>是</Radio>
                    <Radio key="false" label='false'>否</Radio>
                </Radio-group>
            </div>
            <div class="form-item">
                <span class="form-label">转码后是否保留原始路径 : </span>
                <Radio-group v-model="transcode.keep_input_path">
                    <Radio key="true" label='true'>是</Radio>
                    <Radio key="false" label='false'>否</Radio>
                </Radio-group>
            </div>
            <div class="form-item">
                <span class="form-label">转码成功回调Url : </span>
                <Input v-model="transcode.success_callback_url" placeholder="转码成功回调Url" class="line-width" style="display:inline-table;">
                    <span slot="prepend">http://</span>
                </Input>
            </div>
            <div class="form-item">
                <span class="form-label">转码失败回调Url : </span>
                <Input v-model="transcode.failure_callback_url" placeholder="转码失败回调Url" class="line-width" style="display:inline-table;">
                    <span slot="prepend">http://</span>
                </Input>
            </div>
        </div>
        <div class="separator-line" v-if="MPShow"></div>
        <div class="editBlock" v-if="MPShow">
            <div class="section-separator">
                <span class="separator-icon"></span>
                <span class="separator-info">MasterPlaylist配置</span>
            </div>
            <div class="form-item">
                <span class="form-label">是否开启 : </span>
                <i-switch v-model="auxiliary.MP">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </i-switch>
            </div>
            <div class="form-item" v-if="auxiliary.MP">
                <span class="form-label">切片格式 : </span>
                <Radio-group v-model="transcode.master_playlist.format">
                    <Radio key="HLSv3" label='HLSv3'>HLSv3</Radio>
                </Radio-group>
            </div>
            <div class="form-item" v-if="auxiliary.MP">
                <span class="form-label">MasterPlaylist文件名后缀 : </span>
                <Input v-model="transcode.master_playlist.name" placeholder="MasterPlaylist" class="line-width"></Input>
                <p class="style-name-info redFont button-add-item" v-if="MPNameError">文件名后缀不能为空</p>
            </div>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <div class="section-separator">
                <span class="separator-icon"></span>
                <span class="separator-info">权限设置</span>
            </div>
            <div class="form-item">
                <span class="form-label">用户组权限 : </span>
                <table class="table-permission" style="display:inline-block;width:475px">
                    <thead>
                        <tr>
                            <th style="width:170px;"> {{$t("STORAGE.ACL_GROUP")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.ACL_GROUP_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th style="width:135px;">{{$t("STORAGE.OBJECT_PERMISSIONS")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.OBJECT_OBJECT_PERMISSIONS_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th style="width:170px;">{{$t("STORAGE.ACL_PERMISSIONS")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.OBJECT_ACL_PERMISSIONS_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in groupACLList">
                            <td>
                                {{item.Grantee}}
                            </td>
                            <td>
                                <Checkbox v-model="item.Access.Read">{{$t("STORAGE.READ")}}</Checkbox>
                            </td>
                            <td>
                                <Checkbox v-model="item.Access.ReadAcp">{{$t("STORAGE.READ")}}</Checkbox>
                                <Checkbox v-model="item.Access.WriteAcp">{{$t("STORAGE.WRITE")}}</Checkbox>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="form-item">
                <span class="form-label">用户权限 : </span>
                <table class="table-permission" style="display:inline-block;width:475px">
                    <thead>
                        <tr>
                            <th style="width:200px;"> {{$t("STORAGE.USER")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.ACL_USER_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th style="width:135px;">{{$t("STORAGE.OBJECT_PERMISSIONS")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.OBJECT_OBJECT_PERMISSIONS_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th style="width:170px;">{{$t("STORAGE.ACL_PERMISSIONS")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.OBJECT_ACL_PERMISSIONS_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th style="width:135px;"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="isAddUser">
                            <td>
                                <input class="new-user-input" v-model="newUserItem.Grantee">
                            </td>
                            <td>
                                <Checkbox v-model="newUserItem.Access.Read">{{$t("STORAGE.READ")}}</Checkbox>
                            </td>
                            <td>
                                <Checkbox v-model="newUserItem.Access.ReadAcp">{{$t("STORAGE.READ")}}</Checkbox>
                                <Checkbox v-model="newUserItem.Access.WriteAcp">{{$t("STORAGE.WRITE")}}</Checkbox>
                            </td>
                            <td>
                                <Tooltip placement="bottom" :delay="1000">
                                    <Button style="margin: 0 6px;" size="small" :disabled="newUserDisabled" @click="addUserOK">
                                        <Icon type="ios-checkmark" :size="iconSize"></Icon>
                                    </Button>
                                    <div slot="content">
                                        <p>添加</p>
                                    </div>
                                </Tooltip>
                                <Tooltip placement="bottom" :delay="1000">
                                    <Button style="margin: 0 6px;" size="small" @click="isAddUser = false">
                                        <Icon type="ios-close" :size="iconSize"></Icon>
                                    </Button>
                                    <div slot="content">
                                        <p>取消</p>
                                    </div>
                                </Tooltip>
                            </td>
                        </tr>
                        <tr v-for="(item,index) in userACLList">
                            <td>
                                {{item.Grantee}}
                            </td>
                            <td>
                                <Checkbox :disabled="username == item.Grantee"
                                        v-model="item.Access.Read">{{$t("STORAGE.READ")}}</Checkbox>
                            </td>
                            <td>
                                <Checkbox :disabled="username == item.Grantee"
                                        v-model="item.Access.ReadAcp">{{$t("STORAGE.READ")}}</Checkbox>
                                <Checkbox :disabled="username == item.Grantee"
                                        v-model="item.Access.WriteAcp">{{$t("STORAGE.WRITE")}}</Checkbox>
                            </td>
                            <td>
                                <Tooltip placement="bottom" :delay="1000">
                                    <Button v-if="index == 0"
                                        style="margin: 0 6px;"
                                        size="small"
                                        @click="addUser">
                                    <Icon type="ios-plus"
                                        :size="iconSize"></Icon>
                                    </Button>
                                    <Button v-else
                                            style="margin: 0 6px;visibility:hidden;"
                                            size="small">
                                        <Icon type="ios-plus"
                                            :size="iconSize"></Icon>
                                    </Button>
                                    <div slot="content">
                                        <p>{{$t("STORAGE.ADD_USER")}}</p>
                                    </div>
                                </Tooltip>
                                <Tooltip placement="bottom" :delay="1000">
                                    <Button :disabled="username == item.Grantee"
                                        style="margin: 0 6px;"
                                        size="small"
                                        @click="deleteUser(index)">
                                        <Icon type="ios-minus"
                                            :size="iconSize"></Icon>
                                    </Button>
                                    <div slot="content">
                                        <p>{{$t("STORAGE.DELETE_USER")}}</p>
                                    </div>
                                </Tooltip>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <Button class="button-bsc-add-bucket" type="primary" @click="beforeSubmit" :disabled="sbumitDisabled">保存</Button>
        </div>
        <Modal v-model="showOutputsModal" title='输出规则' width="700" class="my-modal">
            <div class="form-item">
                <span class="form-label">转码模板 : </span>
                <Select v-model="outputModal.preset_id" class="line-width" @on-change="templateChange">
                    <Option v-for="template in templateList" :value="template.Id" :key="template.Id">{{template.Name}}</Option>
                </Select>
            </div>
            <div class="form-item">
                <span class="form-label">输出文件名后缀 : </span>
                <Input v-model="outputModal.key_suffix" placeholder="输出文件名后缀" class="line-width"></Input>
            </div>
            <div class="form-item" v-if="HLSShow" >
                <span class="form-label">HLS切片时长 : </span>
                <Slider v-model="outputModal.segment_duration" :min='0' :max='50' class="my-slider"></Slider>
                <Input-number :min='0' :max='50' v-model="outputModal.segment_duration"></Input-number>
                <p class="style-name-info redFont" v-if="outputsDisabled">HLS切片时长不能为0</p>
            </div>
            <div style="height:90px;"></div>
            <div slot="footer" class="copy-modal-footer">
                <Button type="primary" @click="updateOutputs" :disabled="outputsDisabled">确定</Button>
            </div>
        </Modal>
        <Modal v-model="showShotsModal" title='输出规则' width="700" class="my-modal">
            <div class="form-item">
                <span class="form-label">输出文件名后缀 : </span>
                <Input v-model="shotModal.key_suffix" placeholder="输出文件名后缀" style="width:160px;"></Input>
                <Select v-model="shotModal.format" style="width:100px;display:inline-block">
                    <Option v-for="format in formatList" :value="format" :key="format">{{format}}</Option>
                </Select>
            </div>
            <div class="form-item">
                <span class="form-label">截图起始时间点 : </span>
                <Input-number :min='1' v-model="shotModal.time"></Input-number> S
            </div>
           <div class="form-item">
                <span class="form-label">截图间隔时间 : </span>
                <Input-number :min='1' v-model="shotModal.interval"></Input-number> S
            </div>
            <div class="form-item">
                <span class="form-label">截图最大数量 : </span>
                <Input-number :min='1' v-model="shotModal.number"></Input-number>
            </div>
            <div class="form-item">
                <span class="form-label">分辨率 : </span>
                <Radio-group v-model="shotModal.resolution">
                    <Radio label="auto">不变</Radio>
                    <Radio label="value"></Radio>
                </Radio-group>
                <Input-number :min='1' v-model="shotModal.width" :disabled="shotModal.resolution === 'auto'" placeholder="宽度"></Input-number>
                <Input-number :min='1' v-model="shotModal.height" :disabled="shotModal.resolution === 'auto'" placeholder="高度"></Input-number>
            </div>
            <div class="form-item">
                <span class="form-label">宽高比 : </span>
                <Radio-group v-model="shotModal.aspect_ratio">
                    <Radio v-for='asp in aspectRatioList' :key="asp.value" :label='asp.value'>{{asp.name}}</Radio>
                </Radio-group>
            </div>
            <div slot="footer" class="copy-modal-footer">
                <Button type="primary" @click="updateShots">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { transcoder } from '@/service/Aws'
import InputNumber from '@/components/input-number/input-number.vue'
import * as listPage from '@/pages/video/OutputList'
import user from '@/store/modules/user'
import { getBucketList } from '@/service/Data'
export default {
    data () {
        return {
            iconSize: 18,
            self: this,
            transcode: _.cloneDeep(transcodeDefult),
            inputBucket: '',
            bucketList: this.bucketList,
            showOutputsModal: false,
            showShotsModal: false,
            aspectRatioList: [{name: '不变', value: 'auto'}, {name: '1:1', value: '1:1'}, {name: '4:3', value: '4:3'}, {name: '3:2', value: '3:2'}, {name: '16:9', value: '16:9'}],
            formatList: ['png', 'jpg'],
            templateList: this.templateList,
            outputModal: _.clone(outputsDefult),
            shotModal: _.clone(shotDefult),
            auxiliary: _.cloneDeep(auxiliaryDefult),
            MPShow: false,
            HLSShow: false,
            groupACLList: _.cloneDeep(groupACLListDefult),
            isAddUser: false,
            newUserItem: _.cloneDeep(newUserItemDefult),
            userACLList: [],
            templateContainer: {},
            templateName: {},
            HLSError: false,
            outputsHeader: [{
                title: '输出文件名后缀',
                key: 'key_suffix',
                width: 120
            }, {
                title: '转码模板',
                key: 'template',
                width: 100
            }, {
                title: 'HLS切片时长',
                width: 100,
                key: 'segment_duration'
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
                title: '输出文件名后缀',
                key: 'key_suffix',
                width: 140
            }, {
                title: '格式',
                key: 'format',
                width: 70
            }, {
                title: '截图起始时间点(秒)',
                width: 160,
                key: 'time'
            }, {
                title: '截图间隔时间(秒)',
                width: 140,
                key: 'interval'
            }, {
                title: '截图最大数量',
                width: 120,
                key: 'number'
            }, {
                title: '截图分辨率',
                width: 100,
                key: 'resolution'
            }, {
                title: '宽高比',
                width: 80,
                key: 'aspect_ratio'
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
        bucket: function () {
            return this.$route.params.bucket
        },
        id: function () {
            return this.$route.params.id
        },
        username () {
            return user.state.username
        },
        owerACL () {
            return {
                GranteeType: 'Canonial',
                Grantee: this.username,
                Access: {
                    Read: true,
                    ReadAcp: true,
                    WriteAcp: true
                }
            }
        },
        outputsDisabled () {
            return this.isTS(this.outputModal.preset_id) && this.outputModal.segment_duration === 0 && this.auxiliary.MP
        },
        sbumitDisabled () {
            return this.regError || this.MPNameError
        },
        regError () {
            try {
                new RegExp(this.auxiliary.regular)
            } catch (error) {
                return true
            }
            return false
        },
        newUserDisabled () {
            const name = this.newUserItem.Grantee
            const { Read, ReadAcp, WriteAcp } = this.newUserItem.Access
            return name === '' || !(Read || ReadAcp || WriteAcp)
        },
        MPNameError () {
            return this.MPShow && this.auxiliary.MP && !this.transcode.master_playlist.name
        },
        osError () {
            return this.transcode.snapshots.length === 0 && this.transcode.outputs.length === 0
        }
    },
    components: { InputNumber },
    async mounted () {
        await this.getTemplateList()
        await this.getTranscode()
    },
    methods: {
        async getBucketNames () {
            let res = await getBucketList()
            this.bucketList = _.map(res.Buckets, bucket => bucket.Name)
        },
        async getTemplateList () {
            try {
                this.$Loading.start()
                let res = await transcoder('listPresets')
                this.templateList = res.Presets

                this.templateList.forEach(item => {
                    this.templateContainer[item.Id] = item.Container
                })
                this.templateList.forEach(item => {
                    this.templateName[item.Id] = item.Name
                })
                this.$Loading.finish()
            } catch (error) {
                console.log(error)
                this.$Message.error(error)
                this.$Loading.error()
            }
        },
        async getTranscode () {
            if (this.id === 'none') {
                this.userACLList = [this.owerACL]
                await this.getBucketNames()
                this.inputBucket = this.bucketList[0]
                this.transcode.output_bucket = this.bucketList[0]
            } else {
                let res = await listPage.methods.getBucketPolicy(this.bucket, this.id)
                this.inputBucket = this.bucket
                const transcods = JSON.parse(res.data.Policy).post_upload_transcoding
                const transcod = transcods.filter(item => {
                    return item.id === this.id
                })
                this.convert2Front(transcod[0])
                await this.getBucketNames()
            }
        },
        async addOutput () {
            this.outputModal = _.clone(outputsDefult)
            this.outputIndex = this.transcode.outputs.length
            this.showOutputsModal = true
            this.HLSError = false
        },
        editOutput (index) {
            this.outputIndex = index
            this.outputModal = _.clone(this.transcode.outputs[index])
            this.outputModal.segment_duration = parseInt(this.outputModal.segment_duration)
            if (this.isTS(this.outputModal.preset_id)) {
                this.HLSShow = true
            } else {
                this.HLSShow = false
            }
            this.showOutputsModal = true
            this.HLSError = false
        },
        updateOutputs () {
            const ln = this.transcode.outputs.length
            this.outputModal.template = `${this.outputModal.preset_id}+${this.templateName[this.outputModal.preset_id]}`
            if (this.outputIndex === ln) {
                this.transcode.outputs.push(this.outputModal)
            } else {
                this.transcode.outputs.splice(this.outputIndex, 1, this.outputModal)
            }
            this.MPShow = this.isMPShow()
            this.showOutputsModal = false
        },
        deleteOutput (index) {
            this.transcode.outputs.splice(index, 1)
        },
        addShot () {
            this.shotModal = _.clone(shotDefult)
            this.shotIndex = this.transcode.snapshots.length
            this.showShotsModal = true
        },
        updateShots () {
            const ln = this.transcode.snapshots.length
            let data = _.clone(this.shotModal)
            if (data.resolution !== 'auto') {
                data.resolution = `${data.width}*${data.height}`
            }
            delete data.width
            delete data.height
            if (this.shotIndex === ln) {
                this.transcode.snapshots.push(data)
            } else {
                this.transcode.snapshots.splice(this.shotIndex, 1, data)
            }
            this.showShotsModal = false
        },
        editShot (index) {
            this.shotIndex = index
            this.shotModal = _.clone(this.transcode.snapshots[index])
            if (this.shotModal.resolution !== 'auto') {
                this.shotModal.width = this.shotModal.resolution.split('*')[0]
                this.shotModal.height = this.shotModal.resolution.split('*')[1]
                this.shotModal.resolution = 'value'
            }
            this.showShotsModal = true
        },
        deleteShot (index) {
            this.transcode.snapshots.splice(index, 1)
        },
        beforeSubmit () {
            let segments = []
            if (this.MPShow && this.auxiliary.MP) {
                this.transcode.outputs.forEach(item => {
                    if (this.isTS(item.preset_id)) {
                        segments.push(item.segment_duration || 0)
                    }
                })
                if (segments.length === 0) {
                    this.$Message.warning('设置自适应转码，输出规则中需存在转码模版输出为TS格式的项')
                    this.HLSError = true
                    return
                }
                const unified = segments.filter(seg => parseInt(seg) === parseInt(segments[0]))
                if (unified.length !== segments.length) {
                    this.$Message.warning('设置自适应转码，输出规则中HLS切片时长需保持一致')
                    this.HLSError = true
                    return
                } else if (segments[0] === 0) {
                    this.$Message.warning('设置自适应转码，输出规则中HLS切片时长不能为0')
                    this.HLSError = true
                    return
                }
            }

            if (this.osError) {
                this.$Message.warning('输出规则和视频截图规则至少存在一个')
                return
            }

            this.addTranscode()
        },
        async addTranscode () {
            if (this.id === 'none') {
                this.newTranscode()
            } else {
                if (this.bucket === this.inputBucket) {
                    this.alterTranscode()
                } else {
                    this.ranscodeChangeBucket()
                }
            }
        },
        async newTranscode () {
            let trans = await listPage.methods.getTranscode(this.inputBucket)
            const newTrans = this.convert2Save(this.transcode)
            newTrans.id = Date.now() + Math.random().toString().slice(-6)
            trans.push(newTrans)
            try {
                await listPage.methods.putBucketPolicy(this.inputBucket, trans)
                this.$router.push({ name: 'output' })
                this.$Message.success('设置成功!')
            } catch (error) {
                console.log(error)
                this.$Message.error('设置失败!')
            }
        },
        async alterTranscode () {
            let trans = await listPage.methods.getTranscode(this.inputBucket)
            const newTrans = this.convert2Save(this.transcode)
            let updateIndex
            trans.forEach((item, index) => {
                if (item.id === this.id) {
                    updateIndex = index
                }
            })
            trans.splice(updateIndex, 1, newTrans)
            try {
                await listPage.methods.putBucketPolicy(this.inputBucket, trans)
                this.$router.push({ name: 'output' })
                this.$Message.success('设置成功!')
            } catch (error) {
                console.log(error)
                this.$Message.error('设置失败!')
            }
        },
        async ranscodeChangeBucket () {
            let originalTrans = await listPage.methods.getTranscode(this.bucket)
            let trans = await listPage.methods.getTranscode(this.inputBucket)
            const newTrans = this.convert2Save(this.transcode)
            newTrans.id = Date.now() + Math.random().toString().slice(-6)
            let updateIndex
            originalTrans.forEach((item, index) => {
                if (item.id === this.id) {
                    updateIndex = index
                }
            })
            originalTrans.splice(updateIndex, 1)
            trans.push(newTrans)
            try {
                await listPage.methods.putBucketPolicy(this.bucket, originalTrans)
                await listPage.methods.putBucketPolicy(this.inputBucket, trans)
                this.$router.push({ name: 'output' })
                this.$Message.success('设置成功!')
            } catch (error) {
                console.log(error)
                this.$Message.error('设置失败!')
            }
        },
        convert2Save (data) {
            const front = _.clone(data)
            const auxiliary = _.clone(this.auxiliary)
            let saved = _.clone(data)

            if (data.outputs.length === 0) {
                delete saved.outputs
            } else {
                saved.outputs = front.outputs.map(item => {
                    let res = _.clone(item)
                    if (item.segment_duration && item.segment_duration !== 0) {
                        res.segment_duration = item.segment_duration.toString()
                    } else {
                        delete res.segment_duration
                    }
                    delete res.template
                    return res
                })
            }

            if (data.snapshots.length === 0) {
                delete saved.snapshots
            } else {
                saved.snapshots = front.snapshots.map(item => {
                    let res = _.clone(item)
                    res.interval = item.interval.toString()
                    res.number = item.number.toString()
                    res.time = item.time.toString()
                    return res
                })
            }

            let groug = this.groupACLList
            let user = this.userACLList
            saved.output_acls = _.without([...groug, ...user].map(item => {
                const { Read, ReadAcp, WriteAcp } = item.Access
                if (Read || ReadAcp || WriteAcp) {
                    return aclConvert2Save(item)
                }
            }), null, undefined)

            if (!this.auxiliary.MP || !this.MPShow) {
                delete saved.master_playlist
            }
            saved.allowed_keys_regex = auxiliary.reg === 'extension' ? [`^${auxiliary.path}.*\\.(${auxiliary.extension})$`] : [`${auxiliary.regular}`]
            return saved
        },
        isMPShow () {
            const out = this.transcode.outputs
            const temp = this.templateList
            const ids = out.map(op => {
                return op.preset_id
            })
            const TSItems = temp.filter(item => {
                return ids.includes(item.Id) && item.Container === 'ts'
            })
            return TSItems.length > 0
        },
        templateChange (id) {
            this.HLSShow = this.isTS(id)
            if (!this.HLSShow) {
                this.outputModal.segment_duration = 0
            }
        },
        isTS (id) {
            return this.templateContainer[id] === 'ts'
        },
        addUser () {
            this.isAddUser = true
            this.newUserItem = _.cloneDeep(newUserItemDefult)
        },
        addUserOK () {
            this.userACLList.push(this.newUserItem)
            this.isAddUser = false
        },
        deleteUser (index) {
            this.userACLList.splice(index, 1)
        },
        async convert2Front (data) {
            let front = _.cloneDeep(data)
            front.failure_callback_url = data.failure_callback_url.split('http://')[1] || ''
            front.success_callback_url = data.success_callback_url.split('http://')[1] || ''
            if (!data.outputs || isEmpty(data.outputs)) {
                front.outputs = []
            } else {
                front.outputs.forEach(item => {
                    item.template = `${item.preset_id}+${this.templateName[item.preset_id]}`
                })
            }

            if (!data.snapshots || isEmpty(data.snapshots)) {
                front.snapshots = []
            }

            if (!front.master_playlist) {
                front.master_playlist = {
                    format: 'HLSv3',
                    name: ''
                }
            }
            this.transcode = front

            this.auxiliary.regular = data.allowed_keys_regex[0]

            if (isEmpty(data.outputs)) {
                this.MPShow = false
            } else {
                this.MPShow = data.outputs.filter(output => this.isTS(output.preset_id)).length !== 0
            }

            data.output_acls.forEach(item => {
                let acc = {
                    Read: false,
                    ReadAcp: false,
                    WriteAcp: false
                }
                item.Access.forEach(item => {
                    if (item === 'FullControl') {
                        acc = {
                            Read: true,
                            ReadAcp: true,
                            WriteAcp: true
                        }
                    } else {
                        acc[item] = true
                    }
                })
                item.Access = acc
                if (item.GranteeType === 'Group') {
                    if (item.Grantee === 'AllUsers') {
                        this.groupACLList[0] = item
                    } else {
                        this.groupACLList[1] = item
                    }
                } else {
                    this.userACLList.push(item)
                }
            })
        }
    }
}
const groupGrantee = ['AllUsers', 'AuthenticatedUsers']

const newUserItemDefult = {
    Grantee: '',
    Access: {
        Read: false,
        ReadAcp: false,
        WriteAcp: false
    }
}

const groupACLListDefult = [{
    GranteeType: 'Group',
    Grantee: 'AllUsers',
    Access: {
        Read: false,
        ReadAcp: false,
        WriteAcp: false
    }
}, {
    GranteeType: 'Group',
    Grantee: 'AuthenticatedUsers',
    Access: {
        Read: false,
        ReadAcp: false,
        WriteAcp: false
    }
}]

const auxiliaryDefult = {
    reg: 'regular',
    path: '',
    extension: '',
    regular: '',
    MP: false
}

const outputsDefult = {
    key_suffix: '',
    preset_id: '',
    segment_duration: 0
}
const shotDefult = {
    key_suffix: '',
    format: 'jpg',
    time: '0',
    interval: '1',
    number: '1',
    resolution: 'auto',
    aspect_ratio: 'auto',
    width: '',
    height: ''
}

const transcodeDefult = {
    // id: Date.now() + Math.random().toString().slice(-6),
    is_enabled: 'true',
    allowed_keys_regex: [],
    keep_input_path: 'false',
    delete_origin: 'false',
    output_key_prefix: '',
    output_bucket: '',
    outputs: [],
    snapshots: [],
    output_acls: [],
    master_playlist: {
        format: 'HLSv3',
        name: ''
    },
    success_callback_url: '',
    failure_callback_url: ''
}

const aclConvert2Save = data => {
    const saved = {
        Grantee: data.Grantee
    }

    if (!groupGrantee.includes(data.Grantee)) {
        saved.GranteeType = data.Grantee.split('@')[1] ? 'Email' : 'Canonical'
    } else {
        saved.GranteeType = data.GranteeType
    }
    if (Object.values(data.Access).includes(false)) {
        saved.Access = []
        _.forEach(data.Access, (value, key) => {
            if (value) { saved.Access.push(key) }
        })
    } else {
        saved.Access = ['FullControl']
    }
    return saved
}
const isEmpty = obj => {
    for (var name in obj) {
        return false
    }
    return true
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';

@edit-styles-border-color: #d7dde4;
@edit-output-item-span: 175px;
@edit-modal-item-span: 115px;
@edit-output-line-width: 475px;

.editBlock {
    margin: 20px 0 10px;
    .form-item {
            margin-bottom: 20px;

            .form-label {
                display: inline-block;
                width: @edit-output-item-span;
                font-size: 14px;
                padding-right: 5px;
                line-height: 30px;
                text-align: right;
                vertical-align: top;
            }

            .line-width {
                width: @edit-output-line-width;
            }

            .table-box {
                display: inline-flex;
            }

            .button-add-item {
                margin: 10px 0 0 @edit-output-item-span;
            }

            .sub-setting-input {
                width: 200px;
            }

            .my-slider {
                display: inline-block;
                vertical-align: middle;
                width: 260px;
                height: 32px;
                margin-right:8px;
            }

            .input-box-label{
                padding: 0 5px;
                .sc(14px,#8492a6);
                line-height: 30px;
            }

            .dis-inline {
                display: inline
            }

            .pullRight{
                float: right;
            }
        }
    
}

.my-modal {
    .form-item {
            margin-bottom: 20px;
            // text-align: center;

            .form-label {
                display: inline-block;
                width: @edit-modal-item-span;
                font-size: 14px;
                padding-right: 5px;
                line-height: 30px;
                text-align: right;
            }

            .line-width {
                width: 500px;
            }

            .my-slider {
                display: inline-block;
                vertical-align: middle;
                width: 405px;
                height: 32px;
                margin-right:8px;
            }

            .style-name-info {
                padding: 5px 0 0 @edit-modal-item-span;
                .sc(12px,#8492a6);
            }
        }
}



.redFont {
    color: red !important;
}

.separator-line {
    border-bottom: 1px solid @edit-styles-border-color;
}

.new-user-input {
    width: 85%;
}


.ivu-select .ivu-select-dropdown {
    max-height: 130px !important;
    overflow: auto;
}
</style>

