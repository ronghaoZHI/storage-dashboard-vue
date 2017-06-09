<template>
    <div @click="fontColorPicker = strokeColorPicker = false">
        <div class="layout-bsc-toolbar">
            <Breadcrumb>
                <Breadcrumb-item href="/">{{$t("STORAGE.TITLE")}}</Breadcrumb-item>
                <Breadcrumb-item :href="styleListHref">{{$t("STORAGE.PIC_STYLE")}}</Breadcrumb-item>
                <Breadcrumb-item>{{$t("STORAGE.CREATE_STYLE")}} ({{bucket}})</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <Tabs size="small" >
            <Tab-pane :label='$t("STORAGE.BASIC_EDIT")'>
                <Row>
                    <Col span="8">
                        <span class="form-label">{{$t("STORAGE.PREVIEW")}}:</span>
                        <div class="test-img">
                            <img class='' src="../../assets/logo.png">
                            <div class="img-button">
                                <Button type="primary" @click="">新窗口显示</Button>
                                <Button type="primary" @click="">图片对比</Button>
                            </div>
                        </div>
                    </Col>
                    <Col span="16" class="page-left">
                        <div class="form-item">
                            <span class="form-label">{{$t("STORAGE.STYLE_NAME")}} : </span>
                            <Input v-model="transformation" :placeholder='$t("STORAGE.STYLE_NAME")' style="width: 500px"></Input>
                            <p class="style-name-info" :class="{'red':transformationError}">名称使用数字、小写字母、下划线，不超过20个字符</p>
                        </div>
                        <div class="form-item">
                            <span class="form-label">{{$t("STORAGE.STYLE_CROP")}} : </span>
                            <Radio-group v-model="general.crop">
                                <Radio label="noCrop">{{$t("STORAGE.CROP_NONE")}}</Radio>
                                <Radio label="fit">{{$t("STORAGE.CROP_FIT")}}</Radio>
                            </Radio-group>
                        </div>
                        <div class="form-item" v-if="general.crop === 'fit'">
                            <span class="form-label">{{$t("STORAGE.FIT_STYLE")}} : </span>
                            <Radio-group v-model="general.fitStyle">
                                <Radio label="width">{{$t("STORAGE.FIT_WIDTH")}}</Radio>
                                <Radio label="height">{{$t("STORAGE.FIT_HEIGHT")}}</Radio>
                            </Radio-group>
                            <div class="input-text-box">
                                <input type='number' v-model="general.fitSize">
                                <span>px</span>
                            </div>
                        </div>
                        <div class="form-item">
                            <span class="form-label">{{$t("STORAGE.STYLE_EFFECT")}} : </span>
                            <Checkbox v-model="general.sharpen">{{$t("STORAGE.STYLE_SHARPEN")}}</Checkbox>
                        </div>
                        <div class="form-item">
                            <span class="form-label">{{$t("STORAGE.STYLE_QUALITY")}} : </span>
                            <Slider class="pic-slider" v-model="general.quality"></Slider>
                            <Input v-model="general.quality" class="slider-input" number></Input>
                        </div>
                        <div class="form-item">
                            <span class="form-label">{{$t("STORAGE.STYLE_FORMAT")}} : </span>
                            <Select v-model="general.format" style="width:500px">
                                <Option v-for="item in formatList" :value="item" :key="item">{{ item }}</Option>
                            </Select>
                        </div>
                        <div class="separator-line"></div>
                        <div class="form-item">
                            <span class="form-label">{{$t("STORAGE.STYLE_WATERMARKER")}} : </span>
                            <i-switch v-model="watermarker.open" size="large">
                                <span slot="open">ON</span>
                                <span slot="close">OFF</span>
                            </i-switch>
                        </div>
                        <div v-if="watermarker.open">
                            <div class="form-item">
                                <span class="form-label">{{$t("STORAGE.WATERMARKER_TYPE")}} : </span>
                                <Radio-group v-model="watermarker.type">
                                    <Radio label="text">{{$t("STORAGE.TEXT_WATERMARKER")}}</Radio>
                                    <Radio label="img">{{$t("STORAGE.IMG_WATERMARKER")}}</Radio>
                                </Radio-group>
                            </div>
                            <div v-if="watermarker.type == 'text'" class="clearfix">
                                <div class="form-item">
                                    <span class="form-label">{{$t("STORAGE.TEXT_CONTENT")}} : </span>
                                    <Input v-model="watermarker.fontStyle.text" :placeholder='$t("STORAGE.TEXT_CONTENT")' style="width: 500px"></Input>
                                    <p class="red style-name-info" v-if="textError">请输入水印文字内容</p>
                                </div>
                                <span class="form-label">{{$t("STORAGE.TEXT_STYLE")}} : </span>
                                <Select v-model="watermarker.fontStyle.font_family" style="width:135px;margin-right:10px;">
                                    <Option v-for="item in fontList" :value="item" :key="item">{{ item }}</Option>
                                </Select>
                                <div class="input-text-box">
                                    <input type='number' v-model="watermarker.fontStyle.font_size">
                                    <span>px</span>
                                </div>
                                <div class="color-box" @click.stop>
                                    <div class="color-trigger" :style="{background: fontColor.hex}" @click.stop="fontColorPicker=!fontColorPicker"></div>
                                    <input type='text' v-model="fontColor.hex">
                                    <slider-picker class="color-picker" v-if="fontColorPicker" v-model="fontColor" @click.stop/>
                                </div>
                                <br>
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
                                </div>
                                <div class="form-item">
                                    <span class="form-label">{{$t("STORAGE.OPACITY")}} : </span>
                                    <Slider class="pic-slider" v-model="watermarker.opacity"></Slider>
                                    <Input v-model="watermarker.opacity" class="slider-input" number></Input>
                                </div>
                            </div>
                            <div v-if="watermarker.type == 'img'">
                                <div class="form-item">
                                    <span class="form-label">{{$t("STORAGE.WATERMARKER_PIC")}} : </span>
                                    <div class="upload-box">
                                        <upload :bucket="bucket" :prefix="prefix" v-on:uploadSuccess="uploadSuccess"></upload>
                                    </div>
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
                                </div>
                                <div class="form-item">
                                    <span class="form-label">{{$t("STORAGE.OPACITY")}} : </span>
                                    <Slider class="pic-slider" v-model="watermarker.opacity"></Slider>
                                    <Input v-model="watermarker.opacity" class="slider-input"></Input>
                                </div>
                            </div>
                        </div>
                        <div class="form-item clearfix" style="width:415px;">
                            <div class="img-button">
                                <Button type="ghost" @click="">{{$t("PUBLIC.CANCLE")}}</Button>
                                <Button type="primary" @click="submitStyles" :disabled="transformationError || textError">{{$t("PUBLIC.CONFIRMED")}}</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Tab-pane>
            <Tab-pane :label='$t("STORAGE.ADV_EDIT")'>
                <Row>
                    <Col span="8">
                        <span class="form-label">{{$t("STORAGE.PREVIEW")}}:</span>
                        <div class="test-img">
                            <img class='' src="../../assets/logo.png">
                            <div class="img-button">
                                <Button type="primary" @click="">新窗口显示</Button>
                                <Button type="primary" @click="">图片对比</Button>
                            </div>
                        </div>
                    </Col>
                    <Col span="16" class="page-left">
                        <div class="form-item">
                            <span class="form-label">{{$t("STORAGE.STYLE_NAME")}} : </span>
                            <Input v-model="transformation" :placeholder='$t("STORAGE.STYLE_NAME")' style="width: 500px"></Input>
                            <p class="style-name-info" :class="{'red':transformationError}">名称使用数字、小写字母、下划线，不超过20个字符</p>
                        </div>
                        <div class="form-item">
                            <span class="form-label">{{$t("STORAGE.PROSCESS_PARAM")}} : </span>
                            <Input v-model="instructions" type="textarea" :rows="6" placeholder="使用高级编辑之前，建议先阅读Imgx图片处理服务使用说明" style="width: 500px"></Input>
                            <p class="style-name-info">示例（图片缩放+图片水印）</p>
                            <p class="style-name-info">c_fit,w_300,f_png--l_bs_logo,g_north_west,w_120,o_35,x_43,y_20,a_-10</p>
                            <p class="style-name-info dis-inline">参数说明，</p><a href="http://doc.bscstorage.com/doc/imgx/imgx_manual.html">见文档</a>
                        </div>
                        <div class="form-item clearfix" style="width:415px;">
                            <div class="img-button">
                                <Button type="ghost" @click="">{{$t("PUBLIC.CANCLE")}}</Button>
                                <Button type="primary" @click="submitInsStyles" :disabled="transformationError || textError">{{$t("PUBLIC.CONFIRMED")}}</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Tab-pane>
        </Tabs>
    </div>
