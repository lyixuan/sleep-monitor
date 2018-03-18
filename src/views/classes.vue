<template>
  <div class="report-search">
    <div style="width: 100%;height: 100%;">
      <div class="condition">
        <div class="bg-blue">排班设计</div>
        <el-button type="primary" class="m-btn" @click="openAdd" size="small">新增排班</el-button>
        <div class="condition0">
          <el-table :data="classes" border style="width: 100%" v-loading="tableLoading1" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
            <el-table-column prop="class_name" label="排班名称" width="180">
            </el-table-column>
            <el-table-column prop="sort" label="排班顺序" width="180">
            </el-table-column>
            <el-table-column prop="create_user" label="创建人" width="180">
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间">
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template scope="scope">
                <el-button @click.native.prevent="openAdd2(scope.row)" type="text">
                  增员
                </el-button>
                <el-button @click.native.prevent="openEdit(scope.$index, scope.row)" type="text">
                  编辑
                </el-button>
                <el-button @click.native.prevent="openDel(scope.$index, scope.row)" type="text">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="bg-blue">排班信息</div>
        <div class="condition0">
          <div class="rowbtn">
            <span v-for="item in classes" :class="{ activeClass: activeClassId === item.class_id }" @click="changeActiveClass(item)">{{item.class_name}}</span>
          </div>
          <el-table :data="peoples" style="width: 100%" border v-loading="tableLoading2" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
            <el-table-column prop="cust_id"  label="工号"></el-table-column>
            <el-table-column prop="cust_name"  label="姓名"></el-table-column>
            <el-table-column prop="apart_des" label="公寓" ></el-table-column>
            <el-table-column prop="room_des" label="房间"></el-table-column>
            <el-table-column prop="bed_des"  label="床位"></el-table-column>
            <el-table-column prop="train_des" label="班次"></el-table-column>
            <el-table-column prop="sche_begin_time" label="计划入寓时间"></el-table-column>
            <el-table-column prop="sche_end_time" label="计划出寓时间"></el-table-column>
            <el-table-column label="操作" width="110">
              <template scope="scope">
                <el-button @click.native.prevent="openEdit2(scope.row)" type="text">
                  编辑
                </el-button>
                <el-button @click.native.prevent="openDel2(scope.row)" type="text">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- class -->
    <!-- class -->
    <!-- class -->
    <!--新增dialog-->
    <el-dialog class="actEdit people_m" title="新增班级" :visible.sync="actAddDialog">
      <el-form :model="actAddForm">
        <el-form-item label="班级名称" :label-width="formLabelWidth" required>
          <el-input v-model="actAddForm.class_name" placeholder="请输入班级名称" ></el-input>
        </el-form-item>
        <el-form-item label="排班顺序" :label-width="formLabelWidth" required>
          <el-input-number v-model="actAddForm.sort" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="actAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd()">保 存</el-button>
      </div>
    </el-dialog>

    <!--编辑dialog-->
    <el-dialog class="actEdit people_m" title="编辑班级" :visible.sync="actEditDialog">
      <el-form :model="actEditForm">
        <el-form-item label="班级名称" :label-width="formLabelWidth">
          <el-input v-model="actEditForm.class_name" placeholder="请输入班级名称" ></el-input>
        </el-form-item>
        <el-form-item label="排班顺序" :label-width="formLabelWidth" required>
          <el-input-number v-model="actEditForm.sort" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="actEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit()">保 存</el-button>
      </div>
    </el-dialog>
    <!--删除dialog-->
    <el-dialog class="actEdit" title="删除人员" :visible.sync="actDelDialog">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您确定要删除【{{delName}}】吗? 删除班级后，该班级下的人员分配信息也将一并删除！
      <div slot="footer" class="dialog-footer">
        <el-button @click="actDelDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveDel()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- people -->
    <!-- people -->
    <!-- people -->
    <el-dialog class="actEdit people_m" title="新增人员" :visible.sync="actAddDialog2">
      <el-form :model="actAddForm2">
        <el-form-item label="工号" :label-width="formLabelWidth" required>
          <el-input v-model="actAddForm2.cust_id" auto-complete="on"></el-input>
          <el-button style="margin-top:10px;" @click="getDetailByCustId()">获取人员信息</el-button>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth" required>
          <el-input v-model="actAddForm2.cust_name" auto-complete="on" placeholder="姓名信息根据工号查出" ></el-input>
        </el-form-item>
        <el-form-item label="公寓" :label-width="formLabelWidth" required>
          <el-select v-model="actAddForm2.apart_id" placeholder="请选择公寓" width="100%">
            <el-option
              v-for="item in apartList"
              :key="item.apart_id"
              :label="item.apart_des"
              :value="item.apart_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间" :label-width="formLabelWidth" required>
          <el-select v-model="actAddForm2.room_id" placeholder="请选择公寓后选房间" width="100%">
            <el-option
              v-for="item in roomList"
              :key="item.room_id"
              :label="item.room_des"
              :value="item.room_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="床位" :label-width="formLabelWidth" required>
          <el-select v-model="actAddForm2.bed_id" placeholder="请选择房间后选床位" width="100%">
            <el-option
              v-for="item in bedList"
              :key="item.bed_id"
              :label="item.bed_des"
              :value="item.bed_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班次" :label-width="formLabelWidth" required>
          <el-input v-model="actAddForm2.train_des" placeholder="请输入班次" ></el-input>
        </el-form-item>
        <el-form-item label="计划入寓时间" :label-width="formLabelWidth" required>
          <el-time-picker v-model="actAddForm2.sche_begin_time" placeholder="请选择时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="计划出寓时间" :label-width="formLabelWidth" required>
          <el-time-picker v-model="actAddForm2.sche_end_time" placeholder="请选择时间">
          </el-time-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="actAddDialog2 = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd2()">保 存</el-button>
      </div>
    </el-dialog>

    <!--编辑dialog-->
    <el-dialog class="actEdit people_m" title="编辑人员信息" :visible.sync="actEditDialog2">
      <el-form :model="actEditForm2">
        <el-form-item label="工号" :label-width="formLabelWidth" required>
          <div>{{actEditForm2.cust_id}}</div>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth" required>
          <div>{{actEditForm2.cust_name}}</div>
        </el-form-item>
        <el-form-item label="公寓" :label-width="formLabelWidth" required>
          <el-select v-model="actEditForm2.apart_id" placeholder="请选择公寓" width="100%">
            <el-option
              v-for="item in apartList"
              :key="item.apart_id"
              :label="item.apart_des"
              :value="item.apart_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间" :label-width="formLabelWidth" required>
          <el-select v-model="actEditForm2.room_id" placeholder="请选择公寓后选房间" width="100%">
            <el-option
              v-for="item in roomList"
              :key="item.room_id"
              :label="item.room_des"
              :value="item.room_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="床位" :label-width="formLabelWidth" required>
          <el-select v-model="actEditForm2.bed_id" placeholder="请选择房间后选床位" width="100%">
            <el-option
              v-for="item in bedList"
              :key="item.bed_id"
              :label="item.bed_des"
              :value="item.bed_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班次" :label-width="formLabelWidth" required>
          <el-input v-model="actEditForm2.train_des" placeholder="请输入班次" ></el-input>
        </el-form-item>
        <el-form-item label="计划入寓时间" :label-width="formLabelWidth" required>
          <el-time-picker v-model="actEditForm2.sche_begin_time" placeholder="请选择时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="计划出寓时间" :label-width="formLabelWidth" required>
          <el-time-picker v-model="actEditForm2.sche_end_time" placeholder="请选择时间">
          </el-time-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="actEditDialog2 = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit2()">保 存</el-button>
      </div>
    </el-dialog>
    <!--删除dialog-->
    <el-dialog class="actEdit" title="删除人员" :visible.sync="actDelDialog2">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您确定要将【{{delName2}}】从排班里删除吗?
      <div slot="footer" class="dialog-footer">
        <el-button @click="actDelDialog2 = false">取 消</el-button>
        <el-button type="primary" @click="saveDel2()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'search-index',
    data () {
      return {
        formLabelWidth: '120px',

        classes: [],
        peoples: [],
        // ----------------------form2
        actAddDialog: false,
        actAddForm: {
          class_name: '',
          sort: 1
        },
        actEditDialog: false,
        actEditForm: {
          class_id: '',
          class_name: '',
          sort: 1
        },
        actDelDialog: false,
        delName: '',
        delId: '',
        // ---------------------form1
        actAddDialog2: false,
        actAddForm2: {
          cust_id: '',
          cust_name: '',
          apart_id: '',
          room_id: '',
          bed_id: '',
          train_des: '',
          sche_begin_time: new Date(),
          sche_end_time: new Date(),
        },
        actEditDialog2: false,
        actEditForm2: {
          data_id: '',
          cust_id: '',
          cust_name: '',
          apart_id: '',
          room_id: '',
          bed_id: '',
          train_des: '',
          sche_begin_time: '',
          sche_end_time: '',
        },
        actDelDialog2: false,
        delName2: '',
        delId2: '',
        // ---------------------list
        apartList: [],
        roomList: [],
        bedList: [],
        class_id: '',         // 给某class_id添加人员
        activeClassId: '',
        // --------
        tableLoading1: false,
        tableLoading2: false,
      }
    },
    mounted () {
      this.getClasses();
      this.getApartList();
    },
    watch: {
      'actAddForm2.apart_id'(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.getRoomList(newVal);
          this.actAddForm2.room_id = '';
          this.actAddForm2.bed_id = '';
          this.bedList = [];
        }
      },
      'actAddForm2.room_id'(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.getBedList(this.actAddForm2.apart_id ,newVal);
          this.actAddForm2.bed_id = '';
        }
      },
      'actEditForm2.apart_id'(newVal, oldVal) {
        if (oldVal && newVal !== oldVal) {
          this.getRoomList(newVal);
          this.actEditForm2.room_id = null;
          this.actEditForm2.bed_id = null;
          this.bedList = [];
        }
      },
      'actEditForm2.room_id'(newVal, oldVal) {
        if ((oldVal || oldVal === null) && newVal !== oldVal) {
          this.getBedList(this.actEditForm2.apart_id ,newVal);
          this.actEditForm2.bed_id = '';
        }
      }
    },
    methods: {
      getClasses() {
        this.tableLoading1 = true;
        this.$resource(P_CLASSES + 'get_class').get().then((response) => {
          if (response.body.code == 200) {
            this.classes = response.body.data.result
            if (this.classes.length > 0) {
              this.activeClassId = this.classes[0].class_id;
              this.getPeoples(this.activeClassId);
            }
          } else {
            this.alertMsg("warning", '获取数据失败')
          }
          this.tableLoading1 = false;
        })
      },
      getPeoples(classId) {
        this.tableLoading2 = true;
        this.$resource(P_CLASSES + 'get_cust_in_baseclass').get({class_id: classId}).then((response) => {
          if (response.body.code == 200) {
            this.peoples = response.body.data.result
          } else {
            this.alertMsg("warning", '获取数据失败')
          }
          this.tableLoading2 = false;
        })
      },
      openAdd(){
        this.actAddForm = {
          class_name: '',
          sort: this.classes.length > 0 ?parseInt(this.classes[this.classes.length - 1].sort) + 1 : 1,
        };
        this.actAddDialog = true
      },
      openAdd2(row){
        this.actAddForm2 = {
          class_id: row.class_id,
          cust_id: '',
          cust_name: '',
          apart_id: '',
          room_id: '',
          bed_id: '',
          train_des: '',
          sche_begin_time:  '',
          sche_end_time: '',
        };
        this.actAddDialog2 = true
      },
      saveAdd(){
        let f = 0;
        this.classes.forEach((v) => {
          if (v.sort == this.actAddForm.sort) {
            f = 1;
          }
        });
        if (!this.actAddForm.class_name || !this.actAddForm.sort) {
          this.alertMsg("warning", '请填写必填项');
          return
        }
        if (f) {
          this.alertMsg("warning", '该班级排序已存在，不能重复！');
          return
        }
        let _this = this;
          this.$resource(P_CLASSES + 'add_class').save({}, this.actAddForm).then((response) => {
          if (response.body.code == 200) {
            _this.alertMsg("success", '添加成功');
            _this.actAddDialog = false;
            _this.getClasses()

          } else {
            _this.alertMsg("error", response.body.msg ? response.body.msg : '服务器端错误')
          }
        }, (response) => {
          console.log(response.body)
        })
      },
      saveAdd2(){
        if (!this.actAddForm2.cust_id || !this.actAddForm2.cust_name || !this.actAddForm2.apart_id || ! this.actAddForm2.bed_id || !this.actAddForm2.train_des || !this.actAddForm2.sche_begin_time || !this.actAddForm2.sche_end_time) {
          this.alertMsg("warning", '请填写必填项');
          return
        }
        let _this = this;
        this.actAddForm2.sche_begin_time = new Date(this.actAddForm2.sche_begin_time).Format("hh:mm:ss");
        this.actAddForm2.sche_end_time = new Date(this.actAddForm2.sche_end_time).Format("hh:mm:ss")
        this.$resource(P_CLASSES + 'add_cust_in_baseclass').save({}, this.actAddForm2).then((response) => {
          if (response.body.code == 200) {
            _this.alertMsg("success", '添加成功');
            _this.actAddDialog2 = false;
            _this.getPeoples(this.activeClassId);

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
          class_id: row.class_id,
          class_name: row.class_name,
          sort: row.sort,
        }
      },
      openEdit2(row){
        this.actEditDialog2 = true;
        this.actEditForm2 = {
          data_id: row.data_id,
          cust_id: row.cust_id,
          cust_name: row.cust_name,
          apart_id: row.apart_id,
          room_id: row.room_id,
          bed_id: row.bed_id,
          train_des: row.train_des,
          sche_begin_time: new Date('2017-01-01 '+row.sche_begin_time),
          sche_end_time: new Date('2017-01-01 '+row.sche_end_time),
        };
        this.getRoomList(row.apart_id);
        this.getBedList(row.apart_id ,row.room_id);
      },
      saveEdit(){
        let _this = this;
        let f = 0;
        this.classes.forEach((v) => {
          if (v.class_id != this.actEditForm.class_id && v.sort == this.actEditForm.sort) {
            f = 1;
          }
        });
        if (!this.actEditForm.class_name || !this.actEditForm.sort) {
          this.alertMsg("warning", '请填写必填项');
          return
        }
        if (f) {
          this.alertMsg("warning", '该班级排序已存在，不能重复！');
          return
        }
        this.$resource(P_CLASSES + 'update_class').save({}, this.actEditForm).then((response) => {
          if (response.body.code == 200) {
            _this.alertMsg("success", '保存成功');
            _this.actEditDialog = false;
            _this.getClasses()

          } else {
            _this.alertMsg("error", response.body.msg ? response.body.msg : '服务器端错误')
          }
        }, (response) => {
          console.log(response.body)
        })
      },
      saveEdit2(){
        if (!this.actEditForm2.cust_id || !this.actEditForm2.cust_name || !this.actEditForm2.apart_id || ! this.actEditForm2.bed_id || !this.actEditForm2.train_des || !this.actEditForm2.sche_begin_time || !this.actEditForm2.sche_end_time) {
          this.alertMsg("warning", '请填写必填项');
          return
        }
        this.actEditForm2.sche_begin_time = new Date(this.actEditForm2.sche_begin_time).Format("hh:mm:ss");
        this.actEditForm2.sche_end_time = new Date(this.actEditForm2.sche_end_time).Format("hh:mm:ss")
        this.$resource(P_CLASSES + 'update_cust_in_baseclass').save({}, this.actEditForm2).then((response) => {
          if (response.body.code == 200) {
            this.alertMsg("success", '更新成功');
            this.actEditDialog2 = false;
            this.getPeoples(this.activeClassId);

          } else {
            this.alertMsg("error", response.body.msg ? response.body.msg : '服务器端错误')
          }
        }, (response) => {
          console.log(response.body)
        })
      },
      openDel(index, row){
        this.delName = row.class_name;
        this.delId = row.class_id;
        this.actDelDialog = true
      },
      openDel2(row) {
        this.actDelDialog2 = true
        this.delName2 = row.cust_name;
        this.delId2 = row.data_id;
      },
      saveDel(){
        let _this = this;
        this.$resource(P_CLASSES + 'delete_class').get({class_id: this.delId}).then((response) => {
          if (response.body.code == 200) {
            _this.alertMsg("success", '删除成功');
            _this.getClasses()
            _this.actDelDialog = false
          } else {
            _this.alertMsg("warning", '删除人员信息有误')
          }

        })
      },
      saveDel2(){
        let _this = this;
        this.$resource(P_CLASSES + 'delete_cust_in_baseclass').get({data_id: this.delId2}).then((response) => {
          if (response.body.code == 200) {
            _this.alertMsg("success", '删除成功');
            _this.getPeoples(this.activeClassId);
            _this.actDelDialog2 = false
          } else {
            _this.alertMsg("warning", '删除人员信息有误')
          }

        })
      },
      querySearchAsync(queryString, cb) {
        clearTimeout(this.timer)
        this.timer = setTimeout(query, 1000);
        let that = this

        function query() {
          let results = [];
          that.$resource(P_BASE + 'bed_no_list').get({bed_id_like: queryString}).then((response) => {
            results = response.body.data;
            cb(results);
          })
        }
      },
      getDetailByCustId(){
        let _this = this;
        if (this.actAddForm2.cust_id) {
          this.$resource(P_CLASSES + 'get_cust_by_id').get({cust_id:this.actAddForm2.cust_id}).then((response) => {
            if (response.body.code == 200) {
              _this.actAddForm2.cust_name = response.body.data.result.cust_name;
            } else {
              _this.alertMsg("error", response.body.msg ? response.body.msg : '服务器端错误')
            }
          })
        }else {
          _this.alertMsg("warning", '请输入工号查询')
        }
      },
      getApartList(){
        this.$resource(P_CLASSES + 'get_apart_list').get().then((response) => {
          if (response.body.code === 200) {
            this.apartList = response.body.data.result;
          } else {
            this.alertMsg("error", response.body.msg ? response.body.msg : '服务器端错误')
          }
        })
      },
      getRoomList(apart_id){
        this.$resource(P_CLASSES + 'get_room_list').get({apart_id:apart_id}).then((response) => {
          if (response.body.code === 200) {
            this.roomList = response.body.data.result;
          } else {
            this.alertMsg("error", response.body.msg ? response.body.msg : '服务器端错误')
          }
        })
      },
      getBedList(apart_id,room_id){
        this.$resource(P_CLASSES + 'get_bed_list').get({apart_id:apart_id,room_id:room_id}).then((response) => {
          if (response.body.code === 200) {
            this.bedList = response.body.data.result;
          } else {
            this.alertMsg("error", response.body.msg ? response.body.msg : '服务器端错误')
          }
        })
      },
      changeActiveClass(item) {
        this.activeClassId = item.class_id;
        this.getPeoples(this.activeClassId);
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

  .accontMg > span {
    display: inline-block;
    width: 16%;

  }

  .rowbtn {
    width: 100%;
    overflow: hidden;
    margin-top: 10px;
  }

  .rowbtn span {
    float: left;
    width: 100px;
    border: 1px solid #1c8de0;
    border-bottom: none;
    border-left: none;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #1d8ce0;
    cursor: pointer;
    border-radius:  4px 4px 0 0;

  }

  .rowbtn span:first-child {
    border-left: 1px solid #1c8de0;
  }

  .rowbtn span:hover {
    background: #1c8de0;
    color: #fff;
  }


  .m-btn {
    float: left;
    margin:10px 0 0 10px;
  }

  .activeClass {
    background: #1c8de0!important;
    color: #fff!important;
  }
</style>
