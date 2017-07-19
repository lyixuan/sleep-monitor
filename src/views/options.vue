<template>
  <div class="report-search">
    <s-navi :nData="navi_text"></s-navi>
    <div style="width: 100%;height: 100%;">
      <div class="condition">
        <div class="bg-blue">账号管理</div>
        <div class="condition0">
          <div class="accontMg tt">
            <span>ID</span>
            <span>登录账号</span>
            <span>备注</span>
            <span>状态</span>
            <span>操作</span>
            <span>操作</span>
          </div>
          <div class="accontMg" v-for="item in accounts" :keys="item.id">
            <span>{{item.id}}</span>
            <span>{{item.user_name}}</span>
            <span>{{item.user_des}}</span>
            <span>{{item.status==0?'停用':'开启'}}</span>
            <span class="set" @click="openAccountEdit(item)">编辑</span>
            <span class="set" @click="accountResetPWD(item)">重置密码</span>
          </div>
          <div class="addnew" @click="openAccountAdd()">
            + 新增账号
          </div>
        </div>

        <div class="bg-blue" style="margin-top: 20px;">权限分配</div>
        <div class="condition0">
          <div class="left_card">
            <div class="r_tt">账号列表</div>
            <p v-for="item in accounts" :keys="item.id" @click="checkUser(item)"
               :class="{ active: item.id==checkedBtnId?true:false }">
              <span class="r_name">{{item.user_name}}</span>
            </p>
          </div>
          <div class="right_card">
            <div class="r_tt">菜单权限 &nbsp; [{{checkedBtnName}}]</div>
            <el-checkbox-group v-model="checkMenuList" v-loading="loading">
              <el-checkbox :label=item.value v-for="item in menus" :key="item.value">{{item.name}}</el-checkbox>
            </el-checkbox-group>
            </p>
            <el-button type="primary" class="m-btn" @click="saveRights()">保存权限</el-button>
          </div>
        </div>


      </div>
    </div>
    <!--编辑dialog-->
    <el-dialog class="actEdit" title="编辑" :visible.sync="actEditDialog">
      <el-form :model="actEditForm">
        <el-form-item label="ID" :label-width="formLabelWidth">
          <el-input v-model="actEditForm.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" :label-width="formLabelWidth">
          <el-input v-model="actEditForm.user_name"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="actEditForm.user_des"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="actEditForm.status" placeholder="请选择状态">
            <el-option label="开启" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="actEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveAccountEdit()">确 定</el-button>
      </div>
    </el-dialog>

    <!--新增dialog-->
    <el-dialog class="actEdit" title="新建账号" :visible.sync="actAddDialog">
      <el-form :model="actAddForm">
        <el-form-item label="登录账号" :label-width="formLabelWidth">
          <el-input v-model="actAddForm.user_name"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="actAddForm.user_des"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="actAddForm.status" placeholder="请选择状态">
            <el-option label="开启" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="actAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveAccountAdd()">确 定</el-button>
      </div>
    </el-dialog>

    <!--重置密码dialog-->
    <el-dialog class="actEdit" title="重置密码" :visible.sync="actResetDialog">
      密码重置后将设置为初始密码123456。确定要为 {{resetName}} 重置密码吗？
      <div slot="footer" class="dialog-footer">
        <el-button @click="actResetDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveReset()">确 定</el-button>
      </div>
    </el-dialog>
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
          title: '权限配置',
          subTitle: '',
          btn: ''
        },
        checkedBtnId: '',
        checkedBtnName: '',
        accounts: [],
        menus: [],
        formLabelWidth: '120px',
        actEditDialog: false,
        actEditForm: {
          id: '',
          user_name: '',
          user_des: '',
          status: ''
        },
        actAddDialog: false,
        actAddForm: {
          user_name: '',
          user_des: '',
          status: '1'
        },
        actResetDialog: false,
        resetId: '',
        resetName: '',
        checkMenuList: [],
        loading:false
      }
    },
    mounted () {
      this.getAccounts();
      this.getMenus();
    },

    methods: {
      getAccounts() {
        this.$resource(P_OPTIONS + 'get_accounts').get().then((response) => {
          if (response.body.code == 200) {
            this.accounts = response.body.data
            this.checkUser(response.body.data[0])
          } else {
            this.alertMsg("warning", '获取账号信息有误')
          }

        })
      },
      getMenus() {
        this.$resource(P_OPTIONS + 'menus').get().then((response) => {
          if (response.body.code == 200) {
            this.menus = response.body.data
          } else {
            this.alertMsg("warning", '获取菜单信息有误')
          }
        })
      },
      openAccountEdit(item){
        this.actEditForm = {
          id: item.id,
          user_name: item.user_name,
          user_des: item.user_des,
          status: item.status
        };
        this.actEditDialog = true
      },
      saveAccountEdit(){
        let _this = this;
        let param = this.actEditForm
        this.$resource(P_OPTIONS + 'edit_accounts').save({}, param).then((response) => {
          if (response.body.code == 200) {
            _this.alertMsg("success", '修改成功');
            _this.actEditDialog = false;
            _this.getAccounts()

          } else {
            _this.alertMsg("error", response.body.msg ? response.body.msg : '服务器端错误')
          }
        }, (response) => {
          console.log(response.body)
        })
      },
      openAccountAdd(){
        this.actAddForm = {
          user_name: '',
          user_des: '',
          status: '1'
        };
        this.actAddDialog = true
      },
      saveAccountAdd(){
        if (!this.actAddForm.user_name) {
          this.alertMsg("warning", '请填写登录账号')
          return
        }
        let param = this.actAddForm;
        let _this = this;
        this.$resource(P_OPTIONS + 'add_accounts').save({}, param).then((response) => {
          if (response.body.code == 200) {
            _this.alertMsg("success", '添加成功');
            _this.actAddDialog = false;
            _this.getAccounts()

          } else {
            _this.alertMsg("error", response.body.msg ? response.body.msg : '服务器端错误')
          }
        }, (response) => {
          console.log(response.body)
        })
      },
      accountResetPWD(item){
        this.resetName = item.user_name;
        this.resetId = item.id;
        this.actResetDialog = true
      },
      saveReset(){
        this.$resource(P_OPTIONS + 'reset_pwd').get({id: this.resetId}).then((response) => {
          if (response.body.code == 200) {
            this.alertMsg("success", '重置成功');
            this.actResetDialog = false
          } else {
            this.alertMsg("warning", '重置失败')
          }
        })
      },
      checkUser(item){
//          获取用户菜单权限
        this.loading=true
        this.checkedBtnId = item.id;
        this.checkedBtnName = item.user_name;
        this.$resource(P_OPTIONS + 'get_account_rights').get({id: item.id}).then((response) => {
          if (response.body.code == 200) {
            for (let i = 0; i < response.body.data.length; i++) {
              response.body.data[i]= response.body.data[i].toString()
            }
            this.checkMenuList = response.body.data
          } else {
            this.alertMsg("warning", '获取菜单权限有误')
          }
          this.loading=false
        })

      },
      saveRights(){
        let param = {
            id:this.checkedBtnId,
          rights:this.checkMenuList
        }
        let _this=this;
        this.$resource(P_OPTIONS + 'save_account_rights').save({}, param).then((response) => {
          if (response.body.code == 200) {
            _this.alertMsg("success", '权限保存成功');
          } else {
            _this.alertMsg("error", response.body.msg ? response.body.msg : '服务器端错误')
          }
        }, (response) => {
          console.log(response.body)
        })
      }
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
    overflow: hidden;
  }

  .bg-blue {
    background: #E7F4FA;
    color: #2195CB;
    height: 25px;
    line-height: 25px;
    padding-left: 5px;
    width: 100%;
  }

  .condition0 {
    width: 100%;
    padding: 10px;

  }

  .accontMg {
    overflow: hidden;
    height: 30px;
    line-height: 30px;
  }

  .tt {
    font-weight: bold;
  }

  .set {
    color: #1c8de0;
    cursor: pointer;
  }
  .set:hover{
    color: #000080;
  }
  .addnew {
    box-sizing: border-box;
    text-align: center;
    border: 1px solid #1c8de0;
    color: #1c8de0;
    cursor: pointer;
  }
  .addnew:hover{
    background: #1c8de0;
    color: #fff;
  }

  .accontMg > span {
    display: inline-block;
    width: 16%;

  }

  .left_card {
    width: 20%;
    margin-right: 8%;
    min-height: 300px;
    overflow: hidden;
    float: left;
    border-radius: 10px;
    padding: 20px;
    color: #333;
    font-size: 16px;
    text-align: center;
    border: 2px solid #E7F4FA;
  }

  .right_card {
    width: 70%;
    min-height: 300px;
    overflow: hidden;
    float: left;
    border: 2px solid #E7F4FA;
    border-radius: 10px;
    padding: 20px;
  }

  .left_card p {
    height: 30px;
    line-height: 30px;
    background: #E7F4FA;
    margin-bottom: 10px;
    cursor: pointer;
  }

  .left_card p:hover {
    background: #42A4D3;
    color: #fff;
  }

  .r_name {
    padding: 5px 10px;

  }

  .r_tt {
    text-align: center;
    background: #fff;
    margin-bottom: 20px;
    font-size: 14px;
    border-bottom: 1px solid #eee;
  }

  .m-btn {
    width: 120px;
    border-radius: 0;
    text-align: center;
    height: 30px;
    line-height: 5px;
    float: right;
    margin-right: 40%;
  }

  p.active {
    background: #42A4D3;
    color: #fff;
  }


</style>
