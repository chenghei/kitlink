<style lang="less" scoped src="./chart.less"></style>
<template>
    <div class="content-body">
        <div class="boxShadow" style="background:#fff;">
            <div class="header">
                <span>{{$t('lamp_power_index_chart')}}</span>
            </div>
             <Row type="flex" class="content_select" style="border-bottom: 1px solid #ddd;"> 
                <div class="content_select_input">
                <p>{{$t('time_period')}}：</p>
                    <i-col>
                        <Date-picker :value="time" @on-change="dateChange" @on-clear="dateClear" type="daterange" :placeholder="$t('select_date')" style="width: 200px"></Date-picker>
                    </i-col>
                </div>
                <div class="content_select_input">
                <p>{{$t('plan_detail')}}：</p>
                <i-col span="12" style="width:200px">
                    <i-select filterable clearable v-model="search.planId">
                        <i-option v-for="item in planList" :key="item.id" :value="item.id">{{item.name}}</i-option>
                    </i-select>
                </i-col>
                </div>
                <div class="select_button" @click="init">{{$t('query')}}</div>
            </Row>
            <Row type="flex">
                <i-col style="width:400px;">
                    <ve-ring :data="chartData" :settings="chartSettings" :extend="chartExtend"></ve-ring>
                </i-col>
                <i-col class="right-body">
                    <Row type="flex" :gutter="32" align="middle">
                        <i-col span="4" class="card">
                            <div class="title">{{$t('activated')}}</div>
                            <div class="count">{{powerData.counts}}</div>
                            <div class="proportion">100%</div>
                        </i-col>
                        <i-col span="4" class="card">
                            <div class="title" style="background: linear-gradient(201deg, #b4b4b4 0%, #656565 100%);">{{$t('inactive')}}</div>
                            <div class="count">0</div>
                            <div class="proportion">0%</div>
                        </i-col>
                        <i-col span="4" class="card">
                            <div class="title" style="background: linear-gradient(180deg, #0ac2f8 0%, #8141f7 100%)">{{$t('rated_powers')}}</div>
                            <div class="count">{{powerData.power}}</div>
                            <div class="proportion">{{$t('degree')}}</div>
                        </i-col>
                        <i-col span="4" class="card" >
                            <div class="title" style="background: linear-gradient(180deg, #0ac2f8 0%, #8141f7 100%)">{{$t('power_act')}}</div>
                            <div class="count">{{powerData.power_act}}</div>
                            <div class="proportion">{{$t('degree')}}</div>
                        </i-col>
                        <i-col span="4" class="card">
                            <div class="title">{{$t('power_save')}}</div>
                            <div class="count">{{powerData.power_save}}</div>
                            <div class="proportion">{{powerData.power_save_radio}}%</div>
                        </i-col>
                    </Row>
                </i-col>
            </Row>
            <Row type="flex">
                <i-col style="width:400px;">
                    <ve-pie :data="pieData" :settings="pieSettings" :extend="pieExtend"></ve-pie>
                </i-col>
                <i-col class="right-body" style="padding:0 30px">
                    <ve-line :data="lineData" :settings="lineSettings" :extend="lineExtend"></ve-line>
                </i-col>
            </Row>
            <Row style="padding:0 30px"> 
                <ve-histogram :data="histogramData" :settings="histogramSettings" :extend="histogramExtend"></ve-histogram>
            </Row>
        </div>
    </div>
</template>
<script>
import VePie from 'v-charts/lib/pie.common'
import VeRing from 'v-charts/lib/ring.common'
import VeLine from 'v-charts/lib/line.common'
import VeHistogram from 'v-charts/lib/histogram.common'
import "echarts/lib/component/title";
import "echarts/lib/component/toolbox"
import { mapActions } from 'vuex'

