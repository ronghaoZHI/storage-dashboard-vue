<template>
  <div>
    <div class="layout-bsc-toolbar layout-legend">
      <Button class="button-bsc-add-bucket"
              type="primary"
              @click="goTemplateEdit('none')">{{$t('VIDEO.NEW_TEMPLATE')}}</Button>
      <legend-list :data="legendList"></legend-list>
    </div>
    <Table border
           :context="self"
           :stripe="true"
           :columns="listHeader"
           :data="templateList"
           :no-data-text="$t('STORAGE.NO_LIST')"></Table>
    <div class="section-paging">
      <Button v-show="pageToken.length > 0"
              @click="listPresets();pageToken.length = 0"
              type="ghost"
              size="small">{{$t("PUBLIC.PAGE_FIRST")}}</Button>
      <Button v-show="pageToken.length > 0"
              @click="previousPage()"
              type="ghost"
              size="small">{{$t("PUBLIC.PAGE_PREV")}}</Button>
      <Button v-show="nextPageToken"
              @click="nextPage()"
              type="ghost"
              size="small">{{$t("PUBLIC.PAGE_NEXT")}}</Button>
    </div>
  </div>
</template>
<script>
import { transcoder } from '@/service/Aws'
import legendList from '@/components/legend/legend'
export default {
  components: {
    legendList
  },
  data() {
    return {
      iconSize: 18,
      self: this,
      templateList: this.templateList,
      pageToken: [],
      nextPageToken: '',
      legendList: [
        {
          icon: 'ios-trash',
          text: 'PUBLIC.DELETE'
        }
      ],
      videoNames: {
        Codec: this.$t('VIDEO.ENCODING'),
        Profile: this.$t('VIDEO.CODING_PROFILE'),
        Level: this.$t('VIDEO.CODING_LEVEL'),
        KeyframesMaxDist: this.$t('VIDEO.FIXED_KEY_FRAME_SPACING'),
        BitRate: this.$t('VIDEO.BIT_RATE'),
        FrameRate: this.$t('VIDEO.FRAME_RATE'),
        Resolution: this.$t('VIDEO.RESOLUTION'),
        AspectRatio: this.$t('VIDEO.ASPECT_RATIO')
      },
      audioNames: {
        Codec: this.$t('VIDEO.ENCODING'),
        Profile: this.$t('VIDEO.CODING_QUALITY'),
        SampleRate: this.$t('VIDEO.SAMPLE_RATE'),
        BitRate: this.$t('VIDEO.BIT_RATE'),
        Channels: this.$t('VIDEO.CHANNELS')
      },
      WatermarkConfigNames: {
        Width: this.$t('VIDEO.WIDTH'),
        Height: this.$t('VIDEO.HEIGHT'),
        Location: this.$t('VIDEO.POSITION'),
        LocationHOffset: this.$t('VIDEO.OFFSET_X'),
        LocationVOffset: this.$t('VIDEO.OFFSET_Y')
      },
      LocationNames: {
        NorthEast: '右上',
        North: '中上',
        NorthWest: '左上',
        East: '右中',
        Center: '中心',
        West: '左中',
        SouthEast: '右下',
        South: '中下',
        SouthWest: '左下'
      },
      listHeader: [
        {
          title: 'ID',
          width: '75px',
          key: 'id'
        },
        {
          title: this.$t('VIDEO.TEMPLATE_NAME_TABLE'),
          render: (h, params) => {
            if (!params.row.description) {
              return params.row.name
            } else {
              return h(
                'Poptip',
                {
                  props: {
                    placement: 'right',
                    trigger: 'hover'
                  }
                },
                [
                  h('div', [
                    params.row.name,
                    h('Icon', {
                      props: {
                        type: 'ios-information-outline',
                        size: '14'
                      },
                      class: {
                        'icon-disc': true
                      }
                    })
                  ]),
                  h(
                    'div',
                    {
                      slot: 'content'
                    },
                    params.row.description
                  )
                ]
              )
            }
          }
        },
        {
          title: this.$t('VIDEO.CONTAINER'),
          width: '90px',
          key: 'container'
        },
        {
          title: this.$t('VIDEO.VIDEO'),
          width: '25%',
          render: (h, params) => {
            return h(
              'Poptip',
              {
                props: {
                  placement: 'right',
                  trigger: 'hover'
                }
              },
              [
                h(
                  'div',
                  params.row.video.map((item) =>
                    h(
                      'Tag',
                      {
                        props: {
                          type: 'border'
                        }
                      },
                      `${item.name}:${item.value}`
                    )
                  )
                ),
                h(
                  'div',
                  {
                    slot: 'content'
                  },
                  params.row.videoDetails.map((item) =>
                    h('p', `${item.name}:${item.value}`)
                  )
                )
              ]
            )
          }
        },
        {
          title: this.$t('VIDEO.AUDIO'),
          width: '20%',
          render: (h, params) => {
            return h(
              'Poptip',
              {
                props: {
                  placement: 'right',
                  trigger: 'hover'
                }
              },
              [
                h(
                  'div',
                  params.row.audio.map((item) =>
                    h(
                      'Tag',
                      {
                        props: {
                          type: 'border'
                        }
                      },
                      `${item.name}:${item.value}`
                    )
                  )
                ),
                h(
                  'div',
                  {
                    slot: 'content'
                  },
                  params.row.audioDetails.map((item) =>
                    h('p', `${item.name}:${item.value}`)
                  )
                )
              ]
            )
          }
        },
        {
          title: this.$t('VIDEO.WATERMARK'),
          width: '25%',
          render: (h, params) => {
            return h(
              'div',
              params.row.WatermarkConfig.map((item) =>
                h(
                  'Tag',
                  {
                    props: {
                      type: 'border'
                    }
                  },
                  `${item.name}:${item.value}`
                )
              )
            )
          }
        },
        {
          title: this.$t('VIDEO.OPERATION'),
          key: 'actions',
          width: '105px',
          align: 'right',
          render: (h, params) => {
            return h('div', [
              h(
                'Tooltip',
                {
                  props: {
                    content: this.$t('PUBLIC.EDIT'),
                    delay: 500,
                    placement: 'top'
                  },
                  class: {
                    'mar-r-8': true
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
                          this.goTemplateEdit(params.row.id)
                        }
                      }
                    },
                    [
                      h('Icon', {
                        props: {
                          type: 'compose',
                          size: this.iconSize
                        }
                      })
                    ]
                  )
                ]
              ),
              h(
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
                          this.deletePresetConfirm(params.row)
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
            ])
          }
        }
      ]
    }
  },
  created() {
    this.listPresets()
  },
  methods: {
    async listPresets(pageToken) {
      try {
        this.$Loading.start()
        let res = !pageToken
          ? await transcoder('listPresets')
          : await transcoder('listPresets', { PageToken: pageToken })
        if (!res.Presets.length) {
          this.$Message.warning(this.$t('VIDEO.NO_DATA'))
        }
        this.templateList = await this.convert2Front(res.Presets)
        this.nextPageToken = res.NextPageToken
        this.$Loading.finish()
      } catch (error) {
        this.$Loading.error()
      }
    },
    previousPage() {
      let page = this.pageToken[this.pageToken.length - 2]
      this.pageToken.pop()
      this.listPresets(page)
    },
    nextPage() {
      this.nextPageToken && this.pageToken.push(this.nextPageToken)
      this.listPresets(this.nextPageToken)
    },
    goTemplateEdit(id) {
      this.$router.push({ name: 'TemplateEdit', params: { id: id } })
    },
    async deletePreset(rule) {
      try {
        this.$Loading.start()
        await transcoder(
          'deletePreset',
          { Id: rule.id },
          this.$t('VIDEO.TEMPLATE_DELETED_ERROR')
        )
        this.templateList.splice(rule._index, 1)
        this.$Loading.finish()
        this.$Message.success(this.$t('VIDEO.DELETED_SUCCESSFULLY'))
      } catch (error) {
        this.$Loading.error()
      }
    },
    convert2Front(data) {
      let frontList = []
      data.forEach((item) => {
        const video = item.Video
        const audio = item.Audio
        let WatermarkConfig = item.WatermarkConfig
          ? {
              Width:
                !!item.WatermarkConfig.Width &&
                item.WatermarkConfig.Width !== 0 &&
                item.WatermarkConfig.Width !== '0' &&
                item.WatermarkConfig.Height !== '0' &&
                item.WatermarkConfig.Height !== 0
                  ? item.WatermarkConfig.Width
                  : '图片宽度',
              Height:
                !!item.WatermarkConfig.Height &&
                item.WatermarkConfig.Width !== 0 &&
                item.WatermarkConfig.Width !== '0' &&
                item.WatermarkConfig.Height !== '0' &&
                item.WatermarkConfig.Height !== 0
                  ? item.WatermarkConfig.Height
                  : '图片高度',
              Location: !!item.WatermarkConfig.Location
                ? this.LocationNames[item.WatermarkConfig.Location]
                : '右上',
              LocationHOffset: !!item.WatermarkConfig.LocationHOffset
                ? `${item.WatermarkConfig.LocationHOffset}px`
                : '0px',
              LocationVOffset: !!item.WatermarkConfig.LocationVOffset
                ? `${item.WatermarkConfig.LocationVOffset}px`
                : '0px'
            }
          : watermarkDefault
        const frontItem = {
          id: item.Id,
          description: item.Description,
          name: item.Name,
          container: item.Container,
          video: [],
          audio: [],
          videoDetails: [],
          audioDetails: [],
          WatermarkConfig: []
        }
        _.forEach(video, (value, key) => {
          if (key === 'FixedGOP') {
          } else if (key === 'CodecOptions') {
            _.forEach(value, (value, key) => {
              frontItem.videoDetails.push({
                name: this.videoNames[key],
                value: value
              })
            })
          } else if (videoMust.includes(key)) {
            frontItem.video.push({ name: this.videoNames[key], value: value })
            frontItem.videoDetails.push({
              name: this.videoNames[key],
              value: value
            })
          } else {
            frontItem.videoDetails.push({
              name: this.videoNames[key],
              value: value
            })
          }
        })
        _.forEach(audio, (value, key) => {
          if (key === 'CodecOptions') {
            _.forEach(value, (value, key) => {
              frontItem.audioDetails.push({
                name: this.audioNames[key],
                value: value
              })
            })
          } else if (audioMust.includes(key)) {
            frontItem.audio.push({ name: this.audioNames[key], value: value })
            frontItem.audioDetails.push({
              name: this.audioNames[key],
              value: value
            })
          } else {
            frontItem.audioDetails.push({
              name: this.audioNames[key],
              value: value
            })
          }
        })

        _.forEach(WatermarkConfig, (value, key) => {
          frontItem.WatermarkConfig.push({
            name: this.WatermarkConfigNames[key],
            value: value
          })
        })
        if (audio.CodecOptions && audio.CodecOptions.Profile) {
          frontItem.audio.profile = {
            name: this.$t('VIDEO.CODING_QUALITY'),
            value: audio.CodecOptions.Profile
          }
        }
        frontList.push(frontItem)
      })
      return frontList
    },
    deletePresetConfirm(rule) {
      this.$Modal.confirm({
        content: this.$t('STORAGE.DELETE_CONFIRMED', { fileName: rule.name }),
        okText: this.$t('PUBLIC.CONFIRMED'),
        cancelText: this.$t('PUBLIC.CANCLE'),
        title: this.$t('PUBLIC.DELETE'),
        onOk: () => this.deletePreset(rule)
      })
    }
  }
}
const videoMust = ['Codec', 'FrameRate', 'Resolution', 'BitRate', 'AspectRatio']
const audioMust = ['Codec', 'SampleRate', 'Channels', 'BitRate']
const watermarkDefault = {
  Height: '图片高度',
  Width: '图片宽度',
  Location: '右上',
  LocationHOffset: '0px',
  LocationVOffset: '0px'
}
</script>
<style lang="less">
.icon-disc {
  padding-left: 5px;
  vertical-align: text-top;
}
.section-paging {
  .wh(100%, 40px);
  .fb(flex-end, center);
  button {
    margin-left: 6px;
  }
}
</style>
