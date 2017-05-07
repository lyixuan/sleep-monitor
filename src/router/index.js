import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from '../views/dashboard.vue'
import BedStatusMonitor from '../views/bed-status-monitor.vue'
import HAlertMonitor from '../views/24h-alarm-monitor.vue'
import HSleepMonitor from '../views/24h-sleep-monitor.vue'
import AlertSearch from '../views/alarm-search.vue'
import ReportSearch from '../views/report-search.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', component: Dashboard},
    {path: '/dashboard', component: Dashboard},
    {path: '/bed_state', component: BedStatusMonitor},
    {path: '/alarm_24monitor', component: HAlertMonitor},
    {path: '/sleep_24monitor', component: HSleepMonitor},
    {path: '/alarm_search', component: AlertSearch},
    {path: '/report_search', component: ReportSearch},
  ],
  scrollBehavior (to, from, savedPosition) {
      console.log('abc')
    // return 期望滚动到哪个的位置
    return { x: 0, y: 0 }
  }
})
