<template>
  <div class="header">
    <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="2"><i style="vertical-align: text-bottom; "><img :src="logo_url"  class="h_logo"
                                                                   height="30">
        <img src="../assets/img-com/logo-wenzi.png" height="30"
             class="h_logo_text">[{{apart_name}}机务段]</i></el-menu-item>
      <el-submenu index="1">
        <template slot="title">{{s_name}}</template>
        <el-menu-item index="1-1">系统配置</el-menu-item>
        <el-menu-item index="1-2" @click="logout">退出</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: 'header',
    data () {
      return {
        activeIndex: '1',
        s_name: '未登录',
        apart_name: '未知',
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
          this.apart_name = u_session.apart_name
          this.logo_url = u_session.logo_url
        } else {
          var url = window.location.href.substring(0, window.location.href.indexOf(window.location.pathname) + 1) + "login.html";
          window.location.href = url;

//          window.location.href = window.location.href.replace('app.html', 'login.html')
        }
      },
      logout(){
        this.$resource(P_LOGIN + 'logout').get().then((response) => {
          if (response.body.code == 200) {
            sessionStorage.removeItem('u_session')
            var url = window.location.href.substring(0, window.location.href.indexOf(window.location.pathname) + 1) + "login.html";
            window.location.href = url;

//            window.location.href = window.location.href.replace('app.html', 'login.html')
          } else {
            this.alertMsg("error", response.status + " - " + response.url)
          }
        })
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

  .h_logo {
    vertical-align: middle;
    margin-left: -10px;
    margin-right: 5px;
  }

  .h_logo_text {
    vertical-align: middle;
    margin-right: 5px;
    margin-top: -3px;
  }

</style>
