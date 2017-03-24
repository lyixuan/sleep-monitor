<template>
  <div id="app">
    <s-header></s-header>
    <s-sidebar></s-sidebar>
    <s-footer></s-footer>
    <div id="view-wrap">
      <router-view class="view-content"></router-view>
    </div>
  </div>
</template>

<script>
  import SHeader from './components/Header.vue'
  import SSidebar from './components/Sidebar.vue'
  import SFooter from './components/Footer.vue'
  export default {
    name: 'app',
    components:{
        SHeader,SSidebar,SFooter
    }
  }
</script>

<style>
  body {
    background: #fff;
    margin: 0;
    padding: 0;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
    font-size: 13px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
  a {
    text-decoration: none
  }
  #view-wrap {
    width: 100%;
    padding: 60px 0px 0px 160px;
    box-sizing: border-box;
  }
  .view-content{
    background: #f5f5f5;
    overflow: hidden;
  }
</style>
