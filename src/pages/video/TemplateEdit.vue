<template>
  <div class="bsc-template-edit bsc-edit">
    <div class="layout-bsc-toolbar">
      <Breadcrumb>
        <Breadcrumb-item href="/video/template">{{$t('VIDEO.TEMPLATE_CONFIGURATION')}}</Breadcrumb-item>
        <Breadcrumb-item>{{$t('VIDEO.NEW_TEMPLATE')}}</Breadcrumb-item>
      </Breadcrumb>
    </div>
    <Form ref="basicValidate"
          :model="template"
          :rules="ruleValidate"
          :label-width="175">
      <div class="separator-line"></div>
      <div class="editBlock">
        <div class="section-separator">
          <div class="separator-body">
            <span class="separator-icon"></span>
            <span class="separator-info">{{$t('VIDEO.BASE_INFO')}}</span>
          </div>
        </div>
        <div class="form-item">
          <FormItem :label="$t('VIDEO.TEMPLATE_NAME')"
                    prop="Name"
                    required>
            <Input v-model="template.Name"
                   :placeholder="$t('VIDEO.TEMPLATE_NAME')"
                   class="line-width" />
          </FormItem>
        </div>
        <div class="form-item">
          <FormItem :label="$t('VIDEO.TEMPLATE_DESCRIPTION')"
                    prop="Description">
            <Input v-model="template.Description"
                   :placeholder="$t('VIDEO.ENTER_THE_TEMPLATE_DESCRIPTION_TEXT')"
                   type="textarea"
                   :autosize="true"
                   class="line-width" />
          </FormItem>
        </div>
        <div class="form-item">
          <span class="form-label">{{$t('VIDEO.PACKAGE_FORMAT')}} : </span>
          <Radio-group v-model="template.Container"
                       @on-change="containerChange">
            <Radio v-for="con in containerList"
                   :key="con"
                   :label="con">{{con}}</Radio>
          </Radio-group>
        </div>
        <div class="form-item"
             v-if="template.Container === 'mp4'">
          <span class="form-label">FastStart : </span>
          <i-switch v-model="template.FastStart">
            <span slot="open">{{$t('VIDEO.ON')}}</span>
            <span slot="close">{{$t('VIDEO.OFF')}}</span>
          </i-switch>
        </div>
      </div>
    </Form>
    <div class="separator-line"></div>
    <div class="editBlock">
      <div class="section-separator">
        <div class="separator-body">
          <span class="separator-icon"></span>
          <span class="separator-info">{{$t('VIDEO.VIDEO_PARAMETER_CONFIGURATION')}}</span>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label">{{$t('VIDEO.ENCODING')}} : </span>
        <Radio-group v-model="template.Video.Codec">
          <Radio :disabled="videoDisabled"
                 v-for="codec in videoCodecList"
                 v-if="codec.container.includes(template.Container)"
                 :key="codec.value"
                 :label="codec.value">{{codec.name}}</Radio>
        </Radio-group>
      </div>
      <div class="form-item"
           v-if="template.Video.Codec === 'H.264'">
        <span class="form-label">{{$t('VIDEO.CODING_PROFILE')}} : </span>
        <Radio-group v-model="template.Video.CodecOptions.Profile">
          <Radio v-for="pro in videoProfileList"
                 :key="pro"
                 :label="pro">{{pro}}</Radio>
        </Radio-group>
      </div>
      <div class="form-item"
           v-if="template.Video.Codec === 'H.264'">
        <span class="form-label">{{$t('VIDEO.CODING_LEVEL')}} : </span>
        <Radio-group v-model="template.Video.CodecOptions.Level">
          <Radio v-for="level in videoLevelList"
                 :key="level"
                 :label="level">{{level}}</Radio>
        </Radio-group>
      </div>
      <div class="form-item"
           v-if="template.Video.Codec === 'H.264' || template.Video.Codec === 'H.265'">
        <Form ref="videoValidate"
              :model="template.Video"
              :rules="ruleValidate"
              :label-width="5"
              inline>
          <span class="form-label">{{$t('VIDEO.FIXED_KEY_FRAME_SPACING')}} : </span>
          <i-switch v-model="template.Video.FixedGOP">
            <span slot="open">{{$t('VIDEO.ON')}}</span>
            <span slot="close">{{$t('VIDEO.OFF')}}</span>
          </i-switch>
          <FormItem prop="KeyframesMaxDist">
            <InputNumber v-model="template.Video.KeyframesMaxDist"
                         :disabled="!template.Video.FixedGOP"></InputNumber> {{$t('VIDEO.SECOND')}} (1~100000)
          </FormItem>
        </Form>
      </div>
      <div class="form-item">
        <span class="form-label">{{$t('VIDEO.BIT_RATE')}} : </span>
        <Radio-group v-model="auxiliary.videoBitRate">
          <Radio label="auto"
                 :disabled="videoDisabled">{{$t('VIDEO.ADAPTIVE')}}</Radio>
          <Radio label="value"
                 :disabled="videoDisabled">{{$t('VIDEO.USER_DEFINED')}}</Radio>
        </Radio-group>
        <InputNumber :min="1"
                     v-model="auxiliary.videoBitRateValue"
                     :disabled="auxiliary.videoBitRate === 'auto'"></InputNumber> Kbps
      </div>
      <div class="form-item">
        <span class="form-label">{{$t('VIDEO.FRAME_RATE')}} : </span>
        <Select v-model="template.Video.FrameRate"
                :disabled="videoDisabled"
                class="line-width">
          <Option v-for="fr in videoFrameRateList"
                  :value="fr.value"
                  :key="fr.value">{{fr.name}}</Option>
        </Select>
      </div>
      <div class="form-item"
           v-if="template.Video.Codec !== 'auto'">
        <span class="form-label">{{$t('VIDEO.RESOLUTION')}} : </span>
        <Radio-group v-model="auxiliary.resolution">
          <Radio label="auto">{{$t('VIDEO.UNALTERED')}}</Radio>
          <Radio label="value">{{$t('VIDEO.USER_DEFINED')}}
            <InputNumber :min="1"
                         v-model="auxiliary.width"
                         :disabled="!(auxiliary.resolution === 'value')"
                         :placeholder="$t('VIDEO.WIDTH')"></InputNumber>
            <InputNumber :min="1"
                         v-model="auxiliary.height"
                         :disabled="!(auxiliary.resolution === 'value')"
                         :placeholder="$t('VIDEO.HEIGHT')"></InputNumber>
          </Radio>
          <Radio label="only_width">
            {{$t('VIDEO.HIGHLY_ADAPTIVE')}}
            <InputNumber :min="1"
                         v-model="auxiliary.only_width"
                         :disabled="!(auxiliary.resolution === 'only_width')"
                         :placeholder="$t('VIDEO.WIDTH')"></InputNumber>
          </Radio>
          <Radio label="only_height">
            {{$t('VIDEO.WIDTH_ADAPTIVE')}}
            <InputNumber :min="1"
                         v-model="auxiliary.only_height"
                         :disabled="!(auxiliary.resolution === 'only_height')"
                         :placeholder="$t('VIDEO.HEIGHT')"></InputNumber>
          </Radio>
        </Radio-group>
      </div>
      <div class="form-item"
           v-if="template.Video.Codec !== 'auto'">
        <span class="form-label">{{$t('VIDEO.ASPECT_RATIO')}} : </span>
        <Radio-group v-model="template.Video.AspectRatio">
          <Radio v-for="asp in aspectRatioList"
                 :key="asp.value"
                 :label="asp.value">{{asp.name}}</Radio>
        </Radio-group>
      </div>
    </div>
    <div class="separator-line"></div>
    <div class="editBlock">
      <div class="section-separator">
        <div class="separator-body">
          <span class="separator-icon"></span>
          <span class="separator-info">{{$t('VIDEO.AUDIO_PARAMETER_CONFIGURATION')}}</span>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label">{{$t('VIDEO.ENCODING')}} : </span>
        <Radio-group v-model="template.Audio.Codec">
          <Radio v-for="codec in audioCodecList"
                 v-if="codec.container.includes(template.Container)"
                 :key="codec.value"
                 :label="codec.value">{{codec.name}}</Radio>
        </Radio-group>
      </div>
      <div class="form-item"
           v-if="template.Audio.Codec === 'AAC'">
        <span class="form-label">{{$t('VIDEO.CODING_QUALITY')}} : </span>
        <Radio-group v-model="template.Audio.CodecOptions.Profile">
          <Radio v-for="pro in audioProfileList"
                 :key="pro.value"
                 :label="pro.value">{{pro.name}}</Radio>
        </Radio-group>
      </div>
      <div class="form-item">
        <span class="form-label">{{$t('VIDEO.SAMPLE_RATE')}}(HZ) : </span>
        <Radio-group v-model="template.Audio.SampleRate">
          <Radio v-for="sam in audioSampleRateList"
                 :key="sam.value"
                 :label="sam.value">{{sam.name}}</Radio>
        </Radio-group>
      </div>
      <div class="form-item">
        <span class="form-label">{{$t('VIDEO.BIT_RATE')}} : </span>
        <Radio-group v-model="auxiliary.audioBitRate">
          <Radio label="auto">{{$t('VIDEO.ADAPTIVE')}}</Radio>
          <Radio label="value">{{$t('VIDEO.USER_DEFINED')}}</Radio>
        </Radio-group>
        <Slider v-model="auxiliary.audioBitRateValue"
                :min="64"
                :max="320"
                :disabled="auxiliary.audioBitRate === 'auto'"
                class="my-slider"></Slider>
        <InputNumber :min="64"
                     :max="320"
                     v-model="auxiliary.audioBitRateValue"
                     :disabled="auxiliary.audioBitRate === 'auto'"></InputNumber>
      </div>
      <div class="form-item">
        <span class="form-label">{{$t('VIDEO.CHANNELS')}} : </span>
        <Select v-model="template.Audio.Channels"
                class="line-width">
          <Option v-for="ch in audioChannelsList"
                  :value="ch.value"
                  :key="ch.value">{{ch.name}}</Option>
        </Select>
      </div>
    </div>
    <div class="separator-line"></div>
    <div class="editBlock">
      <div class="section-separator">
        <div class="separator-body">
          <span class="separator-icon"></span>
          <span class="separator-info">水印参数配置</span>
        </div>
      </div>
      <p class="page-info">水印宽度或水印高度任意项为0都将使用图片本身大小</p>
      <div class="form-item">
        <span class="form-label">水印宽度 : </span>
        <div class="input-text-box">
          <InputNumber v-model="template.WatermarkConfig.Width"></InputNumber>
          <span>px</span>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label">水印高度 : </span>
        <div class="input-text-box">
          <InputNumber v-model="template.WatermarkConfig.Height"></InputNumber>
          <span>px</span>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label">{{$t("STORAGE.WATERMARKER_POSITION")}} : </span>
        <div class="gravity-selector">
          <input type="radio"
                 value="NorthWest"
                 name="location"
                 v-model="template.WatermarkConfig.Location" />
          <input type="radio"
                 value="North"
                 name="location"
                 v-model="template.WatermarkConfig.Location" />
          <input type="radio"
                 value="NorthEast"
                 name="location"
                 v-model="template.WatermarkConfig.Location" />
          <input type="radio"
                 value="West"
                 name="location"
                 v-model="template.WatermarkConfig.Location" />
          <input type="radio"
                 value="Center"
                 name="location"
                 v-model="template.WatermarkConfig.Location" />
          <input type="radio"
                 value="East"
                 name="location"
                 v-model="template.WatermarkConfig.Location" />
          <input type="radio"
                 value="SouthWest"
                 name="location"
                 v-model="template.WatermarkConfig.Location" />
          <input type="radio"
                 value="South"
                 name="location"
                 v-model="template.WatermarkConfig.Location" />
          <input type="radio"
                 value="SouthEast"
                 name="location"
                 v-model="template.WatermarkConfig.Location" />
        </div>
        <div class="padding-setting">
          <div class="form-item">
            <Tooltip placement="top-end">
              <span class="form-label">水平偏移 :  
                <Icon type="ios-help-outline"></Icon>
              </span>
              <div slot="content">
                <p>{{$t('VIDEO.TIPS')}}</p>
                <p>{{$t('VIDEO.OFFSET_X_TIPS')}}</p>
              </div>
            </Tooltip>
            <div class="input-text-box">
              <InputNumber v-model="template.WatermarkConfig.LocationHOffset"></InputNumber>
              <span>px</span>
            </div>
          </div>
          <div class="form-item">
            <Tooltip placement="top-end">
              <span class="form-label">垂直偏移 : 
                <Icon type="ios-help-outline"></Icon>
              </span>
              <div slot="content">
                <p>{{$t('VIDEO.TIPS')}}</p>
                <p>{{$t('VIDEO.OFFSET_Y_TIPS')}}</p>
              </div>
            </Tooltip>
            <div class="input-text-box">
              <InputNumber v-model="template.WatermarkConfig.LocationVOffset"></InputNumber>
              <span>px</span>
            </div>
          </div>
        </div>
      </div>
      <!--location-->
    </div>
    <div class="separator-line"></div>
    <div class="editBlock">
      <Button type="primary"
              class="button-save"
              @click="beforeSubmit">{{$t('VIDEO.SAVE')}}</Button>
    </div>
  </div>
