<style lang="less" scoped src="./node.less"></style>
<template>
  <div id="node">
    <!-- 查询列表 -->
    <div class="node_list boxShadow">
      <div class="add" v-if="$route.meta.access.includes('1000.01.001')">
        <img src="../../../assets/images/node/add.svg" alt="add" @click="add">
      </div>
      <div class="title" v-if="$route.meta.access.includes('1000.01.001')">{{$t('create_node')}}</div>
      <div style="display:flex;" class="select_input">
        <i-input search v-model="nodeList.name" :placeholder="$t('node_name_or_code')" @on-search="init"></i-input>
      </div>
      <Table ref="table" :loading="nodeList.loading" :height="tableHeight" :columns="nodeList.columns" :data="nodeList.data" highlight-row	@on-current-change="selectNode"></Table>
      <div class="list_bottom">
        <Page :total="nodeList.total" :page-size="nodeList.pageSize" @on-change="nextPage" show-elevator show-total></Page>
      </div>
    </div>
    <!-- 地图 -->
    <div id="nodeMap" class="boxShadow">
      <!-- leaflet map -->
      <l-map ref="leaflet_map" v-if="language === 'en-US'" :options="lmapOptions" :bounds="bounds" style="width:100%;height:100%;" :zoom="map.zoom" :center="map.center" :minZoom="4">
        <l-tile-layer :url="lmapOptions.url"></l-tile-layer>
          <l-marker v-for="item in map.markers" :icon="item.lm_icon" :lat-lng="item" :key="item.index" :zIndexOffset="item.zIndexOffset">
          </l-marker>
      </l-map>
      <b-map-component 
        v-if="language === 'zh-CN'"
        :center="map.center"
        :init="map.init"
        :zoom="map.zoom"
        :markers="map.markers"
        :show_type="map.show_type"
        :type="map.type"
        :auto-zoom="map.autoZoom"
        :isClusterer="false"
        style="width:100%;height:100%;"
      >
      </b-map-component>
    </div>
    <!-- 弹出层 -->
    <transition name="slide-fade">
      <div class="bg" v-if="show_bg" @click="close"></div>
    </transition>
    <transition name="detail-fade">
      <div class="add_warpper" v-if="show_node" v-show="show_Node">
        <div id="addNodeMap" class="boxShadow" >
          <l-map ref="leaflet_maps" v-if="language === 'en-US'" :options="glmapOptions" :bounds="gbounds" style="width:100%;height:100%;" :zoom="18" :center="gmap.center" :minZoom="4" @click="mapClick">
            <l-tile-layer :url="glmapOptions.url"></l-tile-layer>
              <l-marker v-for="item in gmap.markers" :icon="item.lm_icon" :lat-lng="item" :key="item.index" :zIndexOffset="item.zIndexOffset">
              </l-marker>
          </l-map>
          <g-map-component 
            v-if="language === 'zh-CN'"
            :center="gmap.center"
            :init="gmap.init"
            :zoom="gmap.zoom"
            :markers="gmap.markers"
            :show_type="gmap.show_type"
            :type="gmap.type"
            :auto-zoom="gmap.autoZoom"
            :isClusterer="false"
            @mapClick="mapClick"
            style="width:100%;height:100%;"
          >
        </g-map-component>
        </div>
        <div class="add_detail" >
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="140">
              <div class="add_title">
                <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
                <span>{{ title }}</span>
              </div>
              <Row class="add_scroll">
                <FormItem :label="$t('source')+'：'" prop="source" style="margin-top:20px">
                  <i-col style="width:200px;">
                    <i-select v-model="formValidate.source" filterable>
                      <i-option value="WE">{{$t('we')}}</i-option>
                      <i-option value="AL">{{$t('al')}}</i-option>
                      <i-option value="TE">{{$t('te')}}</i-option>
                    </i-select>
                  </i-col>
                </FormItem>
                <div v-if="formValidate.source === 'WE'">
                  <FormItem :label="$t('middleware')+'：'" prop="middle.id" >
                  <Row>
                  <i-col span="12" style="width:200px;">
                      <i-select v-model="formValidate.middle.id" filterable>
                          <i-option v-for="item in middleWare" :value="item.id" :key="item.id">{{ item.name }}</i-option>
                      </i-select>
                  </i-col>
                  <i-col span="12" class="tip">{{$t('no_sure_no_modify')}}</i-col>
                  </Row>
                  </FormItem>
                </div>
                <!-- 第一组 -->
                <FormItem :label="$t('type')+'：'" prop="type.id" >
                  <Row>
                    <i-col span="8" style="width:200px;">
                      <i-select v-model="formValidate.type.id" filterable @on-change="changeNodeType">
                        <i-option v-for="item in nodeType" :value="item.id" :key="item.id">{{ item.name }}</i-option>
                      </i-select>
                    </i-col>
                  </Row>
                </FormItem>
                <FormItem :label="$t('model')+'：'" prop="vendor.id" >
                <Row>
                  <i-col span="12" style="width:200px;">
                    <i-select v-model="formValidate.vendor.id" filterable>
                      <i-option v-for="item in nodeVendors" :value="item.id" :key="item.id">{{ item.name }}</i-option>
                    </i-select>
                  </i-col>
                  <i-col span="12" class="tip">{{$t('model_tips')}}</i-col>
                  </Row>
                </FormItem>
                <FormItem :label="$t('name')+'：'" prop="name">
                  <Row>
                  <i-col span="12" style="width:200px">
                    <Input type="text" v-model="formValidate.name" style="width:200px" />
                  </i-col>
                  <i-col span="12"  class="tip">{{$t('register_failure_prompt')}}
                  </i-col>
                  </Row>
                </FormItem>
                <FormItem :label="$t('device_code')+'：'" prop="devEui" >
                  <Input type="text" v-model="formValidate.devEui" :disabled="title === $t('node_edit')" style="width:400px" />
                </FormItem>
                <div v-if="formValidate.source === 'WE'">
                  <FormItem :label="$t('license')+'：'" prop="authCode" >
                    <Input type="text" v-model="formValidate.authCode" :disabled="title === $t('node_edit')" style="width:400px" />
                  </FormItem>
                </div>
                <!-- 第二组 -->
                <FormItem :label="$t('device_status')+'：'" prop="status" >
                  <Row>
                  <i-col span="12" style="width:200px">
                      <i-select v-model="formValidate.status" filterable>
                        <i-option value="0">{{$t('activated')}}</i-option>
                        <i-option value="1">{{$t('inactive')}}</i-option>
                      </i-select>
                  </i-col>
                  </Row>
                </FormItem>
                <div v-if="formValidate.source === 'WE'">
                  <!-- 第三组 -->
                  <FormItem label="AppEUI：" prop="appEui" v-if="formValidate.source === 'WE'">
                    <Input type="text" v-model="formValidate.appEui" :disabled="title === $t('node_edit')" style="width:400px"/>
                  </FormItem>
                  <FormItem label="AppKEY：" prop="appKey" v-if="formValidate.source === 'WE'">
                    <Input type="text" v-model="formValidate.appKey" :disabled="title === $t('node_edit')" style="width:400px"/>
                  </FormItem>
                  <!-- 第四组 -->
                  <Row>
                    <i-col span="7">
                        <FormItem label="Is_Class_C：" prop="isClassC" >
                          <i-col style="width:100px;">
                              <i-select v-model="formValidate.isClassC"  :disabled="title === $t('node_edit')" filterable>
                                <i-option value="1">{{$t('yes')}}</i-option>
                                <i-option value="2">{{$t('no')}}</i-option>
                              </i-select>
                          </i-col>
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                      <FormItem :label="$t('ignore_dup')+'：'" prop="relaxFCnt">
                          <i-col style="width:100px;">
                              <i-select v-model="formValidate.relaxFCnt"  :disabled="title === $t('node_edit')" filterable>
                                <i-option value="1">{{$t('yes')}}</i-option>
                                <i-option value="2">{{$t('no')}}</i-option>
                              </i-select>
                          </i-col>
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                      <FormItem label="installationMargin：" prop="">
                        <Input type="number" v-model="formValidate.installationMargin" :disabled="title === $t('node_edit')" style="width:100px" />
                      </FormItem>
                    </i-col>
                  </Row>
                  <!-- 第五组 -->
                  <Row>
                    <i-col span="7">
                        <FormItem label="ADR Interval：" prop="">
                          <Input type="number"  v-model="formValidate.adrInterval" :disabled="title === $t('node_edit')" style="width:100px" />
                        </FormItem>
                    </i-col>
                    <i-col span="8">
                      <FormItem label="rx1DROffset：" prop="">
                        <Input type="number" v-model="formValidate.rx1DrOffset" :disabled="title === $t('node_edit')" style="width:100px" />
                      </FormItem>
                    </i-col>
                    <i-col span="8">
                      <FormItem label="rxWindow：" prop="rxWindow">
                        <i-col  style="padding-right:10px;width:100px;">
                          <i-select v-model="formValidate.rxWindow" filterable>
                            <i-option value="RX1">RX1</i-option>
                            <i-option value="RX2">RX2</i-option>
                          </i-select>
                        </i-col>
                      </FormItem>
                    </i-col>
                  </Row>
                  <!-- 第六组 -->
                  <Row>
                    <i-col span="7">
                      <FormItem label="rxDelay：" prop="" >
                        <Input type="number"  v-model="formValidate.rxDelay" style="width:100px" />
                      </FormItem>
                    </i-col>
                    <i-col span="7">
                      <FormItem label="rx2DR：" prop="" >
                        <Input type="number"  v-model="formValidate.rx2Dr" style="width:100px" />
                      </FormItem>
                    </i-col>
                  </Row>
                </div>
                <Row>
                  <i-col span="7">
                      <FormItem :label="$t('principal_name')+'：'" prop="operator" >
                        <Input type="text" v-model="formValidate.operator"  style="width:100px" />
                      </FormItem>
                  </i-col>
                  <i-col span="10">
                    <FormItem :label="$t('principal_mobile')+'：'" prop="operatorMobile" >
                        <Input type="text" v-model="formValidate.operatorMobile"  style="width:200px" />
                      </FormItem>
                  </i-col>
                  <i-col span="4" class="tip"> {{$t('operator_remark')}}</i-col>
                </Row>
                <Row>
                  <i-col span="7">
                      <FormItem :label="$t('principal_name')+'1：'" prop="operator2" >
                        <Input type="text" v-model="formValidate.operator2" style="width:100px" />
                      </FormItem>
                  </i-col>
                  <i-col span="10">
                    <FormItem :label="$t('principal_mobile')+'1：'" prop="operatorMobile2" >
                        <Input type="text" v-model="formValidate.operatorMobile2" style="width:200px" />
                      </FormItem>
                  </i-col>
                  <i-col span="4" class="tip"> {{$t('operator_remark')}}</i-col>
                </Row>
                <Row>
                  <i-col span="7">
                      <FormItem :label="$t('principal_name')+'2：'" prop="operator3" >
                        <Input type="text" v-model="formValidate.operator3" style="width:100px" />
                      </FormItem>
                  </i-col>
                  <i-col span="10">
                    <FormItem :label="$t('principal_mobile')+'2：'" prop="operatorMobile3" >
                        <Input type="text" v-model="formValidate.operatorMobile3" style="width:200px" />
                      </FormItem>
                  </i-col>
                  <i-col span="4" class="tip"> {{$t('operator_remark')}}</i-col>
                </Row>
                <FormItem :label="$t('grid_manage')+'：'" prop="groupParentIdsVo">
                  <Row style="margin-top:4px">
                  <i-col span="12">
                    <!-- <i-select v-model="formValidate.griderGroup" filterable>
                      <i-option v-for="item in groups" :value="item.id" :key="item.id">{{ item.groupName }}</i-option>
                    </i-select> -->
                    <Cascader change-on-select :data="groups" v-model="formValidate.groupParentIdsVo" style="width:200px"></Cascader>
                  </i-col>
                  </Row>
                </FormItem>
                <FormItem :label="$t('related_code')+'：'" prop="positionCode">
                  <Row>
                  <i-col span="7">
                    <Input type="text" v-model="formValidate.positionCode" style="width:200px" />
                  </i-col>
                  <i-col span="14" class="tip">
                    {{$t('related_code_remark')}}
                  </i-col>
                  </Row>
                </FormItem>
                <FormItem :label="$t('address')+'：'" prop="address">
                  <i-col>
                    <Input type="text" v-model="formValidate.address"  style="width:400px" />
                  </i-col>
                </FormItem>
                <Row>
                  <i-col span="7">
                      <FormItem :label="$t('lng')+'：'" prop="longitude" >
                        <Input type="text"  v-model="formValidate.longitude"  style="width:130px" />
                      </FormItem>
                  </i-col>
                  <i-col span="8">
                    <FormItem :label="$t('lat')+'：'" prop="latitude" >
                        <Input type="text"  v-model="formValidate.latitude"  style="width:130px" />
                      </FormItem>
                  </i-col>
                  <i-col span="7" class="tip">{{$t('click_map_prompt')}}</i-col>
                </Row>
                <FormItem :label="$t('remark')+'：'" prop="remarks">
                  <i-col>
                    <Input type="textarea" v-model="formValidate.remarks"   style="width:400px" />
                  </i-col>
                </FormItem>
              </Row>
              <div class="add_bottom" style="width: 42vw;min-width: 800px;">
                <div class="add_button" @click="handleSubmit('formValidate')">{{$t('save')}}</div>
              </div>
              <Spin size="large" fix v-if="spinShow"></Spin>
          </Form>
        </div>
      </div>
    </transition>
    <Modal v-model="deleteModel.status">
      <p slot="header" style="color:#f60;text-align:center"></p>
      <div style="text-align:center">
        <p>
          <Icon type="ios-alert-outline" size="22"/>
          {{$t('del_confirm')}} {{delTitle}}？
        </p>
        <p>{{$t('cant_restore_delete')}}</p>
      </div>
      <div slot="footer">
        <Button type="success" :loading="deleteModel.loading" @click="deleteNodes">{{$t('confirm')}}</Button>
        <Button @click="deleteModel.status = false">{{$t('cancel')}}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import BMapComponent from '_c/BMap/BMapComponent'
