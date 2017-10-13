<template>
    <div class="bsc-system-card bsc-group-card">
        <div class="header">
            <Icon  type="android-star" size="16"></Icon>
            <span></span>
            <Button type="text" size="small" @click="showDetailModal=true">详细信息</Button>
        </div>
        <div class="content">
            <div class="files">
                <div class="progress">
                    <span class="file-count">文件个数:个</span>
                    容量: 150G
                </div>
            </div>
        </div>
        <div class="footer">
            <span></span>
            <Button type="ghost" size="small">设置为只读</Button>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            showDetailModal: false
        }
    }
}
</script>
<style lang="less" scoped>
@import '../../styles/index.less';

</style>
