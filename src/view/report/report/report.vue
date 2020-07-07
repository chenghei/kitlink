<style lang="less" scoped src="./report.less"></style>
<template>
  <div id="report">
    <div class="top_echart boxShadow">
      <div class="header">
        <span>{{$t('warning_trend')}}</span>
        <div @click="exportAlarm">
          <img src="../../../assets/images/exportExcel.svg" alt="exportExcel">
          {{$t('exp')}} Excel
        </div>
      </div>
      <Row type="flex" class="content_select" style="border-bottom: 1px solid #ddd;"> 
        <div class="content_select_input">
          <p>{{$t('device_type')}}：</p>
          <i-col span="12" style="width:100px">
            <i-select v-model="reportSearch.fport" filterable clearable>
              <i-option v-for="item in nodeType" :value="item.fport" :key="item.id">{{ item.name }}</i-option>
            </i-select>
          </i-col>
        </div>
        <div class="content_select_input">
          <p>{{$t('address')}}：</p>
          <Input type="text" v-model="reportSearch.devAddr" style="width:200px"/>
        </div>
        <div class="content_select_input">
          <p>{{$t('time_period')}}：</p>
            <i-col>
              <Date-picker :value="time" type="daterange" :placeholder="$t('select_date')" style="width: 200px" @on-change="dateChange" @on-clear="dateClear"></Date-picker>
            </i-col>
        </div>
        <div class="select_button" @click="init">{{$t('query')}}</div>
      </Row>
      <div class="echart1">
        <div class="title">{{$t('daily_warning_events')}}</div>
        <ve-histogram :data="device.chart" :extend="chartExtend" :loading="chartsLoading" :data-empty="device.dataEmpty"></ve-histogram>
      </div>
      <div class="echart2">
        <div class="title">{{$t('daily_warning_devices')}}</div>
        <ve-histogram :data="event.chart" :extend="chartExtend" :loading="chartsLoading" :colors="colors" :data-empty="event.dataEmpty"></ve-histogram>
      </div>
    </div>
    <div class="new_msg boxShadow">
      <div class="header">
        <p>{{$t('new_message')}}</p>
        <div>
          <div style="margin-right:20px;" @click="exportMessage">
            <img src="../../../assets/images/exportExcel.svg" alt="exportExcel">
            {{$t('exp')}} Excel
          </div>
          <div>
            <img src="../../../assets/images/exportPDF.svg" alt="exportExcel">
            {{$t('exp')}} PDF
          </div>
        </div>
      </div>
      <Row type="flex" class="content_select"> 
        <div class="content_select_input">
          <p>{{$t('device_type')}}：</p>
          <i-col span="12" style="width:100px">
              <i-select v-model="reportList.devType" filterable clearable>
                  <i-option v-for="item in nodeType" :value="item.fport" :key="item.id">{{ item.name }}</i-option>
              </i-select>
          </i-col>
        </div>
        <!-- <FormItem label="设备状态：" prop="" >
        <Row>
          <i-col span="12" style="width:100px">
              <i-select filterable clearable>
                  <i-option v-for="(item,index) in cityList" :value="item.value" :key="index">{{ item.label }}</i-option>
              </i-select>
          </i-col>
          </Row>
        </FormItem> -->
        <div class="content_select_input">
          <p>{{$t('time_period')}}：</p>
          <i-col>
            <Date-picker :value="reportList.time" type="daterange" :placeholder="$t('select_date')" style="width: 200px" @on-change="reportDateChange" @on-clear="reportDateClear"></Date-picker>
          </i-col>
        </div>
        <div class="content_select_input">
          <p>{{$t('devices')+'ID：'}}</p>
          <Input type="text" v-model="reportList.devEui" style="width:200px"/>
        </div>
        <div class="content_select_input">
          <p>{{$t('address')+'：'}}</p>
          <Input type="text" v-model="reportList.devAddr" style="width:200px"/>
        </div>
        <div class="select_button" @click="reportInit">{{$t('query')}}</div>
      </Row>
      <Table ref="table" :loading="reportList.loading" :height="tableHeight" :columns="reportList.columns" :data="reportList.data"></Table>
      <div class="list_bottom">
        <Page :total="reportList.total" show-elevator show-total @on-change="nextPage"></Page>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import 'v-charts/lib/style.css'
import VeHistogram from 'v-charts/lib/histogram.common'
import { export_array_to_excel } from '@/libs/excel'

