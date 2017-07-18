<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Breadcrumb>
                <Breadcrumb-item href="/video/template">模版配置</Breadcrumb-item>
                <Breadcrumb-item>新建模版</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <div class="form-item">
                <span class="form-label">模版名称 : </span>
                <Input v-model="template.Name" placeholder="模版名称" class="line-width"></Input>
                <p class="style-name-info redFont" v-if="nameError" >不少于1个字符，不超过20个字符</p>
            </div>
            <div class="form-item">
                <span class="form-label">模版描述 : </span>
                <Input v-model="template.Description" placeholder='输入模版描述文字' type="textarea" :autosize="true" class="line-width"></Input>
                <p class="style-name-info redFont" v-if="descriptionError">不超过100个字符</p>
            </div>
            <div class="form-item">
                <span class="form-label">输出封装格式 : </span>
                <Radio-group v-model="template.Container">
                    <Radio v-for='con in containerList' :key="con" :label='con'>{{con}}</Radio>
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
                    <Radio v-for='codec in videoCodecList' :key="codec.value" :label='codec.value'>{{codec.name}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item" v-if="template.Video.Codec === 'H.264'">
                <span class="form-label">编码Profile : </span>
                <Radio-group v-model="template.Video.CodecOptions.Profile">
                    <Radio v-for='pro in videoProfileList' :key="pro" :label='pro'>{{pro}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item" v-if="template.Video.Codec === 'H.264'">
                <span class="form-label">编码Level : </span>
                <Radio-group v-model="template.Video.CodecOptions.Level">
                    <Radio v-for='level in videoLevelList' :key="level" :label='level'>{{level}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item" v-if="template.Video.Codec === 'H.264' || template.Video.Codec === 'H.265'">
                <span class="form-label">固定关键帧间距 : </span>
                <i-switch v-model="template.Video.FixedGOP">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </i-switch>
                <Input-number :min='1' :max='100000' v-model="template.Video.KeyframesMaxDist" :disabled="!template.Video.FixedGOP"></Input-number> 秒 (1~100000)
            </div>
            <div class="form-item">
                <span class="form-label">码率 : </span>
                <Radio-group v-model="auxiliary.videoBitRate">
                    <Radio label="auto">自适应</Radio>
                    <Radio label="value">自定义</Radio>
                </Radio-group>
                <Input-number :min='1' v-model="auxiliary.videoBitRateValue" :disabled="auxiliary.videoBitRate === 'auto'"></Input-number> Kbps
            </div>
            <div class="form-item">
                <span class="form-label">帧率 : </span>
                <Select v-model="template.Video.FrameRate" class="line-width">
                    <Option v-for="fr in videoFrameRateList" :value="fr.value" :key="fr.value">{{fr.name}}</Option>
                </Select>
            </div>
            <div class="form-item" v-if="template.Video.Codec !== 'auto'">
                <span class="form-label">分辨率 : </span>
                <Radio-group v-model="auxiliary.resolution">
                    <Radio label="auto">不变</Radio>
                    <Radio label="value"></Radio>
                </Radio-group>
                <Input-number :min='1' v-model="auxiliary.width" :disabled="auxiliary.resolution === 'auto'" placeholder="宽度"></Input-number>
                <Input-number :min='1' v-model="auxiliary.height" :disabled="auxiliary.resolution === 'auto'" placeholder="高度"></Input-number>
            </div>
            <div class="form-item" v-if="template.Video.Codec !== 'auto'">
                <span class="form-label">宽高比 : </span>
                <Radio-group v-model="template.Video.AspectRatio">
                    <Radio v-for='asp in aspectRatioList' :key="asp.value" :label='asp.value'>{{asp.name}}</Radio>
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
                    <Radio v-for='codec in audioCodecList' :key="codec.value" :label='codec.value'>{{codec.name}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item" v-if="template.Audio.Codec === 'AAC'">
                <span class="form-label">编码质量 : </span>
                <Radio-group v-model="template.Audio.CodecOptions.Profile">
                    <Radio v-for='pro in audioProfileList' :key="pro.value" :label='pro.value'>{{pro.name}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item">
                <span class="form-label">采样率(HZ) : </span>
                <Radio-group v-model="template.Audio.SampleRate">
                    <Radio v-for='sam in audioSampleRateList' :key="sam" :label='sam'>{{sam}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item">
                <span class="form-label">码率 : </span>
                <Radio-group v-model="auxiliary.audioBitRate">
                    <Radio label="auto">自适应</Radio>
                    <Radio label="value">自定义</Radio>
                </Radio-group>
                <Slider v-model="auxiliary.audioBitRateValue" :min='64' :max='320' :disabled="auxiliary.audioBitRate === 'auto'" class="my-slider" ></Slider>
                <Input-number :min='64' :max='320' v-model="auxiliary.audioBitRateValue" :disabled="auxiliary.audioBitRate === 'auto'"></Input-number>
            </div>
            <div class="form-item">
                <span class="form-label">声道数 : </span>
                <Select v-model="template.Audio.Channels" class="line-width">
                    <Option v-for="ch in audioChannelsList" :value="ch.value" :key="ch.value">{{ch.name}}</Option>
                </Select>
            </div>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <Button class="button-bsc-add-bucket" type="primary" @click="createPreset" :disabled="submitDisabled">保存</Button>
        </div>
    </div>
</template>
<script>
import { transcoder } from '@/service/Aws'
import InputNumber from '@/components/input-number/input-number.vue'
export default {
    data () {
        return {
            template: _.cloneDeep(templateDefult),
            auxiliary: _.cloneDeep(auxiliaryDefult),
            containerList: ['flac', 'flv', 'gif', 'mp3', 'mp4', 'mpg', 'ts'],
            videoCodecList: [{name: '不变', value: 'auto'}, {name: 'gif', value: 'gif'}, {name: 'H.264', value: 'H.264'}, {name: 'H.265', value: 'H.265'}, {name: 'mpeg2', value: 'mpeg2'}],
            videoProfileList: ['baseline', 'main', 'high'],
            videoLevelList: ['1', '1b', '1.1', '1.2', '1.3', '2', '2.1', '2.2', '3', '3.1', '3.2', '4', '4.1'],
            videoFrameRateList: [{name: '不变', value: 'auto'}, {name: '10', value: '10'}, {name: '15', value: '15'}, {name: '23.97', value: '23.97'}, {name: '24', value: '24'}, {name: '25', value: '25'}, {name: '29.97', value: '29.97'}, {name: '30', value: '30'}, {name: '50', value: '50'}, {name: '60', value: '60'}],
            aspectRatioList: [{name: '不变', value: 'auto'}, {name: '1:1', value: '1:1'}, {name: '4:3', value: '4:3'}, {name: '3:2', value: '3:2'}, {name: '16:9', value: '16:9'}],
            audioCodecList: [{name: '不变', value: 'auto'}, {name: 'AAC', value: 'AAC'}, {name: 'flac', value: 'flac'}, {name: 'mp3', value: 'mp3'}, {name: 'mp2', value: 'mp2'}],
            audioProfileList: [{name: '自适应', value: 'auto'}, {name: 'AAC-LC', value: 'AAC-LC'}, {name: 'HE-AAC', value: 'HE-AAC'}, {name: 'HE-AACv2', value: 'HE-AACv2'}],
            audioSampleRateList: ['22050', '32000', '44100', '48000', '96000'],
            audioChannelsList: [{name: '不变', value: 'auto'}, {name: '1', value: '1'}, {name: '2', value: '2'}, {name: '3', value: '3'}, {name: '4', value: '4'}, {name: '5', value: '5'}, {name: '6', value: '6'}, {name: '7', value: '7'}, {name: '8', value: '8'}, {name: '9', value: '9'}, {name: '10', value: '10'}, {name: '11', value: '11'}, {name: '12', value: '12'}, {name: '13', value: '13'}, {name: '14', value: '14'}, {name: '15', value: '15'}, {name: '16', value: '16'}]
        }
    },
    components: { InputNumber },
    computed: {
        templateId () {
            return this.$route.params.id
        },
        nameError () {
            return this.template.Name.length === 0 || (new TextEncoder('utf-8').encode(this.template.Name)).length > 20
        },
        descriptionError () {
            return (new TextEncoder('utf-8').encode(this.template.Description)).length > 100
        },
        submitDisabled () {
            return this.nameError || this.descriptionError
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
                this.$router.push({ name: 'template' })
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
    saved.Video.KeyframesMaxDist = template.Video.KeyframesMaxDist.toString()

    return saved
}

const auxiliaryDefult = {
    videoBitRate: 'auto',
    videoBitRateValue: 1,
    resolution: 'auto',
    width: '',
    height: '',
    audioBitRate: 'auto',
    audioBitRateValue: 64
}

const templateDefult = {
    Name: '',
    Description: '',
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
                width: 250px;
                height: 32px;
                margin-right:8px;
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

