<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Button class="button-bsc-add-bucket" type="primary" @click="goTemplateEdit">新建模版</Button>
        </div>
        <Table border :context="self" :stripe="true" :highlight-row="true" :columns="listHeader" :data="templateList" :no-data-text='$t("STORAGE.NO_LIST")'></Table>
    </div>
</template>
<script>
import { transcoder } from '@/service/Aws'
export default {
    data () {
        return {
            iconSize: 18,
            self: this,
            templateList: this.templateList,
            videoNames: {Codec: '编码方式', Profile: '编码Profile', Level: '编码Level', KeyframesMaxDist: '固定关键帧间距', BitRate: '码率', FrameRate: '帧率', Resolution: '分辨率', AspectRatio: '宽高比'},
            audioNames: {Codec: '编码方式', Profile: '编码质量', SampleRate: '采样率', BitRate: '码率', Channels: '声道数'},
            listHeader: [{
                title: 'ID',
                key: 'id',
                width: 100
            }, {
                title: 'Name',
                width: 100,
                render: (h, params) => {
                    return h('Poptip', {
                        props: {
                            placement: 'right',
                            trigger: 'hover'
                        }
                    }, [h('div', [params.row.name, h('Icon', {
                        type: 'ios-information-outline',
                        size: '14'
                    })]), h('div', {
                        class: 'api',
                        slot: 'content'
                    }, params.row.description)])
                }
            }, {
                title: 'Container',
                width: 90,
                key: 'container'
            }, {
                title: 'Video',
                width: 140,
                render: (h, params) => {
                    return h('Poptip', {
                        props: {
                            placement: 'right',
                            trigger: 'hover'
                        }
                    }, [h('div', params.row.video.map(item => h('p', `${item.name}:${item.value}`))),
                        h('div', {
                            class: 'api',
                            slot: 'content'
                        }, params.row.videoDetails.map(item => h('p', `${item.name}:${item.value}`)))]
                    )
                }
            }, {
                title: 'Audio',
                width: 140,
                render: (h, params) => {
                    return h('Poptip', {
                        props: {
                            placement: 'right',
                            trigger: 'hover'
                        }
                    }, [h('div', params.row.audio.map(item => h('p', `${item.name}:${item.value}`))),
                        h('div', {
                            class: 'api',
                            slot: 'content'
                        }, params.row.audioDetails.map(item => h('p', `${item.name}:${item.value}`)))]
                    )
                }
            }, {
                title: 'Actions',
                key: 'actions',
                width: 60,
                align: 'right',
                render: (h, params) => {
                    return h('Tooltip', {
                        props: {
                            content: this.$t('PUBLIC.DELETE'),
                            delay: 1000,
                            placement: 'top'
                        }
                    }, [h('i-button', {
                        props: {
                            size: 'small'
                        },
                        on: {
                            click: () => {
                                this.deletePresetConfirm(params.row)
                            }
                        }
                    }, [h('Icon', {
                        props: {
                            type: 'ios-trash',
                            size: this.iconSize
                        }
                    })])])
                }
            }]
        }
    },
    mounted () {
        this.listPresets()
    },
    methods: {
        async createPreset () {
            try {
                this.$Loading.start()
                let res = await transcoder('createPreset', transcoderData)
                this.$Loading.finish()
                console.log('res', res)
            } catch (error) {
                console.log(error)
                this.$Message.error(error)
                this.$Loading.error()
            }
        },
        async listPresets () {
            try {
                this.$Loading.start()
                let res = await transcoder('listPresets')
                this.templateList = await this.convert2Front(res.Presets)
                this.$Loading.finish()
            } catch (error) {
                console.log(error)
                this.$Message.error(error)
                this.$Loading.error()
            }
        },
        goTemplateEdit () {
            this.$router.push({ name: 'TemplateEdit', params: { id: 'none' } })
        },
        async readPreset () {
            try {
                this.$Loading.start()
                await transcoder('readPreset', {Id: '153'})
                this.$Loading.finish()
            } catch (error) {
                this.$Message.error(error)
                this.$Loading.error()
            }
        },
        async deletePreset (rule) {
            try {
                this.$Loading.start()
                await transcoder('deletePreset', {Id: rule.id})
                this.templateList.splice(rule._index, 1)
                this.$Loading.finish()
                this.$Message.success('删除成功')
            } catch (error) {
                this.$Message.error('删除失败！')
                this.$Message.error(error)
                this.$Loading.error()
            }
        },
        convert2Front (data) {
            let frontList = []
            data.forEach(item => {
                const video = item.Video
                const audio = item.Audio
                const frontItem = {
                    id: item.Id,
                    description: item.Description,
                    name: item.Name,
                    container: item.Container,
                    video: [],
                    audio: [],
                    videoDetails: [],
                    audioDetails: []
                }
                _.forEach(video, (value, key) => {
                    if (key === 'FixedGOP') {
                    } else if (key === 'CodecOptions') {
                        _.forEach(value, (value, key) => {
                            frontItem.videoDetails.push({name: this.videoNames[key], value: value})
                        })
                    } else if (videoMust.includes(key)) {
                        frontItem.video.push({name: this.videoNames[key], value: value})
                        frontItem.videoDetails.push({name: this.videoNames[key], value: value})
                    } else {
                        frontItem.videoDetails.push({name: this.videoNames[key], value: value})
                    }
                })
                _.forEach(audio, (value, key) => {
                    if (key === 'CodecOptions') {
                        _.forEach(value, (value, key) => {
                            frontItem.audioDetails.push({name: this.audioNames[key], value: value})
                        })
                    } else if (audioMust.includes(key)) {
                        frontItem.audio.push({name: this.audioNames[key], value: value})
                        frontItem.audioDetails.push({name: this.audioNames[key], value: value})
                    } else {
                        frontItem.audioDetails.push({name: this.audioNames[key], value: value})
                    }
                })
                if (audio.CodecOptions && audio.CodecOptions.Profile) {
                    frontItem.audio.profile = {
                        name: '编码质量',
                        value: audio.CodecOptions.Profile
                    }
                }
                frontList.push(frontItem)
            })
            return frontList
        },
        deletePresetConfirm (rule) {
            this.$Modal.confirm({
                content: this.$t('STORAGE.DELETE_CONFIRMED', {fileName: rule.name}),
                okText: this.$t('PUBLIC.CONFIRMED'),
                cancelText: this.$t('PUBLIC.CANCLE'),
                onOk: () => this.deletePreset(rule)
            })
        }
    }
}
const videoMust = ['Codec', 'FrameRate', 'Resolution', 'BitRate', 'AspectRatio']
const audioMust = ['Codec', 'SampleRate', 'Channels', 'BitRate']

const transcoderData = {
    Name: '模板名称',
    Description: '模板描述',
    FastStart: 'true',
    Container: 'mp4',
    Audio: {
        Codec: 'AAC',
        CodecOptions: {
            Profile: 'auto'
        },
        SampleRate: '22050',
        BitRate: '64',
        Channels: '0'
    },
    Video: {
        Codec: 'H.264',
        CodecOptions: {
            Profile: 'baseline',
            Level: '1'
        },
        KeyframesMaxDist: '1',
        FixedGOP: 'true',
        BitRate: '64',
        FrameRate: '23.97',
        Resolution: '1024x900',
        AspectRatio: '1:1'
    }
}
</script>
<style lang="less" scoped>

</style>

