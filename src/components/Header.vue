<template>
  <div class="header">
    <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <div class="app-name">
        <img :src="logo_url" height="30" class="h_logo"/>
        <span class="app-name-text">{{app_name}}</span> <span class="app-sub-name">[{{depot_des}}]</span>
      </div>
      <el-menu-item index="2" style="display: none;">

      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">{{s_name}}</template>
        <el-menu-item index="1-1" @click="toChange">修改密码</el-menu-item>
        <el-menu-item index="1-2" @click="logout">退出</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  import router from '../router'
  export default {
    name: 'header',
    data () {
      return {
        activeIndex: '1',
        s_name: '未登录',
        depot_des: '未知',
        app_name:'',
        logo_url: 'x.png'
      }
    },
    mounted (){
      this.getSession()
    },
    methods: {
      getSession(){
        let u_session = JSON.parse(window.sessionStorage.getItem('u_session'))
        if (u_session) {
          this.s_name = u_session.user_name
          this.depot_des = u_session.depot_des
          this.app_name = u_session.app_name
          this.logo_url = u_session.logo_url
        } else {
          var url = window.location.href.substring(0, window.location.href.indexOf(window.location.pathname) + 1) + "login.php";
          window.location.href = url;
        }
      },
      logout(){
        this.$resource(P_LOGIN + 'logout').get().then((response) => {
          if (response.body.code == 200) {
            sessionStorage.removeItem('u_session')
            var url = window.location.href.substring(0, window.location.href.indexOf(window.location.pathname) + 1) + "login.php";
            window.location.href = url;
          } else {
            this.alertMsg("error", response.status + " - " + response.url)
          }
        })
      },
      toChange(){
        router.push('change_pwd')
      }
    }
  }
</script>

<style scoped>
  * {
    box-sizing: border-box;
  }

  .header {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 1000;
  }

  .app-name{
    height: 50px;
    float: left;
    cursor: pointer;
  }
  .app-name-text{
    display: inline-block;
    margin-top: 10px;
    margin-right: 5px;
    font-size: 20px;
    color: #eee;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }
  .app-sub-name{
    display: inline-block;
    color: #cecece;
  }
  .h_logo {
    float: left;
    margin-right: 5px;
    margin-left: 10px;
    margin-top: 10px;
  }
</style>
