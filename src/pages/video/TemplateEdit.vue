<template>
    <div class="bsc-template-edit bsc-edit">
        <div class="layout-bsc-toolbar">
            <Breadcrumb>
                <Breadcrumb-item href="/video/template">{{$t('VIDEO.TEMPLATE_CONFIGURATION')}}</Breadcrumb-item>
                <Breadcrumb-item>{{$t('VIDEO.NEW_TEMPLATE')}}</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <div class="form-item">
                <span class="form-label required-item">{{$t('VIDEO.TEMPLATE_NAME')}} : </span>
                <Input v-model="template.Name" :placeholder='$t("VIDEO.TEMPLATE_NAME")' class="line-width"></Input>
                <p class="style-name-info redFont" v-if="nameError" >{{$t('VIDEO.TEMPLATE_NAME_CHAR_NUMBER')}}</p>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.TEMPLATE_DESCRIPTION')}} : </span>
                <Input v-model="template.Description" :placeholder='$t("VIDEO.ENTER_THE_TEMPLATE_DESCRIPTION_TEXT")' type="textarea" :autosize="true" class="line-width"></Input>
                <p class="style-name-info redFont" v-if="descriptionError">{{$t('VIDEO.TEMPLATE_DESCRIPTION_CHAR_NUMBER')}}</p>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.PACKAGE_FORMAT')}} : </span>
                <Radio-group v-model="template.Container" @on-change="containerChange">
                    <Radio v-for='con in containerList' :key="con" :label='con'>{{con}}</Radio>
                </Radio-group>
            </div>
             <div class="form-item" v-if="template.Container === 'mp4'" >
                <span class="form-label">FastStart : </span>
                <i-switch v-model="template.FastStart">
                    <span slot="open">{{$t('VIDEO.ON')}}</span>
                    <span slot="close">{{$t('VIDEO.OFF')}}</span>
                </i-switch>
            </div> 
        </div>
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
                    <Radio :disabled="videoDisabled" v-for='codec in videoCodecList' v-if="codec.container.includes(template.Container)" :key="codec.value" :label='codec.value'>{{codec.name}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item" v-if="template.Video.Codec === 'H.264'">
                <span class="form-label">{{$t('VIDEO.CODING_PROFILE')}} : </span>
                <Radio-group v-model="template.Video.CodecOptions.Profile">
                    <Radio v-for='pro in videoProfileList' :key="pro" :label='pro'>{{pro}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item" v-if="template.Video.Codec === 'H.264'">
                <span class="form-label">{{$t('VIDEO.CODING_LEVEL')}} : </span>
                <Radio-group v-model="template.Video.CodecOptions.Level">
                    <Radio v-for='level in videoLevelList' :key="level" :label='level'>{{level}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item" v-if="template.Video.Codec === 'H.264' || template.Video.Codec === 'H.265'">
                <span class="form-label">{{$t('VIDEO.FIXED_KEY_FRAME_SPACING')}} : </span>
                <i-switch v-model="template.Video.FixedGOP">
                    <span slot="open">{{$t('VIDEO.ON')}}</span>
                    <span slot="close">{{$t('VIDEO.OFF')}}</span>
                </i-switch>
                <Input-number :min='1' :max='100000' v-model="template.Video.KeyframesMaxDist" :disabled="!template.Video.FixedGOP"></Input-number> {{$t('VIDEO.SECOND')}} (1~100000)
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.BIT_RATE')}} : </span>
                <Radio-group v-model="auxiliary.videoBitRate">
                    <Radio label="auto" :disabled="videoDisabled">{{$t('VIDEO.ADAPTIVE')}}</Radio>
                    <Radio label="value" :disabled="videoDisabled">{{$t('VIDEO.USER_DEFINED')}}</Radio>
                </Radio-group>
                <Input-number :min='1' v-model="auxiliary.videoBitRateValue" :disabled="auxiliary.videoBitRate === 'auto'"></Input-number> Kbps
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.FRAME_RATE')}} : </span>
                <Select v-model="template.Video.FrameRate" :disabled="videoDisabled" class="line-width">
                    <Option v-for="fr in videoFrameRateList" :value="fr.value" :key="fr.value">{{fr.name}}</Option>
                </Select>
            </div>
            <div class="form-item" v-if="template.Video.Codec !== 'auto'">
                <span class="form-label">{{$t('VIDEO.RESOLUTION')}} : </span>
                <Radio-group v-model="auxiliary.resolution">
                    <Radio label="auto">{{$t('VIDEO.UNALTERED')}}</Radio>
                    <Radio label="value">{{$t('VIDEO.USER_DEFINED')}}</Radio>
                </Radio-group>
                <Input-number :min='1' v-model="auxiliary.width" :disabled="auxiliary.resolution === 'auto'" :placeholder='$t("VIDEO.WIDTH")'></Input-number>
                <Input-number :min='1' v-model="auxiliary.height" :disabled="auxiliary.resolution === 'auto'" :placeholder='$t("VIDEO.HEIGHT")'></Input-number>
            </div>
            <div class="form-item" v-if="template.Video.Codec !== 'auto'">
                <span class="form-label">{{$t('VIDEO.ASPECT_RATIO')}} : </span>
                <Radio-group v-model="template.Video.AspectRatio">
                    <Radio v-for='asp in aspectRatioList' :key="asp.value" :label='asp.value'>{{asp.name}}</Radio>
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
                    <Radio v-for='codec in audioCodecList' v-if="codec.container.includes(template.Container)" :key="codec.value" :label='codec.value'>{{codec.name}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item" v-if="template.Audio.Codec === 'AAC'">
                <span class="form-label">{{$t('VIDEO.CODING_QUALITY')}} : </span>
                <Radio-group v-model="template.Audio.CodecOptions.Profile">
                    <Radio v-for='pro in audioProfileList' :key="pro.value" :label='pro.value'>{{pro.name}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.SAMPLE_RATE')}}(HZ) : </span>
                <Radio-group v-model="template.Audio.SampleRate">
                    <Radio v-for='sam in audioSampleRateList' :key="sam.value" :label='sam.value'>{{sam.name}}</Radio>
                </Radio-group>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.BIT_RATE')}} : </span>
                <Radio-group v-model="auxiliary.audioBitRate">
                    <Radio label="auto">{{$t('VIDEO.ADAPTIVE')}}</Radio>
                    <Radio label="value">{{$t('VIDEO.USER_DEFINED')}}</Radio>
                </Radio-group>
                <Slider v-model="auxiliary.audioBitRateValue" :min='64' :max='320' :disabled="auxiliary.audioBitRate === 'auto'" class="my-slider" ></Slider>
                <Input-number :min='64' :max='320' v-model="auxiliary.audioBitRateValue" :disabled="auxiliary.audioBitRate === 'auto'"></Input-number>
            </div>
            <div class="form-item">
                <span class="form-label">{{$t('VIDEO.CHANNELS')}} : </span>
                <Select v-model="template.Audio.Channels" class="line-width">
                    <Option v-for="ch in audioChannelsList" :value="ch.value" :key="ch.value">{{ch.name}}</Option>
                </Select>
            </div>
        </div>
        <div class="separator-line"></div>
        <div class="editBlock">
            <Button class="button-bsc-add-bucket" type="primary" @click="createPreset">{{$t('VIDEO.SAVE')}}</Button>
        </div>
    </div>
</template>
<script>
import { transcoder } from '@/service/Aws'
import InputNumber from '@/components/input-number/input-number.vue'
export default {
    data () {
        return {
            videoDisabled: false,
            template: _.cloneDeep(templateDefult),
            auxiliary: _.cloneDeep(auxiliaryDefult),
            containerList: ['flac', 'flv', 'gif', 'mp3', 'mp4', 'mpg', 'ts'],
            videoCodecList: [{name: this.$t('VIDEO.UNALTERED'), value: 'auto', container: ['flac', 'flv', 'gif', 'mp3', 'mp4', 'mpg', 'ts']}, {name: 'gif', value: 'gif', container: ['gif']}, {name: 'H.264', value: 'H.264', container: ['flv', 'mp4', 'ts']}, {name: 'H.265', value: 'H.265', container: ['flv', 'mp4', 'ts']}, {name: 'mpeg2', value: 'mpeg2', container: ['mpg']}],
            videoProfileList: ['baseline', 'main', 'high'],
            videoLevelList: ['1', '1b', '1.1', '1.2', '1.3', '2', '2.1', '2.2', '3', '3.1', '3.2', '4', '4.1'],
            videoFrameRateList: [{name: this.$t('VIDEO.UNALTERED'), value: 'auto'}, {name: '10', value: '10'}, {name: '15', value: '15'}, {name: '23.97', value: '23.97'}, {name: '24', value: '24'}, {name: '25', value: '25'}, {name: '29.97', value: '29.97'}, {name: '30', value: '30'}, {name: '50', value: '50'}, {name: '60', value: '60'}],
            aspectRatioList: [{name: this.$t('VIDEO.UNALTERED'), value: 'auto'}, {name: '1:1', value: '1:1'}, {name: '4:3', value: '4:3'}, {name: '3:2', value: '3:2'}, {name: '16:9', value: '16:9'}],
            audioCodecList: [{name: this.$t('VIDEO.UNALTERED'), value: 'auto', container: ['flac', 'flv', 'gif', 'mp3', 'mp4', 'mpg', 'ts']}, {name: 'AAC', value: 'AAC', container: ['flac', 'mp4', 'ts']}, {name: 'mp3', value: 'mp3', container: ['flv', 'mp4', 'ts']}, {name: 'mp2', value: 'mp2', container: ['mpg']}],
            audioProfileList: [{name: this.$t('VIDEO.ADAPTIVE'), value: 'auto'}, {name: 'AAC-LC', value: 'AAC-LC'}, {name: 'HE-AAC', value: 'HE-AAC'}, {name: 'HE-AACv2', value: 'HE-AACv2'}],
            audioSampleRateList: [{name: this.$t('VIDEO.UNALTERED'), value: 'auto'}, {name: '22050', value: '22050'}, {name: '32000', value: '32000'}, {name: '44100', value: '44100'}, {name: '48000', value: '48000'}, {name: '96000', value: '96000'}],
            audioChannelsList: [{name: this.$t('VIDEO.UNALTERED'), value: 'auto'}, {name: '1', value: '1'}, {name: '2', value: '2'}, {name: '3', value: '3'}, {name: '4', value: '4'}, {name: '5', value: '5'}, {name: '6', value: '6'}, {name: '7', value: '7'}, {name: '8', value: '8'}, {name: '9', value: '9'}, {name: '10', value: '10'}, {name: '11', value: '11'}, {name: '12', value: '12'}, {name: '13', value: '13'}, {name: '14', value: '14'}, {name: '15', value: '15'}, {name: '16', value: '16'}]
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
        }
    },
    created () {
        this.readPreset()
    },
    methods: {
        async createPreset () {
            if (this.nameError) {
                this.$Message.warning(this.$t('VIDEO.TEMPLATE_NAME_WARING'))
                return
            } else if (this.descriptionError) {
                this.$Message.warning(this.$t('VIDEO.TEMPLATE_DESCRIPTION_WARING'))
                return
            }
            let template = convert2Save(this.template, this.auxiliary)
            try {
                this.$Loading.start()
                await this.$http.post('http://transcoder-ss.bscstorage.com/2012-09-25/presets', template)
                this.$Loading.finish()
                this.$Message.success(this.$t('VIDEO.CREATED_SUCCESSFULLY'))
                this.$router.push({ name: 'template' })
            } catch (error) {
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
                    this.$Loading.error()
                }
            }
        },
        containerChange (value) {
            if (audioOnly.includes(value)) {
                this.template.Video.Codec = 'auto'
                this.auxiliary.videoBitRate = 'auto'
                this.template.Video.FrameRate = 'auto'
                this.videoDisabled = true
            } else if (this.videoDisabled) {
                this.videoDisabled = false
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
    FastStart: false,
    Container: 'mp4',
    Audio: {
        Codec: 'auto',
        CodecOptions: {
            Profile: 'auto'
        },
        SampleRate: 'auto',
        BitRate: '64',
        Channels: 'auto'
    },
    Video: {
        Codec: 'auto',
        CodecOptions: {
            Profile: 'baseline',
            Level: '1'
        },
        KeyframesMaxDist: '1',
        FixedGOP: false,
        BitRate: '64',
        FrameRate: 'auto',
        Resolution: 'auto',
        AspectRatio: 'auto'
    }
}

const audioOnly = ['flac', 'mp3']
</script>

<style lang="less" scoped>
@import '../../styles/index.less';

@edit-styles-border-color: #d7dde4;
@edit-output-item-span: 115px;

.@{css-prefix}template-edit {
    .editBlock {
        .form-item {
            .style-name-info {
                padding: 5px 0 0 @edit-output-item-span;
                .sc(12px,#8492a6);
            }
        }
        .form-label {
            width: @edit-output-item-span !important;
        }
    }
}
</style>

