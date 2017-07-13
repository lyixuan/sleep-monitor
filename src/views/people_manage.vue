<template>
  <div class="report-search">
    <s-navi :nData="navi_text"></s-navi>
    <div style="width: 100%;height: 100%;">
      <div class="condition">
        <div class="bg-blue">级别设置</div>
        <div class="condition0">
          <div class="itm">
            <p class="tt">机务段</p>
            <p class="con" v-for="item in levels">{{item.label}}</p>
          </div>
          <div class="itm">
            <p class="tt">车间</p>
          </div>
          <div class="itm">
            <p class="tt">车队</p>
          </div>
          <div class="itm">
            <p class="tt">指导组</p>
          </div>
        </div>

        <div class="bg-blue" style="margin-top: 20px;">人员管理</div>
        <div class="condition0">
          <!--<div class="left_card">-->
            <!--<div class="r_tt">账号列表</div>-->
            <!--<p v-for="item in accounts" :keys="item.id" @click="checkUser(item)"-->
               <!--:class="{ active: item.id==checkedBtnId?true:false }">-->
              <!--<span class="r_name">{{item.user_name}}</span>-->
            <!--</p>-->
          <!--</div>-->
          <!--<div class="right_card">-->
            <!--<div class="r_tt">菜单权限 &nbsp; [{{checkedBtnName}}]</div>-->
            <!--<el-checkbox-group v-model="checkMenuList" v-loading="loading">-->
              <!--<el-checkbox :label=item.value v-for="item in menus">{{item.name}}</el-checkbox>-->
            <!--</el-checkbox-group>-->
            <!--</p>-->
            <!--<el-button type="primary" class="m-btn" @click="saveRights()">保存权限</el-button>-->
          <!--</div>-->
        </div>


      </div>
    </div>
    <!--&lt;!&ndash;编辑dialog&ndash;&gt;-->
    <!--<el-dialog class="actEdit" title="编辑" :visible.sync="actEditDialog">-->
      <!--<el-form :model="actEditForm">-->
        <!--<el-form-item label="ID" :label-width="formLabelWidth">-->
          <!--<el-input v-model="actEditForm.id" :disabled="true"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="登录账号" :label-width="formLabelWidth">-->
          <!--<el-input v-model="actEditForm.user_name"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="备注" :label-width="formLabelWidth">-->
          <!--<el-input v-model="actEditForm.comment"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="状态" :label-width="formLabelWidth">-->
          <!--<el-select v-model="actEditForm.status" placeholder="请选择状态">-->
            <!--<el-option label="开启" value="1"></el-option>-->
            <!--<el-option label="停用" value="0"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="actEditDialog = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="saveAccountEdit()">确 定</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->

    <!--&lt;!&ndash;新增dialog&ndash;&gt;-->
    <!--<el-dialog class="actEdit" title="新建账号" :visible.sync="actAddDialog">-->
      <!--<el-form :model="actAddForm">-->
        <!--<el-form-item label="登录账号" :label-width="formLabelWidth">-->
          <!--<el-input v-model="actAddForm.user_name"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="备注" :label-width="formLabelWidth">-->
          <!--<el-input v-model="actAddForm.comment"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="状态" :label-width="formLabelWidth">-->
          <!--<el-select v-model="actAddForm.status" placeholder="请选择状态">-->
            <!--<el-option label="开启" value="1"></el-option>-->
            <!--<el-option label="停用" value="0"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="actAddDialog = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="saveAccountAdd()">确 定</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->


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
          title: '人员管理',
          subTitle: '',
          btn: ''
        },
        levels: [],

      }
    },
    mounted () {
      this.getLevels();
    },

    methods: {
      getLevels() {
        this.$resource(P_BASE + 'level_list').get().then((response) => {
          if (response.body.code == 200) {
            this.levels = response.body.data
          } else {
            this.alertMsg("warning", '获取级别列表失败')
          }

        })
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
    overflow: hidden;

  }

  .itm{
    border: 2px solid #1c8de0;
    height: 300px;
    width: 23%;
    margin-left: 1%;
    float: left;
    border-radius: 4px;
    overflow: auto;

  }
  .itm .tt{
    width: 100%;
    text-align: center;
    margin: 10px 0;
    color: #1c8de0;
    font-size: 14px;
  }
  .itm .con{
    height: 30px;
    line-height: 30px;
    background: #E7F4FA;
    margin-bottom: 1px;
    cursor: pointer;
    text-align: center;
  }

  .itm .con:hover {
    background: #42A4D3;
    color: #fff;
  }

</style>
