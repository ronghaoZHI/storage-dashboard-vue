<template>
  <div class="bsc-edit-styles">
    <div class="layout-bsc-toolbar">
      <a class="btn-back"
         @click="back()">
        <Icon type="chevron-left"></Icon>
      </a>
      <bsc-breadcrumb>
        <bsc-breadcrumb-item :href="bucketPath">{{$t("STORAGE.TITLE")}}</bsc-breadcrumb-item>
        <bsc-breadcrumb-item :href="styleListHref">{{$t("STORAGE.PIC_STYLE")}}</bsc-breadcrumb-item>
        <bsc-breadcrumb-item>{{$t("STORAGE.CREATE_STYLE")}} ({{bucket}})</bsc-breadcrumb-item>
      </bsc-breadcrumb>
    </div>
    <Tabs size="small"
          v-model="tabValue"
          :animated="false">
      <Tab-pane :label="$t('STORAGE.BASIC_EDIT')"
                name="primary"
                :disabled="primaryDisable"
                class="clearfix">
        <div class="page-left">
          <span class="preview-span">{{$t("STORAGE.PREVIEW")}}:</span>
          <div class="test-img">
            <img :src="previewUrl">
            <div>
              <Button type="primary"
                      @click="primaryPreview"
                      :disabled="primaryPreviewError">{{$t("STORAGE.PREVIEW")}}</Button>
            </div>
          </div>
        </div>
        <div class="page-right">
          <Form ref="basicForm"
                :model="this"
                :rules="ruleValidate"
                :label-width="0"
                inline>
            <div class="form-item mar-b-0">
              <span class="form-label required-item">{{$t("STORAGE.STYLE_NAME")}} : </span>
              <FormItem prop="transformation">
                <Input v-model="transformation"
                       :placeholder="$t('STORAGE.STYLE_NAME')"
                       class="line-width" />
              </FormItem>
            </div>
            <div class="form-item">
              <span class="form-label">{{$t("STORAGE.STYLE_CROP")}} : </span>
              <Radio-group v-model="general.crop"
                           style="vertical-align: text-top">
                <Radio label="noCrop">{{$t("STORAGE.CROP_NONE")}}</Radio>
                <Radio label="scale">{{$t("STORAGE.CROP_SCALE")}}</Radio>
                <Radio label="fit">{{$t("STORAGE.CROP_FIT")}}</Radio>
                <Radio label="fill">{{$t("STORAGE.CROP_FILL")}}</Radio>
                <p style="height: 10px;"></p>
                <Radio label="crop">{{$t("STORAGE.CROP_CROP")}}</Radio>
                <Radio label="thumb">{{$t("STORAGE.CROP_THUMB")}}</Radio>
                <Radio label="pad">{{$t("STORAGE.CROP_PAD")}}</Radio>
              </Radio-group>
            </div>
            <div class="form-item"
                 v-if="general.crop === 'fit'">
              <Select v-model="general.fitType"
                      class="sub-select">
                <Option v-for="item in fitList"
                        :value="item.value"
                        :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="form-item"
                 v-if="general.crop === 'pad'">
              <Select v-model="general.padType"
                      class="sub-select"
                      style="margin-right:8px">
                <Option v-for="item in padList"
                        :value="item.value"
                        :key="item.value">{{ item.label }}</Option>
              </Select>
              <ColorPickerInput v-model="general.padColor"
                                style="display:inline" />
            </div>
            <div class="form-item"
                 v-if="general.crop === 'fill'">
              <Select v-model="general.fillType"
                      class="sub-select">
                <Option v-for="item in fillList"
                        :value="item.value"
                        :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="form-item"
                 v-if="general.crop === 'thumb'">
              <Select v-model="general.thumbType"
                      class="sub-select">
                <Option v-for="item in thumbList"
                        :value="item.value"
                        :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <!--thumb gravity-->
            <div class="gravity-preview clearfix"
                 v-if="general.crop === 'crop'">
              <div class="left">
                <div class="form-item">
                  <span class="form-label">{{$t('STORAGE.SELECT_LOCATION')}} : </span>
                  <Select v-model="general.gravity"
                          style="width:265px">
                    <Option v-for="item in cropGravityList"
                            :value="item.value"
                            :key="item.value">{{ item.label }}</Option>
                  </Select>
                </div>
                <div class="form-item"
                     v-if="general.gravity === 'xy_center' || general.gravity === 'noGravity'">
                  <div class="gravity-xy">
                    <span class="input-box-label">x : </span>
                    <div class="input-text-box">
                      <InputNumber v-model="general.x"></InputNumber>
                      <span>px</span>
                    </div>
                    <span class="input-box-label">y : </span>
                    <div class="input-text-box">
                      <InputNumber v-model="general.y"></InputNumber>
                      <span>px</span>
                    </div>
                  </div>
                </div>
              </div>
              <div :class="['right', gravityImg]"></div>
            </div>
            <!--crop gravity & xy-->
            <div class="form-item"
                 v-if="general.crop !== 'noCrop'">
              <span class="form-label">{{$t("STORAGE.FIT_STYLE")}} : </span>
              <Radio-group v-model="general.dataType">
                <Radio label="pixel">{{$t("STORAGE.PIXEL")}}(px)</Radio>
                <Radio label="percent">{{$t("STORAGE.PERCENT")}}(%)</Radio>
              </Radio-group>
              <span>W : </span>
              <div class="input-text-box">
                <InputNumber v-model.number="general.width"></InputNumber>
                <span v-if="general.dataType === 'pixel'">px</span>
                <span v-else>%</span>
              </div>
              <span>H : </span>
              <div class="input-text-box">
                <InputNumber v-model.number="general.height"></InputNumber>
                <span v-if="general.dataType === 'pixel'">px</span>
                <span v-else>%</span>
              </div>
            </div>
            <!--width & height-->
            <div class="form-item">
              <span class="form-label">{{$t("STORAGE.STYLE_QUALITY")}} : </span>
              <Slider class="pic-slider"
                      :min="1"
                      v-model="general.quality"></Slider>
              <Input v-model="general.quality"
                     class="slider-input"
                     number />
            </div>
            <!--quality-->
            <div class="form-item">
              <span class="form-label">{{$t("STORAGE.STYLE_FORMAT")}} : </span>
              <Select v-model="general.format"
                      class="line-width">
                <Option v-for="item in formatList"
                        :value="item"
                        :key="item.value">{{ item }}</Option>
              </Select>
            </div>
            <!--format-->
            <div class="separator-line"></div>
            <div class="form-item">
              <Button type="ghost"
                      @click="setMore = !setMore">{{$t("STORAGE.MORE_SET")}}
                <Icon type="chevron-down"
                      v-if="!setMore"></Icon>
                <Icon type="chevron-up"
                      v-else></Icon>
              </Button>
            </div>
            <div v-if="setMore">
              <div class="form-item">
                <span class="form-label">{{$t("STORAGE.FLIP_MODE")}} : </span>
                <Radio-group v-model="general.angleType"
                             style="vertical-align: text-top">
                  <Radio v-for="item in angleList"
                         :label="item.value"
                         :key="item.value">{{item.label}}</Radio>
                </Radio-group>
              </div>
              <!--angleType-->
              <div class="form-item"
                   v-if="general.angleType === 'angle'">
                <span class="form-label">{{$t("STORAGE.ANGLE")}} : </span>
                <div class="input-text-box">
                  <InputNumber v-model="general.angle"></InputNumber>
                  <span>°</span>
                </div>
              </div>
              <!--angle-->
              <div class="form-item">
                <span class="form-label">{{$t("STORAGE.FILTER_EFFECTS")}}</span>
                <div class="form-item-right">
                  <div class="effect-radio-box"
                       v-for="item in effectList"
                       :key="item.name">
                    <input type="radio"
                           :value="item.value"
                           :name="item.value"
                           :class="['effect-radio', item.value]"
                           v-model="general.effect">
                    <label :for="item.value">
                      <span class="effect-span-center">{{item.name}}</span>
                    </label>
                  </div>
                </div>
              </div>
              <!--effect-->
              <div class="form-item"
                   v-if="general.effect === 'brightness'">
                <span class="form-label">{{$t("STORAGE.BRIGHTNESS_VALUE")}} : </span>
                <Slider class="pic-slider"
                        :min="-300"
                        :max="300"
                        v-model="general.brightnessValue"></Slider>
                <Input v-model="general.brightnessValue"
                       class="slider-input"
                       number />
              </div>
              <!--brightnessValue-->
              <div class="form-item"
                   v-if="general.effect === 'blur'">
                <span class="form-label">{{$t("STORAGE.BLUR_VALUE")}} : </span>
                <Slider class="pic-slider mar-l15"
                        :min="1"
                        :max="2000"
                        v-model="general.blurValue"></Slider>
                <Input v-model="general.blurValue"
                       class="slider-input"
                       number />
              </div>
              <!--blurValue-->
              <div class="form-item"
                   v-if="general.effect === 'sharpen'">
                <span class="form-label">{{$t("STORAGE.SHARPEN_VALUE")}} : </span>
                <Slider class="pic-slider mar-l15"
                        :min="1"
                        :max="2000"
                        v-model="general.sharpenValue"></Slider>
                <Input v-model="general.sharpenValue"
                       class="slider-input"
                       number />
              </div>
              <!--sharpenValue-->
              <div class="form-item"
                   v-if="general.effect === 'oil_paint'">
                <span class="form-label">{{$t("STORAGE.OIL_VALUE")}}: </span>
                <Slider class="pic-slider mar-l15"
                        :min="1"
                        :max="8"
                        v-model="general.oilValue"></Slider>
                <Input v-model="general.oilValue"
                       class="slider-input"
                       number />
              </div>
              <!--oilValue-->
              <div class="form-item"
                   v-if="general.effect === 'color'">
                <span class="form-label">{{$t("STORAGE.COLOR")}} : </span>
                <div class="form-item-right">
                  <div class="effect-radio-box"
                       v-for="item in colorList"
                       :key="item.name">
                    <input type="radio"
                           :value="item.value"
                           :name="item.value"
                           :class="['effect-radio', item.value]"
                           v-model="general.color">
                    <label :for="item.value">
                      <span class="effect-span-center">{{item.name}}</span>
                    </label>
                  </div>
                </div>
              </div>
              <!--color-->
              <div class="form-item"
                   v-if="general.effect === 'color'">
                <span class="form-label">{{$t("STORAGE.COLOR_VALUE")}} : </span>
                <Slider class="pic-slider"
                        :min="1"
                        :max="100"
                        v-model="general.colorValue"></Slider>
                <Input v-model="general.colorValue"
                       class="slider-input"
                       number />
              </div>
              <!--colorValue-->
              <div class="form-item"
                   v-if="general.effect === 'pixelate'">
                <span class="form-label">{{$t("STORAGE.PX_VALUE")}} : </span>
                <Slider class="pic-slider"
                        :min="1"
                        :max="400"
                        v-model="general.pixelateValue"></Slider>
                <Input v-model="general.pixelateValue"
                       class="slider-input" />
              </div>
              <!--pixelateValue-->
              <div class="form-item">
                <span class="form-label">{{$t("STORAGE.BORDER")}} : </span>
                <i-switch v-model="general.border"
                          size="large">
                  <span slot="open">{{$t("STORAGE.ON")}}</span>
                  <span slot="close">{{$t("STORAGE.OFF")}}</span>
                </i-switch>
                <div class="input-text-box"
                     v-if="general.border">
                  <InputNumber v-model="general.borderSize"></InputNumber>
                  <span>px</span>
                </div>
                <!--borderSize-->
                <ColorPickerInput v-if="general.border"
                                  v-model="general.borderColor"
                                  style="display:inline" />
                <!--borderColor-->
              </div>
              <!--border-->
              <div class="form-item">
                <span class="form-label">{{$t("STORAGE.RADIUS")}} : </span>
                <Slider class="pic-slider"
                        :min="0"
                        :max="1001"
                        v-model="general.radius"
                        :tip-format="radiusFormater"></Slider>
                <Input v-model="radiusValue"
                       class="slider-input"
                       @on-change="radiusChange" />
              </div>
              <!--radius-->
              <div class="form-item">
                <span class="form-label">{{$t("STORAGE.OPACITY")}} : </span>
                <Slider class="pic-slider"
                        v-model="general.opacity"
                        :disabled="!isOpacity"></Slider>
                <Input v-model="general.opacity"
                       class="slider-input"
                       number />
              </div>
              <!--opacity-->
            </div>
            <div class="separator-line"></div>
            <div class="form-item">
              <span class="form-label">{{$t("STORAGE.STYLE_WATERMARKER")}} : </span>
              <i-switch v-model="markOpen"
                        size="large">
                <span slot="open">{{$t("STORAGE.ON")}}</span>
                <span slot="close">{{$t("STORAGE.OFF")}}</span>
              </i-switch>
            </div>
            <!--watermarkerOpen-->
            <div v-if="markOpen">
              <div class="form-item">
                <span class="form-label">{{$t("STORAGE.WATERMARKER_TYPE")}} : </span>
                <Radio-group v-model="markType">
                  <Radio label="text">{{$t("STORAGE.TEXT_WATERMARKER")}}</Radio>
                  <Radio label="img">{{$t("STORAGE.IMG_WATERMARKER")}}</Radio>
                </Radio-group>
              </div>
              <!--watermarkerType-->
              <div v-if="markType == 'text'">
                <div class="form-item mar-b-0">
                  <span class="form-label required-item">{{$t("STORAGE.TEXT_CONTENT")}} : </span>
                  <FormItem prop="mark.text">
                    <Input v-model="mark.text"
                           :placeholder="$t('STORAGE.TEXT_CONTENT')"
                           class="line-width" />
                  </FormItem>
                </div>
                <!--text-->
                <div class="form-item">
                  <span class="form-label">{{$t("STORAGE.TEXT_STYLE")}} : </span>
                  <Select v-model="fontStyle.font_family"
                          style="width:135px;margin-right:10px;">
                    <Option v-for="item in fontList"
                            :value="item.label"
                            :key="item.value">{{ item.label }}</Option>
                  </Select>
                  <!--font_family-->
                  <div class="input-text-box">
                    <InputNumber v-model="fontStyle.font_size"></InputNumber>
                    <span>px</span>
                  </div>
                  <!--font_size-->
                  <ColorPickerInput v-model="fontStyle.font_color"
                                    style="display:inline" />
                  <!--fontColor-->
                </div>
                <div class="form-item">
                  <span class="form-label">{{$t("STORAGE.BACKGROUBD")}} : </span>
                  <ColorPickerInput v-model="fontStyle.background"
                                    style="display:inline" />
                  <!--fontbackColor-->
                </div>
                <!--fontBack-->
              </div>
              <div v-if="markType == 'img'">
                <div class="form-item">
                  <span class="form-label required-item">{{$t("STORAGE.WATERMARKER_PIC")}} : </span>
                  <div class="upload-box"
                       :class="{'red-border': imgError}">
                    <upload :bucket="bucket"
                            :prefix="uploadPrefix"
                            accept="image/png"
                            :checkFileType="true"
                            :validateMessage="$t('STORAGE.WATER_PNG_VALID_INFO')"
                            :validation="uploadValidation"
                            v-on:uploadSuccess="uploadSuccess"></upload>
                  </div>
                </div>
                <!--image-->
              </div>
              <div class="form-item">
                <span class="form-label">{{$t("STORAGE.WATERMARKER_POSITION")}} : </span>
                <div class="gravity-selector">
                  <input type="radio"
                         value="north_west"
                         name="gravity"
                         v-model="mark.gravity" />
                  <input type="radio"
                         value="north"
                         name="gravity"
                         v-model="mark.gravity" />
                  <input type="radio"
                         value="north_east"
                         name="gravity"
                         v-model="mark.gravity" />
                  <input type="radio"
                         value="west"
                         name="gravity"
                         v-model="mark.gravity" />
                  <input type="radio"
                         value="center"
                         name="gravity"
                         v-model="mark.gravity" />
                  <input type="radio"
                         value="east"
                         name="gravity"
                         v-model="mark.gravity" />
                  <input type="radio"
                         value="south_west"
                         name="gravity"
                         v-model="mark.gravity" />
                  <input type="radio"
                         value="south"
                         name="gravity"
                         v-model="mark.gravity" />
                  <input type="radio"
                         value="south_east"
                         name="gravity"
                         v-model="mark.gravity" />
                </div>
                <div class="padding-setting">
                  <div class="form-item">
                    <span class="form-label">{{$t("STORAGE.PADDING_LEFT")}} : </span>
                    <div class="input-text-box">
                      <InputNumber v-model="mark.x"></InputNumber>
                      <span>px</span>
                    </div>
                  </div>
                  <div class="form-item">
                    <span class="form-label">{{$t("STORAGE.PADDING_TOP")}} : </span>
                    <div class="input-text-box">
                      <InputNumber v-model="mark.y"></InputNumber>
                      <span>px</span>
                    </div>
                  </div>
                </div>
              </div>
              <!--location-->
              <div class="form-item">
                <span class="form-label">{{$t("STORAGE.OPACITY")}} : </span>
                <Slider class="pic-slider"
                        v-model="mark.opacity"></Slider>
                <Input v-model="mark.opacity"
                       class="slider-input"
                       number />
              </div>
              <!--opacity-->
            </div>
            <div class="separator-line"></div>
            <div class="form-item clearfix line-button">
              <div class="img-button">
                <Button type="primary"
                        @click="beforeBasicSubmit(false)">{{$t("PUBLIC.CONFIRMED")}}</Button>
              </div>
            </div>
          </Form>
        </div>
      </Tab-pane>
      <Tab-pane :label="$t('STORAGE.ADV_EDIT')"
                name="senior">
        <div class="page-left">
          <span class="preview-span">{{$t("STORAGE.PREVIEW")}}:</span>
          <div class="test-img">
            <img :src="seniorUrl">
            <div class="img-button">
              <Button type="primary"
                      @click="seniorPreview">{{$t("STORAGE.PREVIEW")}}</Button>
            </div>
          </div>
        </div>
        <div class="page-right">
          <Form ref="seniorForm"
                :model="this"
                :rules="ruleValidate"
                :label-width="0"
                inline>
            <div class="form-item mar-b-0">
              <span class="form-label required-item">{{$t("STORAGE.STYLE_NAME")}} : </span>
              <FormItem prop="transformation">
                <Input v-model="transformation"
                       :placeholder="$t('STORAGE.STYLE_NAME')"
                       style="width: 475px" />
              </FormItem>
            </div>
            <div class="form-item">
              <span class="form-label required-item">{{$t("STORAGE.PROSCESS_PARAM")}} : </span>
              <FormItem prop="instructions">
                <Input v-model="instructions"
                       type="textarea"
                       :rows="6"
                       :placeholder="$t('STORAGE.SENIOR_INFO')"
                       style="width: 475px"
                       :autosize="textareaMinrows" />
              </FormItem>
              <p class="style-name-info">{{$t("STORAGE.PIC_EXAMPLE")}}</p>
              <p class="style-name-info">c_fit,w_300,f_png--l_bs_logo,g_north_west,w_120,o_35,x_43,y_20,a_-10</p>
              <p class="style-name-info dis-inline">{{$t("STORAGE.PARA_DESC")}}</p>
              <a href="http://doc.bscstorage.com/doc/imgx/imgx_manual.html">{{$t("STORAGE.SEE_COCUMENT")}}</a>
            </div>
            <div class="separator-line"></div>
            <div class="form-item clearfix line-button">
              <div class="img-button">
                <Button type="primary"
                        @click="beforeSeniorSubmit">{{$t("PUBLIC.CONFIRMED")}}</Button>
              </div>
            </div>
          </Form>
        </div>
      </Tab-pane>
    </Tabs>
  </div>
