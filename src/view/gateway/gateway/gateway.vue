<style lang="less" scoped src="./gateway.less"></style>
<template>
  <div id="gateway">
    <div class="node_list boxShadow">
      <div class="add" v-if="$route.meta.access.includes('1000.02.001')">
        <img src="../../../assets/images/node/add.svg" alt="add" @click="add">
      </div>
      <div class="title" v-if="$route.meta.access.includes('1000.02.001')">{{$t('add_gateway')}}</div>
      <div class="type">
        <Tooltip placement="top" :content="$t('imp')">
          <img src="../../../assets/images/node/download.svg" @click="upload" alt="download">
        </Tooltip>
        <Tooltip placement="top" :content="$t('exp')" style="margin:0 40px;">
          <img src="../../../assets/images/node/upload.svg" alt="upload"  @click='exportExcel'>
        </Tooltip>
        <Tooltip placement="top" :content="$t('migrate')" v-if="$route.meta.access.includes('1000.02.003')">
          <img src="../../../assets/images/node/open.svg" alt="open" @click="transfer">
        </Tooltip>
      </div>
      <div style="display:flex;" class="select_input">
        <i-input search :value.sync="gatewayList.name" :placeholder="$t('gateway_name_or_code')" autofocus @on-search="search"></i-input>
      </div>
      <Table ref="table" :loading="gatewayList.loading" :height="tableHeight" :columns="gatewayList.columns" :data="gatewayList.data" highlight-row @on-current-change="selectGateWay"></Table>
      <div class="list_bottom">
        <Page :total="gatewayList.total" :page-size="gatewayList.pageSize"  @on-change="nextPage" show-elevator show-total></Page>
      </div>
    </div>
    <!-- 地图 -->
    <div id="gatewayMap" class="boxShadow">
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
    <!-- 背景阴影 -->
    <transition name="slide-fade">
      <div class="bg" v-if="show_bg" @click="close"></div>
    </transition>
    <!-- 添加网关 -->
    <transition name="detail-fade">
      <div class="add_warpper"  v-if="show_gateway" v-show="show_Gateway"> 
        <div id="addGatewayMap">
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
        <div class="add_detail1">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="140">
          <div class="add_title">
            <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
            <span> {{title}} </span>
          </div>
          <Row class="add_scroll">
            <FormItem :label="$t('middleware')+'：'" prop="middle.id" style="margin-top:20px">
              <Row>
                <i-col span="12" style="width:200px;">
                    <i-select v-model="formValidate.middle.id" filterable clearable>
                        <i-option v-for="item in middleWare" :value="item.id" :key="item.id">{{ item.name }}</i-option>
                    </i-select>
                </i-col>
                <i-col span="12" class="tip"> {{$t('no_sure_no_modify')}}</i-col>
              </Row>
            </FormItem>
            <FormItem :label="$t('name')+'：'" prop="name">
                <Row>
                <i-col span="14">
                  <Input type="text" v-model="formValidate.name" style="width:400px"/>
                </i-col>
                </Row>
            </FormItem>
            <FormItem :label="$t('device_code')+'：'" prop="devEui" >
              <Input type="text" :disabled="title == $t('edit_gateway')" v-model="formValidate.devEui"  style="width:400px"/>
            </FormItem>
            <FormItem :label="$t('license')+'：'" prop="authCode" >
              <Input type="text" :disabled="title == $t('edit_gateway')" v-model="formValidate.authCode"  style="width:400px"/>
            </FormItem>
            <FormItem :label="$t('address')+'：'" prop="address" >
              <Input type="text" v-model="formValidate.address"  style="width:400px"/>
            </FormItem>
            <FormItem :label="$t('lng')+'：'" prop="longitude" >
              <Input type="text" v-model="formValidate.longitude"  style="width:200px"/>
            </FormItem>
            <FormItem :label="$t('lat')+'：'" prop="latitude" >
              <Input type="text" v-model="formValidate.latitude" style="width:200px"/>
            </FormItem>
            <FormItem :label="$t('remark')+'：'" prop="remarks">
              <i-col>
                <Input type="textarea" v-model="formValidate.remarks" style="width:400px"/>
              </i-col>
            </FormItem>
            <!-- 添加网关地图 -->
            <!-- <div id="addGatewayMap" ></div> -->
            
          </Row>
          <div class="add_bottom" style="width:42vw;min-width: 610px;">
            <div class="add_button" @click="handleSubmit('formValidate')">{{$t('save')}}</div>
          </div>
          <Spin size="large" fix v-if="spinShow"></Spin>
          </Form>
        </div>
      </div>
    </transition>
    <!-- 迁移网关 -->
    <transition name="width800-fade">
      <div class="add_detail" v-show="show_transfer">
        <Form ref="migrateInfo" :model="migrateInfo" :rules="migrateValidate"  label-position="top" >
        <div class="add_title">
          <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
          <span>{{$t('migrate_gateway')}}</span>
        </div>
        <Row class="add_scroll labelBlod">
          <FormItem :label="$t('target_user')+'：'"  prop="name" style="margin-top:20px">
            <Row>
              <i-col span="12" style="width:730px;">
                  <Input type="text" search v-model="migrateInfo.name" :placeholder="$t('target_user')" @on-focus='select_user' style="width:730px" readonly/>
              </i-col>
            </Row>
          </FormItem>
          <FormItem :label="$t('selected_file')+'：'"  prop="" >
            <Row>
              <Tag v-for="(item,i) in transferFile" :key="i" :name="item" closable @on-close="delTransferFile">{{item}}</Tag>
            </Row>
          </FormItem>
          <FormItem :label="$t('search_file')+'：'" prop="" >
            <Input type="text" search v-model="transferList.name" :placeholder="$t('file_name_or_code')" style="width:730px" @on-search="transferListSearch"/>
          </FormItem>
          <Table highlight-row :loading="transferList.loading" :height="500" ref="selection" :columns="transferList.columns" :data="transferList.data" @on-row-click="selectTransfer" :tooltip="true"></Table>
          <div class="list_bottom">
            <Page :total="transferList.total" :page-size="transferList.pageSize"  @on-change="transferListNextPage" show-elevator show-total></Page>
          </div>
        </Row>
        <div class="add_bottom">
          <div class="add_button" @click="migrateGate('migrateInfo')">{{$t('trans')}}</div>
        </div>
        </Form>
        <Spin size="large" fix v-if="migrateSpin"></Spin>
      </div>
    </transition>
    <!-- 导入网关 -->
    <transition name="width800-fade">
      <div class="add_detail" v-show="show_upload">
        <div class="add_title">
          <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
          <span>{{$t('import_gateway')}}</span>
        </div>
        <div class="add_scroll">
          <div class="uploadTitle" >
            <div>{{$t('import_file')}}：<span v-if="uploadFile != null">{{uploadFile.name}}</span> </div>
            <div>
              <span> <a :href="`${path}/p/static/gateway/import_tpl.xls`">{{$t('template_download')}}</a> </span>
              <span>（{{$t('provide_import_format')}}）</span>
            </div>
            </div>
            <Upload
              type="drag"
              ref="upload"
              :headers="fileDate"
              action="/p/a/rest-api/gateway/import"
              :before-upload="beforeUpload"
              :show-upload-list="false">
              <div class="content1">
                  <p class="selectFile">{{$t('select_file')}}</p>
                  <p>{{$t('drag_file')}}</p>
              </div>
            </Upload>
            <div style="padding:20px 30px;" v-if="uploadStatus.status">
              <div style="font-size: 16px;font-weight: bold;margin-bottom:20px">{{$t('import_result')}}：</div>
              <Table :columns="uploadList.columns" :data="uploadList.data"></Table>
            </div>
        </div>
        <div class="add_bottom">
          <div class="add_button" @click="toUpload">{{$t('imp')}}</div>
        </div>
        <Spin size="large" fix v-if="uploadStatus.uploadSpin"></Spin>
      </div>
    </transition>
    <!-- 面板 -->
    <transition name="width800-fade">
      <div class="width_800" v-if="open_panel">
        <Form ref="panelInfo" :model="panelInfo" :rules="panelValidate" :label-width="140">
          <div class="add_title">
            <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
            {{$t('control_panel')}}
          </div>
          <Row class="add_scroll">
            <div class="panel_title">{{$t('gw_detail')}}</div>
            <FormItem label="id：" prop="" style="margin-top:20px">
              <Input type="text" disabled v-model="panelInfo.id" style="width:400px"/>
            </FormItem>
            <FormItem label="name：" prop="name" style="margin-top:20px">
              <Input type="text"  v-model="panelInfo.name" style="width:400px"/>
            </FormItem>
            <FormItem label="gatewayEUI：" prop="" style="margin-top:20px">
              <Input type="text" disabled v-model="panelInfo.gatewayEUI" style="width:400px"/>
            </FormItem>
            <FormItem label="gatewaySeq：" prop="" style="margin-top:20px">
              <Input type="text" disabled v-model="panelInfo.gatewaySeq" style="width:400px"/>
            </FormItem>
            <FormItem label="onlineTime：" prop="" style="margin-top:20px">
              <Input type="text" disabled v-model="panelInfo.onlineTime" style="width:400px"/>
            </FormItem>
            <div class="panel_title" style="margin-bottom:30px">{{$t('gw_status')}}</div>
            <div style="padding:0 30px" class="wrapTable">
              <Table :columns="columns1" :height="400" :data="data1" :loading="panelLoading1"></Table>
            </div>
            <div class="panel_title" style="margin-bottom:30px">{{$t('gw_message')}}</div>
            <div style="padding:0 30px" class="wrapTd">
              <Table :height="400" :columns="columns2" :data="data2"  :loading="panelLoading2"></Table>
            </div>
          </Row>
          <div class="add_bottom">
            <div class="add_button" @click="panelSave('panelInfo')">{{$t('save')}}</div>
          </div>
        </Form>
        <Spin size="large" fix v-if="panelShow"></Spin>
      </div>
    </transition>
    <!-- 选择用户 -->
    <transition name="width400-fade">
        <div class="inner_400" v-show="open_user">
            <div class="add_title" >
                <img src="../../../assets/images/node/close.svg" alt="close" @click="close1">
                {{$t('select_user')}}
            </div>
            <Row class="add_scroll inner" style="padding:0 30px;">
                <Input search type="text"  style="width:340px;margin-top:20px" :placeholder="$t('input_key')" @on-search="searchOranization"/>
                <Tree :data="treeData" @on-select-change="selectOranization" style="margin-top:40px;height:50vh;overflow:auto"></Tree>
                <Row style="margin-top:20px;flex-direction: column;height:25vh;overflow:auto" type="flex"> 
                  <span style="margin-bottom:10px">{{$t('optional_users')}}：</span>
                  <div class="tags" v-for="(item,index) in oranUser.list" :key="index" :class="selectUser == index ? 'active tags' : 'tags'" @click="handleUser(item,index)">
                    <span>{{$t('name')}}：{{item.name}}</span>
                    <span>{{$t('dept')}}：{{item.office.name}}</span>
                  </div>
                </Row>
            </Row>
            <div class="add_bottom" style="width:410px;">
                <div class="add_button" @click="confirm">确定</div>
            </div>
            <Spin size="large" fix v-if="treeSpin"></Spin>
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
        <Button type="success" :loading="deleteModel.loading" @click="deleteGateWays">{{$t('confirm')}}</Button>
        <Button @click="deleteModel.status = false">{{$t('cancel')}}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import styleJson from '@/assets/js/styleJson'
