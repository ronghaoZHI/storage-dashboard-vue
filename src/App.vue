<template>
    <div id="app"
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
    created () {
        this.$store.state.is_dark && $('body').addClass('dark')
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
