<template>
  <div id="report">
    <div class="wrap">
      <div class="wrap-in">
        <h1><img :src="report.info.logo" width="50"
                 style="vertical-align: text-bottom;margin-right: 10px;"/>{{report.info.locomotive_depot}}</h1>
        <div class="subTitle">司乘人员睡眠监测总结报告</div>
        <div class="dep">个人信息:</div>
        <table>
          <tr>
            <td class="label">司机工号:</td>
            <td class="cont">{{report.people_info.cust_id}}</td>
            <td class="label">司机姓名:</td>
            <td class="cont">{{report.people_info.cust_name}}</td>
            <td class="label">计划路线:</td>
            <td class="cont">{{report.people_info.train_des}}</td>
          </tr>
          <tr>
            <td class="label">段别:</td>
            <td class="cont">{{report.people_info.locomotive_depot}}</td>
            <td class="label">车间:</td>
            <td class="cont">{{report.people_info.workshop}}</td>
            <td class="label">车队:</td>
            <td class="cont">{{report.people_info.fleet}}</td>
          </tr>
          <tr>
            <td class="label">指导组:</td>
            <td class="cont">{{report.people_info.group}}</td>
            <td class="label">职位:</td>
            <td class="cont">{{report.people_info.position}}</td>
            <td class="label">联系方式:</td>
            <td class="cont">{{report.people_info.phone}}</td>
          </tr>
        </table>
        <div class="dep">保休信息:</div>
        <table>
          <tr>
            <td class="label">保休公寓:</td>
            <td class="cont">{{report.relax_info.apart}}</td>
            <td class="label">房间号:</td>
            <td class="cont">{{report.relax_info.room}}</td>
            <td class="label">床位号:</td>
            <td class="cont">{{report.relax_info.bed}}</td>
          </tr>
          <tr>
            <td class="label">计划入寓:</td>
            <td class="cont">{{report.relax_info.sche_start}}</td>
            <td class="label">计划出寓:</td>
            <td class="cont">{{report.relax_info.sche_end}}</td>
            <td class="label">计划在寓时长:</td>
            <td class="cont">{{report.relax_info.sche_time}}</td>
          </tr>
          <tr>
            <td class="label">实际入寓:</td>
            <td class="cont">{{report.relax_info.in}}</td>
            <td class="label">实际出寓:</td>
            <td class="cont">{{report.relax_info.out}}</td>
            <td class="label">实际在寓时长:</td>
            <td class="cont">{{report.relax_info.in_time}}</td>
          </tr>
        </table>
        <div class="pingu">睡眠评估: {{report.assess_state}}</div>

        <div class="nt">一、起居事件</div>
        <div class="border-table">
          <table>
            <tr>
              <td>事件</td>
              <td>上床时间</td>
              <td>离床时间</td>
              <td>在床时长</td>
              <td>离床时长</td>
            </tr>
            <tr v-for="item in report.weak_up" v-if="report.weak_up.length>0">
              <td>{{item.id}}</td>
              <td>{{item.in_bed}}</td>
              <td>{{item.out_bed}}</td>
              <td>{{item.in_time}}</td>
              <td>{{item.out_time}}</td>
            </tr>
            <tr v-if="report.weak_up.length==0">
              <td colspan="5">暂无数据</td>
            </tr>
          </table>
        </div>
        <div class="nt">二、睡眠统计</div>
        <div class="border-table">
          <table>
            <tr>
              <td>状态</td>
              <td>离床</td>
              <td>在床未睡</td>
              <td>睡眠</td>
            </tr>
            <tr v-for="item in report.sleep_stat">
              <td>{{item.state}}</td>
              <td>{{item.in_bed}}</td>
              <td>{{item.out_bed}}</td>
              <td>{{item.sleep}}</td>
            </tr>
          </table>
        </div>
        <div class="nt">三、报警统计</div>
        <div class="border-table">
          <table>
            <tr>
              <td>报警类型</td>
              <td>报警时间</td>
            </tr>
            <tr v-for="item in report.alarm_stat" v-if="report.alarm_stat.length>0">
              <td>{{item.state}}</td>
              <td>{{item.time}}</td>
            </tr>
            <tr v-if="report.alarm_stat.length==0">
              <td colspan="2" style="text-align: center">没有信息</td>
            </tr>
          </table>
        </div>
        <div class="nt">四、总结</div>
        <div class="zj">记录时间: {{report.sum_up.report_start}} ~ {{report.sum_up.report_end}} , 共
          {{report.sum_up.report_time}}
        </div>
        <div class="zj">睡眠时长: {{report.sum_up.sleep_time}} ({{report.sum_up.sleep_per}}) ,
          觉醒时长:{{report.sum_up.weak_time}} ({{report.sum_up.weak_per}})
        </div>
        <div class="zj">离床时长: {{report.sum_up.out_bed}} ({{report.sum_up.out_per}}) , 起床次数:{{report.sum_up.weak_num}}次,
          报警次数:{{report.sum_up.alarm_num}}次
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'report',
    data () {
      return {
        report: {
          info: {
            logo: "",
            locomotive_depot: ""
          },
          people_info: {},
          relax_info: {},
          assess_state: "",
          weak_up: [],
          sleep_stat: [],
          alarm_stat: [],
          sum_up: {}
        }
      }
    },
    mounted(){
      this.getReport(window.location.hash.substr(2))
    },
    methods: {
      getReport(id){
        this.$resource(P_BASE + 'print_report').get({report_id: id}).then((response) => {
          this.report = response.body.data;
        })
      },
    }

  }
</script>

<style>
  body {
    color: #555555;
    margin: 0;
    padding: 0;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
    font-size: 14px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    background: #fff;
  }

  .wrap {
    width: 210mm;
    height: 297mm;
    margin: 0 auto;
    border: 2px solid red;
    padding: 1px;
  }

  .wrap-in {
    width: 100%;
    height: 100%;
    border: 1px solid red;
    box-sizing: border-box;
    padding: 10px;
  }

  .wrap-in h1 {
    letter-spacing: 5px;
    width: 100%;
    text-align: center;
    color: red;
    font-size: 35px;
  }

  .subTitle {
    width: 100%;
    text-align: center;
    font-weight: bold;
    font-size: 20px;
  }

  .dep {
    margin-top: 10px;
    font-weight: 600;
  }

  table {
    width: 100%;
    margin-left: -10px;
  }

  tr {
    height: 30px;
    color: #666;
  }

  .label {
    /*font-weight: 600;*/
    width: 100px;
    padding-left: 20px;
  }

  .cont {
    width: 150px;
    text-align: left;
    border-bottom: 1px solid #ccc;
  }

  .pingu {
    margin-top: 10px;
    font-size: 20px;
    font-weight: 600;
  }

  .nt {
    margin-top: 10px;
  }

  .border-table {
    padding: 10px 25px;
  }

  .border-table table {
    box-sizing: border-box;
    border-collapse: collapse;
  }

  .border-table td {
    border: 1px solid #ccc;
    padding: 0 5px;
  }

  .zj {
    margin-top: 10px;
    padding: 0 15px;
  }
</style>
