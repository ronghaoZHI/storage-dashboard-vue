<template>
  <div>
    <div class="layout-bsc-toolbar layout-legend">
      <Button class="button-bsc-add-bucket"
              type="primary"
              @click="goOutputEdit('none', 'none')">{{$t('VIDEO.NEW_CONFIGURATION')}}</Button>
      <legend-list :data="legendList"></legend-list>
    </div>
    <Table border
           :context="self"
           :stripe="true"
           :columns="listHeader"
           :data="policyFront"
           :no-data-text="$t('STORAGE.NO_LIST')"></Table>
  </div>
</template>
<script>
import { handler } from '@/service/Aws'
import {
  getBucketPolicy,
  putBucketPolicy,
  getTranscodes,
} from '@/pages/video/data'
import legendList from '@/components/legend/legend'
export default {
  components: {
    legendList,
  },
  data() {
    return {
      iconSize: 18,
      self: this,
      policyFront: this.policyFront,
      legendList: [
        {
          icon: 'ios-toggle',
          text: 'VIDEO.STATUS',
        },
        {
          icon: 'compose',
          text: 'PUBLIC.EDIT',
        },
        {
          icon: 'ios-trash',
          text: 'PUBLIC.DELETE',
        },
      ],
      listHeader: [
        {
          title: 'ID',
          key: 'id',
        },
        {
          title: this.$t('VIDEO.INPUT_BUCKET'),
          width: '13%',
          key: 'input_bucket',
        },
        {
          title: this.$t('VIDEO.OUTPUT_BUCKET'),
          width: '13%',
          key: 'output_bucket',
        },
        {
          title: this.$t('VIDEO.KEYS_REG'),
          width: '17%',
          render: (h, params) => {
            if (params.row.allowed_keys_regex.length > 0) {
              return params.row.allowed_keys_regex.map((regex) =>
                h('p', `${regex}`),
              )
            }
          },
        },
        {
          title: this.$t('VIDEO.OUTPUT_KEY_PREFIX'),
          width: '13%',
          render: (h, params) => {
            return h('p', [params.row.output_key_prefix])
          },
        },
        {
          title: this.$t('VIDEO.OUTPUTS'),
          width: '15%',
          render: (h, params) => {
            let outputs = params.row.outputs || []
            const firstInputKey = outputs[0]
              ? outputs[0].watermarks
                ? outputs[0].watermarks[0].InputKey
                : '未启用'
              : ''
            if (outputs.length > 1) {
              const popContent = outputs.map((item) => {
                const sd = item.segment_duration || '-'
                const inputKey = item.watermarks
                  ? item.watermarks[0].InputKey
                  : '未启用'
                return h('p', [
                  `keySuffix:${item.key_suffix},`,
                  h('br'),
                  `${this.$t('VIDEO.VIDEO_TRANSCODING_TEMPLATE_ID')}:${
                    item.preset_id
                  },`,
                  h('br'),
                  `${this.$t('VIDEO.HLS_SLICE_LENGTH')}:${sd},`,
                  h('br'),
                  `水印文件key:${inputKey},`,
                  h('br'),
                ])
              })
              return h(
                'div',
                {
                  class: 'output-wrap',
                },
                [
                  h('p', [
                    `keySuffix:${outputs[0].key_suffix},`,
                    h('br'),
                    `${this.$t('VIDEO.VIDEO_TRANSCODING_TEMPLATE_ID')}:${
                      outputs[0].preset_id
                    },`,
                    h('br'),
                    `${this.$t('VIDEO.HLS_SLICE_LENGTH')}:${outputs[0]
                      .segment_duration || '-'},`,
                    h('br'),
                    `水印文件key:${firstInputKey},`,
                    h('br'),
                  ]),
                  h('Poptip', [
                    h(
                      'i-button',
                      {
                        props: {
                          type: 'ghost',
                          size: 'small',
                        },
                        class: 'button-more',
                      },
                      ['更多'],
                    ),
                    h(
                      'div',
                      {
                        slot: 'content',
                      },
                      [popContent],
                    ),
                  ]),
                ],
              )
            } else if (outputs.length > 0) {
              return h(
                'p',
                {
                  class: 'output-wrap',
                },
                [
                  `keySuffix:${outputs[0].key_suffix},`,
                  h('br'),
                  `${this.$t('VIDEO.VIDEO_TRANSCODING_TEMPLATE_ID')}:${
                    outputs[0].preset_id
                  },`,
                  h('br'),
                  `${this.$t('VIDEO.HLS_SLICE_LENGTH')}:${outputs[0]
                    .segment_duration || '-'},`,
                  h('br'),
                  `水印文件key:${firstInputKey},`,
                  h('br'),
                ],
              )
            }
          },
        },
        {
          title: this.$t('VIDEO.OPERATION'),
          key: 'actions',
          align: 'right',
          width: '170px',
          render: (h, params) => {
            return h('div', [
              h(
                'Tooltip',
                {
                  props: {
                    content: this.$t('VIDEO.STATUS'),
                    delay: 1000,
                    placement: 'top',
                  },
                  class: {
                    'mar-r-5': true,
                  },
                },
                [
                  h(
                    'i-switch',
                    {
                      props: {
                        value: params.row.is_enabled === 'true',
                        size: 'large',
                      },
                      on: {
                        input: () => {
                          this.changeStatus(params.row)
                        },
                      },
                    },
                    [
                      h(
                        'span',
                        {
                          slot: 'open',
                        },
                        this.$t('VIDEO.OPEN'),
                      ),
                      h(
                        'span',
                        {
                          slot: 'close',
                        },
                        this.$t('VIDEO.CLOSE'),
                      ),
                    ],
                  ),
                ],
              ),
              h(
                'Tooltip',
                {
                  props: {
                    content: this.$t('PUBLIC.EDIT'),
                    delay: 1000,
                    placement: 'top',
                  },
                  class: {
                    'mar-r-5': true,
                  },
                },
                [
                  h(
                    'i-button',
                    {
                      props: {
                        size: 'small',
                      },
                      on: {
                        click: () => {
                          this.goOutputEdit(
                            params.row.input_bucket,
                            params.row.id,
                          )
                        },
                      },
                    },
                    [
                      h('Icon', {
                        props: {
                          type: 'compose',
                          size: this.iconSize,
                        },
                      }),
                    ],
                  ),
                ],
              ),
              h(
                'Tooltip',
                {
                  props: {
                    content: this.$t('PUBLIC.DELETE'),
                    delay: 1000,
                    placement: 'top',
                  },
                },
                [
                  h(
                    'i-button',
                    {
                      props: {
                        size: 'small',
                      },
                      on: {
                        click: () => {
                          this.deletePolicyConfirm(params.row)
                        },
                      },
                    },
                    [
                      h('Icon', {
                        props: {
                          type: 'ios-trash',
                          size: this.iconSize,
                        },
                      }),
                    ],
                  ),
                ],
              ),
            ])
          },
        },
      ],
    }
  },
  created() {
    this.listPolify()
  },
  methods: {
    async listPolify() {
      const bucketNames = await this.getBucketNames()
      try {
        this.$Loading.start()
        let polifyList = await Promise.all(
          bucketNames.map((bucket) => {
            return getBucketPolicy(bucket)
          }),
        )
        this.policyFront = this.convert2Front(polifyList)
        this.$Loading.finish()
      } catch (error) {
        this.$Loading.error()
      }
    },
    async getBucketNames() {
      this.$Loading.start()
      try {
        let res = await this.$store.dispatch('getBuckets')
        return _.map(res.Buckets, (bucket) => bucket.Name)
      } catch (error) {
        this.$Loading.error()
      }
    },
    convert2Front(data) {
      let front = []
      data.map((item) => {
        if (item.data) {
          const policy = JSON.parse(item.data.Policy)
          const transcode = policy.post_upload_transcoding
          if (transcode && transcode.length > 0) {
            transcode.forEach((setting) => {
              setting.input_bucket = item.bucket
            })
            front.push(...transcode)
          }
        }
      })
      return front
    },
    deletePolicyConfirm(policy) {
      this.$Modal.confirm({
        content: this.$t('STORAGE.DELETE_CONFIRMED', { fileName: policy.id }),
        okText: this.$t('PUBLIC.CONFIRMED'),
        cancelText: this.$t('PUBLIC.CANCLE'),
        title: this.$t('PUBLIC.DELETE'),
        onOk: () =>
          this.deletePolicy(policy.input_bucket, policy.id, policy._index),
      })
    },
    async deletePolicy(bucket, id, index) {
      try {
        this.$Loading.start()
        let trans = await getTranscodes(bucket)
        if (trans) {
          let newData = trans.filter((item) => {
            return item.id !== id
          })
          await putBucketPolicy(bucket, newData)
        }
        this.policyFront.splice(index, 1)
        this.$Message.success(this.$t('VIDEO.DELETED_SUCCESSFULLY'))
      } catch (error) {
        console.log(error)
        this.$Message.error(this.$t('VIDEO.FAILED_TO_DELETE'))
      }
    },
    async getTranscode(bucket) {
      let res = await this.getBucketPolicy(bucket)
      const policy =
        res.data && res.data.Policy ? JSON.parse(res.data.Policy) : {}
      let transcodes = []
      if (
        policy &&
        policy.post_upload_transcoding &&
        policy.post_upload_transcoding.length > 0
      ) {
        transcodes = policy.post_upload_transcoding
      }
      return transcodes
    },
    async putBucketPolicy(bucket, data) {
      const policy = {
        name: 'post_upload_transcoding',
        value: data,
      }
      try {
        return handler('putBucketPolicy', {
          Bucket: bucket,
          Policy: JSON.stringify(policy),
        })
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async changeStatus(data) {
      this.$Loading.start()
      const bucket = data.input_bucket
      const id = data.id
      const enable = this.policyFront[data._index].is_enabled
      this.policyFront[data._index].is_enabled =
        enable === 'true' ? 'false' : 'true'
      try {
        let trans = await getTranscodes(bucket)
        if (trans) {
          trans.forEach((item) => {
            if (item.id === id) {
              item.is_enabled = item.is_enabled === 'true' ? 'false' : 'true'
            }
          })
          await putBucketPolicy(bucket, trans)
        }
        this.$Message.success(this.$t('VIDEO.SET_UP_SUCCESSFULLY'))
      } catch (error) {
        this.policyFront[data._index].is_enabled = enable
      }
    },
    goOutputEdit(bucket, id) {
      this.$router.push({
        name: 'outputEdit',
        params: { bucket: bucket, id: id },
      })
    },
  },
}
</script>
<style lang="less" scope>
.output-wrap {
  padding: 11px 0;
}
.button-more {
  margin-top: 5px;
}
</style>
