<template>
<div>
    <div class="bsc-system-card bsc-partition-card">
         <div class="header">
            <Icon  type="android-star" size="16"></Icon>
            <span>10.102.0.223:/s2/drive/001</span>
        </div>
        <div class="content">
            <div class="details">
                <p><span>IDC : </span>shijiazhuang-xunjie</p>
                <p><span>类型 : </span>SSD</p>
            </div>
        </div>
    </div>
    <br>
    <Page class="page" :total="100" show-elevator show-sizer></Page>
</div>
</template>
<script>
export default {
    data () {
        return {
        }
    },
    created () {
    },
    // components: { idcCard, partitionCard },
    methods: {
    },
    watch: {
    }
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';
.page{
    width:100%;
    text-align: center;
    margin:30px 0 20px;
}
</style>