</template>
<script>
import { transcoder } from '@/service/Aws'
import { putTranscoderUrl, postTranscoderUrl } from 'api'

export default {
  data() {
    return {
      videoDisabled: false,
      template: _.cloneDeep(templateDefult),
      auxiliary: _.cloneDeep(auxiliaryDefult),
      containerList: [
        'flv',
        'gif',
        'mp3',
        'mp4',
        'mpg',
        'ts',
        'wmv',
        'wma',
        'mp2',
      ],
      videoCodecList: [
        {
          name: this.$t('VIDEO.UNALTERED'),
          value: 'auto',
          container: [
            'flac',
            'flv',
            'mp3',
            'mp4',
            'mpg',
            'ts',
            'wmv',
            'wma',
            'mp2',
          ],
        },
        { name: 'gif', value: 'gif', container: ['gif'] },
        { name: 'H.264', value: 'H.264', container: ['flv', 'mp4', 'ts'] },
        { name: 'H.265', value: 'H.265', container: ['mp4', 'ts'] },
        { name: 'mpeg2', value: 'mpeg2', container: ['mpg'] },
        { name: 'msmpeg4', value: 'msmpeg4', container: ['wmv'] },
      ],
      videoProfileList: ['baseline', 'main', 'high'],
      videoLevelList: ['3', '3.1', '3.2', '4', '4.1'],
      videoFrameRateList: [
        { name: this.$t('VIDEO.UNALTERED'), value: 'auto' },
        { name: '10', value: '10' },
        { name: '15', value: '15' },
        { name: '23.97', value: '23.97' },
        { name: '24', value: '24' },
        { name: '25', value: '25' },
        { name: '29.97', value: '29.97' },
        { name: '30', value: '30' },
        { name: '50', value: '50' },
        { name: '60', value: '60' },
      ],
      aspectRatioList: [
        { name: this.$t('VIDEO.UNALTERED'), value: 'auto' },
        { name: '1:1', value: '1:1' },
        { name: '4:3', value: '4:3' },
        { name: '3:2', value: '3:2' },
        { name: '16:9', value: '16:9' },
      ],
      audioCodecList: [
        {
          name: this.$t('VIDEO.UNALTERED'),
          value: 'auto',
          container: ['flac', 'flv', 'gif', 'mp4', 'mpg', 'ts', 'wmv'],
        },
        { name: 'AAC', value: 'AAC', container: ['mp4', 'ts', 'flv'] },
        { name: 'mp3', value: 'mp3', container: ['flv', 'mp4', 'ts', 'mp3'] },
        { name: 'mp2', value: 'mp2', container: ['mpg', 'mp2'] },
        { name: 'wmav2', value: 'wmav2', container: ['wmv', 'wma'] },
      ],
      audioProfileList: [
        { name: this.$t('VIDEO.ADAPTIVE'), value: 'auto' },
        { name: 'AAC-LC', value: 'AAC-LC' },
        { name: 'HE-AAC', value: 'HE-AAC' },
        { name: 'HE-AACv2', value: 'HE-AACv2' },
      ],
      audioSampleRateList: [
        { name: this.$t('VIDEO.UNALTERED'), value: 'auto' },
        { name: '22050', value: '22050' },
        { name: '32000', value: '32000' },
        { name: '44100', value: '44100' },
        { name: '48000', value: '48000' },
        { name: '96000', value: '96000' },
      ],
      audioChannelsList: [
        { name: this.$t('VIDEO.UNALTERED'), value: 'auto' },
        { name: '1', value: '1' },
        { name: '2', value: '2' },
        { name: '3', value: '3' },
        { name: '4', value: '4' },
        { name: '5', value: '5' },
        { name: '6', value: '6' },
        { name: '7', value: '7' },
        { name: '8', value: '8' },
        { name: '9', value: '9' },
        { name: '10', value: '10' },
        { name: '11', value: '11' },
        { name: '12', value: '12' },
        { name: '13', value: '13' },
        { name: '14', value: '14' },
        { name: '15', value: '15' },
        { name: '16', value: '16' },
      ],
      ruleValidate: {
        Name: [{ validator: this.validateName, trigger: 'change' }],
        Description: [
          { validator: this.validateDiscription, trigger: 'change' },
        ],
        KeyframesMaxDist: [
          { validator: this.validateMaxDist, trigger: 'change' },
        ],
      },
    }
  },
  computed: {
    templateId() {
      return this.$route.params.id
    },
  },
  created() {
    this.readPreset()
  },
  methods: {
    async beforeSubmit() {
      this.$refs['basicValidate'].validate((valid) => {
        if (!valid) {
          this.$Message.error(this.$t('PUBLIC.FORM_VALID_FAILED'))
        } else {
          if (this.template.Video.FixedGOP) {
            this.$refs['videoValidate'] &&
              this.$refs['videoValidate'].validate((valid) => {
                if (!valid) {
                  this.$Message.error(this.$t('PUBLIC.FORM_VALID_FAILED'))
                } else {
                  this.createPreset()
                }
              })
          } else {
            this.createPreset()
          }
        }
      })
    },
    async createPreset() {
      let template = convert2Save(this.template, this.auxiliary)
      try {
        this.$Loading.start()
        if (this.templateId === 'none') {
          await postTranscoderUrl('presets', template)
          this.$Message.success(this.$t('VIDEO.CREATED_SUCCESSFULLY'))
        } else {
          delete template.Id
          await putTranscoderUrl(`presets/${this.templateId}`, template)
          this.$Message.success(this.$t('VIDEO.UPDATED_SUCCESSFULLY'))
        }
        this.$Loading.finish()
        this.$router.push({ name: 'template' })
      } catch (error) {
        this.$Loading.error()
      }
    },
    async readPreset() {
      if (this.templateId !== 'none') {
        try {
          this.$Loading.start()
          let res = await transcoder('readPreset', { Id: this.templateId })
          this.template = res.Preset
          this.template.Video.FixedGOP = res.Preset.Video.FixedGOP === 'true'
          this.template.FastStart = res.Preset.FastStart === 'true'
          this.template.WatermarkConfig = res.Preset.WatermarkConfig
            ? res.Preset.WatermarkConfig
            : watermarkConfigDefault
          this.auxiliary = convert2Front(res.Preset)
          this.$Loading.finish()
        } catch (error) {
          this.$Loading.error()
        }
      }
    },
    containerChange(value) {
      this.template.Video = _.cloneDeep(templateDefult.Video)
      this.template.Audio = _.cloneDeep(templateDefult.Audio)
      this.auxiliary.resolution = 'auto'
      this.auxiliary.audioBitRate = 'auto'
      if (audioOnly.includes(value)) {
        this.template.Video.Codec = 'auto'
        this.auxiliary.videoBitRate = 'auto'
        this.template.Video.FrameRate = 'auto'
        this.videoDisabled = true
        this.template.Audio.Codec = container2codec[this.template.Container]
      } else {
        this.videoDisabled = false
        this.template.Audio.Codec = 'auto'
        this.template.Video.Codec = value === 'gif' ? 'gif' : 'auto'
      }
    },
    validateDiscription(rule, value, callback) {
      if (new TextEncoder('utf-8').encode(value).length > 100) {
        callback(new Error(this.$t('VIDEO.TEMPLATE_DESCRIPTION_CHAR_NUMBER')))
      } else {
        callback()
      }
    },
    validateName(rule, value, callback) {
      if (!value) {
        callback(new Error(this.$t('VIDEO.TEMPLATE_NAME_REQUIRED')))
      } else if (new TextEncoder('utf-8').encode(value).length > 20) {
        callback(new Error(this.$t('VIDEO.TEMPLATE_NAME_CHAR_NUMBER')))
      } else {
        callback()
      }
    },
    validateMaxDist(rule, value, callback) {
      if (!Number(value)) {
        callback(new Error(this.$t('PUBLIC.NUM_PLEASE')))
      } else {
        if (value < 1) {
          callback(new Error(this.$t('PUBLIC.NOT_LESS', { num: '1' })))
        } else if (value > 100000) {
          callback(new Error(this.$t('PUBLIC.NOT_GREATER', { num: '100000' })))
        } else {
          callback()
        }
      }
    },
  },
}

