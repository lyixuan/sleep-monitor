<template>
  <div class="report-search">
    <div style="width: 100%;height: 100%;">
      <div class="condition">
        <div class="bg-blue">今日排班 <span style="color: #666;font-size: 12px;margin-left: 20px;">tips：增加、编辑、删除今日排班人员，只会暂时改变今日排班，不会影响排班设计。</span></div>
        <div class="rowbtn">
          <span class="activeClass">今日排班：{{todayClassName}}</span>
          <span class="activeClass c2" @click="openClassChange">更换今日排班</span>
          <span class="activeClass c2" @click="openAdd2" v-show="todayClassId">增员</span>
        </div>
        <div class="condition0">
          <el-table :data="peoples" style="width: 100%" border v-loading="tableLoading1" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
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


    <!-- 改今日班级 -->
    <el-dialog class="actEdit people_m" title="选择今日排班" :visible.sync="actClassDialog">
      <div class="rowbtn">
        <span class="r2" v-for="item in classes" :class="{ activeClass: activeClassId === item.class_id }" @click="changeActiveClass(item)">{{item.class_name}}</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="actClassDialog = false">取 消</el-button>
        <el-button type="primary" @click="classChange()">保 存</el-button>
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
        peoples: [],
        classes: [],
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
          id: '',
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
        todayClassId: '',
        todayClassName: '无',
        // ----------
        activeClassId: '',
        actClassDialog: false,
        tableLoading1: false,
      }
    },
    mounted () {
      this.getTodayPeoples();
      this.getApartList();
      this.getClasses();
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
        this.$resource(P_CLASSES + 'get_class').get().then((response) => {
          if (response.body.code === 200) {
            this.classes = response.body.data.result
          } else {
            this.alertMsg("warning", '获取数据失败')
          }
        })
      },
      getTodayPeoples() {
        this.tableLoading1 = true;
        this.$resource(P_CLASSES + 'get_cust_in_todayclass').get().then((response) => {
          if (response.body.code === 200) {
            this.peoples = response.body.data.result
            if (response.body.data.classe) {
              this.todayClassId = response.body.data.classe.class_id;
              this.todayClassName = response.body.data.classe.class_name ?response.body.data.classe.class_name: "无";
            }
          } else {
            this.alertMsg("warning", '获取数据失败')
          }
          this.tableLoading1 = false;
        })
      },
      openAdd2(){
        this.actAddForm2 = {
          class_id: this.todayClassId,
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
      saveAdd2(){
        if (!this.actAddForm2.cust_id || !this.actAddForm2.cust_name || !this.actAddForm2.apart_id || ! this.actAddForm2.bed_id || !this.actAddForm2.train_des || !this.actAddForm2.sche_begin_time || !this.actAddForm2.sche_end_time) {
          this.alertMsg("warning", '请填写必填项');
          return
        }
        let _this = this;
        this.actAddForm2.sche_begin_time = new Date(this.actAddForm2.sche_begin_time).Format("hh:mm:ss");
        this.actAddForm2.sche_end_time = new Date(this.actAddForm2.sche_end_time).Format("hh:mm:ss")
        this.$resource(P_CLASSES + 'add_cust_in_todayclass').save({}, this.actAddForm2).then((response) => {
          if (response.body.code === 200) {
            _this.alertMsg("success", '添加成功');
            _this.actAddDialog2 = false;
            _this.getTodayPeoples();

          } else {
            _this.alertMsg("error", response.body.msg ? response.body.msg : '服务器端错误')
          }
        }, (response) => {
          console.log(response.body)
        })
      },
      openEdit2(row){
        const time = new Date();
        const y = time.getFullYear();
        const m = time.getMonth() + 1;
        const d = time.getDate();
        const bTime =new Date(row.sche_begin_time);
        if (time > bTime) {
          this.alertMsg("warning", '今天已经入寓的人员不可编辑！');
          return;
        }
        this.actEditDialog2 = true;
        this.getRoomList(row.apart_id);
        this.getBedList(row.apart_id ,row.room_id);
        this.actEditForm2 = {
          data_id: row.data_id,
          cust_id: row.cust_id,
          cust_name: row.cust_name,
          apart_id: row.apart_id,
          room_id: row.room_id,
          bed_id: row.bed_id,
          train_des: row.train_des,
          sche_begin_time: new Date(row.sche_begin_time),
          sche_end_time: new Date(row.sche_end_time),
        };
      },
      saveEdit2(){
        if (!this.actEditForm2.cust_id || !this.actEditForm2.cust_name || !this.actEditForm2.apart_id || ! this.actEditForm2.bed_id || !this.actEditForm2.train_des || !this.actEditForm2.sche_begin_time || !this.actEditForm2.sche_end_time) {
          this.alertMsg("warning", '请填写必填项');
          return
        }
        this.actEditForm2.sche_begin_time = new Date(this.actEditForm2.sche_begin_time).Format("hh:mm:ss");
        this.actEditForm2.sche_end_time = new Date(this.actEditForm2.sche_end_time).Format("hh:mm:ss")
        this.$resource(P_CLASSES + 'update_cust_in_todayclass').save({}, this.actEditForm2).then((response) => {
          if (response.body.code === 200) {
            this.alertMsg("success", '更新成功');
            this.actEditDialog2 = false;
            this.getTodayPeoples();

          } else {
            this.alertMsg("error", response.body.msg ? response.body.msg : '服务器端错误')
          }
        }, (response) => {
          console.log(response.body)
        })
      },
      openDel2(row) {
        const time = new Date();
        const y = time.getFullYear();
        const m = time.getMonth() + 1;
        const d = time.getDate();
        const bTime =new Date(row.sche_begin_time);
        if (time > bTime) {
          this.alertMsg("warning", '今天已经入寓的人员不可删除！');
          return;
        }
        this.actDelDialog2 = true
        this.delName2 = row.cust_name;
        this.delId2 = row.data_id;
      },
      saveDel2(){
        let _this = this;
        this.$resource(P_CLASSES + 'delete_cust_in_class').get({data_id: this.delId2}).then((response) => {
          if (response.body.code == 200) {
            _this.alertMsg("success", '删除成功');
            _this.getTodayPeoples();
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
      },
      classChange() {
        this.tableLoading1 = true;
        this.$resource(P_CLASSES + 'update_class_today').get({class_id:this.activeClassId}).then((response) => {
          if (response.body.code === 200) {
            this.peoples = response.body.data.result;
            if (response.body.data.classe) {
              this.todayClassId = response.body.data.classe.class_id;
              this.todayClassName = response.body.data.classe.class_name ?response.body.data.classe.class_name: "无";
            }
            this.actClassDialog = false;
          } else {
            this.alertMsg("error", response.body.msg ? response.body.msg : '服务器端错误')
          }
          this.tableLoading1 = false;
        })
      },
      openClassChange() {
        this.actClassDialog = true;
        this.activeClassId = this.todayClassId;
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
    padding: 0 10px 10px 10px;
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
    /*margin-left: 20px;*/
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #1d8ce0;
    cursor: pointer;
    border-radius:  4px 4px 0 0;
    margin-left: 10px;
    margin-bottom: 0;
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

  .c2 {
    float: right!important;
    margin-right: 10px;
    border-radius:  0!important;
  }

  .r2 {
    border-radius:  0!important;
    margin-left: 15px;
    border-radius: 0!important;
    border-bottom: 1px solid #1c8de0!important;
  }
</style>
