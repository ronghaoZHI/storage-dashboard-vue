<template>
    <div class="bsc-edit-styles">
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
                    <Col span="8" class="page-left">
                        <span class="form-label">{{$t("STORAGE.PREVIEW")}}:</span>
                        <div class="test-img">
                            <img :src='previewUrl'>
                            <div>
                                <Button type="primary" @click="primaryPreview" :disabled="textError">效果预览</Button>
                            </div>
                        </div>
                    </Col>
                    <Col span="16" class="page-right">
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
                                <Radio label="fill">{{$t("STORAGE.CROP_FILL")}}</Radio>
                                <p style='height: 10px;'></p>
                                <Radio label="crop">{{$t("STORAGE.CROP_CROP")}}</Radio>
                                <Radio label="thumb">{{$t("STORAGE.CROP_THUMB")}}</Radio>
                                <Radio label="pad">{{$t("STORAGE.CROP_PAD")}}</Radio>
                            </Radio-group>
                        </div>
                        <div class="form-item" v-if="general.crop === 'fit'">
                            <Select v-model="general.fitType" class="sub-select">
                                <Option v-for="item in fitList" :value="item.value" :key="item">{{ item.label }}</Option>
                            </Select>
                        </div>
                        <div class="form-item" v-if="general.crop === 'pad'">
                            <Select v-model="general.padType" class="sub-select" style="margin-right:8px">
                                <Option v-for="item in padList" :value="item.value" :key="item">{{ item.label }}</Option>
                            </Select>
                            <div class="color-box">
                                <input type="color" v-model="general.padColor" class="color-trigger">
                                <input type='text' v-model="general.padColor" class="color-input">
                            </div><!--padColor-->
                        </div>
                        <div class="form-item" v-if="general.crop === 'fill'">
                            <Select v-model="general.fillType" class="sub-select">
                                <Option v-for="item in fillList" :value="item.value" :key="item">{{ item.label }}</Option>
                            </Select>
                        </div>
                        <div class="form-item" v-if="general.crop === 'thumb'">
                            <Select v-model="general.thumbType" class="sub-select">
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
                            <span>W : </span>
                            <div class="input-text-box">
                                <input type='number' v-model.number="general.width">
                                <span v-if="general.dataType === 'pixel'">px</span>
                                <span v-else>%</span>
                            </div>
                            <span>H : </span>
                            <div class="input-text-box">
                                <input type='number' v-model.number="general.height">
                                <span v-if="general.dataType === 'pixel'">px</span>
                                <span v-else>%</span>
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
                        <div class="separator-line"></div>
                        <div class="form-item">
                            <Button type="ghost" @click="setMore = !setMore">更多设置 <Icon type="chevron-down" v-if="!setMore"></Icon><Icon type="chevron-up" v-else></Icon></Button>
                        </div>
                        <div v-if="setMore">
                            <div class="form-item">
                                <span class="form-label">翻转模式 : </span>
                                <Radio-group v-model="general.angleType" style='vertical-align: text-top'>
                                    <Radio v-for="item in angleList" :label="item.value" :key="item.value">{{item.label}}</Radio>
                                </Radio-group>
                            </div><!--angleType-->
                            <div class="form-item" v-if="general.angleType === 'angle'">
                                <span class="form-label">角度 : </span>
                                <div class="input-text-box">
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
                                <div class="color-selector">
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
                                <Slider class="pic-slider" :min='1' :max='400' v-model="general.pixelateValue"></Slider>
                                <Input v-model="general.pixelateValue" class="slider-input"></Input>
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
                                <div class="color-box">
                                    <input type="color" v-model="general.borderColor" class="color-trigger">
                                    <input type='text' v-model="general.borderColor" class="color-input">
                                </div><!--borderColor-->
                            </div><!--border-->
                            <div class="form-item">
                                <span class="form-label">生成圆角 : </span>
                                <Slider class="pic-slider" :min='0' :max='1001' v-model="general.radius" :tip-format="radiusFormater"></Slider>
                                <Input v-model="radiusValue" class="slider-input" @on-change="radiusChange"></Input>
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
                            <i-switch v-model="mark.open" size="large">
                                <span slot="open">ON</span>
                                <span slot="close">OFF</span>
                            </i-switch>
                        </div><!--watermarkerOpen-->
                        <div v-if="mark.open">
                            <div class="form-item">
                                <span class="form-label">{{$t("STORAGE.WATERMARKER_TYPE")}} : </span>
                                <Radio-group v-model="mark.type">
                                    <Radio label="text">{{$t("STORAGE.TEXT_WATERMARKER")}}</Radio>
                                    <Radio label="img">{{$t("STORAGE.IMG_WATERMARKER")}}</Radio>
                                </Radio-group>
                            </div><!--watermarkerType-->
                            <div v-if="mark.type == 'text'" class="clearfix">
                                <div class="form-item">
                                    <span class="form-label">{{$t("STORAGE.TEXT_CONTENT")}} : </span>
                                    <Input v-model="mark.text" :placeholder='$t("STORAGE.TEXT_CONTENT")' class="line-width"></Input>
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
                                    <div class="color-box">
                                        <input type="color" v-model="fontStyle.background" class="color-trigger">
                                        <input type='text' v-model="fontStyle.background" class="color-input">
                                    </div><!--fontColor-->
                                </div><!--fontBack-->
                            </div>
                            <div v-if="mark.type == 'img'">
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
                                    <input type="radio" value="north_west" v-model="mark.gravity"></Radio>
                                    <input type="radio" value="north" v-model="mark.gravity"></Radio>
                                    <input type="radio" value="north_east" v-model="mark.gravity"></Radio>
                                    <input type="radio" value="west" v-model="mark.gravity"></Radio>
                                    <input type="radio" value="center" v-model="mark.gravity"></Radio>
                                    <input type="radio" value="east" v-model="mark.gravity"></Radio>
                                    <input type="radio" value="south_west" v-model="mark.gravity"></Radio>
                                    <input type="radio" value="south" v-model="mark.gravity"></Radio>
                                    <input type="radio" value="south_east" v-model="mark.gravity"></Radio>
                                </div>
                                <div class="padding-setting">
                                    <div class="form-item">
                                        <span class="form-label">{{$t("STORAGE.PADDING_LEFT")}} : </span>
                                        <div class="input-text-box">
                                            <input type='number' v-model="mark.x">
                                            <span>px</span>
                                        </div>
                                    </div>
                                    <div class="form-item">
                                        <span class="form-label">{{$t("STORAGE.PADDING_TOP")}} : </span>
                                        <div class="input-text-box">
                                            <input type='number' v-model="mark.y">
                                            <span>px</span>
                                        </div>
                                    </div>
                                </div>
                            </div><!--location-->
                            <div class="form-item">
                                <span class="form-label">{{$t("STORAGE.OPACITY")}} : </span>
                                <Slider class="pic-slider" v-model="mark.opacity"></Slider>
                                <Input v-model="mark.opacity" class="slider-input" number></Input>
                            </div><!--opacity-->
                        </div>
                        <div class="separator-line"></div>
                        <div class="form-item clearfix line-button">
                            <div class="img-button">
                                <Button type="primary" @click="submitStyles" :disabled="transformationError || textError || imgError">{{$t("PUBLIC.CONFIRMED")}}</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Tab-pane>
            <Tab-pane :label='$t("STORAGE.ADV_EDIT")' name='senior'>
                <Row>
                    <Col span="8" class="page-left">
                        <span class="form-label">{{$t("STORAGE.PREVIEW")}}:</span>
                        <div class="test-img">
                            <img :src='seniorUrl'>
                            <div class="img-button">
                                <Button type="primary" @click="seniorPreview">效果预览</Button>
                            </div>
                        </div>
                    </Col>
                    <Col span="16" class="page-right">
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
                        <div class="separator-line"></div>
                        <div class="form-item clearfix line-button">
                            <div class="img-button">
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
import { prefix } from '@/service/bucketService'
import upload from '@/components/bucket/upload'
import * as styleList from '@/pages/bucket/PictureStyles'
import iView from 'iview'
import {editStylesConsts, allFontList, previewAccessKey, previewSecretKey, I2J, generalDefult, markerDefult, defaultFontStyle} from './Consts'
export default {
    data () {
        return {
            transformation: '',
            formatList: ['original', 'png', 'webp', 'jpeg', 'jpg'],
            fontList: allFontList,
            mark: _.clone(markerDefult),
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
            ...editStylesConsts
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
            return this.mark.open && this.mark.type === 'text' && !(/.+/).test(this.mark.text)
        },
        imgError () {
            return this.mark.open && this.mark.type === 'img' && !(this.imgName)
        },
        styleListHref () {
            return `/bucket/${this.bucket}/pictureStyles`
        },
        isOpacity () {
            return this.general.format === 'original' || this.general.format === 'png' || this.general.format === 'webp'
        },
        radiusValue () {
            return (this.general.radius >= 0 && this.general.radius <= 1000) ? this.general.radius : 'max'
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
                    this.mark = front.mark
                    let overlay = front.overlay
                    // is mark here
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
            }
        },
        async submitStyles () {
            let ruleList = await this.getRuleList()
            if (ruleList.includes(this.transformation)) {
                this.$Message.warning('规则名已存在！')
                return
            }
            if (!this.transformationError && !this.textError && this.styles2Save()) {
                const file = new Blob([JSON.stringify(this.styles2Save())], {'type': 'application/json'})
                try {
                    await handler('putObject', {
                        Bucket: this.bucket,
                        Key: prefix.rules + this.transformation + '.json',
                        ContentType: 'application/json',
                        Body: file
                    })
                    this.$router.push({ name: 'pictureStyles', params: { bucket: this.bucket } })
                } catch (error) {
                    this.$Message.success('保存失败')
                }
            }
        },
        async primaryPreview () {
            const general = general2Save(this.general)
            let IS = styleList.methods.json2instruction(general).instruction
            if (this.mark.open) {
                let markValue, file
                if (this.mark.type === 'text') {
                    file = new Blob([JSON.stringify(this.font2Save(this.fontStyle))], {'type': 'application/json'})
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
        async seniorPreview () {
            let texts = /.*l_text:(.*):.*/.exec(this.instructions)
            let imgs = this.instructions.split('l_')[1]
            if (!!texts) {
                let fontName = texts[1] + '.json'
                const file = await this.readOverlayFile(fontName)
                await putOverlayFile(fontName, file)
                this.seniorUrl = getImgxUrl(this.instructions)
            } else if (!!imgs) {
                let imgName = imgs.split(',')[0].length < imgs.split('-')[0].length ? imgs.split(',')[0] + '.png' : imgs.split('-')[0] + '.png'
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
                if (this.mark.open) {
                    let markData = {}
                    if (this.mark.type === 'text') {
                        this.saveFont(this.fontStyle)
                        markData = mark2Save(this.mark, this.transformation)
                    } else if (this.mark.type === 'img') {
                        markData = mark2Save(this.mark, this.imgName)
                    }
                    data.push(markData)
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
                text: this.mark.text,
                background: data.background.substr(1).toLowerCase()
            }
        },
        uploadSuccess (fileName) {
            this.imgName = fileName
        },
        radiusFormater (value) {
            return value > 1000 ? 'max' : value
        },
        radiusChange (event) {
            const value = parseInt(event.target.value)
            if (value >= 1 && value <= 1000) {
                this.general.radius = value
            } else {
                this.general.radius = Date.now()
            }
        },
        async getRuleList () {
            let ruleList = []
            let res = await handler('listObjects', {
                Bucket: this.bucket,
                Prefix: prefix.rules
            })
            const rules = res.Contents
            _.each(rules, item => {
                if (/\.json$/.test(item.Key)) {
                    const name = /.*\/(.*)\.json/.exec(item.Key)[1]
                    if (name !== this.ruleName) {
                        ruleList.push(name)
                    }
                }
            })
            return ruleList
        }
    },
    watch: {
        '$route' (to, from) {
            to.path !== from.path && this.getData()
        }
    }
}
const putOverlayFile = (name, body) => {
    const type = /.+\.png$/.test(name) ? 'application/x-png' : 'application/json'
    const s3 = config({ accesskey: previewAccessKey, secretkey: previewSecretKey })
    console.log(s3)
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
            saved.gravity = data.gravity
            saved.x = data.x
            saved.y = data.y
        } else {
            saved.gravity = data.gravity
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
        saved.effect = data.sharpenValue >= 1 && data.sharpenValue <= 400 ? `${effect}:${data.sharpenValue}` : `${effect}:100`
    } else if (effect === 'color') {
        saved.effect = data.color + ':' + data.colorValue
    } else if (effect !== 'noEffect') {
        saved.effect = effect
    } else {}

    if (data.border) {
        saved.border = data.borderSize + '_' + data.borderColor.substr(1).toLowerCase()
    }
    if (data.opacity !== 100) {
        saved.opacity = data.opacity
    }
    if (data.radius > 0 && data.radius <= 1000) {
        saved.radius = parseInt(data.radius)
    } else if (data.radius === 0) {} else {
        saved.radius = 'max'
    }
    return saved
}
const mark2Save = (data, name) => {
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
    let mark = _.clone(markerDefult)
    let overlay = ''
    styles.forEach(item => {
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
const general2Front = data => {
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
        front.angleType = data.angle === 'vflip' || data.angle === 'hflip' ? data.angle : 'angle'
        front.angle = data.angle === 'vflip' || data.angle === 'hflip' ? 0 : data.angle
    }

    const effect = data.effect
    if (effect) {
        const effectArray = ['grayscale', 'oil_paint', 'negate', 'brightness', 'blur', 'pixelate', 'sharpen', 'auto_contrast', 'improve']
        const colorArray = ['sepia', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta']
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
        front.borderColor = border.split('_')[1].substr(0, 6) ? '#' + border.split('_')[1].substr(0, 6) : '#BF4040'
    }
    if (data.quality) {
        front.quality = parseInt(data.quality)
    }
    if (data.opacity) {
        front.opacity = parseInt(data.opacity)
    }
    if (data.radius) {
        front.radius = (data.radius >= 1 && data.radius <= 1000) ? parseInt(data.radius) : 1001
    }
    return front
}

const mark2Front = data => {
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

.@{css-prefix}edit-styles {
    .page-left,
    .page-right {
        .form-label {
            display: inline-block;
            width: 85px;
            font-size: 14px;
            padding-right: 5px;
            line-height: 30px;
            text-align: right;
        }
    }

    .page-left {
        .test-img {
            width: 100%;
            max-width: 450px;
            margin: 15px 0;

            img {
                display: block;
                max-width: 100%;
                height: 300px;
                margin-bottom: 15px;
                background: #000;
            }
        }
    }

    .page-right {
        width: 600px;
        padding-left: 30px;

        .form-item {
            margin-bottom: 20px;

            .style-name-info {
                padding: 5px 0 0 90px;
                .sc(12px,#8492a6);
            }

            .pic-slider {
                display: inline-block;
                width: 420px;
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

            .gravity-selector {
                display: inline-block;
                width: 182px;
                border-radius: 4px;
                vertical-align: text-top;
                margin-right: 20px;

                input {
                    -webkit-appearance: none;
                    .wh(60px,30px);
                    border-top: 1px solid @edit-styles-border-color;
                    border-right: 1px solid @edit-styles-border-color;
                    float: left;
                    outline: none;
                    cursor: pointer;
                }

                input:nth-child(1) {
                    border-top-left-radius: 4px;
                }

                input:nth-child(3) {
                    border-top-right-radius: 4px;
                }

                input:nth-child(7) {
                    border-bottom-left-radius: 4px;
                }

                input:nth-child(9) {
                    border-bottom-right-radius: 4px;
                }

                input:nth-child(3n+1) {
                    border-left: 1px solid @edit-styles-border-color;
                }

                input:nth-last-child(1),
                input:nth-last-child(2),
                input:nth-last-child(3) {
                    border-bottom: 1px solid @edit-styles-border-color;
                }

                input:checked {
                    background-color: #20a0ff;
                }
            }

            .padding-setting {
                display: inline-block;
                vertical-align: text-top;
            }


            .input-text-box {
                width: 100px;
                height: 32px;
                border: 1px solid @edit-styles-border-color;
                border-radius: 4px;
                padding: 4px 7px;
                display: inline-block;
                vertical-align: middle;
                margin-right: 10px;
                input {
                    width: 65px;
                    line-height: 24px;
                    border: none;
                    color: #657180;
                    outline: none;
                }
                span {
                    line-height: 24px;
                }
            }

            .color-box {
                width: 105px;
                height: 32px;
                border: 1px solid @edit-styles-border-color;
                border-radius: 4px;
                position: relative;
                display: inline-block;
                vertical-align: middle;
                input.color-trigger {
                    -webkit-appearance: none;
                    width: 30px;
                    height: 30px;
                    float: left;
                    border: none;
                    border-top-left-radius: 4px;
                    border-bottom-left-radius: 4px;
                    border-right: 1px solid @edit-styles-border-color;
                    background-color: #fff;
                    outline: none;
                }
                input.color-input {
                    border: none;
                    line-height: 30px;
                    width: 70px;
                    float: left;
                    padding-left: 15px;
                    color: #657180;
                    outline: none;
                    border-top-right-radius: 4px;
                    border-bottom-right-radius: 4px;
                }
            }

            .red {
                color: red !important;
            }

            .dis-inline {
                display: inline
            }

            .upload-box {
                width: 475px;
                display: inline-block;
                vertical-align: text-top;
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
                    border: 1px solid #20a0ff;
                    box-shadow: 0 0 10px #20a0ff;
                }
                input:nth-child(1) {
                    background-color: #5E2612;
                }
                input:nth-last-child(2) {
                    background-color: #00FFFF;
                }
            }

            .gravity-xy {
                margin-left: 60px;
            }

            .gravity-preview {
                & > div {
                    float: left
                }
                div.left {
                    width: 350px;
                }
                div.right {
                    width: 100px;
                    height: 85px;
                    background: #20a0ff;
                }
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

            .pullRight{
                float: right;
            }

            .sub-select{
                width: 300px;
                margin-left: 90px;
            }
        }

        .separator-line {
            margin: 10px 0 30px -20px;
            border-bottom: 1px solid @edit-styles-border-color;
        }
        .img-button {
            margin-left: 250px;
        }
    }
}
</style>
