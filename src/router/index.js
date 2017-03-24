import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from '../views/dashboard.vue'
import BedStatusMonitor from '../views/bed-status-monitor.vue'
import HAlertMonitor from '../views/24h-alert-monitor.vue'
import HSleepMonitor from '../views/24h-sleep-monitor.vue'
import AlertSearch from '../views/alert-search.vue'
import ReportSearch from '../views/report-search.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', component: Dashboard},
    {path: '/dashboard', component: Dashboard},
    {path: '/bedStatusMonitor', component: BedStatusMonitor},
    {path: '/hAlertMonitor', component: HAlertMonitor},
    {path: '/hSleepMonitor', component: HSleepMonitor},
    {path: '/alertSearch', component: AlertSearch},
    {path: '/reportSearch', component: ReportSearch},
  ]
})
