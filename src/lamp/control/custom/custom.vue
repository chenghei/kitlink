<style lang="less" scoped src="./custom.less"></style>
<template>
  <div class="content-body">
    
    <div class="content boxShadow">
      
      <div class="header">
        <span>{{$t('lamp_ctl')}}</span>
      </div>
      <Row type="flex"  class="content_select" justify="space-between">
        <Spin size="large" fix v-if="spinShow"></Spin>
        <Row type="flex">
        <div class="content_select_input" style="float:left">
          <p>{{$t('name')}}：</p> 
          <Input type="text" v-model="lampList.name" style="width:300px;"/>
        </div>
        <div class="select_button" @click="init">{{$t('query')}}</div>
        </Row>
        <Row type="flex" style="float:right">
          <div class="select_button" @click="openLamp">{{$t('open_lamp')}}</div>
          <div class="select_button" @click="closeLamp" style="background: rgb(237, 64, 20)">{{$t('close_lamp')}}</div>
          <div class="content_select_input">
            <p>{{$t('brightness')}}：</p>
            <i-col span="12" style="width:100px">
              <i-select v-model="selectLight" filterable>
                <i-option v-for="(item,i) in light" :key="i" :value="item">{{ item }}</i-option>
              </i-select>
            </i-col>
          </div>
          <div class="select_button" @click="changeLamp" style="margin-right:30px">{{$t('change_lamp')}}</div>
        </Row>
      </Row>
      <Table :loading="spinShow" highlight-row ref="table" :height="tableHeight" :columns="lampList.columns" :data="lampList.data" @on-row-click="getLampId"></Table>
      <div class="list_bottom">
          <Page :total="lampList.total" show-elevator show-total @on-change="nextPage"></Page>
      </div>
      
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      operation: -1,
      command_time: '',
      info_timeout: '',
      tableHeight: '',
      devEui:[],
      lampList:{
        columns:[
          {
            title: this.$t('rad_select'),
            width: 90,
            render: (h, params) => {
              let self = false
              if(params.row.devEui === this.selectDev) {
                self = true
              } else {
                self = false
              }
              return h('Radio',{
                props: {
                  value: self
                },
                on: {
                  'on-change': () => {
                    this.selectDev = params.row.devEui
                  }
                }
              })
            }
          },
          {
            title: this.$t('group'),
            minWidth: 70,
            render: (h, params) => {
              if(params.row.lampGroup) return h('span', params.row.lampGroup.name)
            }
          },
          {
            title: this.$t('name'),
            minWidth: 70,
            key: 'name'
          },
          {
            title: this.$t('code1'),
            minWidth: 70,
            key: 'devEui'
          },
          {
            title: this.$t('time'),
            minWidth: 70,
            render: (h, params) => {
              let time = ''
              this.lampDetail.map(e => {
                if(e.payload.dev_eui === params.row.devEui){
                  time = moment(e.payload.ts).format("YYYY-MM-DD HH:mm:ss")
                }
              })
              return h('span',time)
            }
          },
          {
            title: this.$t('lamp_status'),
            minWidth: 70,
            render: (h, params) => {
              let v = ''
              let status = ''
              if(params.row.state === 1 ){
                this.lampDetail.map(e => {
                  if(e.payload.dev_eui === params.row.devEui){
                    if(e.payload.payload.head.frame_type && e.payload.payload.head.frame_type === 3){
                      v = e.payload.payload.s1
                    } else {
                      v = e.payload.payload.light_value
                    }
                    if (v > 0) {
                      status = this.$t('open_lamp')
                    } else {
                      status = this.$t('close_lamp')
                    }
                  }
                })
              } else {
                status = this.$t('offline')
              }
              return h('span',status)
            }
          },
          {
            title: this.$t('brightness') + '（%）',
            minWidth: 70,
            render: (h, params) => {
              let v = '-'
              this.lampDetail.map(e => {
                if(e.payload.dev_eui === params.row.devEui){
                  if(e.payload.online === 1){
                    if(e.payload.payload.head.frame_type && e.payload.payload.head.frame_type === 3){
                      v = e.payload.payload.s1
                    } else {
                      v = e.payload.payload.light_value
                    }
                  }
                }
              })
              return h('span',v)
            }
          },
          {
            title: this.$t('vol') + '（V）',
            minWidth: 70,
            render: (h, params) => {
              let v = '-'
              this.lampDetail.map(e => {
                if(e.payload.dev_eui === params.row.devEui){
                  if(e.payload.online === 1){
                    if(e.payload.payload.head.frame_type && e.payload.payload.head.frame_type === 3){
                      v = e.payload.payload.v
                    } else {
                      v = e.payload.payload.power_v
                    }
                  }
                }
              })
              return h('span',v)
            }
          },
          {
            title: this.$t('electric_cur') + '（A）',
            minWidth: 70,
            render: (h, params) => {
              let v = '-'
              this.lampDetail.map(e => {
                if(e.payload.dev_eui === params.row.devEui){
                  if(e.payload.online === 1) {
                    if(e.payload.payload.head.frame_type && e.payload.payload.head.frame_type === 3){
                      v = e.payload.payload.a1
                    } else {
                      v = e.payload.payload.power_a
                    }
                  }
                }
              })
              return h('span',v)
            }
          },
          {
            title: this.$t('control_state'),
            minWidth: 70,
            render: (h, params) => {
              let content = ''
              this.lampDetail.map(e => {
                if(params.row.state === 1){
                  if((this.operation == 1 || this.operation == 2) && this.command_time < e.payload.ts && e.payload.dev_eui === params.row.devEui){
                    content = (this.operation == 1 ? this.$t('turn_on_light') : this.$t('change_light'))
                  }
                  if(this.operation == 0  && this.command_time < e.payload.ts && e.payload.dev_eui === params.row.devEui){
                      content = this.$t('turn_off_light') 
                  }
                }
              })
              return h('span',content)
            }
          },
        ],
        data:[],
        name: '',
        pageSize: 10,
        pageNo: 1,
        total:'',
        lampDetail:[],
      },
      selectDev: '',
      spinShow: false,
      selectLight: 0,
      light:[]
    }
  },
  methods: {
    ...mapActions([
      'getNodeList',
      'getNodesLatestData',
      'lightControlDownlink'
    ]),
    init () {
      const data = {
        pageSize: this.lampList.pageSize, 
        pageNo: this.lampList.pageNo, 
        name: this.lampList.name,
        'type.id': 200,
        model:'factory'
      }
      this.getNodeList(data).then(res => {
        const data = res.data.rs.data
        let devEui = []
        data.list.map(e => {
            devEui.push(e.devEui)
        })
        this.devEui = devEui
        this.getNodesLatestData({devEUIs:devEui.join(','),fields:'all'}).then(res => {
          this.lampDetail = res.data.rs.data
          data.list.forEach(e => {
            e.state = 0
            let state = this.lampDetail.find(v => v.payload.dev_eui === e.devEui)
            if(state && state.payload.online === 1){
              e.state = 1
            }
          })
          this.lampList.data = data.list
          this.lampList.total = data.count
          if (this.$route.name === "lamp_control_index_custom") this.timeoutHander()
        }).catch(err => {
          if (this.$route.name === "lamp_control_index_custom") this.timeoutHander()
        })
      })
    },
    openLamp () {
      let data = {
        devEui:this.selectDev,
        light: 100,
        command: "80",
        path: 0
      }
      if (this.selectDev) {
        this.spinShow = true
        this.lightControlDownlink(data).then(res => {
          this.spinShow = false
          if(res.data.code !== 0) return
          this.operation = 1
          this.command_time = new Date().getTime()
          this.$Message.success(this.$t('op_ok'));
        }).catch(err => this.spinShow = false)
      } else {
        this.$Message.error(this.$t('pls_select'));
      }
    },
    closeLamp () {
      let data = {
        devEui:this.selectDev,
        light: 0,
        command: "A0",
        path: 0
      }
      if (this.selectDev) {
        this.spinShow = true
        this.lightControlDownlink(data).then(res => {
          this.spinShow = false
          if(res.data.code !== 0) return
          this.operation = 0
          this.command_time = new Date().getTime()
          this.$Message.success(this.$t('op_ok'));
        }).catch(err => this.spinShow = false)
      } else {
        this.$Message.error(this.$t('pls_select'));
      }
    },
    changeLamp () {
      let data = {
        devEui:this.selectDev,
        light: this.selectLight,
        command: "00",
        path: 0
      }
      if (this.selectDev) {
        this.spinShow = true
        this.lightControlDownlink(data).then(res => {
          this.spinShow = false
          if(res.data.code !== 0) return
          this.operation = 2
          this.command_time = new Date().getTime()
          this.$Message.success(this.$t('op_ok'));
        }).catch(err => this.spinShow = false)
      } else {
        this.$Message.error(this.$t('pls_select'));
      }
    },
    timeoutHander () {
      clearTimeout(this.info_timeout)
      this.info_timeout = setTimeout(() => {
        this.getNodesLatestData({devEUIs:this.devEui.join(','),fields:'all'}).then(res => {
          this.lampDetail = res.data.rs.data
          this.lampList.data.forEach(e => {
            e.state = 0
            let state = this.lampDetail.find(v => v.payload.dev_eui === e.devEui)
            if(state && state.payload.online === 1){
              e.state = 1
            }
          })
          if (this.$route.name === "lamp_control_index_custom") this.timeoutHander()
        }).catch(err => {
          if (this.$route.name === "lamp_control_index_custom") this.timeoutHander()
        })
      },10000)
    },
    getLampId (row) {
      this.selectDev = row.devEui 
    },
    nextPage (page) {
      this.lampList.pageNo = page
      this.init()
    },
  },
  mounted () {
    for (var i = 0 ; i < 101 ; i++) {
      this.light.push(i)
    }
    this.init()
    this.$nextTick(()=>{
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
    })
    window.onresize = () => {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
    }
  },
  beforeDestroy () {
    clearTimeout(this.info_timeout)
  },
}
</script>

