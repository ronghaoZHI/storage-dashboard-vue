<template>
    <div class="bsc-keychain">
        <div class="section-add-card" v-show="!isAdmin">
            <Button type="primary" @click="addKeychain">{{$t("KEYCHAIN.ADD_KEY")}}</Button>
        </div>
        <div class="section-card-list">
            <keychain-card v-for="(key, index) in data" :keychain="key" :work="data.length === 1" v-on:deleteKey="deleteKeychain" :key="key.ts"></keychain-card>
        </div>
        <Spin size="bigger" fix v-if="spinShow"></Spin>
    </div>
</template>
<script>
import { ACCESSKEY } from '@/service/API'
import { clear } from '@/service/Aws'
import keychainCard from './KeychainCard'
import user from '@/store/modules/user'
import moment from 'moment'
export default {
    data () {
        return {
            data: [],
            spinShow: true,
            isAdmin: user.state.type === 'admin'
        }
    },
    created () {
        this.getKeychainList()
    },
    components: {
        keychainCard
    },
    methods: {
        async getKeychainList () {
            this.spinShow = true
            this.$Loading.start()
            try {
                let keys = user.state.type === 'admin' ? user.state.subUser.keys : await this.$http.get(ACCESSKEY)
                this.data = await _.forEach(keys, (item) => {
                    item.ts = item.LastModified = moment(item.ts).format('YYYY-MM-DD HH:mm')
                })
                this.$Loading.finish()
                this.spinShow = false
            } catch (error) {
                this.$Loading.error()
                this.spinShow = false
                this.$Message.warning(error)
            }
        },
        async addKeychain () {
            this.$Loading.start()
            try {
                await this.$http.post(ACCESSKEY)
                this.getKeychainList()
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
                console.log(error)
            }
        },
        async deleteKeychain (accesskey) {
            this.$Loading.start()
            try {
                await this.$http.delete(ACCESSKEY, {params: {accesskey: accesskey}})
                await clear()
                this.getKeychainList()
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
                console.log(error)
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

    .section-add-card {
        height: 40px;
    }
    
    .section-card-list {
        .fb(flex-start, flex-start);
        flex-wrap: wrap;
    }
}
</style>
