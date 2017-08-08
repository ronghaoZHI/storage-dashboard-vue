<template>
    <div class="bsc-output-edit bsc-edit">
        <div class="layout-bsc-toolbar">
            <Breadcrumb>
                <Breadcrumb-item href="/video/Output">{{$t('VIDEO.AUTOMATIC_TRANSCODING_CONFIGURATION')}}</Breadcrumb-item>
                <Breadcrumb-item>{{$t('VIDEO.NEW_CONFIGURATION')}}</Breadcrumb-item>
            </Breadcrumb>
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
                <span class="form-label">{{$t('VIDEO.TRANSCODING_PATH_RULES')}} : </span>
                <Radio-group v-model="auxiliary.reg">
                    <Radio key="extension" label='extension'>{{$t('VIDEO.BY_FILE_EXTENSION_CONFIGURATION')}}</Radio>
                    <Radio key="regular" label='regular'>{{$t('VIDEO.REGULAR_EXPRESSION_CONFIGURATION')}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item">
                <span class="form-label"></span>
                <Input v-if="auxiliary.reg === 'extension'" v-model="auxiliary.path" :placeholder='$t("VIDEO.PATH")' class="sub-setting-input"></Input>
                <Input v-if="auxiliary.reg === 'extension'" v-model="auxiliary.extension" :placeholder='$t("VIDEO.EXTENSION_NAME")' class="sub-setting-input"></Input>
                <span v-if="auxiliary.reg === 'extension'">{{$t('VIDEO.SEPARATE_EXTENSION_NAMES')}}</span>
                <Input v-if="auxiliary.reg === 'regular'" v-model="auxiliary.regular" :placeholder='$t("VIDEO.REGULAR_EXPRESSION")' class="sub-setting-input"></Input>
                <span class="style-name-info redFont" v-if="regError">{{$t('VIDEO.EXPRESSION_INCORRECT')}}</span>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.INPUT_BUCKET')}} : </span>
                <Select v-model="inputBucket" class="line-width">
                    <Option v-for="bucket in bucketList" :value="bucket" :key="bucket">{{bucket}}</Option>
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
                <Input v-model="transcode.output_key_prefix" :placeholder='$t("VIDEO.OUTPUT_FILE_KEY_PREFIX")' class="line-width"></Input>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.OUTPUT_BUCKET')}} : </span>
                <Select v-model="transcode.output_bucket" class="line-width">
                    <Option v-for="bucket in bucketList" :value="bucket" :key="bucket">{{bucket}}</Option>
                </Select>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.OUTPUT_RULES')}} : </span>
                <div class="table-box line-width">
                    <Table border size='small' :context="self" :stripe="true" :columns="outputsHeader" :data="transcode.outputs" :no-data-text='$t("VIDEO.AT_LEAST_ONE_RULE")'></Table>
                </div>
                <br>
                <p class="style-name-info redFont button-add-item" v-if="HLSError">{{$t('VIDEO.AUTO_OUTPUT_RULES_DESCRIPTION')}}</p>
                <Button class="button-add-item" shape="circle" icon="plus" type="primary" size="small" @click="addOutput">{{$t('VIDEO.ADD')}}</Button>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.VIDEO_SCREENSHOTS_RULES')}} : </span>
                <div class="table-box line-width">
                    <Table border size='small' :context="self" :stripe="true" :columns="shotsHeader" :data="transcode.snapshots" :no-data-text='$t("VIDEO.AT_LEAST_ONE_RULE")'></Table>
                </div>
                <br>
                <p class="style-name-info redFont button-add-item" v-if="osError">{{$t('VIDEO.AT_LEAST_ONE_RULE')}}</p>
                <Button class="button-add-item" shape="circle" icon="plus" type="primary" size="small" @click="addShot">{{$t('VIDEO.ADD')}}</Button>
            </div>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <div class="section-separator">
                <div class="separator-body">
                    <span class="separator-icon"></span>
                    <span class="separator-info">{{$t('VIDEO.MORE_CONFIGURATION')}}</span>
                </div>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.WHETHER_DELETE_ORIGINAL_FILE_AFTER_TRANSCODING')}} : </span>
                <Radio-group v-model="transcode.delete_origin">
                    <Radio key="true" label='true'>{{$t('VIDEO.YES')}}</Radio>
                    <Radio key="false" label='false'>{{$t('VIDEO.NO')}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.WHETHER_RETAIN_ORIGINAL_PATH_AFTER_TRANSCODING')}} : </span>
                <Radio-group v-model="transcode.keep_input_path">
                    <Radio key="true" label='true'>{{$t('VIDEO.YES')}}</Radio>
                    <Radio key="false" label='false'>{{$t('VIDEO.NO')}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.TRANSCODING_SUCCESSFUL_CALLBACK_URL')}} : </span>
                <Input v-model="transcode.success_callback_url" :placeholder='$t("VIDEO.TRANSCODING_SUCCESSFUL_CALLBACK_URL")' class="line-width" style="display:inline-table;">
                    <span slot="prepend">http://</span>
                </Input>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.TRANSCODING_FAILED_CALLBACK_URL')}} : </span>
                <Input v-model="transcode.failure_callback_url" :placeholder='$t("VIDEO.TRANSCODING_FAILED_CALLBACK_URL")' class="line-width" style="display:inline-table;">
                    <span slot="prepend">http://</span>
                </Input>
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
                <i-switch v-model="auxiliary.MP">
                    <span slot="open">{{$t('VIDEO.ON')}}</span>
                    <span slot="close">{{$t('VIDEO.OFF')}}</span>
                </i-switch>
            </div>
            <div class="form-item" v-if="auxiliary.MP">
                <span class="form-label">{{$t('VIDEO.SLICE_FORMAT')}} : </span>
                <Radio-group v-model="transcode.master_playlist.format">
                    <Radio key="HLSv3" label='HLSv3'>HLSv3</Radio>
                </Radio-group>
            </div>
            <div class="form-item" v-if="auxiliary.MP">
                <span class="form-label">{{$t('VIDEO.MASTER_PLAYLIST_FILE_NAME_SUFFIX')}} : </span>
                <Input v-model="transcode.master_playlist.name" placeholder="MasterPlaylist" class="line-width"></Input>
                <p class="style-name-info redFont button-add-item" v-if="MPNameError">{{$t('VIDEO.FILE_NAME_SUFFIX_CANNOT_EMPTY')}}</p>
            </div>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <div class="section-separator">
                <div class="separator-body">
                    <span class="separator-icon"></span>
                    <span class="separator-info">{{$t('VIDEO.PERMISSION_SETTINGS')}}</span>
                </div>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.USER_GROUP_PERMISSIONS')}} : </span>
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
                <span class="form-label">{{$t('VIDEO.USER_PERMISSIONS')}} : </span>
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
                                        <p>{{$t('VIDEO.ADD')}}</p>
                                    </div>
                                </Tooltip>
                                <Tooltip placement="bottom" :delay="1000">
                                    <Button style="margin: 0 6px;" size="small" @click="isAddUser = false">
                                        <Icon type="ios-close" :size="iconSize"></Icon>
                                    </Button>
                                    <div slot="content">
                                        <p>{{$t('VIDEO.CANCEL')}}</p>
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
            <Button class="button-bsc-add-bucket" type="primary" @click="beforeSubmit" :disabled="sbumitDisabled">{{$t('VIDEO.SAVE')}}</Button>
        </div>
        <Modal v-model="showOutputsModal" :title='$t("VIDEO.OUTPUT_RULES")' width="700" class="my-modal">
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.TRANSCODING_TEMPLATE')}} : </span>
                <Select v-model="outputModal.preset_id" class="line-width" @on-change="templateChange">
                    <Option v-for="template in templateList" :value="template.Id" :key="template.Id">{{template.Name}}</Option>
                </Select>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.OUTPUT_FILE_NAME_SUFFIX')}} : </span>
                <Input v-model="outputModal.key_suffix" :placeholder='$t("VIDEO.OUTPUT_FILE_NAME_SUFFIX")' class="line-width"></Input>
            </div>
            <div class="form-item" v-if="HLSShow" >
                <span class="form-label">{{$t('VIDEO.HLS_SLICE_LENGTH')}} : </span>
                <Slider v-model="outputModal.segment_duration" :min='0' :max='50' class="my-slider"></Slider>
                <Input-number :min='0' :max='50' v-model="outputModal.segment_duration"></Input-number>
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
                <Input v-model="shotModal.key_suffix" :placeholder='$t("VIDEO.OUTPUT_FILE_NAME_SUFFIX")' style="width:160px;"></Input>
                <Select v-model="shotModal.format" style="width:100px;display:inline-block">
                    <Option v-for="format in formatList" :value="format" :key="format">{{format}}</Option>
                </Select>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.SCREENSHOT_START_TIME')}} : </span>
                <Input-number :min='1' v-model="shotModal.time"></Input-number> S
            </div>
           <div class="form-item">
                <span class="form-label">{{$t('VIDEO.SCREENSHOT_INTERVAL')}} : </span>
                <Input-number :min='1' v-model="shotModal.interval"></Input-number> S
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.SCREENSHOT_MAX_NUMBER')}} : </span>
                <Input-number :min='1' v-model="shotModal.number"></Input-number>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.RESOLUTION')}} : </span>
                <Radio-group v-model="shotModal.resolution">
                    <Radio label="auto">{{$t('VIDEO.UNALTERED')}}</Radio>
                    <Radio label="value"></Radio>
                </Radio-group>
                <Input-number :min='1' v-model="shotModal.width" :disabled="shotModal.resolution === 'auto'" :placeholder='$t("VIDEO.WIDTH")'></Input-number>
                <Input-number :min='1' v-model="shotModal.height" :disabled="shotModal.resolution === 'auto'" :placeholder='$t("VIDEO.HEIGHT")'></Input-number>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.ASPECT_RATIO')}} : </span>
                <Radio-group v-model="shotModal.aspect_ratio">
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
import { putBucketPolicy, getTranscodes, getTemplateInfo } from '@/pages/video/data'
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
            aspectRatioList: [{name: this.$t('VIDEO.UNALTERED'), value: 'auto'}, {name: '1:1', value: '1:1'}, {name: '4:3', value: '4:3'}, {name: '3:2', value: '3:2'}, {name: '16:9', value: '16:9'}],
            formatList: ['png', 'jpg'],
            templateList: this.templateList,
            outputModal: _.clone(outputsDefult),
            shotModal: _.clone(shotDefult),
            auxiliary: _.cloneDeep(auxiliaryDefult),
            HLSShow: false,
            groupACLList: _.cloneDeep(groupACLListDefult),
            isAddUser: false,
            newUserItem: _.cloneDeep(newUserItemDefult),
            userACLList: [],
            templateContainer: {},
            templateName: {},
            HLSError: false,
            outputsHeader: [{
                title: this.$t('VIDEO.OUTPUT_FILE_NAME_SUFFIX'),
                key: 'key_suffix',
                width: 120
            }, {
                title: this.$t('VIDEO.TRANSCODING_TEMPLATE'),
                key: 'template',
                width: 100
            }, {
                title: this.$t('VIDEO.HLS_SLICE_LENGTH'),
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
                key: 'key_suffix',
                width: 140
            }, {
                title: this.$t('VIDEO.FORMAT'),
                key: 'format',
                width: 70
            }, {
                title: this.$t('VIDEO.SCREENSHOT_START_TIME_SECOND'),
                width: 160,
                key: 'time'
            }, {
                title: this.$t('VIDEO.SCREENSHOT_INTERVAL_SECOND'),
                width: 140,
                key: 'interval'
            }, {
                title: this.$t('VIDEO.SCREENSHOT_MAX_NUMBER'),
                width: 120,
                key: 'number'
            }, {
                title: this.$t('VIDEO.SCREENSHOT_RESOLUTION'),
                width: 100,
                key: 'resolution'
            }, {
                title: this.$t('VIDEO.ASPECT_RATIO'),
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
            return this.auxiliary.MP && !this.transcode.master_playlist.name
        },
        osError () {
            return this.transcode.snapshots.length === 0 && this.transcode.outputs.length === 0
        }
    },
    components: { InputNumber },
    created () {
        this.getTranscode()
    },
    methods: {
        async getBucketNames () {
            let res = await getBucketList()
            this.bucketList = _.map(res.Buckets, bucket => bucket.Name)
        },
        async getTranscode () {
            const templateInfor = await getTemplateInfo()
            this.templateList = templateInfor.templateList
            this.templateContainer = templateInfor.templateContainer
            this.templateName = templateInfor.templateName

            if (this.id === 'none') {
                this.userACLList = [this.owerACL]
                await this.getBucketNames()
                this.inputBucket = this.bucketList[0]
                this.transcode.output_bucket = this.bucketList[0]
            } else {
                this.inputBucket = this.bucket
                const transcods = await getTranscodes(this.bucket)
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
            if (this.auxiliary.MP) {
                this.transcode.outputs.forEach(item => {
                    if (this.isTS(item.preset_id)) {
                        segments.push(item.segment_duration || 0)
                    }
                })
                if (segments.length === 0) {
                    this.$Message.warning(this.$t('VIDEO.ADAPTIVE_EXIST_TS_FORMAT'))
                    this.HLSError = true
                    return
                }
                const unified = segments.filter(seg => parseInt(seg) === parseInt(segments[0]))
                if (unified.length !== segments.length) {
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

            this.addTranscode()
        },
        async addTranscode () {
            if (this.id === 'none') {
                this.newTranscode()
            } else {
                if (this.bucket === this.inputBucket) {
                    this.alterTranscode()
                } else {
                    this.transcodeChangeBucket()
                }
            }
        },
        async newTranscode () {
            try {
                this.$Loading.start()
                let trans = await getTranscodes(this.inputBucket)
                const newTrans = this.convert2Save(this.transcode)
                newTrans.id = Date.now() + Math.random().toString().slice(-6)
                trans.push(newTrans)
                await putBucketPolicy(this.inputBucket, trans)
                this.$router.push({ name: 'output' })
                this.$Message.success(this.$t('VIDEO.SET_UP_SUCCESSFULLY'))
            } catch (error) {
                console.log(error)
            }
        },
        async alterTranscode () {
            try {
                this.$Loading.start()
                let trans = await getTranscodes(this.inputBucket)
                const newTrans = this.convert2Save(this.transcode)
                let updateIndex
                trans.forEach((item, index) => {
                    if (item.id === this.id) {
                        updateIndex = index
                    }
                })
                trans.splice(updateIndex, 1, newTrans)
                await putBucketPolicy(this.inputBucket, trans)
                this.$router.push({ name: 'output' })
                this.$Message.success(this.$t('VIDEO.SET_UP_SUCCESSFULLY'))
            } catch (error) {
                console.log(error)
                this.$Message.error(this.$t('VIDEO.SET_UP_FAILED'))
            }
        },
        async transcodeChangeBucket () {
            try {
                this.$Loading.start()
                let [originalTrans, trans] = await Promise.all([getTranscodes(this.bucket), getTranscodes(this.inputBucket)])

                let newTrans = this.convert2Save(this.transcode)
                newTrans.id = Date.now() + Math.random().toString().slice(-6)
                originalTrans.forEach((item, index) => {
                    if (item.id === this.id) {
                        originalTrans.splice(index, 1)
                    }
                })
                trans.push(newTrans)

                await Promise.all([putBucketPolicy(this.bucket, originalTrans), putBucketPolicy(this.inputBucket, trans)])
                this.$router.push({ name: 'output' })
                this.$Message.success(this.$t('VIDEO.SET_UP_SUCCESSFULLY'))
            } catch (error) {
                console.log(error)
                this.$Message.error(this.$t('VIDEO.SET_UP_FAILED'))
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

            if (!this.auxiliary.MP) {
                delete saved.master_playlist
            }
            saved.allowed_keys_regex = auxiliary.reg === 'extension' ? [`^${auxiliary.path}.*\\.(${auxiliary.extension})$`] : [`${auxiliary.regular}`]
            return saved
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
<style lang="less">
@import '../../styles/index.less';

@edit-styles-border-color: #d7dde4;
@edit-output-item-span: 175px;
@edit-modal-item-span: 115px;
@edit-output-line-width: 475px;

.@{css-prefix}edit{
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
                }

                .table-box {
                    display: inline-flex;
                }

                .button-add-item {
                    margin: 10px 0 0 @edit-output-item-span;
                }

                .line-width {
                    width: @edit-output-line-width;
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

    .redFont {
        color: red !important;
    }

    .separator-line {
        border-bottom: 1px solid @edit-styles-border-color;
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
</style>
<style lang="less">
@import '../../styles/index.less';

@edit-styles-border-color: #d7dde4;
@edit-output-item-span: 175px;
@edit-modal-item-span: 115px;
@edit-output-line-width: 475px;

.@{css-prefix}output-edit{
    .editBlock {
        .form-item {
            .form-label {
                vertical-align: top;
            }

            .sub-setting-input {
                width: 200px;
            }
        }
    }

    .new-user-input {
        width: 85%;
    }
}
</style>
