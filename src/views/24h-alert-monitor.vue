<template>
  <div class="search-index">
    <el-row class="page-info">
      <el-col :span="12" class="x-title">信息检索</el-col>
    </el-row>
    <el-row :gutter="10" class="row">
      <el-col :span="2">
        录入日期:
      </el-col>
      <el-col :span="5">
        <el-date-picker v-model="date_range" type="daterange" placeholder="选择日期范围"></el-date-picker>
      </el-col>
      <el-col :span="1">
        &nbsp;
      </el-col>
      <el-col :span="2">
        就诊卡号:
      </el-col>
      <el-col :span="5">
        <el-input v-model="card_id" placeholder="卡号"></el-input>
      </el-col>
      <el-col :span="5">
        <el-button type="primary" @click="search" size="mini">检索</el-button>
      </el-col>
    </el-row>
    <div class="cont">
      <el-table
        :data="tableData" border style="width: 100%" stripe empty-text>
        <el-table-column prop="name" label="姓名" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="card_id" label="诊疗卡号" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="visit_date" label="就诊日期" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sex" label="性别" min-width="70" :formatter="sexFormat"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="age" label="年龄" min-width="70" show-overflow-tooltip></el-table-column>
        <el-table-column prop="birthday" label="出生日期" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mobile" label="联系电话" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="addr" label="住址" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="create_date" label="录入日期" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sick_type" label="疾病分类" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sick_name" label="疾病名称" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="90">
          <template scope="scope">
            <el-button type="text" size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="current_page"
        :page-size="page_size"
        :page-sizes="[10, 50, 100, 200, 500]"
        layout="total,sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'search-index',
    components: {},
    data () {
      return {
        date_range: [null, null],
        card_id: null,
        tableData: [],
        current_page: 1,
        page_size: 10,
        total: 0
      }
    },
    mounted () {
      this.search()
    },
    methods: {
      sexFormat(row, col){
        let result = '未知'
        if (row.sex == 'male') {
          result = '男'
        } else if (row.sex == 'female') {
          result = '女'
        }
        return result
      },
      search(){
        let params = {
          start_date: this.date_range[0] ? this.formatDate(new Date(this.date_range[0])) : null,
          end_date: this.date_range[1] ? this.formatDate(new Date(this.date_range[1])) : null,
          card_id: this.card_id,
          current_page: this.current_page,
          page_size: this.page_size
        }
        this.$resource(PATH_SEARCH + 'list').get(params).then((response) => {
          if (response.status == 200 && response.body.code == 200) {
            this.tableData = response.body.data
            this.total = response.body.total
            this.page_size = response.body.page_size
            this.current_page = response.body.current_page
          } else {
            this.alertMsg("error", response.status + " - " + response.url)
          }
        })
      },
      handleCurrentChange(val){
        this.current_page = val;
        this.search()
      },
      handleSizeChange(val){
        this.current_page = 1;
        this.page_size = val;
        this.search()
      }
    }
  }
</script>

<style scoped>
  .row {
    height: 50px;
    line-height: 50px;
    padding: 0 10px;
  }

  .page-info {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #D7D7D7;
    padding: 0 10px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .cont {
    padding: 0 10px;
    margin-top: 20px;
  }

  .pagination {
    margin: 20px 10px;
    float: right;
  }

  .el-input {
    display: inline-block;
  }

  .el-button--primary {
    padding: 6px 12px;
  }

</style>
