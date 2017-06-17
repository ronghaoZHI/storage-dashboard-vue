<template>
    <div class="bsc-user">
        <Button type="primary" v-show="!isAdmin">新建子账号</Button>
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
        <Modal v-model="redirectBucketModal" title="Add a redirect bucket and authorize it to the user" @on-ok="createRedirectBucket" @on-cancel="redirectBucketModal = ''">
            <Form ref="redirectBucketForm" :model="redirectBucketForm" :rules="redirectBucketRuleValidate" :label-width="90">
                <Form-item label="Bucket alias" prop="redirect">
                    <Input v-model="redirectBucketForm.redirect" placeholder="Bucket alias"></Input>
                </Form-item>
                <Form-item label="User email" prop="email">
                    <Input v-model="redirectBucketForm.email" placeholder="User email"></Input>
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
    </div>
</template>
<script>
import user from '@/store/modules/user'
import { handler } from '@/service/Aws'
import { BOUND_USER, ALL_USER, CREATE_USER, REDIRECT_BUCKET, SUB_USER, SUB_USER_ACL, BIND_USER, UNBIND_USER } from '@/service/API'
export default {
    data () {
        return {
            self: this,
            userList: [],
            allUserList: [],
            redirectBucketModal: false,
            createUserModal: false,
            bindUserModal: false,
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
            redirectBucketForm: {
                redirect: '',
                email: ''
            },
            redirectBucketRuleValidate: {
                redirect: [
                    { required: true, message: 'Requires bucket alias', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: 'Requires user email', trigger: 'blur' },
                    { type: 'email', message: 'Email format is incorrect', trigger: 'blur' }
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
            try {
                console.log(ALL_USER, CREATE_USER, REDIRECT_BUCKET, BIND_USER, UNBIND_USER)
                let res = await this.$http.get(this.isAdmin ? BOUND_USER : SUB_USER)
                console.log(res)
                this.userList = _.each(res.data, (user) => {
                    user.type = this.userType(user)
                })
            } catch (error) {
                this.$Message.warning(error)
                await this.$store.dispatch('logout')
                this.$router.push({
                    path: '/login',
                    query: { redirect: '/user' }
                })
            }
        },
        async openBindUserModal () {
            try {
                let res = await this.$http.get(ALL_USER)
                _.each(res.data, user => {
                    if (this.userList.indexOf(user) > 0) {
                        user.show = false
                    } else {
                        user.show = true
                        user.selected = false
                    }
                })
                this.allUserList = res.data
                this.bindUserModal = true
            } catch (error) {
                this.$Message.warning(error)
                await this.$store.dispatch('logout')
                this.$router.push({
                    path: '/login',
                    query: { redirect: '/user' }
                })
            }
        },
        async bindUser () {
            try {
                await Promise.all(Array.map(this.allUserList, (user) => {
                    if (user.selected) {
                        this.$http.post(BIND_USER, {email: user.email})
                        this.userList.push({...user, type: this.userType(user)})
                    }
                }))
            } catch (error) {
                this.$Message.warning(error)
            }
        },
        unbindUser (user, index) {
            this.$http.post(UNBIND_USER, {email: user.email}).then(res => {
                this.userList.splice(index, 1)
            }, error => {
                this.$Message.error(error)
            })
        },
        async getAllUser () {
            try {
                let res = await this.$http.get(ALL_USER)
                this.allUserList = res.data
            } catch (error) {
                this.$Message.warning(error)
                await this.$store.dispatch('logout')
                this.$router.push({
                    path: '/login',
                    query: { redirect: '/user' }
                })
            }
        },
        async getSubUserAcl () {
            await this.$http.get()
        },
        async getUserAcl () {
            try {
                let res = await handler('listBuckets')
                await Promise.all(Array.map(res.Buckets, (bucket) => {
                    console.log(bucket)
                    this.$http.get(SUB_USER_ACL, {params: {bucket: bucket.Name}})
                }))
            } catch (error) {
                console.log(error)
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
        key: 'company'
    },
    {
        title: 'Actions',
        key: 'actions',
        width: 100,
        align: 'left',
        render (row, column, index) {
            return 'test'
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
            return `<Tooltip content='unbind' placement="top"><i-button size="small" @click="unbindUser(row,${index})"><Icon type="ios-trash" :size="iconSize"></Icon></i-button></Tooltip>`
        }
    }
]
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