export default {
    components: {
        VePie,
        VeRing,
        VeLine,
        VeHistogram
    },
    data () {
        this.chartSettings = {
            radius: [60, 100],
            label:{
                show: true,
                position: 'center',
                formatter: [
                    `{a|0}`,
                    '{b|'+this.$t('lamp_qty')+'}'
                ].join('\n'),
                rich: {
                    a: {
                        lineHeight: 40,
                        fontSize:40,
                        color:'#1A1A1A'
                    },
                    b: {
                        lineHeight: 40,
                        height:40,
                        color:'#1A1A1A'
                    },
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
        }
        this.chartExtend = {
            legend: {
                show:false
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            series:{
                name: this.$t('node_status')
            }
        },
        //饼图
        this.pieSettings = {
            dimension: this.$t('power'),
            metrics: this.$t('number'),
            label:{
                position: 'inside',
                formatter: '{d}%',
                fontSize: 20,
            }
        }
        this.pieExtend = {
            toolbox: {
                show: true,
                feature: { saveAsImage: { show: true } }
            }
        }
        //折线图
        this.lineSettings = {
            stack: { [this.$t('power')] : [this.$t('power_act'), this.$t('power_save')] },
            area: true,
        }
        this.lineExtend = {
            title:{
                text: this.$t('functional_trend')
            },
            toolbox: {
                show: true,
                feature: { saveAsImage: { show: true } }
            }
        }
        //柱状图
        this.histogramSettings = {
            showLine: [this.$t('lamp_number')],
            stack: { [this.$t('power')]: [this.$t('power_act'), this.$t('power_save')] },
            axisSite: { right: [this.$t('lamp_number')] },
            yAxisName: [this.$t('power'), this.$t('lamp_number')]
        }
        this.histogramExtend = {
            title:{
                text: this.$t('saving_trend')
            },
            toolbox: {
                show: true,
                feature: { saveAsImage: { show: true } }
            }
        }
        return {
            powerData: {
                counts: 0,
                power: '--',
                power_act: '--',
                power_save: '--',
                power_save_radio: '0.00'
            },
            planList: [],
            search: {
                planId: '',
                timeBegin: moment().subtract(7, 'days').format('YYYYMMDD'),
                timeEnd: moment(new Date()).format('YYYYMMDD')
            },
            time: [moment().subtract(7, 'days').format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD')],
            chartData: {
                columns: [this.$t('status'), this.$t('number')],
                rows: [
                    { [this.$t('status')]: this.$t('activated'), [this.$t('number')]: 0 },
                    { [this.$t('status')]: this.$t('inactive'), [this.$t('number')]: 0 }
                ]
            },
            pieData: {
                columns: [this.$t('power'), this.$t('number')],
                rows: [
                    { [this.$t('power')]: this.$t('power_act'),  [this.$t('number')]: 0 },
                    { [this.$t('power')]: this.$t('power_save'),  [this.$t('number')]: 0 },
                ]
            },
            lineData: {
                columns: [this.$t('date'), this.$t('power_act'), this.$t('power_save')],
                rows: [],
            },
            histogramData: {
                columns: [this.$t('date'), this.$t('power'), this.$t('power_act'), this.$t('power_save'), this.$t('lamp_number')],
                rows: []
            },
        }
    },
    methods: {
        ...mapActions([
            'getLampPlanAll',
            'getHistory'
        ]),
        init() {
            this.getHistory(this.search).then(res => {
                const list = res.data.rs.data

                let power = 0 // 统计额定功耗
                let power_act = 0 // 统计实际功耗
                let lineData = [] // 功能趋势
                let histogramData = [] // 节能趋势

                for (let i = list.length - 1; i >= 0; i--) {
                    const el = list[i]

                    power+=el.power
                    power_act+=el.power_act
                    
                    const powerTofixed = el.power.toFixed(2)
                    const powerActTofixed = el.power_act.toFixed(2)
                    const powerSaveTofixed = (powerTofixed - powerActTofixed).toFixed(2)

                    lineData.push(
                        {
                            [this.$t('date')]: moment(el.ts).format('YYYY-MM-DD'),
                            [this.$t('power_act')]: powerTofixed,
                            [this.$t('power_save')]: powerSaveTofixed
                        }
                    )

                    histogramData.push(
                        { 
                            [this.$t('date')]: moment(el.ts).format('YYYY-MM-DD'), 
                            [this.$t('rated_powers')]: powerTofixed, 
                            [this.$t('power_act')]: powerActTofixed, 
                            [this.$t('power_save')]: powerSaveTofixed, 
                            [this.$t('lamp_number')]: el.plan.qty 
                        }
                    )
                }

                // 激活数量，功耗数据
                this.powerData = {
                    counts: list[0] ? list[0].plan.qty : 0,
                    power: power ? power.toFixed(2) : '--',
                    power_act: power_act ? power_act.toFixed(2) : '--',
                    power_save: power ? (power - power_act).toFixed(2) : '--'
                }
                const power_save_radio = Math.round(this.powerData.power_save / this.powerData.power * 10000) / 100.00
                this.powerData.power_save_radio = power_save_radio ? power_save_radio : '0.00'

                // 单灯数量饼状图
                this.chartData.rows = [
                    { [this.$t('status')]: this.$t('activated'), [this.$t('number')]: this.powerData.counts },
                    { [this.$t('status')]: this.$t('inactive'), [this.$t('number')]: 0 },
                ]
                this.chartSettings.label.formatter = [
                    `{a|${this.powerData.counts}}`,
                    '{b|'+this.$t('lamp_qty')+'}'
                ].join('\n')

                // 功耗占比
                this.pieData.rows = [
                    { [this.$t('power')]: this.$t('power_act'), [this.$t('number')]: this.powerData.power_act !== '--' ? this.powerData.power_act : 0 },
                    { [this.$t('power')]: this.$t('power_save'), [this.$t('number')]: this.powerData.power_save !== '--' ? this.powerData.power_save : 0}
                ]
                // 功能趋势
                this.lineData.rows = lineData
                
                // 节能趋势
                this.histogramData.rows = histogramData
            })
        },
        dateChange(event) {
            this.search.timeBegin = moment(event[0]).format('YYYYMMDD')
            this.search.timeEnd = moment(event[1]).format('YYYYMMDD')
        },
        dateClear() {
            this.search.timeBegin = this.search.timeEnd = ''
        },
    },
    async created() {
        await this.getLampPlanAll().then(res => {
            this.planList = res.data.rs.data
        })

        this.search.planId = this.planList[0].id
        await this.init()
    }
}
</script>