<template >
    <div>
        <div class="setting-box">
            <span>是否开启： </span>
            <i-switch size="large" v-model="isOpen" @on-change="putBucketPolicy('isOpen')">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
            </i-switch>
        </div>
        <div class="setting-box">
            <span>黄图存放： </span>
            <Select v-model="storeBucket" @on-change="putBucketPolicy('storeBucket')">
                <Option v-for="item in bucketList" :value="item.Name" :key="item.Name">{{ item.Name }}</Option>
            </Select>
        </div>
        <div class="setting-box">
            <span>黄图处理规则： </span>
            <Radio-group v-model="isSave" vertical @on-change="putBucketPolicy('isSave')">
                <Radio label="reserve">
                    <span>保留原Bucket里的黄图并复制到黄图存放Bucket</span>
                </Radio>
                <Radio label="delete">
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
           storeBucket: this.storeBucket,
           isSave: "reserve",
           isOpen: this.isOpen
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
            } catch (error) {
                this.$Message.error(this.$t("DASHBOARD.GET_BUCKET_FAILED"))
            };
        },
        async getBucketPolicy() {
            try {
                let res = await handler('getBucketPolicy',{
                    Bucket: this.bucket,
                })
                let policy = JSON.parse(res.Policy)
                this.isOpen = policy.isOpen ? policy.isOpen : false
                this.storeBucket = policy.storeBucket ? policy.storeBucket : ''
                
            } catch (error) {
                this.$Message.error(this.$t("DASHBOARD.GET_BUCKET_FAILED"))
            };
        },
        async putBucketPolicy(prp) {
            try {
                await handler('putBucketPolicy',{
                    Bucket: this.bucket,
                    Policy: JSON.stringify({[prp]:this[prp]})
                })
                this.$Message.success(this.$t("STORAGE.POLOCY_SUCCESS"));
            } catch (error) {
                this.$Message.error(this.$t("DASHBOARD.POLOCY_FAILED"))
            };
        },
    }
}
</script>
<style lang='less' scoped>
.setting-box{
    padding:15px;
    vertical-align: top;
    span{
        font-size:14px;
    } 
    
}
</style>