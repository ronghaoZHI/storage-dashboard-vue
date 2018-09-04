<template>
  <div class="bsc-keychain">
    <div class="section-add-card"
         v-show="!isAdmin">
      <Button type="primary"
              @click="addKeychain">{{$t("KEYCHAIN.ADD_KEY")}}</Button>
    </div>
    <div class="section-card-list">
      <keychain-card v-for="(key) in data"
                     :keychain="key"
                     :work="data.length === 1"
                     v-on:deleteKey="deleteKeychain"
                     :key="key.ts"></keychain-card>
    </div>
    <Spin size="bigger"
          fix
          v-if="spinShow"></Spin>
  </div>
</template>
<script>
import { getAccesskey, postAccesskey, deleteAccesskey } from 'api/login'
import { clear } from '@/service/Aws'
import keychainCard from './KeychainCard'
import store from '@/store'
import moment from 'moment'
export default {
  components: {
    keychainCard,
  },
  data() {
    return {
      data: [],
      spinShow: true,
    }
  },
  computed: {
    isAdmin() {
      return this.$store.getters.mode === 'manage'
    },
  },
  created() {
    this.getKeychainList()
  },
  methods: {
    async getKeychainList() {
      this.spinShow = true
      this.$Loading.start()
      try {
        let keys = this.isAdmin ? store.state.keys : await getAccesskey()
        this.data = await _.forEach(keys, (item) => {
          item.ts = item.LastModified = moment(item.ts).format(
            'YYYY-MM-DD HH:mm',
          )
        })
        this.$Loading.finish()
        this.spinShow = false
      } catch (error) {
        this.$Loading.error()
        this.spinShow = false
        this.$Message.warning(error)
      }
    },
    async addKeychain() {
      this.$Loading.start()
      try {
        await postAccesskey()
        this.getKeychainList()
        this.$Loading.finish()
      } catch (error) {
        this.$Loading.error()
        console.log(error)
      }
    },
    async deleteKeychain(accesskey) {
      this.$Loading.start()
      try {
        await deleteAccesskey({ accesskey: accesskey })
        await clear()
        this.getKeychainList()
        this.$Loading.finish()
      } catch (error) {
        this.$Loading.error()
        console.log(error)
      }
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';
.dark .@{css-prefix}keychain {
  .section-add-card {
    border-bottom: @common-border-dark;
  }
}

.@{css-prefix}keychain {
  min-height: 100%;
  width: 100%;

  .section-add-card {
    border-bottom: 1px solid #e5e9f2;
    padding-bottom: 20px;
    margin-bottom: 14px;
  }

  .section-card-list {
    .fb(flex-start, flex-start);
    flex-wrap: wrap;
  }
}
</style>