</template>
<script>
import { handler, getS3 } from '@/service/Aws'
import { prefix } from '@/service/BucketService'
import upload from '@/components/upload/upload'
import styleList from '@/pages/bucket/PictureStyles'
import iView from 'iview-bsc'
import encoding from 'text-encoding'
import { getImgxPreviewUrl } from 'api'
import bscBreadcrumb from '@/components/breadcrumb'
import {
  allFontList,
  previewAccessKey,
  previewSecretKey,
  I2J,
  generalDefult,
  markerDefult,
  defaultFontStyle,
} from './Consts'
export default {
  components: { upload, bscBreadcrumb, bscBreadcrumbItem: bscBreadcrumb.Item },
  data() {
    return {
      transformation: '',
      formatList: ['original', 'png', 'webp', 'jpeg', 'jpg'],
      fontList: allFontList,
      mark: _.clone(markerDefult),
      markOpen: false,
      markType: 'text',
      general: _.clone(generalDefult),
      imgName: '',
      uploadPrefix: prefix.overlay,
      uploadValidation: /^[\x00-\x2b\x2e\x30-\x39\x3b-\xff]+\.(png|PNG)$/,
      instructions: '',
      setMore: false,
      fontStyle: _.clone(defaultFontStyle),
      tabValue: 'primary',
      primaryDisable: false,
      previewUrl: getImgxUrl('q_100'),
      seniorUrl: getImgxUrl('q_100'),
      padList: [
        { value: 'pad', label: this.$t('STORAGE.CROP_PAD') },
        { value: 'lpad', label: this.$t('STORAGE.CROP_LPAD') },
        { value: 'mpad', label: this.$t('STORAGE.CROP_MPAD') },
      ],
      fillList: [
        { value: 'fill', label: this.$t('STORAGE.CROP_FILL') },
        { value: 'lfill', label: this.$t('STORAGE.CROP_LFILL') },
      ],
      thumbList: [
        { value: 'face', label: this.$t('STORAGE.CROP_FACE') },
        { value: 'faces', label: this.$t('STORAGE.CROP_FACES') },
        { value: 'face:center', label: this.$t('STORAGE.CROP_FACE_CENTER') },
        { value: 'faces:center', label: this.$t('STORAGE.CROP_FACES_CENTER') },
      ],
      fitList: [
        { value: 'fit', label: this.$t('STORAGE.CROP_FIT') },
        { value: 'mfit', label: this.$t('STORAGE.CROP_MFIT') },
        { value: 'limit', label: this.$t('STORAGE.CROP_LFIT') },
      ],
      angleList: [
        { value: 'angle', label: this.$t('STORAGE.ANGLE_ROTATION') },
        { value: 'vflip', label: this.$t('STORAGE.ANGLE_VFLIP') },
        { value: 'hflip', label: this.$t('STORAGE.ANGLE_HFLIP') },
      ],
      cropGravityList: [
        { value: 'north_west', label: this.$t('STORAGE.GRAVITY_NORTH_WEST') },
        { value: 'north', label: this.$t('STORAGE.GRAVITY_NORTH') },
        { value: 'north_east', label: this.$t('STORAGE.GRAVITY_NORTH_EAST') },
        { value: 'west', label: this.$t('STORAGE.GRAVITY_WEST') },
        { value: 'center', label: this.$t('STORAGE.GRAVITY_CENTER') },
        { value: 'east', label: this.$t('STORAGE.GRAVITY_EAST') },
        { value: 'south_west', label: this.$t('STORAGE.GRAVITY_SOUTH_WEST') },
        { value: 'south', label: this.$t('STORAGE.GRAVITY_SOUTH') },
        { value: 'south_east', label: this.$t('STORAGE.GRAVITY_SOUTH_EAST') },
        { value: 'noGravity', label: this.$t('STORAGE.GRAVITY_NOGRAVITY') },
        { value: 'xy_center', label: this.$t('STORAGE.GRAVITY_XY_CENTER') },
        { value: 'face', label: this.$t('STORAGE.CROP_FACE') },
        { value: 'faces', label: this.$t('STORAGE.CROP_FACES') },
        { value: 'face:center', label: this.$t('STORAGE.CROP_FACE_CENTER') },
        { value: 'faces:center', label: this.$t('STORAGE.CROP_FACES_CENTER') },
      ],
      effectList: [
        { name: this.$t('STORAGE.FILTER_EFFECTS_NONE'), value: 'noEffect' },
        { name: this.$t('STORAGE.GRAYSCALE'), value: 'grayscale' },
        { name: this.$t('STORAGE.AUTO_CONTRAST'), value: 'auto_contrast' },
        { name: this.$t('STORAGE.BRIGHTNESS'), value: 'brightness' },
        { name: this.$t('STORAGE.NEGATE'), value: 'negate' },
        { name: this.$t('STORAGE.SHARPEN'), value: 'sharpen' },
        { name: this.$t('STORAGE.BLUR'), value: 'blur' },
        { name: this.$t('STORAGE.OIL_PAINT'), value: 'oil_paint' },
        { name: this.$t('STORAGE.PIXELATE'), value: 'pixelate' },
        { name: this.$t('STORAGE.ADD_COLOR'), value: 'color' },
        { name: this.$t('STORAGE.IMPROVE'), value: 'improve' },
      ],
      colorList: [
        { name: this.$t('STORAGE.SEPIA'), value: 'sepia' },
        { name: this.$t('STORAGE.RED'), value: 'red' },
        { name: this.$t('STORAGE.GREEN'), value: 'green' },
        { name: this.$t('STORAGE.BLUE'), value: 'blue' },
        { name: this.$t('STORAGE.YELLOW'), value: 'yellow' },
        { name: this.$t('STORAGE.CYAN'), value: 'cyan' },
        { name: this.$t('STORAGE.MAGENTA'), value: 'magenta' },
      ],
      ruleValidate: {
        transformation: [{ validator: this.validateName, trigger: 'change' }],
        'mark.text': [{ validator: this.validateText, trigger: 'change' }],
        instructions: [
          { validator: this.validateInstructions, trigger: 'change' },
        ],
      },
      textareaMinrows: {
        minRows: 6,
      },
    }
  },
  computed: {
    bucket() {
      return this.$route.params.bucket
    },
    ruleName() {
      return this.$route.params.ruleName
    },
    paramsIS() {
      return this.$route.params.IS === 'noIS' ? '' : this.$route.params.IS
    },
    key() {
      return this.$route.params.ruleName
        ? prefix.rules + this.$route.params.ruleName + '.json'
        : ''
    },
    imgError() {
      return this.markOpen && this.markType === 'img' && !this.imgName
    },
    styleListHref() {
      return `/bucket/${this.bucket}/pictureStyles`
    },
    isOpacity() {
      return (
        this.general.format === 'original' ||
        this.general.format === 'png' ||
        this.general.format === 'webp'
      )
    },
    radiusValue() {
      return this.general.radius >= 0 && this.general.radius <= 1000
        ? this.general.radius
        : 'max'
    },
    primaryPreviewError() {
      return this.markOpen && this.markType === 'img' && !this.imgName
    },
    gravityImg() {
      return this.general.gravity.split(':')[0]
    },
    padColorError() {
      return !colorTest(this.general.padColor)
    },
    borderColorError() {
      return !colorTest(this.general.borderColor)
    },
    fontColorError() {
      return !colorTest(this.fontStyle.font_color)
    },
    fontbackColorError() {
      return !colorTest(this.fontStyle.background)
    },
    bucketPath() {
      return `/bucket/${this.$route.params.bucket}`
    },
  },
  watch: {
    general: {
      handler: function() {
        this.autoSaveAndPreview()
      },
      deep: true,
    },
    mark: {
      handler: function() {
        this.autoSaveAndPreview()
      },
      deep: true,
    },
  },
  mounted() {
    this.readStyles()
  },
  methods: {
    async readStyles() {
      if (!!this.ruleName && this.ruleName !== 'noRuleName') {
        this.transformation = this.ruleName
        this.instructions = this.paramsIS
        let res = await handler('getObject', {
          Bucket: this.bucket,
          Key: this.key,
        })
        let styles = JSON.parse(
          new encoding.TextDecoder('utf-8').decode(res.Body),
        )
        if (isPrimary(styles)) {
          let front = styles2Front(styles)
          this.general = front.ganeral
          this.mark = front.mark
          let overlay = front.overlay
          // is mark here
          if (overlay) {
            let file = await this.readOverlayFile(overlay)
            if (/.+\.json$/.test(overlay)) {
              let fontStyle = JSON.parse(
                new encoding.TextDecoder('utf-8').decode(file),
              )
              this.fontStyle = fontStyle
              this.fontStyle.font_color = '#' + fontStyle.font_color
              this.fontStyle.background = '#' + fontStyle.background
            } else {
              this.imgName = overlay
            }
            await putOverlayFile(overlay, file)
          }
        } else {
          this.tabValue = 'senior'
          this.primaryDisable = true
        }
        this.seniorUrl = this.previewUrl = getImgxUrl(this.paramsIS)
      }
    },
    async submitStyles(autoSave = false) {
      if (this.styles2Save()) {
        const file = new Blob([JSON.stringify(this.styles2Save())], {
          type: 'application/json',
        })
        try {
          await handler('putObject', {
            Bucket: this.bucket,
            Key: prefix.rules + this.transformation + '.json',
            ContentType: 'application/json',
            Body: file,
          })
          !autoSave &&
            this.$router.push({
              name: 'pictureStyles',
              params: { bucket: this.bucket },
            })
        } catch (error) {
          this.$Message.success(this.$t('STERAGE.SAVE_FAILED'))
        }
      }
    },
    beforeBasicSubmit(autoSave = false) {
      if (
        this.padColorError ||
        this.borderColorError ||
        this.fontColorError ||
        this.fontbackColorError ||
        this.imgError
      ) {
        this.$Message.error(this.$t('PUBLIC.FORM_VALID_FAILED'))
      } else {
        this.$refs['basicForm'].validate((valid) => {
          if (valid) {
            this.submitStyles(autoSave)
          } else {
            this.$Message.error(this.$t('PUBLIC.FORM_VALID_FAILED'))
          }
        })
      }
    },
    async autoSaveAndPreview() {
      if (this.markType === 'img') {
        return false
      }
      try {
        this.$Loading.start()
        await this.beforeBasicSubmit(true)
        await this.primaryPreview()
        this.$Loading.finish()
      } catch (error) {
        this.$Message.error(error)
        this.$Loading.error()
      }
    },
    beforeSeniorSubmit() {
      this.$refs['seniorForm'].validate((valid) => {
        if (valid) {
          this.submitStyles()
        } else {
          this.$Message.error(this.$t('PUBLIC.FORM_VALID_FAILED'))
        }
      })
    },
    async primaryPreview() {
      const general = general2Save(this.general)
      let IS = styleList.methods.json2instruction(general).instruction
      if (this.markOpen) {
        let markValue
        let file
        if (this.markType === 'text') {
          file = new Blob([JSON.stringify(this.font2Save(this.fontStyle))], {
            type: 'application/json',
          })
          markValue = mark2Save(this.mark, this.transformation)
        } else {
          file = await this.readOverlayFile(this.imgName)
          markValue = mark2Save(this.mark, this.imgName)
        }
        let instruction = styleList.methods.json2instruction(markValue)
        await putOverlayFile(instruction.overlayFileName, file)
        this.previewUrl = getImgxUrl(`${IS}--${instruction.instruction}`)
      } else {
        this.previewUrl = getImgxUrl(IS)
      }
    },
    async seniorPreview() {
      let texts = /.*l_text:(.*):.*/.exec(this.instructions)
      let imgs = this.instructions.split('l_')[1]
      if (texts) {
        let fontName = texts[1] + '.json'
        const file = await this.readOverlayFile(fontName)
        await putOverlayFile(fontName, file)
        this.seniorUrl = getImgxUrl(this.instructions)
      } else if (imgs) {
        let imgName =
          imgs.split(',')[0].length < imgs.split('-')[0].length
            ? imgs.split(',')[0] + '.png'
            : imgs.split('-')[0] + '.png'
        const file = await handler('getObject', {
          Bucket: this.bucket,
          Key: prefix.overlay + imgName,
        })
        await putOverlayFile(imgName, file.Body)
        this.seniorUrl = getImgxUrl(this.instructions)
      }
    },
    styles2Save() {
      let data = []
      if (this.tabValue === 'primary') {
        const general = general2Save(this.general)
        data.push(general)
        if (this.markOpen) {
          let markData = {}
          if (this.markType === 'text') {
            this.saveFont(this.fontStyle)
            markData = mark2Save(this.mark, this.transformation)
          } else if (this.markType === 'img') {
            markData = mark2Save(this.mark, this.imgName)
          }
          data.push(markData)
        }
      } else {
        const insArray = this.instructions.split('--')
        insArray.forEach((instruction) => {
          const item = {}
          instruction.split(',').forEach((ins) => {
            const reg = /^[a-z0-9]+_/g
            const insKey = I2J[reg.exec(ins)[0]]
            const insValue = ins.substr(reg.lastIndex)
            item[insKey] = insValue
          })
          data.push(item)
        })
      }
      return data
    },
    async readOverlayFile(name) {
      let params = {
        Bucket: this.bucket,
        Key: prefix.overlay + name,
      }
      let res = await handler('getObject', params)
      return res.Body
    },
    async saveFont(data) {
      const file = new Blob([JSON.stringify(this.font2Save(data))], {
        type: 'application/json',
      })
      try {
        await handler('putObject', {
          Bucket: this.bucket,
          Key: prefix.overlay + this.transformation + '_font.json',
          ContentType: 'application/json',
          Body: file,
        })
      } catch (error) {
        this.$Message.error(this.$t('STERAGE.SAVE_FAILED'))
      }
    },
    font2Save(data) {
      return {
        font_family: data.font_family,
        font_size: parseInt(data.font_size),
        font_color: color2Save(data.font_color),
        text: this.mark.text,
        background: color2Save(data.background),
      }
    },
    uploadSuccess(fileName) {
      this.imgName = fileName
    },
    radiusFormater(value) {
      return value > 1000 ? 'max' : value
    },
    radiusChange(event) {
      const value = parseInt(event.target.value)
      if (value >= 1 && value <= 1000) {
        this.general.radius = value
      } else {
        this.general.radius = Date.now()
      }
    },
    async getRuleList() {
      let ruleList = []
      let res = await handler('listObjects', {
        Bucket: this.bucket,
        Prefix: prefix.rules,
      })
      const rules = res.Contents
      _.each(rules, (item) => {
        if (/\.json$/.test(item.Key)) {
          const name = /.*\/(.*)\.json/.exec(item.Key)[1]
          if (name !== this.ruleName) {
            ruleList.push(name)
          }
        }
      })
      return ruleList
    },
    padColorChange(color) {
      this.general.padColor = color
    },
    fontbackColorChange(color) {
      this.fontStyle.background = color
    },
    fontColorChange(color) {
      this.fontStyle.font_color = color
    },
    borderColorChange(color) {
      this.general.borderColor = color
    },
    async isRuleNameUnique() {
      let ruleList = await this.getRuleList()
      if (
        this.ruleName !== 'noRuleName' &&
        ruleList.includes(this.transformation)
      ) {
        this.$Message.warning(this.$t('STORAGE.RULE_NAME_EXISTS'))
        return false
      }
      return true
    },
    validateName(rule, value, callback) {
      if (!value) {
        callback(new Error(this.$t('STORAGE.RULENAME_EMPTY_INFO')))
      } else if (!/^[a-z0-9_]{1,20}$/.test(value)) {
        callback(new Error(this.$t('STORAGE.RULENAME_INFO')))
      } else if (!this.isRuleNameUnique()) {
        callback(new Error(this.$t('STORAGE.RULENAME_EXISTS')))
      } else {
        callback()
      }
    },
    validateText(rule, value, callback) {
      if (this.markOpen && this.markType === 'text' && !/.+/.test(value)) {
        callback(new Error(this.$t('STORAGE.TEXT_CONTENT_INFO')))
      } else {
        callback()
      }
    },
    validateInstructions(rule, value, callback) {
      const insArray = value.split('--')
      if (!value) {
        callback(new Error(this.$t('STORAGE.INS_REQUIRED')))
      } else if (insArray.length > 4) {
        callback(new Error(this.$t('STORAGE.NO_MORE_4')))
      } else {
        callback()
      }
    },
    validateColor(rule, value, callback) {
      if (colorTest(value)) {
        callback()
      } else {
        callback(new Error(this.$t('STORAGE.INS_REQUIRED')))
      }
    },
    back() {
      this.$router.back()
    },
  },
}
const color2Save = (hexStr) => {
  let hex = hexStr
  const regHex3 = /^#([a-f\d])([a-f\d])([a-f\d])$/i
  if (regHex3.test(hex)) {
    hex = hex.replace(regHex3, (m, r, g, b) => {
      return `#${r}${r}${g}${g}${b}${b}`
    })
  }
  return hex.substr(1).toLowerCase()
}
const colorTest = (hex) => {
  const regHex6 = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
  const regHex3 = /^#([a-f\d])([a-f\d])([a-f\d])$/i
  return regHex6.test(hex) || regHex3.test(hex)
}
const putOverlayFile = async (name, body) => {
  const type = /.+\.png$/.test(name) ? 'application/x-png' : 'application/json'
  const s3 = await getS3({
    key: { accesskey: previewAccessKey, secretkey: previewSecretKey },
  })
  return new Promise((resolve, reject) =>
    s3.putObject(
      {
        Bucket: 'image-example',
        Key: prefix.overlay + name,
        ContentType: type,
        Body: body,
      },
      (error, data) => {
        error && iView.Message.error(error, 5)
        return error ? reject(error) : resolve(data)
      },
    ),
  )
}
const getImgxUrl = (IS) => {
  return getImgxPreviewUrl() + IS + '/dashboard.jpg?' + Date.now()
}
const general2Save = (data) => {
  let saved = {}
  if (data.crop === 'pad') {
    saved.crop = data.padType
    saved.background = color2Save(data.padColor)
  } else if (data.crop === 'fill') {
    saved.crop = data.fillType
  } else if (data.crop === 'fit') {
    saved.crop = data.fitType
  } else if (data.crop === 'thumb') {
    saved.crop = 'thumb'
    saved.gravity = data.thumbType
  } else if (data.crop === 'crop') {
    saved.crop = data.crop
    if (data.gravity === 'noGravity') {
      saved.x = data.x
      saved.y = data.y
    } else if (data.gravity === 'xy_center') {
      saved.gravity = data.gravity
      saved.x = data.x
      saved.y = data.y
    } else {
      saved.gravity = data.gravity
    }
  } else if (data.crop !== 'noCrop') {
    saved.crop = data.crop
  } else {
  }
  if (data.crop !== 'noCrop') {
    saved.width =
      data.dataType === 'pixel'
        ? parseInt(data.width)
        : parseFloat(data.width / 100)
    saved.height =
      data.dataType === 'pixel'
        ? parseInt(data.height)
        : parseFloat(data.height / 100)
  }

  saved.quality = data.quality
  if (data.format !== 'original') {
    saved.format = data.format
  }
  if (data.angleType === 'angle' && data.angle !== 0) {
    saved.angle = parseInt(data.angle)
  } else if (data.angleType === 'vflip' || data.angleType === 'hflip') {
    saved.angle = data.angleType
  }

  const effect = data.effect

  if (effect === 'oil_paint') {
    saved.effect = effect + ':' + data.oilValue
  } else if (effect === 'brightness') {
    saved.effect = effect + ':' + data.brightnessValue
  } else if (effect === 'blur') {
    saved.effect = effect + ':' + data.blurValue
  } else if (effect === 'pixelate') {
    saved.effect = effect + ':' + data.pixelateValue
  } else if (effect === 'sharpen') {
    saved.effect =
      data.sharpenValue >= 1 && data.sharpenValue <= 400
        ? `${effect}:${data.sharpenValue}`
        : `${effect}:100`
  } else if (effect === 'color') {
    saved.effect = data.color + ':' + data.colorValue
  } else if (effect !== 'noEffect') {
    saved.effect = effect
  } else {
  }

  if (data.border) {
    saved.border = data.borderSize + '_' + color2Save(data.borderColor)
  }
  if (data.opacity !== 100) {
    saved.opacity = data.opacity
  }
  if (data.radius > 0 && data.radius <= 1000) {
    saved.radius = parseInt(data.radius)
  } else if (data.radius === 0) {
  } else {
    saved.radius = 'max'
  }
  return saved
}
const mark2Save = (data, name) => {
  let saved = {
    x: parseInt(data.x),
    y: parseInt(data.y),
    gravity: data.gravity,
    opacity: data.opacity,
  }
  if (data.type === 'text') {
    saved.overlay = 'text:' + name + '_font:' + data.text
  } else if (data.type === 'img') {
    saved.overlay = name.split('.png')[0]
  }
  return saved
}
const isPrimary = (styles) => {
  let uniqueArray = []
  let uniqueSet = new Set()
  styles.forEach((item) => {
    const keys = Object.keys(item)
    if (keys.includes('overlay')) {
      uniqueArray.push('overlay')
      uniqueSet.add('overlay')
    }
    if (keys.includes('crop')) {
      uniqueArray.push('crop')
      uniqueSet.add('crop')
    }
    if (keys.includes('angle')) {
      uniqueArray.push('angle')
      uniqueSet.add('angle')
    }
    if (keys.includes('effect')) {
      uniqueArray.push('effect')
      uniqueSet.add('effect')
    }
  })
  return uniqueArray.length === uniqueSet.size
}
const styles2Front = (styles) => {
  let ganeral = _.clone(generalDefult)
  let mark = _.clone(markerDefult)
  let overlay = ''
  styles.forEach((item) => {
    // checkout mark or general
    if (Object.keys(item).includes('overlay')) {
      if (/^text:.+/.test(item.overlay)) {
        overlay = item.overlay.split(':')[1] + '.json'
      } else {
        overlay = item.overlay + '.png'
      }
      _.assignIn(mark, mark2Front(item))
    } else {
      _.assignIn(ganeral, general2Front(item))
    }
  })
  return { ganeral, mark, overlay }
}
const general2Front = (data) => {
  let front = _.clone(data)
  const crop = data.crop
  let frontCrop

  if (crop) {
    if (crop === 'mfit' || crop === 'fit' || crop === 'limit') {
      frontCrop = 'fit'
      front.fitType = crop
    } else if (crop === 'pad' || crop === 'mpad' || crop === 'lpad') {
      frontCrop = 'pad'
      front.padType = crop
      if (data.background) {
        front.padColor = '#' + data.background.substr(0, 6)
      }
    } else if (crop === 'fill' || crop === 'lfill') {
      frontCrop = 'fill'
      front.fillType = crop
    } else if (crop === 'thumb') {
      frontCrop = 'thumb'
      front.thumbType = data.gravity
    } else if (crop === 'crop') {
      frontCrop = 'crop'
      front.x = data.x || 0
      front.y = data.y || 0
      front.gravity = data.gravity ? data.gravity : 'noGravity'
    } else {
      frontCrop = crop
    }
  } else {
    frontCrop = 'noCrop'
  }

  front.crop = frontCrop

  if (data.width < 1) {
    front.width = data.width > 1 ? data.width : data.width * 100
    front.dataType = data.width > 1 ? 'pixel' : 'percent'
  }
  if (data.height) {
    front.height = data.height > 1 ? data.height : data.height * 100
    front.dataType = data.height > 1 ? 'pixel' : 'percent'
  }
  if (data.angle) {
    front.angleType =
      data.angle === 'vflip' || data.angle === 'hflip' ? data.angle : 'angle'
    front.angle =
      data.angle === 'vflip' || data.angle === 'hflip' ? 0 : data.angle
  }

  const effect = data.effect
  if (effect) {
    const effectArray = [
      'grayscale',
      'oil_paint',
      'negate',
      'brightness',
      'blur',
      'pixelate',
      'sharpen',
      'auto_contrast',
      'improve',
    ]
    const colorArray = [
      'sepia',
      'red',
      'green',
      'blue',
      'yellow',
      'cyan',
      'magenta',
    ]
    if (effectArray.includes(effect.split(':')[0])) {
      front.effect = effect.split(':')[0]
      if (effect.split('oil_piant:')[1]) {
        front.oilValue = parseInt(effect.split('oil_piant:')[1])
      } else if (effect.split('brightness:')[1]) {
        front.brightnessValue = parseInt(effect.split('brightness:')[1])
      } else if (effect.split('blur:')[1]) {
        front.blurValue = parseInt(effect.split('blur:')[1])
      } else if (effect.split('pixelate:')[1]) {
        front.pixelateValue = parseInt(effect.split('pixelate:')[1])
      } else if (effect.split('sharpen:')[1]) {
        front.sharpenValue = parseInt(effect.split('sharpen:')[1])
      }
    } else if (colorArray.includes(effect.split(':')[0])) {
      front.effect = 'color'
      front.color = effect.split(':')[0]
      if (effect.split(':')[1]) {
        front.colorValue = parseInt(effect.split(':')[1])
      }
    }
  }

  const border = data.border
  if (border) {
    front.border = true
    front.borderSize = border.split('_')[0] || 1
    front.borderColor = border.split('_')[1].substr(0, 6)
      ? '#' + border.split('_')[1].substr(0, 6)
      : '#BF4040'
  }
  if (data.quality) {
    front.quality = parseInt(data.quality)
  }
  if (data.opacity) {
    front.opacity = parseInt(data.opacity)
  }
  if (data.radius) {
    front.radius =
      data.radius >= 1 && data.radius <= 1000 ? parseInt(data.radius) : 1001
  }
  return front
}

