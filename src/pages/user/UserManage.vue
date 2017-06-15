<template>
    <div class="bsc-user">
        <Button type="primary" v-show="!isAdmin">新建子账号</Button>
        <Button type="primary" v-show="isAdmin" @click="createUserModal = true">创建账号</Button>
        <Button type="primary" v-show="isAdmin">关联账号</Button>
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
                </Form-item>
                <Form-item label="Type" prop="type">
                    <Input v-model="createUserForm.type" placeholder="Type"></Input>
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
    </div>
</template>
<script>
import user from '@/store/modules/user'
import { BOUND_USER, ALL_USER, CREATE_USER, REDIRECT_BUCKET, SUB_USER } from '@/service/API'
export default {
    data () {
        return {
            self: this,
            userList: [],
            redirectBucketModal: false,
            createUserModal: false,
            isAdmin: user.state && user.state.type === 'admin',
            userHeader: headerSetting,
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
    mounted () {
        this.getUserUser()
    },
    methods: {
        async getUserUser () {
            try {
                console.log(ALL_USER, CREATE_USER, REDIRECT_BUCKET)
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
                    query: { redirect: '/dashboard' }
                })
            }
        },
        async getSubUserAcl () {
            await this.$http.get()
        },
        createUser () {
            let self = this
            this.$refs['createUserForm'].validate((valid) => {
                if (valid) {
                    self.$http.post(CREATE_USER, {...self.createUserForm}).then(res => {
                        self.createUserForm = { username: '', email: '', password: '' }
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

const headerSetting = [
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
        title: 'Company',
        width: 100,
        align: 'left',
        key: 'company'
    },
    {
        title: 'Acl',
        width: 250,
        align: 'left',
        key: 'company'
    },
    {
        title: 'Actions',
        key: 'actions',
        width: 170,
        align: 'left',
        render (row, column, index) {
            return 'test'
        }
    }
]
</script>
<style lang="less" scoped>

@import '../../styles/index.less';

.@{css-prefix}user {
    & > div.table {
        margin-top: 16px;
    }
}
</style>
