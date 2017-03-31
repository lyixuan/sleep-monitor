<template>
  <div class="h-alert-monitor">
    <s-navi :nData="navi_text"></s-navi>

    <div class="chart">
      <div class="c-h">报警状态统计图</div>
      <div class="c-b">
        <div id="left-ct"></div>
      </div>
    </div>

    <div class="table">
      <div class="t-h">24小时报警监控详情 <span class="export" @click="exportExcel">导出Excel</span></div>
      <div class="t-b">
        <div class="t-bd">
          <el-table :data="alarmArr" style="width: 100%" border
                    :default-sort="{prop: 'alarm_time', order: 'descending'}" max-height="500">
            <el-table-column prop="cust_id" label="工号" min-width="100" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="cust_name" label="姓名" min-width="100" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="sche_begin_time" label="计划入寓时间" min-width="180" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="sche_end_time" label="计划出寓时间" min-width="180" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="workshop_des" label="车间" min-width="100" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="fleet_des" label="车队" min-width="100" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="group_des" label="指导组" min-width="100" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="apart_des" label="公寓" min-width="100" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="floor_des" label="楼层" min-width="100" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="room_des" label="房间" min-width="100" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="bed_des" label="床位" min-width="100" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="bed_state_des" label="床位状态" min-width="120" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="alarm_state_des" label="报警类型" min-width="150" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column prop="alarm_time" label="报警时间" min-width="180" show-overflow-tooltip
                             sortable></el-table-column>
          </el-table>
          <el-pagination class="m-paging"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="currentPage"
                         :page-sizes="[10, 20, 50, 100]"
                         :page-size="pageSize"
                         layout="total, sizes, prev, pager, next"
                         :total="totalNum">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  var echarts = require('echarts');
  import SNavi from '../components/Navi.vue'
  export default {
    name: 'search-index',
    components: {
      SNavi
    },
    data () {
      return {
        navi_text: {
          title: '24小时报警监控',
          subTitle: '',
          btn: ''
        },
        alarmArr: [],

        currentPage: 1,
        pageSize: 10,
        totalNum: 0
      }
    },
    mounted () {
      var _this = this;
      this.requestData();
      var timer = null;
      timer = setInterval(update, 1000 * 60 * 5)
      function update() {
        if (window.location.hash.indexOf('alarm_24monitor') > 0) {
          _this.requestData()
        } else {
          clearInterval(timer)
        }
      }
    },
    methods: {
      exportExcel(){
        window.open(P_MONITOR + 'alarm_24monitor_excel.php');
      },
      requestData(){
        let params = {
          page_size: this.pageSize,
          current_page: this.currentPage
        };
        this.$resource(P_MONITOR + 'alarm_24monitor').get(params).then((response) => {
          let r_data = response.body.data;

          // 处理数据
          this.alarmArr = r_data.alarm_data

          // 图表渲染
          this.createBar(r_data.alarm_info)

          // 更新时间
          this.navi_text.subTitle = '(更新时间:' + (new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes() ) ) + '   提示:数据每5分钟更新一次)'

          this.paging(r_data.paging)
        })
      },
      createBar(data){
        let myChart = echarts.init(document.getElementById('left-ct'));

        var xData = data.time
        var a1 = data.a1
        var a2 = data.a2
        var a3 = data.a3
        var a4 = data.a4
        var a5 = data.a5
        var a6 = data.a6
        var total = []
        for (let i = 0; i < xData.length; i++) {
          total[i] = a1[i] + a2[i] + a3[i] + a4[i] + a5[i] + a6[i]
        }

        let option = {
          title: {
            text: "24小时报警统计",
            subtext: "统计时间点前一个小时数据",
            x: "1%",
            textStyle: {
              color: '#446699',
              fontSize: '13'
            }
          },
          tooltip: {
            "trigger": "axis",
            "axisPointer": {
              "type": "shadow",
              textStyle: {
                color: "#fff"
              }

            },
          },
          grid: {
            "borderWidth": 0,
            "top": '25%',
            "left": "5%",
            "right": "5%",
            "bottom": '15%',
            textStyle: {
              color: "#fff"
            }
          },
          legend: {
            x: '30%',
            top: '2%',
            textStyle: {
              color: '#90979c',
            },
            "data": ['设备故障', '睡眠时间不足60%', '在床未睡1小时', '离床3次', '离床30分钟', '频繁体动']
          },

          calculable: true,
          xAxis: [{
            "name": '时间',
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
            "name": "设备故障",
            "type": "bar",
            "stack": "总数",
            "itemStyle": {
              "normal": {
                "color": "#c23531",
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
            "data": a1
          },
            {
              "name": "睡眠时间不足60%",
              "type": "bar",
              "stack": "总数",
              "itemStyle": {
                "normal": {
                  "color": "#2f4554",
                  "barBorderRadius": 0,
                  "label": {
                    "show": true,
                    "position": "inside",
                    formatter: function (p) {
                      return p.value > 0 ? (p.value) : '';
                    }
                  }
                }
              },
              "data": a2
            }, {
              "name": "在床未睡1小时",
              "type": "bar",
              "stack": "总数",
              "barMaxWidth": 25,
              "barGap": "10%",
              "itemStyle": {
                "normal": {
                  "color": "#61a0a8",
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
              "data": a3,
            }, {
              "name": "离床3次",
              "type": "bar",
              "stack": "总数",
              "itemStyle": {
                "normal": {
                  "color": "#d48265",
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
              "data": a4
            },
            {
              "name": "离床30分钟",
              "type": "bar",
              "stack": "总数",
              "itemStyle": {
                "normal": {
                  "color": "#91c7ae",
                  "barBorderRadius": 0,
                  "label": {
                    "show": true,
                    "position": "inside",
                    formatter: function (p) {
                      return p.value > 0 ? (p.value) : '';
                    }
                  }
                }
              },
              "data": a5
            }, {
              "name": "频繁体动",
              "type": "bar",
              "stack": "总数",
              "barMaxWidth": 25,
              "barGap": "10%",
              "itemStyle": {
                "normal": {
                  "color": "#749f83",
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
              "data": a6,
            }, {
              "name": "累计",
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
              "data": total
            },
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
    width: 100%;
  }

  .t-bd {
    padding: 10px;
  }
</style>
