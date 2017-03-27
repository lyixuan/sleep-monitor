import Vue from 'vue'

Vue.prototype.alertMsg = function (type, msg) {
  //type : success/warning/info/error
  this.$message({
    type: type,
    message: msg
  })
};


Vue.prototype.formatDate = function (date) {
  /**
   * format date to yyyy-MM-dd
   * @date 毫秒
   */
  return date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())

};

// 拦截器
Vue.http.interceptors.push((request, next) => {
  /**
   * 暂时增加.php后缀
   */
  var _this = this;
  request.url = request.url + '.php'

  // 统一拦截错误提示
  next((response) => {
    if (response.status != 200) {
      Vue.prototype.alertMsg("error", response.statusText + ": " + response.url)
    }
    // 服务器内部错误提示
    if (response.body.code < 0) {
      Vue.prototype.alertMsg("error", '服务器错误:\n' +response.body.code + ": " + response.body.msg)
    }
  });
});
