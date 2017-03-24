<template>
  <div class="sidebar" id="sidebar">
    <!--<div class="sidebar-header" @click="changeSidebar">济南公寓<i class="el-icon-more"></i></div>-->
    <div class="menu logo-menu" @click="changeSidebar">
      <i class="icon-logo"><img src="../assets/jinan-logo.png" width="25" style="margin-top: 8px;vertical-align: top"></i>
      <span style="font-size: 16px;color:#fff;font-weight: bold;letter-spacing: 3px;margin-right: 24px;">济南公寓</span>
      <i class="el-icon-arrow-left icon-r" :class="{rShow:rIsShow === 3}"></i>
      <i class="el-icon-arrow-left icon-r" :class="{rShow:rIsShow === 2}"></i>
      <i class="el-icon-arrow-left icon-r" :class="{rShow:rIsShow === 1}"></i>
    </div>

    <router-link to="/dashboard">
      <div class="menu">
        <i class="el-icon-search icon"></i>
        <span>公寓监控概览</span>
      </div>
    </router-link>
    <router-link to="/bedStatusMonitor">
      <div class="menu">
        <i class="el-icon-document icon"></i>
        <span>床位状态监控</span>
      </div>
    </router-link>
    <router-link to="/hAlertMonitor">
      <div class="menu">
        <i class="el-icon-document icon"></i>
        <span>24小时报警监控</span>
      </div>
    </router-link>
    <router-link to="/hSleepMonitor">
      <div class="menu">
        <i class="el-icon-document icon"></i>
        <span>24小时睡眠监控</span>
      </div>
    </router-link>
    <router-link to="/alertSearch">
      <div class="menu">
        <i class="el-icon-document icon"></i>
        <span>报警检索</span>
      </div>
    </router-link>
    <router-link to="/reportSearch">
      <div class="menu">
        <i class="el-icon-document icon"></i>
        <span>报告检索</span>
      </div>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'sidebar',
    data () {
      return {
        rIsShow: 1,
        isClose: false
      }
    },
    mounted(){
      this.animation()
    },
    methods: {
      animation(){
        let that = this;
        setInterval(fn,800)
        function fn() {
          that.rIsShow = ((that.rIsShow)%3)+1;
        }
      },
      changeSidebar () {
        let view = document.getElementById("view-wrap")
        let sidebar = document.getElementById("sidebar")
        let menus = document.getElementsByClassName("menu")
        if (this.isClose) {
          let width = 56
          var timer = setInterval(fn, 2)

          function fn() {
            width += 5
            view.style = "padding-left:" + width + "px;"
            if (width == 166) {
              clearInterval(timer)
            }
          }

          let swidth = 50
          var stimer = setInterval(sfn, 2)

          function sfn() {
            swidth += 5
            sidebar.style = "width:" + swidth + "px;"
            for (let i = 0; i < menus.length; i++) {
              menus[i].style = "width:" + swidth + "px;"
            }
            if (swidth == 160) {
              clearInterval(stimer)
            }
          }

        } else {
          view.style = "padding-left:56px;"
          let width = 166
          var timer2 = setInterval(fn2, 2)

          function fn2() {
            width -= 5
            view.style = "padding-left:" + width + "px;"
            if (width == 56) {
              clearInterval(timer2)
            }
          }

          let swidth = 160
          var stimer2 = setInterval(sfn2, 2)

          function sfn2() {
            swidth -= 5
            sidebar.style = "width:" + swidth + "px;"
            for (let i = 0; i < menus.length; i++) {
              menus[i].style = "width:" + swidth + "px;"
            }
            if (swidth == 50) {
              clearInterval(stimer2)
            }
          }
        }
        this.isClose = !this.isClose
      }
    }
  }
</script>

<style scoped>
  * {
    box-sizing: border-box;
  }

  .sidebar {
    position: fixed;
    top: 60px;
    left: 0;
    bottom: 0;
    width: 160px;
    background: #324157;
    z-index: 100;
  }

  .menu {
    height: 40px;
    line-height: 40px;
    width: 160px;
    background: #4A5064;
    text-align: left;
    padding-left: 20px;
    color: #fff;
    overflow: hidden;
    margin-top: 1px;
  }

  .menu span {
    color: #ddd;
  }

  .menu:hover span {
    color: #fff;
  }

  a.router-link-active .menu {
    background: #20A0FF;
  }

  a.router-link-active .menu span {
    color: #fff;
  }

  .icon {
    margin-right: 10px;
    color: #fff;
  }

  .icon-logo {
    margin-right: 6px;
  }

  .logo-menu {
    padding-left: 12px !important;
    cursor: pointer;
  }

  .icon-r {
    margin-left: -15px;
    color: #ddd;
    opacity: 0;
  }
  .rShow {
    opacity:1;
  }
</style>
