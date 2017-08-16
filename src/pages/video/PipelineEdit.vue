<template>
    <div class="bsc-pipeline-edit">
        <div class="layout-bsc-toolbar">
            <Breadcrumb>
                <Breadcrumb-item href="/video/pipeline">{{$t('VIDEO.PIPELINE_MANAGEMENT')}}</Breadcrumb-item>
                <Breadcrumb-item>{{$t('VIDEO.NEW_PIPELINE')}}</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <div class="form-item">
                <span class="form-label"><span class="redFont">*</span>{{$t('VIDEO.PIPELINE_NAME')}} : </span>
                <Input v-model="pipeline.Name" :placeholder='this.$t("VIDEO.PIPELINE_NAME_INFO")' class="line-width"></Input>
                <p class="style-name-info redFont" v-if="nameError" >{{$t('VIDEO.PIPELINE_NAME_CHAR_NUMBER')}}</p>
            </div>
            <div class="form-item">
                <span class="form-label"><span class="redFont">*</span>{{$t('VIDEO.INPUT_BUCKET')}} : </span>
                <Select v-model="pipeline.InputBucket" class="line-width">
                    <Option v-for="bucket in bucketList" :value="bucket" :key="bucket">{{bucket}}</Option>
                </Select>
            </div>
            <div class="form-item">
                <span class="form-label"><span class="redFont">*</span>{{$t('VIDEO.OUTPUT_BUCKET')}} : </span>
                <Select v-model="pipeline.OutputBucket" class="line-width">
                    <Option v-for="bucket in bucketList" :value="bucket" :key="bucket">{{bucket}}</Option>
                </Select>
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
                <table class="table-permission" style="display:inline-block;width:530px">
                    <thead>
                        <tr>
                            <th style="width:150px;"> {{$t("STORAGE.ACL_GROUP")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.ACL_GROUP_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th style="width:150px;">{{$t("STORAGE.OBJECT_PERMISSIONS")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.OBJECT_OBJECT_PERMISSIONS_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th style="width:230px;">{{$t("STORAGE.ACL_PERMISSIONS")}}
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
                <table class="table-permission" style="display:inline-block;width:530px">
                    <thead>
                        <tr>
                            <th style="width:150px;"> {{$t("STORAGE.USER")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.ACL_USER_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th style="width:150px;">{{$t("STORAGE.OBJECT_PERMISSIONS")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.OBJECT_OBJECT_PERMISSIONS_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th style="width:140px;">{{$t("STORAGE.ACL_PERMISSIONS")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.OBJECT_ACL_PERMISSIONS_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th style="width:90px;"></th>
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
                                    <Button style="margin: 0 2px;" size="small" :disabled="newUserDisabled" @click="addUserOK">
                                        <Icon type="ios-checkmark" :size="iconSize"></Icon>
                                    </Button>
                                    <div slot="content">
                                        <p>{{$t('VIDEO.ADD')}}</p>
                                    </div>
                                </Tooltip>
                                <Tooltip placement="bottom" :delay="1000">
                                    <Button style="margin: 0 2px;" size="small" @click="isAddUser = false">
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
                                <Checkbox :disabled="username === item.Grantee" v-model="item.Access.Read">{{$t("STORAGE.READ")}}</Checkbox>
                            </td>
                            <td>
                                <Checkbox :disabled="username === item.Grantee" v-model="item.Access.ReadAcp">{{$t("STORAGE.READ")}}</Checkbox>
                                <Checkbox :disabled="username === item.Grantee" v-model="item.Access.WriteAcp">{{$t("STORAGE.WRITE")}}</Checkbox>
                            </td>
                            <td>
                                <Tooltip placement="bottom" :delay="1000">
                                    <Button v-if="index === 0"
                                        style="margin: 0 2px;"
                                        size="small"
                                        @click="addUser">
                                    <Icon type="ios-plus"
                                        :size="iconSize"></Icon>
                                    </Button>
                                    <Button v-else
                                            style="margin: 0 2px;visibility:hidden;"
                                            size="small">
                                        <Icon type="ios-plus"
                                            :size="iconSize"></Icon>
                                    </Button>
                                    <div slot="content">
                                        <p>{{$t("STORAGE.ADD_USER")}}</p>
                                    </div>
                                </Tooltip>
                                <Tooltip placement="bottom" :delay="1000">
                                    <Button :disabled="username === item.Grantee"
                                        style="margin: 0 2px;"
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
            <div class="section-separator">
                <div class="separator-body">
                    <span class="separator-icon"></span>
                    <span class="separator-info">{{$t('VIDEO.MORE_CONFIGURATION')}}</span>
                </div>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.ACCEPT_JOB_SUCCESS_CALLBACK_URL')}} : </span>
                <Input v-model="pipeline.SuccessCallbackUrl" :placeholder='$t("VIDEO.ACCEPT_JOB_SUCCESS_CALLBACK_URL_INFO")' class="line-width" style="display:inline-table;">
                    <span slot="prepend">http://</span>
                </Input>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.ACCEPT_JOB_FAILURE_CALLBACK_URL')}} : </span>
                <Input v-model="pipeline.FailureCallbackUrl" :placeholder='$t("VIDEO.ACCEPT_JOB_FAILURE_CALLBACK_URL_INFO")' class="line-width" style="display:inline-table;">
                    <span slot="prepend">http://</span>
                </Input>
            </div>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <Button class="button-bsc-add-bucket" type="primary" @click="addPipeline">{{$t('VIDEO.SAVE')}}</Button>
        </div>
    </div>
</template>

<script>
import user from '@/store/modules/user'
import { getBucketList } from '@/service/Data'
import { getTranscoderUrl } from '@/service/API'
export default {
    data () {
        return {
            iconSize: 18,
            pipeline: _.cloneDeep(pipelineDefult),
            groupACLList: _.cloneDeep(groupACLListDefult),
            newUserItem: _.cloneDeep(newUserItemDefult),
            bucketList: [],
            isAddUser: false,
            userACLList: []
        }
    },
    computed: {
        pipelineId () {
            return this.$route.params.id
        },
        nameError () {
            return this.pipeline.Name.length === 0 || (new TextEncoder('utf-8').encode(this.pipeline.Name)).length > 40
        },
        newUserDisabled () {
            const name = this.newUserItem.Grantee
            const { Read, ReadAcp, WriteAcp } = this.newUserItem.Access
            return name === '' || !(Read || ReadAcp || WriteAcp)
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
        }
    },
    created () {
        this.readPipeline()
    },
    methods: {
        async readPipeline () {
            let res = await getBucketList()
            this.bucketList = _.map(res.Buckets, bucket => bucket.Name)
            if (this.pipelineId !== 'none') {
                try {
                    this.$Loading.start()
                    let res = await this.$http.get(getTranscoderUrl(`pipelines/${this.pipelineId}`))
                    await this.convert2Front(res.Pipeline)
                    this.$Loading.finish()
                } catch (error) {
                    this.$Loading.error()
                }
            } else {
                this.pipeline.InputBucket = this.bucketList[0]
                this.pipeline.OutputBucket = this.bucketList[0]
                this.userACLList = [this.owerACL]
            }
        },
        convert2Front (data) {
            this.pipeline.Name = data.Name
            this.pipeline.InputBucket = data.InputBucket
            this.pipeline.OutputBucket = data.OutputBucket
            this.pipeline.SuccessCallbackUrl = data.SuccessCallbackUrl.split('http://')[1] || ''
            this.pipeline.FailureCallbackUrl = data.FailureCallbackUrl.split('http://')[1] || ''
            data.ContentConfig.Permissions.forEach(item => {
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
        async addPipeline () {
            let params = this.convert2Save()
            try {
                this.$Loading.start()
                if (this.pipelineId === 'none') {
                    await this.$http.post(getTranscoderUrl('pipelines'), params)
                    this.$Loading.finish()
                    this.$Message.success(this.$t('VIDEO.CREATED_SUCCESSFULLY'))
                } else {
                    await this.$http.put(getTranscoderUrl(`pipelines/${this.pipelineId}`), params)
                    this.$Loading.finish()
                    this.$Message.success(this.$t('VIDEO.UPDATED_SUCCESSFULLY'))
                }
                this.$router.push({ name: 'pipeline' })
            } catch (error) {
                this.$Loading.error()
            }
        },
        convert2Save () {
            let saved = _.cloneDeep(this.pipeline)
            saved.Name = this.pipeline.Name
            saved.InputBucket = this.pipeline.InputBucket
            saved.OutputBucket = this.pipeline.OutputBucket
            saved.SuccessCallbackUrl = 'http://' + this.pipeline.SuccessCallbackUrl
            saved.FailureCallbackUrl = 'http://' + this.pipeline.FailureCallbackUrl
            let group = _.cloneDeep(this.groupACLList)
            let user = _.cloneDeep(this.userACLList)
            saved.ContentConfig.Permissions = _.without([...group, ...user].map(item => {
                const { Read, ReadAcp, WriteAcp } = item.Access
                if (Read || ReadAcp || WriteAcp) {
                    return aclConvert2Save(item)
                }
            }), null, undefined)
            return saved
        },
        goPipelineList () {
            this.$router.push({ name: 'pipeline' })
        }
    }
}
const pipelineDefult = {
    Name: '',
    InputBucket: '',
    OutputBucket: '',
    SuccessCallbackUrl: '',
    FailureCallbackUrl: '',
    ContentConfig: {
        Permissions: []
    }
}

const groupGrantee = ['AllUsers', 'AuthenticatedUsers']

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

const newUserItemDefult = {
    Grantee: '',
    Access: {
        Read: false,
        ReadAcp: false,
        WriteAcp: false
    }
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
</script>

<style lang="less" scope>
@import '../../styles/index.less';

@edit-styles-border-color: #d7dde4;
@edit-output-item-span: 175px;
@edit-output-line-width: 530px;

.@{css-prefix}pipeline-edit {
    .separator-line {
        border-bottom: 1px solid @edit-styles-border-color;
    }

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

            .style-name-info {
                padding: 5px 0 0 @edit-output-item-span;
            }

            .redFont {
                color: red !important;
            }

            .ivu-select .ivu-select-dropdown {
                max-height: 130px !important;
                overflow: auto;
            }

            .new-user-input {
                width: 85%;
            }
        }
    }
}
</style>
