<style lang="less" scoped src="./card.less"></style>
<template>
  <div id="card">
    <div class="select_card">
      <input type="text" class="checkName_input" v-model="searchDevEui" :placeholder="$t('device_code')+'/'+$t('device_name')+'/'+$t('mobile')" autofocus>
      <div class="checkName_button" @click="searchs">{{$t('query')}}</div>
    </div>
    <Row class="content1" :gutter="20">
      <Col  v-for="(item, index) in list" :key="index">
        <div :class="item.state === 0 ? ['detail','boxShadow','offline'] : (item.state === 1 ? ['detail','boxShadow'] :  ( item.nodeAlertMsg.rule.level == '1' ? ['detail','boxShadow','level1'] : ( item.nodeAlertMsg.rule.level == '2' ? ['detail','boxShadow','level2'] : ( item.nodeAlertMsg.rule.level == '3' ? ['detail','boxShadow','level3'] : ( item.nodeAlertMsg.rule.level == '4' ? ['detail','boxShadow','level4'] : ( item.nodeAlertMsg.rule.level == '5' ? ['detail','boxShadow','level5'] : ['detail','boxShadow'] )) ) )) )" @click="viewDetail(item)">
          <div class="detail_left">
            <img style="width:50px;margin:0 auto" v-if="item.state === 1" :src="require('../../../assets/images/nodeIcon/'+ item.iconAddr )">
            <img style="width:50px;margin:0 auto" v-else :src="require('../../../assets/images/nodeIcon/'+ (item.iconAddr?item.iconAddr.substring(0,item.iconAddr.length-4) + '.svg':'unknown.png') )">
            <span style="font-size:10px;margin-top:10px;">{{item.typeName}}</span>
          </div>
          <div class="detail_right">
            <p>{{item.devEui}}</p>
            <p style="font-weight:bold;margin-top:5px;">{{item.name}}（{{item.typeName}}）</p>
            <span v-if=" item.fport == '4'" class="cardContent">
              <span v-cloak>{{item.temperature}} ℃</span>
              <span v-cloak style="margin-right:20px">{{item.humidity}} %</span>
            </span>
            <span v-else-if=" item.fport == '4402'" class="cardContent">
              <span>AD:{{item.ad}}</span>
            </span>
            <span v-else class="cardContent">
              <span>{{item.stateName}}</span>
            </span>
            <p>{{item.time}}</p>
          </div>
        </div>
      </Col>
      <Button @click="nextPage" :loading="loading" style="margin-top:10px;height:50px;" long v-if="more"> <b>{{$t('click_for_more')}}</b> </Button>
    </Row>
    <AlarmDetail :showModel="showModel" :modelList="modelList" @change-model="changeModel"></AlarmDetail>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import AlarmDetail from '_c/alarmDetail/alarmDetail'

