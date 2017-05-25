<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Breadcrumb>
                <Breadcrumb-item href="/">{{$t("STORAGE.TITLE")}}</Breadcrumb-item>
                <Breadcrumb-item>{{$t("STORAGE.PIC_STYLE")}} ({{bucket}})</Breadcrumb-item>
                <Breadcrumb-item>{{$t("STORAGE.CREATE_STYLE")}}</Breadcrumb-item>
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
                            <Input v-model="transformation" :placeholder='$t("STORAGE.STYLE_NAME")' style="width: 350px"></Input>
                            <p class="style-name-info">名称使用数字、字母、小数点、不超过20个字符</p>
                        </div>
                        <div class="form-item">
                            <span class="form-label">{{$t("STORAGE.STYLE_CROP")}} : </span>
                            <Radio-group v-model="crop">
                                <Radio label="noCrop">{{$t("STORAGE.CROP_NONE")}}</Radio>
                                <Radio label="fit">{{$t("STORAGE.CROP_FIT")}}</Radio>
                            </Radio-group>
                        </div>
                        <div class="form-item">
                            <span class="form-label">{{$t("STORAGE.STYLE_EFFECT")}} : </span>
                            <Checkbox v-model="sharpen">{{$t("STORAGE.STYLE_SHARPEN")}}</Checkbox>
                        </div>
                        <div class="form-item">
                            <span class="form-label">{{$t("STORAGE.STYLE_QUALITY")}} : </span>
                            <Slider class="pic-slider" v-model="quality"></Slider>
                            <Input v-model="quality" class="slider-input"></Input>
                        </div>
                        <div class="form-item">
                            <span class="form-label">{{$t("STORAGE.STYLE_FORMAT")}} : </span>
                            <Select v-model="format" style="width:400px">
                                <Option v-for="item in formatList" :value="item" :key="item">{{ item }}</Option>
                            </Select>
                        </div>
                        <div class="separator-line"></div>
                        <div class="form-item">
                            <span class="form-label">{{$t("STORAGE.STYLE_WATERMARKER")}} : </span>
                            <i-switch v-model="watermark" size="large">
                                <span slot="open">ON</span>
                                <span slot="close">OFF</span>
                            </i-switch>
                        </div>
                        <div v-if="watermark">
                            <div class="form-item">
                                <span class="form-label">{{$t("STORAGE.WATERMARKER_TYPE")}} : </span>
                                <Radio-group v-model="watermarkerType">
                                    <Radio label="text">{{$t("STORAGE.TEXT_WATERMARKER")}}</Radio>
                                    <Radio label="img">{{$t("STORAGE.IMG_WATERMARKER")}}</Radio>
                                </Radio-group>
                            </div>
                            <div v-if="watermarkerType == 'text'" class="clearfix">
                                <div class="form-item">
                                    <span class="form-label">{{$t("STORAGE.TEXT_CONTENT")}} : </span>
                                    <Input v-model="overlay" :placeholder='$t("STORAGE.TEXT_CONTENT")' style="width: 400px"></Input>
                                </div>
                                <!--<div class="form-item font-styles clearfix">-->
                                    <span class="form-label">{{$t("STORAGE.TEXT_STYLE")}} : </span>
                                    <Select v-model="font_family" style="width:135px;margin-right:10px;">
                                        <Option v-for="item in fontList" :value="item" :key="item">{{ item }}</Option>
                                    </Select>
                                    <div class="input-text-box">
                                        <input type='text' v-model="font_size">
                                        <span>px</span>
                                    </div>
                                    <div class="color-box">
                                        <div class="color-trigger" :style="{background: font_color.hex}" @click="fontSizeColorPicker=!fontSizeColorPicker"></div>
                                        <input type='text' v-model="font_color.hex">
                                        <slider-picker class="color-picker" v-if="fontSizeColorPicker" v-model="font_color" />
                                    </div>
                                    <br>
                                <!--</div>-->
                                <!--<div class="form-item font-styles clearfix" style="padding-left:60px;">-->
                                    <div class="stroke">
                                        <Checkbox v-model="stroke">{{$t("STORAGE.STROKE")}}</Checkbox>
                                    </div>
                                    <div class="input-text-box">
                                        <input type='text' v-model="stroke_size">
                                        <span>px</span>
                                    </div>
                                    <div class="color-box">
                                        <div class="color-trigger" :style="{background: font_color.hex}" @click="fontSizeColorPicker=!fontSizeColorPicker"></div>
                                        <input type='text' v-model="font_color.hex">
                                        <slider-picker class="color-picker" v-if="fontSizeColorPicker" v-model="font_color" />
                                    </div>
                                <!--</div>-->
                                <div class="form-item">
                                    <span class="form-label">{{$t("STORAGE.WATERMARKER_POSITION")}} : </span>
                                    <div class="gravity-selector">
                                        <input type="radio" value="north_west" v-model="watermarkGravity"></Radio>
                                        <input type="radio" value="north" v-model="watermarkGravity"></Radio>
                                        <input type="radio" value="north_east" v-model="watermarkGravity"></Radio>
                                        <input type="radio" value="west" v-model="watermarkGravity"></Radio>
                                        <input type="radio" value="center" v-model="watermarkGravity"></Radio>
                                        <input type="radio" value="east" v-model="watermarkGravity"></Radio>
                                        <input type="radio" value="south_west" v-model="watermarkGravity"></Radio>
                                        <input type="radio" value="south" v-model="watermarkGravity"></Radio>
                                        <input type="radio" value="south_east" v-model="watermarkGravity"></Radio>
                                    </div>
                                    <div class="padding-setting">
                                        <div class="form-item">
                                            <span class="form-label">{{$t("STORAGE.PADDING_LEFT")}} : </span>
                                            <div class="input-text-box">
                                                <input type='text' v-model="paddingLeft">
                                                <span>px</span>
                                            </div>
                                        </div>
                                        <div class="form-item">
                                            <span class="form-label">{{$t("STORAGE.PADDING_TOP")}} : </span>
                                            <div class="input-text-box">
                                                <input type='text' v-model="paddingTop">
                                                <span>px</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-item">
                                    <span class="form-label">{{$t("STORAGE.OPACITY")}} : </span>
                                    <Slider class="pic-slider" v-model="opacity"></Slider>
                                    <Input v-model="opacity" class="slider-input"></Input>
                                </div>
                            </div>
                            <div v-if="watermarkerType == 'img'">
                                <div class="form-item">
                                    
                                    <span class="form-label">{{$t("STORAGE.WATERMARKER_")}} : </span>
                                    
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Tab-pane>
            <Tab-pane :label='$t("STORAGE.ADV_EDIT")'>
            </Tab-pane>
        </Tabs>
    </div>