const mark2Front = (data) => {
  let front = _.clone(markerDefult)
  front.open = true
  if (data.overlay.substr(0, 5) === 'text:') {
    front.type = 'text'
    const textRe = /(text:).*:/g
    textRe.exec(data.overlay)
    front.text = data.overlay.substr(textRe.lastIndex)
  } else {
    front.type = 'img'
  }

  if (data.opacity) {
    front.opacity = parseInt(data.opacity)
  }
  if (data.gravity) {
    front.gravity = data.gravity
  }
  if (data.x) {
    front.x = data.x
  }
  if (data.y) {
    front.y = data.y
  }
  return front
}
</script>

<style lang="less" scoped>
@import '../../styles/index.less';
@edit-styles-border-color: #d7dde4;
@edit-styles-border-blue: #20a0ff;

.bgi(@name, @x: 0, @y: 0) {
  background: @x @y no-repeat url('../../assets/editStyle/@{name}');
}

.@{css-prefix}edit-styles {
  .page-left,
  .page-right {
    .form-label {
      display: inline-block;
      width: 90px;
      font-size: 14px;
      padding-right: 12px;
      line-height: 30px;
      text-align: right;
      vertical-align: top;
    }

    .form-item-right {
      display: inline-block;
      width: 480px;
    }
  }

  .page-left {
    width: 450px;
    position: fixed;
    .test-img {
      margin: 15px 0;

      img {
        display: block;
        max-width: 100%;
        height: 300px;
        margin-bottom: 15px;
        background: #000;
      }
    }

    .preview-span {
      font-size: 14px;
      line-height: 30px;
    }
  }

  .page-right {
    padding-left: 30px;
    margin-left: 450px;
    .form-item {
      margin-bottom: 20px;

      .style-name-info {
        padding: 5px 0 0 90px;
        .sc(12px, #8492a6);
      }

      .pic-slider {
        display: inline-block;
        width: 415px;
        vertical-align: middle;
      }

      .slider-input {
        width: 45px;
        margin-left: 10px;
      }

      .font-styles {
        & > * {
          float: left;
          margin-right: 10px;
        }

        & > *:nth-child(1) {
          margin-right: 0;
        }
      }

      .input-text-box {
        display: inline-block;

        span {
          line-height: 24px;
          padding-left: 5px;
        }
      }

      .dis-inline {
        display: inline;
      }

      .upload-box {
        width: 475px;
        display: inline-block;
        vertical-align: text-top;
        outline: none;
      }

      .color-selector {
        width: 387px;
        border: 1px solid @edit-styles-border-color;
        border-radius: 4px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 20px;
        input {
          -webkit-appearance: none;
          width: 55px;
          height: 30px;
          float: left;
          outline: none;
          cursor: pointer;
        }
        input:checked,
        input:hover {
          border: 1px solid @edit-styles-border-blue;
          box-shadow: 0 0 10px @edit-styles-border-blue;
        }
        input:nth-child(1) {
          background-color: #5e2612;
        }
        input:nth-last-child(2) {
          background-color: #00ffff;
        }
      }

      .gravity-xy {
        margin-left: 60px;
      }

      .ivu-radio-wrapper {
        font-size: 14px;
      }

      .line-width {
        width: 475px;
      }

      .line-button {
        width: 550px;
      }

      .pullRight {
        float: right;
      }

      .sub-select {
        width: 300px;
        margin-left: 90px;
      }

      .noEffect {
        .bgi('noEffect.png');
      }

      .grayscale {
        .bgi('grayscale.png');
      }

      .auto_contrast {
        .bgi('auto_contrast.png');
      }

      .brightness {
        .bgi('brightness.png');
      }

      .negate {
        .bgi('negate.png');
      }

      .sharpen {
        .bgi('sharpen.png');
      }

      .blur {
        .bgi('blur.png');
      }

      .oil_paint {
        .bgi('oil_paint.png');
      }

      .pixelate {
        .bgi('pixelate.png');
      }

      .color {
        .bgi('color.png');
      }

      .improve {
        .bgi('improve.png');
      }

      .sepia {
        .bgi('sepia.png');
      }

      .red {
        .bgi('red.png');
      }

      .green {
        .bgi('green.png');
      }

      .blue {
        .bgi('blue.png');
      }

      .yellow {
        .bgi('yellow.png');
      }

      .cyan {
        .bgi('cyan.png');
      }

      .magenta {
        .bgi('magenta.png');
      }

      .effect-radio-box {
        display: inline-block;
        width: 100px;
        margin-bottom: 10px;
        margin-right: 10px;
        .effect-span-center {
          display: inline-block;
          width: 94px;
          text-align: center;
        }
      }

      .effect-radio {
        appearance: none;
        .wh(94px, 94px);
        outline: none;
      }
      .effect-radio:checked,
      .effect-radio:hover {
        border: 1px solid @edit-styles-border-blue;
        box-shadow: 0 0 10px @edit-styles-border-blue;
      }
    }

    .gravity-preview {
      & > div {
        float: left;
      }

      div.left {
        width: 380px;
      }

      div.right {
        .wh(94px, 94px);
        margin-bottom: 20px;
        border-radius: 4px;
      }

      .north_west {
        .bgi('north_west.png');
      }

      .north {
        .bgi('north.png');
      }

      .north_east {
        .bgi('north_east.png');
      }

      .west {
        .bgi('west.png');
      }

      .center {
        .bgi('center.png');
      }
      .east {
        .bgi('east.png');
      }
      .south_west {
        .bgi('south_west.png');
      }

      .south {
        .bgi('south.png');
      }

      .south_east {
        .bgi('south_east.png');
      }

      .noGravity {
        .bgi('noGravity.png');
      }

      .xy_center {
        .bgi('xy_center.png');
      }

      .face {
        .bgi('face.png');
      }

      .faces {
        .bgi('faces.png');
      }
    }

    .separator-line {
      margin: 10px 0 30px;
      border-bottom: 1px solid @edit-styles-border-color;
    }
    .img-button {
      margin-left: 250px;
    }
  }
  .red-border {
    border: 1px dashed #ed3f14;
    border-radius: 5px;
    box-shadow: 0 0 0 2px rgba(237, 63, 20, 0.2);
  }
}
.dark {
  .@{css-prefix}edit-styles {
    .separator-line {
      border-color: @edit-styles-border-color-dark;
    }
  }
}
</style>
<style lang="less">
.red-border .bsc-upload .section-file-upload:hover,
.red-border .bsc-upload .section-file-upload {
  border: none !important;
}
</style>