export default {
  components: {
    AlarmDetail
  },
  data () {
    return {
      loading: false,
      more: true,
      showModel: false,
      devEui: [],
      modelList: {},
      pageSize: 24,
      searchDevEui: '',
      //总数据
      list: [],
      search: {
        pageSize: 0,
        include: [],
        exclusion: []
      },
      //默认数据
      normalList: [],
      //告警数据
      alarmList: [],
      markers: [],
      alarmTimeOut: {}
    }
  },
  methods: {
    ...mapActions([
      'getAlarmNodesInfo',
      'getNodesRx',
      'searchByCondition',
      'getNodesLatestData'
    ]),
    changeModel (state,refresh) {
      this.showModel = state
      if(refresh) {
        clearTimeout(this.alarmTimeOut)
        this.getList()
      }
    },
    //获取告警信息
    getList() {
      this.getAlarmNodesInfo({include: this.search.include}).then(res => {
        const data = res.data.rs.data
        //告警列表数据处理，根据节点id和告警等级合并告警信息
        this.alarmList = data.reduce((groups, item) => {
          let groupFound = groups.find(arrItem => item.id === arrItem.id && item.nodeAlertMsg.rule.id === arrItem.nodeAlertMsg.rule.id)
          if (groupFound) {
            groupFound.counts++
            groupFound.sequence.push(item.nodeAlertMsg.sequence)
          } else {
            let newGroup = {
              ...item,
              level: item.nodeAlertMsg.rule.level,
              sequence: [item.nodeAlertMsg.sequence],
              time: moment(item.nodeAlertMsg.ts).format('YYYY-MM-DD HH:mm:ss'),
              counts: 1,
              state: 2,
              stateName: this.$t('alarm')
            }
            groups.push(newGroup)
          }
          return groups
        }, []).sort((a, b) => {return (b.level - a.level)})

        // this.alarmList.forEach(v => {
        //   v.sequence = Math.max(...v.sequence)
        // })
        const alarmCount = this.alarmList.length
        if(this.pageSize%alarmCount === 0 && this.pageSize === alarmCount){ 
          this.pageSize = alarmCount
          //如果取余等于0,则说明告警数据满页，不需要再请求正常数据
          let lists = this.alarmList.concat(this.normalList)
          this.devEui = lists.filter(v => v.fport == '4' || v.fport == '4402').map(v => v.devEui).join(',')
          if(this.devEui.length > 0) {
            this.getNodesLatestData({devEUIs:this.devEui}).then(res => {
              let data = res.data.rs.data
              this.list = lists.map(v => {
                let result = data.find(k => k.payload.dev_eui === v.devEui)
                if(result){
                  this.$set(v, 'humidity', result.payload.payload.humidity)
                  this.$set(v, 'temperature', result.payload.payload.temperature)
                  this.$set(v, 'ad', result.payload.payload.ad)
                }
                return v
              })
            })
          }else {
            this.list = lists
          }
        }else{
          this.search.pageSize = this.pageSize - alarmCount
          this.search.exclusion = this.alarmList.map(v => v.devEui).join(',')
          //获取正常数据
          this.getNodesRx(this.search).then(result => {
            let list = result.data.rs.data.list
            const total = result.data.rs.data.total
            this.loading = false
            
            if((list && list.length === total) || total === 0) this.more = false
            this.normalList = list ? list.map(v => {
              v.time = moment(v.ts).format('YYYY-MM-DD HH:mm:ss')
              v.stateName = v.state === 1 ? this.$t('normal') : this.$t('offline')
              return v
            }) : []
            
            //合并告警数据和正常数据
            let lists = this.alarmList.concat(this.normalList)
            this.devEui = lists.filter(v => v.fport == '4' || v.fport == '4402').map(v => v.devEui).join(',')
            if(this.devEui.length > 0) {
              this.getNodesLatestData({devEUIs:this.devEui}).then(res => {
                let data = res.data.rs.data
                this.list = lists.map(v => {
                  let result = data.find(k => k.payload.dev_eui === v.devEui)
                  if(result){
                    this.$set(v, 'humidity', result.payload.payload.humidity)
                    this.$set(v, 'temperature', result.payload.payload.temperature)
                    this.$set(v, 'ad', result.payload.payload.ad)
                  }
                  return v
                })
              })
            } else {
              this.list = lists
            }
          })
        }
        
        //暂用，定时查询告警，后期改长链接
        if (this.$route.name === "monitor_card") this.timeTask()
      }).catch(err => {
        if (this.$route.name === "monitor_card") this.timeTask()
      })
    },
    //定时任务
    timeTask() {
      this.alarmTimeOut = setTimeout(() => {
        this.getList()
      }, 5 * 1000)
    },
    //加载更多
    nextPage() {
      clearTimeout(this.alarmTimeOut)
      this.search.pageSize = this.pageSize = this.pageSize + 24
      this.loading = true
      this.getList()
    },
    searchs() {
      clearTimeout(this.alarmTimeOut)
      this.more = true
      this.searchByCondition({condition: this.searchDevEui}).then(res => {
        this.search.include = res.data.rs.data.join(',')
        this.search.pageSize = this.pageSize = 24
        this.getList()
      })
    },
    viewDetail(row) {
      if(row.state !== 2){ //正常数据
        this.$router.push({
          name: 'monitor_onlineDetail', 
          params: { nodeId: row.id }
        })
      }else{
        //告警处理
        this.showModel = true
        let v = row
        this.modelList = {
          sequence:v.sequence,
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
  },
  beforeDestroy() {
    clearTimeout(this.alarmTimeOut)
  },
  created() {
    this.getList()
    
  }
}
</script>
