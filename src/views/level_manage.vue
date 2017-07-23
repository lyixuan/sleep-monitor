<template>
  <div class="report-search">
    <!--<s-navi :nData="navi_text"></s-navi>-->
    <div style="width: 100%;height: 100%;">
      <div class="condition">
        <div class="bg-blue">级别设置</div>
        <div class="condition0 c1">
          <div class="rowbtn">
            <span @click="openJWD">新增机务段</span>
            <span @click="openCJ">新增车间</span>
            <span @click="openCD">新增车队</span>
            <span @click="openZDZ">新增指导组</span>
            <span @click="openDel">删除分级</span>
          </div>
          <el-tree
            :data="levels"
            :props="defaultProps"
            highlight-current
            :check-strictly="true"
            default-expand-all>
          </el-tree>
        </div>
      </div>
    </div>

    <!--*******************************************-->


    <!--机务段dialog-->
    <el-dialog class="actEdit people_m" title="新增机务段" :visible.sync="actJWDDialog">
      <el-form :model="actForm">
        <el-form-item label="机务段名" :label-width="formLabelWidth" required>
          <el-input v-model="actForm.show_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="actJWDDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveLV(1)">保 存</el-button>
      </div>
    </el-dialog>

    <!--车间dialog-->
    <el-dialog class="actEdit people_m" title="新增车间" :visible.sync="actCJDialog">
      <el-form :model="actForm">
        <el-form-item label="所属机务段" :label-width="formLabelWidth" required>
          <el-cascader :options="level1" change-on-select
                       @change="handleChange2" v-model="actForm.upLevel"></el-cascader>
        </el-form-item>
        <el-form-item label="车间名" :label-width="formLabelWidth" required>
          <el-input v-model="actForm.show_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="actCJDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveLV()">保 存</el-button>
      </div>
    </el-dialog>

    <!--车对dialog-->
    <el-dialog class="actEdit people_m" title="新增车队" :visible.sync="actCDDialog">
      <el-form :model="actForm">
        <el-form-item label="所属车间" :label-width="formLabelWidth" required>
          <el-cascader :options="level2" change-on-select
                       @change="handleChange2" v-model="actForm.upLevel"></el-cascader>
        </el-form-item>
        <el-form-item label="车队名" :label-width="formLabelWidth" required>
          <el-input v-model="actForm.show_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="actCDDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveLV()">保 存</el-button>
      </div>
    </el-dialog>

    <!--指导组dialog-->
    <el-dialog class="actEdit people_m" title="新增指导组" :visible.sync="actZDZDialog">
      <el-form :model="actForm">
        <el-form-item label="所属车队" :label-width="formLabelWidth" required>
          <el-cascader :options="level3" change-on-select
                       @change="handleChange2" v-model="actForm.upLevel"></el-cascader>
        </el-form-item>
        <el-form-item label="指导组名" :label-width="formLabelWidth" required>
          <el-input v-model="actForm.show_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="actZDZDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveLV()">保 存</el-button>
      </div>
    </el-dialog>

    <!--删除dialog-->
    <el-dialog class="actEdit people_m" title="删除分级" :visible.sync="delDialog">
      <el-form :model="delForm">
        <el-form-item label="选择分级" :label-width="formLabelWidth" required>
          <el-cascader :options="levels" change-on-select
                       @change="delHandleChange" v-model="delForm.delId"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveDel()">删  除</el-button>
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
          title: '人员管理',
          subTitle: '',
          btn: ''
        },
        formLabelWidth: '120px',

        custs: [],
        actAddDialog: false,
        actAddForm: {
          cust_id: '',
          cust_name: '',
          levels: []
        },
        actEditDialog: false,
        actEditForm: {
          cust_id: '',
          cust_name: '',
          levels: []
        },
        actDelDialog: false,
        delName: '',
        delId: '',
        // 分级
        levels: [],
        level1: [],
        level2: [],
        level3: [],
        actCJDialog: false,
        actCDDialog: false,
        actZDZDialog: false,
        actJWDDialog: false,
        actForm: {
          show_name: '',
          upLevel: []
        },
        defaultProps: {
          children: 'children',
          label: 'label',
          id: 'value',
        },
        delDialog:false,
        delForm:{
          delId:[]
        }
      }
    },
    mounted () {
      this.getLevels()
    },

    methods: {
      getLevels() {
        this.$resource(P_BASE2 + 'level_list').get().then((response) => {
          if (response.body.code == 200) {
            this.levels = response.body.data
            this.level1 = []
            this.level2 = []
            this.level3 = []
            for (let i = 0; i < response.body.data.length; i++) {
              this.level1.push({value: response.body.data[i].value, label: response.body.data[i].label})
            }
            for (let i = 0; i < response.body.data.length; i++) {
              this.level2.push({value: response.body.data[i].value, label: response.body.data[i].label})
              this.level2[i]['children'] = []
              if(response.body.data[i].children){
                for (let j = 0; j < response.body.data[i].children.length; j++) {
                  this.level2[i].children.push({
                    value: response.body.data[i].children[j].value,
                    label: response.body.data[i].children[j].label
                  })
                }
              }

            }
            for (let i = 0; i < response.body.data.length; i++) {
              this.level3.push({value: response.body.data[i].value, label: response.body.data[i].label})
              this.level3[i]['children'] = []
              if(response.body.data[i].children){
                for (let j = 0; j < response.body.data[i].children.length; j++) {
                  this.level3[i].children.push({
                    value: response.body.data[i].children[j].value,
                    label: response.body.data[i].children[j].label
                  })
                  this.level3[i].children[j]['children'] = []
                  if(response.body.data[i].children[j].children){
                    for (let k = 0; k < response.body.data[i].children[j].children.length; k++) {
                      this.level3[i].children[j].children.push({
                        value: response.body.data[i].children[j].children[k].value,
                        label: response.body.data[i].children[j].children[k].label
                      })
                    }
                  }
                }
              }
            }
          } else {
            this.alertMsg("warning", '获取级别列表失败')
          }

        })
      },
      openJWD(){
        this.actForm = {
          show_name: '',
          upLevel: []
        }
        this.actJWDDialog = true;
      },
      openCJ(){
        this.actForm = {
          show_name: '',
          upLevel: []
        }
        this.actCJDialog = true;
      },
      openCD(){
        this.actForm = {
          show_name: '',
          upLevel: []
        }
        this.actCDDialog = true;
      },
      openZDZ(){
        this.actForm = {
          show_name: '',
          upLevel: []
        }
        this.actZDZDialog = true;
      },
      saveLV(t){
        if (!this.actForm.show_name) {
          this.alertMsg("warning", '请填写必填项');
          return
        }
        if (!t && this.actForm.upLevel.length == 0) {
          this.alertMsg("warning", '请选中所属上级');
          return
        }
        let _this = this;
        this.$resource(P_OPTIONS + 'add_level').save({}, this.actForm).then((response) => {
          if (response.body.code == 200) {
            _this.alertMsg("success", '保存成功');
            _this.actCJDialog = false;
            _this.actCDDialog = false;
            _this.actZDZDialog = false;
            _this.actJWDDialog = false;
            _this.getLevels()
          } else {
            _this.alertMsg("error", response.body.msg ? response.body.msg : '服务器端错误')
          }
        }, (response) => {
          console.log(response.body)
        })
      },
      handleChange(value){
        this.actAddForm.levels = value
      },
      handleChange2(value){
        this.actForm.upLevel = value
      },
      delHandleChange(value){
        this.delForm.delId = value
      },
      openDel(){
        this.delDialog=true
        this.delForm={
          delId:[]
        }
      },
      saveDel(){
        let _this = this;
        if (this.delForm.delId.length==0) {
          _this.alertMsg("warning", '请选择删除的分级');
          return
        } else {

        }
        this.$confirm('此操作将删除本级及其所有下级, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$resource(P_OPTIONS + 'del_level').save({}, {del_level: this.delForm.delId}).then((response) => {
            if (response.body.code == 200) {
              _this.alertMsg("success", '删除成功');
              _this.delDialog=false
              _this.getLevels()
            } else {
              _this.alertMsg("warning", '删除人员信息有误')
            }

          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

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
    min-height: 600px;
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

  .addnew {
    margin-top: 10px;
    box-sizing: border-box;
    text-align: center;
    border: 1px solid #1c8de0;
    color: #1c8de0;
    cursor: pointer;
  }

  .addnew:hover {
    background: #1c8de0;
    color: #fff;
  }

  .accontMg > span {
    display: inline-block;
    width: 16%;

  }

  .rowbtn {
    width: 100%;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .rowbtn span {
    float: left;
    width: 100px;
    border: 1px solid #1c8de0;
    margin-left: 20px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 6px;
    color: #1d8ce0;
    cursor: pointer;

  }

  .rowbtn span:hover {
    background: #1c8de0;
    color: #fff;
  }

  .people_search {
    margin-bottom: 10px;
  }

  .m-cas {
    width: 400px;

  }

  .m-input {
    width: 150px;
  }

  .m-btn {
    float: right;
    margin-right: 3px;
  }
</style>