import GMapComponent from '_c/BMap/gatewayMap'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import { latLngBounds } from "leaflet"
import {LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'

export default {
  components:{
    BMapComponent,
    GMapComponent,
    'l-map': LMap,
    'l-tile-layer': LTileLayer,
    'l-marker': LMarker,
    'l-popup': LPopup,
  },
  data () {
    return {
      delTitle: '',
      bounds: null,
      gbounds: null,
      language: this.$i18n.locale,
      lmapOptions: {
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        zoomControl: false,
        attributionControl: false,
      },
      glmapOptions: {
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        zoomControl: false,
        attributionControl: false,
      },
      currentTs: [],
      //点击地图的坐标
      resetMap: '',
      resetMap1: '',
      selectIcon: '',
      tableHeight:'',
      msg: this.$t('map'),
      title: this.$t('create_node'),
      show_bg: false,
      show_node: false,
      show_Node: false,
      nodeList: {
        columns: [
          {
            title: this.$t('device'),
            render: (h,params) => {
              let offline = params.row.isoffline ? 'showRed' : ''
              // this.currentTs.map(e => {
              //   if (e.payload.dev_eui === params.row.devEui && e.payload.online !== 1) {
              //       offline = 'showRed'
              //   }
              // })
              return h('span',{
                style:{
                  color: offline === 'showRed' ? 'red' : '#1a1a1a'
                }
              }, params.row.devEui + (offline === 'showRed' ? '('+this.$t('offline')+')' : ''))
            }
          },
          {
            title: this.$t('op'),
            key: 'age',
            width: 200,
            render: (h, params) => {
              let btn = []
              if(this.$route.meta.access.includes('1000.01.001')){
                btn.push(
                  h('Tooltip',{
                    props:{
                      content: this.$t('edit'),
                      placement:'top',
                    },
                    style: {
                        marginRight: '40px'
                    }
                  }, [
                    h('img',{
                      attrs: {
                          src: require("../../../assets/images/node/right1.svg"),
                      },
                      style: {
                          width:'16px',
                          cursor:'pointer'
                      },
                      on: {
                        click: () => {
                          this.editNode(params.row)
                        }
                      }
                    })
                  ])
                )
              }

              btn.push(
                h('Tooltip',{
                  props:{
                    content: this.$t('panel'),
                    placement:'top',
                  },
                  style: {
                    marginRight: '40px'
                  }
                }, [
                  h('img',{
                    attrs: {
                        src: require("../../../assets/images/node/right2.svg"),
                    },
                    style: {
                        width:'16px',
                        cursor:'pointer'
                    },
                    on: {
                      click: () => {
                        let name = ''
                        if(this.$route.name == "node_nodeIndex"){
                          name = 'node_panel'
                        }else {
                          name = 'lamp_node_panel'
                        }
                        this.$router.push({
                          name: name, 
                          params: { nodeId: params.row.id }
                        })
                      }
                    }
                  })
                ])
              )

              if(this.$route.meta.access.includes('1000.01.002')){
                btn.push(
                  h('Tooltip',{
                    props:{
                      content: this.$t('delete'),
                      placement:'top',
                    }
                  },[
                  h('img', {
                    attrs: {
                      src: require("../../../assets/images/node/right3.svg"),
                    },
                    style: {
                      width:'16px',
                      cursor:'pointer'
                    },
                    on: {
                      'click': () => { 
                        this.deleteModel.status = true
                        this.deleteModel.formValidate.id = params.row.id
                        this.delTitle = params.row.devEui
                      }
                    }
                    })
                  ])
                )
              }
              return h('div', btn)
            }
          },
        ],
        data: [],
        pageSize: 10,
        pageNo: 1,
        name: '',
        total: 0,
        loading: false
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
        show_type: 'N'
      },
      gmap: {
        init: true,
        center: {
          lng: 114.02597366,
          lat: 22.54605355
        },
        zoom: 14,
        // marker类型  normal-正常  alarm-告警
        type: 'normal',
        // 自动缩放
        autoZoom: false,
        // marker集合
        markers: [],
        // 是否显示infoWindow, 开始必须为false
        show_type: 'N'
      },
      formValidate: {
        source: 'WE',
        appEui: '0000000000000001',
        appKey: '98929b92f09e2daf676d646d0f61d250',
        isClassC: "2",
        relaxFCnt: "1",
        installationMargin: 0,
        adrInterval: 0,
        rx1DrOffset: 0,
        rxWindow: 'RX1',
        rxDelay: 0,
        rx2Dr: 0,
        status: "0",
        middle: {id: 'cfceaa44157f4afd902cbbeccf1bfe99'},
        type: {id: ''},
        vendor: {id: ''}
      },
      ruleValidate: {
        devEui: [
          { required: true, message: this.$t('ple_fill_device_code'), trigger: 'blur' }
        ],
        authCode: [
          { required: true, message: this.$t('ple_fill_authorization_code'), trigger: 'blur' }
        ],
        appEui: [
          { required: true, message: this.$t('ple_fill_appeui'), trigger: 'blur' }
        ],
        appKey: [
          { required: true, message: this.$t('ple_fill_appkey'), trigger: 'blur' }
        ],
        source:[
          { required: true, message: this.$t('ple_select_source'), trigger:'change' }
        ],
        'middle.id':[
          { required: true, message: this.$t('ple_select_middleware'), trigger:'change' }
        ],
        'type.id':[
          { required: true, message: this.$t('ple_select_type'), trigger:'change' }
        ],
        name:[
          { required: true, message: this.$t('enter_name_prompt'), trigger:'blur' }
        ],
      },
      spinShow: false,
      deleteModel: {
        status: false,
        loading: false,
        formValidate: {}
      },
      nodeVendors: [],
    }
  },
  computed: {
    ...mapGetters([
      'groups',
      'nodeType',
      'middleWare',
    ])
  },
  methods: {
    ...mapActions([
      'getNodeList',
      'saveNode',
      'deleteNode',
      'getNodeVendors',
      'getNodeCurrent'
    ]),
    // 获取节点列表
    init () {
      // this.nodeList.loading = true
      const data = {
        pageSize: this.nodeList.pageSize, 
        pageNo: this.nodeList.pageNo, 
        name: this.nodeList.name,
        model:'simple'
      }
      this.getNodeList(data).then(res => {
        const data = res.data.rs
        let devEui = data.data.list.map(e => e.devEui)
        let markers = []
        let bounds = []

        this.getNodeCurrent({devEUIs:devEui.join(',')}).then(res => {
          this.nodeList.loading = false
          this.currentTs = res.data.rs.data
          data.data.list.forEach(e => {
            if (e.latitude && e.longitude) {
              const icon = require('../../../assets/images/mapIcon/' + (e.type.iconAddr ? e.type.iconAddr : 'unknown.png'))
              markers.push({
                  lat: parseFloat(e.latitude),
                  lng: parseFloat(e.longitude),
                  icon: icon,
                  'lm_icon': L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
              })
              bounds.push({ lat: parseFloat(e.latitude), lng: parseFloat(e.longitude) })
            }

            let state = this.currentTs.find(v => v.payload.dev_eui === e.devEui)
            e.isoffline = true
            if(state){  
                if (state.payload.online === 1) e.isoffline = false
            }
          })
          this.bounds = latLngBounds(bounds)
          this.map.markers = markers

          this.nodeList.data = data.data.list
          this.nodeList.total = data.data.count
        })
      })
    },
    nextPage (page) {
      this.nodeList.pageNo = page
      this.init()
    },
    changeNodeType (value) {
      let a = this.nodeType.find(e => e.id == value)
      if(a){
        // 如果有点点击地图，则使用点击地图的坐标重新渲染icon
        if(this.resetMap){
          this.gmap.center = this.resetMap
          let icon = require('../../../assets/images/mapIcon/' + a.iconAddr )
          this.gmap.markers = [
            {
              ...this.resetMap,
              icon: icon,
              'lm_icon':L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
            },
          ]
        } else {
          this.gmap.center = this.resetMap1 || {
            lng: 114.02597366,
            lat: 22.54605355
          }
          let icon = require('../../../assets/images/mapIcon/' + a.iconAddr)
          this.gmap.markers = [
            {
              ...this.resetMap1,
              icon: icon,
              'lm_icon':L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),

            },
          ]
        }

        this.selectIcon = require('../../../assets/images/mapIcon/' + a.iconAddr)
      }
      
      this.getNodeVendors({typeId: value}).then(res => {
        this.nodeVendors = res.data.rs.data
      })
    },
    // 选择节点
    selectNode (row) {
      let bounds = []
      const icon = row.type ? require('../../../assets/images/mapIcon/' + row.type.iconAddr ) : require('../../../assets/images/mapIcon/unknown.png')
      const data = {
        lat: parseFloat(row.latitude),
        lng: parseFloat(row.longitude),
        icon: icon,
        'lm_icon': L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
      }
      if (row.latitude && row.latitude) {
        bounds.push({ lat: parseFloat(row.latitude), lng: parseFloat(row.longitude) })
        this.bounds = latLngBounds(bounds)
        this.map.markers = [data]
        this.map.center = data
      } else {
        this.bounds = latLngBounds([])
        this.map.markers = []
        this.map.center = {
          lng: 108.93,
          lat: 34.27
        }
      }
    },
    // 编辑弹窗地图选点
    mapClick (e) {
      const icon = this.selectIcon || require('../../../assets/images/mapIcon/unknown.png')
      let point = ''
      let bounds = []
      if (this.language === 'zh-CN') {
        point = e.point
      }
      if (this.language === 'en-US') {
        point = e.latlng
      }
      this.resetMap = point
      point.icon = icon
      point.lm_icon = L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
      bounds.push({ lat: parseFloat(point.lat), lng: parseFloat(point.lng) })
      this.gbounds = latLngBounds(bounds)
      this.gmap.center = point
      this.gmap.markers = [point]
      this.formValidate.longitude = point.lng
      this.formValidate.latitude = point.lat
      this.formValidate.address = e.address
    },
    // 编辑， 保存
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.spinShow = true
          const data = {
            griderGroup: this.$refs[name].model.groupParentIdsVo ? this.$refs[name].model.groupParentIdsVo[this.$refs[name].model.groupParentIdsVo.length - 1] : '',
            ...this.$refs[name].model
          }
          this.saveNode(data).then(res => {
            this.spinShow = false
            if(res.data.code !== 0) return
            this.show_bg = false
            this.show_Node = false
            this.init()
            this.$Message.success(this.$t('save_ok'))
          }).catch(err => this.spinShow = false)
        } else {
          this.$Message.error(this.$t('unvalid_param'))
        }
      })
    },
    // 删除节点
    deleteNodes () {
      this.deleteModel.loading = true
      this.deleteNode({nodeId: this.deleteModel.formValidate.id}).then(res => {
        this.deleteModel.loading = false
        this.deleteModel.status = false
        if (res.data.code !== 0) return
        this.$Message.success(this.$t('delete_ok'))
        this.init()
      }).catch(err => this.deleteModel.loading = false)
    },
    //添加节点弹窗
    add () {
      this.title = this.$t('create_node')
      this.resetMap = ''
      this.resetMap1 = ''
      this.show_bg = true
      this.show_node = true
      this.show_Node = true
      const icon = require('../../../assets/images/mapIcon/unknown.png')
      this.gmap.markers = [{
        lng: 114.02597366,
        lat: 22.54605355,
        icon: icon,
        'lm_icon': L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
      }]
      this.gmap.center = {
        lng: 114.02597366,
        lat: 22.54605355,
      }
      this.$nextTick(() => {
        this.$refs['formValidate'].resetFields();
        this.formValidate = {
          source: 'WE',
          appEui: '0000000000000001',
          appKey: '98929b92f09e2daf676d646d0f61d250',
          isClassC: "2",
          relaxFCnt: "1",
          installationMargin: 0,
          adrInterval: 0,
          rx1DrOffset: 0,
          rxWindow: 'RX1',
          rxDelay: 0,
          rx2Dr: 0,
          status: "0",
          middle: {id: 'cfceaa44157f4afd902cbbeccf1bfe99'},
          type: {id: ''},
          vendor: {id: ''}
        }
      })
      
    },
    //编辑节点弹窗
    editNode (row) {
      this.resetMap = ''
      if(row.type) {
        this.changeNodeType(row.type.id)
      }else{
        row.type = {id: ''}
      }
      if(!row.middle) row.middle = {id: 'cfceaa44157f4afd902cbbeccf1bfe99'}
      if(!row.vendor) row.vendor = {id: ''}
      
      this.show_bg = true
      this.show_node = true
      this.show_Node = true
      this.title = this.$t('node_edit')
      if (this.language === 'zh-CN') {
        setTimeout(() => {
          this.formValidate = JSON.parse(JSON.stringify(row))
          const point = {
            lng: row.longitude ? parseFloat(row.longitude) : '',
            lat: row.latitude ? parseFloat(row.latitude) : '',
            icon: row.type.iconAddr ? require('../../../assets/images/mapIcon/' + row.type.iconAddr) : require('../../../assets/images/mapIcon/unknown.png')
          }
          this.resetMap1 = {
            lng: row.longitude ? parseFloat(row.longitude) : '',
            lat: row.latitude ? parseFloat(row.latitude) : '',
          }
          this.gmap.center = point
          this.gmap.markers = [point]
          this.$set(this.gmap.markers, 0, point)
        },0)
      }
      if (this.language === 'en-US') {
        this.formValidate = JSON.parse(JSON.stringify(row))
        const icon = row.type.iconAddr ? require('../../../assets/images/mapIcon/' + row.type.iconAddr) : require('../../../assets/images/mapIcon/unknown.png')
        const point = {
          lng: row.longitude ? parseFloat(row.longitude) : '',
          lat: row.latitude ? parseFloat(row.latitude) : '',
          icon: icon,
          'lm_icon': L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
        }
        //编辑时改获取当前节点的坐标并保存到resetMap1中
        this.resetMap1 = {
          lng: row.longitude ? parseFloat(row.longitude) : '',
          lat: row.latitude ? parseFloat(row.latitude) : '',
        }
        this.gmap.center = point
        this.gmap.markers = [point]
        this.$set(this.gmap.markers, 0, point)
      }
    },
    close () {
      this.$refs['formValidate'].resetFields();
      this.show_bg = false
      this.show_Node = false
      this.open_user = false
    },
    close1 () {
      this.open_user = false
    },
  },
  mounted () {
    this.$nextTick(()=>{
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
    })
    window.onresize = () => {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
    }
  },
  created() {
    this.$store.dispatch('getGroups')
    this.$store.dispatch('getNodeType')
    this.$store.dispatch('getMiddleWare')
    this.init()
  }
}
</script>
