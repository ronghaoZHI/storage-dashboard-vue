<template>
    <div class="bsc-keychain">
        <keychain-card v-for="key in data" :keychain="key" :key="key.ts"></keychain-card>
    </div>
</template>
<script>
import { ACCESSKEY } from '@/service/API'
import keychainCard from './KeychainCard'
import user from '@/store/modules/user'
import moment from 'moment'
export default {
    data () {
        return {
            data: []
        }
    },
    mounted () {
        this.getKeychainList()
    },
    components: {
        keychainCard
    },
    methods: {
        async getKeychainList () {
            this.$Loading.start()
            try {
                let keys = []
                if (user.state.type === 'admin') {
                    keys = user.state.subUser.keys
                } else {
                    keys = await this.$http.get(ACCESSKEY)
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
@import '../../styles/index.less';

.@{css-prefix}keychain {
    min-height: 100%;
    width: 100%;
    .fb(flex-start, flex-start);
    flex-wrap: wrap;
}
</style>
