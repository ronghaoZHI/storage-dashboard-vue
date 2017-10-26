<template>
    <div class="bsc-keychain-card">
        <div class="header">
            <span>{{keychain.ts}}</span>
            <span class="icon-delete" @click="deleteConfirmModal(keychain.accesskey)" v-show="!isAdmin && !work">
                <Tooltip :content='$t("KEYCHAIN.DELETE_KEY")' placement="top">
                    <Icon type="ios-trash" :size="16"></Icon>
                </Tooltip>
            </span>
        </div>
        <Tooltip :content='$t("KEYCHAIN.COPY_ACCESSKEY")'>
            <div class="content" @click="copy" :data-clipboard-text="keychain.accesskey" v-clip>
                <Icon type="key"></Icon>
                <span class="keys">{{keychain.accesskey}}</span>
            </div>
        </Tooltip>
        <Tooltip :content='$t("KEYCHAIN.COPY_SECRETKEY")'>
            <div class="content" @click="copy" :data-clipboard-text="keychain.secretkey" v-clip>
                <Icon type="locked"></Icon>
                <span class="keys">{{keychain.secretkey}}</span>
            </div>
        </Tooltip>
    </div>
</template>
<script>
import Clipboard from 'clipboard'
import user from '@/store/modules/user'
export default {
    data () {
        return {
            isAdmin: user.state.type === 'admin'
        }
    },
    directives: {
        clip: {
            bind: function (el) {
                new Clipboard(el)
            }
        }
    },
    props: ['keychain', 'work'],
    methods: {
        copy () {
            this.$Message.success(this.$t('STORAGE.COPIED'))
        },
        deleteConfirmModal (accesskey) {
            this.$Modal.confirm({
                content: this.$t('KEYCHAIN.DELETE_KEY_COM', {accesskey: accesskey}),
                okText: this.$t('PUBLIC.CONFIRMED'),
                cancelText: this.$t('PUBLIC.CANCLE'),
                onOk: () => this.$emit('deleteKey', accesskey)
            })
        }
    }
}

</script>
<style lang="less" scoped>
@keychain-card-width: 390px;
@keychain-card-height: 110px;
@keychain-card-header-height: 30px;
@keychain-card-text-color: #8391a4;
@keychain-card-backgrand: #f8fbfb;
@keychain-card-header-backgrand: #eff3f7;
@keychain-card-backgrand-hover: #d9d9d9;

.dark .@{css-prefix}keychain-card {
    background-color: @body-background-dark;
    .sc(14px, @keychain-card-text-color);
    box-shadow: 0 0 0 0;
    color: @text-color-dark;
    border: @common-border-dark;
    margin: 6px 3px;

    .header {
        background-color: @secondary-color-dark;
        border-bottom: @common-border-dark;
    }

    .content {
        &:hover {
            color: #fff;
        }
    }
}

.@{css-prefix}keychain-card {
    .wh(@keychain-card-width, @keychain-card-height);
    background-color: @keychain-card-backgrand;
    .sc(14px, @keychain-card-text-color);
    box-shadow:2px 2px 2px #e2e2e3;
    margin: 6px 3px;

    .header {
        .wh(100%,@keychain-card-header-height);
        .fb(space-between,center);
        padding: 0 12px;
        background-color: @keychain-card-header-backgrand;

        .icon-delete {
            width: 15px;
            text-align: right;
            cursor: pointer;
        }
    }

    .content {
        .wh(100%,(@keychain-card-height - @keychain-card-header-height - 10) / 2);
        .fb(flex-start,center);
        padding: 10px 12px 0 12px;
        cursor: pointer;
        
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
