<template>
  <div class="report-search">
    <s-navi :nData="navi_text"></s-navi>
    <div style="width: 100%;height: 100%;">
      <div class="condition">
        <div class="bg-blue">级别设置</div>
        <div class="condition0 c1">
          <div class="rowbtn">
            <span @click="openJWD">新增机务段</span>
            <span @click="openCJ">新增车间</span>
            <span @click="openCD">新增车队</span>
            <span @click="openZDZ">新增指导组</span>
            <span @click="del">删除选中分级</span>
          </div>
          <el-tree
            :data="levels"
            :props="defaultProps"
            show-checkbox
            @check-change="handleCheckChange">
          </el-tree>
        </div>

        <div class="bg-blue" style="margin-top: 20px;">人员管理</div>
        <div class="condition0">
          <div class="people_search">
            搜索：
            <el-cascader :options="levels" change-on-select class="m-cas" size="small"
                         @change="peopleHandleChange" v-model="searchForm.level" placeholder="请依次选择级别"></el-cascader>
            <el-input class="m-input" size="small" placeholder="请输入工号或姓名" v-model="searchForm.cust_info"></el-input>
            <el-button type="primary" class="m-btn" @click="getPeople" size="small">搜索</el-button>
            <el-button class="m-btn" @click="clear" size="small">清除</el-button>
          </div>

          <el-table
            :data="custs" border
            style="width: 100%"
            :default-sort="{prop: 'cust_id', order: 'descending'}">
            <el-table-column
              prop="cust_id"
              label="工号"
              sortable
              width="180">
            </el-table-column>
            <el-table-column
              prop="cust_name"
              label="姓名"
              sortable
              width="180">
            </el-table-column>
            <el-table-column
              prop="workshop_des"
              label="车间" sortable>
            </el-table-column>
            <el-table-column
              prop="fleet_des"
              label="车队"
              sortable>
            </el-table-column>
            <el-table-column
              prop="group_des"
              label="指导组"
              sortable>
            </el-table-column>
            <el-table-column
              label="操作"
              width="120">
              <template scope="scope">
                <el-button
                  @click.native.prevent="openEdit(scope.$index, scope.row)"
                  type="text">
                  编辑
                </el-button>
                <el-button
                  @click.native.prevent="openDel(scope.$index, scope.row)"
                  type="text">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="addnew" @click="openAdd">
            + 新增人员
          </div>
          <el-pagination class="m-paging"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="currentPage"
                         :page-sizes="[10, 20, 30]"
                         :page-size="pageSize"
                         layout="total, sizes, prev, pager, next"
                         :total="totalNum">
          </el-pagination>
        </div>

      </div>

    </div>
    <!--新增dialog-->
    <el-dialog class="actEdit people_m" title="新增人员" :visible.sync="actAddDialog">
      <el-form :model="actAddForm">
        <el-form-item label="工号" :label-width="formLabelWidth" required>
          <el-input v-model="actAddForm.cust_id"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth" required>
          <el-input v-model="actAddForm.cust_name"></el-input>
        </el-form-item>
        <el-form-item label="分级" :label-width="formLabelWidth" required>
          <el-cascader :options="levels" change-on-select
                       @change="handleChange" placeholder="请依次选择级别"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="actAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd()">保 存</el-button>
      </div>
    </el-dialog>

    <!--编辑dialog-->
    <el-dialog class="actEdit people_m" title="编辑" :visible.sync="actEditDialog">
      <el-form :model="actEditForm">
        <el-form-item label="工号" :label-width="formLabelWidth">
          <el-input v-model="actEditForm.cust_id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth" required>
          <el-input v-model="actEditForm.cust_name"></el-input>
        </el-form-item>
        <el-form-item label="分级" :label-width="formLabelWidth" required>
          <el-cascader :options="levels" change-on-select v-model="actEditForm.levels"
                       @change="handleChange" placeholder="请依次选择级别"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="actEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit()">保 存</el-button>
      </div>
    </el-dialog>
    <!--删除dialog-->
    <el-dialog class="actEdit" title="删除人员" :visible.sync="actDelDialog">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您确定要删除 {{delName}} 吗? 删除后不可恢复。
      <div slot="footer" class="dialog-footer">
        <el-button @click="actDelDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveDel()">确 定</el-button>
      </div>
    </el-dialog>

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
        <el-form-item label="车间名" :label-width="formLabelWidth" required>
          <el-input v-model="actForm.show_name"></el-input>
        </el-form-item>
        <el-form-item label="所属机务段" :label-width="formLabelWidth" required>
          <el-cascader :options="level1" change-on-select
                       @change="handleChange2" v-model="actForm.upLevel"></el-cascader>
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
        <el-form-item label="车队名" :label-width="formLabelWidth" required>
          <el-input v-model="actForm.show_name"></el-input>
        </el-form-item>
        <el-form-item label="所属车间" :label-width="formLabelWidth" required>
          <el-cascader :options="level2" change-on-select
                       @change="handleChange2" v-model="actForm.upLevel"></el-cascader>
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
        <el-form-item label="指导组名" :label-width="formLabelWidth" required>
          <el-input v-model="actForm.show_name"></el-input>
        </el-form-item>
        <el-form-item label="所属车队" :label-width="formLabelWidth" required>
          <el-cascader :options="level3" change-on-select
                       @change="handleChange2" v-model="actForm.upLevel"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="actZDZDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveLV()">保 存</el-button>
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
        delLV: [],
        currentPage: 1,
        pageSize: 10,
        totalNum: 0,
        searchForm: {
          level: [],
          cust_info: ''
        }
      }
    },
    mounted () {
      this.getPeople();
      this.getLevels()
    },

    methods: {
      getPeople(type) {
        let params = {}
        if (type == 1) {
          // 点击分页
          params.page_size = this.pageSize
          params.current_page = this.currentPage
        } else {
          // 点击查询
          this.pageSize = 10
          this.currentPage = 1
          params.page_size = this.pageSize
          params.current_page = this.currentPage
        }
        params.level = this.searchForm.level
        params.cust_info = this.searchForm.cust_info
        this.$resource(P_OPTIONS + 'all_cust').save({}, params).then((response) => {
          if (response.body.code == 200) {
            this.custs = response.body.data.result
            this.paging(response.body.data.paging)
          } else {
            this.alertMsg("warning", '获取人员列表失败')
          }

        })
      },
      getLevels() {
        this.$resource(P_BASE + 'level_list').get().then((response) => {
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
              for (let j = 0; j < response.body.data[i].children.length; j++) {
                this.level2[i].children.push({
                  value: response.body.data[i].children[j].value,
                  label: response.body.data[i].children[j].label
                })
              }

            }
            for (let i = 0; i < response.body.data.length; i++) {
              this.level3.push({value: response.body.data[i].value, label: response.body.data[i].label})
              this.level3[i]['children'] = []
              for (let j = 0; j < response.body.data[i].children.length; j++) {
                this.level3[i].children.push({
                  value: response.body.data[i].children[j].value,
                  label: response.body.data[i].children[j].label
                })
                this.level3[i].children[j]['children'] = []
                for (let k = 0; k < response.body.data[i].children[j].children.length; k++) {
                  this.level3[i].children[j].children.push({
                    value: response.body.data[i].children[j].children[k].value,
                    label: response.body.data[i].children[j].children[k].label
                  })
                }
              }
            }
          } else {
            this.alertMsg("warning", '获取级别列表失败')
          }

        })
      },
      openAdd(){
        this.actAddForm = {
          cust_id: '',
          cust_name: '',
          levels: []
        };
        this.actAddDialog = true
      },
      saveAdd(){
        if (!this.actAddForm.cust_id || !this.actAddForm.cust_name || !this.actAddForm.levels) {
          this.alertMsg("warning", '请填写必填项');
          return
        }
        let _this = this;
        this.$resource(P_OPTIONS + 'add_cust').save({}, this.actAddForm).then((response) => {
          if (response.body.code == 200) {
            _this.alertMsg("success", '添加成功');
            _this.actAddDialog = false;
            _this.getPeople()

          } else {
            _this.alertMsg("error", response.body.msg ? response.body.msg : '服务器端错误')
          }
        }, (response) => {
          console.log(response.body)
        })
      },
      openEdit(index, row){
        this.actEditDialog = true;
        this.actEditForm = {
          cust_id: row.cust_id,
          cust_name: row.cust_name,
          levels: [row.depot_id, row.workshop_id, row.group_id, row.fleet_id]
        }
      },
      saveEdit(){
        if (!this.actEditForm.cust_id || !this.actEditForm.cust_name || !this.actEditForm.levels) {
          this.alertMsg("warning", '请填写必填项');
          return
        }
        let _this = this;
        this.$resource(P_OPTIONS + 'edit_cust').save({}, this.actAddForm).then((response) => {
          if (response.body.code == 200) {
            _this.alertMsg("success", '保存成功');
            _this.actEditDialog = false;
            _this.getPeople()

          } else {
            _this.alertMsg("error", response.body.msg ? response.body.msg : '服务器端错误')
          }
        }, (response) => {
          console.log(response.body)
        })
      },
      openDel(index, row){
        this.delName = row.cust_name;
        this.delId = row.cust_id;
        this.actDelDialog = true
      },
      saveDel(){
        let _this = this;
        this.$resource(P_OPTIONS + 'del_cust').get({cust_id: this.delId}).then((response) => {
          if (response.body.code == 200) {
            _this.alertMsg("success", '删除成功');
            _this.getPeople()
            _this.actDelDialog = false
          } else {
            _this.alertMsg("warning", '删除人员信息有误')
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
      handleCheckChange(data, checked, indeterminate) {
        if (checked) {
          this.delLV.push(data.value)
        }
        if (!checked) {
          for (var i = 0; i < this.delLV.length; i++) {
            if (this.delLV[i] == data.value) {
              this.delLV.splice(i, 1);
            }
          }
        }
      },
      del(){
        let _this = this;
        if (this.delLV.length == 0) {
          _this.alertMsg("warning", '请勾选删除对象');
          return
        } else {
          this.$confirm('此操作将删除本级别及其下级的内容, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$resource(P_OPTIONS + 'del_level').save({}, {ids: this.delLV}).then((response) => {
              if (response.body.code == 200) {
                _this.alertMsg("success", '删除成功');
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

      },
      clear(){
        this.searchForm = {
          level: [],
          cust_info: ''
        }
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getPeople(1)
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getPeople(1)
      },
      paging(p){
        this.totalNum = p.total_num;
      },
      peopleHandleChange(value){
        this.searchForm.level = value
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