import BMapComponent from '_c/BMap/BMapComponent'
import GMapComponent from '_c/BMap/gatewayMap'
import { mapGetters, mapActions } from 'vuex'
import { getToken, getHid, getUid, getSid  } from '@/libs/util'
import { deal, checkedArr, CharToHex, base64decode } from '@/libs/tools'
import config from '@/config'
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
      currentTsStatus:false,
      transferTs: [],
      currentTs: [],
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
      panelShow: false,
      panelLoading1: false,
      panelLoading2: false,
      path: config.assetsPatch,
      gatewayDevEui:'',
      tableHeight:null,
      tableHeight2:null,
      title: this.$t('add_gateway'),
      show_bg: false,
      show_gateway: false,
      show_Gateway: false,
      show_transfer: false,
      show_upload: false,
      open_panel: false,
      open_user: false,
      // 按名字导出文件
      selectName: '',
      // 导入文件
      uploadStatus: {
        uploadSpin:false,
        status: false,
      },
      fileDate:{
        uid:getUid(),
        authorization:getToken(),
        h:getHid()
      },
      uploadList: {
        columns:[
          {
            title: '序号',
            type: 'index',
            key: 'name',
            width:100
          },
          {
            title: 'devEui',
            key: 'devEui'
          },
          {
            title: 'authCode',
            key: 'authCode'
          },
        ],
        data:[]
      },
      uploadFile: null,
      gatewayList:{
        columns: [
          {
            title: this.$t('device'),
            key: 'name',
            render: (h,params) => {
              let offline = params.row.isoffline ? 'showRed' : ''
              return h('span',{
                style:{
                  color: offline === 'showRed' ? 'red' : '#1a1a1a'
                }
              }, params.row.name + (offline === 'showRed' ? '('+this.$t('offline')+')' : ''))
            }
          },
          {
            title: this.$t('op'),
            key: 'age',
            width:200,
            render: (h, params) => {
              let btn = []
              if(this.$route.meta.access.includes('1000.02.001')){
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
                          marginTop:'4px',
                          cursor:'pointer'
                      },
                      on: {
                        click: () => {
                          this.editGateWay(params.row)
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
                        marginTop:'4px',
                        cursor:'pointer'
                    },
                    on: {
                      click: () => {
                        this.panelLoading1 = true
                        this.panelLoading2 = true
                        this.panelInfo = {}
                        this.gatewayDevEui = params.row.devEui
                        this.show_bg = true
                        this.open_panel = true
                        this.gateWayPanel(params.row).then(res => {
                          this.panelShow = false
                          this.panelInfo = res.data.rs.data
                        })
                        this.data1 = [];
                        this.data2 = []
                        this.stats()
                        this.rx()
                      }
                    }
                  })
                ])
              )

              if(this.$route.meta.access.includes('1000.02.002')){
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
                        marginTop:'4px',
                        cursor:'pointer'
                      },
                      on: {
                        'click': () => { 
                          this.deleteModel.status = true
                          this.deleteModel.formValidate.id = params.row.id
                          this.delTitle = params.row.name
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
        markers: [{}],
        // 是否显示infoWindow, 开始必须为false
        show_type: 'N'
      },
      transferList:{
        columns: [
          {
            title: this.$t('owner'),
            key: 'creatorName',
            tooltip:true
          },
          {
            title: this.$t('name'),
            render: (h,params) => {
              let offline = params.row.isoffline ? 'showRed' : ''
              // this.transferTs.map(e => {
              //   if (e.payload.gateway_eui === params.row.devEui && e.payload.ts + 300000 < moment(new Date()).valueOf()) {
              //       offline = 'showRed'
              //   }
              // })
              return h('span',{
                style:{
                  color: offline === 'showRed' ? 'red' : '#1a1a1a'
                }
              }, params.row.name + (offline === 'showRed' ? '('+this.$t('offline')+')' : ''))
            },
            tooltip:true,
          },
          {
            title: this.$t('device_code'),
            key: 'devEui',
            tooltip:true
          }
        ],
        data:[],
        pageSize: 10,
        pageNo: 1,
        name: '',
        total: 0,
        loading: false
      },
      transferFile:[],
      gwIds:[],
      // 组织机构
      organ:[],
      treeData:[],
      oranUser: {
        list: [],
      },
      treeSpin: false,
      migrateSpin: false,
      targetUser:'',
      // 选中用户
      selectUser: -1,
      formValidate: {
        middle: {id: 'cfceaa44157f4afd902cbbeccf1bfe99'},
        remarks:''
      },
      ruleValidate: {
        name: [
          { required: true, message: this.$t('input_name1'), trigger:'blur' }
        ],
        devEui: [
          { required: true, message: this.$t('ple_fill_device_code'), trigger:'blur' }
        ],
        authCode: [
          { required: true, message: this.$t('ple_fill_authorization_code'), trigger:'blur' }
        ],
        'middle.id':[
          { required: true, message: this.$t('ple_select_middleware'), trigger:'change' }
        ],       
      },
      panelInfo:{},
      panelValidate:{
        name: [
          { required: true, message: this.$t('input_name1'), trigger:'blur' }
        ],
      },
      migrateInfo:{
        name:''
      },
      migrateValidate:{
        name: [
          { required: true, message: this.$t('ple_select_target_user'), trigger:'change'}
        ],
      },
      columns1: [
        {
            title: 'mac',
            key: 'mac',
        },
        {
            title: 'time',
            key: 'date',
        },
        {
            title: 'rxPacketsReceived',
            key: 'rx_packets_received',
        },
        {
            title: 'rxPacketsReceivedOK',
            key: 'rx_packets_received_ok',
        },
        {
            title: 'txPacketsEmitted',
            key: 'tx_packets_emitted',
        },
        {
            title: 'txPacketsReceived',
            key: 'tx_packets_received',
        }
    ],
    data1: [],
    columns2: [
        {
            title: 'phyPayload',
            key: 'phy_payload',
            align: 'left',
            width: 250,
            
        },
        {
            title: 'frequency',
            key: 'frequency',
            width: 130
        },
        {
            title: 'loRaSNR',
            key: 'lora_snr',
            width: 100
        },
        {
            title: 'mac',
            key: 'mac',
            width: 180
        },
        {
            title: 'rfChain',
            key: 'rfChain',
            width: 90
        },
        {
            title: 'rssi',
            key: 'rssi',
            width: 90
        },
        {
            title: 'size',
            key: 'size',
            width: 90
        },
        {
            title: 'time',
            key: 'date',
            width: 220
        },
        {
            title: 'timestamp',
            key: 'timestamp',
            width: 160
        }
    ],
    data2: [],
    stats_timeout: {},
    cnt: 0,
    spinShow: false,
    deleteModel: {
      status: false,
      loading: false,
      formValidate: {}
    },
    }
  },
  computed: {
    ...mapGetters([
      'middleWare',
      'organizationList'
    ])
  },
  methods: {
    ...mapActions([
      'getGateWayList',
      'saveGateWay',
      'deleteGateWay',
      'gateWayPanel',
      'getOrganizationUsers',
      'migrateGateWay',
      'gatewayMqtt',
      'gatewayUpload',
      'saveGatewayPanel',
      'getGatewayCurrent'
    ]),
    timeoutHander() {
      this.cnt++
      if(this.cnt === 2){
          this.cnt = 0
          
          this.stats_timeout = setTimeout(() => {
              this.stats()
              this.rx()
          }, 5000)
      }
    },
    stats () {
      let postData = {
        gateway_eui: this.gatewayDevEui,
        type: 'gateway',
        topic: 'stats',
        limit: 25
      }
      this.gatewayMqtt(postData).then(res => {
        let data = res.data.rs
        this.panelLoading1 = false
        this.data1 = []
        data.forEach(item => {
            let payload = item.payload
            this.data1.push(payload)
        })
        if(this.open_panel) this.timeoutHander()
      }).catch(err => this.panelLoading1 = false)
    },
    rx () {
      let postData1 = {
        gateway_eui: this.gatewayDevEui,
        type: 'gateway',
        topic: 'rx',
        limit: 25
      }
      this.gatewayMqtt(postData1).then(res => {
        let datas = res.data.rs
        this.panelLoading2 = false
        this.data2 = []
        datas.forEach(data => {
          data = data.payload
          let items = {}
          data.phy_payload = CharToHex(base64decode(data.phy_payload))
          data.phy_payload = data.phy_payload.replace(/\\x/g,'')
          items.phy_payload = data.phy_payload
          items.frequency = data.rxinfo.frequency
          items.lora_snr = data.rxinfo.lora_snr
          items.mac = data.rxinfo.mac
          items.rfChain = data.rxinfo.rf_chain
          items.rssi = data.rxinfo.rssi
          items.size = data.rxinfo.size
          items.date = data.rxinfo.date
          items.timestamp = data.rxinfo.timestamp
          this.data2.push(items)
          if(this.data2.length > 100) this.data2.pop(items)
        })
        if(this.open_panel) this.timeoutHander()
      }).catch(err => this.panelLoading2 = false)
    },
    init () {
      // this.gatewayList.loading = true
      const data = {
        pageSize: this.gatewayList.pageSize, 
        pageNo: this.gatewayList.pageNo, 
        name: this.gatewayList.name
      }
      this.currentTsStatus = false
      this.getGateWayList(data).then(res => {
        const data = res.data.rs
        this.selectName = this.gatewayList.name
        let gatewayEUIs = data.data.list.map(e => e.devEui)
        let markers = []
        let bounds = []
        
        this.getGatewayCurrent({gatewayEUIs:gatewayEUIs.join(',')}).then(res => {
          this.gatewayList.loading = false
          this.currentTs = res.data.rs.data
          this.currentTsStatus = true

          data.data.list.forEach(e => {
            if (e.latitude && e.latitude) {
              const icon = require('../../../assets/images/mapIcon/icon-n-gateway.png')
              markers.push({
                  lat: parseFloat(e.latitude),
                  lng: parseFloat(e.longitude),
                  icon: icon,
                  'lm_icon': L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
              })
              bounds.push({ lat: parseFloat(e.latitude), lng: parseFloat(e.longitude) })
            }

            let state = this.currentTs.find(v => v.payload.gateway_eui === e.devEui)
            e.isoffline = true
            if(state){  
                if (state.payload.ts + 300000 > moment(new Date()).valueOf()) e.isoffline = false
            }
          })       

          this.bounds = latLngBounds(bounds)
          this.map.markers = markers
  
          this.gatewayList.data = data.data.list
          this.gatewayList.total = data.data.count
        })
      })
    },
    transferListInit () {
      // this.transferList.loading = true
      const data = {
        pageSize: this.transferList.pageSize, 
        pageNo: this.transferList.pageNo, 
        name: this.transferList.name
      }
      this.getGateWayList(data).then(res => {
        const data = res.data.rs
        let gatewayEUIs = []
        data.data.list.map(e => {
          gatewayEUIs.push(e.devEui)
        })
        this.getGatewayCurrent({gatewayEUIs:gatewayEUIs.join(',')}).then(res => {
          this.transferList.loading = false
          this.transferTs = res.data.rs.data
          data.data.list.forEach(e => {
            let state = this.transferTs.find(v => v.payload.gateway_eui === e.devEui)
            e.isoffline = true
            if(state){  
                if (state.payload.ts + 300000 > moment(new Date()).valueOf()) e.isoffline = false
            }
          })
          this.transferList.data = data.data.list
          this.transferList.total = data.data.count
        })
      })
    },
    nextPage (page) {
      this.gatewayList.pageNo = page
      this.init()
    },
    transferListNextPage (page) {
      this.transferList.pageNo = page
      this.transferListInit()
    },
    search (value) {
      this.gatewayList.name = value
      this.init()
    },
    transferListSearch (value) {
      this.transferList.name = value
      this.transferListInit()
    },
    // 转移文件选择
    selectTransfer (row) {
      let select = this.transferFile.find(e => e == row.name)
      if (!select) {
        this.transferFile.push(row.name)
        this.gwIds.push(row.id)
      }
    },
    delTransferFile (event, name) {
      const index = this.transferFile.indexOf(name);
      this.transferFile.splice(index, 1);
      this.gwIds.splice(index,1)
    },
    //选择机构
    selectOranization(event) {
      this.office = {
        id: event[0].id,
        name: event[0].title
      }
      this.getOrganRole(event)
    },
    //根据机构获取角色
    getOrganRole(row) {
      const id = row[0].id
      this.treeSpin = true
      this.getOrganizationUsers({officeId: id}).then(res => {
        this.targetUser = ''
        this.selectUser  = -1
        this.treeSpin = false
        const data = res.data.rs.data
        this.oranUser.list = data
      }).catch(() => this.treeSpin = false)
    },
    // 选择用户
    handleUser (item,index) {
      this.selectUser = index
      this.targetUser = item
    },
    confirm () {
      if (this.targetUser) {
        this.migrateInfo.name = this.targetUser.name
        this.close1()
      } else {
        this.$Message.error(this.$t('ple_select_user'))
      }
    },
    //搜索机构
    searchOranization(value) {
      let arrs = []
      arrs = JSON.parse(JSON.stringify(this.organ))
      if(value === '') {
          this.treeData = arrs
          return
      }
      this.treeData = deal(arrs, node => node.title.indexOf(value) > -1 )
    },
    //迁移
    migrateGate (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if(this.gwIds.length ==0) return this.$Message.error(this.$t('ple_select_file'))
          let data = {
            userId:this.targetUser.id,
            gwIds: this.gwIds.join(',')
          }
          this.migrateSpin = true
          this.migrateGateWay(data).then(res => {
            this.migrateSpin = false
            if (res.data.code != 0) return
            this.selectUser = -1
            this.targetUser = ''
            this.transferFile = []
            this.gwIds = []
            this.transferListInit()
            this.$Message.success(this.$t('migrate_success'))
            this.$refs[name].resetFields();
          }).catch(err => this.migrateSpin = false)
        } else {
          this.$Message.error(this.$t('unvalid_param'))
        }
      })
    },
    // 选择网关
    selectGateWay (row) {
      let bounds = []
      const icon = require('../../../assets/images/mapIcon/icon-n-gateway.png')
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
      const icon = require('../../../assets/images/mapIcon/icon-n-gateway.png')
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
          this.saveGateWay(this.$refs[name].model).then(res => {
            this.spinShow = false
            if(res.data.code !== 0) return
            this.$Message.success(this.$t('save_ok'))
            this.init()
            this.show_bg = false
            this.show_Gateway = false
          }).catch(err => this.spinShow = false)
        } else {
          this.$Message.error(this.$t('unvalid_param'))
        }
      })
    },
    // 删除网关
    deleteGateWays (row) {
     this.deleteModel.loading = true
      this.deleteGateWay({gwId: this.deleteModel.formValidate.id}).then(res => {
        this.deleteModel.loading = false
        this.deleteModel.status = false
        if (res.data.code !== 0) return
        this.$Message.success(this.$t('delete_ok'))
        this.init()
      }).catch(err => this.deleteModel.loading = false)
    },
    // 添加网关弹窗
    add () {
      this.title = this.$t('add_gateway')
      this.show_bg = true
      this.show_gateway = true
      this.show_Gateway = true
      const icon = require('../../../assets/images/mapIcon/icon-n-gateway.png')
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
          middle: {id: 'cfceaa44157f4afd902cbbeccf1bfe99'},
        }
      })
    },
    // 编辑网关弹窗
    editGateWay (row) {
      this.title = this.$t('edit_gateway')
      this.show_bg = true
      this.show_gateway = true
      this.show_Gateway = true
      this.formValidate = JSON.parse(JSON.stringify(row))
      if (this.language === 'zh-CN') {
        this.$nextTick(() => {
          this.$refs['formValidate'].resetFields();
          setTimeout(()=>{
            const point = {
              lng: row.longitude ? parseFloat(row.longitude) : '',
              lat: row.latitude ? parseFloat(row.latitude) : '',
              icon: require('../../../assets/images/mapIcon/icon-n-gateway.png'),
            }
            this.gmap.center = point
            this.gmap.markers = [point]
            this.$set(this.gmap.markers, 0, point)
          },0)
        })
      }
      if (this.language === 'en-US') {
        this.$nextTick(()=>{
          this.$refs['formValidate'].resetFields();
        })
        const icon = require('../../../assets/images/mapIcon/icon-n-gateway.png')
        const point = {
          lng: row.longitude ? parseFloat(row.longitude) : '',
          lat: row.latitude ? parseFloat(row.latitude) : '',
          icon: icon,
          'lm_icon': L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
        }
        this.gmap.center = point
        this.gmap.markers = [point]
        this.$set(this.gmap.markers, 0, point)
      }
    },
    // 面板保存
    panelSave (name) {
      this.$refs[name].validate((valid) => {
          if (valid) {
            this.panelShow = true
            this.saveGatewayPanel(this.$refs[name].model).then(res => {
              this.panelShow = false
              if(res.data.code !== 0) return
              this.$Message.success(this.$t('save_ok'))
              this.init()
              this.close()
            }).catch(err => this.panelShow = false)
          } else {
            this.$Message.error(this.$t('unvalid_param'))
          }
      })
    },
    // 导入网关
    beforeUpload (file) {
      this.uploadFile = file
      return false
    },
    toUpload () {
      if (!this.uploadFile) {
         return this.$Message.error(this.$t('ple_select_file'))
      }
      this.uploadStatus.uploadSpin = true
      let file = new FormData()
      file.append('file',this.uploadFile)
      this.gatewayUpload(file).then(res => {
        this.uploadStatus.uploadSpin = false
        this.uploadStatus.status = true
        this.uploadList.data = res.data.rs.data
        if(res.data.code !== 0) return
        this.$Message.success(this.$t('import_success'))
      }).catch(err => this.uploadStatus.uploadSpin = false)
    },
    // 导出网关
    exportExcel () {
      window.location.href=`${this.path}/p/a/rest-api/gateway/export?name=${this.selectName}&token=${getToken()}&h=${getHid()}&uid=${getUid()}&sid=${getSid()}`
    },
    select_user () {
      this.open_user = true
    },
    close () {
      this.show_bg = false
      this.show_Gateway = false
      this.show_transfer = false
      this.show_upload = false
      this.open_panel = false
      this.open_user = false
      
      if(this.stats_timeout){
        clearTimeout(this.stats_timeout)
      }
    },
    close1 () {
      this.open_user = false
    },
    transfer () {
      this.show_bg = true
      this.show_transfer = true
      this.transferListInit()
      this.targetUser = ''
      this.transferFile = []
    },
    upload () {
      this.show_bg = true
      this.show_upload = true
    },
  },
  created () {
    this.$store.dispatch('getMiddleWare')
    this.$store.dispatch('getOrganizationLists')
    this.organ = this.organizationList
    this.treeData = this.organizationList
    this.init()
  },
  mounted () {
    this.$nextTick(()=>{
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
      this.tableHeight2 = window.innerHeight - this.$refs.table.$el.offsetTop 
    })
    window.onresize = () => {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
      this.tableHeight2 = window.innerHeight - this.$refs.table.$el.offsetTop 
    }
  },
}
</script>
