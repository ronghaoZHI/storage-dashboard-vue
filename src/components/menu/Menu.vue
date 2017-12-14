<template>
    <div class="layout-menu">
        <Menu ref="menu" :active-name="activeName" theme="dark" :open-names="openName" :accordion="true" width="auto" @on-select="goRouter" @on-open-change="updateOpenName">
            <div class="layout-logo-left">
                <img class="logo-big" src="../../assets/logo.png" height="30px" />
            </div>
            <Menu-item v-for="item in menuList" :name="item.name" :key="item.index" v-if="!item.children">
                <img v-bind:src="item.icon" class="icon-menu" height="15px" />
                <span class="layout-text">{{$t("SIDEBAR."+ item.name.toUpperCase())}}</span>
            </Menu-item>
            <Submenu v-for="item in menuList" :name="item.name" :key="item.index" v-if="item.children">
                <template slot="title">
                    <img v-bind:src="item.icon" class="icon-menu" height="15px" />
                    <span class="layout-text">{{$t("SIDEBAR."+ item.name.toUpperCase())}}</span>
                </template>
                <Menu-item v-for="child in item.children" :name="child.name" :key="child.index">
                    <span class="layout-text">{{$t("SIDEBAR."+ child.name.toUpperCase())}}</span>
                </Menu-item>
            </Submenu>
        </Menu>
    </div>
</template>
<script>
import menuState from '@/store/modules/menu'
import user from '@/store/modules/user'
export default {
    data () {
        return {
            iconSize: 24,
            activeName: this.$route.meta.ali,
            openName: this.$route.meta.parent ? [this.$route.meta.parent] : []
        }
    },
    computed: {
        menuList: function () {
            return _.filter(menuState.state.menuList, item => item.show)
        }
    },
    methods: {
        goRouter (link) {
            this.$router.push({ name: link })
        },
        updateOpenName () {
            this.$refs['menu'].updateOpened()
        }
    },
    watch: {
        '$route' (to, from) {
            this.activeName = to.meta.ali
            this.openName = to.meta.parent ? [to.meta.parent] : []
        }
    },
    created () {
        user.state.type === 'superadmin' ? this.$router.push({ name: 'group' }) : ''
        this.$nextTick(() => {
            this.activeName = 'group'
        })
    }
}

</script>
<style lang="less" scoped>


.layout-menu {
    z-index: 100;
    .wh(200px, 100%);
    background: @menu-background;
    position: fixed;
}

.layout-logo-left {
    .wh(100%,60px);
    border-radius: @common-radius;
    padding: 15px 15px 0 15px;
}

.dark .layout-logo-left {
    background: @primary-color-dark;
}

</style>
