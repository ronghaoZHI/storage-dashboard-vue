<template>
    <div class="bsc-user">
        <Button type="primary" v-show="!isAdmin" @click="openCreateSubUserModal">{{$t("USER.CREATE_SUB_USER")}}</Button>
        <Button type="primary" v-show="isAdmin" @click="createUserModal = true">{{$t("USER.CREATE_USER")}}</Button>
        <Button type="primary" v-show="isAdmin" @click="openBindUserModal">{{$t("USER.BIND_USER")}}</Button>
        <Table class="table" :show-header="true" :stripe="true" :context="self" :highlight-row="true" :columns="userHeader" :data="userList" :no-data-text='$t("USER.NO_USER")'></Table>
        <Modal v-model="createUserModal" :title='$t("USER.CREATE_USER")' @on-ok="createUser" @on-cancel="createBucketValue = ''">
            <Form ref="createUserForm" :model="createUserForm" :rules="userRuleValidate" :label-width="90">
                <Form-item :label='$t("USER.USER_NAME")' prop="username">
                    <Input v-model="createUserForm.username" placeholder="User name"></Input>
                </Form-item>
                <Form-item :label='$t("USER.EMAILL")' prop="email">
                    <Input v-model="createUserForm.email" placeholder="Email"></Input>
                </Form-item>
                <Form-item :label='$t("USER.PASSWORD")' prop="password">
                    <Input v-model="createUserForm.password" placeholder="Password"></Input>
                </Form-item>
                <Form-item :label='$t("USER.COMPANY")' prop="company">
                    <Input v-model="createUserForm.company" placeholder="Company"></Input>
                    <span style="position: absolute;right: 10px;">*必须与工商执照一致</span>
                </Form-item>
                <Form-item :label='$t("USER.USER_TYPE")'>
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
        <Modal v-model="createSubUserModal" :title='$t("USER.CREATE_SUB_USER")' width="600" @on-ok="createSubUser">
            <div class="section-separator" v-show="!isEditSubUser">
                <span class="separator-icon"></span>
                <span class="separator-info">{{$t("USER.BASE_INFO")}}</span>
            </div>
            <Form ref="createSubUserForm" :model="createSubUserForm" :rules="subUserRuleValidate" :label-width="85" v-show="!isEditSubUser">
                <Form-item :label='$t("USER.USER_NAME")' prop="username">
                    <Input v-model="createSubUserForm.username" :placeholder='$t("USER.REQUIRE_USER_NAME")'></Input>
                </Form-item>
                <Form-item :label='$t("USER.EMAILL")' prop="email">
                    <Input v-model="createSubUserForm.email" :placeholder='$t("LOGIN.EMAILL_ALERT")'></Input>
                </Form-item>
                <Form-item :label='$t("USER.PASSWORD")' prop="password">
                    <Input v-model="createSubUserForm.password" :placeholder='$t("LOGIN.KEY_ALERT")'></Input>
                </Form-item>
                <Form-item :label='$t("USER.COMPANY")' prop="company">
                    <Input v-model="createSubUserForm.company" :placeholder='$t("USER.REQUIRE_COMPANY")'></Input>
                </Form-item>
            </Form>
            <div class="section-separator">
                <span class="separator-icon"></span>
                <span class="separator-info">{{$t("USER.BASE_INFO")}}</span>
            </div>
            <table class="table-bucket-acl">
                <thead>
                    <tr>
                        <th>{{$t("USER.BUCKET_NAME")}}</th>
                        <th>{{$t("USER.BUCKET_PERMISSON")}}</th>
                        <th>{{$t("USER.FILE_PERMISSON")}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in createSubUserForm.acl">
                        <td>{{row.bucket}}</td>
                        <td><Checkbox v-model="row.bucket_acl_obj.READ">{{$t("USER.READ")}}</Checkbox> <Checkbox v-model="row.bucket_acl_obj.WRITE">{{$t("USER.WRITE")}}</Checkbox></td>
                        <td><Checkbox v-model="row.file_acl_obj.READ">{{$t("USER.READ")}}</Checkbox> <Checkbox v-model="row.file_acl_obj.WRITE">{{$t("USER.WRITE")}}</Checkbox></td>
                    </tr>
                </tbody>
            </table>
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
            createSubUserForm: initSubUser(),
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
            this.$Loading.start()
            try {
                if (this.isAdmin) {
                    this.userList = _.each(await this.$http.get(BOUND_USER), (user) => {
                        user.type = this.userType(user)
                    })
                    await this.$Loading.finish()
                    await this.$store.dispatch('setUserInfo', {
                        ...user.state,
                        subUserList: this.userList
                    })
                } else {
                    let [res, users] = await Promise.all([handler('listBuckets'), this.$http.get(SUB_USER)])
                    Promise.all(Array.map(res.Buckets, (bucket) => {
                        this.bucketList = res.Buckets
                        return this.$http.get(SUB_USER_ACL, { params: { bucket: bucket.Name } }).then(acl => {
                            return { bucket: bucket.Name, acl: acl }
                        })
                    })).then(res => {
                        return this.userList = _.each(users, (user) => {
                            user.acl = []
                            user.type = this.userType(user)
                            _.each(res, (bucket) => {
                                _.each(bucket.acl, (acl) => {
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
                    }).then(res => {
                        this.$Loading.finish()
                    })
                }
            } catch (error) {
                this.$Loading.error()
                this.$Message.error(this.$t('DASHBOARD.GET_BUCKET_FAILED'))
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
            this.$Loading.start()
            try {
                await Promise.all(Array.map(this.allUserList, (user) => {
                    if (user.selected) {
                        this.$http.post(BIND_USER, { email: user.email })
                        this.userList.push({ ...user, type: this.userType(user) })
                    }
                }))
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
            }
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
        createUser () {
            let self = this
            this.$refs['createUserForm'].validate((valid) => {
                if (valid) {
                    this.$Loading.start()
                    self.$http.post(CREATE_USER, {...self.createUserForm}).then(res => {
                        self.createUserForm = { username: '', email: '', password: '', company: '', type: 'normal' }
                        this.getUserList()
                        this.$Message.success('Create user success')
                        this.$Loading.finish()
                    }, error => {
                        this.$Loading.error()
                        this.$Message.error(error)
                    })
                } else {
                    this.$Message.error('Input validate failed')
                }
            })
        },
        openCreateSubUserModal () {
            _.extend(this, {
                isEditSubUser: false,
                createSubUserModal: true,
                createSubUserForm: initSubUser(Array.map(this.bucketList, (bucket) => {
                    return {
                        bucket: bucket.Name,
                        bucket_acl_obj: { READ: false, WRITE: false },
                        file_acl_obj: { READ: false, WRITE: false }
                    }
                }))
            })
        },
        async createSubUser () {
            if (this.isEditSubUser) {
                this.editSubUser()
            } else {
                try {
                    this.$Loading.start()
                    let user = await this.$http.post(CREATE_SUB_USER, {...this.createSubUserForm, type: 'sub'})
                    Promise.all(Array.map(this.createSubUserForm.acl, (bucket) => {
                        if (convertObject2Array(bucket.bucket_acl_obj).length > 0 || convertObject2Array(bucket.file_acl_obj).length > 0) {
                            return this.$http.post(REDIRECT_BUCKET, {
                                original: bucket.bucket,
                                email: user.email,
                                redirect: bucket.bucket + '-' + user.username.replace(/\W|_/g, '').toLowerCase(),
                                bucket_acl: convertObject2Array(bucket.bucket_acl_obj),
                                file_acl: convertObject2Array(bucket.file_acl_obj)
                            })
                        }
                    })).then(res => {
                        this.getUserList()
                        this.$Message.success('Create sub user success')
                    })
                } catch (error) {
                    this.$Message.error('Create sub user error')
                    this.$Loading.error()
                }
            }
        },
        editSubUserModal (user) {
            _.extend(this, {
                isEditSubUser: true,
                createSubUserModal: true,
                createSubUserForm: user.acl.length > 0 ? convertBucketList(user, this.bucketList) : _.extend(user, {acl: (Array.map(this.bucketList, (bucket) => {
                    return {
                        bucket: bucket.Name,
                        bucket_acl_obj: { READ: false, WRITE: false },
                        file_acl_obj: { READ: false, WRITE: false }
                    }
                }))})
            })
        },
        async editSubUser () {
            try {
                this.$Loading.start()
                Promise.all(Array.map(this.createSubUserForm.acl, (acl) => {
                    console.log('acls', this.createSubUserForm.acl)
                    return this.$http.post(UPDATE_SUB_USER_ACL, {
                        email: this.createSubUserForm.email,
                        bucket: acl.bucket,
                        bucket_acl: convertObject2Array(acl.bucket_acl_obj),
                        file_acl: convertObject2Array(acl.file_acl_obj)
                    })
                })).then(res => {
                    this.getUserList()
                    this.$Message.success('Update sub user success')
                })
            } catch (error) {
                this.$Message.error('Update sub user error')
                this.$Loading.error()
            }
            this.isEditSubUser = false
        },
        userType (user) {
            let type = user.info.type
            return type === 'normal' ? this.$t('USER.GENERAL_USER') : type === 'sub' ? this.$t('USER.SUB_USER') : type === 'admin' ? this.$t('USER.ADMIN') : this.$t('USER.SUPER_USER')
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
            return `<i-button size="small" @click="unbindUserConfirm(row,${index})">Unbind</i-button>`
        }
    }
]

const initSubUser = (acls) => {
    return {
        username: '',
        email: '',
        password: '',
        company: '',
        acl: acls || [{
            bucket: '',
            bucket_acl_obj: { READ: false, WRITE: false },
            file_acl_obj: { READ: false, WRITE: false }
        }]
    }
}

const convertBucketList = (user, bucketList) => {
    if (user.acl.length !== bucketList.length) {
        let bucketNameArray = Array.map(user.acl, bucket => {
            return bucket.bucket
        })
        _.each(bucketList, (bucket) => {
            if (bucketNameArray.indexOf(bucket.Name) === -1) {
                user.acl.push({
                    bucket: bucket.Name,
                    bucket_acl_obj: { READ: false, WRITE: false },
                    file_acl_obj: { READ: false, WRITE: false },
                    redirect: false
                })
            }
        })
    }
    return user
}

const convertObject2Array = (object) => {
    if (!object) { return }
    let truePermission = {}
    _.each(object, function (value, key) {
        if (value) { truePermission[key] = true }
    })
    return _.keys(truePermission)
}

const convertArray2Object = (array) => {
    let aclObj = {
        READ: false,
        WRITE: false
    }
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


.table-bucket-acl {
    width: 100%;    
    border: 1px solid #d7dde4;
    border-collapse:collapse;

    th,td {
        width: 33%;
        height: 40px;
        line-height: 40px;
        text-align: left;
        padding-left: 12px;
        text-overflow: ellipsis;
        vertical-align: middle;
        border-bottom: 1px solid #e3e8ee;
    }

    tr {
    }
}


</style>