const convert2Front = (data) => {
  let auxiliary = _.cloneDeep(auxiliaryDefult)
  if (data.Video.BitRate === 'auto') {
    auxiliary.videoBitRate = 'auto'
  } else {
    auxiliary.videoBitRate = 'value'
    auxiliary.videoBitRateValue = parseInt(data.Video.BitRate)
  }

  if (data.Video.Resolution === 'auto') {
    auxiliary.resolution = 'auto'
  } else {
    let values = data.Video.Resolution.split('x')
    if (values[0] === '-2') {
      auxiliary.resolution = 'only_height'
      auxiliary.only_height = parseInt(values[1])
    } else if (values[1] === '-2') {
      auxiliary.resolution = 'only_width'
      auxiliary.only_width = parseInt(values[0])
    } else {
      auxiliary.resolution = 'value'
      auxiliary.width = values[0]
      auxiliary.height = values[1]
    }
  }

  if (data.Audio.BitRate === 'auto') {
    auxiliary.audioBitRate = 'auto'
  } else {
    auxiliary.audioBitRate = 'value'
    auxiliary.audioBitRateValue = parseInt(data.Audio.BitRate)
  }

  return auxiliary
}
const convert2Save = (template, auxiliary) => {
  let saved = _.cloneDeep(template)

  if (auxiliary.videoBitRate !== 'auto') {
    saved.Video.BitRate = auxiliary.videoBitRateValue.toString()
  } else {
    saved.Video.BitRate = auxiliary.videoBitRate
  }

  if (auxiliary.resolution !== 'auto') {
    if (auxiliary.resolution === 'only_width') {
      saved.Video.Resolution = `${auxiliary.only_width}x-2`
    } else if (auxiliary.resolution === 'only_height') {
      saved.Video.Resolution = `-2x${auxiliary.only_height}`
    } else {
      saved.Video.Resolution = `${auxiliary.width}x${auxiliary.height}`
    }
  } else {
    saved.Video.Resolution = auxiliary.resolution
  }

  if (auxiliary.audioBitRate !== 'auto') {
    saved.Audio.BitRate = auxiliary.audioBitRateValue.toString()
  } else {
    saved.Audio.BitRate = auxiliary.audioBitRate
  }

  saved.FastStart = template.FastStart.toString()
  saved.Video.FixedGOP = template.Video.FixedGOP.toString()
  saved.Video.KeyframesMaxDist = template.Video.KeyframesMaxDist.toString()

  saved.WatermarkConfig.Height = template.WatermarkConfig.Height.toString()
  saved.WatermarkConfig.Width = template.WatermarkConfig.Width.toString()
  saved.WatermarkConfig.LocationHOffset = template.WatermarkConfig.LocationHOffset.toString()
  saved.WatermarkConfig.LocationVOffset = template.WatermarkConfig.LocationVOffset.toString()

  return saved
}

