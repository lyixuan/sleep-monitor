<template>
  <div class="report-search">
    <s-navi :nData="navi_text"></s-navi>
    <div class="condition">
      <div class="area">
        <el-form label-position="right" label-width="100px" :model="form">
          <el-form-item label="原密码">
            <el-input type="password" v-model="form.old_pwd"></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input type="password" v-model="form.new_pwd"></el-input>
          </el-form-item>
          <el-form-item label="新密码确认">
            <el-input type="password" v-model="form.new_pwd2"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="submitForm">确 定</el-button>
          </el-form-item>

        </el-form>
      </div>

    </div>
  </div>
</template>

<script>
  import SNavi from '../components/Navi.vue'
  export default {
    name: 'search-index',
    components: {
      SNavi
    },
    data () {
      return {
        navi_text: {
          title: '修改密码',
          subTitle: '',
          btn: ''
        },
        form: {
          old_pwd: '',
          new_pwd: '',
          new_pwd2: ''
        }
      }
    },
    methods: {
      submitForm(){
        if (!this.form.old_pwd) {
          this.alertMsg("warning", '原密码不能为空')
          return
        }
        if (!this.form.new_pwd) {
          this.alertMsg("warning", '新密码不能为空')
          return
        }
        if (!this.form.new_pwd2) {
          this.alertMsg("warning", '确认密码不能为空')
          return
        }
        if (this.form.new_pwd!=this.form.new_pwd2) {
          this.alertMsg("warning", '新密码两次输入不一致')
          return
        }
        let u_session = JSON.parse(window.sessionStorage.getItem('u_session'))
        let param={
          old_pwd:this.form.old_pwd,
          new_pwd:this.form.new_pwd
        }
        this.$resource(P_OPTIONS + 'change_pwd').save({}, param).then((response) => {
          if (response.body.code == 200) {
            this.$alert('修改成功，请重新登录', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.logout()
              }
            });

          } else {
            this.alertMsg("error", response.body.msg?response.body.msg:'修改失败')
          }

        })
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
    }
  }
</script>

<style scoped>
  @import "../assets/css/chart-table-page-com.css";

  * {
    box-sizing: border-box;
  }

  .condition {
    margin-top: 5px;
    background: #fff;
    padding: 5px;
    min-height: 500px;
    overflow: hidden;
  }

  .area {
    width: 500px;
    margin: 0 auto;
    margin-top: 100px;
  }
</style>
