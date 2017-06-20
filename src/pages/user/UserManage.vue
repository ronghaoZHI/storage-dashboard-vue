<template>
    <div class="bsc-user">
        <Button type="primary" v-show="!isAdmin" @click="createSubUserModal = true">新建子账号</Button>
        <Button type="primary" v-show="isAdmin" @click="createUserModal = true">创建账号</Button>
        <Button type="primary" v-show="isAdmin" @click="openBindUserModal">关联账号</Button>
        <Table class="table" :show-header="true" :stripe="true" :context="self" :highlight-row="true" :columns="userHeader" :data="userList" :no-data-text='$t("STORAGE.NO_FILE")'></Table>
        <Modal v-model="createUserModal" title="Add user" @on-ok="createUser" @on-cancel="createBucketValue = ''">
            <Form ref="createUserForm" :model="createUserForm" :rules="userRuleValidate" :label-width="90">
                <Form-item label="User name" prop="username">
                    <Input v-model="createUserForm.username" placeholder="User name"></Input>
                </Form-item>
                <Form-item label="Email" prop="email">
                    <Input v-model="createUserForm.email" placeholder="Email"></Input>
                </Form-item>
                <Form-item label="Password" prop="password">
                    <Input v-model="createUserForm.password" placeholder="Password"></Input>
                </Form-item>
                <Form-item label="Company" prop="company">
                    <Input v-model="createUserForm.company" placeholder="Company"></Input>
                    <span style="position: absolute;right: 10px;">*必须与工商执照一致</span>
                </Form-item>
                <Form-item label="User type">
                    <Radio-group v-model="createUserForm.type">
                        <Radio label="normal">normal</Radio>
                        <Radio label="super">super</Radio>
                    </Radio-group>
                </Form-item>
            </Form>
        </Modal>
        <Modal v-model="bindUserModal" title="Bind user" width="860" @on-ok="bindUser">
            <div class="bsc-user-box">
                <div class="user-card" v-show="user.show" :class="{'user-card-selected': user.selected}" @click="user.selected = !user.selected" v-for="user in allUserList">
                    {{user.email}}
                </div>
            </div>
        </Modal>
        <Modal v-model="createSubUserModal" title="add subUser" width="600" @on-ok="createSubUser">
            <div class="section-separator" v-show="!isEditSubUser">
                <span class="separator-icon"></span>
                <span class="separator-info">基础信息</span>
            </div>
            <Form ref="createSubUserForm" :model="createSubUserForm" :rules="subUserRuleValidate" :label-width="85" v-show="!isEditSubUser">
                <Form-item label="User name" prop="username">
                    <Input v-model="createSubUserForm.username" placeholder="User name"></Input>
                </Form-item>
                <Form-item label="Email" prop="email">
                    <Input v-model="createSubUserForm.email" placeholder="Email"></Input>
                </Form-item>
                <Form-item label="Password" prop="password">
                    <Input v-model="createSubUserForm.password" placeholder="Password"></Input>
                </Form-item>
                <Form-item label="Company" prop="company">
                    <Input v-model="createSubUserForm.company" placeholder="Company"></Input>
                </Form-item>
            </Form>
            <div class="section-separator">
                <span class="separator-icon"></span>
                <span class="separator-info">权限分配</span>
            </div>
            <Table class="table" :show-header="true" :stripe="true" :context="self" :highlight-row="true" :columns="bucketHeader" :data="createSubUserForm.acl" :no-data-text='$t("STORAGE.NO_FILE")'></Table>
        </Modal>
    </div>
