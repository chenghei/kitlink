<style lang="less" scoped src="./map.less"></style>
<style>
  @import "~leaflet.markercluster/dist/MarkerCluster.css";
  @import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
</style>
<template>
  <div id="lampMap" class="content-body">
    <div class="mapheader boxShadow">
      <div class="mapSelect">
        <span v-show="markers.length > 0" :class="mapActive === 'alarm' ? 'selected':''" @click="mapSelect('alarm')">告警设备</span>
        <span :class="mapActive === 'normal' ? 'selected':''" @click="mapSelect('normal')">单灯控制</span>
      </div>
      <div class="scrolllWrap">
        <div ref="mycontent" class="scrollContent" :style="{'left':left+'px'}">
          <div style="min-width:50px" v-for="(item,i) in showType" :key="i" :class="activeClass == i ? 'mapCard big':'mapCard'" >
            <div @click="show_list(item,i)" style="text-align:center">
              <img :src="require('@/assets/images/nodeIcon/' + item.icon)">
              <span style="white-space: nowrap;">{{item.name ? item.name : $t('unkonwn')}}</span>
            </div>
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
    <!-- 地图 -->
    
    <div id="allmap1lamp" class="boxShadow">
      <!-- leaflet map -->
      <l-map ref="leaflet_map" v-if="language === 'en-US'" :options="lmapOptions" :bounds="bounds" style="width:100%;height:100%;" :zoom="map.zoom" :center="map.center" :minZoom="4">
        <l-tile-layer :url="lmapOptions.url"></l-tile-layer>
        <v-marker-cluster :options="{disableClusteringAtZoom: 11}">
          <l-marker v-for="item in map.markers" :icon="item.lm_icon" :lat-lng="item" :key="item.index" :zIndexOffset="item.zIndexOffset" @click="lfmap_marker_click(item)">
            <l-popup>
              <div style="font-size: 12px;line-height:20px;width: 300px !important;">
                <NodeCard :icon="map.infoWindow.icon_addr" :voltage="map.infoWindow.voltage" :name="map.infoWindow.type_name" :data1="map.infoWindow.name1" :unit1="map.infoWindow.unit1" :data2="map.infoWindow.name2" :unit2="map.infoWindow.unit2" :time="map.infoWindow.time" :dev_eui="map.infoWindow.show_name" :id="map.infoWindow.dev_eui" :color="map.infoWindow.color" :spinShow="map.infoWindow.spinShow"></NodeCard>
              </div>
            </l-popup>
          </l-marker>
        </v-marker-cluster>
      </l-map>

      <b-map-component 
      v-if="language === 'zh-CN'"
      :center="map.center"
      :init="map.init"
      :zoom="map.zoom"
      :markers="map.markers"
      :show-type="map.show_type"
      :is-clusterer="false"
      :type="map.type"
      :auto-zoom="map.autoZoom"
      @marker-click="marker_click"
      @info-close="info_close"
      style="width:100%;height:100%;"
    >
      <div slot="infoWindow" style="font-size: 12px;line-height:20px;width: 300px !important;">
        <NodeCard :icon="map.infoWindow.icon_addr" :voltage="map.infoWindow.voltage" :name="map.infoWindow.type_name" :data1="map.infoWindow.name1" :unit1="map.infoWindow.unit1" :data2="map.infoWindow.name2" :unit2="map.infoWindow.unit2" :time="map.infoWindow.time" :status="map.infoWindow.status" :dev_eui="map.infoWindow.show_name" :id="map.infoWindow.dev_eui" :color="map.infoWindow.color" :spinShow="map.infoWindow.spinShow"></NodeCard>
      </div>
    </b-map-component>
    </div>
    <transition name="slide-fade">
      <div class="list" v-if="show">
        <div class="list_top" style="position: relative;">
          <img src="@/assets/images/node/close.svg" alt="close" @click="close_left">
        </div>
        <div class="detail_title">
          {{title}}
        </div>
        <div class="list_search">
          <i-input search v-model="searchName" @on-search="search" :placeholder="$t('enter_name_prompt')"></i-input>
        </div>
        <Table ref="table" :show-header="false" :height="tableHeight" :columns="columns1" :data="showInfo" @on-row-click="show_detail" :highlight-row="true"></Table>
        <div class="paging">
          <div style="max-width:60px;white-space:nowrap;margin-left:-10px">{{$t('total')}} {{data1.length}} {{$t('items')}}</div>
          <Page :current="page.index" :total="data1.length" simple @on-change="nextPage"></Page>
        </div>
      </div>
    </transition>
    <transition name="detail-slide-fade">
      <div class="list_detail" v-if="showDetail">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="top">
        <div class="list_top" >
          <img src="@/assets/images/node/close.svg" alt="close" @click="close_right">
        </div>
        <div class="detail_title">
          {{$t('device_info')}}
        </div>
        <div class="block_out">
          <FormItem :label="$t('name')+'：'"  prop="name" style="margin-top:20px;font-weight:bold">
              <Input type="text" v-model="formValidate.name" style="width:210px;"/>
          </FormItem>
          <FormItem :label="$t('device_code')+'：'"  prop="name" style="margin-top:20px;font-weight:bold">
              <Input type="text" disabled v-model="formValidate.devEui" style="width:210px;"/>
          </FormItem>
          <FormItem :label="$t('type')+'：'"  prop="name" style="margin-top:20px;font-weight:bold">
              <Input type="text" disabled v-model="formValidate.typeName" style="width:210px;"/>
          </FormItem>
          <FormItem :label="$t('address')+'：'"  prop="name" style="margin-top:20px;font-weight:bold">
              <Input type="textarea" v-model="formValidate.address"  style="width:210px"/>
          </FormItem>
          <FormItem :label="$t('operator')+'：'"  prop="name" style="margin-top:20px;font-weight:bold">
              <Input type="text" v-model="formValidate.operator" style="width:210px;"/>
          </FormItem>
          <FormItem :label="$t('mobile')+'：'"  prop="name" style="margin-top:20px;font-weight:bold">
              <Input type="text" v-model="formValidate.operatorMobile" style="width:210px;"/>
          </FormItem>
        </div>
        <div class="add_bottom" style="width:260px">
          <div class="add_button" @click="handleSubmit('formValidate')">{{$t('save')}}</div>
        </div>
        </Form>
        <Spin size="large" fix v-if="spinShow"></Spin>
      </div>
    </transition>
    <AlarmDetail :showModel="showModel" :modelList="modelList" @change-model="changeModel" @handle-alarm="handleAlarm"></AlarmDetail>
  </div>
