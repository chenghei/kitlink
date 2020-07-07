<style lang="less" scoped src="./detail.less"></style>
<template>
    <Row type="flex" class="content-body">
        <i-col class="content_left boxShadow">
            <div class="header">
                <span>{{$t('plan_list')}}</span>
                <div @click="add">
                    <img src="../../../assets/images/add18.svg">
                    {{$t('create')}}
                </div>
            </div>
            <div class="tree_out">
                <Table ref="table" @on-row-click="getPlanDetail" highlight-row :height="tableHeight" :columns="planList.columns" :data="planList.data"></Table>
                <div class="list_bottom" style="display: flex;justify-content: center;padding-right:0;">
                    <Page :total="planList.total" show-elevator show-total ></Page>
                </div>
                <Spin size="large" fix v-if="addShow"></Spin>
            </div>
        </i-col>
        <i-col class="content_right boxShadow">
            <div class="header">
                <span>{{$t('lamp_group')}}</span>
            </div>
             <div id="lampChart" :style="{width: '100%', height: '200px'}"></div>
            <Row type="flex"  class="content_select" justify="end" style="padding-right:30px">
                <div class="content_select_input">
                <p>{{$t('year')}}：</p> 
                <i-col span="12" style="width:100px">
                    <i-select v-model="selectDetail.execYear" filterable clearable>
                        <i-option v-for="(item,i) in detailList.execYear" :key="i" :value="item">{{ item }}</i-option>
                    </i-select>
                </i-col>
                </div>
                <div class="content_select_input">
                <p>{{$t('month')}}：</p> 
                <i-col span="12" style="width:100px">
                    <i-select v-model="selectDetail.execMonth" filterable clearable>
                        <i-option v-for="(item,i) in detailList.execMonth" :key="i" :value="item">{{ item }}</i-option>
                    </i-select>
                </i-col>
                </div>
                <div class="content_select_input">
                <p>{{$t('day1')}}：</p> 
                <i-col span="12" style="width:100px">
                    <i-select v-model="selectDetail.execDay" filterable clearable>
                        <i-option v-for="(item,i) in detailList.execDay" :key="i" :value="item">{{ item }}</i-option>
                    </i-select>
                </i-col>
                </div>
                <div class="content_select_input">
                <p>{{$t('hour1')}}：</p> 
                <i-col span="12" style="width:100px">
                    <i-select v-model="selectDetail.execHour" filterable clearable>
                        <i-option v-for="(item,i) in detailList.execHour" :key="i" :value="item">{{ item }}</i-option>
                    </i-select>
                </i-col>
                </div>
                <div class="content_select_input">
                <p>{{$t('min1')}}：</p> 
                <i-col span="12" style="width:100px">
                    <i-select v-model="selectDetail.execMin" filterable clearable>
                        <i-option v-for="(item,i) in detailList.execMin" :key="i" :value="item">{{ item }}</i-option>
                    </i-select>
                </i-col>
                </div>
                <div class="content_select_input">
                <p>{{$t('op')}}：</p> 
                <i-col span="12" style="width:100px">
                    <i-select v-model="selectDetail.cmd" filterable @on-change="changeLight">
                        <i-option value="80">{{$t('open_lamp')}}</i-option>
                        <i-option value="A0">{{$t('close_lamp')}}</i-option>
                        <i-option value="00">{{$t('change_lamp')}}</i-option>
                    </i-select>
                </i-col>
                </div>
                <div class="content_select_input" v-if="selectDetail.cmd === '00'">
                <p>{{$t('brightness')}}：</p> 
                <i-col span="12" style="width:100px">
                    <i-select v-model="selectDetail.light" filterable clearable>
                        <i-option v-for="(item,i) in detailList.light" :key="i" :value="item">{{ item }}</i-option>
                    </i-select>
                </i-col>
                </div>
            </Row>
            <Row type="flex"  class="content_select" justify="end" style="padding-right:30px">
                <div class="content_select_input">
                <p class="tip">{{$t('lamp_detail_tip')}}</p> 
                </div>
                <div class="select_button" style="margin-left:0" @click="addDetail">{{$t('add')}}</div>
            </Row>
            <Table ref="groupTable" :height="groupHeight" :columns="groupList.columns" :data="groupList.data"></Table>
            <Spin size="large" fix v-if="addShow"></Spin>
            <!-- <div class="list_bottom">
                <Page :total="1000" show-elevator show-total ></Page>
            </div> -->
        </i-col>
        <transition name="slide-fade">
            <div class="bg" v-if="show_bg" @click="close"></div>
        </transition>
        <transition name="width800-fade">
            <div class="width_800" v-if="add_plan">
                <div class="add_title">
                    <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
                    {{title}}
                </div>
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="140">
                    <Row class="add_scroll">
                        <FormItem :label="$t('name')+'：'" prop="name" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.name" style="width:200px"/>
                        </FormItem>
                        <FormItem :label="$t('code')+'：'" prop="code" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.code" style="width:200px"/>
                        </FormItem>
                        <FormItem :label="$t('remark')+'：'" prop="" style="margin-top:20px">
                            <Input type="textarea" v-model="formValidate.remarks" style="width:400px"/>
                        </FormItem>
                    </Row>
                    <div class="add_bottom">
                        <div class="add_button" @click="handleSubmit('formValidate')">{{$t('save')}}</div>
                    </div>
                    <Spin size="large" fix v-if="spinShow"></Spin>
                </Form>
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
                <Button type="success" :loading="deleteModel.loading" @click="deletePlan">{{$t('confirm')}}</Button>
                <Button @click="deleteModel.status = false">{{$t('cancel')}}</Button>
            </div>
        </Modal>
    </Row>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    data () {
        return {
            delTitle: '',
            tableHeight: '',
            groupHeight: '',
            planList: {
                columns: [
                    {
                        title: this.$t('name'),
                        minWidth: 70,
                        key: 'name'
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
                                            this.title = this.$t('edit_plan')
                                            this.show_bg = true
                                            this.add_plan = true
                                            this.editPlan(params.row)
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
                                            this.delTitle = params.row.name
                                            this.deleteModel.planId = params.row.id
                                            this.delType = '计划列表'
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
                name: '',
                code: '',
                total: ''
            },
            groupList: {
                columns: [
                    {
                        title: this.$t('time'),
                        minWidth: 150,
                        render: (h, params) => {
                            let y = params.row.execYear ? params.row.execYear : '0000'
                            let m = params.row.execMonth ? params.row.execMonth : '00'
                            let d = params.row.execDay ? params.row.execDay : '00'
                            let hour = params.row.execHour ? params.row.execHour : '00'
                            let min = params.row.execMin ? params.row.execMin : '00'
                            let time = y + '/' + m + '/' + d + ' ' + hour + ':' + min 
                            return h('div', time)
                        }
                    },
                    {
                        title: this.$t('implement'),
                        minWidth: 70,
                        render: (h, params) => {
                            let status = ''
                            switch (params.row.cmd) {
                                case "80": 
                                status = this.$t('open_lamp')
                                break;
                                case "A0": 
                                status = this.$t('close_lamp')
                                break;
                                case "00": 
                                status = this.$t('change_lamp')
                                break;
                            }
                            return h('div', status)
                        }
                    },
                    {
                        title: this.$t('brightness'),
                        minWidth: 70,
                        render: (h, params) => {
                            if(params.row.cmd === "00"){
                                 return h('div', params.row.light)
                            }
                           
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
                                            this.delTitle = ''
                                            this.delType = '路灯列表'
                                            this.detailId = params.row.id
                                        }
                                    }
                                    })
                                ])
                            )
                            return h('div', btn)
                        }
                    }
                ],
                data: []
            },
            formValidate: {
                id: '',
                name: '',
                code: '',
                remarks: ''
            },
            ruleValidate: {
                name:[
                    { required: true, message: this.$t('enter_name_prompt'), trigger: 'blur' }
                ],
                code:[
                    { required: true, message: this.$t('input_code1'), trigger: 'blur' }
                ],
            },
            language: this.$i18n.locale,
            show_bg: false,
            add_plan: false,
            title: '',
            deleteModel: {
                status: false,
                loading: false,
                planId: ''
            },
            planId: '',
            detailId: '',
            spinShow: false,
            delType: '',
            detailList:{
                execYear: [],
                light:[],
                execMonth:[],
                execDay: [],
                execHour: [],
                execMin: []
            },
            selectDetail:{
                execYear: '',
                light: 100,
                execMonth: '',
                execDay:  '',
                execHour:  '',
                execMin:  '',
                cmd: '80'
            },
            addShow: false,
            xAxisData: []
        }
    },
    methods: {
        ...mapActions([
            'getLampPlanList',
            'getLampPlanDetail',
            'saveLampPlan',
            'deleteLampPlan',
            'addLampPlanDetail',
            'removeLampPlanDetail'
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
                this.getLampPlanDetail({planId:this.planId}).then(res => {
                    this.groupList.data = res.data.rs.data
                    this.drawLine()
                })
            })
        },
        getPlanDetail (row) {
            this.planId = row.id
            this.getLampPlanDetail({planId:this.planId }).then(res => {
                this.groupList.data = res.data.rs.data
                this.drawLine()
                
            })
        },
        editPlan (row) {
            this.formValidate = JSON.parse(JSON.stringify(row))
            this.formValidate.id = row.id
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.spinShow = true
                    this.saveLampPlan(this.$refs[name].model).then(res => {
                        this.spinShow = false
                        if(res.data.code !== 0) return
                        this.$Message.success(this.$t('save_ok'));
                        this.show_bg = false
                        this.add_plan = false
                        this.init()
                    }).catch(err => this.spinShow = false)
                } else {
                    this.$Message.error(this.$t('unvalid_param'));
                }
            })
        },
        deletePlan () {
            if (this.delType === '计划列表') {
                this.deleteModel.loading = true
                this.deleteLampPlan({planId:this.deleteModel.planId}).then(res => {
                    this.deleteModel.loading = false
                    if(res.data.code !== 0) return
                    this.$Message.success(this.$t('delete_ok'));
                    this.deleteModel.status = false
                    this.init()
                }).catch(err => this.deleteModel.loading = false)
                
            }
            if (this.delType === '路灯列表') {
                this.deleteModel.loading = true
                this.removeLampPlanDetail({
                    planId:this.planId,
                    detailId: this.detailId
                }).then(res => {
                    this.deleteModel.loading = false
                    if(res.data.code !== 0) return
                    this.init()
                    this.deleteModel.status = false
                    this.$Message.success(this.$t('delete_ok'));
                }).catch(err => this.deleteModel.loading = false)
            }
            
        },
        changeLight (value) {
            if (value === "80") {
                this.selectDetail.light = 100
            }
            if (value === "A0") {
                this.selectDetail.light = 0
            }
            if (value === "00") {
                this.selectDetail.light = 100
            }
        },
        //添加计划明细
        addDetail () {
            const data = {
                planId: this.planId,
                ...this.selectDetail
            }
            this.addShow = true
            this.addLampPlanDetail(data).then(res => {
                this.addShow = false
                if(res.data.code !== 0) return
                this.$Message.success(this.$t('save_ok'));
                this.init()
                this.selectDetail = {
                    execYear: '',
                    light: 100,
                    execMonth: '',
                    execDay:  '',
                    execHour:  '',
                    execMin:  '',
                    cmd: '80'
                }
            }).catch(err => this.addShow = false)
        },
        add () {
            this.title = this.$t('add_plan')
            this.show_bg = true
            this.add_plan = true
            this.formValidate =  {
                id: '',
                name: '',
                code: '',
                remarks: ''
            }
        },
        close () {
            this.show_bg = false
            this.add_plan = false
        },
        drawLine () {
            let chart_park = echarts.init(document.getElementById('lampChart'))
            var xAxisData = this.xAxisData
			let data = this.groupList.data
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
        for (var i = 0 ; i < 101 ; i++) {
            this.detailList.light.push(i)
        }
        for (var i = 1 ; i < 13 ; i++) {
            if(i < 10) i = '0'+i
            this.detailList.execMonth.push(i)
        }
        for (var i = 1 ; i < 32 ; i++) {
            if(i < 10) i = '0'+i
            this.detailList.execDay.push(i)
        }
        for (var i = 0 ; i < 25 ; i++) {
            if(i < 10) i = '0'+i
            this.detailList.execHour.push(i)
        }
        for (var i = 0 ; i < 60 ; i++) {
            if(i < 10) i = '0'+i
            this.detailList.execMin.push(i)
        }
        var date=new Date;
        var y = date.getFullYear()
        for (var i = y ; i < y + 5 ; i++ ) {
            this.detailList.execYear.push(i)
        }
        
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
            tooltip: {trigger: 'axis',formatter: (p) => {return p[0].name + '：' + (p[0].data.cmd == '00' ? this.$t('change_lamp') + '(' + p[0].data.light + ')' : p[0].value);}},
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