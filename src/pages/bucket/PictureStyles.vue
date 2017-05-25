<template>
    <div>
        <div class="layout-bsc-toolbar">
            <Breadcrumb>
                <Breadcrumb-item href="/">{{$t("STORAGE.TITLE")}}</Breadcrumb-item>
                <Breadcrumb-item>{{$t("STORAGE.PIC_STYLE")}} ({{bucket}})</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <div class="toolbar-nav">
            <Button type="primary" @click="goCreateStyle">{{$t("STORAGE.CREATE_STYLE")}}</Button>
            <Button type="primary" @click="">{{$t("STORAGE.EXPORT_STYLE")}}</Button>
            <Button type="primary" @click="" >{{$t("STORAGE.IMPORT_STYLE")}}</Button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {}
    },
    computed: {
        bucket () {
            return this.$route.params.bucket
        }
    },
    mounted () {
        this.getPicStylesdList()
    },
    methods: {
        getPicStylesdList () {},
        goCreateStyle () {
            const bucket = this.bucket
            this.$router.push({ name: 'editStyles', params: { bucket: bucket } })
        }
    },
    watch: {
        // the contents array need refresh when the $route value changed
        '$route' (to, from) {
            to.path !== from.path && this.getData()
        }
    }
}
</script>

<style lang="less" scoped>
.layout-bsc-toolbar {
    padding-bottom: 8px;
    border-bottom: 1px solid #f2f1f6;
}
.new-user-input{
    width:70%;
    max-width:150px;
    margin-right:5%;
}
.new-user-button{
    width:25%;
    max-width:50px;
}
.table-permission th.percent20 {
    width:20%;
}
.table-permission th.percent30 {
    width:30%;
}
</style>
