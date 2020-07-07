<style lang="less" scoped src="./deviceDetails.less"></style>
<template>
    <div class="content-body">
        <div class="header">
            <div>
                <img src="../../assets/images/jiantouzuo.svg" @click="$router.go(-1)">
                <span>{{$t('device_detail')}}</span>
            </div>
        </div>
        <div class="onlineDetail_content">
            <div class="left_content boxShadow">
                <div class="title">{{formValidate.devEui}}</div>
                <div class="left_scroll" style="position: relative;">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate"  :label-width="80">
                        <div class="top">
                            <div>{{$t('device_detail')}}</div>
                            <div v-if="detailAction">
                                <span @click="detailAction = false" style="margin-right:20px">{{$t('cancel')}}</span>
                                <span @click="handleSubmit">{{$t('confirm')}}</span>
                            </div>
                            <span v-if="!detailAction" @click="edit">{{$t('edit')}}</span>
                        </div>
                        <FormItem :label="$t('name')+'：'" prop="name" style="margin-top:15px;">
                            <Input type="text" v-model="formValidate.name" :disabled="!detailAction" style="width:200px"/>
                        </FormItem>
                        <FormItem :label="$t('code')+'：'" prop="devEui" style="margin-top:15px;">
                            <Input type="text" v-model="formValidate.devEui" disabled style="width:200px" />
                        </FormItem>
                        <FormItem :label="$t('type')+'：'" prop="typeName" style="margin-top:15px;">
                            <Input type="text" v-model="formValidate.typeName" disabled style="width:200px" />
                        </FormItem>
                        <FormItem :label="$t('address')+'：'" prop="address" style="margin-top:15px;">
                            <Input type="text" v-model="formValidate.address" :disabled="!detailAction" style="width:200px" />
                        </FormItem>
                        <FormItem :label="$t('operator')+'：'" prop="operator" style="margin-top:15px;">
                            <Input type="text" v-model="formValidate.operator" :disabled="!detailAction" style="width:200px" />
                        </FormItem>
                        <FormItem :label="$t('mobile')+'：'" prop="operatorMobile" style="margin-top:15px;">
                            <Input type="text" v-model="formValidate.operatorMobile" :disabled="!detailAction" style="width:200px" />
                        </FormItem>
                    </Form>
                    <div class="top" style="margin-bottom:10px;">
                        <div>{{$t('system_rule')}}</div>
                        <div v-if="ruleAction">
                            <span @click="ruleAction = false" style="margin-right:20px">{{$t('cancel')}}</span>
                            <span @click="ruleSubmit">{{$t('confirm')}}</span>
                        </div>
                        <span v-if="!ruleAction" @click="editRule">{{$t('edit')}}</span>
                    </div>
                    <Row type="flex" style="align-items: center;margin-left:20px"  v-for="(item,index) in ruleList" :key="index">
                        <div v-if="item.expType === 'V'">
                            <div style="font-size:14px;margin:10px 0;"> <b>{{item.name}}</b> </div>
                            <div style="display:flex;align-items: center;">
                                <span style="margin-left:20px">{{item.field.name}}{{item.operator}}：</span>
                                <Input v-model="ruleNum[index].param" :disabled="!ruleAction" :value="item.parameter" style="width:50px" />
                            </div>
                            <span class="tip">{{item.description}}</span>
                        </div>
                        <div v-if="item.expType === 'S'" style="width:100%">
                            <Row type="flex" style="align-items:center;justify-content: space-between;">
                                    <Checkbox v-model="ruleNum[index].param" :disabled="!ruleAction">
                                        <b style="margin-left:10px">{{item.name}}</b>
                                    </Checkbox>
                                <span class="tip">{{item.description}}</span>
                            </Row>
                        </div>
                    </Row>
                
                </div>
            </div>
            <div class="right_content boxShadow" v-if="show">
                <div class="top">
                    <div class="view_select" >{{$t('view1')}}</div>
                    <div class="list" @click="select_view()">{{$t('list')}}</div>
                </div>
                <div class="echarts_out">
                    <div class="echarts_title">
                        <div class="type">{{$t('sensor_data')}}</div>
                        <div class="select_time">
                            <div v-for="(item,index) in selectTime" :key="index" :class="activeTime == index ? 'active' : 'normal'" @click="handleClick(index)">
                                {{item.title}}
                            </div>
                        </div>
                    </div>
                    <div style="height:400px">
                    <ve-line :settings="formValidate.fport == '4' ? chartSettings : ''" :extend="chartExtend" :data="chartData" :loading="chartData.loading" :data-empty="chartData.dataEmpty" ></ve-line>
                    </div>
                    <div class="echarts_title">
                        <div class="type">{{$t('device_vol')}}</div>
                        <div class="select_time">
                            <div v-for="(item,index) in selectTime" :key="index" :class="activeTime1 == index ? 'active' : 'normal'" @click="handleClick1(index)">
                                {{item.title}}
                            </div>
                        </div>
                    </div>
                    <ve-line :extend="chartExtend" :data="volData" :loading="volData.loading" :data-empty="volData.dataEmpty" ></ve-line>
                </div>

            </div>
            <div class="right_content boxShadow" v-if="!show">
                <div class="top">
                    <div class="view" @click="select_list()">{{$t('view1')}}</div>
                    <div class="select list_select">{{$t('list')}}</div>
                </div>
                <Table ref="table" :height="tableHeight" :columns="history.columns" :data="history.data" :loading="history.loading"></Table>
                <div class="list_bottom">
                    <Page :total="history.total" :page-size="history.pageSize" @on-change="nextPage" show-elevator show-total></Page>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import 'v-charts/lib/style.css'
