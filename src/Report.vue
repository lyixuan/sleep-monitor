<template>
  <div id="report">
    <div class="wrap"></div>
  </div>
</template>

<script>
  export default {
    name: 'report'

  }
</script>

<style>
  body {
    color: #555555;
    margin: 0;
    padding: 0;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
    font-size: 14px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    background: #fff;
  }

  .wrap {
    width: 210mm;
    height: 297mm;
    margin: 0 auto;
    border: 2px solid red;
  }
</style>
