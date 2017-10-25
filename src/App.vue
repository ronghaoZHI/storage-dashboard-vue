<template>
    <div id="app" v-bind:class="{dark: isDark}"
         v-drop>
        <router-view></router-view>
        <loading></loading>
    </div>
</template>
<script>
import loading from '@/components/Loading'
export default {
    name: 'app',
    components: {loading},
    computed: {
        isDark () {
            return !this.$store.state.is_dark
        }
    },
    created () {
        let versions = !this.$store.state.is_dark ? '-dark' : ''
        let themeLink = document.querySelector('link[name="theme"]')
        themeLink.href = `./static/styles/iview${versions}.css`
    },
    directives: {
        // remove the default drop and drag actions
        drop: {
            bind: function (el) {
                let doc = document.getElementsByTagName('body')[0]
                doc.ondrop = (e) => e.preventDefault()
                doc.ondragleave = (e) => e.preventDefault()
                doc.ondragenter = (e) => e.preventDefault()
                doc.ondragover = (e) => e.preventDefault()
            }
        }
    }
}
</script>
<style lang="less">
html,
body {
    .wh(100%,100%);
    min-width: @body-min-width;
    overflow: inherit;
}

#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    height: 100%;
    overflow-y: auto;
}
</style>
