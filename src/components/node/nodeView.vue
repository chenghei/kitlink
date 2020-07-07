<template>
    <div>
        <ve-line :options="options" :data="chartData" :settings="chartSettings" :extend="chartExtend" :mark-point="markPoint" :colors="colors" v-if="geomag" :grid="grid"></ve-line>
        <ve-line :options="options" :data="chartData3" :settings="chartSettings" :extend="chartExtends" :colors="colors" v-if="geomag" :grid="grid"></ve-line>
        <ve-line :options="options" :data="chartData2" :settings="chartSettings" :extend="chartExtend" :mark-point="markPoint" :colors="colors" :grid="grid"></ve-line>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import VeLine from 'v-charts/lib/line.common'
import 'echarts/lib/component/markPoint'
const textStyle = {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: 12
}
export default {
    name: 'nodeView',
    props: {
        devEui: {
            type: String,
        }
    },
    components: { VeLine },
    data () {
        this.options = {
            tooltip: textStyle,
            textStyle: textStyle
        }
        this.chartSettings = {}
        this.grid = {
            show: true,
            left: 20,
            right: 20,
            borderColor: '#ccc'
        }
        this.chartExtend = {
            series:{
                type: 'line',
                symbolSize: 12,
                symbol: 'circle',
                itemStyle:{
                    borderWidth:3,
                    borderColor: '#fff',
                }
            }
        }
        this.chartExtends = {
            series: {
                smooth: 0,
                step: 'status',
            }
        }
        this.markPoint = {
            data: [
                {
                    name: '最大值',
                    type: 'max'
                }
            ]
        }
        this.colors = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83', '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
        return {
            rxinfo_timeout: {},
            geomag: false,
            chartData: {
                columns: ['date', 'x', 'y', 'z'],
                rows: []
            },
            chartData2: {
                columns: ['date', 'fport', 'rssi', 'lora_snr', 'temperature', 'power'],
                rows: []
            },
            chartData3: {
                columns: ['date', 'status'],
                rows: []
            },
        }
    },
    methods: {
        ...mapActions([
            'mqtt'
        ]),
        init () {
            let postData = {
                dev_eui: this.devEui,
                type: 'node',
                topic: 'payload',
                limit: 25
            }
            this.mqtt(postData).then(res => {
                let datas = res.data.rs
                this.chartData.rows = [];
                this.chartData2.rows = [];
                this.chartData3.rows = [];
                datas.map(item => {
                    let itemData = item.payload;
                    let payload = item.payload.payload;
                    if(itemData.fport == 12){
                        this.geomag = true;
                        let data = {
                            date: moment(itemData.ts).format('YYYY-MM-DD HH:mm:ss'),
                            x: payload.x,
                            y: payload.y,
                            z: payload.z
                        }
                        this.chartData.rows.unshift(data)
                    
                        let data3 = {
                            date: moment(itemData.ts).format('YYYY-MM-DD HH:mm:ss'),
                            status: payload.park_status == true ? 1 : 0
                        }
                        this.chartData3.rows.unshift(data3)
                    }

                    let data2 = {
                        date: moment(itemData.ts).format('YYYY-MM-DD HH:mm:ss'),
                        fport: itemData.fport,
                        rssi: itemData.rssi,
                        lora_snr: itemData.lora_snr,
                        power: payload.power,
                        temperature: payload.temperature
                    }
                    this.chartData2.rows.unshift(data2)
                })
                if(this.$route.name === 'node_detail') this.timeoutHander()
                
            }).catch(err => console.log(err))
        },
        timeoutHander() {
            this.rxinfo_timeout = setTimeout(() => {
                this.init();
            }, 1000*60);
        }
    },
    created () {
        this.init()
    },
    beforeDestroy () {
        clearTimeout(this.rxinfo_timeout);
    }
}
</script>