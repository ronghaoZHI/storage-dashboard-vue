<template>
<div class="unused-box">
    <h1 class="no-data" v-if="data.length === 0">No Data</h1>
    <p class="page-info" v-if="data.length !== 0">{{$t('SYSTEM.UNUSED_INFO')}}</p>
    <div class="bsc-system-card bsc-partition-card" v-for="(partition,index) in data" :key="partition.idc">
         <div class="header">
            <Icon  type="android-star" size="16"></Icon>
            <span>{{partition.ips[0]}}:{{partition.path}}</span>
        </div>
        <div class="content">
            <div class="details">
                <p><span>IDC : </span>{{partition.idc}}</p>
                <p><span>{{$t('SYSTEM.UNUSED_TOTAL_CAPACITY')}} : </span>{{`${bytes(partition.free)}/${bytes(partition.capacity)}`}}</p>
                <p><span>{{$t('SYSTEM.MEDIA_TYPE')}} : </span>{{partition.media_type}}</p>
            </div>
        </div>
        <div class="footer">
            <div>
                <Button type="ghost" size="small" @click="unusedAdd(index)">{{$t('SYSTEM.IMPLEMENTATION')}}
</Button>
            </div>
        </div>
    </div>
    <br>
</div>
</template>
<script>
import {PARTITION_UNUSED_ADD} from '@/service/API'
import {bytes} from '@/service/bucketService'
export default {
    props: ['data'],
    data () {
        return {
        }
    },
    methods: {
        async unusedAdd (index) {
            this.$Loading.start()
            try {
                await this.$http.post(PARTITION_UNUSED_ADD, {ip: this.data[index].ips[0], path: this.data[index].path})
                this.data.splice(index, 1)
                this.$Loading.finish()
                this.$Message.success(this.$t('SYSTEM.SUCCESS'))
            } catch (error) {
                console.log(error)
                this.$Loading.error()
                this.$Message.error(this.$t('SYSTEM.FAILURE'))
            }
        },
        bytes: bytes
    }
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';
.unused-box{
    width: 100%;
    .fb(flex-start, flex-start);
    flex-wrap: wrap;
    padding: 10px;
    transition: all .2s ease-in-out;
}
.page{
    width:100%;
    text-align: center;
    margin:30px 0 20px;
}
</style>
