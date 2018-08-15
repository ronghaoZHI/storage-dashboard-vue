<template>
  <div>
    <Button type="primary"
            @click="createModal = true">{{$t('SETTINGS.BIND_CUSTOME_DOMAIN')}}</Button>
    <p class="page-info">{{$t('SETTINGS.DOMAIN_INFO')}}</p>
    <Table border
           :stripe="true"
           :columns="listHeader"
           :data="listData"
           :no-data-text="noDataText"></Table>
    <Modal v-model="createModal"
           :title="$t('SETTINGS.BIND_CUSTOME_DOMAIN')"
           @on-ok="addDomain"
           @on-cancel="newDomain = ''">
      <Input v-model="newDomain"
             autofocus
             @on-enter="addDomain"
             :placeholder="$t('SETTINGS.BIND_DOMAIN_PLACEHOLDER')"
             @on-change="newDomainTest" />
      <span class="info-input-error">{{inputCheck ? '' : $t("SETTINGS.INVALID_DOMAIN")}}</span>
    </Modal>
  </div>
</template>
<script>
import { CUSTOM_DOMAIN } from '@/service/API'
export default {
  data() {
    return {
      createModal: false,
      listData: [],
      newDomain: '',
      inputCheck: true,
      noDataText: this.$t('STORAGE.NO_LIST'),
      listHeader: [
        {
          title: this.$t('SETTINGS.BOUND_DOMAIN'),
          key: 'domain'
        },
        {
          title: this.$t('VIDEO.OPERATION'),
          width: '82px',
          render: (h, params) => {
            return h(
              'Tooltip',
              {
                props: {
                  content: this.$t('PUBLIC.DELETE'),
                  delay: 1000,
                  placement: 'top'
                }
              },
              [
                h(
                  'i-button',
                  {
                    props: {
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.deleteConfirm(params.row)
                      }
                    }
                  },
                  [
                    h('Icon', {
                      props: {
                        type: 'ios-trash',
                        size: this.iconSize
                      }
                    })
                  ]
                )
              ]
            )
          }
        }
      ]
    }
  },
  computed: {
    bucket() {
      return this.$route.params.bucket
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        let res = await this.$http.get(`${CUSTOM_DOMAIN}/${this.bucket}`)
        this.listData = res.map((domain) => {
          return { domain }
        })
      } catch (error) {
        console.log(error)
        this.noDataText = `${this.$t('PUBLIC.GET_LIST_FAIL')} ${error.msg}`
        this.$Message.error(this.$t('PUBLIC.GET_LIST_FAIL'))
      }
    },
    deleteConfirm(row) {
      this.$Modal.confirm({
        content: this.$t('SETTINGS.DOMAIN_DELETE_CONFIRM', {
          domain: row.domain
        }),
        okText: this.$t('PUBLIC.CONFIRMED'),
        cancelText: this.$t('PUBLIC.CANCLE'),
        title: this.$t('PUBLIC.DELETE'),
        onOk: () => this.deleteDomain(row)
      })
    },
    async deleteDomain(row) {
      try {
        await this.$http.delete(`${CUSTOM_DOMAIN}/${this.bucket}`, {
          params: { custom_domain: row.domain }
        })
        this.listData.splice(row._index, 1)
        this.$Message.success(this.$t('PUBLIC.OPTIONS_SUCCESS'))
      } catch (error) {
        console.log(error)
      }
    },
    async addDomain() {
      if (this.inputCheck) {
        try {
          await this.$http.post(`${CUSTOM_DOMAIN}/${this.bucket}`, {
            custom_domain: this.newDomain
          })
          this.listData.push({ domain: this.newDomain })
          this.$Message.success(this.$t('PUBLIC.OPTIONS_SUCCESS'))
          this.createModal = false
          this.newDomain = ''
        } catch (error) {
          console.log(error)
        }
      } else {
        this.$Message.error(this.$t('SETTINGS.INVALID_DOMAIN'))
      }
    },
    newDomainTest(value) {
      this.inputCheck = /^[a-zA-Z\d-]{0,63}(\.[a-zA-Z\d-]{0,63})+$/.test(
        this.newDomain
      )
    }
  }
}
</script>
<style lang="less" scoped>
.page-info {
  padding: 16px 0 8px;
}
</style>
