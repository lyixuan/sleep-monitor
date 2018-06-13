<template>
  <div class="dashboard">
    <s-navi :nData="navi_text" class="dashboard-navi" v-on:custevt="fatherEvt"></s-navi>

    <el-dialog title="入寓信息" v-model="dialogTableVisible" size="large">
      <el-table :data="alarm">
        <el-table-column min-width="80" property="cust_id" label="工号"></el-table-column>
        <el-table-column min-width="80" property="cust_name" label="姓名"></el-table-column>
        <el-table-column min-width="120" show-overflow-tooltip property="sche_begin_time"
                         label="计划入寓时间"></el-table-column>
        <el-table-column min-width="120" show-overflow-tooltip property="sche_end_time"
                         label="计划出寓时间"></el-table-column>
        <el-table-column min-width="80" show-overflow-tooltip property="workshop_des" label="车间"></el-table-column>
        <el-table-column min-width="80" show-overflow-tooltip property="fleet_des" label="车队"></el-table-column>
        <el-table-column min-width="80" show-overflow-tooltip property="group_des" label="指导组"></el-table-column>
        <el-table-column min-width="80" show-overflow-tooltip property="apart_des" label="公寓"></el-table-column>
        <el-table-column min-width="80" show-overflow-tooltip property="room_des" label="房间"></el-table-column>
        <el-table-column min-width="80" show-overflow-tooltip property="bed_des" label="床位"></el-table-column>
        <el-table-column min-width="80" show-overflow-tooltip property="depot_des" label="机务段"></el-table-column>
      </el-table>
    </el-dialog>


    <div class="box" v-loading.body="t_loading">
      <div class="left">
        <div class="row1">
          <div class="l-h h1">楼层信息</div>
          <transition-group>
            <div class="l-c" :class="{active:floor_active==item.floor_id}" v-for="item in floors" :key="item"
                 @click="changeFloor(item.floor_id)">
              <img src="../assets/img-dash/floor1.png" v-if="floor_active==item.floor_id"/>
              <img src="../assets/img-dash/floor2.png" v-if="floor_active!=item.floor_id"/>
              <i>{{item.floor_id}}F</i>
              {{item.floor_des}}
            </div>
          </transition-group>
        </div>


        <div class="row2">
          <div class="r-h h5">楼层床位信息</div>
          <s-e-b :pData="item" :sId="item.id" v-for="item in echart_bar" :key="item.id"></s-e-b>
        </div>
        <!--<div class="row3">-->
          <!--<div class="l-h h3">入寓信息</div>-->
          <!--<div class="l-c-3">-->
            <!--(近24小时)-->
          <!--</div>-->
          <!--<div class="l-c-3-1" @click="dialogTableVisible = true">-->
            <!--详情-->
          <!--</div>-->
          <!--<table v-loading.body="tb_loading">-->
            <!--<tr style="font-weight: 600">-->
              <!--<td>时间</td>-->
              <!--<td>姓名</td>-->
              <!--<td>床位</td>-->
            <!--</tr>-->
            <!--<tr v-if="alarm.length == 0">-->
              <!--<td colspan="3">暂无数据</td>-->
            <!--</tr>-->
            <!--<tr v-else v-for="item in alarm">-->
              <!--<td :title="item.alarm_time">{{(item.sche_begin_time).substr(11,5)}}</td>-->
              <!--<td :title="item.cust_name">{{item.cust_name}}</td>-->
              <!--<td :title="item.bed_id">{{item.bed_id}}</td>-->
            <!--</tr>-->
          <!--</table>-->
        <!--</div>-->
      </div>
      <el-row class="center">
        <el-col :span="24">
          <el-row>
            <el-col :span="24" class="row1">
              <div class="c-t"><img src="../assets/img-dash/home.png" height="32" width="32"/>{{floor_detail.floor_id}}楼
              </div>
              <div class="c-s">共{{floor_detail.room_sum}}个房间</div>
              <div class="c-m">
                <div>床位状态:</div>
                <div class="status ss1"><i></i>在床</div>
                <div class="status ss2"><i></i>离床</div>
                <div class="status ss3"><i></i>空闲</div>
                <div class="status ss4"><i></i>空置</div>
              </div>
            </el-col>
          </el-row>
          <transition-group v-on:before-enter="beforeEnter" v-on:enter="enter">
            <el-row class="room-row" v-for="room_row in floor_detail.room" :key="room_row">
              <el-col :span="6" class="room" v-for="room in room_row" :key="room.room_id">
                <div class="r-header">{{room.room_des}}</div>
                <div class="r-cont">
                  <div class="room-item"
                       :class="{'red-color':bed.bed_state_id == 4,'yellow-color':bed.bed_state_id == 5}"
                       v-for="bed in room.bed" :key="bed.bed_id" @click="openDetail(bed,room)">
                    <div class="ri-l">
                      <div class="ri-l-t">{{bed.bed_des}}</div>
                      <div class="ri-l-p">
                        <img src="../assets/img-dash/bed-1.png" height="26"
                             v-if="bed.bed_state_id == 1 || bed.bed_state_id == 5"/>
                        <img src="../assets/img-dash/bed-2.png" height="26" v-if="bed.bed_state_id == 2"/>
                        <img src="../assets/img-dash/bed-3.png" height="26"
                             v-if="bed.bed_state_id == 3 || bed.bed_state_id == 4"/>
                        <img src="../assets/img-dash/bed-4.png" height="26" v-if="bed.bed_state_id == 0"/>
                      </div>
                    </div>
                    <div class="ri-r">
                      <div class="text-tip " v-if="bed.bed_state_id == 4">故障</div>
                      <div class="text-tip text-tip2" v-if="bed.bed_state_id == 5">报警</div>
                      <div class="ri-r-t">工号：{{bed.cust_id == ''?'--':bed.cust_id }}</div>
                      <div class="ri-r-s">姓名：{{bed.cust_name==''?'--':bed.cust_name}}</div>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </transition-group>
        </el-col>
      </el-row>
      <div class="right">
        <div class="row1">
          <div class="r-h h4">床位总体信息</div>
          <div id="pie" style="width: 200px;height: 280px;"></div>
        </div>
        <!--<div class="row2">-->
          <!--<div class="r-h h5">楼层床位信息</div>-->
          <!--<s-e-b :pData="item" :sId="item.id" v-for="item in echart_bar" :key="item.id"></s-e-b>-->
        <!--</div>-->
        <div class="row2">
        <div class="l-h h2">详情统计</div>
        <div class="l-c-2">
        总共床位: <i>{{total.bed_sum}}</i>张
        </div>
        <div class="l-c-2">
        运行床位: <i>{{total.bed_run}}</i>张
        </div>
        <div class="l-c-2">
        空闲床位: <i>{{total.bed_empty}}</i>张
        </div>
        <div class="l-c-2">
        故障床位: <i>{{total.bed_break}}</i>张
        </div>
        </div>
      </div>
      <!--出入寓信息-->
      <el-dialog class="bedInputDialog" title="增加入寓信息" :visible.sync="bedInputDialog">
        <div style="text-align: right;color:#35A8FD;margin-bottom: 5px;margin-top: -5px;">{{bedInputForm.room_des}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{bedInputForm.bed_des}}</div>
        <el-form :model="bedInputForm">
          <el-form-item label="工号" :label-width="formLabelWidth" required>
            <el-input v-model="bedInputForm.cust_id" auto-complete="on"></el-input>
            <el-button style="margin-top:10px;" @click="getDetailByCustId()">获取人员信息</el-button>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth" required>
            <el-input v-model="bedInputForm.cust_name" auto-complete="on"></el-input>
          </el-form-item>
          <el-form-item label="分级" :label-width="formLabelWidth">
            <el-cascader :options="levels" change-on-select
                         @change="handleChange" v-model="bedInputForm.cust_level"></el-cascader>
          </el-form-item>
          <el-form-item label="车次或班次" :label-width="formLabelWidth" required>
            <el-input v-model="bedInputForm.train_des" auto-complete="on"></el-input>
          </el-form-item>
          <el-form-item label="计划入寓时间" :label-width="formLabelWidth">
            <el-date-picker v-model="bedInputForm.sche_in_time"
                            type="datetime" :editable="false" :clearable="false"
                            placeholder="选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="计划出寓时间" :label-width="formLabelWidth">
            <el-date-picker v-model="bedInputForm.sche_out_time"
                            type="datetime" :editable="false" :clearable="false"
                            placeholder="选择时间">
            </el-date-picker>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="bedInputDialog = false">取 消</el-button>
          <el-button type="primary" @click="saveInApart()">入 寓</el-button>
        </div>
      </el-dialog>

      <el-dialog class="bedInputDialog" title="入寓信息" :visible.sync="bedShowDialog">
        <div style="text-align: right;color:#35A8FD;margin-bottom: 5px;margin-top: -5px;">{{bedShowForm.room_des}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{bedShowForm.bed_des}}</div>
        <el-form :model="bedShowForm">
          <el-form-item label="床位状态" :label-width="formLabelWidth">
            <el-input v-model="bedShowForm.bed_state_des" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="工号" :label-width="formLabelWidth">
            <el-input v-model="bedShowForm.cust_id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="bedShowForm.cust_name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="分级" :label-width="formLabelWidth">
            <el-input v-model="bedShowForm.cust_level" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="车次或班次" :label-width="formLabelWidth" >
            <el-input v-model="bedShowForm.train_des" auto-complete="on" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="计划入寓时间" :label-width="formLabelWidth">
            <el-date-picker v-model="bedShowForm.sche_in_time"
                            type="datetime" :editable="false" :clearable="false"
                            placeholder="选择时间" :disabled="true">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="计划出寓时间" :label-width="formLabelWidth">
            <el-date-picker v-model="bedShowForm.sche_out_time"
                            type="datetime" :editable="false" :clearable="false"
                            placeholder="选择时间" :disabled="true">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="报警记录" :label-width="formLabelWidth">
            <div class="alarm" v-for="item in bedShowForm.alarm"><span>{{item.alarm_time}}</span><span>{{item.alarm_state_des}}</span></div>
          </el-form-item>
           </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="bedShowDialog = false">关 闭</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import SNavi from '../components/Navi.vue'
  import SEB from '../components/EchartBar.vue'
  var echarts = require('echarts');
  export default {
    name: 'dashboard',
    components: {
      SNavi, SEB
    },
    data () {
      return {
        // 返回原始数据
        return_data: {},
        // 导航信息
        navi_text: {
          title: '公寓监控概览',
          subTitle: '',
          btn: '手动更新'
        },
        //楼层信息
        floors: [],
        //楼层状态
        floor_active: '1',
        //详情统计
        total: {
          bed_sum: '',
          bed_run: '',
          bed_run_normal: '',
          bed_run_alarm: '',
          bed_empty: '',
          bed_break: ''
        },
        //报警信息--已改为入寓信息
        alarm: [],
        //楼层详情——center
        floor_detail: {
          floor_id: 1,
          room: []
        },
        echart_pie: {
          xA: [],
          yA: []
        },
        echart_bar: [],
        t_loading: true,
        tb_loading: false,
        dialogTableVisible: false,

        bedInputDialog: false,
        formLabelWidth: '120px',
        // 分级
        levels: [],
        bedInputForm: {
          cust_id: '',
          cust_level: [],
          cust_name: "",
          sche_in_time: "",
          sche_out_time: "",
          bed_des: "",
          room_des: "",
          train_des:'',
          bed_id:'',
          room_id:''
        },

        bedShowDialog: false,
        bedShowForm: {
          cust_id: '',
          cust_level: '',
          cust_name: "",
          sche_in_time: "",
          sche_out_time: "",
          bed_state_des: "",
          bed_des: "",
          room_des: "",
          train_des:'',
          alarm:[]

        },
      }
    },
    mounted () {
      var _this = this;
      this.requestData();
      var timer = null;
      timer = setInterval(update, 1000 * 60 * 5);
      function update() {
        if (window.location.hash.indexOf('dashboard') > 0) {
          _this.requestData()
        } else {
          clearInterval(timer)
        }
      }

      this.getLevels()
    },

    methods: {
      requestData(){
        this.$resource(P_MONITOR + 'dashboard').get().then((response) => {
          this.t_loading = false
          let r_data = response.body.data;
          // 存储原始数据
          this.return_data = r_data;
          // 处理数据
          this.getFloors(r_data.floors);
          this.getTotal(r_data.total);
          this.getPie(r_data.total);
          this.getBar(r_data.floors);
          // 图表渲染
          this.createPie(this.echart_pie);

          // 更新时间
          this.navi_text.subTitle = '(更新时间:' + (new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes() ) ) + '   提示:数据每5分钟更新一次)'
          this.requestData2()
        })
      },
      requestData2(){
        this.tb_loading = true
        this.$resource(P_MONITOR + 'dashboard_apart').get().then((response) => {
          this.tb_loading = false
          let r_data = response.body.data;
          // 处理数据 --报警改为了入寓
          this.getAlarm(r_data.apart_event);
        })
      },
      getFloors(floors){
        this.floors = [];
        for (let key in floors) {
          this.floors.push({
            floor_id: floors[key].floor_id,
            floor_des: floors[key].floor_des
          })
        }

        this.changeFloor(floors[Object.keys(floors)[0]].floor_id)
      },
      getTotal(total){
        this.total = total;
      },
      getAlarm(alarm){
        this.alarm = alarm;
      },
      changeFloor(floor_id){
        this.floor_active = floor_id;
        this.getFloorDetail(floor_id, this.return_data.floors)
      },
      getFloorDetail(floor_id, return_floors){

        let f_detail = return_floors['floor_' + floor_id];
        this.floor_detail = {
          floor_id: f_detail.floor_id,
          room_sum: f_detail.room_sum,
          room: []
        };
        // 将一维数组构造为二维数组
        for (let i = 0; i < f_detail.room.length; i++) {
          if (i % 4 == 0) {
            this.floor_detail.room.push([])
          }
          this.floor_detail.room[this.floor_detail.room.length - 1].push(f_detail.room[i])
        }
      },
      getPie(total){
        this.echart_pie.xA = ['正常', '报警', '空闲', '故障']
        this.echart_pie.yA = [
          {value: total.bed_run_normal, name: '正常'},
          {value: total.bed_run_alarm, name: '报警'},
          {value: total.bed_empty, name: '空闲'},
          {value: total.bed_break, name: '故障'}
        ]
      },
      getBar(floors){
        this.echart_bar = [];
        for (let key in floors) {
          let fb = floors[key].floor_bed;
          this.echart_bar.push({
              title: floors[key].floor_des,
              id: floors[key].floor_id,
              xA: ['正常', '报警', '空闲', '故障'],
              yA: [
                {value: fb.bed_run_normal, name: '正常'},
                {value: fb.bed_run_alarm, name: '报警'},
                {value: fb.bed_empty, name: '空闲'},
                {value: fb.bed_break, name: '故障'}
              ]
            }
          )
        }
      },
      createPie(p_data){
        var myChart = echarts.init(document.getElementById('pie'));
        var option = {
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          color: ['#91C7AE', '#F3AD0D', '#2986CC', '#C23531'],
          legend: {
            x: 'center',
            y: 'bottom',
            data: p_data.xA,
            formatter: function (name) {
              var oa = option.series[0].data;
              var num = oa[0].value + oa[1].value + oa[2].value + oa[3].value;
              for (var i = 0; i < option.series[0].data.length; i++) {
                if (name == oa[i].name) {
                  return name + ' ' + oa[i].value + ' (' + (oa[i].value / num * 100).toFixed(2) + '%)';
                }
              }
            }
          },
          series: [
            {
              name: '床位总体信息',
              type: 'pie',
              radius: ['40%', '75%'],
              center: ['50%', '35%'],
              data: p_data.yA,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '24',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              }
            }
          ]
        };
        myChart.setOption(option);
      },
      fatherEvt(){
        console.log('这是一个通过子组件触发的事件,在父组件里完成操作')
        this.requestData()
      },
      beforeEnter: function (el) {
        el.style.opacity = 0
//        el.style.width = '90%'
        el.style.transformOrigin = 'left'
      },
      enter: function (el, done) {
        Velocity(el, {opacity: 1}, {duration: 300})
        Velocity(el, {opacity: 1}, {complete: done})
      },
      openDetail(bed,room){
        let _this = this;
        if (bed.bed_state_id == 3) {
          // 空闲,录入
          this.bedInputForm={
              cust_id: "",
              cust_level: [],
              cust_name: "",
              sche_in_time: "",
              sche_out_time: "",
              train_des: "",
              room_id : room.room_id,
              room_des : room.room_des,
              bed_id : bed.bed_id,
              bed_des : bed.bed_des
          };
          this.bedInputDialog = true;
        } else {
          // 非空闲，获取详情
          this.$resource(P_BASE2 + 'get_in_apart_info_by_custid').get({cust_id:bed.cust_id}).then((response) => {
            if (response.body.code == 200) {
              _this.bedShowForm = response.body.data;
              let cust_level='';
              for(let i=0;i<response.body.data.cust_level.length;i++){
                cust_level+=response.body.data.cust_level[i].name;
                if(i<response.body.data.cust_level.length-1){
                  cust_level+="->"
                }
              }
              _this.bedShowForm.cust_level=cust_level;
              _this.bedShowForm.bed_state_des = bed.bed_state_des;
              _this.bedShowForm.room_des = room.room_des;
              _this.bedShowForm.bed_des = bed.bed_des;
              _this.bedShowDialog = true;
            } else {
              _this.alertMsg("error", response.body.msg ? response.body.msg : '服务器端错误')
            }
          })


        }
      },
      getDetailByCustId(){
        let _this = this;
        if (this.bedInputForm.cust_id) {
          this.$resource(P_BASE2 + 'get_in_apart_info_by_custid').get({cust_id:this.bedInputForm.cust_id}).then((response) => {
            if (response.body.code == 200) {
              let cust_level=[];
              for(let i=0;i<response.body.data.cust_level.length;i++){
                cust_level.push(response.body.data.cust_level[i].value)
              }
              _this.bedInputForm.cust_level=cust_level
              _this.bedInputForm.cust_id = response.body.data.cust_id;
              _this.bedInputForm.cust_name = response.body.data.cust_name;
              _this.bedInputForm.sche_in_time = response.body.data.sche_in_time;
              _this.bedInputForm.sche_out_time = response.body.data.sche_out_time;
              _this.bedInputForm.train_des = response.body.data.train_des;
            } else {
              _this.alertMsg("error", response.body.msg ? response.body.msg : '服务器端错误')
            }
          })
        }else {
          _this.alertMsg("warning", '请输入工号查询')
        }

      },
      saveInApart(){
        let _this = this;
        if (this.bedInputForm.cust_id && this.bedInputForm.cust_name&& this.bedInputForm.train_des) {
          this.bedInputForm.sche_in_time =new Date(this.bedInputForm.sche_in_time).Format('yyyy-MM-dd hh:mm:ss')
          this.bedInputForm.sche_out_time =new Date(this.bedInputForm.sche_out_time).Format('yyyy-MM-dd hh:mm:ss')
          if(this.bedInputForm.sche_in_time>=this.bedInputForm.sche_out_time){
            _this.alertMsg("warning", '出寓时间应该晚于入寓时间')
              return
          }
          let param= this.bedInputForm;
          this.$resource(P_BASE2 + 'add_in_apart').save({}, param).then((response) => {
            if (response.body.code == 200) {
//              入寓成功
//              关闭对话框，更新数据
              _this.bedInputDialog = false
              _this.requestData()

            } else {
              _this.alertMsg("error", response.body.msg ? response.body.msg : '服务器端错误')
            }
          }, (response) => {
            console.log(response.body)
          })
        }else {
          _this.alertMsg("warning", '请填写必填项')
        }

      },
      handleChange(value){
        this.bedInputForm.cust_level = value
      },
      getLevels(){
        this.$resource(P_BASE + 'level_list').get().then((response) => {
          this.levels = response.body.data;
        })
      }
    }
  }
