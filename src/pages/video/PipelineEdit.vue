<template>
    <div class="bsc-edit">
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
                <file-acl :aclData='groupACLList' :userAcl='userACLList' :isInline='true' :width='500'>
                    <span class="form-label" slot="groupTitle">{{$t('VIDEO.USER_GROUP_PERMISSIONS')}} : </span>
                    <span class="form-label" slot="userTitle">{{$t('VIDEO.USER_PERMISSIONS')}} : </span>
                </file-acl>
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
import fileAcl from '@/components/ACL/fileAcl.vue'
export default {
    data () {
        return {
            iconSize: 18,
            pipeline: _.cloneDeep(pipelineDefult),
            groupACLList: _.cloneDeep(groupACLListDefult),
            bucketList: [],
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
    components: { fileAcl },
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
                    this.groupACLList = _.cloneDeep(this.groupACLList)
                } else {
                    this.userACLList.push(item)
                }
            })
        },
        async addPipeline () {
            if (this.nameError === true) {
                this.$Message.error(this.$t('VIDEO.ENTER_CORRECT_PIPELINE_NAME'))
                return
            }
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

@edit-output-item-span: 175px;
@edit-output-line-width: 530px;

.@{css-prefix}edit {
    .editBlock {
        .form-item {
            .form-label {
                vertical-align: top;
            }

            .new-user-input {
                width: 85%;
            }
        }
    }
}
</style>
