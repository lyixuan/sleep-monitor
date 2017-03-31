<template>
  <div class="header">
    <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" >
      <el-menu-item index="2"><i><img src="../assets/img-com/logo.png" alt="logo" style="vertical-align: top;margin-top: 5px;margin-left: -10px;margin-right: 5px;" height="40"><img src="../assets/img-com/logo-wenzi.png" alt="睡眠监测管理系统" height="30" style="vertical-align: top;margin-top: 10px;"></i></el-menu-item>
      <el-submenu index="1">
        <template slot="title">{{s_name}}</template>
        <el-menu-item index="1-1">系统配置</el-menu-item>
        <el-menu-item index="1-2">退出</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: 'header',
    data () {
      return {
        activeIndex:'1',
        s_name: '未登录'
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
        } else {
          window.location.href = window.location.href.replace('app.html', 'login.html')
        }
      },
      handleSelect(key, keyPath) {
        if ('logout' == key) {
          this.$resource(PATH_LOGIN + 'logout').get().then((response) => {
            if (response.status == 200) {
              sessionStorage.removeItem('uusessions')
              var url = window.location.href.substring(0, window.location.href.indexOf(window.location.pathname) + 1) + "login.html";
              window.location.href = url;
            } else {
              this.alertMsg("error", response.status + " - " + response.url)
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  .header{
    position: fixed;
    left: 0;
    right: 0;
    z-index: 1000;
  }

</style>
