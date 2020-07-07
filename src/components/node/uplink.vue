<template>
    <div>
        <div>
            <p style="font-size:16px;font-weight:bold;margin-bottom:10px;color:#1a1a1a">{{ $t('node_uplink_status') }}</p>
            <Table height="310" :columns="columns1" :data="data1"></Table>
        </div>
        <div style="margin-top:10px;">
            <p style="font-size:16px;font-weight:bold;margin-bottom:10px;color:#1a1a1a">{{ $t('node_uplink') }}</p>
            <Table height="300" :columns="columns2" :data="data2"></Table>
        </div>
        <div style="margin-top:10px;">
            <p style="font-size:16px;font-weight:bold;margin-bottom:10px;color:#1a1a1a">{{ $t('node_downlink') }}</p>
            <Table height="300" :columns="columns3" :data="data3"></Table>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    name: 'uplink',
    props: {
        devEui: {
            type: String,
        }
    },
    data () {
        return {
            columns1: [
                {
                    title: 'devEUI',
                    key: 'devEUI',
                    fixed: 'left',
                    width: 160
                },
                {
                    title: 'adr',
                    key: 'adr',
                    width: 80
                },
                {
                    title: 'fCnt',
                    key: 'fCnt',
                    width: 80
                },
                {
                    title: 'mtype',
                    key: 'mtype',
                    width: 180
                },
                {
                    title: 'mac',
                    key: 'mac',
                    width: 180
                },
                {
                    title: 'time',
                    key: 'time',
                    width: 175
                },
                {
                    title: 'frequency',
                    key: 'frequency',
                    width: 130
                },
                {
                    title: 'channel',
                    key: 'channel',
                    width: 90
                },
                {
                    title: 'rfChain',
                    key: 'rfChain',
                    width: 90
                },
                {
                    title: 'crcStatus',
                    key: 'crcStatus',
                    width: 100
                },
                {
                    title: 'codeRate',
                    key: 'codeRate',
                    width: 100
                },
                {
                    title: 'rssi',
                    key: 'rssi',
                    width: 90
                },
                {
                    title: 'loRaSNR',
                    key: 'loRaSNR',
                    width: 90
                },
                {
                    title: 'size',
                    key: 'size',
                    width: 70
                },
                {
                    title: 'modulation',
                    key: 'modulation',
                    width: 125
                },
                {
                    title: 'spreadFactor',
                    key: 'spreadFactor',
                    width: 120
                },
                {
                    title: 'bandwidth',
                    key: 'bandwidth',
                    width: 110
                }
            ],
            data1: [],
            columns2: [
                {
                    title: 'devEUI',
                    key: 'dev_eui',
                    width: 160
                },
                {
                    title: 'time',
                    key: 'times',
                    width: 220
                },
                {
                    title: 'fPort',
                    key: 'fport',
                    width: 80
                },
                {
                    title: 'fCnt',
                    key: 'fcnt',
                    width: 80
                },
                {
                    title: 'gatewayCount',
                    key: 'gateway_count',
                    width: 130
                },
                {
                    title: 'rssi',
                    key: 'rssi',
                    width: 80
                },
                {
                    title: 'loRaSNR',
                    key: 'lora_snr',
                    width: 100
                },
                {
                    title: 'data',
                    key: 'data'
                }
            ],
            data2: [],
            columns3: [
                {
                    title: 'gatewayEUI',
                    key: 'gatewayEUI'
                },
                {
                    title: 'fCntDown',
                    key: 'fcntDown'
                },
                {
                    title: 'frequency',
                    key: 'frequency'
                }
            ],
            data3: [],
            //downlink: null,
            //rx: null,
            //rxinfo: null,
            pageSize: 25,
            pageCount: 100,
            rxinfo_timeout: {},
            rx_timeout: {},
            downlink_timeout: {},
            cnt:0
        }
    },
    methods: {
        ...mapActions([
            'mqtt'
        ]),
        rxinfo () {
            let postData = {
                dev_eui: this.devEui,
                type: 'node',
                topic: 'rxinfo',
                limit: 25
            }
            this.mqtt(postData).then(res => {
                let datas = res.data.rs
                this.data1 = []
                datas.map(data => {
                    data = data.payload
                    if(data.mtype == 2){
                        data.mtype = 'UnConfirmedDateUp'
                    }else{
                        data.mtype = 'ConfirmedDateUp'
                    }

                    let items = {
                        devEUI: data.dev_eui,
                        adr: data.adr,
                        fCnt: data.fcnt,
                        mtype: data.mtype,
                        time: moment(data.ts).format('YYYY-MM-DD HH:mm:ss')
                    };

                    for (var i in data.rxinfo) {
                        items.mac = data.rxinfo[i].mac
                        items.frequency = data.rxinfo[i].frequency
                        items.channel = data.rxinfo[i].channel
                        items.rfChain = data.rxinfo[i].rf_chain
                        items.crcStatus = data.rxinfo[i].crc_status
                        items.codeRate = data.rxinfo[i].code_rate
                        items.rssi = data.rxinfo[i].rssi
                        items.loRaSNR = data.rxinfo[i].lora_snr
                        items.size = data.rxinfo[i].size
                        items.modulation = data.rxinfo[i].data_rate.modulation
                        items.spreadFactor = data.rxinfo[i].data_rate.spread_factor
                        items.bandwidth = data.rxinfo[i].data_rate.band_width
                    }
                    this.data1.push(items);
                })
                
                if(this.$route.name === 'node_detail') this.timeoutHander()
            }).catch(err => console.log(err))
        },
        rx () {
            let postData = {
                dev_eui: this.devEui,
                type: 'node',
                topic: 'rx',
                limit: 25
            }
            this.mqtt(postData).then(res => {
                let data = res.data.rs
                this.data2 = data.map(item => {
                    let payload = item.payload
                    payload.times = moment(payload.ts).format('YYYY-MM-DD HH:mm:ss')
                    return payload
                })
                if(this.$route.name === 'node_detail') this.timeoutHander()
            }).catch(err => console.log(err))
        },
        downlink () {
            let postData = {
                dev_eui: this.devEui,
                type: 'node',
                topic: 'downlink',
                limit: 25
            }
            this.mqtt(postData).then(res => {
                let data = res.data.rs
                this.data3 = data.map(item => item.payload)
                if(this.$route.name === 'node_detail') this.timeoutHander()
            }).catch(err => console.log(err))
        },
        timeoutHander() {
            this.cnt++
            if(this.cnt === 3){
                this.cnt = 0
                
                this.rxinfo_timeout = setTimeout(() => {
                    this.rxinfo()
                    this.rx()
                    this.downlink()
                }, 5000)
            }
        }
    },
    beforeDestroy () {
        //this.rxinfo.end();
        //this.rx.end();
        //this.downlink.end();
        clearTimeout(this.rxinfo_timeout)
    },
    created () {
        this.rxinfo()
        this.rx()
        this.downlink()
    }
}
</script>