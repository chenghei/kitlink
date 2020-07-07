<style lang="less" scoped src="./assignGroup.less"></style>
<template>
    <Row type="flex" class="content-body" style="flex-wrap:nowrap">
        <i-col class="content_left boxShadow">
            <div class="header">
                <span>{{$t('group_list1')}}</span>
                <div @click="add">
                    <img src="../../../assets/images/add18.svg">
                    {{$t('add')}}
                </div>
            </div>
            <div class="tree_out">
                <Table @on-row-click="getNode" ref="table" highlight-row :height="tableHeight" :columns="groupList.columns" :data="groupList.data"></Table>
                <div class="list_bottom" style="display: flex;justify-content: center;padding-right:0;">
                    <Page :total="groupList.total" show-elevator show-total @on-change="nextPage"></Page>
                </div>
                <Spin size="large" fix v-if="spinShow"></Spin>
            </div>
        </i-col>
        <i-col class="content_right boxShadow">
            <div class="header">
                <span>{{$t('lamp_list')}}</span>
                <div>
                    <div @click="assign">
                        <img src="../../../assets/images/add18.svg">
                        {{$t('assign')}}
                    </div>
                </div>
            </div>
            <Table ref="groupTable" :height="tableHeight + 60" :columns="selectList.columns" :data="selectList.data" @on-selection-change="selectLamp"></Table>
            <Spin size="large" fix v-if="spinShow"></Spin>
            <!-- <div class="list_bottom">
                <Page :total="1000" show-elevator show-total ></Page>
            </div> -->
        </i-col>
        <transition name="slide-fade">
            <div class="bg" v-if="show_bg" @click="close"></div>
        </transition>
        <transition name="detail-fade">
            <div class="add_warpper" v-if="show_map" v-show="show_Map">
                <div class="addlampMap boxShadow">
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
                <div class="add_detail">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="140">
                    <div class="add_title">
                        <img src="@/assets/images/node/close.svg" alt="close" @click="close">
                        <span>{{title}}</span>
                    </div>
                    <Row class="add_scroll">
                        <FormItem :label="$t('project')+'：'" prop="source" style="margin-top:20px">
                            <i-col style="width:200px;">
                                <i-select v-model="formValidate.proj.id" filterable>
                                    <i-option v-for="item in projects" :value="item.id" :key="item.id">{{item.name}}</i-option>
                                </i-select>
                            </i-col>
                        </FormItem>
                        <FormItem :label="$t('name')+'：'" prop="" >
                            <Input type="text" v-model="formValidate.name" style="width:200px" />
                        </FormItem>
                        <FormItem :label="$t('code')+'：'" prop="" >
                            <Input type="text" v-model="formValidate.code" style="width:200px" />
                        </FormItem>
                        <FormItem :label="$t('address')+'：'" prop="" >
                            <Input type="text" v-model="formValidate.address" style="width:400px" />
                        </FormItem>
                        <Row>
                            <i-col span="7">
                                <FormItem :label="$t('lng')+'：'" prop="longitude" >
                                    <Input type="text" v-model="formValidate.lng"   style="width:130px" />
                                </FormItem>
                            </i-col>
                            <i-col span="8">
                                <FormItem :label="$t('lat')+'：'" prop="" >
                                    <Input type="text" v-model="formValidate.lat" style="width:130px" />
                                </FormItem>
                            </i-col>
                            <i-col span="7" class="tip">{{$t('click_map_prompt')}}</i-col>
                        </Row>
                        <FormItem :label="$t('remark')+'：'" prop="">
                            <Input type="textarea" v-model="formValidate.remarks" style="width:400px" />
                        </FormItem>
                    </Row>
                    <div class="add_bottom" style="width: 42vw;min-width: 800px;">
                        <div class="add_button" @click="handleSubmit('formValidate')">{{$t('save')}}</div>
                    </div>
                    </Form>
                </div>
                <Spin size="large" fix v-if="groupList.spinShow"></Spin>
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
                <Button type="success" :loading="deleteModel.loading" @click="deleteGroup">{{$t('confirm')}}</Button>
                <Button @click="deleteModel.status = false">{{$t('cancel')}}</Button>
            </div>
        </Modal>
    </Row>
