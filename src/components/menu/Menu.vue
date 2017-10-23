<template>
    <div class="layout-menu">
        <Menu :active-name="activeName" theme="dark" :open-names="[openName]" :accordion="false" width="auto" @on-select="goRouter">
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
export default {
    data () {
        return {
            iconSize: 24,
            activeName: this.$route.meta.ali,
            openName: this.$route.meta.parent || ''
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
        }
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
    .wh(90%,30px);
    border-radius: @common-radius;
    margin: 15px auto;
}

</style>
