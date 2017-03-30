<template>
  <div class="alarm-search">
    <s-navi :nData="navi_text"></s-navi>
    <div class="condition">
      <div class="bg-blue">检索条件</div>

      <div class="condition1">
        <div class="fl">报警类型：</div>
        <el-checkbox class="fl" v-model="checkAll" @change="handleCheckAllChange">全选
        </el-checkbox>
        <el-checkbox-group class="fl" v-model="checked" @change="handleChecked">
          <el-checkbox v-for="type in types" :label="type.id" :key="type.id">{{type.des}}</el-checkbox>
        </el-checkbox-group>
      </div>

      <div class="condition2">
        <div class="fl">检索方式：</div>
        <el-radio-group v-model="radio">
          <el-radio :label="1">个人检索</el-radio>
          <el-radio :label="2">床位检索</el-radio>
          <el-radio :label="3">分级检索</el-radio>
        </el-radio-group>
      </div>

      <div class="bg-blue">检索内容</div>

      <div class="condition3">
        <div class="fl c3f" v-show="1==radio">个人检索：</div>
        <div class="fl c3f" v-show="2==radio">床位检索：</div>
        <div class="fl c3f" v-show="3==radio">分级检索：</div>
        <div class="c3-1" v-show="1==radio">
          <el-input class="m-input" size="small" placeholder="请输入工号或姓名" v-model="cust_info"></el-input>
        </div>

        <div class="c3-2" v-show="2==radio">
          <el-autocomplete class="m-input" size="small" v-model="bed_id" :fetch-suggestions="querySearchAsync"
                           placeholder="请输入床位号"
                           @select="handleSelect"></el-autocomplete>
          <el-date-picker class="date_p" v-model="date_range" size="small" type="daterange"
                          placeholder="选择日期范围"></el-date-picker>
        </div>

        <div class="c3-3" v-show="3==radio">
          <el-cascader :options="levels" change-on-select class="m-cas" size="small"
                       @change="handleChange"></el-cascader>
        </div>

        <el-button type="primary" class="m-btn" @click="search">开始检索</el-button>
      </div>
    </div>

    <div style="clear: both"></div>
    <div class="table">
      <div class="t-h">检索详情 <span class="export" @click="exportExcel">导出Excel</span></div>
      <div class="t-b">
        <div class="t-bd">
          <el-table :data="alarmArr" style="width: 100%" border
                    :default-sort="{prop: 'alarm_time', order: 'descending'}" max-height="500">
            <el-table-column fixed prop="cust_id" label="工号" min-width="100" show-overflow-tooltip
                             sortable></el-table-column>
            <el-table-column fixed prop="cust_name" label="姓名" min-width="100" show-overflow-tooltip
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

    <div>

    </div>
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
          title: '报警检索',
          subTitle: '',
          btn: ''
        },
        // 多选
        checkAll: true,
        checked: [1, 2, 3, 4, 5, 6],
        types: [
          {id: 1, des: '设备故障'},
          {id: 2, des: '睡眠时间不足60%'},
          {id: 3, des: '在床未睡1小时'},
          {id: 4, des: '在床未睡1小时'},
          {id: 5, des: '离床30分钟'},
          {id: 6, des: '频繁体动'}],
        // 单选
        radio: 1,
        // 个人
        cust_info: '',
        // 床位
        bed_id: '',
        date_range: [],
        // 分级
        levels: [],
        checkedLevels: [],

        timer: null,
        alarmArr: [],

        currentPage: 1,
        pageSize: 10,
        totalNum: 0
      }
    },
    mounted () {
      this.search();
      this.getLevels()
    },
    methods: {
      exportExcel(){
        let params = {
          alarm_type: this.checked,
          search_type: this.radio
        };
        if (this.radio == 1) {
          params.search_content = {cust_info: this.cust_info}
        }
        if (this.radio == 2) {
          let start = this.date_range[0] != null ? this.formatDate(new Date(this.date_range[0])) : null
          let end = this.date_range[1] != null ? this.formatDate(new Date(this.date_range[1])) : null
          params.search_content = {bed_id: this.bed_id, start_time: start, end_time: end}
        }
        if (this.radio == 3) {
          params.search_content = {level: this.checkedLevels}
        }

        window.open(P_MONITOR + 'alarm_search_excel' + this.serialize(params));
      },
      serialize(params) {
        let result = '?'
        for (let key in params) {
          if (key == 'search_content') {
            for (let c in params[key]) {
              result += c + '=' + params[key][c] + '&'
            }
          } else {
            result += key + '=' + params[key] + '&'
          }
        }
        return result.substr(0, result.length - 1)
      },
      search(type){
        let params = {
          alarm_type: this.checked,
          search_type: this.radio
        };
        if (this.radio == 1) {
          params.search_content = {cust_info: this.cust_info}
        }
        if (this.radio == 2) {
          let start = this.date_range[0] != null ? this.formatDate(new Date(this.date_range[0])) : null
          let end = this.date_range[1] != null ? this.formatDate(new Date(this.date_range[1])) : null
          params.search_content = {bed_id: this.bed_id, start_time: start, end_time: end}
        }
        if (this.radio == 3) {
          params.search_content = {level: this.checkedLevels}
        }
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

        this.requestData(params)
      },
      requestData(params){
        this.$resource(P_MONITOR + 'alarm_search').save({}, params).then((response) => {
          let r_data = response.body.data;
          // 处理数据
          this.alarmArr = r_data.alarm_data

          this.paging(r_data.paging)

        }, (response) => {
        })
      },
      getLevels(){
        this.$resource(P_BASE + 'level_list').get().then((response) => {
          this.levels = response.body.data;
        })
      },
      handleCheckAllChange(event) {
        this.checked = event.target.checked ? [1, 2, 3, 4, 5, 6] : [];
      },
      handleChecked(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.types.length;
      },
      querySearchAsync(queryString, cb) {
        clearTimeout(this.timer)
        this.timer = setTimeout(query, 1000);
        let that = this

        function query() {
          let results = [];
          that.$resource(P_BASE + 'bed_no_list').get({str: queryString}).then((response) => {
            results = response.body.data;
            cb(results);
          })
        }
      },
      handleSelect(item) {
        this.bed_id = item.value
      },
      handleChange(value){
        this.checkedLevels = value
      },

      handleSizeChange(val) {
        this.pageSize = val
        this.search(1)
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.search(1)
      },
      paging(p){
        this.totalNum = p.total_num;
      }
    }
  }
</script>

<style scoped>
  @import "../assets/css/chart-table-page-com.css";

  .condition {
    margin-top: 5px;
    background: #fff;
    padding: 5px;
  }

  .bg-blue {
    background: #E7F4FA;
    color: #2195CB;
    height: 25px;
    line-height: 25px;
    padding-left: 5px;
    width: 100%;
    box-sizing: border-box;
  }

  .condition1, .condition2, .condition3 {
    width: 100%;
    height: 20px;
    padding: 10px;
  }

  .condition3 {
    height: auto;
    overflow: hidden;
  }

  .fl {
    float: left;
  }

  .fl:nth-child(1), .fl:nth-child(2) {
    margin-right: 10px;
  }

  .t-bd {
    padding: 10px;
  }

  .m-btn {
    width: 120px;
    border-radius: 0;
    margin-left: 20px;
    height: 30px;
    line-height: 5px;
    float: left;
  }

  .m-input {
    float: left;
    width: 200px;
  }

  .c3f, .m-input {
    height: 30px;
    line-height: 30px;
  }

  .date_p {
    margin-left: 10px;
    float: left;
  }

  .m-cas {
    float: left;
    width: 300px;

  }
</style>