import VeLine from 'v-charts/lib/line.common'
import { mapGetters, mapActions } from 'vuex'

export default {
    components: {
        VeLine
    },
    props: {
        nodeId: {
            type: String,
            required: true
        }
    },
    data () {
        this.chartSettings = {
            axisSite: { right: [this.$t('humi2')] },
            yAxisName: [this.$t('temp'), this.$t('humi2')],
            yAxisType: ['KMB', 'percent'],
        }
        this.chartExtend = {
            grid:{   // 设置图表在画布中的位置
                right:60,
                left:40,
                x: 20,
                y2:20,
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
            // yAxis:{
            //     axisLabel:{
            //     textStyle:{
            //         fontSize: 10,
            //         color: '#1A1A1A'
            //     }
            //     },
            //     splitLine: {
            //     show:true,
            //     lineStyle: {
            //         color: 'rgba(0,0,0,0.2)'
            //     }
            //     }
            // },
            series:{
                type: 'line',
                symbolSize: 12,
                symbol: 'circle',
                itemStyle:{
                borderWidth:3,
                borderColor: '#fff',
                },
            }
        }
        return {
            tableHeight:'',
            show: true,
            detailAction : false,
            ruleAction: false,
            selectTime:[
                {title: this.$t('near_week')},
                {title: this.$t('near_month')},
            ],
            activeTime:0,
            activeTime1:0,
            //规则列表
            ruleList: [],
            ruleNum: [],
            formValidate:{
                devEui: ''
            },
            ruleValidate:{},
            chartData: {
                columns: [],
                rows: [],
                loading: true,
                dateBegin: moment().subtract(7, 'days').valueOf(),
                dateEnd: moment(new Date()).valueOf(),
                dataEmpty: false
            },
            volData: {
                columns: [this.$t('date'), this.$t('vol')],
                rows: [],
                loading: true,
                dateBegin: moment().subtract(7, 'days').valueOf(),
                dateEnd: moment(new Date()).valueOf(),
                dataEmpty: false
            },
            history: {
                columns: [
                    {
                        title: 'DevEUI',
                        key: 'DevEUI',
                        render(h, params) {
                            const payload = params.row.payload
                            return h('span', payload.dev_eui)
                        }
                    },
                    {
                        title: 'RSSI',
                        key: 'RSSI',
                        render(h, params) {
                            const payload = params.row.payload
                            return h('span', payload.rssi)
                        }
                    },
                    {
                        title: 'LoRaSNR',
                        key: 'LoRaSNR',
                        render(h, params) {
                            const payload = params.row.payload
                            return h('span', payload.lora_snr)
                        }
                    },
                    {
                        title: 'FCnt',
                        key: 'FCnt',
                        render(h, params) {
                            const payload = params.row.payload
                            return h('span', payload.fcnt)
                        }
                    },
                    {
                        title: this.$t('vol'),
                        key: 'Voltage',
                        render(h, params) {
                            const payload = params.row.payload
                            return h('span', payload.payload.voltage_value.toFixed(2))
                        }
                    },
                    {
                        title: this.$t('interval'),
                        
                        render: (h, params) => {
                            const payload = params.row.payload
                            let ts = ""
                            let test = moment(new Date()).valueOf() - payload.ts
                            if(test < 60000){
                                ts = `${Math.floor(test*0.001)}${this.$t('seconds_ago')}`
                                return h('span', ts)
                            }else{
                                return h('span', moment(payload.ts).fromNow())
                            }
                        }
                    },
                    {
                        title: 'Time',
                        key: 'time',
                        render(h, params) {
                            const payload = params.row.payload
                            return h('span', moment(payload.ts).format('YYYY-MM-DD HH:mm:ss'))
                        }
                    }
                ],
                data: [],
                loading: true,
                pageSize: 10,
                pageNo: 1,
                total: 0
            }
        }
    },
    methods: {
        ...mapActions([
            'getNodeBasic',
            'saveNodeBasic',
            'getNodeRx',
            'getNodeHistory',
            'getNodeRule',
            'saveNodeRule'
        ]),
        //获取基本信息
        init() {
            this.getNodeBasic({nodeId: this.nodeId}).then(res => {
                this.formValidate = res.data.rs.data
                this.chartView()
                this.volView()
            })
            this.getNodeRule({nodeId: this.nodeId}).then(res => {
                res.data.rs.data.map(v => {
                    v.description = v.description.replace(/@param@/, this.$t('the_value'))
                    switch (v.operator) {
                        case '$L$': 
                        v.operator = this.$t('lt')
                        break;
                        case '$E$': 
                        v.operator = this.$t('et')
                        break;
                        case '$B$': 
                        v.operator = this.$t('gt')
                        break;
                        case '$LE$': 
                        v.operator = this.$t('let')
                        break;
                        case '$BE$': 
                        v.operator = this.$t('get')
                        break;
                    }
                    this.ruleList.push(v)
                })
                 this.ruleList.map(e => {
                    let rule ={
                        id: e.id,
                        param: e.parameter ? (e.parameter == 'true' ? true : e.parameter) : ''
                    }
                    this.ruleNum.push(rule)
                })
            })
        },
        //传感器数据
        chartView() {
            const params = {
                devEui: this.formValidate.devEui,
                dateBegin: this.chartData.dateBegin,
                dateEnd: this.chartData.dateEnd
            }
            this.getNodeRx(params).then(res => {
                const data = res.data.rs.data.reverse()
                if(this.formValidate.fport == '4'){ //温湿度
                    this.chartData.columns = [this.$t('date'), this.$t('temp'), this.$t('humi2')]
                    this.chartData.rows = data.map(v => {
                        const payload = v.payload
                        return {
                            [this.$t('date')]: moment(payload.ts).format('YYYY-MM-DD HH:mm:ss'),
                            [this.$t('temp')]: parseFloat(payload.payload.temperature).toFixed(2),
                            [this.$t('humi2')]: parseFloat(payload.payload.humidity).toFixed(2) / 100
                        }
                    })
                }else{
                    this.chartData.columns = [this.$t('date'), 'rssi']
                    this.chartData.rows = data.map(v => {
                        const payload = v.payload
                        return {
                            [this.$t('date')]: moment(payload.ts).format('YYYY-MM-DD HH:mm:ss'),
                            rssi: payload.rssi
                        }
                    })
                }
                if(this.chartData.rows.length === 0)this.chartData.dataEmpty = true
                this.chartData.loading = false
            })
        },
        //电压数据
        volView() {
            const params = {
                devEui: this.formValidate.devEui,
                dateBegin: this.volData.dateBegin,
                dateEnd: this.volData.dateEnd
            }
            this.getNodeRx(params).then(res => {
                const data = res.data.rs.data.reverse()
                this.volData.rows = data.map(v => {
                    const payload = v.payload
                    return {
                        [this.$t('date')]: moment(payload.ts).format('YYYY-MM-DD HH:mm:ss'),
                        [this.$t('vol')]: parseFloat(payload.payload.voltage_value).toFixed(2) || parseFloat(payload.payload.power).toFixed(2)
                    }
                })
                if(this.volData.rows.length === 0) this.volData.dataEmpty = true
                this.volData.loading = false
            })
        },
        //历史数据
        getHistory() {
            const data = {
                pageSize: this.history.pageSize, 
                pageNo: this.history.pageNo,
                devEui: this.formValidate.devEui
            }
            this.getNodeHistory(data).then(res => {
                const data = res.data.rs.data
                this.history.data = data.pages
                this.history.total = data.total
                this.history.loading = false
            })
        },
        nextPage(page) {
            this.history.pageNo = page
            this.getHistory()
        },
        handleClick (index) {
            this.activeTime = index
            this.chartData.loading = true
            if(index === 0)
                this.chartData.dateBegin = moment().subtract(7, 'days').valueOf()
            else
                this.chartData.dateBegin = moment().subtract(30, 'days').valueOf()
            
            this.chartView()
        },
        handleClick1 (index) {
            this.activeTime1 = index
            this.volData.loading = true
            if(index === 0)
                this.volData.dateBegin = moment().subtract(7, 'days').valueOf()
            else
                this.volData.dateBegin = moment().subtract(30, 'days').valueOf()
            
            this.volView()
        },
        handleSubmit () {
            this.detailAction = false
            this.saveNodeBasic(this.formValidate).then(res => {  
                if (res.data.code === 0) {
                    this.$Message.success(this.$t('save_ok'))
                } else {
                    this.$Message.error(res.data.msg)
                }
            }).catch(err => console.log(err))
        },
        ruleSubmit () {
            let data = {
                nodes:[this.nodeId],
                rules:this.ruleNum
            }
            this.ruleAction = false
            this.saveNodeRule(data).then(res => {
                if (res.data.code === 0) {
                    this.$Message.success(this.$t('save_ok'))
                } else {
                    this.$Message.error(res.data.msg)
                }
            }).catch(err => console.log(err))
        },
        edit () {
            this.detailAction = true
        },
        editRule () {
            this.ruleAction = true
        },
        select_view () {
            this.show = false
            this.$nextTick(()=>{
                this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
            })
            this.getHistory()
        },
        select_list () {
            this.show = true
        },
    },
    mounted () {
        window.onresize = () => {
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
        }
        if(this.$i18n.locale === 'en-US') {
            moment.locale('en-us')
        }else{
            moment.locale('zh-cn')
        }
    },
    created() {
        this.init()
    }
}
</script>
