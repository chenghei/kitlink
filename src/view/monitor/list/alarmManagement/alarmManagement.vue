<style lang="less" scoped src="./alarmManagement.less"></style>
<template>
    <div id="alarmManagement">
        <div class="content boxShadow">
            <div class="header">
                <div>
                    <img src="../../../../assets/images/jiantouzuo.svg"  @click="changeRouter('/monitor/index/list')">
                    <span>{{$t('alarm_mgmt')}}</span>
                </div>
                <div @click="alarmExport">
                <img src="../../../../assets/images/daochu.svg">
                   {{$t('exp')}}
                </div>
            </div>
            <Row type="flex" class="content_select">
              <div class="content_select_input">
                <p>{{$t('device_type')}}：</p>
                <i-col span="12" style="width:200px;">
                    <i-select v-model="nodeList.fport" filterable clearable @on-change="changeNodeType">
                        <i-option v-for="item in alarmNodeType" :value="item.id" :key="item.id">{{ item.name }}</i-option>
                    </i-select>
                </i-col>
              </div>
              <div class="content_select_input">
                <p>{{$t('system_rule')}}：</p>
                <i-col span="12" style="width:200px;">
                    <i-select v-model="nodeList.ruleId" filterable clearable >
                        <i-option v-for="(item,index) in ruleList" :value="item.ruleType == 'S' ? item.level : item.id" :key="index">{{ item.name }}</i-option>
                    </i-select>
                </i-col>
              </div>
              <div class="content_select_input">
                <p>{{$t('time_period')}}：</p>
                <i-col >
                    <Date-picker type="daterange" :placeholder="$t('time_period')" @on-change="dateChange" @on-clear="dateClear" style="width: 200px"></Date-picker>
                </i-col>
              </div>
              <div class="content_select_input">
                <p>{{$t('info_other')}}：</p>
                <Input type="text" v-model="nodeList.search" :placeholder="$t('device_code')+'/'+$t('device_name')+'/'+$t('mobile')" style="width:200px"/>
              </div>
              <div class="select_button" @click="init">{{$t('query')}}</div>
            </Row>
            <Table ref="table" :height="tableHeight" :columns="nodeList.columns" :loading="nodeList.loading" :data="nodeList.data"></Table>
            <div class="list_bottom">
                <Page :total="nodeList.total" :page-size="nodeList.pageSize" @on-change="nextPage" show-elevator show-total></Page>
            </div>
        </div>
        <Modal v-model="exportStatus" class="exportClass" :width="450">
          <p slot="header" style="color:#1A1A1A;">导出条件</p>
          <Row type="flex" style="align-items: center;margin-bottom:20px;margin-left:60px">
            <i-col > <b>{{$t('device_type')}}：</b> </i-col> 
            <i-col  style="width:200px;margin-left:20px">
                <i-select v-model="exportData.fport" filterable clearable @on-change="changeNodeType1">
                    <i-option v-for="item in alarmNodeType" :value="item.id" :key="item.id">{{ item.name }}</i-option>
                </i-select>
            </i-col>
          </Row>
          <Row type="flex" style="align-items: center;margin-bottom:20px;margin-left:60px">
            <i-col> <b>{{$t('system_rule')}}：</b> </i-col> 
            <i-col style="width:200px;margin-left:20px">
              <i-select v-model="exportData.ruleId" filterable clearable >
                  <i-option v-for="(item,index) in ruleList1" :value="item.ruleType == 'S' ? item.level : item.id" :key="index">{{ item.name }}</i-option>
              </i-select>
          </i-col>
          </Row>
          <Row type="flex" style="align-items: center;margin-bottom:20px;margin-left:60px">
            <i-col> <b>{{$t('time_period')}}：</b> </i-col> 
            <i-col style="width:200px;margin-left:20px">
              <Date-picker type="daterange" :value="[]" :placeholder="$t('time_period')" @on-change="dateChange1" @on-clear="dateClear1" style="width: 200px"></Date-picker>
          </i-col>
          </Row>
          <!-- <Row type="flex" style="align-items: center;margin-bottom:20px;margin-left:60px">
            <i-col> <b>{{$t('info_other')}}：</b> </i-col> 
            <i-col style="width:200px;margin-left:20px">
              <input type="text" v-model="exportData.search" class="input_middle" :placeholder="$t('device_code')+'/'+$t('device_name')+'/'+$t('mobile')" style="width:200px">
          </i-col>
          </Row> -->
          <div slot="footer">
            <Button :loading="exportLoading" type="success" @click="exportAlarm">{{$t('exp')}}</Button>
            <Button @click="exportStatus = false">{{$t('cancel')}}</Button>
          </div>
        </Modal>
        <AlarmDetail :showModel="showModel" :modelList="modelList" @change-model="changeModel"></AlarmDetail>
    </div>
