<template>
  <div class="h-sleep-monitor">
    <s-navi :nData="navi_text"></s-navi>

    <div style="width: 100%;height: 100%;" v-loading.body="t_loading">
    <div class="chart">
      <div class="c-h">睡眠质量统计图</div>
      <div class="c-b">
        <div id="left-ct"></div>
        <div id="right-ct"></div>
      </div>
    </div>

    <div class="table">
      <div class="t-h">24小时睡眠监控详情 <span class="export" @click="exportExcel">导出Excel</span></div>
      <div class="t-b">
        <div class="t-bd">
          <el-table :data="sleepArr" style="width: 100%" border
                    :default-sort="{prop: 'alarm_time', order: 'descending'}" max-height="500">
            <el-table-column prop="cust_id" label="工号" min-width="100" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="cust_name" label="姓名" min-width="100" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="sche_begin_time" label="计划入寓时间" min-width="180" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="sche_end_time" label="计划出寓时间" min-width="180" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="in_time" label="实际入寓时间" min-width="180" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="out_time" label="实际出寓时间" min-width="180" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="workshop_des" label="车间" min-width="100" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="fleet_des" label="车队" min-width="100" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="group_des" label="指导组" min-width="100" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="apart_des" label="公寓" min-width="100" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="room_des" label="房间" min-width="100" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="bed_des" label="床位" min-width="100" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="monitor_duration" label="监控时长" min-width="120" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="sleep_duration" label="睡眠时长" min-width="120" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="sleep_per" label="睡眠占比" min-width="120" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="assess_state_des" label="睡眠评估" min-width="120" show-overflow-tooltip
                             sortable></el-table-column>
          </el-table>

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
    </div>

  </div>
</template>

<script>
  import SNavi from '../components/Navi.vue'
  var echarts = require('echarts');
  export default {
    name: 'search-index',
    components: {
      SNavi
    },
    data () {
      return {
        navi_text: {
          title: '24小时睡眠监控',
          subTitle: '',
          btn: ''
        },
        sleepArr: [],

        currentPage: 1,
        pageSize: 10,
        totalNum: 0,
        t_loading:true
      }
    },
    mounted () {
      var _this = this;
      this.requestData();
      var timer = null;
      timer = setInterval(update, 1000 * 60 * 5)
      function update() {
        if (window.location.hash.indexOf('sleep_24monitor') > 0) {
          _this.requestData()
        } else {
          clearInterval(timer)
        }
      }
    },
    methods: {
      exportExcel(){
        window.open(P_MONITOR + 'sleep_24monitor_excel.php');
      },
      requestData(){
        let params = {
          page_size: this.pageSize,
          current_page: this.currentPage
        };
        var _this= this;
        this.$resource(P_MONITOR + 'sleep_24monitor').get(params).then((response) => {
          this.t_loading = false
          if(response.status == 200){
            if(response.body.code == 200){
              let r_data = response.body.data;
              // 处理数据
              _this.sleepArr = r_data.sleep_data

              // 图表渲染
              _this.createBar(r_data.sleep_info)
              _this.createPie(r_data.sleep_info)

              // 更新时间
              _this.navi_text.subTitle = '(更新时间:' + (new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes() ) ) + '   提示:数据每5分钟更新一次)'

              _this.paging(r_data.paging)
            } else {
              _this.alertMsg("error", response.body.msg?response.body.msg:'服务器端错误' )
            }

          } else {
            _this.alertMsg("error", '请求错误:' +response.status + " - " + response.url)
          }


        })
      },
      createBar(data){
        let myChart = echarts.init(document.getElementById('left-ct'));

        var xData = data.per
        var num = data.num
        let option = {
          title: {
            text: "24小时睡眠时间占比统计",
            x: "1%",
            textStyle: {
              color: '#446699',
              fontSize: '13'
            }
          },
          tooltip: {
//            "trigger": "axis",
            "axisPointer": {
              "type": "shadow",
              textStyle: {
                color: "#fff"
              }
            },
          },
          grid: {
            "borderWidth": 0,
            "top": '18%',
            "bottom": '15%',
            textStyle: {
              color: "#fff"
            }
          },
          calculable: true,
          xAxis: [{
            "name": '睡眠时间比',
            "nameGap": '5',
            "type": "category",
            "axisLine": {
              lineStyle: {
                color: '#90979c'
              }
            },
            "splitLine": {
              "show": false
            },
            "axisTick": {
              "show": false
            },
            "splitArea": {
              "show": false
            },
            "axisLabel": {
              "interval": 0,
            },
            "data": xData,
          }],
          yAxis: [{
            "name": '人次',
            "type": "value",
            "splitLine": {
              "show": false
            },
            "axisLine": {
              lineStyle: {
                color: '#90979c'
              }
            },
            "axisTick": {
              "show": false
            },
            "axisLabel": {
              "interval": 0,

            },
            "splitArea": {
              "show": false
            },

          }],

          series: [{
              "name": "睡眠时间占比",
              "type": "bar",
              "stack": "总数",
              "barMaxWidth": 25,
              "barGap": "10%",
              "itemStyle": {
                "normal": {
                  "color": "#61A0A8",
                  "label": {
                    "show": true,
                    "textStyle": {
                      "color": "#fff"
                    },
                    "position": "insideTop",
                    formatter: function (p) {
                      return p.value > 0 ? (p.value) : '';
                    }
                  }
                }
              },
              "data": num,
            }, {
              "name": "睡眠时间占比",
              "type": "line",
              "stack": "总数",
              symbolSize: 8,
              symbol: 'circle',
              "itemStyle": {
                "normal": {
                  "color": "#6ca7e2",
                  "barBorderRadius": 0,
                  "label": {
                    "show": true,
                    "position": "top",
                    formatter: function (p) {
                      return p.value > 0 ? (p.value) : '';
                    }
                  }
                }
              },
              "data": num
            },
          ]
        };
        myChart.setOption(option);
      },
      createPie(data){
        let myChart = echarts.init(document.getElementById('right-ct'));

        let good_sum = data.good
        let ok_sum = data.ok
        let bad_sum = data.bad

        let yA = [
          {value: good_sum, name: '良好'},
          {value: ok_sum, name: '一般'},
          {value: bad_sum, name: '差'},
        ];
        let total = good_sum + ok_sum + bad_sum

        let option = {
          title: {
            text: "24小时睡眠质量占比统计",
            x: "1%",
            subtext: "统计人次:" + total,
            textStyle: {
              color: '#446699',
              fontSize: '13'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          color: ['#61A0A8', '#D48265', '#C23531'],
          legend: {
            orient: 'vertical',
            x: 'right',
            data: ['良好', '一般', '差'],
            formatter: function (name) {
              var oa = option.series[0].data;
              var num = oa[0].value + oa[1].value + oa[2].value;
              for (var i = 0; i < option.series[0].data.length; i++) {
                if (name == oa[i].name) {
                  return name + '     ' + oa[i].value + '     ' + (oa[i].value / num * 100).toFixed(2) + '%';
                }
              }
            }
          },
          series: [
            {
              name: '睡眠质量占比',
              type: 'pie',
              radius: '55%',
              center: ['50%', '58%'],
              data: yA,
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    formatter: '{b} : {c} ({d}%)'
                  }
                },
                labelLine: {show: true}
              }
            }
          ]
        };

        myChart.setOption(option);
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.requestData()
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.requestData()
      },
      paging(p){
        this.totalNum = p.total_num;
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
  .t-bd{
    padding: 10px;
  }
</style>
