<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Breadcrumb>
                <Breadcrumb-item href="/video">视频处理</Breadcrumb-item>
                <Breadcrumb-item href="/video">模版配置</Breadcrumb-item>
                <Breadcrumb-item>新建模版</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <div class="form-item">
                <span class="form-label">模版名称 : </span>
                <Input v-model="template.Name" placeholder="模版名称" class="line-width"></Input>
                <p class="style-name-info" :class="{'redFont':nameError}">不超过128个字符</p>
            </div>
            <div class="form-item">
                <span class="form-label">模版描述 : </span>
                <Input v-model="template.Description" placeholder='输入模版描述文字' type="textarea" :autosize="true" class="line-width"></Input>
            </div>
            <div class="form-item">
                <span class="form-label">输出封装格式 : </span>
                <Radio-group v-model="template.Container">
                    <Radio v-for='con in containerList' :label='con'>{{con}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item" v-if="template.Container === 'mp4'" >
                <span class="form-label">FastStart : </span>
                <i-switch v-model="template.FastStart">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </i-switch>
            </div>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <div class="section-separator">
                <span class="separator-icon"></span>
                <span class="separator-info">视频参数配置</span>
            </div>
            <div class="form-item">
                <span class="form-label">编码方式 : </span>
                <Radio-group v-model="template.Video.Codec">
                    <Radio v-for='codec in videoCodecList' :label='codec'>{{codec}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item" v-if="template.Video.Codec === 'H.264'">
                <span class="form-label">编码Profile : </span>
                <Radio-group v-model="template.Video.CodecOptions.Profile">
                    <Radio v-for='pro in videoProfileList' :label='pro'>{{pro}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item" v-if="template.Video.Codec === 'H.264'">
                <span class="form-label">编码Level : </span>
                <Radio-group v-model="template.Video.CodecOptions.Level">
                    <Radio v-for='level in videoLevelList' :label='level'>{{level}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item" v-if="template.Video.Codec === 'H.264' || template.Video.Codec === 'H.265'">
                <span class="form-label">固定关键帧间距 : </span>
                <i-switch v-model="template.Video.FixedGOP">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </i-switch>
                <Input v-model="template.Video.KeyframesMaxDist" style="width: 60px"></Input> S
                <span :class="{'redFont':KeyframesError}">(1~100000)</span>
            </div>
            <div class="form-item">
                <span class="form-label">码率 : </span>
                <Radio-group v-model="auxiliary.videoBitRate">
                    <Radio label="auto">自适应</Radio>
                    <Radio label="value"></Radio>
                </Radio-group>
                <Input v-model="auxiliary.videoBitRateValue" :disabled="auxiliary.videoBitRate === 'auto'" style="width: 60px"></Input> Kbps
                <span v-if="videoBitError" class="redFont">请输入正整数</span>
            </div>
            <div class="form-item">
                <span class="form-label">帧率 : </span>
                <Select v-model="template.Video.FrameRate" class="line-width">
                    <Option v-for="fr in videoFrameRateList" :value="fr" :key="fr">{{fr}}</Option>
                </Select>
            </div>
            <div class="form-item" v-if="template.Video.Codec !== 'auto'">
                <span class="form-label">分辨率 : </span>
                <Radio-group v-model="auxiliary.resolution">
                    <Radio label="auto">不变</Radio>
                    <Radio label="value"></Radio>
                </Radio-group>
                <Input v-model="auxiliary.width" :disabled="auxiliary.resolution === 'auto' "placeholder="宽度" style="width: 60px"></Input>
                <Input v-model="auxiliary.height" :disabled="auxiliary.resolution === 'auto' "placeholder="高度"style="width: 60px"></Input>
                <span v-if="videoResolutionError" class="redFont">请输入正整数</span>
            </div>
            <div class="form-item" v-if="template.Video.Codec !== 'auto'">
                <span class="form-label">宽高比 : </span>
                <Radio-group v-model="template.Video.AspectRatio">
                    <Radio v-for='asp in aspectRatioLkist' :label='asp'>{{asp}}</Radio>
                </Radio-group>
            </div>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <div class="section-separator">
                <span class="separator-icon"></span>
                <span class="separator-info">音频参数配置</span>
            </div>
            <div class="form-item">
                <span class="form-label">编码方式 : </span>
                <Radio-group v-model="template.Audio.Codec">
                    <Radio v-for='codec in audioCodecList' :label='codec'>{{codec}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item" v-if="template.Audio.Codec !== 'AAC'">
                <span class="form-label">编码质量 : </span>
                <Radio-group v-model="template.Audio.CodecOptions.Profile">
                    <Radio v-for='pro in audioProfileList' :label='pro'>{{pro}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item">
                <span class="form-label">采样率(HZ) : </span>
                <Radio-group v-model="template.Audio.SampleRate">
                    <Radio v-for='sam in audioSampleRateList' :label='sam'>{{sam}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item">
                <span class="form-label">码率 : </span>
                <Radio-group v-model="auxiliary.audioBitRate">
                    <Radio label="auto">自适应</Radio>
                    <Radio label="value"></Radio>
                </Radio-group>
                <Slider v-model="auxiliary.audioBitRateValue" :min='64' :max='320' :disabled="auxiliary.audioBitRate === 'auto'" class="my-slider" show-input ></Slider>
            </div>
            <div class="form-item">
                <span class="form-label">声道数 : </span>
                <Select v-model="template.Audio.Channels" class="line-width">
                    <Option v-for="ch in audioChannelsList" :value="ch" :key="ch">{{ch}}</Option>
                </Select>
            </div>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <Button class="button-bsc-add-bucket" type="primary" @click="createPreset">保存</Button>
        </div>
    </div>
</template>
<script>
import { transcoder } from '@/service/Aws'
export default {
    data () {
        return {
            template: _.cloneDeep(templateDefult),
            auxiliary: _.cloneDeep(auxiliaryDefult),
            containerList: ['flac', 'flv', 'gif', 'mp3', 'mp4', 'mpg', 'ts'],
            videoCodecList: ['auto', 'gif', 'H.264', 'H.265', 'mpeg2'],
            videoProfileList: ['baseline', 'main', 'high'],
            videoLevelList: ['1', '1b', '1.1', '1.2', '1.3', '2', '2.1', '2.2', '2.3', '3', '3.1', '3.2', '4', '4.1'],
            videoFrameRateList: ['auto', '10', '15', '23.97', '24', '25', '29.97', '30', '50', '60'],
            aspectRatioLkist: ['auto', '1:1', '4:3', '3:2', '16:9'],
            audioCodecList: ['auto', 'AAC', 'flac', 'mp2', 'mp3', 'vorbis', 'speex'],
            audioProfileList: ['auto', 'AAC-LC', 'HE-AAC', 'HE-AACv2'],
            audioSampleRateList: ['22050', '32000', '44100', '48000', '96000'],
            audioChannelsList: ['auto', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16']
        }
    },
    computed: {
        templateId () {
            return this.$route.params.id
        },
        nameError () {
            return this.template.Name.length > 20
        },
        KeyframesError () {
            let frames = Number(this.template.Video.KeyframesMaxDist)
            return this.template.Video.FixedGOP && (nonPositiveInt(frames) || frames > 100000)
        },
        videoBitError () {
            return this.auxiliary.videoBitRate === 'value' && nonPositiveInt(this.auxiliary.videoBitRateValue)
        },
        videoResolutionError () {
            return this.auxiliary.resolution === 'value' && (nonPositiveInt(this.auxiliary.width) || nonPositiveInt(this.auxiliary.height))
        },
        submitDisabled () {
            return this.nameError || this.KeyframesError || this.videoBitError || this.videoResolutionError
        }
    },
    mounted () {
        this.readPreset()
    },
    methods: {
        async createPreset () {
            let template = convert2Save(this.template, this.auxiliary)
            try {
                this.$Loading.start()
                await transcoder('createPreset', template)
                this.$Loading.finish()
                this.$Message.success('创建成功')
            } catch (error) {
                this.$Message.error(error)
                this.$Loading.error()
            }
        },
        async readPreset () {
            if (this.templateId !== 'none') {
                try {
                    this.$Loading.start()
                    await transcoder('readPreset', {Id: '153'})
                    this.$Loading.finish()
                } catch (error) {
                    this.$Message.error(error)
                    this.$Loading.error()
                }
            }
        }
    }
}

const convert2Save = (template, auxiliary) => {
    let saved = _.cloneDeep(template)

    if (auxiliary.videoBitRate !== 'auto') {
        saved.Video.BitRate = auxiliary.videoBitRateValue.toString()
    } else {
        saved.Video.BitRate = auxiliary.videoBitRate
    }

    if (auxiliary.resolution !== 'auto') {
        saved.Video.Resolution = `${auxiliary.width}*${auxiliary.height}`
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

    return saved
}

const nonPositiveInt = value => {
    let num = Number(value)
    return !num || num !== parseInt(num) || num < 1
}
const auxiliaryDefult = {
    videoBitRate: 'auto',
    videoBitRateValue: '',
    resolution: 'auto',
    width: '',
    height: '',
    audioBitRate: 'auto',
    audioBitRateValue: 64
}

const templateDefult = {
    Name: '模板名称',
    Description: '模板描述',
    FastStart: true,
    Container: 'mp4',
    Audio: {
        Codec: 'AAC',
        CodecOptions: {
            Profile: 'auto'
        },
        SampleRate: '22050',
        BitRate: '64',
        Channels: 'auto'
    },
    Video: {
        Codec: 'H.264',
        CodecOptions: {
            Profile: 'baseline',
            Level: '1'
        },
        KeyframesMaxDist: '1',
        FixedGOP: true,
        BitRate: '64',
        FrameRate: '23.97',
        Resolution: 'auto',
        AspectRatio: '1:1'
    }
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';

@edit-styles-border-color: #d7dde4;

.editBlock {
    margin: 20px 0 10px;
    .form-item {
            margin-bottom: 20px;

            .form-label {
                display: inline-block;
                width: 115px;
                font-size: 14px;
                padding-right: 5px;
                line-height: 30px;
                text-align: right;
            }

            .line-width {
                width: 475px;
            }

            .style-name-info {
                padding: 5px 0 0 120px;
                .sc(12px,#8492a6);
            }

            .my-slider {
                display: inline-block;
                vertical-align: middle;
                width: 400px;
                height: 32px;
            }

            .input-box-label{
                padding: 0 5px;
                .sc(14px,#8492a6);
                line-height: 30px;
            }

            .redFont {
                color: red !important;
            }

            .dis-inline {
                display: inline
            }

            .pullRight{
                float: right;
            }
        }
    
}

.separator-line {
    border-bottom: 1px solid @edit-styles-border-color;
}
</style>

