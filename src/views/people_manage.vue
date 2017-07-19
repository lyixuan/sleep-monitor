<template>
  <div class="report-search">
    <!--<s-navi :nData="navi_text"></s-navi>-->
    <div style="width: 100%;height: 100%;">
      <div class="condition">
        <div class="bg-blue">司乘人员管理</div>
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

      handleChange(value){
        this.actAddForm.levels = value
      },
      handleChange2(value){
        this.actForm.upLevel = value
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
