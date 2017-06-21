<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Breadcrumb>
                <Breadcrumb-item href="/">{{$t("STORAGE.TITLE")}}</Breadcrumb-item>
                <Breadcrumb-item :href="styleListHref">{{$t("STORAGE.PIC_STYLE")}}</Breadcrumb-item>
                <Breadcrumb-item>{{$t("STORAGE.CREATE_STYLE")}} ({{bucket}})</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <Tabs size="small" v-model='tabValue'>
            <Tab-pane :label='$t("STORAGE.BASIC_EDIT")' name='primary' :disabled='primaryDisable'>
                <Row>
                    <Col span="8">
                        <span class="form-label">{{$t("STORAGE.PREVIEW")}}:</span>
                        <div class="test-img">
                            <img :src='previewUrl'>
                            <div class="img-button">
                                <Button type="primary" @click="previewFn">效果预览</Button>
                            </div>
                        </div>
                    </Col>
                    <Col span="16" class="page-left">
                        <div class="form-item">
                            <span class="form-label">{{$t("STORAGE.STYLE_NAME")}} : </span>
                            <Input v-model="transformation" :placeholder='$t("STORAGE.STYLE_NAME")' class="line-width"></Input>
                            <p class="style-name-info" :class="{'red':transformationError}">名称使用数字、小写字母、下划线，不超过20个字符</p>
                        </div>
                        <div class="form-item">
                            <span class="form-label">{{$t("STORAGE.STYLE_CROP")}} : </span>
                            <Radio-group v-model="general.crop" style='vertical-align: text-top'>
                                <Radio label="noCrop">{{$t("STORAGE.CROP_NONE")}}</Radio>
                                <Radio label="scale">{{$t("STORAGE.CROP_SCALE")}}</Radio>
                                <Radio label="fit">{{$t("STORAGE.CROP_FIT")}}</Radio>
                                <Radio label="pad">{{$t("STORAGE.CROP_PAD")}}</Radio>
                                <p style='height: 10px;'></p>
                                <Radio label="fill">{{$t("STORAGE.CROP_FILL")}}</Radio>
                                <Radio label="crop">{{$t("STORAGE.CROP_CROP")}}</Radio>
                                <Radio label="thumb">{{$t("STORAGE.CROP_THUMB")}}</Radio>
                            </Radio-group>
                        </div>
                        <div class="form-item" v-if="general.crop === 'fit'">
                            <Select v-model="general.fitType" style="width:300px;margin-left:73px;">
                                <Option v-for="item in fitList" :value="item.value" :key="item">{{ item.label }}</Option>
                            </Select>
                        </div>
                        <div class="form-item" v-if="general.crop === 'pad'">
                            <Select v-model="general.padType" style="width:300px;margin-left:73px;margin-right:8px">
                                <Option v-for="item in padList" :value="item.value" :key="item">{{ item.label }}</Option>
                            </Select>
                            <div class="color-box">
                                <input type="color" v-model="general.padColor" class="color-trigger">
                                <input type='text' v-model="general.padColor" class="color-input">
                            </div><!--padColor-->
                        </div>
                        <div class="form-item" v-if="general.crop === 'fill'">
                            <Select v-model="general.fillType" style="width:300px;margin-left:73px;">
                                <Option v-for="item in fillList" :value="item.value" :key="item">{{ item.label }}</Option>
                            </Select>
                        </div>
                        <div class="form-item" v-if="general.crop === 'thumb'">
                            <Select v-model="general.thumbType" style="width:300px;margin-left:73px;">
                                <Option v-for="item in thumbList" :value="item.value" :key="item">{{ item.label }}</Option>
                            </Select>
                        </div><!--thumb gravity-->
                        <div class="gravity-preview clearfix" v-if="general.crop === 'crop'">
                            <div class="left">
                                <div class="form-item">
                                    <span class="form-label">选择位置 : </span>
                                    <Select v-model="general.gravity" style="width:265px">
                                        <Option v-for="item in cropGravityList" :value="item.value" :key="item">{{ item.label }}</Option>
                                    </Select>
                                </div>
                                <div class="form-item" v-if="general.gravity === 'xy_center' || general.gravity === 'noGravity'">
                                    <div class="gravity-xy">
                                        <span class="form-label">x : </span>
                                        <div class="input-text-box">
                                            <input type='number' v-model="general.x">
                                            <span>px</span>
                                        </div>
                                        <span class="form-label">y : </span>
                                        <div class="input-text-box">
                                            <input type='number' v-model="general.y">
                                            <span>px</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="right"></div>
                        </div><!--crop gravity & xy-->
                        <div class="form-item" v-if="general.crop !== 'noCrop'">
                            <span class="form-label">{{$t("STORAGE.FIT_STYLE")}} : </span>
                            <Radio-group v-model="general.dataType">
                                <Radio label="pixel">像素(px)</Radio>
                                <Radio label="percent">百分比(%)</Radio>
                            </Radio-group>
                            <span class="form-label">W : </span>
                            <div class="input-text-box">
                                <input type='number' v-model.number="general.width">
                                <span v-if="general.dataType==='pixel'" class="form-label">px</span>
                                <span v-else class="form-label">%</span>
                            </div>
                            <span class="form-label">H : </span>
                            <div class="input-text-box">
                                <input type='number' v-model.number="general.height">
                                <span v-if="general.dataType==='pixel'" class="form-label">px</span>
                                <span v-else class="form-label">%</span>
                            </div>
                        </div><!--width & height-->
                        <div class="form-item">
                            <span class="form-label">{{$t("STORAGE.STYLE_QUALITY")}} : </span>
                            <Slider class="pic-slider" :min='1' v-model="general.quality"></Slider>
                            <Input v-model="general.quality" class="slider-input" number></Input>
                        </div><!--quality-->
                        <div class="form-item">
                            <span class="form-label">{{$t("STORAGE.STYLE_FORMAT")}} : </span>
                            <Select v-model="general.format" class="line-width">
                                <Option v-for="item in formatList" :value="item" :key="item">{{ item }}</Option>
                            </Select>
                        </div><!--format-->
                        <div class="form-item">
                            <Button type="ghost" @click="setMore = !setMore">更多设置 <Icon type="chevron-down" v-if="!setMore"></Icon><Icon type="chevron-up" v-else></Icon></Button>
                        </div>
                        <div v-if="setMore">
                            <div class="separator-line"></div>
                            <div class="form-item">
                                <span class="form-label">翻转模式 : </span>
                                <Radio-group v-model="general.angleType" style='vertical-align: text-top'>
                                    <Radio v-for="item in angleList" :label="item.value">{{item.label}}</Radio>
                                </Radio-group>
                            </div><!--angleType-->
                            <div class="form-item" v-if="general.angleType === 'angle'">
                                <span class="form-label">角度 : </span>
                                <div class="input-text-box" style="margin-left:25px;">
                                    <input type='number' v-model="general.angle">
                                </div>
                            </div><!--angle-->
                            <div class="form-item">
                                <span class="form-label">滤镜与特效 : </span>
                                <Radio-group v-model="general.effect" style='vertical-align: text-top'>
                                    <Radio label="noEffect">不添加滤镜或特效</Radio>
                                    <Radio label="grayscale">灰度</Radio>
                                    <Radio label="auto_contrast">自动对比度</Radio>
                                    <Radio label="brightness">调整图片亮度</Radio>
                                    <Radio label="negate">反色</Radio>
                                    <p style='height: 10px;'></p>
                                    <Radio label="sharpen">锐化</Radio>
                                    <Radio label="blur">模糊效果</Radio>
                                    <Radio label="oil_paint">油画效果</Radio>
                                    <Radio label="pixelate">像素化</Radio>
                                    <Radio label="color">增加颜色</Radio>
                                    <p style='height: 10px;'></p>
                                    <Radio label="improve">自动调整图像色彩，对比度和亮度</Radio>
                                </Radio-group>
                            </div><!--effect-->
                            <div class="form-item" v-if="general.effect === 'brightness'">
                                <span class="form-label">图片亮度 : </span>
                                <Slider class="pic-slider" :min='-300' :max='300' v-model="general.brightnessValue"></Slider>
                                <Input v-model="general.brightnessValue" class="slider-input" number></Input>
                            </div><!--brightnessValue-->
                            <div class="form-item" v-if="general.effect === 'blur'">
                                <span class="form-label">模糊值 : </span>
                                <Slider class="pic-slider mar-l15" :min='1' :max='2000' v-model="general.blurValue"></Slider>
                                <Input v-model="general.blurValue" class="slider-input" number></Input>
                            </div><!--blurValue-->
                            <div class="form-item" v-if="general.effect === 'sharpen'">
                                <span class="form-label">锐化值 : </span>
                                <Slider class="pic-slider mar-l15" :min='1' :max='2000' v-model="general.sharpenValue"></Slider>
                                <Input v-model="general.sharpenValue" class="slider-input" number></Input>
                            </div><!--sharpenValue-->
                            <div class="form-item" v-if="general.effect === 'oil_paint'">
                                <span class="form-label">油画值 : </span>
                                <Slider class="pic-slider mar-l15" :min='1' :max='8' v-model="general.oilValue"></Slider>
                                <Input v-model="general.oilValue" class="slider-input" number></Input>
                            </div><!--oilValue-->
                            <div class="form-item" v-if="general.effect === 'color'">
                                <span class="form-label">颜色 : </span>
                                <div class="color-selector mar-l20">
                                    <input type="radio" value="sepia" v-model="general.color" style="background-color:sepia"></Radio>
                                    <input type="radio" value="red" v-model="general.color" style="background-color:red"></Radio>
                                    <input type="radio" value="green" v-model="general.color" style="background-color:green"></Radio>
                                    <input type="radio" value="blue" v-model="general.color" style="background-color:blue"></Radio>
                                    <input type="radio" value="yellow" v-model="general.color" style="background-color:yellow"></Radio>
                                    <input type="radio" value="cyan" v-model="general.color" style="background-color:sepcyania"></Radio>
                                    <input type="radio" value="magenta" v-model="general.color" style="background-color:magenta"></Radio>
                                </div>
                            </div><!--color-->
                            <div class="form-item" v-if="general.effect === 'color'">
                                <span class="form-label">颜色取值 : </span>
                                <Slider class="pic-slider" :min='1' :max='100' v-model="general.colorValue"></Slider>
                                <Input v-model="general.colorValue" class="slider-input" number></Input>
                            </div><!--colorValue-->
                            <div class="form-item" v-if="general.effect === 'pixelate'">
                                <span class="form-label">像素值 : </span>
                                <Slider class="pic-slider mar-l15" :min='1' :max='400' v-model="general.pixelateValue"></Slider>
                                <Input v-model="general.pixelateValue" class="slider-input" number></Input>
                            </div><!--pixelateValue-->
                            <div class="form-item">
                                <span class="form-label">设置边框 : </span>
                                <i-switch v-model="general.border" size="large">
                                    <span slot="open">ON</span>
                                    <span slot="close">OFF</span>
                                </i-switch>
                            </div><!--border-->
                            <div class="form-item" v-if="general.border">
                                <span class="form-label">边框设置 : </span>
                                <div class="input-text-box">
                                    <input type='number' v-model="general.borderSize">
                                    <span>px</span>
                                </div><!--borderSize-->
                                <div class="color-box" @click.stop>
                                    <input type="color" v-model="general.borderColor" class="color-trigger">
                                    <input type='text' v-model="general.borderColor" class="color-input">
                                </div><!--borderColor-->
                            </div><!--border-->
                            <div class="form-item">
                                <span class="form-label">生成圆角 : </span>
                                <Slider class="pic-slider" :min='0' :max='1001' v-model="radiusSlider" :tip-format="radiusFormater"></Slider>
                                <Input v-model="radiusValue" class="slider-input" number></Input>
                            </div><!--radius-->
                            <div class="form-item">
                                <span class="form-label">不透明度 : </span>
                                <Slider class="pic-slider" v-model="general.opacity" :disabled="!isOpacity"></Slider>
                                <Input v-model="general.opacity" class="slider-input" number></Input>
                            </div><!--opacity-->
                        </div>
                        <div class="separator-line"></div>
                        <div class="form-item">
                            <span class="form-label">{{$t("STORAGE.STYLE_WATERMARKER")}} : </span>
                            <i-switch v-model="watermarker.open" size="large">
                                <span slot="open">ON</span>
                                <span slot="close">OFF</span>
                            </i-switch>
                        </div><!--watermarkerOpen-->
                        <div v-if="watermarker.open">
                            <div class="form-item">
                                <span class="form-label">{{$t("STORAGE.WATERMARKER_TYPE")}} : </span>
                                <Radio-group v-model="watermarker.type">
                                    <Radio label="text">{{$t("STORAGE.TEXT_WATERMARKER")}}</Radio>
                                    <Radio label="img">{{$t("STORAGE.IMG_WATERMARKER")}}</Radio>
                                </Radio-group>
                            </div><!--watermarkerType-->
                            <div v-if="watermarker.type == 'text'" class="clearfix">
                                <div class="form-item">
                                    <span class="form-label">{{$t("STORAGE.TEXT_CONTENT")}} : </span>
                                    <Input v-model="watermarker.text" :placeholder='$t("STORAGE.TEXT_CONTENT")' class="line-width"></Input>
                                    <p class="red style-name-info" v-if="textError">请输入水印文字内容</p>
                                </div><!--text-->
                                <div class="form-item">
                                    <span class="form-label">{{$t("STORAGE.TEXT_STYLE")}} : </span>
                                    <Select v-model="fontStyle.font_family" style="width:135px;margin-right:10px;">
                                        <Option v-for="item in fontList" :value="item.value" :key="item">{{ item.label }}</Option>
                                    </Select><!--font_family-->
                                    <div class="input-text-box">
                                        <input type='number' v-model="fontStyle.font_size">
                                        <span>px</span>
                                    </div><!--font_size-->
                                    <div class="color-box">
                                        <input type="color" v-model="fontStyle.font_color" class="color-trigger">
                                        <input type='text' v-model="fontStyle.font_color" class="color-input">
                                    </div><!--fontColor-->
                                </div>
                                <div class="form-item">
                                    <span class="form-label">背景 : </span>
                                    <div class="color-box" style="margin-left:25px;">
                                        <input type="color" v-model="fontStyle.background" class="color-trigger">
                                        <input type='text' v-model="fontStyle.background" class="color-input">
                                    </div><!--fontColor-->
                                </div><!--fontBack-->
                            </div>
                            <div v-if="watermarker.type == 'img'">
                                <div class="form-item">
                                    <span class="form-label">{{$t("STORAGE.WATERMARKER_PIC")}} : </span>
                                    <div class="upload-box">
                                        <upload :bucket="bucket" :prefix="uploadPrefix" accept="image/png" validationInfo='支持png格式文件，文件名为不包含“/:,-”的ascii字符' :validation="uploadValidation" v-on:uploadSuccess="uploadSuccess"></upload>
                                    </div>
                                </div><!--image-->
                            </div>
                            <div class="form-item">
                                <span class="form-label">{{$t("STORAGE.WATERMARKER_POSITION")}} : </span>
                                <div class="gravity-selector">
                                    <input type="radio" value="north_west" v-model="watermarker.gravity"></Radio>
                                    <input type="radio" value="north" v-model="watermarker.gravity"></Radio>
                                    <input type="radio" value="north_east" v-model="watermarker.gravity"></Radio>
                                    <input type="radio" value="west" v-model="watermarker.gravity"></Radio>
                                    <input type="radio" value="center" v-model="watermarker.gravity"></Radio>
                                    <input type="radio" value="east" v-model="watermarker.gravity"></Radio>
                                    <input type="radio" value="south_west" v-model="watermarker.gravity"></Radio>
                                    <input type="radio" value="south" v-model="watermarker.gravity"></Radio>
                                    <input type="radio" value="south_east" v-model="watermarker.gravity"></Radio>
                                </div>
                                <div class="padding-setting">
                                    <div class="form-item">
                                        <span class="form-label">{{$t("STORAGE.PADDING_LEFT")}} : </span>
                                        <div class="input-text-box">
                                            <input type='number' v-model="watermarker.x">
                                            <span>px</span>
                                        </div>
                                    </div>
                                    <div class="form-item">
                                        <span class="form-label">{{$t("STORAGE.PADDING_TOP")}} : </span>
                                        <div class="input-text-box">
                                            <input type='number' v-model="watermarker.y">
                                            <span>px</span>
                                        </div>
                                    </div>
                                </div>
                            </div><!--location-->
                            <div class="form-item">
                                <span class="form-label">{{$t("STORAGE.OPACITY")}} : </span>
                                <Slider class="pic-slider" v-model="watermarker.opacity"></Slider>
                                <Input v-model="watermarker.opacity" class="slider-input" number></Input>
                            </div><!--opacity-->
                        </div>
                        <div class="form-item clearfix line-button">
                            <div class="img-button">
                                <Button type="ghost" @click="">{{$t("PUBLIC.CANCLE")}}</Button>
                                <Button type="primary" @click="submitStyles" :disabled="transformationError || textError || imgError">{{$t("PUBLIC.CONFIRMED")}}</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Tab-pane>
            <Tab-pane :label='$t("STORAGE.ADV_EDIT")' name='senior'>
                <Row>
                    <Col span="8">
                        <span class="form-label">{{$t("STORAGE.PREVIEW")}}:</span>
                        <div class="test-img">
                            <img :src='seniorUrl'>
                            <div class="img-button">
                                <Button type="primary" @click="seniorPreview">效果预览</Button>
                            </div>
                        </div>
                    </Col>
                    <Col span="16" class="page-left">
                        <div class="form-item">
                            <span class="form-label">{{$t("STORAGE.STYLE_NAME")}} : </span>
                            <Input v-model="transformation" :placeholder='$t("STORAGE.STYLE_NAME")' style="width: 475px"></Input>
                            <p class="style-name-info" :class="{'red':transformationError}">名称使用数字、小写字母、下划线，不超过20个字符</p>
                        </div>
                        <div class="form-item">
                            <span class="form-label">{{$t("STORAGE.PROSCESS_PARAM")}} : </span>
                            <Input v-model="instructions" type="textarea" :rows="6" placeholder="使用高级编辑之前，建议先阅读Imgx图片处理服务使用说明" style="width: 475px"></Input>
                            <p class="style-name-info">示例（图片缩放+图片水印）</p>
                            <p class="style-name-info">c_fit,w_300,f_png--l_bs_logo,g_north_west,w_120,o_35,x_43,y_20,a_-10</p>
                            <p class="style-name-info dis-inline">参数说明，</p><a href="http://doc.bscstorage.com/doc/imgx/imgx_manual.html">见文档</a>
                        </div>
                        <div class="form-item clearfix line-button">
                            <div class="img-button">
                                <Button type="ghost" @click="">{{$t("PUBLIC.CANCLE")}}</Button>
                                <Button type="primary" @click="submitStyles" :disabled="transformationError">{{$t("PUBLIC.CONFIRMED")}}</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Tab-pane>
        </Tabs>
    </div>