</template>
<script>
import {Slider, Compact, Photoshop, Swatches} from 'vue-color'
export default {
    data () {
        return {
            transformation: this.transformation,
            crop: 'noCrop',
            sharpen: false,
            quality: 20,
            format: 'original',
            formatList: ['original', 'png', 'webp', 'jpeg', 'jpg'],
            watermark: false,
            watermarkerType: 'text',
            fontList: ['宋体', '黑体', '楷体', '隶书', '幼园', '仿宋', 'Arial', 'Georgia', 'Helvetica', 'Times-new-roman'],
            font_family: '宋体',
            font_size: 16,
            overlay: '',
            stroke: false,
            stroke_size: 2,
            watermarkGravity: 'north_west',
            paddingLeft: 10,
            paddingTop: 10,
            opacity: 90,
            colors: defaultProps,
            font_color: defaultProps,
            fontSizeColorPicker: true
        }
    },
    components: { 'photoshop-picker': Photoshop, 'slider-picker': Slider, 'compact-picker': Compact, 'swatches-picker': Swatches },
    computed: {
        bucket () {
            return this.$route.params.bucket
        }
    },
    mounted () {
    },
    methods: {},
    watch: {
        // the contents array need refresh when the $route value changed
        '$route' (to, from) {
            to.path !== from.path && this.getData()
        }
    }
}
const defaultProps = {
    hex: '#194d33',
    hsl: {
        h: 150,
        s: 0.5,
        l: 0.2,
        a: 1
    },
    hsv: {
        h: 150,
        s: 0.66,
        v: 0.30,
        a: 1
    },
    rgba: {
        r: 25,
        g: 77,
        b: 51,
        a: 1
    },
    a: 1
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
        width:350px;
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
        left:0;
        z-index:2;
        background: #fff;
        border:1px solid #d7dde4;
        border-radius:4px;
        padding:15px;
    }
}
</style>
