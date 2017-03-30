<template>
  <div id="login">
    <div class="head"><img src="./assets/img-com/logo.png" height="50"
                           style="vertical-align: middle;margin-top: -10px;margin-right: 10px;"/>睡眠监测管理系统
    </div>
    <div class="content">
      <div class="wrap"></div>
    </div>
    <div class="foot">Copyrignt © 2016-2017 All Rights Reserved </div>
  </div>
</template>

<script>
  export default {
    name: 'login'

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
    box-sizing: border-box;
  }


  .head {
    width: 100%;
    height: 140px;
    line-height: 180px;
    border-bottom: 1px solid #E8EAEB;
    color: #2291C6;
    font-size: 25px;
    padding-left: 100px;
    box-sizing: border-box;
  }

  .content {
    box-sizing: border-box;
    margin-top: 20px;
    width: 100%;
    height: 450px;
    background-image: url(./assets/img-com/bg.png);
    background-repeat: repeat;
    background-position: center 0;
  }
  .foot{
    margin-top: 20px;
    text-align: center;
    margin-bottom: 30px;
  }
  .wrap{
    height: 400px;
    width: 350px;
    opacity: .2;
    background: #fff;
    margin-top: 20px;
    border-radius: 10px;
    float: right;
    margin-right: 50px;
  }
</style>
