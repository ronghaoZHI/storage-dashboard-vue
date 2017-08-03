<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Breadcrumb>
                <Breadcrumb-item href="/video/pipeline">管道管理</Breadcrumb-item>
                <Breadcrumb-item>新建管道</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <div class="form-item">
                <span class="form-label"><span class="redFont">*</span>管道名称 : </span>
                <Input v-model="pipeline.Name" placeholder="管道名称" class="line-width"></Input>
                <p class="style-name-info redFont" v-if="nameError" >名称使用数字、字母、小数点，且不超过40个字符</p>
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
                <table class="table-permission" style="display:inline-block;width:500px">
                    <thead>
                        <tr>
                            <th style="width:180px;"> {{$t("STORAGE.ACL_GROUP")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.ACL_GROUP_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th style="width:160px;">{{$t("STORAGE.OBJECT_PERMISSIONS")}}
                                <Tooltip placement="right">
                                    <span><Icon type="ios-help"></Icon></span>
                                    <div slot="content">
                                        <p style="white-space: normal !important;">{{$t("STORAGE.OBJECT_OBJECT_PERMISSIONS_INFO")}}</p>
                                    </div>
                                </Tooltip>
                            </th>
                            <th style="width:160px;">{{$t("STORAGE.ACL_PERMISSIONS")}}
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
                <table class="table-permission" style="display:inline-block;width:500px">
                    <thead>
                        <tr>
                            <th style="width:120px;"> {{$t("STORAGE.USER")}}
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
                                    <Button :disabled="username == item.Grantee"
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
                <span class="form-label">{{$t('VIDEO.TRANSCODING_SUCCESSFUL_CALLBACK_URL')}} : </span>
                <Input v-model="pipeline.SuccessCallbackUrl" :placeholder='$t("VIDEO.TRANSCODING_SUCCESSFUL_CALLBACK_URL")' class="line-width" style="display:inline-table;">
                    <span slot="prepend">http://</span>
                </Input>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.TRANSCODING_FAILED_CALLBACK_URL')}} : </span>
                <Input v-model="pipeline.FailureCallbackUrl" :placeholder='$t("VIDEO.TRANSCODING_FAILED_CALLBACK_URL")' class="line-width" style="display:inline-table;">
                    <span slot="prepend">http://</span>
                </Input>
            </div>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <Button class="button-bsc-add-bucket save-button" type="primary" @click="addPipeline">{{$t('VIDEO.SAVE')}}</Button>
            <Button class="button-bsc-add-bucket cancel-button" type="primary" @click="goPipelineList">取消</Button>
        </div>
    </div>
</template>

<script>
import user from '@/store/modules/user'
import { getBucketList } from '@/service/Data'
import { transcoder } from '@/service/Aws'
export default {
    data () {
        return {
            iconSize: 18,
            pipeline: _.cloneDeep(pipelineDefult),
            groupACLList: _.cloneDeep(groupACLListDefult),
            newUserItem: _.cloneDeep(newUserItemDefult),
            bucketList: this.bucketList,
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
    mounted () {
        this.getBucketNames()
        this.readPipeline()
    },
    methods: {
        async getBucketNames () {
            let res = await getBucketList()
            this.bucketList = _.map(res.Buckets, bucket => bucket.Name)
            this.pipeline.InputBucket = this.bucketList[0]
            this.pipeline.OutputBucket = this.bucketList[0]
        },
        async readPipeline () {
            if (this.pipelineId !== 'none') {
                try {
                    this.$Loading.start()
                    let res = await transcoder('readPipeline', {Id: this.pipelineId})
                    this.pipeline.Name = res.Pipeline.Name
                    this.pipeline.InputBucket = res.Pipeline.InputBucket
                    this.pipeline.OutputBucket = res.Pipeline.OutputBucket
                    this.$Loading.finish()
                } catch (error) {
                    this.$Loading.error()
                }
            } else {
                this.userACLList = [this.owerACL]
            }
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
            let pipeline = _.cloneDeep(this.pipeline)
            pipeline.Permission = _.cloneDeep(this.groupACLList)
            try {
                this.$Loading.start()
                if (this.pipelineId === 'none') {
                    await transcoder('createPipeline', pipeline)
                } else {
                    await transcoder('updatePipeline', pipeline)
                }
                this.$Loading.finish()
                this.$Message.success(this.$t('VIDEO.CREATED_SUCCESSFULLY'))
                this.$router.push({ name: 'pipeline' })
            } catch (error) {
                this.$Loading.error()
            }
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
        Permission: []
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
}, {
    GranteeType: 'Group',
    Grantee: 'LogDelivery',
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
</script>

<style lang="less" scope>
@import '../../styles/index.less';

@edit-styles-border-color: #d7dde4;
@edit-output-item-span: 175px;
@edit-output-line-width: 500px;

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
    }

    .save-button {
        margin: 0 0 0 250px;
    }
    
    .cancel-button {
        margin: 0 0 0 80px;
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
