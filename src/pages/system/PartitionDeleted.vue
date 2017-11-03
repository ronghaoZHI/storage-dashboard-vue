<template>
<div class="deleted-box">
    <h1 class="no-data" v-if="list.length === 0">No Data</h1>
    如果已删除磁盘长时间（5分钟）未出现在未删除磁盘页面，需要去该磁盘路径下，删掉以partition id为文件名的文件夹
    <div class="bsc-system-card bsc-partition-card" v-for="partition in list" :key="partition.idc">
         <div class="header">
            <Icon  type="android-star" size="16"></Icon>
            <span>{{partition.inn_ips[0]}}:{{partition.path}}</span>
        </div>
        <div class="content">
            <div class="details">
                <p><span>IDC : </span>{{partition.idc}}</p>
                <p><span>类型 : </span>{{partition.media_type}}</p>
            </div>
        </div>
    </div>
    <br>
</div>
</template>
<script>
export default {
    props: ['data'],
    data () {
        return {
        }
    },
    computed: {
        list () {
            return this.data
        }
    },
    created () {
        console.log(this.list)
    },
    methods: {
    },
    watch: {
    }
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';
.deleted-box{
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
