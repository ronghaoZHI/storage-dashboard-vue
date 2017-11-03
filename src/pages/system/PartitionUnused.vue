<template>
<div class="unused-box">
    <h1 class="no-data" v-if="list.length === 0">No Data</h1>
    <div class="bsc-system-card bsc-partition-card" v-for="(partition,index) in list" :key="partition.idc">
         <div class="header">
            <Icon  type="android-star" size="16"></Icon>
            <span>{{partition.ips[0]}}:{{partition.path}}</span>
        </div>
        <div class="content">
            <div class="details">
                <p><span>IDC : </span>{{partition.idc}}</p>
                <p><span>已用／总容量 : </span>{{partition.freeAndCapacity}}</p>
                <p><span>类型 : </span>{{partition.media_type}}</p>
            </div>
        </div>
        <div class="footer">
            <div>
                <Button type="ghost" size="small" @click="unusedAdd(index)">上线</Button>
            </div>
        </div>
    </div>
    <br>
</div>
</template>
<script>
import {PARTITION_UNUSED_ADD} from '@/service/API'
import {bytes} from '@/service/BucketService'
export default {
    props: ['data'],
    data () {
        return {
        }
    },
    computed: {
        list: {
            get () {
                let newData = [...this.data]
                newData.forEach(item => {
                    item.freeAndCapacity = `${bytes(item.free)}/${bytes(item.capacity)}`
                })
                return newData
            },
            set (value) {
                console.log('set', value)
            }
        }
    },
    created () {
        console.log(this.list, 'data', this.data)
    },
    methods: {
        async unusedAdd (index) {
            this.$Loading.start()
            try {
                await this.$http.post(PARTITION_UNUSED_ADD, {ip: this.list[index].ips[0], path: this.list[index].path})
                this.data.splice(index, 1)
                this.$Loading.finish()
                this.$Message.success('设置成功')
            } catch (error) {
                console.log(error)
                this.$Loading.error()
                this.$Message.error('设置失败')
            }
        }
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
