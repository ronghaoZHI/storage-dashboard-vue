<template>
    <div>
        <Table :columns="columns" :data="data" no-data-text="No data"></Table>
    </div>
</template>
<script>
import { ACCESSKEY } from '@/service/API'
import user from '@/store/modules/user'
import moment from 'moment'
export default {
    data () {
        return {
            columns: [
                {
                    title: 'Accesskey',
                    key: 'accesskey'
                },
                {
                    title: 'Secretkey',
                    key: 'secretkey'
                },
                {
                    title: 'Create time',
                    width: 140,
                    key: 'ts'
                }
            ],
            data: []
        }
    },
    mounted () {
        this.getKeychainList()
    },
    methods: {
        async getKeychainList () {
            this.$Loading.start()
            console.log(user.state.subUser)
            try {
                let keys = []
                if (user.state.type === 'admin') {
                    keys = user.state.subUser.keys
                } else {
                    let res = await this.$http.get(ACCESSKEY)
                    keys = res.data
                }
                this.data = await _.forEach(keys, (item) => {
                    item.ts = item.LastModified = moment(item.ts).format('YYYY-MM-DD HH:mm')
                })
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
                this.$Message.warning(this.$t('LOGIN.LOGIN_AGAIN'))
                this.$router.push({
                    path: '/login',
                    query: { redirect: '/keychain' }
                })
            }
        }
    }
}

</script>
<style lang="less" scoped>

</style>