</template>
<script>
import {Slider, Compact, Photoshop, Swatches} from 'vue-color'
import { handler } from '@/service/Aws'
import { picStyleRulesPrefix, picStyleOverlayPrefix } from '@/service/BucketService'
import upload from '@/components/bucket/upload'
export default {
    data () {
        return {
            transformation: '',
            formatList: ['original', 'png', 'webp', 'jpeg', 'jpg'],
            fontList: ['宋体', '黑体', '楷体', '隶书', '幼园', '仿宋', 'Arial', 'Georgia', 'Helvetica', 'Times-new-roman'],
            fontColorPicker: false,
            watermarker: watermarkerDefult,
            general: generalDefult,
            fontColor: defaultFontColor,
            prefix: picStyleOverlayPrefix,
            imgName: ''
        }
    },
    components: { 'photoshop-picker': Photoshop, 'slider-picker': Slider, 'compact-picker': Compact, 'swatches-picker': Swatches, upload },
    computed: {
        bucket () {
            return this.$route.params.bucket
        },
        ruleName () {
            return this.$route.params.ruleName
        },
        instructions () {
            return this.$route.params.IS === 'noIS' ? '' : this.$route.params.IS
        },
        key () {
            return this.$route.params.ruleName ? picStyleRulesPrefix + this.$route.params.ruleName + '.json' : ''
        },
        transformationError () {
            return !(/^[a-z0-9_]{1,20}$/).test(this.transformation)
        },
        textError () {
            return this.watermarker.open && this.watermarker.type === 'text' && !(/.+/).test(this.watermarker.fontStyle.text)
        },
        styleListHref () {
            return '/bucket/' + this.bucket + '/pictureStyles'
        }
    },
    mounted () {
        this.readStyles()
    },
    methods: {
        async submitStyles () {
            if (!this.transformationError && !this.textError) {
                const generalData = originalConvert2Save(this.general)
                let watermarkerData = {}
                let content = []
                content.push(generalData)
                if (this.watermarker.open) {
                    if (this.watermarker.type === 'text') {
                        this.saveFont()
                        watermarkerData = watermarkerConvert2Save(this.watermarker, this.transformation)
                    } else if (this.watermarker.type === 'img') {
                        watermarkerData = watermarkerConvert2Save(this.watermarker, this.imgName)
                    }
                    content.push(watermarkerData)
                }
                this.saveJSON2Bucket(content)
            }
        },
        async readStyles () {
            if (!!this.ruleName && this.ruleName !== 'noRuleName') {
                let params = {
                    Bucket: this.bucket,
                    Key: this.key
                }
                this.transformation = this.ruleName
                let res = await handler('getObject', params)
                let styles = JSON.parse(new TextDecoder('utf-8').decode(res.Body))
                this.general = generalConvert2Font(styeItemCheckout(styles).ganeralData)
                this.watermarker = _.assignIn(watermarkerDefult, watermarkerConvert2Font(styeItemCheckout(styles).watermarkerData))
                let fontName = styeItemCheckout(styles).fontName
                if (!!fontName) {
                    let fontStyle = await this.readFont(fontName)
                    this.watermarker.fontStyle = fontStyle
                    this.fontColor = {hex: fontStyle.font_color}
                }
            }
        },
        async readFont (fileName) {
            if (!!fileName) {
                let params = {
                    Bucket: this.bucket,
                    Key: picStyleOverlayPrefix + fileName + '.json'
                }
                let res = await handler('getObject', params)
                return JSON.parse(new TextDecoder('utf-8').decode(res.Body))
            }
        },
        async saveFont () {
            let style = {}
            style = this.watermarker.fontStyle
            style.font_size = parseInt(this.watermarker.fontStyle.font_size)
            style.font_color = this.fontColor.hex.substr(1).toLowerCase()
            const fontStyleFile = new Blob([JSON.stringify(style)], {'type': 'application/json'})
            try {
                await handler('putObject', {
                    Bucket: this.bucket,
                    Key: picStyleOverlayPrefix + this.transformation + '_font.json',
                    ContentType: 'application/json',
                    Body: fontStyleFile
                })
            } catch (error) {
                this.$Message.error(this.$t('STORAGE.ADD_STYLE_FAILED'))
            }
        },
        submitInsStyles () {
            const insArray = this.instructions.split('--')
            const insJSON = []
            insArray.forEach(instruction => {
                const item = {}
                const instructionArray = instruction.split(',')
                instructionArray.forEach(ins => {
                    const reg = /^[a-z0-9]+_/g
                    const insKey = I2J[reg.exec(ins)[0]]
                    const insValue = ins.substr(reg.lastIndex)
                    if (insKey === 'overlay' && insValue.substr(0, 5) === 'text:') {
                        const watermarkerArray = insValue.split(':')
                        item.overlay = watermarkerArray[1] || ''
                        item.text = watermarkerArray[2] || ''
                    } else {
                        item[insKey] = insValue
                    }
                })
                insJSON.push(item)
            })
            this.saveJSON2Bucket(insJSON)
        },
        async saveJSON2Bucket (jsonObj) {
            const file = new Blob([JSON.stringify(jsonObj)], {'type': 'application/json'})
            try {
                await handler('putObject', {
                    Bucket: this.bucket,
                    Key: picStyleRulesPrefix + this.transformation + '.json',
                    ContentType: 'application/json',
                    Body: file
                })
                this.$Message.success(this.$t('STORAGE.ADD_STYLE_SUCCESS'))
            } catch (error) {
                this.$Message.error(this.$t('STORAGE.ADD_STYLE_FAILED'))
            }
        },
        uploadSuccess (fileName) {
            this.imgName = fileName.split('.')[0]
        }
    },
    watch: {
        // the contents array need refresh when the $route value changed
        '$route' (to, from) {
            to.path !== from.path && this.getData()
        }
    }
}
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
const defaultFontColor = {
    hex: '#000000'
}
const generalDefult = {
    crop: 'noCrop',
    sharpen: false,
    quality: 70,
    format: 'original',
    fitSize: 10,
    fitStyle: 'width'
}
const watermarkerDefult = {
    open: false,
    type: 'text',
    text: '',
    fontStyle: {
        text: '',
        font_family: '宋体',
        font_size: 16
    },
    gravity: 'north_west',
    x: 0,
    y: 0,
    opacity: 100
}
const originalConvert2Save = (generalData) => {
    let generalSave = _.cloneDeep(generalData)
    if (generalSave.crop === 'fit') {
        generalSave[generalData.fitStyle] = parseInt(generalData.fitSize)
    } else {
        delete generalSave.crop
    }
    if (generalSave.sharpen) {
        generalSave.effect = 'sharpen'
    }
    if (generalSave.format === 'original') {
        delete generalSave.format
    }
    delete generalSave.fitStyle
    delete generalSave.fitSize
    delete generalSave.sharpen
    return generalSave
}
const watermarkerConvert2Save = (watermarkerData, styleName) => {
    let watermarkerSave = {
        x: parseInt(watermarkerData.x),
        y: parseInt(watermarkerData.y),
        gravity: watermarkerData.gravity,
        opacity: watermarkerData.opacity
    }
    if (watermarkerData.type === 'text') {
        watermarkerSave.overlay = 'text:' + styleName + '_font:' + watermarkerData.fontStyle.text
    } else if (watermarkerData.type === 'img') {
        watermarkerSave.overlay = styleName
    }
    return watermarkerSave
}
const styeItemCheckout = styles => {
    let ganeralData = {}
    let watermarkerData = {}
    let fontName = ''
    _.each(styles, item => {
        _.forIn(item, (value, key) => {
            if (generalKeyArray.indexOf(key) !== -1) {
                ganeralData = item
                return false
            } else if (watermarkerKeyArray.indexOf(key) !== -1) {
                if (key === 'overlay') {
                    fontName = value
                }
                watermarkerData = item
                return false
            }
        })
    })
    return { ganeralData, watermarkerData, fontName }
}
const generalKeyArray = ['crop', 'quality', 'radius', 'angle', 'effect', 'format']
const watermarkerKeyArray = ['overlay']
const generalConvert2Font = fileData => {
    let generalFont = _.cloneDeep(fileData)
    if (generalFont.crop === 'fit') {
        generalFont.fitStyle = generalFont.width ? 'width' : 'height'
        generalFont.fitSize = generalFont.width || generalFont.height
    }
    generalFont.sharpen = fileData.effect === 'sharpen'
    generalFont.format = fileData.format || 'original'
    generalFont.quality = fileData.quality || 0
    return generalFont
}
const watermarkerConvert2Font = data => {
    let watermarkerFont = _.cloneDeep(data)
    let dataKeys = Object.keys(data)
    if (dataKeys.length) {
        watermarkerFont.open = true
        if (watermarkerFont.overlay && watermarkerFont.overlay.font) {
            watermarkerFont.type = 'text'
            watermarkerFont.fontStyle.text = watermarkerFont.overlay.text
        } else if (watermarkerFont.overlay && watermarkerFont.overlay.image) {
            watermarkerFont.type = 'img'
        }
    }
    return watermarkerFont
}
</script>

