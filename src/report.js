// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Report from './Report.vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.config.productionTip = false

require('./root-conf')
/* eslint-disable no-new */
new Vue({
  el: '#report',
  template: '<report/>',
  components: { Report }
})
