<style lang="less" scoped src="./list.less"></style>
<template>
  <div id="List">
    <Row :gutter="20">
      <Col class="floor_1" :md="24" :lg="18">
        <Row :gutter="20">
          <Col :md="24" :lg="8" class="mag-bottom20">
            <!-- 关键信息 -->
            <div class="key_info boxShadow">
              <div class="title">{{$t('key_information')}}</div>
              <div id="totalEquipment" :style="{width: '100%', height: '200px'}"></div>
              <div class="content_title">{{$t('device_amount')}}</div>
              <div class="content_list" @click="changeRouter('/monitor/index/alarmManagement')">
                <div class="name">{{$t('warning')}}</div>
                <div class="Proportion_out">
                  <div class="Proportion Proportion_warning" :style="{'width': counts.alertMix+'%'}"></div>
                  <div class="Proportion_left">{{$t('number')}} {{counts.alert}}</div>
                  <div class="Proportion_right">{{$t('pencentage')}} {{counts.alertMix}}%</div>
                </div>
              </div>
              <div class="content_list" @click="changeRouter('/monitor/index/onlineEquipment')">
                <div class="name">{{$t('normal')}}</div>
                <div class="Proportion_out">
                  <div class="Proportion Proportion_normal" :style="{'width': counts.normalMix+'%'}"></div>
                  <div class="Proportion_left">{{$t('number')}} {{counts.normal}}</div>
                  <div class="Proportion_right">{{$t('pencentage')}} {{counts.normalMix}}%</div>
                </div>
              </div>
              <div class="content_list" @click="changeRouter('/monitor/index/offlineEquipment')">
                <div class="name">{{$t('offline')}}</div>
                <div class="Proportion_out">
                  <div class="Proportion Proportion_offline" :style="{'width': counts.offlineMix+'%'}"></div>
                  <div class="Proportion_left">{{$t('number')}} {{counts.offline}}</div>
                  <div class="Proportion_right">{{$t('pencentage')}} {{counts.offlineMix}}%</div>
                </div>
              </div>
            </div>
          </Col>
          <Col :md="24" :lg="16" class="mag-bottom20">
            <!-- 日积累事件数 -->
            <div class="accumulation">
              <div class="accumulation_top boxShadow">
                <div class="title" style="color:rgba(255,255,255,1);">{{$t('daily_warning_events')}}</div>
                <ve-line :data="device.chart" :loading="chartLoading" height="220px" :extend="chartExtend" :legend-visible="false" :data-empty="device.dataEmpty" ></ve-line>
              </div>
              <div class="accumulation_bottom boxShadow">
                <div class="title">{{$t('daily_warning_devices')}}</div>
                <ve-line :data="event.chart" :loading="chartLoading" height="220px" :extend="chartExtend1" :legend-visible="false" :data-empty="event.dataEmpty" ></ve-line>
              </div>
            </div>
          </Col>
          <Col :md="24" :lg="24" class="mag-bottom20">
            <div class="Classification boxShadow">
              <div class="title">{{$t('device_category')}}</div>
              <div class="card_wrapper">
                <div ref="mycontent" class="card_scroll" :style="{'left':left+'px'}">
                  <div class="card" v-for="(item, i) in typeList" :key="i">
                    <div class="logo">
                      <img style="width:50px" :src="require('../../../assets/images/nodeIcon/' + item.icon)">
                    </div>
                    <div class="number">{{item.counts}}</div>
                    <div class="type">{{item.name ? item.name : $t('unkonwn')}}</div>
                  </div>
                </div>
              </div>
              <button type="button" class="left ivu-carousel-arrow ivu-carousel-arrow-always" @click="clickLeft" :style=" canHandleLeft? {} :{'cursor': 'not-allowed'}"> 
                <Icon type="ios-arrow-back" />
              </button>
              <button type="button" class="right ivu-carousel-arrow ivu-carousel-arrow-always" @click="clickRight" :style=" canHandleRight? {} :{'cursor': 'not-allowed'}"> 
                <Icon type="ios-arrow-forward" />
              </button>
            </div>
          </Col>
        </Row>
      </Col>
      <!-- 下面部分 -->
      <Col class="floor_2" :md="24" :lg="6">
        <Col :span="24" class="mag-bottom20">
          <!-- 最新预警 -->
          <div class="latestWarning boxShadow">
            <div class="title">{{$t('recent_warning')}}</div>
            <div style="height:400px">
              <div class="latestWarning_list" v-for="(item, index) in alarm.showList" :key="index" @click="openMessage(item)">
              <div class="latestWarning_left">
                <div class="latestWarning_title">{{item.name}}</div>
                <div class="latestWarning_content">{{item.address}}</div>
                <div class="latestWarning_time">{{item.time}}</div>
              </div>
              <div class="latestWarning_right" v-if="item.eventInfo.done === 0">
                <img src="../../../assets/images/monitor/status_no.png">
                <div class="latestWarning_status_no">{{$t('to_do')}}</div>
              </div>
              <div class="latestWarning_right" v-else>
                <img src="../../../assets/images/monitor/status_yes.png">
                <div class="latestWarning_status_yes">{{$t('handled')}}</div>
              </div>
              </div>
            </div>
            <div class="paging">
              <div>{{$t('total')}} {{alarm.total}} {{$t('items')}}</div>
              <Page ref="pages" :page-size="4" :total="alarm.total" simple @on-change="changePage"></Page>
            </div>
          </div>
        </Col>
        <Col :span="24" class="mag-bottom20">
          <div class="lowPower boxShadow">
            <div class="title">{{$t('low_power_devices')}}</div>
            <ve-histogram :data="vol.chart"  :extend="volExtend" height="280px" :loading="vol.loading" :data-empty="vol.dataEmpty"></ve-histogram>
          </div>
        </Col>
      </Col>
    </Row>
    <AlarmDetail :showModel="showModel" :modelList="modelList" @change-model="changeModel" @handle-alarm="handleAlarm"></AlarmDetail>
  </div>
