<style lang="less" scoped src="../index.less"></style>
<template>
    <div class="content-body">
        <div class="content boxShadow">
            <div class="header">
                <span>{{$t('project_list')}}</span>
                <div @click="add">
                    <img src="@/assets/images/add18.svg">
                    {{$t('project_add')}}
                </div>
            </div>
            <Row type="flex"  class="content_select">
                <div class="content_select_input">
                    <p>{{$t('name')}}：</p>
                    <Input type="text" v-model="projectList.search.name" style="width:200px"/>
                </div>
                <div class="content_select_input">
                    <p>{{$t('code1')}}：</p>
                    <Input type="text" v-model="projectList.search.code" style="width:200px"/>
                </div>
                <div class="content_select_input">
                    <p>{{$t('date')}}：</p>
                    <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="projectList.search.purDate"  style="width: 200px"></DatePicker>
                </div>
                <div class="content_select_input">
                <p>{{$t('status')}}：</p> 
                <i-col span="12" style="width:100px">
                    <i-select filterable clearable v-model="projectList.search.status">
                        <i-option value="0">{{$t('routine')}}</i-option>
                    </i-select>
                </i-col>
                </div>
                <div class="content_select_input">
                    <p>{{$t('address')}}：</p>
                    <Input type="text" v-model="projectList.search.address" style="width:200px"/>
                </div>
                <div class="select_button" @click="init">{{$t('query')}}</div>
            </Row>
            <Table ref="table" :height="tableHeight" :columns="projectList.columns" :data="projectList.data"></Table>
            <div class="list_bottom">
                <Page :total="projectList.total" :page-size="projectList.search.pageSize" @on-change="nextPage" show-elevator show-total></Page>
            </div>
        </div>
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
                            <FormItem :label="$t('name')+'：'" prop="name" style="margin-top:20px">
                                <Input type="text" v-model="formValidate.name" style="width:200px" />
                            </FormItem>
                            <FormItem :label="$t('code1')+'：'" prop="code" >
                                <Input type="text" v-model="formValidate.code" style="width:200px" />
                            </FormItem>
                            <FormItem :label="$t('date')+'：'" prop="purDate" >
                                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" :value="formValidate.purDate" @on-change="dateChange" style="width: 200px"></DatePicker>
                            </FormItem>
                            <FormItem :label="$t('design_life')+'：'" prop="lifeDesign" >
                                <Input type="number" style="width:100px" v-model="formValidate.lifeDesign" /> {{$t('hour')}}
                            </FormItem>
                            <FormItem :label="$t('rated_power')+'：'" prop="powerRated" >
                                <Input type="number" style="width:100px" v-model="formValidate.powerRated" /> {{$t('Watt')}}
                            </FormItem>
                            <FormItem :label="$t('status')+'：'" prop="status" style="margin-top:20px">
                                <i-col style="width:200px;">
                                    <i-select filterable v-model="formValidate.status">
                                        <i-option value="0">{{$t('routine')}}</i-option>
                                    </i-select>
                                </i-col>
                            </FormItem>
                            <FormItem :label="$t('address')+'：'" prop="address" >
                                <Input type="text" v-model="formValidate.address" style="width:400px" />
                            </FormItem>
                            <Row>
                                <i-col span="7">
                                    <FormItem :label="$t('lng')+'：'" prop="lng" >
                                        <Input type="text" v-model="formValidate.lng"   style="width:130px" />
                                    </FormItem>
                                </i-col>
                                <i-col span="8">
                                    <FormItem :label="$t('lat')+'：'" prop="lat" >
                                        <Input type="text" v-model="formValidate.lat" style="width:130px" />
                                    </FormItem>
                                </i-col>
                                <i-col span="7" class="tip">{{$t('click_map_prompt')}}</i-col>
                            </Row>
                            <FormItem :label="$t('remark')+'：'" prop="remarks">
                                <Input type="textarea" v-model="formValidate.remarks" style="width:400px" />
                            </FormItem>
                        </Row>
                        <div class="add_bottom" style="width: 42vw;min-width: 800px;">
                            <div class="add_button" @click="handleSubmit('formValidate')">{{$t('save')}}</div>
                        </div>
                    </Form>
                    <Spin size="large" fix v-if="spinShow"></Spin>
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
                <Button type="success" :loading="deleteModel.loading" @click="deleteProjects">{{$t('confirm')}}</Button>
                <Button @click="deleteModel.status = false">{{$t('cancel')}}</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import GMapComponent from '_c/BMap/gatewayMap'
