<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Button class="button-bsc-add-bucket" type="primary" @click="goTemplateEdit">{{$t('VIDEO.NEW_TEMPLATE')}}</Button>
            <legend-list :data="legendList"></legend-list>
        </div>
        <Table border :context="self" :stripe="true" :columns="listHeader" :data="templateList" :no-data-text='$t("STORAGE.NO_LIST")'></Table>
        <div class="section-paging">
            <Button v-show="pageToken.length > 0" @click="listPresets();pageToken.length = 0" type="ghost" size="small">{{$t("PUBLIC.PAGE_FIRST")}}</Button>
            <Button v-show="pageToken.length > 0" @click="previousPage()" type="ghost" size="small">{{$t("PUBLIC.PAGE_PREV")}}</Button>
            <Button v-show="nextPageToken" @click="nextPage()" type="ghost" size="small">{{$t("PUBLIC.PAGE_NEXT")}}</Button>
        </div>
    </div>
</template>
<script>
import { transcoder } from '@/service/Aws'
import legendList from '@/components/legend/legend'
export default {
    data () {
        return {
            iconSize: 18,
            self: this,
            templateList: this.templateList,
            pageToken: [],
            nextPageToken: '',
            legendList: [{
                icon: 'ios-trash',
                text: 'PUBLIC.DELETE'
            }],
            videoNames: {Codec: this.$t('VIDEO.ENCODING'), Profile: this.$t('VIDEO.CODING_PROFILE'), Level: this.$t('VIDEO.CODING_LEVEL'), KeyframesMaxDist: this.$t('VIDEO.FIXED_KEY_FRAME_SPACING'), BitRate: this.$t('VIDEO.BIT_RATE'), FrameRate: this.$t('VIDEO.FRAME_RATE'), Resolution: this.$t('VIDEO.RESOLUTION'), AspectRatio: this.$t('VIDEO.ASPECT_RATIO')},
            audioNames: {Codec: this.$t('VIDEO.ENCODING'), Profile: this.$t('VIDEO.CODING_QUALITY'), SampleRate: this.$t('VIDEO.SAMPLE_RATE'), BitRate: this.$t('VIDEO.BIT_RATE'), Channels: this.$t('VIDEO.CHANNELS')},
            listHeader: [{
                title: this.$t('VIDEO.TEMPLATE_NAME_TABLE'),
                width: 100,
                render: (h, params) => {
                    if (!params.row.description) {
                        return params.row.name
                    } else {
                        return h('Poptip', {
                            props: {
                                placement: 'right',
                                trigger: 'hover'
                            }
                        }, [h('div', [params.row.name, h('Icon', {
                            props: {
                                type: 'ios-information-outline',
                                size: '14'
                            },
                            'class': {
                                'icon-disc': true
                            }
                        })]), h('div', {
                            slot: 'content'
                        }, params.row.description)])
                    }
                }
            }, {
                title: this.$t('VIDEO.CONTAINER'),
                width: 100,
                key: 'container'
            }, {
                title: this.$t('VIDEO.VIDEO'),
                width: 400,
                render: (h, params) => {
                    return h('Poptip', {
                        props: {
                            placement: 'right',
                            trigger: 'hover'
                        }
                    }, [h('div', params.row.video.map(item => h('Tag', {
                        props: {
                            type: 'border'
                        }
                    }, `${item.name}:${item.value}`))),
                    h('div', {
                        slot: 'content'
                    }, params.row.videoDetails.map(item => h('p', `${item.name}:${item.value}`)))]
                    )
                }
            }, {
                title: this.$t('VIDEO.AUDIO'),
                width: 380,
                render: (h, params) => {
                    return h('Poptip', {
                        props: {
                            placement: 'right',
                            trigger: 'hover'
                        }
                    }, [h('div', params.row.audio.map(item => h('Tag', {
                        props: {
                            type: 'border'
                        }
                    }, `${item.name}:${item.value}`))),
                    h('div', {
                        slot: 'content'
                    }, params.row.audioDetails.map(item => h('p', `${item.name}:${item.value}`)))]
                    )
                }
            }, {
                title: this.$t('VIDEO.OPERATION'),
                key: 'actions',
                width: 80,
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
    components: {
        legendList
    },
    created () {
        this.listPresets()
    },
    methods: {
        async listPresets (pageToken) {
            try {
                this.$Loading.start()
                let res = !pageToken ? await transcoder('listPresets') : await transcoder('listPresets', {PageToken: pageToken})
                if (!res.Presets.length) {
                    this.$Message.warning(this.$t('VIDEO.NO_DATA'))
                }
                this.templateList = await this.convert2Front(res.Presets)
                this.nextPageToken = res.NextPageToken
                this.$Loading.finish()
            } catch (error) {
                this.$Loading.error()
            }
        },
        previousPage () {
            let page = this.pageToken[this.pageToken.length - 2]
            this.pageToken.pop()
            this.listPresets(page)
        },
        nextPage () {
            this.nextPageToken && this.pageToken.push(this.nextPageToken)
            this.listPresets(this.nextPageToken)
        },
        goTemplateEdit () {
            this.$router.push({ name: 'TemplateEdit', params: { id: 'none' } })
        },
        async deletePreset (rule) {
            try {
                this.$Loading.start()
                await transcoder('deletePreset', {Id: rule.id}, this.$t('VIDEO.TEMPLATE_DELETED_ERROR'))
                this.templateList.splice(rule._index, 1)
                this.$Loading.finish()
                this.$Message.success(this.$t('VIDEO.DELETED_SUCCESSFULLY'))
            } catch (error) {
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
                        name: this.$t('VIDEO.CODING_QUALITY'),
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
                title: this.$t('PUBLIC.DELETE'),
                onOk: () => this.deletePreset(rule)
            })
        }
    }
}
const videoMust = ['Codec', 'FrameRate', 'Resolution', 'BitRate', 'AspectRatio']
const audioMust = ['Codec', 'SampleRate', 'Channels', 'BitRate']

</script>
<style lang="less">
.icon-disc{
    padding-left: 5px;
    vertical-align: text-top;
}
.section-paging {
    .wh(100%,40px);
    .fb(flex-end,center);
    button {
        margin-left: 6px;
    }
}

</style>

