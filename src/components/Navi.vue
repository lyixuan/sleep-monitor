<template>
  <div class="navi">
    <p class="title">{{data.title}}</p>
    <p class="subTitle">{{data.subTitle}}</p>
    <p class="subTtn">{{data.btn}}</p>
  </div>
</template>

<script>
  export default {
    name: 'navi',
    props: {
      data: {}
    },
  }
</script>

<style scoped>
  .navi{
    width: 100%;
    background: #fff;
    height: 25px;
    line-height: 25px;
    padding: 0 5px;
    box-sizing: border-box;
  }
  p.title{
    float: left;
    margin-right: 10px;
    font-weight: 500;
    color: #333;
  }
  .subTitle{
    float: left;
    color: #888;
  }
  .subTtn{
    float: right;
    color: #1D8CE0;
    cursor: pointer;
  }
  .subTtn:hover{
    color: #20A0FF;
  }
</style>