</template>
<script>
import { handler, config } from '@/service/Aws'
import { prefix } from '@/service/BucketService'
import upload from '@/components/bucket/upload'
import * as styleList from '@/pages/bucket/PictureStyles'
import iView from 'iview'
export default {
    data () {
        return {
            transformation: '',
            formatList: ['original', 'png', 'webp', 'jpeg', 'jpg'],
            fontList: allFontList,
            watermarker: watermarkerDefult,
            general: generalDefult,
            imgName: '',
            uploadPrefix: prefix.overlay,
            uploadValidation: /^[\x00-\x2b\x2e\x30-\x39\x3b-\xff]+\.(png|PNG)$/,
            instructions: this.instructions,
            padList: [{value: 'pad', label: '背景填充等比例缩放'}, {value: 'lpad', label: '背景填充等比例缩小'}, {value: 'mpad', label: '背景填充等比例放大'}],
            fillList: [{value: 'fill', label: '等比例裁剪'}, {value: 'lfill', label: '不放大原图的等比例裁剪'}],
            thumbList: [{value: 'face', label: '定位一张最易识别的人脸'}, {value: 'faces', label: '定位多张人脸'}, {value: 'face:center', label: '定位一张人脸，若无人脸定位到原图中心'}, {value: 'faces:center', label: '定位多张人脸，若无人脸定位到原图中心'}],
            fitList: [{value: 'fit', label: '等比例缩放'}, {value: 'mfit', label: '等比例放大'}, {value: 'limit', label: '等比例缩小'}],
            angleList: [{value: 'angle', label: '旋转角度'}, {value: 'vflip', label: '垂直翻转'}, {value: 'hflip', label: '水平翻转'}],
            setMore: false,
            radiusSlider: 1001,
            fontStyle: defaultFontStyle,
            tabValue: 'primary',
            primaryDisable: false,
            previewUrl: getImgxUrl('q_100'),
            seniorUrl: getImgxUrl('q_100'),
            cropGravityList: [{value: 'north_west', label: '左上位置'}, {value: 'north', label: '正上位置，水平方向居中'}, {value: 'north_east', label: '右上位置'}, {value: 'west', label: '左边，垂直方向居中'}, {value: 'center', label: '正中'}, {value: 'east', label: '右边，垂直方向居中'}, {value: 'south_west', label: '左下位置'}, {value: 'south', label: '正下位置'}, {value: 'south_east', label: '右下位置'}, {value: 'noGravity', label: '指定起点坐标'}, {value: 'xy_center', label: '指定的xy为中心点'}, {value: 'face', label: '定位一张最容易识别的人脸'}, {value: 'faces', label: '定位多张人脸'}, {value: 'face:center', label: '定位一张人脸，若无人脸定位到原图中心'}, {value: 'faces:center', label: '定位多张人脸，若无人脸定位到原图中心'}]
        }
    },
    components: { upload },
    computed: {
        bucket () {
            return this.$route.params.bucket
        },
        ruleName () {
            return this.$route.params.ruleName
        },
        paramsIS () {
            return this.$route.params.IS === 'noIS' ? '' : this.$route.params.IS
        },
        key () {
            return this.$route.params.ruleName ? prefix.rules + this.$route.params.ruleName + '.json' : ''
        },
        transformationError () {
            return !(/^[a-z0-9_]{1,20}$/).test(this.transformation)
        },
        textError () {
            return this.watermarker.open && this.watermarker.type === 'text' && !(/.+/).test(this.watermarker.text)
        },
        imgError () {
            return this.watermarker.open && this.watermarker.type === 'img' && !(this.imgName)
        },
        styleListHref () {
            return '/bucket/' + this.bucket + '/pictureStyles'
        },
        isOpacity () {
            return this.general.format === 'original' || this.general.format === 'png' || this.general.format === 'webp'
        },
        radiusValue () {
            return this.radiusSlider > 1000 || this.radiusSlider > 1000 ? 'max' : this.radiusSlider
        }
    },
    mounted () {
        this.readStyles()
    },
    methods: {
        async readStyles () {
            if (!!this.ruleName && this.ruleName !== 'noRuleName') {
                this.transformation = this.ruleName
                this.instructions = this.paramsIS
                let res = await handler('getObject', {
                    Bucket: this.bucket,
                    Key: this.key
                })
                let styles = JSON.parse(new TextDecoder('utf-8').decode(res.Body))
                if (isPrimary(styles)) {
                    let front = styles2Front(styles)
                    this.general = front.ganeral
                    this.watermarker = front.watermarker
                    let overlay = front.overlay
                    // is watermarker here
                    if (!!overlay) {
                        let file = await this.readOverlayFile(overlay)
                        if (/.+\.json$/.test(overlay)) {
                            let fontStyle = JSON.parse(new TextDecoder('utf-8').decode(file))
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
                console.log(this.previewUrl)
            }
        },
        async submitStyles () {
            console.log(this.styles2Save())
            if (!this.transformationError && !this.textError && this.styles2Save()) {
                const file = new Blob([JSON.stringify(this.styles2Save())], {'type': 'application/json'})
                try {
                    await handler('putObject', {
                        Bucket: this.bucket,
                        Key: prefix.rules + this.transformation + '.json',
                        ContentType: 'application/json',
                        Body: file
                    })
                    this.$Message.success('保存成功')
                } catch (error) {
                    this.$Message.success('保存失败')
                }
            }
        },
        async previewFn () {
            let watermarker, ISw, overlay, file
            const general = general2Save(this.general)
            let IS = styleList.methods.json2instruction(general)[0]
            if (this.watermarker.open) {
                if (this.watermarker.type === 'text') {
                    file = new Blob([JSON.stringify(this.font2Save(this.fontStyle))], {'type': 'application/json'})
                    watermarker = watermarker2Save(this.watermarker, this.transformation)
                } else if (this.watermarker.type === 'img') {
                    file = await this.readOverlayFile(this.imgName)
                    watermarker = watermarker2Save(this.watermarker, this.imgName)
                }
                [ISw, overlay] = styleList.methods.json2instruction(watermarker)
                IS += '--' + ISw
                await putOverlayFile(overlay, file)
                this.previewUrl = getImgxUrl(IS)
            } else {
                this.previewUrl = getImgxUrl(IS)
            }
        },
        async seniorPreview () {
            let fontName, imgName
            let st = this.instructions.split('l_text:')[1]
            let si = this.instructions.split('l_')[1]
            if (!!st) {
                fontName = st.split(':')[0] + '.json'
                const file = await this.readOverlayFile(fontName)
                await putOverlayFile(fontName, file)
                this.seniorUrl = getImgxUrl(this.instructions)
            } else if (!!si) {
                imgName = si.split(',')[0].length < si.split('-')[0].length ? si.split(',')[0] + '.png' : si.split('-')[0] + '.png'
                const file = await handler('getObject', {
                    Bucket: this.bucket,
                    Key: prefix.overlay + imgName
                })
                await putOverlayFile(imgName, file.Body)
                this.seniorUrl = getImgxUrl(this.instructions)
            }
        },
        styles2Save () {
            let data = []
            if (this.tabValue === 'primary') {
                const general = general2Save(this.general)
                data.push(general)
                if (this.watermarker.open) {
                    let watermarkerData = {}
                    if (this.watermarker.type === 'text') {
                        this.saveFont(this.fontStyle)
                        watermarkerData = watermarker2Save(this.watermarker, this.transformation)
                    } else if (this.watermarker.type === 'img') {
                        watermarkerData = watermarker2Save(this.watermarker, this.imgName)
                    }
                    data.push(watermarkerData)
                }
            } else {
                const insArray = this.instructions.split('--')
                if (insArray.length > 4) {
                    this.$Message.error('指令条目不能超过4条')
                    return false
                }
                insArray.forEach(instruction => {
                    const item = {}
                    instruction.split(',').forEach(ins => {
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
        async readOverlayFile (name) {
            let params = {
                Bucket: this.bucket,
                Key: prefix.overlay + name
            }
            let res = await handler('getObject', params)
            return res.Body
        },
        async saveFont (data) {
            const file = new Blob([JSON.stringify(this.font2Save(data))], {'type': 'application/json'})
            try {
                await handler('putObject', {
                    Bucket: this.bucket,
                    Key: prefix.overlay + this.transformation + '_font.json',
                    ContentType: 'application/json',
                    Body: file
                })
            } catch (error) {
                this.$Message.error('字体文件保存失败')
            }
        },
        font2Save (data) {
            return {
                font_family: data.font_family,
                font_size: parseInt(data.font_size),
                font_color: data.font_color.substr(1).toLowerCase(),
                text: this.watermarker.text,
                background: data.background.substr(1).toLowerCase()
            }
        },
        uploadSuccess (fileName) {
            this.imgName = fileName
        },
        radiusFormater (radiusSlider) {
            return radiusSlider > 1000 ? 'max' : radiusSlider
        }
    },
    watch: {
        // the contents array need refresh when the $route value changed
        '$route' (to, from) {
            to.path !== from.path && this.getData()
        }
    }
}
const putOverlayFile = (name, body) => {
    const type = /.+\.png$/.test(name) ? 'application/x-png' : 'application/json'
    const s3 = config({ previewAccessKey, previewSecretKey })
    return new Promise((resolve, reject) => s3.putObject({
        Bucket: 'image-example',
        Key: prefix.overlay + name,
        ContentType: type,
        Body: body
    }, (error, data) => {
        error && iView.Message.error(error, 5)
        return error ? reject(error) : resolve(data)
    }))
}
const getImgxUrl = IS => {
    return 'http://imgx-ss.bscstorage.com/image-example/' + IS + '/dashboard.jpg?' + Date.now()
}
const previewAccessKey = 'acc_drdrxp'
const previewSecretKey = '11111111111111111111'
const I2J = {
    c_: 'crop',
    w_: 'width',
    h_: 'height',
    g_: 'gravity',
    x_: 'x',
    y_: 'y',
    q_: 'quality',
    r_: 'radius',
    a_: 'angle',
    e_: 'effect',
    o_: 'opacity',
    bo_: 'border',
    b_: 'background',
    l_: 'overlay',
    f_: 'format',
    v_: 'version',
    t_: 'transformation'
}

const generalDefult = {
    crop: 'noCrop',
    quality: 70,
    format: 'original',
    width: 200,
    height: 400,
    padType: 'pad',
    fillType: 'fill',
    thumbType: 'face',
    fitType: 'fit',
    dataType: 'pixel',
    gravity: 'north_west',
    opacity: 100,
    angleType: 'angle',
    angle: 0,
    effect: 'noEffect',
    brightnessValue: 30,
    blurValue: 100,
    sharpenValue: 100,
    oilValue: 4,
    colorValue: 80,
    color: 'red',
    pixelateValue: 5,
    border: false,
    borderSize: 1,
    borderColor: '#ffffff',
    padColor: '#ffffff',
    x: 0,
    y: 0
}
const watermarkerDefult = {
    open: false,
    type: 'text',
    text: '',
    gravity: 'north_west',
    x: 0,
    y: 0,
    opacity: 100
}
const defaultFontStyle = {
    text: '',
    font_family: 'Songti SC',
    font_size: 16,
    background: '#ffffff',
    font_color: '#ffffff'
}
const general2Save = data => {
    let saved = {}
    if (data.crop === 'pad') {
        saved.crop = data.padType
        saved.background = data.padColor.substr(1).toLowerCase()
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
            saved.gravity === data.gravity
            saved.x = data.x
            saved.y = data.y
        } else {
            saved.gravity === data.gravity
        }
    } else if (data.crop !== 'noCrop') {
        saved.crop = data.crop
    } else {}
    if (data.crop !== 'noCrop') {
        saved.width = data.dataType === 'pixel' ? parseInt(data.width) : parseFloat(data.width / 100)
        saved.height = data.dataType === 'pixel' ? parseInt(data.height) : parseFloat(data.height / 100)
    }

    if (data.format === 'original' || data.format === 'png' || data.format === 'webp') {
        saved.quality = data.quality
    }
    if (data.format !== 'original') {
        saved.format = data.format
    }
    if (data.angleType === 'angle' && data.angle !== 0) {
        saved.angle = parseInt(data.angle)
    } else if (data.angleType === 'vflip' || data.angleType === 'hflip') {
        saved.angle = data.angleType
    }

    const ef = data.effect

    if (ef === 'oil_paint') {
        saved.effect = ef + ':' + data.oilValue
    } else if (ef === 'brightness') {
        saved.effect = ef + ':' + data.brightnessValue
    } else if (ef === 'blur') {
        saved.effect = ef + ':' + data.blurValue
    } else if (ef === 'pixelate') {
        saved.effect = ef + ':' + data.pixelateValue
    } else if (ef === 'sharpen') {
        saved.effect = ef + ':' + data.sharpenValue
    } else if (ef === 'color') {
        saved.effect = data.color + ':' + data.colorValue
    } else if (ef !== 'noEffect') {
        saved.effect = ef
    } else {}

    if (data.border) {
        saved.border = data.borderSize + '_' + data.borderColor.substr(1).toLowerCase()
    }
    if (data.opacity !== 100) {
        saved.opacity = data.opacity
    }
    return saved
}
const watermarker2Save = (data, name) => {
    let saved = {
        x: parseInt(data.x),
        y: parseInt(data.y),
        gravity: data.gravity,
        opacity: data.opacity
    }
    if (data.type === 'text') {
        saved.overlay = 'text:' + name + '_font:' + data.text
    } else if (data.type === 'img') {
        saved.overlay = name.split('.png')[0]
    }
    return saved
}
const isPrimary = styles => {
    let uniqueArray = []
    let uniqueSet = new Set()
    styles.forEach(item => {
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
const styles2Front = styles => {
    let ganeral = _.clone(generalDefult)
    let watermarker = _.clone(watermarkerDefult)
    let overlay = ''
    console.log(watermarkerDefult)
    styles.forEach(item => {
        // checkout watermarker or general
        if (Object.keys(item).includes('overlay')) {
            if (/^text:.+/.test(item.overlay)) {
                overlay = item.overlay.split(':')[1] + '.json'
            } else {
                overlay = item.overlay + '.png'
            }
            _.assignIn(watermarker, watermarker2Front(item))
        } else {
            _.assignIn(ganeral, general2Front(item))
        }
    })
    return { ganeral, watermarker, overlay }
}
const general2Front = data => {
    let front = {}
    Object.assign(front, data)

    const cr = data.crop
    let frontC

    if (cr && (cr === 'mfit' || cr === 'fit' || cr === 'limit')) {
        frontC = 'fit'
        front.fitType = cr
    } else if (cr && (cr === 'pad' || cr === 'mpad' || cr === 'lpad')) {
        frontC = 'pad'
        front.padType = cr
        if (data.background) {
            front.padColor = '#' + data.background.substr(0, 6)
        }
    } else if (cr && (cr === 'fill' || cr === 'lfill')) {
        frontC = 'fill'
        front.fillType = cr
    } else if (cr && cr === 'thumb') {
        frontC = 'thumb'
        front.thumbType = data.gravity
    } else if (cr && cr === 'crop') {
        frontC = 'crop'
        if (data.gravity) {
            front.gravity = data.gravity
            if (data.x || data.y) {
                front.x = data.x || 0
                front.y = data.y || 0
            }
        } else if (data.x || data.y) {
            front.gravity = 'noGravity'
            front.x = data.x || 0
            front.y = data.y || 0
        }
    } else if (cr) {
        frontC = cr
    } else {
        frontC = 'noCrop'
    }
    front.crop = frontC

    if (data.width) {
        front.width = data.width > 1 ? data.width : data.width * 100
        front.dataType = data.width > 1 ? 'pixel' : 'percent'
    }
    if (data.height) {
        front.height = data.height > 1 ? data.height : data.height * 100
        front.dataType = data.height > 1 ? 'pixel' : 'percent'
    }
    if (data.angle) {
        front.angleType = data.angle === 'vflip' || data.angle === 'hflip' ? data.angle : 'angle'
        front.angle = data.angle === 'vflip' || data.angle === 'hflip' ? 0 : data.angle
    }

    const ef = data.effect
    if (ef) {
        const effectArray = ['grayscale', 'oil_paint', 'negate', 'brightness', 'blur', 'pixelate', 'sharpen', 'auto_contrast', 'improve']
        const colorArray = ['sepia', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta']
        if (effectArray.includes(ef) || effectArray.includes(ef.split(':')[0])) {
            front.effect = ef
            if (ef.split('oil_piant:')[1]) {
                front.oilValue = parseInt(ef.split('oil_piant:')[1])
            } else if (ef.split('brightness:')[1]) {
                front.brightnessValue = parseInt(ef.split('brightness:')[1])
            } else if (ef.split('blur:')[1]) {
                front.blurValue = parseInt(ef.split('blur:')[1])
            } else if (ef.split('pixelate:')[1]) {
                front.pixelateValue = parseInt(ef.split('pixelate:')[1])
            } else if (ef.split('sharpen:')[1]) {
                front.sharpenValue = parseInt(ef.split('sharpen:')[1])
            }
        } else if (colorArray.includes(ef) || colorArray.includes(ef.split(':')[0])) {
            front.effect = 'color'
            front.color = ef.split(':')[0]
            if (ef.split(':')[1]) {
                front.colorValue = parseInt(ef.split(':')[1])
            }
        }
    }

    const bo = data.border
    if (bo) {
        front.border = true
        front.borderSize = bo.split('_')[0] || 1
        const borderColor = '#' + bo.split('_')[1].substr(0, 6)
        front.borderColor = borderColor || '#BF4040'
    }
    if (data.quality) {
        front.quality = parseInt(data.quality)
    }
    if (data.opacity) {
        front.opacity = parseInt(data.opacity)
    }
    return front
}

const watermarker2Front = data => {
    let front = _.clone(watermarkerDefult)
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
const allFontList = [{
    value: 'Songti SC',
    label: '宋体'
}, {
    value: 'Heiti SC',
    label: '黑体'
}, {
    value: 'Kaiti SC',
    label: '楷体'
}, {
    value: 'Microsoft YaHei',
    label: '微软雅黑'
}, {
    value: 'Adobe Song Std',
    label: 'Adobe Song Std'
}, {
    value: 'Adobe Heiti Std',
    label: 'Adobe Heiti Std'
}, {
    value: 'Adobe Kaiti Std',
    label: 'Adobe Kaiti Std'
}, {
    value: 'Adobe Fangsong Std',
    label: 'Adobe Fangsong Std'
}, {
    value: 'Batang',
    label: 'Batang'
}, {
    value: 'Bookshelf Symbol 7',
    label: 'Bookshelf Symbol 7'
}, {
    value: 'Brush Script MT',
    label: 'Brush Script MT'
}, {
    value: 'Calibri',
    label: 'Calibri'
}, {
    value: 'Cambria',
    label: 'Cambria'
}, {
    value: 'Candara',
    label: 'Candara'
}, {
    value: 'Candelita',
    label: 'Candelita'
}, {
    value: 'Consolas',
    label: 'Consolas'
}, {
    value: 'Constantia',
    label: 'Constantia'
}, {
    value: 'Corbel',
    label: 'Corbel'
}, {
    value: 'Franklin Gothic Book',
    label: 'Franklin Gothic Book'
}, {
    value: 'Franklin Gothic Medium',
    label: 'Franklin Gothic Medium'
}, {
    value: 'Gill Sans MT',
    label: 'Gill Sans MT'
}, {
    value: 'Gulim',
    label: 'Gulim'
}, {
    value: 'Hannotate SC',
    label: 'Hannotate SC'
}, {
    value: 'Hannotate TC',
    label: 'Hannotate TC'
}, {
    value: 'HanziPen SC',
    label: 'HanziPen SC'
}, {
    value: 'HanziPen TC',
    label: 'HanziPen TC'
}, {
    value: 'Hiragino Sans GB',
    label: 'Hiragino Sans GB'
}, {
    value: 'Lantinghei SC',
    label: 'Lantinghei SC'
}, {
    value: 'Lantinghei TC',
    label: 'Lantinghei TC'
}, {
    value: 'Libian SC',
    label: 'Libian SC'
}, {
    value: 'Lucida Console',
    label: 'Lucida Console'
}, {
    value: 'Lucida Sans Unicode',
    label: 'Lucida Sans Unicode'
}, {
    value: 'MJNgai PRC',
    label: 'MJNgai PRC'
}, {
    value: 'MS Gothic',
    label: 'MS Gothic'
}, {
    value: 'MS Mincho',
    label: 'MS Mincho'
}, {
    value: 'MS PGothic',
    label: 'MS PGothic'
}, {
    value: 'MS PMincho',
    label: 'MS PMincho'
}, {
    value: 'MS Reference Sans Serif',
    label: 'MS Reference Sans Serif'
}, {
    value: 'Marlett',
    label: 'Marlett'
}, {
    value: 'Meiryo',
    label: 'Meiryo'
}, {
    value: 'Microsoft YaHei',
    label: 'Microsoft YaHei'
}, {
    value: 'PMingLiU',
    label: 'PMingLiU'
}, {
    value: 'Perpetua',
    label: 'Perpetua'
}, {
    value: 'STFangsong',
    label: 'STFangsong'
}, {
    value: 'STHeiti',
    label: 'STHeiti'
}, {
    value: 'STHupo',
    label: 'STHupo'
}, {
    value: 'STKaiti',
    label: 'STKaiti'
}, {
    value: 'STLiti',
    label: 'STLiti'
}, {
    value: 'STSong',
    label: 'STSong'
}, {
    value: 'STXingkai',
    label: 'STXingkai'
}, {
    value: 'STXinwei',
    label: 'STXinwei'
}, {
    value: 'STZhongsong',
    label: 'STZhongsong'
}, {
    value: 'SentyPaperCut',
    label: 'SentyPaperCut'
}, {
    value: 'SimHei',
    label: 'SimHei'
}, {
    value: 'SimSun',
    label: 'SimSun'
}, {
    value: 'SimSun-ExtB',
    label: 'SimSun-ExtB'
}, {
    value: 'Songti TC',
    label: 'Songti TC'
}, {
    value: 'Source Han Sans CN',
    label: 'Source Han Sans CN'
}, {
    value: 'Tw Cen MT',
    label: 'Tw Cen MT'
}, {
    value: 'Villasukat',
    label: 'Villasukat'
}, {
    value: 'Wawati SC',
    label: 'Wawati SC'
}, {
    value: 'Weibei SC',
    label: 'Weibei SC'
}, {
    value: 'Xingkai SC',
    label: 'Xingkai SC'
}, {
    value: 'Yuanti SC',
    label: 'Yuanti SC'
}, {
    value: 'Yuppy SC',
    label: 'Yuppy SC'
}]
</script>

<style lang="less" scoped>
.test-img{
    width:100%;
    max-width:450px;
    margin:15px 0;
    img{
        max-width:100%;
        height:300px;
        margin-bottom:15px;
        background:#000;
        display:block
    }
}
.form-label{
    font-size: 14px;
    padding-right:5px;
    line-height:30px;
}
.page-left{
    width:600px;
    padding-left:30px;
    .form-item{
        margin-bottom:20px;
    }
    .style-name-info{
        padding:5px 0 0 75px;
        color:#8492a6;
        font-size: 12px;
    }
    .pic-slider{
        display:inline-block;
        width:420px;
        vertical-align:middle;
    }
    .slider-input{
        width: 45px;
        margin-left:10px;
    }
    .separator-line{
        margin:10px 0 30px -20px;
        border-bottom:1px solid #d7dde4;
    }
    .font-styles{
        & > *{
            float:left;
            margin-right:10px;
        }
        & > *:nth-child(1){
            margin-right:0;
        }
    }
    .stroke{
        border-radius: 4px;
        border: 1px solid #d7dde4;
        height:32px;
        width:70px;
        text-align: center;
        line-height:30px;
        margin-left:63px;
        display:inline-block;
        margin-right:10px;
        margin-top: 10px;
    }
    .gravity-selector{
        width:182px;
        border-radius: 4px;
        display:inline-block;
        vertical-align:text-top;
        margin-right:20px;
        input{
            appearance:none;
            -moz-appearance:none; /* Firefox */
            -webkit-appearance:none; /* Safari 和 Chrome */
            width:60px;
            height:30px;
            border-top:1px solid #d7dde4;
            border-right:1px solid #d7dde4;
            float:left;
            outline:none;
            cursor: pointer;
        }
        input:nth-child(1){
            border-top-left-radius: 4px;
        }
        input:nth-child(3){
            border-top-right-radius: 4px;
        }
        input:nth-child(7){
            border-bottom-left-radius: 4px;
        }
        input:nth-child(9){
            border-bottom-right-radius: 4px;
        }
        input:nth-child(3n+1){
            border-left:1px solid #d7dde4;
        }
        input:nth-last-child(1),input:nth-last-child(2),input:nth-last-child(3){
            border-bottom:1px solid #d7dde4;
        }
        input:checked
        { 
            background-color: #20a0ff;
        }
    }
    .padding-setting{
        display:inline-block;
        vertical-align: text-top;
    }
}
.input-text-box{
    width:100px;
    height:32px;
    border:1px solid #d7dde4;
    border-radius:4px;
    padding:4px 7px;
    display:inline-block;
    vertical-align: middle;
    margin-right:10px;
    input{
        width:65px;
        line-height:24px;
        border:none;
        color:#657180;
        outline:none;
    }
    span{
        line-height:24px;
    }
}
.img-button{
    float:right;
}
.color-box{
    width:105px;
    height:32px;
    border:1px solid #d7dde4;
    border-radius:4px;
    position:relative;
    display:inline-block;
    vertical-align: middle;
    input.color-trigger{
        appearance:none;
        -moz-appearance:none; /* Firefox */
        -webkit-appearance:none; /* Safari 和 Chrome */
        width:30px;
        height:30px;
        float:left;
        border:none;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-right:1px solid #d7dde4;
        background-color:#fff;
        outline: none;
    }
    input.color-input{
        border:none;
        line-height:30px;
        width:70px;
        float:left;
        padding-left:15px;
        color:#657180;
        outline:none;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
    }
}
.red{
    color:red !important;
}
.dis-inline{
    display:inline
}
.upload-box{
    width:475px;
    display:inline-block;
    vertical-align: text-top;
}
.color-selector{
    width:387px;
    border:1px solid #d7dde4;
    border-radius: 4px;
    display:inline-block;
    vertical-align:middle;
    margin-right:20px;
    input{
        appearance:none;
        -moz-appearance:none; /* Firefox */
        -webkit-appearance:none; /* Safari 和 Chrome */
        width:55px;
        height:30px;
        float:left;
        outline:none;
        cursor: pointer;
    }
    input:checked , input:hover{
        border: 1px solid #20a0ff;
        box-shadow: 0 0 10px #20a0ff;
    }
    input:nth-child(1){
        background-color:#5E2612;
    }
    input:nth-last-child(2){
        background-color:#00FFFF;
    }
}
.gravity-xy{
    margin-left:60px;
}
.gravity-preview{
    &>div{
        float:left
    }
    div.left{
        width:350px;
    }
    div.right{
        width:100px;
        height:85px;
        background:#20a0ff;
    }
}
.mar-l15{
    margin-left:15px;
}
.mar-l20{
    margin-left:20px;
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
</style>
