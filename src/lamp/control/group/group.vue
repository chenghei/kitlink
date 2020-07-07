<style lang="less" scoped src="./group.less"></style>
<template>
    <Row type="flex" class="content-body">
        <i-col class="content_left boxShadow">
            <div class="header">
                    <span>{{$t('plan_list')+'（'+$t('day1')+')'}}</span>
                </div>
                <div class="tree_out">
                    <Table highlight-row ref="table" :height="tableHeight" :columns="planList.columns" :data="planList.data" @on-row-click="getGroup"></Table>
                    <div class="list_bottom" style="display: flex;justify-content: center;padding-right:0;">
                        <Page :total="planList.total" show-elevator show-total ></Page>
                    </div>
                </div>
                <Spin size="large" fix v-if="assignSpin"></Spin>
        </i-col>
        <i-col class="content_right boxShadow">
            <div class="header">
                <span>{{$t('plan_detail')}}</span>
                <div>
                    <div style="margin-right:40px" @click="add">
                        <img src="../../../assets/images/add18.svg">
                        {{$t('create')}}
                    </div>
                    <div @click="assign">
                        <img src="../../../assets/images/add18.svg">
                        {{$t('assign')}}
                    </div>
                </div>
            </div>
            <div id="lampChart" :style="{width: '100%', height: '200px'}"></div>
            <Table ref="groupTable" :height="groupHeight" :columns="groupList.columns" :data="groupList.data" @on-selection-change="selectLamp"></Table>
            <Spin size="large" fix v-if="assignSpin"></Spin>
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
                        <span>{{$t('create')}}</span>
                    </div>
                    <Row class="add_scroll">
                        <FormItem :label="$t('project')+'：'" prop="" style="margin-top:20px">
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
                                <FormItem :label="$t('lat')+'：'" prop="latitude" >
                                    <Input type="text" v-model="formValidate.lat" style="width:130px" />
                                </FormItem>
                            </i-col>
                            <i-col span="7" class="tip">{{$t('click_map_prompt')}}</i-col>
                        </Row>
                        <FormItem :label="$t('remark')+'：'" prop="">
                            <Input v-model="formValidate.remarks" type="textarea" style="width:400px" />
                        </FormItem>
                    </Row>
                    <div class="add_bottom" style="width: 42vw;min-width: 800px;">
                        <div class="add_button" @click="handleSubmit('formValidate')">{{$t('save')}}</div>
                    </div>
                    </Form>
                </div>
                <Spin size="large" fix v-if="spinShow"></Spin>
            </div>
        </transition>
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
            groupHeight: '',
            planList: {
                columns: [
                    {
                        title: this.$t('name'),
                        minWidth: 70,
                        key: 'name'
                    },
                ],
                data: [],
                pageSize: 10,
                pageNo: 1,
                total: '',
                name: '',
                code: ''
            },
            selectList: {
                data: []
            },
            groupList: {
                columns: [
                    {
                        type: 'selection',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: this.$t('name'),
                        minWidth: 70,
                        key: 'name'
                    },
                ],
                data: []
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
            formValidate: {},
            ruleValidate: {},
            language: this.$i18n.locale,
            show_bg: false,
            show_map: false,
            show_Map: false,
            planId: '',
            xAxisData:[],
            groupDetail:{
                data:[]
            },
            spinShow: false,
            assignSpin:false,
            projects:[]
        }
    },
    methods: {
        ...mapActions([
            'getLampPlanList',
            'getLampGroupsAll',
            'getLampPlanGroup',
            'getLampPlanDetail',
            'assignLampPlan',
            'saveLampGroups',
            'getProjectAll'
        ]),
        init () {
            const data = {
                pageSize: this.planList.pageSize,
                pageNo: this.planList.pageNo,
                name: this.planList.name,
                code: this.planList.code
            }
            this.getLampPlanList(data).then(res => {
                const data = res.data.rs.data
                this.planList.data = data.list
                this.planList.total = data.count
                data.list[0]._highlight =  true
                this.planId = data.list[0].id
                this.getLampPlanDetail({planId:data.list[0].id}).then(res => {
                    this.groupDetail.data = res.data.rs.data
                    this.drawLine()
                })
                this.getLampPlanGroup({planId:data.list[0].id}).then(res => {
                    this.selectList.data = res.data.rs.data
                    this.getLampGroupsAll().then(res => {
                        this.selectList.data.map(e => {
                            res.data.rs.data.map(k => {
                                if(k.id === e.id) {
                                    k._checked =  true
                                }
                            })
                        })
                        this.groupList.data = res.data.rs.data
                    })
                })
            })
        },
        getGroup (row) {
            this.planId = row.id
            this.getLampPlanDetail({planId:row.id}).then(res => {
                this.groupDetail.data = res.data.rs.data
                this.drawLine()
            })
            this.getLampPlanGroup({planId:row.id}).then(res => {
                this.selectList.data = res.data.rs.data
                this.getLampGroupsAll().then(res => {
                    this.selectList.data.map(e => {
                        res.data.rs.data.map(k => {
                            if(k.id === e.id) {
                                k._checked =  true
                            }
                        })
                    })
                    this.groupList.data = res.data.rs.data
                })
            })
        },
        selectLamp (row) {
            this.selectList.data = row
        },
        assign () {
            let groupId = []
            this.selectList.data.map(e => {
                groupId.push(e.id)
            })
            const data = {
                groupIds: groupId.join(','),
                planId: this.planId
            }
            this.assignSpin = true
            this.assignLampPlan(data).then(res => {
                this.assignSpin = false
                if(res.data.code !== 0) return 
                this.$Message.success(this.$t('save_ok'))
            }).catch(err => this.assignSpin = false)
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                this.spinShow = true
                if (valid) {
                    this.saveLampGroups(this.$refs[name].model).then(res => {
                        this.spinShow = false
                        if(res.data.code !== 0) return
                        this.init()
                        this.$Message.success('save_ok');
                        this.show_bg = false
                        this.show_Map = false
                    }).catch(err => this.spinShow = false)
                } else {
                    this.spinShow = false
                    this.$Message.error('unvalid_param');
                }
            })
        },
        add () {
            this.show_bg = true
            this.show_map = true
            this.show_Map = true
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
        },
        drawLine () {
            let chart_park = echarts.init(document.getElementById('lampChart'))
            var xAxisData = this.xAxisData
			let data = this.groupDetail.data
			var tempOne = null;
			if(data && data.length > 0){
				var one = data[data.length - 1]; // 使用最后一个值做为第一个值，因为时间是循环的
				//time = one.execHour + ':' + one.execMin;
				tempOne = {
					cmd: one.cmd,
					light: one.light,
					delay: one.delay,
					time: '00:00',
					
					name: '00:00',
					value: (one.cmd == '80' || one.cmd == '00') ? this.$t('open_lamp') : this.$t('close_lamp')
				};
			}else{
				tempOne = {
					cmd: 'A0',
					light: 0,
					delay: 600,
					time: '',
					
					name: '',
					value: this.$t('close_lamp')
				};
			}
			var ii = 0;
			var d = [];
			for(var j = 0; j < xAxisData.length; j++){
				var xTime = xAxisData[j];
				for(var i = ii; i < data.length; i++){
					var one = data[i];
					let time = one.execHour + ':' + one.execMin;
					if(xTime == time && !one.execYear && !one.execMonth && !one.execDay){
						tempOne = {
							cmd: one.cmd,
							light: one.light,
							delay: one.delay,
							time: time,
							
							name: time,
							value: (one.cmd == '80' || one.cmd == '00') ? this.$t('open_lamp') : this.$t('close_lamp')
						};
						ii = i + 1;
						break;
					}
				}
				tempOne.time = xTime;
				tempOne.name = xTime;
				// 这里暂不处理调光指令显示
				d.push(tempOne);
			}
			chart_park.setOption({series: [{data: d,itemStyle: {normal: {areaStyle: { type: 'default' }}}}]});
        }
    },
    created () {
        this.getProjectAll().then(res => {
            this.projects = res.data.rs.data
        })
        this.init()
    },
    mounted () {
        this.xAxisData = [];
        for(var i = 0; i < 24; i++){
        	var hh = ('0' + i).substr(('0' + i).length - 2, ('0' + i).length);
        	for(var j = 0; j < 60; j++){
        		var mm = ('0' + j).substr(('0' + j).length - 2, ('0' + j).length);
        		this.xAxisData.push(hh + ':' + mm);
        	}
        }
        let chart_park = echarts.init(document.getElementById('lampChart'))
        let xAxisData = this.xAxisData
        chart_park.setOption({
            //title: {show: false},
            //toolbox: {show: true,feature: {saveAsImage: {show: true}}},
            grid: {top: 20,bottom: 30,right: 40,left:60},
            tooltip: {trigger: 'axis',formatter: (p) => {return p[0].name + '：' + (p[0].data.cmd == '00' ?  this.$t('change_lamp') + '(' + p[0].data.light + ')' : p[0].value);}},
            xAxis: {type: 'category',data: xAxisData},
            yAxis: [{type: 'category',data: [this.$t('close_lamp'), this.$t('open_lamp')]}],
            series: [{yAxisIndex: 0,name: this.$t('lamp_control_index_detail'),type: 'line',step: 'middle'}]
        });
        this.$nextTick(()=>{
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 230
            this.groupHeight = window.innerHeight - this.$refs.groupTable.$el.offsetTop - 170
        })
        window.onresize = () => {
            this.tableHeight = window.innerHeight -                     this.$refs.table.$el.offsetTop - 230
            this.groupHeight = window.innerHeight - this.$refs.groupTable.$el.offsetTop - 170
            chart_park.resize()
        }
    }
}
</script>