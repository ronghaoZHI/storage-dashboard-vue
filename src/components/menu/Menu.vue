<template>
    <div class="layout-menu" :class="{'layout-menu-mini': isMini}">
        <Menu ref="menu" class="mini" :active-name="activeName" theme="dark" :open-names="openName" :accordion="true" width="auto" @on-select="goRouter" @on-open-change="updateOpenName" @on-mini-change="miniChange" :imgSrc="imgSrc">
            <div class="layout-logo-left">
                <img class="logo-big" :src="logoSrc" height="30px" />
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
import leftBlue from '../../assets/menu-toggle-lb.svg'
import left from '../../assets/menu-toggle-l.svg'
import rightBlue from '../../assets/menu-toggle-rb.svg'
import right from '../../assets/menu-toggle-r.svg'
import logo from '../../assets/bsc-logo.svg'
import logoMini from '../../assets/bsc-logo-mini.svg'
export default {
    data () {
        return {
            iconSize: 24,
            activeName: this.$route.meta.ali,
            openName: this.$route.meta.parent ? [this.$route.meta.parent] : [],
            isMini: false,
            imgSrc: { leftBlue, left, rightBlue, right },
            subMenus: ['group', 'partition', 'traffic', 'machine', 'template', 'pipeline', 'output', 'job', 'statistics']
        }
    },
    computed: {
        menuList: function () {
            return _.filter(menuState.state.menuList, item => item.show)
        },
        logoSrc () {
            return this.isMini ? logoMini : logo
        }
    },
    methods: {
        goRouter (link) {
            this.$router.push({ name: link })
            // if (this.isMini && this.subMenus.includes(link)) {
            //     this.openName = []
            //     this.$refs['menu'].updateOpened()
            // }
        },
        updateOpenName () {
            this.$refs['menu'].updateOpened()
        },
        async miniChange (value) {
            this.isMini = value
            await this.$store.dispatch('toggleMiniMenu', this.isMini)
        }
    },
    watch: {
        '$route' (to, from) {
            this.activeName = to.meta.ali
            this.openName = to.meta.parent ? [to.meta.parent] : []
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
.layout-menu-mini{
    width: 60px;
}

.layout-logo-left {
    .wh(100%,60px);
    border-radius: @common-radius;
    padding: 15px 15px 0 15px;
    background: #273138;
}

</style>
