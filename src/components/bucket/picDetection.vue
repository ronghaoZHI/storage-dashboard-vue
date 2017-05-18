<template>
    <div>
        <div class="setting-box">
            <span>是否开启：</span>
            <Tooltip placement="top" :content='$t("STORAGE.ADULT_OPEN_INFO")' :disabled="!(!adultPolify.enabled && !adultPolify.isolate_bucket)">
                <i-switch size="large" :disabled='!adultPolify.enabled && !adultPolify.isolate_bucket' v-model="adultPolify.enabled" @on-change="putBucketPolicy">
                    <span slot="open">开启</span>
                    <span slot="close">关闭</span>
                </i-switch>
            </Tooltip>
        </div>
        <div class="setting-box">
            <span>黄图存放：</span>
            <Select v-model="adultPolify.isolate_bucket" @on-change="putBucketPolicy" class="my-select" style="">
                    <Option v-for="item in bucketList" :value="item.Name" :key="item.Name">{{ item.Name }}</Option>
                </Select>
            <p class="tips">如果没有专门存放鉴别后黄图的Bucket，您需要先
                <a href="/">创建一个Bucket</a>
            </p>
        </div>
        <div class="setting-box">
            <span class="last-title">黄图处理规则：</span>
            <Radio-group v-model="adultPolify.delete" vertical @on-change="putBucketPolicy">
                <Radio label="F">
                    <span>保留原Bucket里的黄图并复制到黄图存放Bucket</span>
                </Radio>
                <Radio label="T">
                    <span>删除原Bucket里的黄图并复制到黄图存放Bucket</span>
                </Radio>
            </Radio-group>
        </div>
    </div>
</template>

<script>
import { handler } from '../service/Aws'
export default {
    data() {
        return {
            bucketList: this.bucketList,
            adultPolify:  {
                'enabled': false,
                'delete': 'F',
                'isolate_bucket': ''
            },

        }
    },
    props: ['bucket'],
    computed: {

    },
    mounted() {
        this.getBucketList()
        this.getBucketPolicy()
    },
    methods: {
        async getBucketList() {
            try {
                let res = await handler('listBuckets')
                this.bucketList = [...res.Buckets]
                _.remove(this.bucketList, n => n.Name == this.bucket)
            } catch (error) {
                this.$Message.error(this.$t("DASHBOARD.GET_BUCKET_FAILED"))
            };
        },
        async getBucketPolicy() {
            try {
                let res = await handler('getBucketPolicy', {
                    Bucket: this.bucket,
                })
                let policy = JSON.parse(res.Policy)
                if (_.includes(JSON.stringify(policy),'"adult":')) {
                    this.adultPolify = convertPolify2String(policy.cognitive.computer_vision.adult)
                } else {
                    this.putBucketPolicy()
                }
            } catch (error) {
                this.$Message.error(this.$t("STORAGE.GET_ADULT_FAILED"))
            };
        },
        async putBucketPolicy() {
            let boolPolify = convertPolify2Bool(_.cloneDeep(this.adultPolify))
            try {
                await handler('putBucketPolicy', {
                    Bucket: this.bucket,
                    Policy: JSON.stringify(boolPolify)
                })
            } catch (error) {
                this.getBucketPolicy()
                this.$Message.error(this.$t("STORAGE.POLOCY_FAILED"))
            };
        },
    },
}
const convertPolify2Bool = (polify) => {
    polify.delete = polify.delete == 'T' ? true : false
    let polifyObj = {
        'cognitive': {
            'computer_vision': {
                'adult': polify,
            },
        },
    }
    return polifyObj
}
const convertPolify2String = (polify) => {
    polify.delete = polify.delete == true ? "T" : "F"
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
        }
        span.last-title {
            vertical-align: top;
            line-height: 30px;
        }
        .my-select {
            width: 400px
        }
    }
</style>