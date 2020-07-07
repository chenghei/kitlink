<style lang="less" scoped src="./main.less"></style>
<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="160" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <side-menu accordion ref="sideMenu" :active-name="$route.meta.active" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <router-link to="/index" class="logo-con">
          <img v-show="!collapsed" :src="maxLogo" key="max-logo" style="margin:30px auto;"/>
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
        </router-link>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <!-- <img src="../../assets/images/notice.svg" alt="notice" style="margin:21px 0 0 15px; cursor:pointer" @click="haveNotice">
          <div style="width:14px;height:14px;border-radius:50%;background:#FF0000;line-height:14px;display:flex;justify-content: center;color:#FFF;position:fixed;right:38px;top:30px;cursor:pointer" @click="haveNotice">3</div> -->
          <Badge :count="alarmCounts" :offset="[39,-5]">
            <div @click="haveNotice" style="cursor:pointer;margin-left:10px">
              <Icon custom="ivu-icon-iconfont icon-notice" style="font-family: 'iconfont';color:#1a1a1a" size="25" />
            </div>
              
          </Badge>
          <language v-if="$config.useI18n" @on-lang-change="setLocal" style="margin-left: 20px;" :lang="local"/>
          <error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader" :has-read="hasReadErrorPage" :count="errorCount"></error-store>
          <fullscreen v-model="isFullscreen" style="margin-left: 20px;"/>
          <user :user-avator="userAvator" v-on:personal="configuration" v-on:password="modifyPassword"/>
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <!-- <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div> -->
          <Content class="content-wrapper">
            <!-- <keep-alive :include="cacheList"> -->
              <router-view/>
            <!-- </keep-alive> -->
          </Content>
        </Layout>
      </Content>
    </Layout>
    <transition name="slide-fade">
      <div class="bg" v-if="show" @click="showNotice"></div>
    </transition>
    <transition name="slide-fade">
      <div class="bg" v-if="show1" @click="showNotice1"></div>
    </transition>
    <!-- 告警消息 -->
    <transition name="detail-fade">
      <div class="noticeDetail" v-show="show_Notice" v-if="show_notice">
        <!-- 地图 -->
        <div id="noticeMap" class="boxShadow">
          <!-- leaflet map -->
          <l-map ref="leaflet_map1" v-if="language === 'en-US'" :options="lmapOptions" :bounds="bounds" style="width:100%;height:100%;" :zoom="map.zoom" :center="map.center" :minZoom="4">
            <l-tile-layer :url="lmapOptions.url"></l-tile-layer>
            <l-marker v-for="item in map.markers" :icon="item.lm_icon" :lat-lng="item" :key="item.index" :zIndexOffset="item.zIndexOffset" @click="lfmap_marker_click(item)">
            </l-marker>
          </l-map>

          <n-map-component 
            v-if="language === 'zh-CN'"
            :center="map.center"
            :init="map.init"
            :zoom="map.zoom"
            :markers="map.markers"
            :show-type="map.show_type"
            :type="map.type"
            :auto-zoom="map.autoZoom"
            @marker-click="marker_click"
            :is-clusterer="false"
            style="width:100%;height:100%;"
          >
          </n-map-component>
        </div>
        <div class="noticeList">
          <div class="close_title">
            <img src="../../assets/images/node/close.svg" alt="close" @click="showNotice1">
          </div>
          <div class="noticeInfo_out">
            <div class="noticeInfo" v-for="(item, index) in alarmList" :key="index" @click="openMessage(item)" :style="{'background':(item.level == '1' ? '#0CCD52' : (item.level == '2' ? '#25CBDB' : (item.level == '3' ? '#11A9E3' : (item.level == '4' ? '#FF850B' : '#FF3333' ))))}">
              <div style="width:75%" class="info_detail">
                <div>{{item.name}}</div>
                <div>{{$t('alarm_type')}}：{{item.typeName}}（{{item.ruleName}}）</div>
                <div>{{$t('device_addr')}}：{{item.address}}</div>
                <div>{{$t('device_id')}}：{{item.devEui}}</div>
                <div>{{item.time}}</div>
              </div>
              <div style="width:25%;display:flex;justify-content: center;
          align-items: center;">
                <Badge :count="item.counts" type="warning"></Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 个人配置 -->
    <transition name="account-fade">
      <div class="add_detail" v-if="personalConfig">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="155">
        <div class="add_title">
          <img src="../../assets/images/node/close.svg" alt="close" @click="showNotice">
          <span>{{$t('personal')}}</span>
        </div>
        <Row class="add_scroll">
          <div class="avator">
            <div class="avator_out">
              <img :src="uploadImg.url ? uploadImg.url : `${path}/p/a/rest-api/files/download?filePath=${userInfo.photo}`" >
            </div>
          </div>
          <FormItem label="" prop="" style="margin-top:20px">
            <Row>
              <i-col span="7" offset="5"> 
              <Upload 
                action="//jsonplaceholder.typicode.com/posts/" 
                :before-upload="handleBeforeUpload"
                :headers="fileDate"
                :show-upload-list="false"
                >
                <div class="select_ava">
                  <img src="../../assets/images/uploadavator.svg">
                  {{$t('upload')}}
                </div>
              </Upload>
              </i-col>
              <i-col span="8"> 
                <div class="select_ava" @click="clearPhoto">
                  <img src="../../assets/images/clearavator.svg">
                  <span>{{$t('delete')}}</span>
                </div>
              </i-col>
            </Row>
          </FormItem>
          <FormItem :label="$t('name')+'：'" prop="name" style="margin-top:20px">
            <Row>
              <Input type="text" v-model="formValidate.name" style="width:200px"/>
            </Row>
          </FormItem>
          <FormItem :label="$t('account')+'：'" prop="loginName">
            <Row>
            <i-col span="14">
              <Input type="text" v-model="formValidate.loginName" style="width:200px"/>
            </i-col>
            </Row>
          </FormItem>
          <FormItem :label="$t('email')+'：'" prop="email" >
            <Input type="text" v-model="formValidate.email"  style="width:200px"/>
          </FormItem>
          <FormItem :label="$t('phone')+'：'" prop="phone" >
            <Input type="text"  v-model="formValidate.phone"   style="width:200px"/>
          </FormItem>
          <FormItem :label="$t('mobile')+'：'" prop="mobile" style="margin-top:20px">
            <Row>
              <Input type="text" v-model="formValidate.mobile" style="width:200px"/>
            </Row>
          </FormItem>
          <FormItem :label="$t('language')+'：'" prop="language" style="margin-top:20px">
            <Row>
              <i-col span="12" style="width:200px;">
                <i-select v-model="formValidate.language" filterable>
                  <i-option value="CN">中文</i-option>
                  <i-option value="EN">英文</i-option>
                </i-select>
              </i-col>
            </Row>
          </FormItem>
          <FormItem :label="$t('alert_level')+'：'" prop="alarmLevel" style="margin-top:20px">
            <Row>
              <i-col span="11" style="width:200px;">
                <i-select v-model="formValidate.alarmLevel" filterable>
                  <i-option value="1">1</i-option>
                  <i-option value="2">2</i-option>
                  <i-option value="3">3</i-option>
                  <i-option value="4">4</i-option>
                  <i-option value="5">5</i-option>
                </i-select>
              </i-col>
              <i-col span="13" class="tip"> {{$t('warning_level_desc')}}</i-col>
            </Row>
          </FormItem>
          <FormItem :label="$t('remark')+'：'" prop="remarks">
            <i-col>
              <Input type="textarea" v-model="formValidate.remarks" style="width:400px"/>
            </i-col>
          </FormItem>
          <FormItem :label="$t('acoustooptic_warning')+'：'" prop="alarm" >
            <CheckboxGroup v-model="alarm">
              <Checkbox v-for="item in typeNodes" :key="item.id" :label="item.devEui">{{item.devEui}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem :label="$t('last_login')+'：'" prop="" >
            IP:{{formValidate.oldLoginIp}} {{$t('time')}}：{{formValidate.oldLoginDate}}
          </FormItem>
          <FormItem :label="$t('source')+'：'" prop="source.type" style="margin-top:20px">
            <Row>
              <i-col span="12" style="width:200px;">
                <i-select v-model="formValidate.source.type" filterable>
                  <i-option value="WE">{{$t('we')}}</i-option>
                  <i-option value="AL">{{$t('al')}}</i-option>
                  <!-- <i-option value="TE">{{$t('te')}}</i-option> -->
                </i-select>
              </i-col>
            </Row>
          </FormItem>
          <div v-if="formValidate.source.type && formValidate.source.type !== 'WE'">
            <FormItem label="AccessKey：" prop="source.accessKey">
              <i-col>
                <Input type="text" v-model="formValidate.source.accessKey" style="width:200px"/>
              </i-col>
            </FormItem>
            <FormItem label="AccessSecret：" prop="source.accessSecret">
              <i-col>
                <Input type="text" v-model="formValidate.source.accessSecret" style="width:200px"/>
              </i-col>
            </FormItem>
            <FormItem label="Region Id：" prop="source.regionId">
              <i-col>
                <Input type="text" v-model="formValidate.source.regionId" style="width:200px"/>
              </i-col>
            </FormItem>
            <FormItem label="Uid：" prop="source.uid">
              <i-col>
                <Input type="text" v-model="formValidate.source.uid" style="width:200px"/>
              </i-col>
            </FormItem>
            <FormItem :label="$t('status')+'：'" prop="source.status">
              <i-col>
                <i-select v-model="formValidate.source.status" style="width:200px;" filterable>
                    <i-option value="0">{{$t('normal')}}</i-option>
                    <i-option value="1">{{$t('close')}}</i-option>
                  </i-select>
              </i-col>
            </FormItem>
          </div>
        </Row>
        <div class="add_bottom">
          <div class="add_button" @click="handleSubmit('formValidate')">{{$t('save')}}</div>
        </div>
        <Spin size="large" fix v-if="spinShow"></Spin>
        </Form>
      </div>
    </transition>
    <!-- 修改密码 -->
    <transition name="account-fade">
      <div class="add_detail" v-if="updatePassword">
        <Form ref="formValidate1" :model="formValidate1" :rules="ruleValidate1" :label-width="140">
          <div class="add_title">
            <img src="../../assets/images/node/close.svg" alt="close" @click="showNotice">
            <span>{{$t('change_password')}}</span>
          </div>
          <Row class="add_scroll">
          <FormItem :label="$t('old_password')+'：'" prop="oldPwd" style="margin-top:20px">
            <Input type="password" v-model="formValidate1.oldPwd"  style="width:400px"/>
          </FormItem>
          <FormItem :label="$t('new_password')+'：'" prop="newPwd" >
            <Input type="password" v-model="formValidate1.newPwd" style="width:400px"/>
          </FormItem>
          <FormItem :label="$t('cfm_password')+'：'" prop="confirmPwd" style="margin-top:20px">
            <Row>
              <Input type="password" v-model="formValidate1.confirmPwd" style="width:400px"/>
            </Row>
          </FormItem>
        </Row>
          <div class="add_bottom">
            <div class="add_button" @click="pwdSubmit('formValidate1')">{{$t('save')}}</div>
          </div>
          <Spin size="large" fix v-if="pwdSpinShow"></Spin>
        </Form>
      </div>
    </transition>
    <AlarmDetail :showModel="showModel" :modelList="modelList" @change-model="changeModel" @handle-alarm="handleAlarm"></AlarmDetail>
  </Layout>
</template>
<script>
import styleJson from '@/assets/js/styleJson'
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import User from './components/user'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, getNextRoute, routeEqual, getToken, getHid, getUid, localRead } from '@/libs/util'
import minLogo from '@/assets/images/logo-min.jpg'
import maxLogo from '@/assets/images/logo.png'
import NMapComponent from '../BMap/noticeMap'
import AlarmDetail from '_c/alarmDetail/alarmDetail'
import config from '@/config'
import { latLngBounds } from "leaflet"
import {LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'

export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Language,
    Fullscreen,
    User,
    NMapComponent,
    AlarmDetail,
    'l-map': LMap,
    'l-tile-layer': LTileLayer,
    'l-marker': LMarker,
    'l-popup': LPopup,
  },
  data () {
    const validatePass = (rule, value, callback) => {
        if (!value) {
            callback(new Error(this.$t('input_password')))
        }else{
            if (this.formValidate1.confirmPwd !== '') {
            // 对第二个密码框单独验证
            this.$refs.formValidate1.validateField('confirmPwd')
            }
            callback()
        }
    }

    const validatePassCheck = (rule, value, callback) => {
        if (!value) {
            callback(new Error(this.$t('input_password_again')))
        } else if (value !== this.formValidate1.newPwd) {
            callback(new Error(this.$t('inconsistent_password')))
        } else {
            callback()
        }
    }
    return {
      language: this.$i18n.locale,
      bounds: null,
      lmapOptions: {
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        zoomControl: false,
        attributionControl: false,
      },
      path: config.assetsPatch,
      fileDate: {
        uid:getUid(),
        authorization:getToken(),
        h:getHid()
      },
      showModel: false,
      modelList: {},
      uploadImg:{
        url: ''
      },
      alarmColor: '',
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false,
      show: false,
      show1: false,
      personalConfig: false,
      show_notice: false,
      show_Notice: false,
      updatePassword: false,
      formValidate: {
        name:'',
        select:''
      },
      ruleValidate: {},
      formValidate1: {
        oldPwd: '',
        newPwd: '',
        confirmPwd: ''
      },
      ruleValidate1: {
        oldPwd:[
          { required: true, message: this.$t('old_password_tips'), trigger:'blur' }
        ],
        newPwd:[
          { required: true, validator: validatePass, trigger:'blur' }
        ],
        confirmPwd:[
          { required: true, validator: validatePassCheck, trigger:'blur' }
        ],
      },
      nodes: [],
      alarm: [],
      spinShow: false,
      pwdSpinShow: false,
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
        markers: [{lng: 108.93,
          lat: 34.27}],
        // 是否显示infoWindow, 开始必须为false
        show_type: 'N'
      },
      alarmList: [],
      markers: [],
      alarmTimeOut: {},
      alarmCounts: 0,
      file: {}
    }
  },
  computed: {
    ...mapGetters([
      'errorCount',
      'userInfo',
      'typeNodes'
    ]),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvator () {
      return this.$store.state.user.avatorImgPath
    },
    cacheList () {
      return this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
    },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setUserPhoto',
      'setAlarmList',
      'handleLogOut'
    ]),
    ...mapActions([
      'personalSettings',
      'changePassword',
      'getAlarmNodesInfo',
      'uploadHeader'
    ]),
    mapClick (e) {
      const point = e.point 
    },
    //获取告警信息
    getAlarm() {
      this.getAlarmNodesInfo().then(res => {
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
              ruleId: item.nodeAlertMsg.rule.id,
              ruleName: item.nodeAlertMsg.rule.name,
              id:item.id,
              fport: item.fport,
              sequence: [item.nodeAlertMsg.sequence],
              time: moment(item.nodeAlertMsg.ts).format('YYYY-MM-DD HH:mm:ss'),
              counts: 1,
            }
            groups.push(newGroup)
          }
          return groups
        }, []).sort((a, b) => {return (b.level - a.level)})
        this.alarmCounts = this.alarmList.length
        //地图显示告警
        let bounds = []
        this.markers = this.alarmList.map(v => {
          const icon = require('../../assets/images/mapIcon/' + v.iconAddr.substring(0,v.iconAddr.length-4) + '-alarm.png')
          if(v.latitude && v.longitude) {
            bounds.push({ lat: parseFloat(v.latitude), lng: parseFloat(v.longitude) })
          }
          return {
            lat: parseFloat(v.latitude),
            lng: parseFloat(v.longitude),
            latitude:parseFloat(v.latitude),
            longitude: parseFloat(v.longitude),
            sequence: v.sequence,
            ts: v.nodeAlertMsg.ts,
            address: v.address,
            name: v.name,
            typeName: v.typeName,
            devEui: v.devEui,
            counts: v.counts,
            ruleName: v.nodeAlertMsg.rule.name,
            ruleId: v.ruleId,
            typeId:v.fport,
            fport:v.fport,
            icon: icon,
            'lm_icon': L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
            level: v.level,
            iconAddr: v.iconAddr,
            done_type: 1,
            id: v.id
          }
        })
        this.bounds = latLngBounds(bounds)
        this.setAlarmList(this.markers.filter(v => v.lat && v.lng))
        if(this.markers.length > 0) {
          let level = this.markers.find(e => e.level >= this.userInfo.alarmLevel)
          if(level){
            this.show1 = true
            this.show_notice = true
            this.show_Notice = true
            setTimeout(() => {
              this.map.markers = this.markers
            }, 0);
          }
        } else {
          this.show1 = false
          this.show_Notice = false
        }
        //暂用，定时查询告警，后期改长链接
        this.timeTask()
      }).catch(err => this.timeTask())
    },
    //定时任务
    timeTask() {
      this.alarmTimeOut = setTimeout(() => {
        this.getAlarm()
      }, 5 * 1000)
    },
    // 处理告警
    handleAlarm() {
      this.markers = []
      this.show_notice = false
      this.show_Notice = false
      this.show1 = false
    },
    marker_click (marks) {
      this.showModel = true
      this.modelList = marks
    },
    lfmap_marker_click (marks) {
      this.$nextTick(() => { this.$refs.leaflet_map1.mapObject.closePopup() })
      this.showModel = true
      this.modelList = marks
    },
    handleBeforeUpload (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.uploadImg = {
          url: reader.result,
          file,
        };
      };
      this.file = file
      return false
    },
    clearPhoto () {
      this.uploadImg.url = ''
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let data = new FormData()
          data.append('file', this.file)
          this.spinShow = true
          this.$refs[name].model.alarm = this.alarm.join(',')
          if(this.uploadImg.url){
            this.uploadHeader(data).then(res => {
              if(this.formValidate.source.type === "WE"){
                this.formValidate.source.accessKey = ""
                this.formValidate.source.accessSecret = ""
                this.formValidate.source.regionId = ""
                this.formValidate.source.uid = ""
                this.formValidate.source.status = ""
              }
              this.$refs[name].model.photo = res.data.rs.data
              this.personalSettings(this.$refs[name].model).then(res => {
                this.spinShow = false
                if (res.data.code !== 0) return
                localStorage.removeItem('local')
                this.$Message.success(this.$t('save_ok'))
                this.showNotice()
                this.$router.go(0);
              }).catch(err => this.spinShow = false)
            })
          } else{
            if(this.formValidate.source.type === "WE"){
              this.formValidate.source.accessKey = ""
              this.formValidate.source.accessSecret = ""
              this.formValidate.source.regionId = ""
              this.formValidate.source.uid = ""
              this.formValidate.source.status = ""
            }
            this.personalSettings(this.$refs[name].model).then(res => {
              this.spinShow = false
              if (res.data.code !== 0) return
              localStorage.removeItem('local')
              this.$Message.success(this.$t('save_ok'))
              this.showNotice()
              this.$router.go(0);
            }).catch(err => this.spinShow = false)
          }
        } else {
          this.$Message.error(this.$t('unvalid_param'))
        }
      })
    },
    pwdSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.pwdSpinShow = true
          let data ={
            oldPwd:this.$refs[name].model.oldPwd,
            newPwd:this.$refs[name].model.newPwd
          }
          this.changePassword(data).then(res => {
            this.pwdSpinShow = false
            if ( res.data.code == 0) {
              this.$Message.success(this.$t('save_ok'))
              this.showNotice()
              this.$store.dispatch('handleLogOut').then(res => {
                window.location = '/login'
              })
            }
            
          }).catch(err => this.pwdSpinShow = false)
        } else {
          this.$Message.error(this.$t('unvalid_param'))
        }
      })
    },
    configuration (data) {
      this.show = true
      this.personalConfig = data
    },
    modifyPassword (data) {
      this.formValidate1 = {
        oldPwd: '',
        newPwd: '',
        confirmPwd: ''
      },
      this.show = true
      this.updatePassword = data
    },
    showNotice () {
      this.show = false
      this.personalConfig = false
      this.updatePassword = false
    },
    showNotice1 () {
      this.show1 = false
      this.show_Notice = false
    },
    haveNotice () {
      this.show1 = true
      this.show_notice = true
      this.show_Notice = true
      this.show = false
      this.personalConfig = false
      this.updatePassword = false
      setTimeout(() => {
        this.map.markers = this.markers
      }, 0);
    },
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      if (type === 'all') {
        this.turnToPage(this.$config.homeName)
      } else if (routeEqual(this.$route, route)) {
        if (type !== 'others') {
          const nextRoute = getNextRoute(this.tagNavList, route)
          this.$router.push(nextRoute)
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    },
    openMessage (row) {
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
    },
    changeModel (state,refresh) {
      this.showModel = state
      if(refresh) {
        clearTimeout(this.alarmTimeOut)
        this.getAlarm()
      }
    },
  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  beforeDestroy() {
    clearTimeout(this.alarmTimeOut)
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.addTag({
      route: this.$store.state.app.homeRoute
    })
    this.setBreadCrumb(this.$route)
    
    // 设置初始语言
    const lang = localRead('local')
    if(!lang) {
      this.$i18n.locale = this.userInfo.language == 'CN' ? 'zh-CN' :'en-US'
    }else{
      this.$i18n.locale = lang
    }
    this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    // if (!this.tagNavList.find(item => item.name === this.$route.name)) {
    //   this.$router.push({
    //     name: this.$config.homeName
    //   })
    // }
    this.formValidate = {
      source: {
        type: '',
        accessKey: '',
        accessSecret: '',
        regionId: '',
        uid: '',
        status: 0
      },
      ...this.userInfo
    }
    this.alarm = this.userInfo.alarm.split(',')
    this.getAlarm()
  },
  created() {
    this.$store.dispatch('searchByType', {typeId: 500})
  }
}
</script>
