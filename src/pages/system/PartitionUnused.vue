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
                <p class="half"><span>类型 : </span>SSD</p>
                <p class="half"><span>已用／总容量 : </span>0T/5T</p>
            </div>
        </div>
        <div class="footer">
            <div>
                <Button type="ghost" size="small">上线</Button>
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
</style>
