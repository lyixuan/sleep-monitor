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
    components: {
      SHeader, SSidebar, SFooter
    }
  }
</script>

<style>
  body {
    color: #555555;
    margin: 0;
    padding: 0;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
    font-size: 13px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    background: #f5f5f5;
  }

  a {
    text-decoration: none
  }

  p {
    padding: 0;
    margin: 0;
  }

  i {
    font-style: normal;
  }
  th{
    font-weight: normal;
  }

  #view-wrap {
    width: 100%;
    padding: 56px 6px 36px 166px;
    box-sizing: border-box;
  }

  .view-content {
    min-height: 550px;
  }
</style>
