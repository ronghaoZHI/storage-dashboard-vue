<template>
    <div class="bsc-not-found">
        <div class="content">
            <img src="../../assets/404.png"></img>
            <div class="message">哎呀～您的输入的地址出错了～</div>
            <Button type="primary" @click="toIndex">返回主页</Button>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {}
    },
    methods: {
        toIndex () {
            this.$router.push('/')
        }
    }
}

</script>
<style lang="less" scoped>
@import '../../styles/index.less';

.@{css-prefix}not-found {
    .wh(100%,90%);
    .fb(center,center);

    .message {
        font-size: 17px;
        font-weight: 500;
        padding-bottom: 16px;
    }
}
</style>
