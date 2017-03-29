<template>
  <div class="bed-monitor">
    <s-navi :nData="navi_text" v-on:custevt="fatherEvt"></s-navi>

    <div class="chart">
      <div class="c-h">床位状态监控统计图</div>
      <div class="c-b">
        <div id="left-ct"></div>
        <div id="right-ct"></div>
      </div>
    </div>

    <div class="table">
      <div class="t-h">床位状态监控详情 <span class="export" @click="exportExcel">导出Excel</span></div>
      <div class="t-b">
        <div class="t-tb">
          <span @click="changeTab(1)">故障 <i :class="{'active':tabState == 1}"></i></span>
          <span @click="changeTab(2)">报警 <i :class="{'active':tabState == 2}"></i></span>
          <span @click="changeTab(3)">正常 <i :class="{'active':tabState == 3}"></i></span>
          <span @click="changeTab(4)">空闲 <i :class="{'active':tabState == 4}"></i></span>
        </div>
        <div class="t-bd t-b1" v-show="tabState == 1">
          <el-table :data="breakArr" style="width: 100%" border
                    :default-sort="{prop: 'create_time', order: 'descending'}" max-height="500">
            <el-table-column prop="apart_des" label="公寓" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="floor_des" label="楼层" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="room_des" label="房间" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="bed_des" label="床位" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="device_no" label="设备号" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="device_ip" label="设备IP" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="bed_state_des" label="床位状态" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="create_time" label="故障时间"  min-width="180" show-overflow-tooltip sortable></el-table-column>
          </el-table>
        </div>
        <div class="t-bd t-b2" v-show="tabState == 2">
          <el-table :data="alarmArr" style="width: 100%" border
                    :default-sort="{prop: 'alarm_time', order: 'descending'}" max-height="500">
            <el-table-column prop="cust_id" label="工号" min-width="100" show-overflow-tooltip  sortable></el-table-column>
            <el-table-column prop="cust_name" label="姓名" min-width="100" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="sche_begin_time" label="计划入寓时间"  min-width="180" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="sche_end_time" label="计划出寓时间"  min-width="180" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="workshop_des" label="车间" min-width="100" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="fleet_des" label="车队" min-width="100" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="group_des" label="指导组" min-width="100" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="apart_des" label="公寓" min-width="100" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="floor_des" label="楼层" min-width="100" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="room_des" label="房间" min-width="100" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="bed_des" label="床位" min-width="100" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="bed_state_des" label="床位状态" min-width="120" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="alarm_state_des" label="报警类型" min-width="150" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="alarm_time" label="报警时间"  min-width="180" show-overflow-tooltip sortable></el-table-column>
          </el-table>
        </div>
        <div class="t-bd t-b3" v-show="tabState == 3">
          <el-table :data="normalArr" style="width: 100%" border
                    :default-sort="{prop: 'create_time', order: 'descending'}" max-height="500">
            <el-table-column min-width="100" prop="cust_id" label="工号" show-overflow-tooltip sortable></el-table-column>
            <el-table-column min-width="100" prop="cust_name" label="姓名" show-overflow-tooltip sortable></el-table-column>
            <el-table-column min-width="180" prop="sche_begin_time" label="计划入寓时间" show-overflow-tooltip sortable></el-table-column>
            <el-table-column min-width="180" prop="sche_end_time" label="计划出寓时间"  show-overflow-tooltip sortable></el-table-column>
            <el-table-column min-width="100" prop="workshop_des" label="车间" show-overflow-tooltip sortable></el-table-column>
            <el-table-column min-width="100" prop="fleet_des" label="车队" show-overflow-tooltip sortable></el-table-column>
            <el-table-column min-width="100" prop="group_des" label="指导组" show-overflow-tooltip sortable></el-table-column>
            <el-table-column min-width="100" prop="apart_des" label="公寓" show-overflow-tooltip sortable></el-table-column>
            <el-table-column min-width="100" prop="floor_des" label="楼层" show-overflow-tooltip sortable></el-table-column>
            <el-table-column min-width="100" prop="room_des" label="房间" show-overflow-tooltip sortable></el-table-column>
            <el-table-column min-width="100" prop="bed_des" label="床位" show-overflow-tooltip sortable></el-table-column>
            <el-table-column min-width="120" prop="bed_state_des" label="床位状态" show-overflow-tooltip sortable></el-table-column>
            <el-table-column min-width="180" prop="create_time" label="监控时间" show-overflow-tooltip sortable></el-table-column>
          </el-table>
        </div>
        <div class="t-bd t-b4" v-show="tabState == 4">
          <el-table :data="downArr" style="width: 100%" border
                    :default-sort="{prop: 'create_time', order: 'descending'}" max-height="500">
            <el-table-column prop="apart_des" label="公寓" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="floor_des" label="楼层" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="room_des" label="房间" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="bed_des" label="床位" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="device_no" label="设备号" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="device_ip" label="设备IP" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="bed_state_des" label="床位状态" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="create_time" label="监控时间"  min-width="180"  show-overflow-tooltip sortable></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import SNavi from '../components/Navi.vue'
  var echarts = require('echarts');
  export default {
    name: 'bed-monitor',
    components: {
      SNavi
    },
    data () {
      return {
        navi_text: {
          title: '床位状态监控',
          subTitle: '',
          btn: '手动更新'
        },
        tabState:1,
        breakArr: [],
        alarmArr: [],
        normalArr: [],
        downArr: [],
      }
    },
    mounted () {
      var _this = this;
      this.requestData();
      var timer = null;
      timer = setInterval(update, 1000 * 60 * 5)
      function update() {
        if (window.location.hash.indexOf('bed_state') > 0) {
          _this.requestData()
        } else {
          clearInterval(timer)
        }
      }
    },
    methods: {
      requestData(){
        this.$resource(P_MONITOR + 'bed_state').get().then((response) => {
          let r_data = response.body.data;
          // 处理数据
          this.breakArr = r_data.breaky
          this.alarmArr = r_data.alarm
          this.normalArr = r_data.normal
          this.downArr = r_data.down


          // 图表渲染
          this.createBar(r_data.bed_info)
          this.createPie(r_data.bed_info)

          // 更新时间
          this.navi_text.subTitle = '(更新时间:' + (new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes() ) ) + '   提示:数据每5分钟更新一次)'

        })
      },
      fatherEvt(){
        this.requestData()
      },
      changeTab(n){
        this.tabState = n
      },
      createBar(bed){
        let myChart = echarts.init(document.getElementById('left-ct'));

        let total = bed.bed_break + bed.bed_run_alarm + bed.bed_run_normal + bed.bed_down
        let xA = ['空闲', '正常', '报警', '故障']
        let yA = [bed.bed_break, bed.bed_run_alarm, bed.bed_run_normal, bed.bed_down]

        let option = {
          title: {
            subtext: '总计床位:' + total + '张',
            left: 'center',
          },
          tooltip: {
            trigger: 'item',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'value'

          }],
          yAxis: [{
            type: 'category',
            data: xA,
            axisTick: {
              alignWithLabel: true
            }
          }],
          series: [{
            type: 'bar',
            data: yA,
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = ['#D48265', '#91C7AE', '#C23531', '#2F4554'];
                  return colorList[params.dataIndex]
                }
              }
            },
            label: {
              normal: {
                show: true,
                position: 'top',
                formatter: '{c}'
              }
            }

          }

          ]
        };
        myChart.setOption(option);
      },
      createPie(bed){
        let myChart = echarts.init(document.getElementById('right-ct'));
        // 总和
        let total = {
          name: '总运行床位',
          value: bed.bed_run
        };

        let xA = ['报警', '正常']

        let originalData = [
          {value: bed.bed_run_alarm, name: '报警'},
          {value: bed.bed_run_normal, name: '正常'}
        ];

        let option = {
          title: [{
            text: total.name,
            left: '49%',
            top: '44%',
            textAlign: 'center',
            textBaseline: 'middle',
            textStyle: {
              color: '#999',
              fontWeight: 'normal',
              fontSize: 18
            }
          }, {
            text: total.value,
            left: '49%',
            top: '52%',
            textAlign: 'center',
            textBaseline: 'middle',
            textStyle: {
              color: '#666',
              fontWeight: 'normal',
              fontSize: 30
            },
          },
            {
              subtext: '运行床位统计',
              x: 'center'
            }],
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            right: '20',
            data: xA
          },
          series: [
            {
              name: '运行床位统计',
              type: 'pie',
              radius: [55, 100],
              center: ['50%', '50%'],
              data: originalData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };

        myChart.setOption(option, true);
      }
    }
  }
</script>

<style scoped>

  @import "../assets/css/chart-table-page-com.css";

  #left-ct {
    height: 100%;
    width: 60%;
    float: left;
  }

  #right-ct {
    height: 100%;
    width: 40%;
    float: right;
  }


  .t-tb {
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #E5E9F2;
  }

  .t-tb > span {
    width: 24%;
    display: inline-block;
    text-align: center;
    position: relative;
    cursor: pointer;
  }

  .t-tb i {
    width: 10px;
    height: 10px;
    background: #fff;
    border-top: 1px solid #E5E9F2;
    border-right: 1px solid #E5E9F2;
    transform: rotate(-45deg);
    -ms-transform: rotate(-45deg); /* IE 9 */
    -moz-transform: rotate(-45deg); /* Firefox */
    -webkit-transform: rotate(-45deg); /* Safari 和 Chrome */
    -o-transform: rotate(-45deg); /* Opera */
    position: absolute;
    bottom: -6px;
    left: 49%;
    display: none;
  }

  .t-tb i.active {
    display: block;
  }

  .t-bd {
    padding: 10px;
  }
</style>
