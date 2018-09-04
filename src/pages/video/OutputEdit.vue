<template>
  <div class="bsc-output-edit bsc-edit">
    <div class="layout-bsc-toolbar">
      <Breadcrumb>
        <Breadcrumb-item href="/video/Output">{{$t('VIDEO.AUTOMATIC_TRANSCODING_CONFIGURATION')}}</Breadcrumb-item>
        <Breadcrumb-item>{{$t('VIDEO.NEW_CONFIGURATION')}}</Breadcrumb-item>
      </Breadcrumb>
    </div>
    <div class="separator-line"></div>
    <div class="editBlock">
      <div class="section-separator">
        <div class="separator-body">
          <span class="separator-icon"></span>
          <span class="separator-info">{{$t('VIDEO.INPUT_CONFIGURATION')}}</span>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label">{{$t('VIDEO.TRANSCODING_PATH_RULES')}} : </span>
        <Radio-group v-model="auxiliary.reg">
          <Radio key="extension"
                 label="extension"
                 style="line-height:30px">{{$t('VIDEO.BY_FILE_EXTENSION_CONFIGURATION')}}</Radio>
          <Radio key="regular"
                 label="regular">{{$t('VIDEO.REGULAR_EXPRESSION_CONFIGURATION')}}</Radio>
        </Radio-group>
      </div>
      <div class="form-item">
        <span class="form-label"
              v-if="auxiliary.reg === 'extension'"></span>
        <Input v-if="auxiliary.reg === 'extension'"
               v-model="auxiliary.path"
               :placeholder="$t('VIDEO.PATH')"
               class="sub-setting-input" />
        <Input v-if="auxiliary.reg === 'extension'"
               v-model="auxiliary.extension"
               :placeholder="$t('VIDEO.EXTENSION_NAME')"
               class="sub-setting-input" />
        <span v-if="auxiliary.reg === 'extension'">{{$t('VIDEO.SEPARATE_EXTENSION_NAMES')}}</span>
        <Form ref="auxiliaryForm"
              :model="auxiliary"
              :rules="ruleValidate"
              :label-width="205">
          <FormItem prop="regular"
                    v-if="auxiliary.reg === 'regular'">
            <Input v-model="auxiliary.regular"
                   :placeholder="$t('VIDEO.REGULAR_EXPRESSION')"
                   class="sub-setting-input" />
          </FormItem>
        </Form>
      </div>
      <div class="form-item">
        <span class="form-label">{{$t('VIDEO.INPUT_BUCKET')}} : </span>
        <Select v-model="inputBucket"
                class="line-width">
          <Option v-for="bucket in bucketList"
                  :value="bucket"
                  :key="bucket">{{bucket}}</Option>
        </Select>
      </div>
    </div>
    <div class="separator-line"></div>
    <div class="editBlock">
      <div class="section-separator">
        <div class="separator-body">
          <span class="separator-icon"></span>
          <span class="separator-info">{{$t('VIDEO.OUTPUT_CONFIGURATION')}}</span>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label">{{$t('VIDEO.OUTPUT_KEY_PREFIX')}} : </span>
        <Input v-model="transcode.output_key_prefix"
               :placeholder="$t('VIDEO.OUTPUT_KEY_PREFIX')"
               class="line-width" />
      </div>
      <div class="form-item">
        <span class="form-label">{{$t('VIDEO.OUTPUT_BUCKET')}} : </span>
        <Select v-model="transcode.output_bucket"
                class="line-width">
          <Option v-for="bucket in bucketList"
                  :value="bucket"
                  :key="bucket">{{bucket}}</Option>
        </Select>
      </div>
      <div class="form-item">
        <span class="form-label">{{$t('VIDEO.OUTPUT_RULES')}} : </span>
        <div class="table-box line-width">
          <Table border
                 size="small"
                 :context="self"
                 :stripe="true"
                 :columns="outputsHeader"
                 :data="transcode.outputs"
                 :no-data-text="$t('VIDEO.AT_LEAST_ONE_RULE')"></Table>
        </div>
        <br>
        <p class="style-name-info redFont"
           v-if="HLSError">{{$t('VIDEO.AUTO_OUTPUT_RULES_DESCRIPTION')}}</p>
        <Button class="button-add-item"
                icon="plus"
                size="small"
                @click="addOutput">{{$t('PUBLIC.ADD')}}</Button>
      </div>
      <div class="form-item">
        <span class="form-label">{{$t('VIDEO.VIDEO_SCREENSHOTS_RULES')}} : </span>
        <div class="table-box line-width">
          <Table border
                 size="small"
                 :context="self"
                 :stripe="true"
                 :columns="shotsHeader"
                 :data="transcode.snapshots"
                 :no-data-text="$t('VIDEO.AT_LEAST_ONE_RULE')"></Table>
        </div>
        <br>
        <p class="style-name-info redFont"
           v-if="osError">{{$t('VIDEO.AT_LEAST_ONE_RULE')}}</p>
        <Button class="button-add-item"
                icon="plus"
                size="small"
                @click="addShot">{{$t('PUBLIC.ADD')}}</Button>
      </div>
    </div>
    <div class="separator-line"></div>
    <div class="editBlock">
      <div class="section-separator">
        <div class="separator-body">
          <span class="separator-icon"></span>
          <span class="separator-info">{{$t('VIDEO.MORE_CONFIGURATION')}}</span>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label">{{$t('VIDEO.WHETHER_DELETE_ORIGINAL_FILE_AFTER_TRANSCODING')}} : </span>
        <Radio-group v-model="transcode.delete_origin">
          <Radio key="true"
                 label="true"
                 style="line-height:30px">{{$t('VIDEO.YES')}}</Radio>
          <Radio key="false"
                 label="false">{{$t('VIDEO.NO')}}</Radio>
        </Radio-group>
      </div>
      <div class="form-item">
        <span class="form-label">{{$t('VIDEO.WHETHER_RETAIN_ORIGINAL_PATH_AFTER_TRANSCODING')}} : </span>
        <Radio-group v-model="transcode.keep_input_path">
          <Radio key="true"
                 label="true"
                 style="line-height:30px">{{$t('VIDEO.YES')}}</Radio>
          <Radio key="false"
                 label="false">{{$t('VIDEO.NO')}}</Radio>
        </Radio-group>
      </div>
      <div class="form-item">
        <span class="form-label">{{$t('VIDEO.TRANSCODING_SUCCESSFUL_CALLBACK_URL')}} : </span>
        <Input v-model="transcode.success_callback_url"
               :placeholder="$t('VIDEO.TRANSCODING_SUCCESSFUL_CALLBACK_URL')"
               class="line-width"
               style="display:inline-table;" />
        <span slot="prepend">http://</span>
      </div>
      <div class="form-item">
        <span class="form-label">{{$t('VIDEO.TRANSCODING_FAILED_CALLBACK_URL')}} : </span>
        <Input v-model="transcode.failure_callback_url"
               :placeholder="$t('VIDEO.TRANSCODING_FAILED_CALLBACK_URL')"
               class="line-width"
               style="display:inline-table;" />
        <span slot="prepend">http://</span>
      </div>
    </div>
    <div class="separator-line"></div>
    <div class="editBlock">
      <div class="section-separator">
        <div class="separator-body">
          <span class="separator-icon"></span>
          <span class="separator-info">{{$t('VIDEO.MASTER_PLAYLIST_CONFIGURATION')}}</span>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label">{{$t('VIDEO.WHETHER_TO_OPEN')}} : </span>
        <i-switch v-model="auxiliary.MP"
                  style="margin-top:3px;">
          <span slot="open">{{$t('VIDEO.ON')}}</span>
          <span slot="close">{{$t('VIDEO.OFF')}}</span>
        </i-switch>
      </div>
      <div class="form-item"
           v-if="auxiliary.MP">
        <span class="form-label">{{$t('VIDEO.SLICE_FORMAT')}} : </span>
        <Radio-group v-model="transcode.master_playlist.format">
          <Radio key="HLSv3"
                 label="HLSv3"
                 style="line-height:30px">HLSv3</Radio>
        </Radio-group>
      </div>
      <div class="form-item"
           v-if="auxiliary.MP">
        <Form ref="nameForm"
              :model="transcode.master_playlist"
              :rules="ruleValidate"
              :label-width="205">
          <FormItem :label="$t('VIDEO.MASTER_PLAYLIST_FILE_NAME_SUFFIX')"
                    prop="name">
            <Input v-model="transcode.master_playlist.name"
                   placeholder="MasterPlaylist"
                   class="line-width" />
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="separator-line"></div>
    <div class="editBlock">
      <div class="section-separator">
        <div class="separator-body">
          <span class="separator-icon"></span>
          <span class="separator-info">{{$t('VIDEO.PERMISSION_SETTINGS')}}</span>
        </div>
      </div>
      <div class="form-item">
        <file-acl :aclData="groupACLList"
                  :userAcl="userACLList"
                  :isInline="true"
                  :width="600">
          <span class="form-label"
                slot="groupTitle">{{$t('VIDEO.USER_GROUP_PERMISSIONS')}} : </span>
          <span class="form-label"
                slot="userTitle">{{$t('VIDEO.USER_PERMISSIONS')}} : </span>
        </file-acl>
      </div>
    </div>
    <div class="separator-line"></div>
    <div class="editBlock">
      <Button class="button-save"
              type="primary"
              @click="beforeSubmit">{{$t('VIDEO.SAVE')}}</Button>
    </div>
    <Modal v-model="showOutputsModal"
           :title="$t('VIDEO.OUTPUT_RULES')"
           width="700"
           class="edit-modal">
      <Form ref="outputForm"
            :model="outputModal"
            :label-width="155"
            :rules="ruleValidate">
        <FormItem :label="$t('VIDEO.TRANSCODING_TEMPLATE')"
                  prop="preset_id">
          <Select v-model="outputModal.preset_id"
                  class="line-width"
                  @on-change="templateChange">
            <Option v-for="template in templateList"
                    :value="template.Id"
                    :key="template.Id">{{template.Name}}</Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('VIDEO.OUTPUT_FILE_NAME_SUFFIX')"
                  prop="key_suffix">
          <Input v-model="outputModal.key_suffix"
                 :placeholder="$t('VIDEO.OUTPUT_FILE_NAME_SUFFIX')"
                 class="line-width" />
        </FormItem>
        <FormItem :label="$t('VIDEO.HLS_SLICE_LENGTH')"
                  prop="segment_duration"
                  v-if="HLSShow">
          <Slider v-model="outputModal.segment_duration"
                  :min="0"
                  :max="50"
                  class="my-slider"
                  show-input></Slider>
        </FormItem>
        <p class="page-info"
           v-if="isAutoCodec"
           style="padding-left:155px">转码模版的视频编码方式为“不变”时不能添加水印</p>
        <FormItem label="水印">
          <i-switch v-model="auxiliary.isWaterMarkerOpen"
                    style="margin-top:3px;"
                    :disabled="isAutoCodec">
            <span slot="open">{{$t('VIDEO.ON')}}</span>
            <span slot="close">{{$t('VIDEO.OFF')}}</span>
          </i-switch>
        </FormItem>
        <FormItem label="文件Key"
                  prop="InputKey"
                  v-if="auxiliary.isWaterMarkerOpen">
          <Input v-model="outputModal.InputKey"
                 placeholder="水印图片要和视频源文件在一个bucket里，输入文件key即可，例如abc.png"
                 class="line-width"
                 :disabled="isAutoCodec" />
        </FormItem>
      </Form>
      <div slot="footer"
           class="copy-modal-footer">
        <Button type="primary"
                @click="beforeUpdateOutputs">{{$t('VIDEO.OK')}}</Button>
      </div>
    </Modal>
    <Modal v-model="showShotsModal"
           :title="$t('VIDEO.SNAPSHOTS_RULES')"
           width="700"
           class="edit-modal">
      <Form ref="shotsForm"
            :model="shotModal"
            :label-width="0"
            :rules="ruleValidate"
            inline>
        <div class="form-item mar-b-0">
          <span class="form-label required-item">{{$t('VIDEO.OUTPUT_FILE_NAME_SUFFIX')}} : </span>
          <FormItem prop="key_suffix"
                    required>
            <Input v-model="shotModal.key_suffix"
                   :placeholder="$t('VIDEO.OUTPUT_FILE_NAME_SUFFIX')"
                   style="width:160px;" />
          </FormItem>
          <Select v-model="shotModal.format"
                  style="width:100px;display:inline-block">
            <Option v-for="format in formatList"
                    :value="format"
                    :key="format">{{format}}</Option>
          </Select>
        </div>
        <div class="form-item mar-b-0">
          <span class="form-label required-item">{{$t('VIDEO.SCREENSHOT_START_TIME')}} : </span>
          <FormItem prop="time">
            <InputNumber v-model="shotModal.time"></InputNumber> S
          </FormItem>
        </div>
        <div class="form-item">
          <span class="form-label">{{$t('VIDEO.SCREENSHOT_INTERVAL')}} : </span>
          <InputNumber :min="1"
                       v-model="shotModal.interval"></InputNumber> S
        </div>
        <div class="form-item">
          <span class="form-label">{{$t('VIDEO.SCREENSHOT_MAX_NUMBER')}} : </span>
          <InputNumber :min="1"
                       v-model="shotModal.number"></InputNumber>
        </div>
        <div class="form-item mar-b-0">
          <span class="form-label">{{$t('VIDEO.RESOLUTION')}} : </span>
          <Radio-group v-model="shotModal.resolution">
            <Radio label="auto">{{$t('VIDEO.WH_UNALTERED')}}</Radio>
            <Radio label="value"></Radio>
          </Radio-group>
          <FormItem prop="width">
            <InputNumber v-model="shotModal.width"
                         :disabled="shotModal.resolution === 'auto'"
                         :placeholder="$t('VIDEO.WIDTH')"></InputNumber>
          </FormItem>
          <FormItem prop="height">
            <InputNumber v-model="shotModal.height"
                         :disabled="shotModal.resolution === 'auto'"
                         :placeholder="$t('VIDEO.HEIGHT')"></InputNumber>
          </FormItem>
        </div>
        <div class="form-item">
          <span class="form-label">{{$t('VIDEO.ASPECT_RATIO')}} : </span>
          <Radio-group v-model="shotModal.aspect_ratio">
            <Radio v-for="asp in aspectRatioList"
                   :key="asp.value"
                   :label="asp.value">{{asp.name}}</Radio>
          </Radio-group>
        </div>
      </Form>
      <div slot="footer"
           class="copy-modal-footer">
        <Button type="primary"
                @click="beforeUpdateShots">{{$t('VIDEO.OK')}}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  putBucketPolicy,
  getTranscodes,
  getTemplateInfo,
} from '@/pages/video/data'
import fileAcl from '@/components/ACL/fileAcl.vue'
export default {
  components: { fileAcl },
  data() {
    return {
      iconSize: 18,
      self: this,
      transcode: _.cloneDeep(transcodeDefult),
      inputBucket: '',
      bucketList: this.bucketList,
      showOutputsModal: false,
      showShotsModal: false,
      aspectRatioList: [
        { name: this.$t('VIDEO.UNALTERED'), value: 'auto' },
        { name: '1:1', value: '1:1' },
        { name: '4:3', value: '4:3' },
        { name: '3:2', value: '3:2' },
        { name: '16:9', value: '16:9' },
      ],
      formatList: ['png', 'jpg'],
      templateList: this.templateList,
      outputModal: _.clone(outputsDefult),
      shotModal: _.clone(shotDefult),
      auxiliary: _.cloneDeep(auxiliaryDefult),
      HLSShow: false,
      groupACLList: [],
      userACLList: [],
      templateContainer: {},
      templateName: {},
      templateVideoCodec: {},
      HLSError: false,
      isAutoCodec: false,
      ruleValidate: {
        regular: [{ validator: this.validateRegular, trigger: 'change' }],
        name: [{ validator: this.validateName, trigger: 'change' }],
        preset_id: [
          {
            required: true,
            message: this.$t('VIDEO.PERSET_REQUIRED'),
            trigger: 'change',
          },
        ],
        key_suffix: [
          {
            required: true,
            message: this.$t('VIDEO.KEY_SUFFIX_REQUIRED'),
            trigger: 'change',
          },
        ],
        segment_duration: [
          { validator: this.validateSegment, trigger: 'blur' },
        ],
        InputKey: [{ validator: this.validateInputKey, trigger: 'change' }],
        time: [
          {
            type: 'number',
            min: 1,
            message: this.$t('PUBLIC.NOT_LESS', { num: '1' }),
            trigger: 'change',
          },
        ],
        width: [{ validator: this.validateWidth, trigger: 'change' }],
        height: [{ validator: this.validateWidth, trigger: 'change' }],
      },
      outputsHeader: [
        {
          title: this.$t('VIDEO.OUTPUT_FILE_NAME_SUFFIX'),
          key: 'key_suffix',
          width: 140,
        },
        {
          title: this.$t('VIDEO.TRANSCODING_TEMPLATE'),
          key: 'template',
          width: 100,
        },
        {
          title: this.$t('VIDEO.HLS_SLICE_LENGTH'),
          width: 120,
          key: 'segment_duration',
        },
        {
          title: '水印文件Key',
          width: 120,
          key: 'watermarkers',
          render: (h, params) => {
            return h('div', [
              params.row.watermarks
                ? params.row.watermarks[0].InputKey
                : '水印未启用',
            ])
          },
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 120,
          render: (h, params) => {
            return h('div', [
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
                          this.editOutput(params.row._index)
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
                          this.deleteOutput(params.row._index)
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
      shotsHeader: [
        {
          title: this.$t('VIDEO.OUTPUT_FILE_NAME_SUFFIX'),
          key: 'key_suffix',
          width: 140,
        },
        {
          title: this.$t('VIDEO.FORMAT'),
          key: 'format',
          width: 70,
        },
        {
          title: this.$t('VIDEO.SCREENSHOT_START_TIME_SECOND'),
          width: 160,
          key: 'time',
        },
        {
          title: this.$t('VIDEO.SCREENSHOT_INTERVAL_SECOND'),
          width: 140,
          key: 'interval',
        },
        {
          title: this.$t('VIDEO.SCREENSHOT_MAX_NUMBER'),
          width: 120,
          key: 'number',
        },
        {
          title: this.$t('VIDEO.SCREENSHOT_RESOLUTION'),
          width: 100,
          key: 'resolution',
        },
        {
          title: this.$t('VIDEO.ASPECT_RATIO'),
          width: 80,
          key: 'aspect_ratio',
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 100,
          render: (h, params) => {
            return h('div', [
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
                          this.editShot(params.row._index)
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
                          this.deleteShot(params.row._index)
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
  computed: {
    bucket: function() {
      return this.$route.params.bucket
    },
    id: function() {
      return this.$route.params.id
    },
    username() {
      return this.$store.state.current.username
    },
    owerACL() {
      return {
        GranteeType: 'Canonial',
        Grantee: this.username,
        Access: {
          Read: true,
          ReadAcp: true,
          WriteAcp: true,
        },
      }
    },
    osError() {
      return (
        this.transcode.snapshots.length === 0 &&
        this.transcode.outputs.length === 0
      )
    },
  },
  created() {
    this.getTranscode()
  },
  methods: {
    async getBucketNames() {
      let res = await this.$store.dispatch('getBuckets')
      this.bucketList = _.map(res.Buckets, (bucket) => bucket.Name)
    },
    async getTranscode() {
      const templateInfo = await getTemplateInfo()
      this.templateList = templateInfo.templateList
      this.templateContainer = templateInfo.templateContainer
      this.templateName = templateInfo.templateName
      this.templateVideoCodec = templateInfo.templateVideoCodec

      if (this.id === 'none') {
        this.userACLList = [this.owerACL]
        this.groupACLList = _.cloneDeep(groupACLListDefult)
        await this.getBucketNames()
        this.inputBucket = this.bucketList[0]
        this.transcode.output_bucket = this.bucketList[0]
      } else {
        this.inputBucket = this.bucket
        const transcods = await getTranscodes(this.bucket)
        const transcod = transcods.filter((item) => {
          return item.id === this.id
        })
        this.convert2Front(transcod[0])
        await this.getBucketNames()
      }
    },
    async addOutput() {
      this.outputModal = _.clone(outputsDefult)
      this.outputIndex = this.transcode.outputs.length
      this.showOutputsModal = true
      this.auxiliary.isWaterMarkerOpen = false
      this.HLSError = false
    },
    editOutput(index) {
      this.outputIndex = index
      this.outputModal = _.clone(this.transcode.outputs[index])
      this.outputModal.segment_duration = parseInt(
        this.outputModal.segment_duration,
      )
      this.outputModal.InputKey = this.outputModal.watermarks
        ? this.outputModal.watermarks[0].InputKey
        : ''
      this.auxiliary.isWaterMarkerOpen = !!this.outputModal.watermarks
      if (this.isTS(this.outputModal.preset_id)) {
        this.HLSShow = true
      } else {
        this.HLSShow = false
      }
      this.showOutputsModal = true
      this.isAutoCodec = this.isAC(this.outputModal.preset_id)
      this.HLSError = false
    },
    beforeUpdateOutputs() {
      this.$refs['outputForm'].validate((valid) => {
        if (!valid) {
          this.$Message.error(this.$t('PUBLIC.FORM_VALID_FAILED'))
        } else {
          this.updateOutputs()
        }
      })
    },
    updateOutputs() {
      const ln = this.transcode.outputs.length
      this.outputModal.template = `${this.outputModal.preset_id}+${
        this.templateName[this.outputModal.preset_id]
      }`
      const outputSave = this.auxiliary.isWaterMarkerOpen
        ? Object.assign(this.outputModal, {
            watermarks: [{ InputKey: this.outputModal.InputKey }],
          })
        : this.outputModal
      delete outputSave.InputKey
      this.isAutoCodec && delete outputSave.watermarks
      if (this.outputIndex === ln) {
        this.transcode.outputs.push(outputSave)
      } else {
        this.transcode.outputs.splice(this.outputIndex, 1, outputSave)
      }
      this.showOutputsModal = false
    },
    deleteOutput(index) {
      this.transcode.outputs.splice(index, 1)
    },
    addShot() {
      this.shotModal = _.clone(shotDefult)
      this.shotIndex = this.transcode.snapshots.length
      this.showShotsModal = true
    },
    beforeUpdateShots() {
      this.$refs['shotsForm'].validate((valid) => {
        if (!valid) {
          this.$Message.error(this.$t('PUBLIC.FORM_VALID_FAILED'))
        } else {
          this.updateShots()
        }
      })
    },
    updateShots() {
      const ln = this.transcode.snapshots.length
      let data = _.clone(this.shotModal)
      if (data.resolution !== 'auto') {
        data.resolution = `${data.width}*${data.height}`
      }
      delete data.width
      delete data.height
      if (this.shotIndex === ln) {
        this.transcode.snapshots.push(data)
      } else {
        this.transcode.snapshots.splice(this.shotIndex, 1, data)
      }
      this.showShotsModal = false
    },
    editShot(index) {
      this.shotIndex = index
      this.shotModal = _.clone(this.transcode.snapshots[index])
      if (this.shotModal.resolution !== 'auto') {
        this.shotModal.width = this.shotModal.resolution.split('*')[0]
        this.shotModal.height = this.shotModal.resolution.split('*')[1]
        this.shotModal.resolution = 'value'
      }
      this.showShotsModal = true
    },
    deleteShot(index) {
      this.transcode.snapshots.splice(index, 1)
    },
    beforeSubmit() {
      if (this.auxiliary.reg === 'regular') {
        this.$refs['auxiliaryForm'].validate((valid) => {
          if (!valid) {
            this.$Message.error(this.$t('PUBLIC.FORM_VALID_FAILED'))
          } else {
            if (this.auxiliary.MP) {
              this.$refs['nameForm'].validate((valid) => {
                if (!valid) {
                  this.$Message.error(this.$t('PUBLIC.FORM_VALID_FAILED'))
                } else {
                  if (this.otherRule()) {
                    this.addTranscode()
                  }
                }
              })
            } else {
              if (this.otherRule()) {
                this.addTranscode()
              }
            }
          }
        })
      } else {
        if (this.auxiliary.MP) {
          this.$refs['nameForm'].validate((valid) => {
            if (!valid) {
              this.$Message.error(this.$t('PUBLIC.FORM_VALID_FAILED'))
            } else {
              if (this.otherRule()) {
                this.addTranscode()
              }
            }
          })
        } else {
          if (this.otherRule()) {
            this.addTranscode()
          }
        }
      }
    },
    otherRule() {
      let segments = []
      if (this.osError) {
        this.$Message.error(this.$t('PUBLIC.FORM_VALID_FAILED'))
        return false
      }
      if (this.auxiliary.MP) {
        this.transcode.outputs.forEach((item) => {
          if (this.isTS(item.preset_id)) {
            segments.push(item.segment_duration || 0)
          }
        })
        if (segments.length === 0) {
          this.$Message.error(this.$t('PUBLIC.FORM_VALID_FAILED'))
          this.HLSError = true
          return false
        }
        const unified = segments.filter(
          (seg) => parseInt(seg) === parseInt(segments[0]),
        )
        if (unified.length !== segments.length) {
          this.$Message.error(this.$t('PUBLIC.FORM_VALID_FAILED'))
          this.HLSError = true
          return false
        } else if (segments[0] === 0) {
          this.$Message.error(this.$t('PUBLIC.FORM_VALID_FAILED'))
          this.HLSError = true
          return false
        }
      }
      return true
    },
    async addTranscode() {
      if (this.id === 'none') {
        this.newTranscode()
      } else {
        if (this.bucket === this.inputBucket) {
          this.alterTranscode()
        } else {
          this.transcodeChangeBucket()
        }
      }
    },
    async newTranscode() {
      this.$Loading.start()
      let trans = await getTranscodes(this.inputBucket)
      const newTrans = this.convert2Save(this.transcode)
      newTrans.id =
        Date.now() +
        Math.random()
          .toString()
          .slice(-6)
      trans.push(newTrans)
      await putBucketPolicy(this.inputBucket, trans)
      this.$router.push({ name: 'output' })
      this.$Message.success(this.$t('VIDEO.SET_UP_SUCCESSFULLY'))
    },
    async alterTranscode() {
      try {
        this.$Loading.start()
        let trans = await getTranscodes(this.inputBucket)
        const newTrans = this.convert2Save(this.transcode)
        let updateIndex
        trans.forEach((item, index) => {
          if (item.id === this.id) {
            updateIndex = index
          }
        })
        trans.splice(updateIndex, 1, newTrans)
        await putBucketPolicy(this.inputBucket, trans)
        this.$router.push({ name: 'output' })
        this.$Message.success(this.$t('VIDEO.SET_UP_SUCCESSFULLY'))
      } catch (error) {
        this.$Message.error(this.$t('VIDEO.SET_UP_FAILED'))
      }
    },
    async transcodeChangeBucket() {
      try {
        this.$Loading.start()
        let [originalTrans, trans] = await Promise.all([
          getTranscodes(this.bucket),
          getTranscodes(this.inputBucket),
        ])

        let newTrans = this.convert2Save(this.transcode)
        newTrans.id =
          Date.now() +
          Math.random()
            .toString()
            .slice(-6)
        originalTrans.forEach((item, index) => {
          if (item.id === this.id) {
            originalTrans.splice(index, 1)
          }
        })
        trans.push(newTrans)

        await Promise.all([
          putBucketPolicy(this.bucket, originalTrans),
          putBucketPolicy(this.inputBucket, trans),
        ])
        this.$router.push({ name: 'output' })
        this.$Message.success(this.$t('VIDEO.SET_UP_SUCCESSFULLY'))
      } catch (error) {
        this.$Message.error(this.$t('VIDEO.SET_UP_FAILED'))
      }
    },
    convert2Save(data) {
      const front = _.clone(data)
      const auxiliary = _.clone(this.auxiliary)
      let saved = _.clone(data)

      if (data.outputs.length === 0) {
        delete saved.outputs
      } else {
        saved.outputs = front.outputs.map((item) => {
          let res = _.clone(item)
          if (item.segment_duration && item.segment_duration !== 0) {
            res.segment_duration = item.segment_duration.toString()
          } else {
            delete res.segment_duration
          }
          delete res.template
          return res
        })
      }

      if (data.snapshots.length === 0) {
        delete saved.snapshots
      } else {
        saved.snapshots = front.snapshots.map((item) => {
          let res = _.clone(item)
          res.interval = item.interval.toString()
          res.number = item.number.toString()
          res.time = item.time.toString()
          return res
        })
      }

      let group = this.groupACLList
      let user = this.userACLList
      saved.output_acls = _.without(
        [...group, ...user].map((item) => {
          const { Read, ReadAcp, WriteAcp } = item.Access
          if (Read || ReadAcp || WriteAcp) {
            return aclConvert2Save(item)
          }
        }),
        null,
        undefined,
      )
      if (!this.auxiliary.MP) {
        delete saved.master_playlist
      }
      saved.allowed_keys_regex =
        auxiliary.reg === 'extension'
          ? [`^${auxiliary.path}.*\\.(${auxiliary.extension})$`]
          : [`${auxiliary.regular}`]
      return saved
    },
    templateChange(id) {
      this.HLSShow = this.isTS(id)
      if (!this.HLSShow) {
        this.outputModal.segment_duration = 0
      }
      this.isAutoCodec = this.isAC(id)
    },
    isAC(id) {
      return id ? this.templateVideoCodec[id] === 'auto' : false
    },
    isTS(id) {
      return this.templateContainer[id] === 'ts'
    },
    convert2Front(data) {
      let front = _.cloneDeep(data)
      if (!data.outputs || Object.keys(data.outputs) === 0) {
        front.outputs = []
      } else {
        front.outputs.forEach((item) => {
          item.template = `${item.preset_id}+${
            this.templateName[item.preset_id]
          }`
        })
      }

      if (!data.snapshots || Object.keys(data.snapshots) === 0) {
        front.snapshots = []
      }

      this.auxiliary.MP = !!front.master_playlist
      if (!front.master_playlist) {
        front.master_playlist = {
          format: 'HLSv3',
          name: '',
        }
      }
      this.transcode = front

      this.auxiliary.regular = data.allowed_keys_regex[0]

      data.output_acls.forEach((item) => {
        let acc = {
          Read: false,
          ReadAcp: false,
          WriteAcp: false,
        }
        item.Access.forEach((item) => {
          if (item === 'FullControl') {
            acc = {
              Read: true,
              ReadAcp: true,
              WriteAcp: true,
            }
          } else {
            acc[item] = true
          }
        })
        item.Access = acc
        if (item.GranteeType === 'Group') {
          if (item.Grantee === 'AllUsers') {
            this.groupACLList[0] = item
          } else {
            this.groupACLList[1] = item
          }
        } else {
          this.userACLList.push(item)
        }
        if (this.groupACLList.length === 0) this.groupACLList = _.cloneDeep(groupACLListDefult)
      })
    },
    validateRegular(rule, value, callback) {
      if (isREG(value)) {
        callback(new Error(this.$t('VIDEO.EXPRESSION_INCORRECT')))
      } else {
        callback()
      }
    },
    validateName(rule, value, callback) {
      if (!value && this.auxiliary.MP) {
        callback(new Error(this.$t('VIDEO.FILE_NAME_SUFFIX_CANNOT_EMPTY')))
      } else {
        callback()
      }
    },
    validateSegment(rule, value, callback) {
      if (
        this.isTS(this.outputModal.preset_id) &&
        this.auxiliary.MP &&
        value === 0
      ) {
        callback(new Error(this.$t('VIDEO.HLS_SLICE_LENGTH_CANNOT_BE_0')))
      } else {
        callback()
      }
    },
    validateWidth(rule, value, callback) {
      if (this.shotModal.resolution !== 'auto') {
        if (!Number.isInteger(value)) {
          callback(new Error(this.$t('PUBLIC.NUM_PLEASE')))
        } else {
          if (value < 1) {
            callback(new Error(this.$t('PUBLIC.NOT_LESS', { num: '1' })))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    },
    validateInputKey(rule, value, callback) {
      if (!this.isAutoCodec && this.auxiliary.isWaterMarkerOpen && !value) {
        callback(new Error('请填写水印文件key'))
      } else {
        callback()
      }
    },
  },
}
const isREG = (vlaue) => {
  try {
    new RegExp(vlaue)
  } catch (error) {
    return true
  }
  return false
}
const groupGrantee = ['AllUsers', 'AuthenticatedUsers']

const groupACLListDefult = [
  {
    GranteeType: 'Group',
    Grantee: 'AllUsers',
    Access: {
      Read: false,
      ReadAcp: false,
      WriteAcp: false,
    },
  },
  {
    GranteeType: 'Group',
    Grantee: 'AuthenticatedUsers',
    Access: {
      Read: false,
      ReadAcp: false,
      WriteAcp: false,
    },
  },
]

const auxiliaryDefult = {
  reg: 'regular',
  path: '',
  extension: '',
  regular: '',
  MP: false,
  isWaterMarkerOpen: false,
}

const outputsDefult = {
  key_suffix: '',
  preset_id: '',
  segment_duration: 0,
}
const shotDefult = {
  key_suffix: '',
  format: 'jpg',
  time: '0',
  interval: '1',
  number: '1',
  resolution: 'auto',
  aspect_ratio: 'auto',
  width: '',
  height: '',
}

const transcodeDefult = {
  // id: Date.now() + Math.random().toString().slice(-6),
  is_enabled: 'true',
  allowed_keys_regex: [],
  keep_input_path: 'false',
  delete_origin: 'false',
  output_key_prefix: '',
  output_bucket: '',
  outputs: [],
  snapshots: [],
  output_acls: [],
  master_playlist: {
    format: 'HLSv3',
    name: '',
  },
  success_callback_url: '',
  failure_callback_url: '',
}

const aclConvert2Save = (data) => {
  const saved = {
    Grantee: data.Grantee,
  }

  if (!groupGrantee.includes(data.Grantee)) {
    saved.GranteeType = data.Grantee.split('@')[1] ? 'Email' : 'Canonical'
  } else {
    saved.GranteeType = data.GranteeType
  }
  if (Object.values(data.Access).includes(false)) {
    saved.Access = []
    _.forEach(data.Access, (value, key) => {
      if (value) {
        saved.Access.push(key)
      }
    })
  } else {
    saved.Access = ['FullControl']
  }
  return saved
}
</script>
<style lang="less" scope>
@import '../../styles/index.less';
@edit-output-item-span: 205px;
@edit-output-item-margin: 210px;
@edit-modal-item-span: 155px;

.@{css-prefix}output-edit {
  .editBlock {
    .form-item {
      .form-label {
        vertical-align: top;
        width: @edit-output-item-span !important;
      }

      .sub-setting-input {
        width: 200px;
      }

      .button-add-item {
        margin-left: @edit-output-item-margin !important;
      }

      .style-name-info {
        padding-left: @edit-output-item-margin!important;
      }
    }
  }

  .new-user-input {
    width: 85%;
  }
  .button-save {
    margin-left: 400px;
    transform: translateX(-50%);
  }
}
</style>
