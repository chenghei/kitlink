// import Vue from 'vue'
// import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import base from './module/base'
import node from './module/node'
import gateway from './module/gateway'
import workOrder from './module/workOrder'
import grid from './module/grid'
import system from './module/system'
import report from './module/report'
import monitor from './module/monitor'
import project from './module/project'
import control from './module/control'
import power from './module/power'
import prison from './module/prison'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    app,
    base,
    node,
    gateway,
    workOrder,
    grid,
    system,
    report,
    monitor,
    project,
    control,
    power,
    prison
  }
})