const auxiliaryDefult = {
  videoBitRate: 'auto',
  videoBitRateValue: 1,
  resolution: 'auto',
  width: '',
  height: '',
  only_width: 1,
  only_height: 1,
  audioBitRate: 'auto',
  audioBitRateValue: 64,
}
const watermarkConfigDefault = {
  Height: '0',
  Width: '0',
  Location: 'NorthEast',
  LocationHOffset: '0',
  LocationVOffset: '0',
}
const templateDefult = {
  Name: '',
  Description: '',
  FastStart: false,
  Container: 'mp4',
  Audio: {
    Codec: 'auto',
    CodecOptions: {
      Profile: 'auto',
    },
    SampleRate: 'auto',
    BitRate: '64',
    Channels: 'auto',
  },
  Video: {
    Codec: 'H.264',
    CodecOptions: {
      Profile: 'high',
      Level: '3.1',
    },
    KeyframesMaxDist: '1',
    FixedGOP: false,
    BitRate: '64',
    FrameRate: 'auto',
    Resolution: 'auto',
    AspectRatio: 'auto',
  },
  WatermarkConfig: watermarkConfigDefault,
}
const audioOnly = ['flac', 'mp3', 'wma', 'mp2']
const container2codec = { mp3: 'mp3', wma: 'wmav2', mp2: 'mp2' }
</script>

<style lang="less" scoped>
@edit-output-item-span: 175px;
.button-save {
  margin-left: 388px;
  transform: translateX(-50%);
}
</style>
