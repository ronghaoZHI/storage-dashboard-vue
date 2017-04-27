<template>
    <div id="app"
         v-drop>
        <router-view></router-view>
        <loading></loading>
    </div>
</template>
<script>
import loading from '@/components/common/Loading'
export default {
    name: 'app',
    components: {loading},
    directives: {
        //remove the default drop and drag actions 
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
    height: 100%;
    width: 100%;
    min-width: 1060px;
    overflow: inherit;
}

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
    overflow-y: auto;
}
</style>
