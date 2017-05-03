<template>
  <div class="echart-bar" :id="sId">
  </div>
</template>

<script>
  var echarts = require('echarts');
  export default {
    name: 'echart-bar',
    props: {
      pData: Object,
      sId: {
        type: [String, Number]
      }
    },
    mounted () {
      this.createEcharts(this.sId, this.pData)
    },
    watch: {
      pData: function (newVal, oldVal) {
        this.createEcharts(this.sId, this.pData)
      }
    },
    methods: {
      createEcharts(sId, pData){
        var myChart = echarts.init(document.getElementById(sId));
        var option = {
          title: {
            text: pData.title,
            left: 'center',
            textStyle: {
              fontSize: 14
            }
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
            bottom: '30',
            top: '40',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: pData.xA,
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value',
          }],
          series: [{
            type: 'bar',
            data: pData.yA,
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = ['#91C7AE', '#C23531', '#D48265', '#2F4554'];
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
      }
    }
  }
</script>

<style scoped>

  .echart-bar {
    width: 195px;
    height: 160px;
  }
</style>