</template>
<script>
import styleJson from '@/assets/js/styleJson'
import BMapComponent from '_c/BMap/BMapComponent'
import NodeCard from '_c/BMap/NodeCard'
import AlarmDetail from '_c/alarmDetail/alarmDetail'
import { mapGetters, mapActions } from 'vuex'
import { latLngBounds } from "leaflet"
import {LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'

const groupByArray = (arr) => {
  return arr.reduce((groups, item) => {
    let groupFound = groups.find(arrItem => item.typeId === arrItem.id)
    if (groupFound) {
      if (groupFound.data[0].id.indexOf(item.id) == -1) {
        groupFound.data.push(item)
      }

    } else {
      let newGroup = {
        name: item.typeName,
        id: item.typeId,
        fport: item.fport ? item.fport : 999999,
        data: [item],
        icon: item.iconAddr ? item.iconAddr : 'unknown.png'
      }
      groups.push(newGroup)
    }
    return groups
  }, []).sort((a, b) => {return (a.fport - b.fport)})
}
const fuzzyQuery = (list, keyWord) => {
  let arr = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].name.split(keyWord).length > 1) {
      arr.push(list[i]);
    }
  }
  return arr;
}
export default {
  components:{
    BMapComponent,
    NodeCard,
    AlarmDetail,
    'l-map': LMap,
    'l-tile-layer': LTileLayer,
    'l-marker': LMarker,
    'l-popup': LPopup,
    'v-marker-cluster': Vue2LeafletMarkerCluster
  },
  data () {
    return {
      canHandleRight: true,
      canHandleLeft: true,
      ENMapInfo: [],
      alarmNodesType: [],
      mapActive: 'normal',
      bounds: null,
      language: this.$i18n.locale,
      activeClass: -1,
      resetMap:false,
      left:0,
      showModel: false,
      modelList: {},
      searchName: '',
      tableHeight:'',
      show: false,
      showDetail: false,
      nodesType:'',
      title:'',
      showInfo: [],
      page: {
        index: 1,
        limit: 8
      },
      mark : [],
      lmapOptions: {
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        zoomControl: false,
        attributionControl: false,
      },
      map: {
        init: true,
        center: {
          lng: 108.93,
          lat: 34.27
        },
        zoom: 5,
        // marker类型  normal-正常  alarm-告警
        type: 'normal',
        // 自动缩放
        autoZoom: true,
        // marker集合
        markers: [],
        // 是否显示infoWindow, 开始必须为false
        show_type: 'N',
        infoWindow: {
          color: '#ffffff',
          show: false,
          position: {},
          icon_addr: '',
          type_name: '',
          time: '',
          show_name: '',
          dev_eui: '',
          name1: '',
          unit1: '',
          name2: '',
          unit2: '',
          status:''
        },
      },
      spinShow: false,
      formValidate:{},
      ruleValidate:{},
      columns1: [
          {
            title: 'Name',
            key: 'name',
            ellipsis:true,
            render: (h, params) => {
            return h('div', [
                h('div',{
                  style: {
                    width:'200px',
                    textOverflow:'ellipsis',
                    overflow:'hidden',
                    fontWeight: 'bold'
                  }
                },params.row.name),
                h('div', {
                    style: {
                      marginTop:'10px',
                      textOverflow:'ellipsis',
                      overflow:'hidden'
                    },
                }, params.row.address),
              ]);
            }
          },
      ],
      data1:[],
      markers: [],
      alarmTimeOut: {},
      alarmCounts: 0
    }
  },
  computed: {
    ...mapGetters([
      'mapNodeType'
    ]),
    alarmChange() {
      return this.$store.state.monitor.alarmList
    }
  },
  watch: {
    alarmChange(list) {
      if(this.show === false) this.handleAlarmList(list)
    },
    resetMap (newVal, oldVal) {
      if(newVal != oldVal){
        if(this.markers.length == 0) {
          this.handleAlarm()
        }
      }
    },
    mapActive (newVal, oldVal) {
      if(newVal != oldVal){
        this.left = 0
        if ( this.$refs.mycontent.offsetWidth + this.left*-1 < this.showType.length * 130 - 80) {
          this.canHandleRight = true
        } else {
          this.canHandleRight = false
        }
        if (this.left !== 0) {
          this.canHandleLeft= true
        } else {
          this.canHandleLeft= false
        }

      }
    }
  },
  methods: {
    ...mapActions([
      'getAlarmNodesInfo',
      'getNodesLatestData',
      'saveNodeBasic'
    ]),
    mapSelect (state) {
      this.mapActive = state
      this.left = 0
      this.show = false
      this.showDetail = false
      this.activeClass =  -1
      if (state === 'alarm') {
        this.handleAlarmList(this.$store.state.monitor.alarmList)
      }
      if (state === 'normal') {
        this.bounds = latLngBounds(this.ENMapInfo)
        this.showType = this.nodesType
        this.map.markers = this.mark
      }
      
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.spinShow = true
          this.saveNodeBasic(this.formValidate).then(res => {
            this.spinShow = false
            if(res.data.code !== 0) return
            this.$Message.success(this.$t('save_ok'))
            this.close_left()
            this.$store.dispatch('getNodes', {update: 1}).then(res => {
              let data = res.data.rs.data
              this.nodesType = groupByArray(data,'typeName')
              this.showType = this.nodesType
              let bounds = []
              this.nodesType.forEach(e => {
                e.data.forEach(k => {
                  if (k.latitude && k.longitude && k.typeId) {
                    const icon = require('@/assets/images/mapIcon/' + (e.iconAddr ? e.iconAddr : 'unknown.png') )
                    let marks = {
                      lat: parseFloat(k.latitude),
                      lng: parseFloat(k.longitude),
                      'type_name': k.typeName,
                      done_type:0,
                      icon: icon,
                      'lm_icon': L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
                      infoIcon: k.iconAddr,
                      devEui: k.devEui,
                      name: k.name,
                      time: k.updateTime,
                      fport: e.fport
                    }
                    this.mark.push(marks)
                    bounds.push({ lat: parseFloat(k.latitude), lng: parseFloat(k.longitude) })
                  }
                })
              })

              this.bounds = latLngBounds(bounds)
              this.map.markers = this.mark
            })
          }).catch(err => this.spinShow = false)
        } else {
          this.$Message.error(this.$t('unvalid_param'))
        }
      })
    },
    search () {
      let result = fuzzyQuery(this.data1,this.searchName)
      this.showInfo = result
      this.close_right()
    },
    info_close() {
      // 设置显示的类型
      setTimeout(()=>{
        this.map.show_type = 'N';
         this.map.infoWindow.spinShow = true
      },0)
    },
    // 点击标注
    marker_click (marks) {
      if(marks.done_type === 0){
        setTimeout(() => {
          this.map.show_type = 'I'
        },100)
        this.getNodesLatestData({devEUIs:marks.devEui}).then(res => {
          let data = res.data.rs.data
          this.map.infoWindow = {
            color: '#fff',
            show: true,
            position: {
              lng: marks.lng,
              lat: marks.lat
            },
            'icon_addr': marks.nomapicon,
            'type_name': marks.type_name,
            'show_name': marks.name,
            'dev_eui': marks.devEui,
            time:  data.length > 0 ? moment(data[0].payload.ts).format("YYYY-MM-DD HH:mm:ss") : '-',
            icon_addr:require('@/assets/images/nodeIcon/'+ marks.infoIcon  ),
            name1: data.length > 0 ? (data[0].payload.online === 1 ? this.$t('normal') : this.$t('offline')) : '-',
            spinShow: false
          };
          if (marks.fport === "4") {
            this.map.infoWindow.name1 = data.length > 0 && data[0].payload.payload.temperature ? data[0].payload.payload.temperature + '℃' : '-'
            this.map.infoWindow.name2 = data.length > 0 && data[0].payload.payload.humidity ? data[0].payload.payload.humidity + '%':'-',
            this.map.infoWindow.status = data.length > 0 ? (data[0].payload.online === 1  ? '（'+this.$t('normal')+'）' : '（'+this.$t('offline')+'）') : ''
          }
          if(marks.fport === "4402") {
            this.map.infoWindow.name1 = data.length > 0 ? 'AD：' + data[0].payload.payload.ad : '-',
            this.map.infoWindow.status = data.length > 0 ? (data[0].payload.online === 1  ? '（'+this.$t('normal')+'）'  : '（'+this.$t('offline')+'）' ) : ''
          }
        })
      }
      if(marks.done_type == 1){
        this.showModel = true
        this.modelList = marks
      }
    },
    lfmap_marker_click (marks) {
      if(marks.done_type === 0){
        this.getNodesLatestData({devEUIs:marks.devEui}).then(res => {
          let data = res.data.rs.data
          this.map.infoWindow = {
            color: '#fff',
            show: true,
            position: {
              lng: marks.lng,
              lat: marks.lat
            },
            'icon_addr': marks.nomapicon,
            'type_name': marks.type_name,
            'show_name': marks.name,
            'dev_eui': marks.devEui,
            time:  data.length > 0 ? moment(data[0].payload.ts).format("YYYY-MM-DD HH:mm:ss") : '-',
            icon_addr:require('@/assets/images/nodeIcon/'+ marks.infoIcon  ),
            name1: data.length > 0 ? (data[0].payload.online === 1 ? this.$t('normal') : this.$t('offline')) : '-',
            spinShow: false
          };
          if (marks.fport === "4") {
            this.map.infoWindow.name1 = data.length > 0 && data[0].payload.payload.temperature ? data[0].payload.payload.temperature + '℃': '-'
            this.map.infoWindow.name2 = data.length > 0 && data[0].payload.payload.humidity ? data[0].payload.payload.humidity + '%':'-',
            this.map.infoWindow.status = data.length > 0 ? (data[0].payload.online === 1  ? '（'+this.$t('normal')+'）' : '（'+this.$t('offline')+'）') : ''
          }
          if(marks.fport === "4402") {
            this.map.infoWindow.name1 = data.length > 0 ? 'AD：' + data[0].payload.payload.ad : '-',
            this.map.infoWindow.status = data.length > 0 ? (data[0].payload.online === 1  ? '（'+this.$t('normal')+'）'  : '（'+this.$t('offline')+'）' ) : ''
          }
        })
      }
      if(marks.done_type == 1){
        this.$nextTick(() => { this.$refs.leaflet_map.mapObject.closePopup() })
        this.showModel = true
        this.modelList = marks
      }
    },
    nextPage (e) {
      this.page.index = e
      this.showInfo = this.data1.slice((e - 1) * 8, e * 8)
    },
    show_list (item,index) {
      this.searchName = ''
      this.activeClass = index
      let marker = []
      let bounds = []
      item.data.forEach(e => {
        if(e.latitude && e.longitude){
          const icon =  this.mapActive === 'alarm' ? require('@/assets/images/mapIcon/' + (e.iconAddr ? e.iconAddr.substring(0,e.iconAddr.length-4) +'-alarm.png' : 'unknown-alarm.png') ) : require('@/assets/images/mapIcon/' + (e.iconAddr ? e.iconAddr : 'unknown.png') )

          let data = {
            lat: parseFloat(e.latitude) ? parseFloat(e.latitude): '',
            lng: parseFloat(e.longitude) ? parseFloat(e.longitude) : '',
            done_type: this.mapActive === 'alarm' ? 1 : 0,
            icon:e.iconAddr ? icon : require('@/assets/images/mapIcon/unknown.png'),
            'lm_icon': L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
            infoIcon: e.iconAddr ? e.iconAddr : 'unknown',
            devEui: e.devEui,
            name: e.name,
            time: e.updateTime,
            'type_name': e.typeName,
            ts: e.ts,
            fport: e.fport,
            counts: e.counts,
            typeName:e.typeName,
            ruleName:e.ruleName,
            ruleId:e.ruleId,
            typeId:e.fport,
            address:e.address,
            sequence:e.sequence
          }
          marker.push(data)
          bounds.push({ lat: parseFloat(e.latitude), lng: parseFloat(e.longitude) })
        }
      })
      this.bounds = latLngBounds(bounds)
      this.map.markers = marker
      if(this.show){
        this.show = false
        this.showDetail = false
          setTimeout(()=>{
            this.show = true;
          },0)
      }else{
        this.show = true 
        this.$nextTick(()=>{
          this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 390
        })
        
      }     
      this.data1 = item.data
      this.page.index = 1
      this.showInfo = this.data1.slice(0,  8)
      this.title = item.name
    },
    show_detail (item, index) {
      this.showDetail = false
      if (this.mapActive === 'alarm') {
        if(item.latitude && item.longitude){
            const icon = require('@/assets/images/mapIcon/' + (item.iconAddr ? item.iconAddr.substring(0,item.iconAddr.length-4) +'-alarm.png' : 'unknown-alarm.png'))
            const data = {
              lat: parseFloat(item.latitude),
              lng: parseFloat(item.longitude),
              done_type: this.mapActive === 'alarm' ? 1 : 0,
              icon:item.iconAddr ? icon : require('@/assets/images/mapIcon/unknown.png'),
              'lm_icon': L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
              infoIcon: item.iconAddr ? item.iconAddr : 'unknown',
              devEui: item.devEui,
              name: item.name,
              time: item.updateTime,
              'type_name': item.typeName,
              fport: item.fport,
              ts: item.ts,
              counts: item.counts,
              typeName:item.typeName,
              ruleName:item.ruleName,
              ruleId:item.ruleId,
              typeId:item.fport,
              address:item.address,
              sequence:item.sequence
            }
            this.map.markers = [data]
            this.map.center = data
          }
      }
      if(this.show && this.mapActive === 'normal'){
        setTimeout(() => {
          // this.showDetail = true
          if(item.latitude && item.longitude){
            const icon = require('@/assets/images/mapIcon/' + (item.iconAddr ? item.iconAddr : 'unknown.png'))
            const data = {
              lat: parseFloat(item.latitude),
              lng: parseFloat(item.longitude),
              done_type: this.mapActive === 'alarm' ? 1 : 0,
              icon:item.iconAddr ? icon : require('@/assets/images/mapIcon/unknown.png'),
              'lm_icon': L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
              infoIcon: item.iconAddr ? item.iconAddr : 'unknown',
              devEui: item.devEui,
              name: item.name,
              time: item.updateTime,
              'type_name': item.typeName,
              fport: item.fport
            }
            this.map.markers = [data]
            this.map.center = data
          }
        }, 0);
        this.formValidate = JSON.parse(JSON.stringify(item))
      }
      
      
    },
    close_left () {
      this.show = false
      this.showDetail = false
      if (this.mapActive === 'alarm') {
        this.map.markers = this.markers
        
      } else {
        this.map.markers = this.mark
      }
      this.activeClass = -1
    },
    close_right () {
      this.showDetail = false
    },
    clickLeft () {
      if (this.left !== 0) {
        this.left += 130
        if (this.left !== 0) {
          this.canHandleLeft = true
        } else {
          this.canHandleLeft = false
        }
        if (this.$refs.mycontent.offsetWidth + this.left*-1 < this.showType.length * 130 - 80) {
          this.canHandleRight = true
        } else {
          this.canHandleRight = false
        }
      } 
    },
    clickRight () {
      if (this.$refs.mycontent.offsetWidth + this.left*-1 < this.showType.length * 130 - 80) {
        this.left -= 130
        if (this.$refs.mycontent.offsetWidth + this.left*-1 < this.showType.length * 130 - 80) {
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
    changeModel (state,refresh) {
      this.showModel = state
      if(refresh){
        this.activeClass = -1
        this.handleAlarmList(this.$store.state.monitor.alarmList)
      }
    },
    handleAlarmList(list) {
      let bounds = list.map(v => {
        return {
          lat: v.lat,
          lng: v.lng
        }
      })
      this.bounds = latLngBounds(bounds)
      // 告警列表数据处理，根据节点id和告警等级合并告警信息
      let alarmMark = []
      let alarmType = groupByArray(list, 'typeName').filter(e => e.fport === "200" || e.fport === "40")

      alarmType.forEach(e => {
        e.data.forEach(k => {
          const icon = require('@/assets/images/mapIcon/' + (k.iconAddr ? k.iconAddr.substring(0,k.iconAddr.length-4) +'-alarm.png' : 'unknown-alarm.png'))
            let marks = {
              lat: k.lat,
              lng: k.lng,
              'type_name': k.typeName,
              done_type:1,
              icon: icon,
              'lm_icon': L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
              infoIcon: k.iconAddr,
              devEui: k.devEui,
              name: k.name,
              ts: k.ts,
              fport: e.fport,
              counts: k.counts,
              typeName:k.typeName,
              ruleName:k.ruleName,
              ruleId:k.ruleId,
              typeId:k.fport,
              address:k.address,
              sequence:k.sequence
            }
          alarmMark.push(marks)
        })
      })
      //地图显示告警
      this.markers = alarmMark
      if (this.markers.length > 0) {
        this.resetMap = true
        this.showType = alarmType
        this.map.markers = this.markers
        this.mapActive = 'alarm'
      } else {
        this.resetMap = false
        this.showType = this.nodesType
        this.map.markers = this.mark
        this.mapActive = 'normal'
      }
    },
    //处理告警
    handleAlarm() {
      this.show = false
    },
  },
  created () {
    
  },
  mounted () {
    this.$nextTick(()=>{
      window.onresize = () => {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 385
      }
    })
    this.$store.dispatch('getNodes').then(() => {
      let data = this.mapNodeType
      this.nodesType = groupByArray(data,'typeName').filter(e => e.fport === "200" || e.fport === "40")
      let bounds = []
      this.nodesType.forEach(e => {
        e.data.forEach(k => {
          if (k.latitude && k.longitude && k.typeId) {
            const icon = require('@/assets/images/mapIcon/' + (k.iconAddr ? k.iconAddr : 'unknown.png') )
            let marks = {
              lat: parseFloat(k.latitude),
              lng: parseFloat(k.longitude),
              'type_name': k.typeName,
              done_type:0,
              icon: icon,
              'lm_icon': L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
              infoIcon: k.iconAddr,
              devEui: k.devEui,
              name: k.name,
              time: k.updateTime,
              fport: e.fport
            }
            this.mark.push(marks)
            bounds.push({ lat: parseFloat(k.latitude), lng: parseFloat(k.longitude) })
          }
        })
      })
      this.mapActive = 'normal'
      this.ENMapInfo = bounds
      this.bounds = latLngBounds(bounds)
      this.map.markers = this.mark
      
      this.showType = this.nodesType
      this.$nextTick(() => {
        this.handleAlarmList(this.$store.state.monitor.alarmList)
        if (this.$refs.mycontent.offsetWidth + this.left*-1 < this.showType.length * 130 - 80) {
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
  beforeDestroy() {
    clearTimeout(this.alarmTimeOut)
  },
}
</script>
