<template>
    <div>
        <div class="setting-box">
            <span class="setting-name">{{$t('STORAGE.ISOPEN')}}</span>
            <Tooltip placement="bottom" :content='$t("STORAGE.ADULT_OPEN_INFO")' :disabled="!enabledVertify">
                <i-switch size="large" :disabled='enabledVertify' v-model="adultPolify.enabled">
                    <span slot="open">{{$t('STORAGE.ON')}}</span>
                    <span slot="close">{{$t('STORAGE.OFF')}}</span>
                </i-switch>
            </Tooltip>
        </div>
        <div class="setting-box">
            <span class="setting-name">{{$t('STORAGE.ADULT_SAVE')}}</span>
            <Select v-model="adultPolify.isolate_bucket" class="my-select" style="">
                    <Option v-for="item in bucketList" :value="item.Name" :key="item.Name">{{ item.Name }}</Option>
                </Select>
            <p class="tips">{{$t('STORAGE.ADULT_SAVE_TIPS')}}
                <span @click="createBucketModal = true" class="creat-bucket">{{$t('STORAGE.ADULT_CREATE_BUCKET')}}</span>
            </p>
        </div>
        <div class="setting-box">
            <span class="setting-name last-title">{{$t('STORAGE.ADULT_RULE')}}</span>
            <Radio-group v-model="adultPolify.delete" vertical>
                <Radio label="F">
                    <span>{{$t('STORAGE.ADULT_RULE_SAVE')}}</span>
                </Radio>
                <Radio label="T">
                    <span>{{$t('STORAGE.ADULT_RULE_DEL')}}</span>
                </Radio>
            </Radio-group>
        </div>
        <Modal v-model="createBucketModal" :title='$t("STORAGE.ADD_BUCKET")' @on-ok="addBucket" @on-cancel="createBucketValue = ''">
            <Input v-model="createBucketValue" @on-change="check" :placeholder='$t("STORAGE.ADD_BUCKET_PLACEHOLDER")'>
            </Input>
            <span class="info-input-error">{{inputCheck ? $t("STORAGE.ADD_BUCKET_CHECK") : ''}}</span>
        </Modal>
    </div>
</template>

<script>
    import { handler } from '@/service/Aws'
    export default {
        data () {
            return {
                bucketList: this.bucketList,
                adultPolify: {},
                createBucketModal: false,
                inputCheck: false,
                createBucketValue: ''
            }
        },
        props: ['bucket'],
        computed: {
            enabledVertify () {
                return _.findKey(this.bucketList, ['Name', this.adultPolify.isolate_bucket]) === undefined
            }
        },
        created () {
            this.getBuckets()
            this.getBucketPolicy()
        },
        methods: {
            async getBuckets () {
                try {
                    let res = await this.$store.dispatch('getBuckets')
                    this.bucketList = [...res.Buckets]
                    _.remove(this.bucketList, n => n.Name === this.bucket)
                } catch (error) {
                    this.$Message.error(this.$t('DASHBOARD.GET_BUCKET_FAILED'))
                };
            },
            async getBucketPolicy () {
                try {
                    let res = await handler('getBucketPolicy', {
                        Bucket: this.bucket
                    })
                    let policy = JSON.parse(res.Policy)
                    if (_.includes(JSON.stringify(policy), '"adult":')) {
                        this.adultPolify = convertPolify2String(policy.cognitive.computer_vision.adult)
                    } else {
                        this.adultPolify = defultAdultPolify
                        this.putBucketPolicy()
                    }
                } catch (error) {
                    this.$Message.error(this.$t('STORAGE.GET_ADULT_FAILED'))
                };
            },
            async putBucketPolicy () {
                let boolPolify = convertPolify2Bool(_.cloneDeep(this.adultPolify))
                try {
                    await handler('putBucketPolicy', {
                        Bucket: this.bucket,
                        Policy: JSON.stringify(boolPolify)
                    })
                } catch (error) {
                    this.getBucketPolicy()
                    this.$Message.error(this.$t('STORAGE.POLOCY_FAILED'))
                };
            },
            addBucket () {
                let self = this
                if (this.createBucketValue.length > 2) {
                    handler('createBucket', {
                        Bucket: this.createBucketValue
                    }).then(() => {
                        self.$Message.success(this.$t('STORAGE.ADD_BUCKET_SUCCESS'))
                        self.getBuckets()
                        self.createBucketValue = ''
                    }, error => {
                        self.$Message.error(error.message)
                    })
                } else {
                    this.$Message.warning(this.$t('STORAGE.ADD_BUCKET_CHECK'))
                }
            },
            check () {
                this.inputCheck = this.createBucketValue.length < 2
            },
            async putUnionPolicy (unionBucket) {
                if (this.enabledVertify) {
                    return
                }
                let union = {
                    union: {
                        'picAdult': unionBucket
                    }
                }
                try {
                    await handler('putBucketPolicy', {
                        Bucket: this.adultPolify.isolate_bucket,
                        Policy: JSON.stringify(union)
                    })
                } catch (error) {
                    console.error('putUnionPolicy', error)
                };
            }
        },
        watch: {
            //  arrow function can not be used in watcher
            'adultPolify': {
                handler: function (to, from) {
                    from.enabled !== undefined && this.putBucketPolicy()
                },
                deep: true
            },
            'adultPolify.enabled' (to, from) {
                to ? this.putUnionPolicy(this.bucket) : this.putUnionPolicy('')
            }
        }
    }

    const defultAdultPolify = {
        'enabled': false,
        'delete': 'F',
        'isolate_bucket': ''
    }
    const convertPolify2Bool = (polify) => {
        polify.delete = polify.delete === 'T'
        let polifyObj = {
            'cognitive': {
                'computer_vision': {
                    'adult': polify
                }
            }
        }
        return polifyObj
    }
    const convertPolify2String = (polify) => {
        polify.delete = polify.delete ? 'T' : 'F'
        return polify
    }
</script>

<style lang='less' scoped>
    .setting-box {
        padding: 15px;
        vertical-align: top;
        span {
            font-size: 14px;
        }
        p.tips {
            padding-left: 77px;
            color: #8492a6;
            font-size: 14px;
            padding-top: 10px;
            .creat-bucket {
                color: #39f;
                cursor: pointer;
            }
        }
        span.last-title {
            vertical-align: top;
            line-height: 30px;
        }
        span.setting-name {
            display: inline-block;
            width: 75px;
            text-align: right;
            padding-right: 5px;
        }
        .my-select {
            width: 400px
        }
    }
</style>
