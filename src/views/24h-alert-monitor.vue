<template>
  <div class="h-alert-monitor">
    <s-navi :data="naviText"></s-navi>
  </div>
</template>

<script>
  import SNavi from '../components/Navi.vue'
  export default {
    name: 'search-index',
    components:{
      SNavi
    },
    data () {
      return {
        naviText:{
          title:'24小时报警监控',
          subTitle:'(更新时间:00:00 提示:数据每5分钟更新一次)',
          btn:'手动更新'
        }
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

</style>
