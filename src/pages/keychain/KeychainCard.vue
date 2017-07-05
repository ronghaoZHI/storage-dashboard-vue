<template>
    <div class="bsc-keychain-card">
        <div class="header">
            <Icon :class="{ alive: keychain.is_del === 0 }" type="record"></Icon>
            <span>{{keychain.ts}}</span>
        </div>
        <Tooltip content="Click to copy accesskey">
            <div class="content" @click="copy" :data-clipboard-text="keychain.accesskey" v-clip>
                <Icon type="key"></Icon>
                <span class="keys">{{keychain.accesskey}}</span>
            </div>
         </Tooltip>
         <Tooltip content="Click to copy secretkey">
            <div class="content" @click="copy" :data-clipboard-text="keychain.secretkey" v-clip>
                <Icon type="locked"></Icon>
                <span class="keys">{{keychain.secretkey}}</span>
            </div>
         </Tooltip>
    </div>
</template>
<script>
import Clipboard from 'clipboard'
export default {
    data () {
        return {}
    },
    directives: {
        clip: {
            bind: function (el) {
                new Clipboard(el)
            }
        }
    },
    props: ['keychain'],
    methods: {
        copy () {
            this.$Message.success('Copied!')
        }
    }
}

</script>
<style lang="less" scoped>

@import '../../styles/index.less';
@keychain-card-width: 370px;
@keychain-card-height: 110px;
@keychain-card-header-height: 30px;
@keychain-card-text-color: #8391a4;
@keychain-card-backgrand: #f8fbfb;
@keychain-card-header-backgrand: #eff3f7;
@keychain-card-backgrand-hover: #d9d9d9;

.@{css-prefix}keychain-card {
    .wh(@keychain-card-width, @keychain-card-height);
    background-color: @keychain-card-backgrand;
    .sc(14px, @keychain-card-text-color);
    box-shadow:2px 2px 2px #e2e2e3;
    margin: 6px 3px;
    cursor: pointer;

    .header {
        .wh(100%,@keychain-card-header-height);
        .fb(space-between,center);
        padding: 0 12px;
        background-color: @keychain-card-header-backgrand;
    }

    .content {
        .wh(100%,(@keychain-card-height - @keychain-card-header-height - 10) / 2);
        .fb(flex-start,center);
        padding: 10px 12px 0 12px;
        
        i {
            text-align: center;
            position: relative;
            padding-right: 10px;
            width: 20px;
        }

        .keys {
            text-overflow: ellipsis;
            overflow:hidden;
            white-space:nowrap;
        }

        &:hover {
            color: #50575c;
        }
    }

    .alive {
        color: #22d067;
    }
}


</style>
