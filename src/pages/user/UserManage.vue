<template>
    <div class="bsc-user">
        <Button type="primary" v-show="!isAdmin">新建子账号</Button>
        <Button type="primary" v-show="isAdmin">申请账号</Button>
        <Button type="primary" v-show="isAdmin">关联账号</Button>
        <Table class="table" :show-header="true" :stripe="true" :context="self" :highlight-row="true" :columns="userHeader" :data="boundUserList" :no-data-text='$t("STORAGE.NO_FILE")'></Table>
    </div>
</template>
<script>
import user from '@/store/modules/user'
import { BOUND_USER, ALL_USER, CREATE_USER, REDIRECT_BUCKET } from '@/service/API'
export default {
    data () {
        return {
            self: this,
            boundUserList: [],
            isAdmin: user.state && user.state.type === 'admin',
            userHeader: headerSetting
        }
    },
    mounted () {
        this.getUserBoundUser()
    },
    methods: {
        async getUserBoundUser () {
            try {
                console.log(ALL_USER, CREATE_USER, REDIRECT_BUCKET)
                let res = await this.$http.get(BOUND_USER)
                console.log(res)
                this.boundUserList = _.each(res.data, (user) => {
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