</script>

<style scoped>

  .dashboard-navi {
    margin-bottom: 5px;
  }

  .box {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .left, .right {
    width: 200px;
    min-width: 200px;
    max-width: 200px;
  }

  .left {
    margin-right: 5px;
  }

  .right {
    margin-left: 5px;
  }

  .center {
    width: 100%;
    min-width: 650px;
  }

  .left .row1, .right .row2, .left .row3 {
    background: #fff;
  }

  .left .row1 {
    min-height: 200px;
    border-top: 2px solid #20C3A9;
    padding-bottom: 10px;
  }

  .right .row2 {
    height: 170px;
    margin-top: 5px;
    border-top: 2px solid #FFAD30;
  }

  .left .row3 {
    min-height: 330px;
    max-height: 380px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 5px;
    border-top: 2px solid #E73D3D;
    padding-bottom: 10px;
    padding-right: 2px;
    padding-left: 2px;
  }

  .right .row1, .left .row2 {
    background: #fff;
  }

  .right .row1 {
    min-height: 300px;
    overflow: hidden;
    border-top: 2px solid #88C657;
  }

  .left .row2 {
    min-height: 415px;
    max-height: 465px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 5px;
    border-top: 2px solid #2D9BF5;
  }

  /*center */

  .center .row1 {
    height: 40px;
    line-height: 40px;
    border-top: 2px solid #87C556;
    background: #fff;
  }

  .center .row1 > div {
    float: left;
  }

  .center .row1 > div.c-t {
    font-size: 16px;
    color: #1D8CE0;
    margin-right: 10px;
  }

  .center .row1 > div.c-t img {
    width: 26px;
    height: 26px;
    margin-top: -5px;
    margin-left: 5px;
    margin-right: 5px;
    vertical-align: middle;
  }

  .center .row1 > div.c-s {
    color: #888888;
    font-size: 12px;
  }

  .center .row1 > div.c-m {
    float: right;
  }

  .center .row1 > div.c-m > div {
    float: left;
    color: #888;
    margin-right: 5px;
  }

  .center .row1 > div.c-m > div.status > i {
    width: 12px;
    height: 12px;
    display: inline-block;
    border-radius: 6px;
    background: #13CE66;
    vertical-align: middle;
    margin-top: -3px;
  }

  .center .row1 > div.c-m > div.ss2 > i {
    background: #EB9CC1;
  }

  .center .row1 > div.c-m > div.ss3 > i {
    background: #2986CC;
  }

  .center .row1 > div.c-m > div.ss4 > i {
    background: #707070;
  }

  .room-row {
    margin-top: 6px;
  }

  /*room */
  .room {
    padding-right: 3px;
    box-sizing: border-box;
  }

  .room:last-child {
    padding-right: 0;
  }

  .r-header {
    box-sizing: border-box;
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: #20A0FF;
    opacity: .9;
    border-radius: 4px 4px 0 0;
    padding: 0 5px;
    color: #fff;
  }

  .r-cont {
    background: #fff;
    width: 98%;
    margin: 0 auto;
    min-height: 100px;
    padding-bottom: 5px;
    overflow: hidden;
  }

  .room-item {
    background: #E5E9F2;
    border-radius: 4px;
    margin: 5px 5px 0 5px;
    height: 50px;
    position: relative;
    cursor: pointer;
  }

  .red-color {
    /*background: #FF4949;*/
    background: #C6242F;
    color: #fff;
    border: none;
  }

  .yellow-color {
    /*background: #F7BA2A;*/
    background: #F3AD0D;
    color: #fff;
    border: none;
  }

  .ri-l, .ri-r {
    float: left;
  }

  .ri-l {
    padding: 0 6px;
  }

  .ri-r {
    padding-top: 8px;
    padding-left: 5px;
  }

  .text-tip {
    position: absolute;
    right: 0;
    font-size: 16px;
    color: #444;
    font-weight: bold;
    transform: rotate(45deg);
    -ms-transform: rotate(45deg); /* IE 9 */
    -moz-transform: rotate(45deg); /* Firefox */
    -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
    -o-transform: rotate(45deg); /* Opera */
  }

  .text-tip2 {
    /*color: #FF4949;*/
    color: #444;
  }

  /*left-con*/
  .l-h {
    margin-top: 5px;
    text-align: center;
    font-size: 16px;
  }

  .h1 {
    color: #20C3A9;
  }

  .h2 {
    color: #FFAE30;
  }

  .h3 {
    color: #E73D3D;
  }

  .l-c {
    position: relative;
    color: #bebebe;
    cursor: pointer;
    overflow: hidden;
    padding-left: 38px;
    border-bottom: 1px solid #eee;
    margin: 0 10px;
    margin-top: 10px;
  }

  .l-c.active {
    color: #20C3A9;
  }

  .l-c img {
    height: 24px;
    vertical-align: middle;
    margin-right: 15px;
  }

  .l-c i {
    position: absolute;
    z-index: 2;
    left: 43px;
    top: 4px;
  }

  .l-c-2 {
    text-align: center;
    margin-top: 10px;
  }

  .l-c-2 > i {
    display: inline-block;
    width: 26px;
  }

  .l-c-3 {
    color: #bbb;
    text-align: center;
    font-size: 12px;
  }

  .l-c-3-1 {
    color: #1D8CE0;
    text-align: right;
    font-size: 12px;
    padding-right: 10px;
    cursor: pointer;
  }

  .tb-1 > div {
    float: left;
  }

  .tb-1 > div:not(:first-child) {
    margin-left: 10px;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    /*margin: 0 5px;*/
  }

  tr {
    border: 1px solid #eee;
    border-right: none;
    border-left: none;
  }

  td {
    font-size: 12px;
    height: 25px;
    line-height: 25px;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  td:nth-child(1) {
    max-width: 40px;
  }

  td:nth-child(2) {
    max-width: 40px;
  }

  td:nth-child(3) {
    max-width: 40px;
  }

  td:nth-child(4) {
    max-width: 70px;
  }

  /*right-con*/
  .r-h {
    margin-top: 5px;
    text-align: center;
    font-size: 16px;
  }

  .h4 {
    color: #88C657;
  }

  .h5 {
    color: #2D9BF5;
  }

  /*fade-list*/
  .fade-list-enter-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .fade-list-enter, .fade-list-leave-active {
    transform: translateX(10px);
    opacity: 0;
  }

  .fade-list-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .alarm{
    color: #C23531;
  }
  .alarm span{
    display: inline-block;
    width: 200px;
  }

</style>