export default {
  components: {
    VeHistogram
  },
  data () {
    this.chartExtend = {
      series: {
        label: { show: true, position: "top" },
        barWidth: 50
      },
      toolbox: {
        show: true,
        right: 60,
        feature: { saveAsImage: { show: true } }
      }
    }
    this.colors = ['#0bbcff']
    return {
      testDate:[],
      tableHeight:660,
      chartsLoading: true,
      reportSearch: {
        dateBegin: moment().subtract(7, 'days').valueOf(),
        dateEnd: moment(new Date()).valueOf()
      },
      time: [moment().subtract(7, 'days').format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')],
      device: {
        chart: {
          columns: [this.$t('date'), this.$t('alarm_number')],
          rows: []
        },
        dataEmpty: false
      },
      event: {
        chart: {
          columns: [this.$t('date'), this.$t('alarm_devices_number')],
          rows: []
        },
        dataEmpty: false
      },
      exportData: [],
      reportList:{
        columns: [
          {
            title: this.$t('device_type'),
            key: 'typeName',
            minWidth:70,
          },
          {
            title: this.$t('device_status'),
            key: 'status',
            minWidth:150,
            render: (h, params) => {
              let arr = []
              let arr1 =  [
                h('img', {
                    style: {
                      marginRight: '10px'
                    },
                    attrs: {
                      src: require('../../../assets/images/circle.svg')
                    }
                }),
                h('span', {
                    style: {
                        marginRight: '40px',
                        color:'#01C1AE'
                    },
                },this.$t('online'))
              ]
              let arr2 = [
                h('img', {
                    style: {
                      marginRight: '10px'
                    },
                    attrs: {
                      src: require('../../../assets/images/circleoffline.svg')
                    }
                }),
                h('span', {
                    style: {
                        marginRight: '40px',
                        color:'#c5c8ce'
                    },
                },this.$t('offline'))
              ]
              let arr3 = [
                h('img', {
                    style: {
                      marginRight: '10px'
                    },
                    attrs: {
                      src: require('../../../assets/images/circlealarm.svg')
                    }
                }),
                h('span', {
                    style: {
                        marginRight: '40px',
                        color:'#ed4014'
                    },
                },this.$t('alarm'))
              ]
              if(params.row.state == 0) {
                return h('div', arr2);
              }
              if(params.row.state == 1 ){
                return h('div', arr1);
              }
            }
          },
          {
            title: this.$t('device_addr'),
            key: 'address',
            minWidth:70,
          },
          {
            title: this.$t('devices')+'ID',
            key: 'devEui',
            width:150,
          },
          {
            title: this.$t('time'),
            key: 'time',
            minWidth:70,
            render: (h, params) => {
              return h('span', moment(params.row.ts).format("YYYY-MM-DD HH:mm:ss"))
            }
          },
        ],
        data: [],
        devType: '',
        devEui: '',
        dateBegin: moment().startOf('day').valueOf(),
        dateEnd: moment(new Date()).add(1,'days').startOf('day').valueOf()-1000,
        devAddr: '',
        pageSize: 10,
        pageNo: 1,
        total: 0,
        loading: true ,
        time: [moment().startOf('day').format('YYYY-MM-DD'),moment(new Date()).add(1,'days').startOf('day').format('YYYY-MM-DD')]
      }
    }
  },
  computed: {
    ...mapGetters([
      'nodeType'
    ])
  },
  methods: {
    ...mapActions([
      'overView',
      'getReportMessage',
    ]),
    init() {
      this.overView(this.reportSearch).then(res => {
        const data = res.data.rs.data
        let device = []
        let event = []
        for (const i in data.device) {
          device.push({ [this.$t('date')] : i, [this.$t('alarm_devices_number')] : data.device[i] })
        }
        for (const i in data.event) {
          event.push({ [this.$t('date')] : i, [this.$t('alarm_number')] : data.event[i] })
        }
        this.device.chart.rows = event
        this.event.chart.rows = device

        if(this.device.chart.rows.length === 0) this.device.dataEmpty = true
        if(this.event.chart.rows.length === 0) this.event.dataEmpty = true
        this.chartsLoading = false
        //合并处理导出的数据
        const all = [...device, ...event]
        this.exportData = Array.from(all.reduce((m, x) => m.set(x[this.$t('date')], Object.assign(m.get(x[this.$t('date')]) || {}, x)), new Map()).values())
      })
    },
    reportInit () {
      const info = {
        devType: this.reportList.devType,
        devEui: this.reportList.devEui,
        dateBegin: this.reportList.dateBegin,
        dateEnd: this.reportList.dateEnd,
        devAddr: this.reportList.devAddr,
        pageSize: this.reportList.pageSize,
        pageNo: this.reportList.pageNo
      }
      this.getReportMessage(info).then(res => {
        this.reportList.loading = false
        this.reportList.data = res.data.rs.data.list
        this.reportList.total = res.data.rs.data.total
        this.testDate = JSON.parse(JSON.stringify(res.data.rs.data.list))
        this.testDate.map(e=>{
          e.state = e.state == 1 ? this.$t('normal') : this.$t('offline'),
          e.ts = moment(e.ts).format("YYYY-MM-DD HH:mm:ss")
        })
      })
    },
    nextPage (page) {
      this.reportList.pageNo = page
      this.reportInit()
    },
    exportAlarm() {
      const params = {
        title: [this.$t('date'), this.$t('alarm_number'), this.$t('alarm_devices_number')],
        key: [this.$t('date'), this.$t('alarm_number'), this.$t('alarm_devices_number')],
        data: this.exportData,
        autoWidth: true,
        filename: this.$t('warning_trend')
      }
      export_array_to_excel(params)
    },
    exportMessage () {
      let data = {
        title:[this.$t('device_type'), this.$t('status'), this.$t('address'), this.$t('time')],
        key:['typeName', 'state', 'address' ,'ts'],
        data: this.testDate,
        autoWidth: true,
        filename: this.$t('new_message')
      }
      export_array_to_excel(data)
    },
    dateChange(event) {
      this.reportSearch.dateBegin = moment(event[0]).valueOf()
      this.reportSearch.dateEnd = moment(event[1]).valueOf()
    },
    reportDateChange(event) {
      this.reportList.dateBegin = moment(event[0]).valueOf()
      this.reportList.dateEnd = moment(event[1]).valueOf()
    },
    dateClear() {
      this.reportSearch.dateBegin = this.reportSearch.dateEnd = ''
    },
    reportDateClear () {
      this.reportList.dateBegin = moment().startOf('day').valueOf()
      this.reportList.dateEnd =  moment(new Date()).add(1,'days').startOf('day').valueOf()-1000
      this.reportList.time = [moment().startOf('day').format('YYYY-MM-DD'),moment(new Date()).add(1,'days').startOf('day').format('YYYY-MM-DD')]
    },
    drawLine () {
      
    }
  },
  mounted () {
  },
  created() {
    this.$store.dispatch('getNodeType')
    this.init()
    this.reportInit()
  }
}
</script>