</template>
<script>
import 'v-charts/lib/style.css'
import VeLine from 'v-charts/lib/line.common'
import VeHistogram from 'v-charts/lib/histogram.common'
import { mapGetters, mapActions } from 'vuex'
import AlarmDetail from '_c/alarmDetail/alarmDetail'

export default {
  components: {
    VeLine,
    VeHistogram,
    AlarmDetail,
  },
  data () {
    this.chartExtend = {
      grid:{   // 设置图表在画布中的位置
        bottom: 10,
        top:10,
        right: 30,
        x: 20,
        y2:0,
      },
      xAxis:{
        axisLabel:{
          textStyle:{
            color:'#fff',
            fontSize: 10,
          }
        },
        axisTick: {
          show: false
        },
      },
      yAxis:{
        axisLabel:{
          textStyle:{
            fontSize: 10,
            color:'#fff'
          }
        },
        splitLine: {
          show:true,
          lineStyle: {
            color: 'rgba(255,255,255,0.3)'
          }
        }
      },
      series:{
        type: 'line',
        symbolSize: 12,
        symbol: 'circle',
        itemStyle:{
          borderWidth:3,
          borderColor: '#333',
        }
      }
    },
    this.chartExtend1 = {
      grid:{   // 设置图表在画布中的位置
        bottom: 10,
        top:10,
        right: 30,
        x: 20,
        y2:0,
      },
      xAxis:{
        axisLabel:{
          textStyle:{
            color: '#1A1A1A',
            fontSize: 10,
          }
        },
        axisTick: {
          show: false
        },
      },
      yAxis:{
        axisLabel:{
          textStyle:{
            fontSize: 10,
            color: '#1A1A1A'
          }
        },
        splitLine: {
          show:true,
          lineStyle: {
           color: 'rgba(0,0,0,0.2)'
          }
        }
      },
      series:{
        type: 'line',
        symbolSize: 12,
        symbol: 'circle',
        itemStyle:{
          color: '#0BBCFF',
          borderWidth:3,
          borderColor: '#fff',
        },
        lineStyle: {
          color: '#0BBCFF'
        }
      }
    }
    return {
      canHandleRight: true,
      canHandleLeft: true,
      modelList: "",
      showModel: false,
      resetNumber: '',
      rxinfo_timeout: {},
      cnt: 0,
      left: 0,
      chartLoading: true,
      device: {
        chart: {
          columns: [this.$t('date'), this.$t('alarm_number')],
          rows: []
        },
        dataEmpty: false
      },
      event: {
        chart: {
          columns: [this.$t('date'), this.$t('device_amount')],
          rows: []
        },
        dataEmpty: false
      },
      vol: {
        chart: {
          columns: [this.$t('type'), this.$t('device_count')],
          rows: []
        },
        dataEmpty: false,
        loading: true
      },
      counts: {
        total: 0,
        alert: 0,
        normal: 0,
        offline: 0,
        alertMix: 0,
        normalMix: 0,
        offlineMix: 0
      },
      alarm: {
        list: [],
        showList: [],
        total: 0,
        size: 4,
        limit: 12
      },
      typeList: [],
      volExtend : {
        legend: {
          show:false
        },
        grid:{   // 设置图表在画布中的位置
          bottom: 10,
          top:20,
          x: 20,
          y2:0,
        },
        series: {
          itemStyle:{
            color: function (params) {
              var colorList = [
                  ['#FF3A70', '#9C3CB6'],
                  ['#0BCDFF', '#00CA72'],
                  ['#B4B4B4', '#656565']
                ]
                var index = params.dataIndex
                if (params.dataIndex >= colorList.length) {
                  index = params.dataIndex - colorList.length
                }
              return new echarts.graphic.LinearGradient(0, 0, 0, 1,
                [
                  {offset: 0, color: colorList[index][0]},
                  {offset: 1, color: colorList[index][1]}
                ])
            }
          }
        },
        barWidth:20
      }
    }
  },
  computed: {
    ...mapGetters([
      'mapNodeType'
    ]),
  },
  methods: {
    ...mapActions([
      'getNodesStatistics',
      'getAlarmStatistics',
      'getAlarmEvents',
      'lowVoltage'
    ]),
    timeoutHander() {
      this.cnt++;
      if(this.cnt === 3){
        this.cnt = 0;
        
        this.rxinfo_timeout = setTimeout(() => {
          this.getNodesStatis()
          this.getAlarmStatis()
          // this.getAlarms()
        }, 5000);
      }
    },
    //关键信息
    getNodesStatis() {
      let totalEquipment = echarts.init(document.getElementById('totalEquipment'))
      this.getNodesStatistics().then(res => {
        const data = res.data.rs.data
        this.counts = data
        this.counts.alertMix = (data.alert / data.total * 100).toFixed(2)
        this.counts.normalMix = (data.normal / data.total * 100).toFixed(2)
        this.counts.offlineMix = (data.offline / data.total * 100).toFixed(2)
        this.drawLine()

        this.lowVoltage({
          dateBegin: moment().startOf('day').valueOf(),
          dateEnd: moment().endOf('day').valueOf(),
        }).then(r => {
          const vol = r.data.rs.lowVoltageCount
          //设备低电量分布
          this.vol.chart.rows = [
            { [this.$t('type')]: this.$t('vol_low'), [this.$t('device_count')]:  vol},
            { [this.$t('type')]: this.$t('normal'), [this.$t('device_count')]:  data.normal},
            { [this.$t('type')]: this.$t('offline'), [this.$t('device_count')]:  data.offline}
          ]
          this.vol.loading = false
          if(this.$route.name === 'monitor_list') this.timeoutHander();
        })
      })
      window.onresize = () => {
        totalEquipment.resize()
      }
    },
    //处理告警
    openMessage (row) {
      if (row.eventInfo.done === 0) {
        this.showModel = true
        let v = row
        this.modelList = {
          sequence:[v.eventInfo.sequence],
          ts: v.eventInfo.ts,
          address: v.address,
          name: v.devEui,
          typeName: v.typeName,
          devEui: v.devEui,
          counts: v.counts,
          ruleName: v.eventInfo.rule.name,
          ruleId: v.eventInfo.rule.id
        }
      }
    },
    changeModel (state,refresh) {
      this.showModel = state
      if(refresh) {
        this.getAlarmStatis()
      }
    },
    //告警图表数据
    getAlarmStatis() {
      const params = {
        dateBegin: moment().subtract(7, 'days').valueOf(),
        dateEnd: moment(new Date()).valueOf()
      }
      this.getAlarmStatistics(params).then(res => {
        const data = res.data.rs.data
        let device = []
        let event = []
        for (const i in data.device) {
          device.push({ [this.$t('date')]: i, [this.$t('device_amount')]: data.device[i] })
        }
        for (const i in data.event) {
          event.push({ [this.$t('date')]: i, [this.$t('alarm_number')]: data.event[i] })
        }
        this.device.chart.rows = event
        this.event.chart.rows = device

        if(this.device.chart.rows.length === 0) this.device.dataEmpty = true
        if(this.event.chart.rows.length === 0) this.event.dataEmpty = true
        this.chartLoading = false
        if(this.$route.name === 'monitor_list') this.timeoutHander();
      })
    },
    //最新预警事件
    getAlarms() {
      this.getAlarmEvents({limit: this.alarm.limit}).then(res => {
        this.alarm.list = res.data.rs.data.map(v => {
          v.time = moment(v.ts).format("YYYY-MM-DD hh:mm:ss")
          return v
        })
        this.$nextTick(()=>{
          this.$refs['pages'].currentPage = 1
        })
        this.alarm.total = this.alarm.list.length
        this.alarm.showList = this.alarm.list.slice(0, this.alarm.size)
        if(this.$route.name === 'monitor_list') this.timeoutHander()
      })
    },
    changePage(page) {
      let pages = (page - 1) * this.alarm.size
      if(pages === 1) pages = 0
      this.alarm.showList = this.alarm.list.slice(pages, this.alarm.size*page)
    },
    //分类设备信息
    getType() {
      this.typeList = this.mapNodeType.reduce((groups, item) => {
        let groupFound = groups.find(arrItem => item.typeName === arrItem.name)
        if (groupFound) {
          groupFound.counts++
        } else {
          let newGroup = {
            name: item.typeName,
            id: item.typeId,
            fport: item.fport ? item.fport : 999999,
            counts: 1,
            icon: item.iconAddr ? item.iconAddr.substring(0,item.iconAddr.length-4) +'.svg' : 'unknown.png'
          }
          groups.push(newGroup)
        }
        return groups
      }, []).sort((a, b) => {return (a.fport - b.fport)})
    },
    clickRight () {
      if ( this.$refs.mycontent.offsetWidth + this.left*-1 < this.typeList.length * 200 - 30) {
        this.left -= 200
        if ( this.$refs.mycontent.offsetWidth + this.left*-1 < this.typeList.length * 200 - 30) {
          this.canHandleRight = true
        } else {
          this.canHandleRight = false
        }
        if (this.left !== 0) {
          this.canHandleLeft = true
        } else {
          this.canHandleLeft = false
        }
      }
    },
    clickLeft () {
      if (this.left !== 0) {
        this.left += 200
        if ( this.$refs.mycontent.offsetWidth + this.left*-1 < this.typeList.length * 200 - 30) {
          this.canHandleRight = true
        } else {
          this.canHandleRight = false
        }
        if (this.left !== 0) {
          this.canHandleLeft = true
        } else {
          this.canHandleLeft = false
        }
      }
    },
    changeRouter (url) {
      this.$router.push(url)
    },
    drawLine () {
      let totalEquipment = echarts.init(document.getElementById('totalEquipment'))
      // 绘制设备总数
      totalEquipment.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['78%', '90%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            hoverOffset: false,
            silent: true,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(11,205,255,1)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(0,202,114,1)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            label: {
              normal: {
                show: true,
                position: 'center',
                textStyle: {
                  fontSize: this.counts.total > 10000 ? '40' : (this.counts.total > 1000 ? '50' : '60'),
                  fontWeight: '400',
                  fontFamily: 'Microsoft YaHei',
                  color: 'linear-gradient(180deg,rgba(11,205,255,1) 0%,rgba(0,202,114,1) 100%);'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {value: 335, name: this.counts.total}
            ]
          }
        ]
      })
    }
  },
  beforeDestroy () {
    clearTimeout(this.rxinfo_timeout);
  },
  mounted () {
    this.getNodesStatis()
    this.getAlarmStatis()
    this.getAlarms()
    this.$store.dispatch('getNodes').then(() => {
      this.getType()
      this.$nextTick(() => {
        if ( this.$refs.mycontent.offsetWidth + this.left*-1 < this.typeList.length * 200 - 30) {
          this.canHandleRight = true
        } else {
          this.canHandleRight = false
        }
        if (this.left !== 0) {
          this.canHandleLeft = true
        } else {
          this.canHandleLeft = false
        }
      })
    })
    
  },
}
</script>