<style lang="less" scoped>
.test-img{
    width:100%;
    max-width:450px;
    margin:15px 0;
    img{
        width:100%;
        height:300px;
        margin-bottom:15px;
        background:#000;
    }
}
.form-label{
    font-size: 12px;
    padding-right:5px;
    line-height:30px;
}
.page-left{
    padding-left:30px;
    .form-item{
        margin-bottom:20px;
    }
    .style-name-info{
        padding:5px 0 0 60px;
        color:#8492a6;
        font-size: 12px;
    }
    .pic-slider{
        display:inline-block;
        width:310px;
        vertical-align:middle;
    }
    .slider-input{
        width: 40px;
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
    width:60px;
    height:32px;
    border:1px solid #d7dde4;
    border-radius:4px;
    padding:4px 7px;
    display:inline-block;
    vertical-align: middle;
    margin-right:10px;
    input{
        width:25px;
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
    .color-trigger{
        width:30px;
        height:30px;
        float:left;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-right:1px solid #d7dde4;
    }
    input{
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
    .color-picker{
        position:absolute;
        top:35px;
        left:-180px;
        z-index:2;
        background: #fff;
        border:1px solid #d7dde4;
        border-radius:4px;
        padding:15px;
    }
}
.red{
    color:red !important;
}
.dis-inline{
    display:inline
}
.upload-box{
    width:500px;
    display:inline-block;
    vertical-align: text-top;
}
</style>
