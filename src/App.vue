<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    name: 'app'
}
</script>

<style lang="less">
    html,body{
        height: 100%;
        width: 100%;
        min-width: 1060px;
    }
    #app {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      height: 100%;
    }
</style>
