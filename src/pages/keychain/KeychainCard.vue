<template>
    <Tooltip content="Click to copy keys">
        <div class="bsc-keychain-card" :data-clipboard-text="`accesskey:${keychain.accesskey},secretkey:${keychain.secretkey}`" v-clip>
            <span class="info"><Icon type="key"></Icon>{{keychain.accesskey}}</span>
            <span class="info"><Icon type="locked"></Icon>{{keychain.secretkey}}</span>
            <span class="ts">{{keychain.ts}}</span>
            <span class="status" :class="{ alive: keychain.is_del === 0 }"><Icon type="record"></Icon></span>
        </div>
    </Tooltip>
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
    props: ['keychain']
}

</script>
<style lang="less" scoped>

@import '../../styles/index.less';
@keychain-card-width: 300px;
@keychain-card-height: 100px;
@keychain-card-text-color: #657180;
@keychain-card-border-color: #d7dde4;
@keychain-card-input-backgrand: #f5f7f9;
@keychain-card-input-backgrand-hover: #d9d9d9;

.@{css-prefix}keychain-card {
    .wh(@keychain-card-width, @keychain-card-height);
    position: relative;
    background-color: @keychain-card-input-backgrand;
    border-radius: @common-radius;
    border: 1px solid @keychain-card-border-color;
    .sc(14px, @keychain-card-text-color);
    padding-top: 20px;
    margin: 6px 3px;
    cursor: pointer;

    &:hover {
        background-color: @keychain-card-input-backgrand-hover;
    }

    .info {
        display: inline-block;
        .wh(90%, @keychain-card-height / 2 - 15);
        line-height: @keychain-card-height / 2 - 15;
        vertical-align: middle;
        padding: 6px 16px;
        text-align: left;
        text-overflow: ellipsis;
        overflow:hidden;
        white-space:nowrap;

        i {
            text-align: center;
            position: relative;
            top: 1px;
            padding-right: 10px;
            width: 20px;
        }
    }

    .ts {
        position: absolute;
        color: @keychain-card-text-color;
        top: 6px;
        right: 12px;
        font-size: 12px;
    }

    .status {
        position: absolute;
        color: @keychain-card-text-color;
        top: 6px;
        left: 12px;
        font-size: 12px;
    }

    .alive {
        color: #00924c;
    }
}


</style>