</template>
<script>
import user from '@/store/modules/user'
import { handler } from '@/service/Aws'
import { BOUND_USER, ALL_USER, CREATE_USER, REDIRECT_BUCKET, SUB_USER, SUB_USER_ACL, UPDATE_SUB_USER_ACL, CREATE_SUB_USER, BIND_USER, UNBIND_USER } from '@/service/API'
export default {
    data () {
        return {
            self: this,
            userList: [],
            allUserList: [],
            bucketList: [],
            createSubUserModal: false,
            createUserModal: false,
            bindUserModal: false,
            isEditSubUser: false,
            bucketHeader: bucketHeaderSetting,
            iconSize: 18,
            isAdmin: user.state && user.state.type === 'admin',
            createUserForm: {
                username: '',
                email: '',
                password: '',
                company: '',
                type: 'normal'
            },
            userRuleValidate: {
                username: [
                    { required: true, message: 'Requires user name', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: 'Requires email', trigger: 'blur' },
                    { type: 'email', message: 'Email format is incorrect', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'Requires password', trigger: 'blur' },
                    { type: 'string', min: 6, message: 'Requires 6 characters', trigger: 'blur' }
                ],
                company: [
                    { required: true, message: 'Requires company', trigger: 'blur' },
                    { type: 'string', message: 'Email format is incorrect', trigger: 'blur' }
                ]
            },
            createSubUserForm: {
                username: '',
                email: '',
                password: '',
                company: '',
                acl: [{
                    bucket: '',
                    bucket_acl_obj: {READ: false, WRITE: false},
                    file_acl_obj: {READ: false, WRITE: false}
                }]
            },
            subUserRuleValidate: {
                username: [
                    { required: true, message: 'Requires user name', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: 'Requires email', trigger: 'blur' },
                    { type: 'email', message: 'Email format is incorrect', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'Requires password', trigger: 'blur' },
                    { type: 'string', min: 6, message: 'Requires 6 characters', trigger: 'blur' }
                ],
                company: [
                    { required: true, message: 'Requires company', trigger: 'blur' },
                    { type: 'string', message: 'Email format is incorrect', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        userHeader: function () {
            return this.isAdmin ? adminHeaderSetting : superHeaderSetting
        }
    },
    mounted () {
        this.getUserList()
    },
    methods: {
        async getUserList () {
            if (this.isAdmin) {
                this.userList = _.each(await this.$http.get(BOUND_USER), (user) => {
                    user.type = this.userType(user)
                })
            } else {
                try {
                    let res = await handler('listBuckets')
                    let users = await this.$http.get(SUB_USER)
                    Promise.all(Array.map(res.Buckets, (bucket) => {
                        return this.$http.get(SUB_USER_ACL, {params: {bucket: bucket.Name}}).then(acl => {
                            return {bucket: bucket.Name, acl: acl}
                        })
                    })).then(res => {
                        this.userList = _.each(users, (user) => {
                            user.acl = []
                            user.type = this.userType(user)
                            _.each(res, (bucket) => {
                                _.each(bucket.acl, (acl) => {
                                    convertObject2String({})
                                    if (user.email === acl.email && (acl.bucket_acl.length !== 0 || acl.file_acl.length !== 0)) {
                                        user.acl.push({
                                            bucket: bucket.bucket,
                                            bucket_acl: acl.bucket_acl,
                                            bucket_acl_obj: convertArray2Object(acl.bucket_acl),
                                            file_acl: acl.file_acl,
                                            file_acl_obj: convertArray2Object(acl.file_acl)
                                        })
                                    }
                                })
                            })
                        })
                    })
                    this.bucketList = res.Buckets
                } catch (error) {
                    console.log(error)
                    this.$Message.error(this.$t('DASHBOARD.GET_BUCKET_FAILED'))
                }
            }
        },
        async openBindUserModal () {
            let res = await this.$http.get(ALL_USER)
            _.each(res, user => {
                if (this.userList.indexOf(user) > 0) {
                    user.show = false
                } else {
                    user.show = true
                    user.selected = false
                }
            })
            this.allUserList = res
            this.bindUserModal = true
        },
        async bindUser () {
            await Promise.all(Array.map(this.allUserList, (user) => {
                if (user.selected) {
                    this.$http.post(BIND_USER, { email: user.email })
                    this.userList.push({ ...user, type: this.userType(user) })
                }
            }))
        },
        unbindUserConfirm (user, index) {
            this.$Modal.confirm({
                content: this.$t('STORAGE.UNBIND_CONFIRMED', {fileName: user.email}),
                okText: this.$t('PUBLIC.CONFIRMED'),
                cancelText: this.$t('PUBLIC.CANCLE'),
                onOk: () => this.unbindUser(user, index)
            })
        },
        unbindUser (user, index) {
            this.$http.post(UNBIND_USER, {email: user.email}).then(res => {
                this.userList.splice(index, 1)
            }, error => {
                this.$Message.error(error)
            })
        },
        async getAllUser () {
            this.allUserList = await this.$http.get(ALL_USER)
        },
        async getUserAcl () {
            try {
                let res = await handler('listBuckets')
                await Promise.all(Array.map(res.Buckets, (bucket) => {
                    this.$http.get(SUB_USER_ACL, {params: {bucket: bucket.Name}})
                }))
            } catch (error) {
                this.$Message.error(this.$t('DASHBOARD.GET_BUCKET_FAILED'))
            };
        },
        createUser () {
            let self = this
            this.$refs['createUserForm'].validate((valid) => {
                if (valid) {
                    self.$http.post(CREATE_USER, {...self.createUserForm}).then(res => {
                        self.createUserForm = { username: '', email: '', password: '', company: '', type: 'normal' }
                        this.getUserList()
                        this.$Message.success('Create user success')
                    }, error => {
                        this.$Message.error(error)
                    })
                } else {
                    this.$Message.error('Input validate failed')
                }
            })
        },
        async createSubUser () {
            if (this.editSubUser) {
                this.editSubUser()
            } else {
                try {
                    let user = await this.$http.post(CREATE_SUB_USER, {...this.createSubUserForm, type: 'sub'})
                    Promise.all(Array.map(this.bucketList, (bucket) => {
                        return this.$http.post(REDIRECT_BUCKET, {
                            original: bucket.Name,
                            email: user.email,
                            redirect: bucket.Name + '-' + user.email.replace(/\W|_/g, '').toLowerCase(),
                            bucket_acl: ['READ'],
                            file_acl: ['READ']
                        })
                    })).then(res => {
                        this.getUserList()
                        this.$Message.success('Create sub user success')
                    })
                } catch (error) {}
            }
        },
        editSubUserModal (user) {
            this.createSubUserForm = user
            this.isEditSubUser = true
            this.createSubUserModal = true
        },
        async editSubUser () {
            console.log(this.createSubUserForm)
            try {
                Promise.all(Array.map(this.createSubUserForm.acl, (acl) => {
                    return this.$http.post(UPDATE_SUB_USER_ACL, {
                        email: this.createSubUserForm.email,
                        bucket: acl.bucket,
                        bucket_acl: ['READ'],
                        file_acl: ['READ']
                    })
                })).then(res => {
                    this.getUserList()
                    this.$Message.success('Create sub user success')
                })
            } catch (error) {

            }
        },
        createRedirectBucket () {
            let self = this
            this.$refs['redirectBucketForm'].validate((valid) => {
                if (valid) {
                    self.$http.post(REDIRECT_BUCKET, {...self.redirectBucketForm, original: self.selectedBucket.Name}).then(res => {
                        self.redirectBucketForm = { redirect: '', email: '' }
                        this.$Message.success('Create bucket alias success')
                    }, error => {
                        this.$Message.error(error)
                    })
                } else {
                    this.$Message.error('Input validate failed')
                }
            })
        },
        userType (user) {
            let type = user.info.type
            return type === 'normal' ? '普通账号' : type === 'sub' ? '子账号' : type === 'admin' ? '管理员账号' : '超级账号'
        }
    }
}

const superHeaderSetting = [
    {
        title: 'User name',
        width: 150,
        align: 'left',
        key: 'username'
    },
    {
        title: 'Type',
        width: 80,
        align: 'left',
        key: 'type'
    },
    {
        title: 'Email',
        width: 250,
        align: 'left',
        key: 'email'
    },
    {
        title: 'Acl',
        width: 400,
        align: 'left',
        key: 'acl',
        render (row, column, index) {
            return Array.map(row.acl, (acl) => {
                return `${acl.bucket} - bucket:${acl.bucket_acl} - file:${acl.file_acl}`
            })
        }
    },
    {
        title: 'Actions',
        key: 'actions',
        width: 80,
        align: 'left',
        render (row, column, index) {
            return `<i-button size="small" @click="editSubUserModal(row, ${index})"><Icon type="compose" :size="iconSize"></Icon></i-button>`
        }
    }
]

const adminHeaderSetting = [
    {
        title: 'User name',
        width: 150,
        align: 'left',
        key: 'username'
    },
    {
        title: 'Type',
        width: 80,
        align: 'left',
        key: 'type'
    },
    {
        title: 'Email',
        width: 250,
        align: 'left',
        key: 'email'
    },
    {
        title: 'Actions',
        key: 'actions',
        width: 50,
        align: 'left',
        render (row, column, index) {
            return `<Tooltip content='unbind' placement="top"><i-button size="small" @click="unbindUserConfirm(row,${index})"><Icon type="ios-trash" :size="iconSize"></Icon></i-button></Tooltip>`
        }
    }
]

const bucketHeaderSetting = [
    {
        title: 'Bucket name',
        width: 150,
        align: 'left',
        key: 'bucket'
    },
    {
        title: 'Bucekt permission',
        width: 200,
        align: 'left',
        key: 'bucket_acl',
        render (row, column, index) {
            return `<Checkbox v-model="row.bucket_acl_obj.READ">Read</Checkbox>    <Checkbox v-model="row.bucket_acl_obj.WRITE">Write</Checkbox>`
        }
    },
    {
        title: 'File permission',
        width: 200,
        align: 'left',
        key: 'file_acl',
        render (row, column, index) {
            return `<Checkbox v-model="row.file_acl_obj.READ">Read</Checkbox>    <Checkbox v-model="row.file_acl_obj.WRITE">Write</Checkbox>`
        }
    }
]

const convertObject2String = (object) => {
    if (!object) { return }
    let truePermission = {}
    _.each(object, function (value, key) {
        if (value) { truePermission[key] = true }
    })
    return _.keys(truePermission).toString()
}

const convertArray2Object = (array) => {
    let aclObj = {}
    if (array.length) {
        _.each(array, item => {
            aclObj[item] = true
        })
    }
    return aclObj
}
</script>
<style lang="less" scoped>

@import '../../styles/index.less';

@user-card-width: 200px;
@user-card-height: 25px;
@user-card-text-color: #657180;
@user-card-border-color: #d7dde4;
@user-card-backgrand: #f5f7f9;
@user-card-backgrand-hover: #d9d9d9;

.@{css-prefix}user {
    & > div.table {
        margin-top: 16px;
    }
}

.@{css-prefix}user-box {
    min-height: 100%;
    max-height: 600px;
    overflow: scroll;
    width: 100%;
    display: inline-flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;

    .user-card {
        width: @user-card-width;
        height: @user-card-height;
        color: @user-card-text-color;
        background-color: @user-card-backgrand;
        line-height: @user-card-height;
        text-align: center;
        border-radius: @common-radius;
        margin: 3px 3px 0 0;
        padding: 0 3px;
        text-overflow: ellipsis;
        overflow:hidden;
        white-space:nowrap;
        cursor: pointer;

        &:hover {
            background-color: @user-card-backgrand-hover;
        }
    }

    .user-card-selected {
        background-color: @user-card-backgrand-hover;
    }
}

</style>