import { latLngBounds } from 'leaflet'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'
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
            title: '',
            spinShow: false,
            gbounds: null,
            glmapOptions: {
                url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                zoomControl: false,
                attributionControl: false,
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
                status: 0,
            },
            ruleValidate: {
                name:[
                    { required: true, message: this.$t('enter_name_prompt'), trigger: 'blur' }
                ],
            },
            language: this.$i18n.locale,
            // 删除的信息名
            delTitle: '',
            tableHeight:'',
            projectList:{
                columns: [
                    {
                        title: this.$t('name'),
                        key: 'name'
                    },
                    {
                        title: this.$t('code1'),
                        key: 'code'
                    },
                    {
                        title: this.$t('ele_price'),
                        key: 'powerFee'
                    },
                    {
                        title: this.$t('rated_power'),
                        key: 'powerRated'
                    },
                    {
                        title: this.$t('status'),
                        key: 'status'
                    },
                    {
                        title: this.$t('remark'),
                        key: 'remarks'
                    },
                    {
                        title: this.$t('op'),
                        width: 150,
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
                                            this.title = this.$t('project_edit')
                                            this.show_bg = true
                                            this.show_map = true
                                            this.show_Map = true
                                            this.formValidate = params.row
                                            setTimeout(() => {
                                                this.mapClick({
                                                    point: {
                                                        lng: params.row.lng,
                                                        lat: params.row.lat,
                                                    },
                                                    address: params.row.address
                                                })
                                            }, 0)
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
                                            this.deleteModel.formValidate = params.row
                                            this.deleteModel.status = true
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
                search: {
                    name: '',
                    code: '',
                    purDate: '',
                    status: '',
                    address: '',
                    pageSize: 10,
                    pageNo:1
                },
                total: 0
            },
            deleteModel: {
                status: false,
                loading: false,
                formValidate: {}
            },
            show_bg: false,
            show_map: false,
            show_Map: false,
        }
    },
    methods: {
        ...mapActions([
            'getProjectList',
            'saveProject',
            'deleteProject'
        ]),
        init() {
            this.getProjectList(this.projectList.search).then(res => {
                const data = res.data.rs.data
                this.projectList.data = data.list
                this.projectList.total = data.count
            })
        },
        nextPage (page) {
            this.projectList.search.pageNo = page
            this.init()
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
        dateChange(event) {
            this.formValidate.purDate = event
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.spinShow = true
                    this.saveProject(this.$refs[name].model).then(result => {
                        this.spinShow = false
                        this.init()
                        if (result.data.code !== 0) return
                        this.close()
                        this.$Message.success(this.$t('save_ok'))
                    }).catch(err => {
                        this.spinShow = false
                        this.$Message.error(err)
                    })
                } else {
                    this.$Message.error(this.$t('unvalid_format'))
                }
            })
        },
        deleteProjects() {
            this.deleteModel.loading = true
            this.deleteProject({projectId: this.deleteModel.formValidate.id}).then(res => {
                this.deleteModel.loading = false
                this.deleteModel.status = false
                if (res.data.code !== 0) return
                this.$Message.success(this.$t('delete_ok'))
                this.init()
            }).catch(err => this.deleteModel.loading = false)
        },
        add () {
            this.title = this.$t('project_add')
            this.show_bg = true
            this.show_map = true
            this.show_Map = true
        },
        close () {
            this.show_bg = false
            this.show_Map = false
        }
    },
    mounted () {
        this.init()
        this.$nextTick(()=>{
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
        })
        window.onresize = () => {
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
        }
    },
}
</script>