</template>
<script>
import expandRow from '_c/table-expand/table-expand'
import { mapGetters, mapActions } from 'vuex'
import AlarmDetail from '_c/alarmDetail/alarmDetail'
import config from '@/config'
import { getToken, getHid, getUid, getSid  } from '@/libs/util'

export default {
  components: { 
    expandRow,
    AlarmDetail
  },
  data () {
    return {
      exportLoading: false,
      exportStatus: false,
      path: config.assetsPatch,
      showModel:false,
      modelList: {},
      tableHeight:'',
      nodeList: {
        columns: [
          {
              type: 'expand',
              width: 50,
              render: (h, params) => {
                  return h(expandRow, {
                      props: {
                          row: params.row
                      }
                  })
              }
          },
          {
            title: this.$t('org_name'),
            key: 'officeName',
            minWidth:70,
          },
          {
            title: this.$t('device_name'),
            key: 'name',
            width:150,
          },
          {
            title: this.$t('device_type'),
            key: 'typeName',
            minWidth:70,
          },
          {
            title: this.$t('alarm_type'),
            minWidth:70,
            render: (h,params) => {
              return h('span', params.row.nodeAlertMsg.rule.name)
            }
          },
          {
            title: this.$t('alarm_time'),
            minWidth:70,
            render: (h, params) => {
              return h('span', moment(params.row.nodeAlertMsg.ts).format("YYYY-MM-DD HH:mm:ss"))
            }
          },
          {
            title: this.$t('proc_time'),
            minWidth:70,
            render: (h, params) => {
              let ts = moment(params.row.nodeAlertMsg.done_time).format("YYYY-MM-DD HH:mm:ss")
              if(ts == 'Invalid date') {
                ts = '-'
              }
              return h('span', ts)
            }
          },
          {
            title: this.$t('alarm_proc'),
            minWidth:70,
            render: (h, params) => {
              let doneType = ''
              switch (params.row.nodeAlertMsg.done == 2 ? (parseInt(params.row.nodeAlertMsg.done_type) || 0) : params.row.nodeAlertMsg.done) {
                case 9:
                doneType = this.$t('restore')
                break;
                case 1: 
                doneType = this.$t('real_alarm') 
                break;
                case 2: 
                doneType = this.$t('hidden_danger') 
                break;
                case 3: 
                doneType = this.$t('false_alarm') 
                break;
                case 4: 
                doneType = this.$t('inspection_test') 
                break;
                default :
                doneType = this.$t('to_do') 
              }
              return h('span',doneType)
            }
          },
          {
            title: this.$t('op'),
            key: 'detail',
            width: 200,
            render: (h, params) => {
              return h('div', [
                h('Tooltip',{
                    props:{
                      content: this.$t('device_detail'),
                      placement:'top',
                    },
                    style: {
                        marginRight: '40px'
                    }
                  }, [
                  h('img', {
                      attrs: {
                          src: require("../../../../assets/images/xiangqing.svg"),
                      },
                      style: {
                        cursor:'pointer',
                        width: '16px',
                        marginTop:'4px'
                      },
                      on: {
                        click: () => {
                          this.$router.push({
                            name: 'monitor_onlineDetail', 
                            params: { nodeId: params.row.id}
                          })
                        }
                      }
                  }),
                  ]),
                  h('Tooltip',{
                    props:{
                      content: this.$t('proc'),
                      placement:'top',
                    },
                    style: {
                        marginRight: '40px'
                    }
                  }, [
                  h('img', {
                      attrs: {
                          src: require("../../../../assets/images/chuli.svg"),
                      },
                      style: {
                        cursor:'pointer',
                        width: '16px',
                        marginTop:'4px',
                        display:params.row.nodeAlertMsg.done !== 1 &&params.row.nodeAlertMsg.done !== 2 && params.row.nodeAlertMsg.done !== 3 && params.row.nodeAlertMsg.done !== 4 && params.row.nodeAlertMsg.done !== 9 ? 'inline' : 'none'
                      },
                      on: {
                        click: () => {
                          this.showModel = true
                          let v = params.row
                          this.modelList = {
                            sequence:[v.nodeAlertMsg.sequence],
                            ts: v.nodeAlertMsg.ts,
                            address: v.address,
                            name: v.name,
                            typeName: v.typeName,
                            devEui: v.devEui,
                            counts: v.counts,
                            ruleName: v.nodeAlertMsg.rule.name,
                            ruleId: v.nodeAlertMsg.rule.id
                          }
                        }
                      }
                  }),
                  ]),
              ]);
            }
          },
        ],
        data: [],
        fport: '',
        dateBegin: '',
        dateEnd: '',
        search: '',
        ruleId: '',
        loading: false,
        pageSize: 10,
        pageNo: 1,
        total:0
      },
      ruleList: [],
      ruleList1: [],
      normalFport:[],
      exportData:{
        fport:'',
        dateBegin:'',
        dateEnd:'',
        search:'',
        ruleId:''
      }
    }
  },
  computed: {
    ...mapGetters([
      'alarmNodeType'
    ])
  },
  methods: {
    ...mapActions([
      'getNodesAlarmList',
      'getAlarmRules',
    ]),
    changeModel (state,refresh) {
      this.showModel = state
      if(refresh) {
        this.init()
      }
    },
    init () {
      const data = {
        fport: this.nodeList.fport ? this.nodeList.fport : this.normalFport.join(","),
        dateBegin: this.nodeList.dateBegin,
        dateEnd: this.nodeList.dateEnd,
        search: this.nodeList.search,
        ruleId: this.nodeList.ruleId,
        pageSize: this.nodeList.pageSize,
        pageNo:this.nodeList.pageNo
      }
      // this.nodeList.loading = true
      this.getNodesAlarmList(data).then(res => {
        this.nodeList.data = res.data.rs.data.list
        this.nodeList.total = res.data.rs.data.total
        this.nodeList.loading = false
      })
    },

    nextPage (page) {
      this.nodeList.pageNo = page
      this.init()
    },
    changeNodeType () {
      this.getAlarmRules({fport:this.nodeList.fport?this.nodeList.fport:''}).then(res => {
        let data = {
          name: this.$t('vol_low_alert'),
          id: '366b7f7e5e05497eaa03261da5f5ef02'
        }
        this.ruleList = res.data.rs.data
        this.ruleList.push(data)
      })
    },
    dateChange(event) {
      if(event[0] && event [1]){
        this.nodeList.dateBegin = moment(event[0]).valueOf()
        this.nodeList.dateEnd = moment(event[1]).valueOf()
      }
    },
    dateClear() {
      this.nodeList.dateBegin = this.nodeList.dateEnd = ''
    },
    dateChange1(event) {
      if(event[0] && event [1]){
        this.exportData.dateBegin = moment(event[0]).valueOf()
        this.exportData.dateEnd = moment(event[1]).valueOf()
      }
    },
    dateClear1() {
      this.exportData.dateBegin = this.exportData.dateEnd = ''
    },
    changeNodeType1 () {
      this.getAlarmRules({fport:this.exportData.fport?this.exportData.fport:''}).then(res => {
        let data = {
          name: this.$t('vol_low_alert'),
          id: '366b7f7e5e05497eaa03261da5f5ef02'
        }
        this.ruleList1 = res.data.rs.data
        this.ruleList1.push(data)
      })
    },
    changeRouter (url) {
      this.$router.push(url)
    },
    alarmExport () {
      this.exportStatus = true
      this.exportData = {
        fport:'',
        dateBegin:'',
        dateEnd:'',
        search:'',
        ruleId:''
      }
    },
    exportAlarm () {
      this.exportLoading = true
      window.location.href=`${this.path}/p/a/rest-api/data/nodes/alarm/list/history/export?fport=${this.exportData.fport?this.exportData.fport:''}&dateBegin=${this.exportData.dateBegin}&dateEnd=${this.exportData.dateEnd}&search=${this.exportData.search}&ruleId=${this.exportData.ruleId?this.exportData.ruleId:''}&token=${getToken()}&h=${getHid()}&uid=${getUid()}&sid=${getSid()}`
      setTimeout(() => {
        this.exportLoading = false
        this.exportStatus = false
      },1500)
    }
  },
  created () {
    this.$store.dispatch('getAlarmNodeType')
    this.alarmNodeType.map(e => {
      this.normalFport.push(e.id)
    })
    this.init()
  },
  mounted () {
    this.$nextTick(()=>{
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
    })
    window.onresize = () => {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
    }

    if(this.$i18n.locale === 'en-US') {
        moment.locale('en-us')
    }else{
        moment.locale('zh-cn')
    }
  }
}
</script>
