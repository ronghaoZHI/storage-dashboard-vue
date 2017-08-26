<template>
    <div class="global-mask"
         v-if="isShow">
        <div class="global-loading">
            <Spin fix>
                <Icon type="load-c" class="spin-icon-load"
                      size=60></Icon>
                <div>{{$t("PUBLIC.LOADING")}}</div>
            </Spin>
        </div>
    </div>
</template>
<script>

export default {
    computed: {
        isShow () {
            return this.$store.state.loading
        }
    }
}

</script>
<style lang="less" scoped>
.global-mask {
    position: fixed;
    z-index: 2000;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, .3);
}

.global-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    width: 50px;
    height: 50px;
    margin: 0 auto;
    margin: -100px 0 0 -25px;
}
.spin-icon-load {
    animation: loading 1s linear infinite;
}

@keyframes loading{
    0%{
        transform: rotate(0deg);
    }
    50%{
        transform: rotate(180deg);
    }
    100%{
        transform: rotate(1turn);
    }
}
</style>