</template>
<script>
import GMapComponent from '_c/BMap/gatewayMap'
import { latLngBounds } from "leaflet"
import {LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
import { mapActions } from 'vuex'

export default {
    components: {
        GMapComponent,
        'l-map': LMap,
        'l-tile-layer': LTileLayer,
        'l-marker': LMarker,
        'l-popup': LPopup,
    },
    data () {
        return {
            gbounds: null,
            glmapOptions: {
                url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                zoomControl: false,
                attributionControl: false,
            },
            tableHeight: '',
            spinShow: false,
            groupList: {
                columns: [
                    {
                        title: this.$t('name'),
                        minWidth: 70,
                        render: (h, params) => {
                            return h('div', [
                                h('div',{
                                    style: {
                                        width:'250px',
                                        textOverflow:'ellipsis',
                                        overflow:'hidden',
                                    }
                                },params.row.code),
                                h('div', {
                                    style: {
                                        marginTop:'10px',
                                        textOverflow:'ellipsis',
                                        overflow:'hidden',
                                        fontWeight: 'bold'
                                    },
                                }, params.row.name),
                            ]);
                        }
                    },
                    {
                        title: this.$t('op'),
                        width:150,
                        render: (h, params) => {
                            let btn = []
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
                                        src: require("@/assets/images/node/right1.svg"),
                                    },
                                    style: {
                                        width:'16px',
                                        cursor:'pointer'
                                    },
                                    on: {
                                        click: () => {
                                            this.editLampGroup(params.row)
                                        }
                                    }
                                    })
                                ])
                            )
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
                                            this.deleteModel.id = params.row.id 
                                            this.delTitle = params.row.name
                                        }
                                    }
                                    })
                                ])
                            )
                            return h('div', btn)
                        }
                    }
                ],
                data: [],
                pageSize: 10,
                pageNo: 1,
                total: '',
                spinShow: false
            },
            lampList: {
                data: [],
            },
            selectList: {
                columns: [
                    {
                        type: 'selection',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: this.$t('group'),
                        render: (h, params) => {
                            if(params.row.lampGroup){
                                return h('span', params.row.lampGroup.name)
                            }
                        }
                    },
                    {
                        title: this.$t('name'),
                        key: 'name'
                    },
                    {
                        title: this.$t('code1'),
                        key: 'devEui'
                    },
                    {
                        title: this.$t('address'),
                        key: 'address'
                    },
                ],
                data: [],
                pageSize: 10,
                pageNo: 1,
                name: '',
                total: '',
                selected: []
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
                proj: {
                    id: ''
                },
                id: '',
                remarks: '',
                name: '',
                code: '',
                lng: '',
                lat: '',
                address: '',
            },
            ruleValidate: {},
            groupId: '',
            projects:[],
            language: this.$i18n.locale,
            show_bg: false,
            show_map: false,
            show_Map: false,
            assign_group: false,
            title: '',
            delTitle: '',
            deleteModel: {
                status: false,
                loading: false,
                id:''
            },
        }
    },
    methods: {
        ...mapActions([
            'getProjectAll',
            'getLampGroupsList',
            'saveLampGroups',
            'deleteLampGroups',
            'getLampGroupsNodes',
            'getNodeListAll',
            'editLampGroups'
        ]),
        init () {
            const data = {
                pageNo:this.groupList.pageNo
            }
            this.getLampGroupsList(data).then(res => {
                const data = res.data.rs.data
                data.list[0]._highlight =  true
                this.groupList.data = data.list
                this.groupList.total = data.count
                this.groupId = data.list[0].id
                this.getLampGroupsNodes({groupId:data.list[0].id}).then(res => {
                    this.lampList.data = res.data.rs.data
                    this.getNodeListAll({'type.id':200}).then(res => {
                        this.lampList.data.map(e => {
                            res.data.rs.data.map(k => {
                                if(k.id === e.id) {
                                    k._checked =  true
                                }
                            })
                        })
                        this.selectList.data = res.data.rs.data
                    })
                })
            })
        },
        nextPage (page) {
            this.groupList.pageNo = page
            this.init()
        },
        getNode (row) {
            this.groupId = row.id
            this.getLampGroupsNodes({groupId:row.id}).then(res => {
                const data = res.data.rs.data
                this.lampList.data = data
                this.getNodeListAll({'type.id':200}).then(res => {
                    this.lampList.data.map(e => {
                        res.data.rs.data.map(k => {
                            if(k.id === e.id) {
                                k._checked =  true
                            }
                        })
                    })
                    this.selectList.data = res.data.rs.data
                })
            })
        },
        editLampGroup (row) {
            this.title = this.$t('edit')
            this.show_bg = true
            this.show_Map = true
            this.show_map = true
            this.formValidate = JSON.parse(JSON.stringify(row))
            setTimeout(()=>{
                const icon = require('@/assets/images/mapIcon/icon-n-light-control.png')
                let point = {
                    lng: row.lng ? parseFloat(row.lng) : '',
                    lat: row.lat ? parseFloat(row.lat) : '',
                    icon: icon,
                    'lm_icon': L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
                }
                this.gmap.center = point
                this.gmap.markers = [point]
            },0)
        },
        selectLamp (row) {
            this.lampList.data = row
        },
        assign () {
            let devEUIs = []
            this.lampList.data.map(e => {
                devEUIs.push(e.devEui)
            })
            const data = {
                groupId: this.groupId,
                devEUIs:devEUIs.join(',')
            }
            this.spinShow = true
            this.editLampGroups(data).then(res => {
                this.spinShow = false
                this.init()
                if(res.data.code !== 0) return
                this.$Message.success(this.$t('save_ok'));
            }).catch(err => this.spinShow = false)
        },
        deleteGroup () {
            this.deleteModel.loading = true
            this.deleteLampGroups({groupId:this.deleteModel.id}).then(res => {
                if(res.data.code !== 0) return
                this.$Message.success(this.$t('save_ok'))
                this.init()
                this.deleteModel.status = false
                this.deleteModel.loading = false
            }).catch(err => this.deleteModel.loading = false)
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                this.groupList.spinShow = true
                if (valid) {
                    this.saveLampGroups(this.$refs[name].model).then(res => {
                        this.groupList.spinShow = false
                        if(res.data.code !== 0) return
                        this.init()
                        this.$Message.success(this.$t('save_ok'));
                        this.show_bg = false
                        this.show_Map = false
                    }).catch(err => this.groupList.spinShow = false)
                } else {
                    this.groupList.spinShow = false
                    this.$Message.error(this.$t('unvalid_param'));
                }
            })
        },
        add () {
            this.title = this.$t('add')
            this.show_bg = true
            this.show_Map = true
            this.show_map = true
            this.formValidate = {
                proj: {
                    id: ''
                },
                id: '',
                remarks: '',
                name: '',
                code: '',
                lng: '',
                lat: '',
                address: '',
            }
        },
        mapClick (e) {
            const icon =  require('@/assets/images/mapIcon/icon-n-light-control.png')
            let point = ''
            let bounds = []
            if (this.language === 'zh-CN') {
                point = e.point
            }
            if (this.language === 'en-US') {
                point = e.latlng
            }
            point.icon = icon
            point.lm_icon = L.icon({ iconUrl: icon, iconSize: [62, 78], iconAnchor: [32, 78], popupAnchor: [0, 0] }),
            bounds.push({ lat: parseFloat(point.lat), lng: parseFloat(point.lng) })
            this.gbounds = latLngBounds(bounds)
            this.gmap.center = point
            this.gmap.markers = [point]
            this.formValidate.lng = point.lng
            this.formValidate.lat = point.lat
            this.formValidate.address = e.address
        },
        close () {
            this.show_bg = false
            this.show_Map = false
            this.assign_group = false
        }
    },
    created() {
        this.getProjectAll().then(res => {
            this.projects = res.data.rs.data
        })
        this.init()
    },
    mounted () {
        this.$nextTick(()=>{
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 230
        })
        window.onresize = () => {
            this.tableHeight = window.innerHeight -                     this.$refs.table.$el.offsetTop - 230
        }
    }
}
</script>