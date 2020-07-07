<style lang="less" scoped src='./workOrder.less'></style>
<template>
  <div id="workOrder" >
    <div class="content boxShadow">
      <div class="header">
        <span>{{$t('work_order_list')}} </span>
        <div @click="add_workOrder" v-if="$route.meta.access.includes('1000.03.001')">
            <img src="../../../assets/images/add18.svg">
            {{$t('add_work_order')}}
        </div>
      </div>
      <Row type="flex" class="content_select">
        <div class="content_select_input">
          <p >{{$t('work_order_number')}}：</p>
          <Input type="text" v-model="searchFrom.no" style="width:200px;"/>
        </div> 
        <div class="content_select_input">
          <p>{{$t('subject')}}：</p>
          <Input type="text"  v-model="searchFrom.summary" style="width:200px;"/>
        </div>
        <div class="content_select_input">
          <p>{{$t('status')}}：</p>
          <i-col span="12" style="width:100px;">
            <i-select v-model="searchFrom.state" filterable clearable>
              <i-option :value="0">{{$t('to_do')}}</i-option>
              <i-option :value="1">{{$t('in_hand')}}</i-option>
              <i-option :value="2">{{$t('closed')}}</i-option>
              <i-option :value="3">{{$t('canceled')}}</i-option>
            </i-select>
          </i-col>
        </div>
        <div class="content_select_input">
          <p>{{$t('grid_group')}}：</p>
          <Cascader change-on-select :data="groups" @on-change="changeGroup1" v-model="searchFrom.notifyGroup" s></Cascader>
        </div>
        <div class="content_select_input">
          <p >{{$t('level')}}：</p>
          <i-col span="12" style="width:100px;">
            <i-select v-model="searchFrom.level" filterable clearable>
              <i-option :value="1">1</i-option>
              <i-option :value="2">2</i-option>
              <i-option :value="3">3</i-option>
              <i-option :value="4">4</i-option>
              <i-option :value="5">5</i-option>
            </i-select>
          </i-col>
        </div>
        <div class="select_button" @click="search">{{$t('query')}}</div>
      </Row>
      <Table ref="table" :loading="workOrderList.loading" :height="tableHeight" :columns="workOrderList.columns" :data="workOrderList.data"></Table>
      <div class="list_bottom">
        <Page :total="workOrderList.total" :page-size="workOrderList.pageSize" @on-change="nextPage" show-elevator show-total></Page>
      </div>
    </div>
    <transition name="slide-fade">
      <div class="bg" v-if="show_bg" @click="close"></div>
    </transition>
    <!-- 添加工单 -->
    <transition name="detail-fade">
      <div class="add_workOrder" v-show="show_workOrder">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="160">
          <div class="add_title">
            <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
            {{$t('add_work_order')}}
          </div>
          <Row class="add_scroll">
            <FormItem :label="$t('work_order_subject')+'：'" prop="summary" style="margin-top:20px">
              <Input type="text" v-model="formValidate.summary"  style="width:400px"/>
            </FormItem>
            <FormItem :label="$t('work_order_type')+'：'" prop="type" style="margin-top:20px">
              <Row>
                <i-col span="12" style="width:200px;">
                    <i-select v-model="formValidate.type" filterable clearable>
                      <i-option value="1">{{$t('ordinary_work_order')}}</i-option>
                      <i-option value="2">{{$t('alarm_work_order')}}</i-option>
                      <i-option value="3">{{$t('service_work_order')}}</i-option>
                      <i-option value="4">{{$t('inspection_work_order')}}</i-option>
                    </i-select>
                </i-col>
              </Row>
            </FormItem>
            <FormItem :label="$t('priority_level')+'：'" prop="level" style="margin-top:20px">
              <Row>
                <i-col span="12" style="width:200px;">
                    <i-select v-model="formValidate.level" filterable clearable>
                      <i-option value="1">1</i-option>
                      <i-option value="2">2</i-option>
                      <i-option value="3">3</i-option>
                      <i-option value="4">4</i-option>
                      <i-option value="5">5</i-option>
                    </i-select>
                </i-col>
              </Row>
            </FormItem>
            <FormItem :label="$t('work_order_detail')+'：'" prop="remarks">
              <i-col>
                <Input type="textarea" v-model="formValidate.remarks" style="width:400px;"/>
              </i-col>
            </FormItem>
            <FormItem :label="$t('work_order_dispatch')+'：'" prop="groupParentIds" style="margin-top:20px">
              <Row>
                <i-col span="10">
                  <Cascader change-on-select :data="groups" @on-change="changeGroup" v-model="formValidate.groupParentIds" style="width:200px;margin-top:5px"></Cascader>
                </i-col>
                <i-col  class="tip"> {{$t('ple_select_workorder_grpup')}}</i-col>
              </Row>
            </FormItem>
            <FormItem :label="$t('notice_way')+'：'" prop="notifyMethod" v-show="formValidate.notifyGroup">
              <i-col>
                <CheckboxGroup v-model="notifyMethod" @on-change="notifyMethodChange">
                  <Checkbox label="0">{{$t('no_notice')}}</Checkbox>
                  <Checkbox label="1">{{$t('sms_notice')}}</Checkbox>
                  <!-- <Checkbox label="2">{{$t('email_notice')}}</Checkbox> -->
                  <Checkbox label="3">{{$t('wechat_notice')}}</Checkbox>
                  <Checkbox label="4">{{$t('votice_notice')}}</Checkbox>
                </CheckboxGroup>
              </i-col>
            </FormItem>
          </Row>
          <div class="add_bottom">
            <div class="add_button" @click="handleSubmit('formValidate')">{{$t('save')}}</div>
          </div>
          <Spin size="large" fix v-if="spinShow"></Spin>
        </Form>
      </div>
    </transition>
    <!-- 工单详情 -->
    <transition name="width800-fade">
      <div class="width_800" v-show="workDeatil">
        <Form ref="formValidate2" :model="formValidate2" :label-width="160">
        <div class="add_title">
          <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
          {{$t('work_order_detail')}}
        </div>
        <Row class="add_scroll">
          <FormItem :label="$t('work_order_number')+'：'" prop="" style="margin-top:20px">
            <Input type="text" v-model="formValidate2.no" disabled style="width:400px"/>
          </FormItem>
          <FormItem :label="$t('work_order_subject')+'：'" prop="" style="margin-top:20px">
            <Input type="text" v-model="formValidate2.summary" disabled style="width:400px"/>
          </FormItem>
          <FormItem :label="$t('work_order_type')+'：'" prop="" style="margin-top:20px">
            <Row>
              <i-col span="12" style="width:200px;">
                  <i-select v-model="formValidate2.type" disabled filterable clearable>
                    <i-option value="1">{{$t('ordinary_work_order')}}</i-option>
                    <i-option value="2">{{$t('alarm_work_order')}}</i-option>
                    <i-option value="3">{{$t('service_work_order')}}</i-option>
                    <i-option value="4">{{$t('inspection_work_order')}}</i-option>
                  </i-select>
              </i-col>
            </Row>
          </FormItem>
          <FormItem :label="$t('priority_level')+'：'" prop="" style="margin-top:20px">
            <Row>
              <i-col span="12" style="width:200px;">
                  <i-select v-model="formValidate2.level" disabled filterable clearable>
                    <i-option value="1">1</i-option>
                    <i-option value="2">2</i-option>
                    <i-option value="3">3</i-option>
                    <i-option value="4">4</i-option>
                    <i-option value="5">5</i-option>
                  </i-select>
              </i-col>
            </Row>
          </FormItem>
          <FormItem :label="$t('work_order_status')+'：'" prop="" style="margin-top:20px">
            <Row>
              <i-col span="12" style="width:200px;">
                  <i-select v-model="formValidate2.state" disabled filterable clearable>
                    <i-option value="0">{{$t('to_do')}}</i-option>
                    <i-option value="1">{{$t('in_hand')}}</i-option>
                    <i-option value="2">{{$t('closed')}}</i-option>
                    <i-option value="3">{{$t('canceled')}}</i-option>
                  </i-select>
              </i-col>
            </Row>
          </FormItem>
          <FormItem :label="$t('work_order_detail')+'：'" prop="">
            <i-col>
              <Input type="textarea" v-model="formValidate2.remarks" style="width:400px;"/>
            </i-col>
          </FormItem>
          <FormItem :label="$t('work_order_dispatch')+'：'" prop="" style="margin-top:20px">
            <Input type="text" v-model="formValidate2.notifyGroupName" disabled style="width:200px"/>
          </FormItem>
          <FormItem :label="$t('notice_way')+'：'" prop="">
            <i-col>
              <CheckboxGroup v-model="formValidate2.notifyMethod"  >
                <Checkbox label="0" disabled>{{$t('no_notice')}}</Checkbox>
                <Checkbox label="1" disabled>{{$t('sms_notice')}}</Checkbox>
                <Checkbox label="2" disabled>{{$t('email_notice')}}</Checkbox>
                <Checkbox label="3" disabled>{{$t('wechat_notice')}}</Checkbox>
                <Checkbox label="4" disabled>{{$t('votice_notice')}}</Checkbox>
              </CheckboxGroup>
            </i-col>
          </FormItem>
          <Row type="flex" style="padding:30px 60px;">
            <i-col span="3">{{$t('history')}}：</i-col>
            <i-col>
              <Timeline>
                <TimelineItem v-for="(item,i) in historyList" :key="i">
                  <p>{{item.createDate}}</p>
                  <p>{{item.workCnt}}</p>
                </TimelineItem>
              </Timeline>
            </i-col>
          </Row>
        </Row>
        <div class="add_bottom">
          <div class="add_button" @click="close_workOrder" v-if="formValidate2.state != 2 && this.$route.meta.access.includes('1000.03.001')">{{$t('close_work_order')}}</div>
          <div class="add_button" @click="close" v-if="formValidate2.state == 2">{{$t('return')}}</div>
        </div>
        </Form>
        <Spin size="large" fix v-if="closeWorkOrderShow"></Spin>
      </div>
    </transition>
    <!-- 关闭工单信息 -->
    <transition name="width400-fade">
      <div class="inner_400" v-show="show_close">
        <Form ref="formValidate1" :model="formValidate1" :rules="ruleValidate1" label-position="top">
          <div class="add_title" >
              <img src="../../../assets/images/node/close.svg" alt="close" @click="close1">
              {{$t('close_work_order')}}
          </div>
          <Row class="add_scroll inner" style="padding:0 30px;">
            <FormItem :label="$t('proc_result')+'：'" prop="result" style="margin-top:20px">
              <Input type="textarea" v-model="formValidate1.result" style="width:100%"/>
            </FormItem>
          </Row>
          <div class="add_bottom" style="width:410px;">
            <div class="add_button" @click="closeWorkOrders('formValidate1')">{{$t('confirm')}}</div>
          </div>
          <Spin size="large" fix v-if="closeWorkOrderShow"></Spin>
          </Form>
      </div>
    </transition>
  </div>
</template>
<script>

import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      tableHeight:null,
      show_bg: false,
      show_workOrder: false,
      workDeatil: false,
      show_close: false,
      typeList: {
        '1': this.$t('ordinary_work_order'),
        '2': this.$t('alarm_work_order'),
        '3': this.$t('service_work_order'),
        '4': this.$t('inspection_work_order')
      },
      stateList: {
        '0': this.$t('to_do'),
        '1': this.$t('in_hand'),
        '2': this.$t('closed'),
        '3': this.$t('canceled')
      },
      workOrderList: {
        columns: [
          {
            title: this.$t('work_order_number'),
            key: 'no',
            width: 240,
          },
          {
            title: this.$t('work_order_subject'),
            key: 'summary',
            minWidth:70,
          },
          {
            title: this.$t('priority_level'),
            key: 'level',
            minWidth:70,
          },
          {
            title: this.$t('work_order_type'),
            key: 'type',
            minWidth:100,
            render: (h, params) => {
              return h('span', this.typeList[params.row.type])
            }
          },
          {
            title: this.$t('grid_group'),
            key: 'notifyGroupName',
            minWidth:70,
          },
          {
            title: this.$t('status'),
            key: 'state',
            minWidth:70,
            render: (h, params) => {
              return h('span', this.stateList[params.row.state])
            }
          },
          {
            title: this.$t('create_dt'),
            key:'createDate',
            minWidth:70,
          },
          {
            title: this.$t('op'),
            key: 'action',
            minWidth:70,
            render: (h, params) => {
              let btn = []

              if(this.$route.meta.access.includes('1000.03.001')) {
                btn.push(
                  h('Tooltip',{
                    props:{
                      content: this.$t('detail'),
                      placement:'top',
                    }
                  }, [
                    h('img',{
                      attrs: {
                        src: require("../../../assets/images/node/right1.svg"),
                      },
                      style: {
                        width:'16px',
                        marginTop:'4px',
                        cursor:'pointer'
                      },
                      on: {
                        click: () => {
                          this.formValidate2 = params.row
                          this.getWorkOrderHistory({orderId:this.formValidate2.id}).then(res =>{
                            this.historyList = res.data.rs.data
                          })
                          this.show_bg = true
                          this.workDeatil = true
                          }
                        }
                    })
                  ])
                )
              }
              return h('div', btn)
            }
          },
        ],
        data: [],
        pageSize: 10,
        pageNo: 1,
        name: '',
        total: 0,
        loading: false
      },
      searchFrom: {
        no: '',
        summary: '',
        state: '',
        level: '',
        notifyGroup:'',
      },
      formValidate: {},
      ruleValidate: {
        summary: [
          { required: true, message: this.$t('ple_fill_work_order_subject'), trigger: 'blur' }
        ],
        type:[
          { required: true, message: this.$t('ple_select_work_order_type'), trigger:'change' }
        ],
        level:[
          { required: true, message: this.$t('ple_select_priority_level'), trigger:'change' }
        ],
        remarks: [
          { required: true, message: this.$t('ple_fill_work_order_detail'), trigger: 'blur' }
        ],
        groupParentIds:[
          { required: true, type: 'array', message: this.$t('ple_select_work_order_dispatch'), trigger:'change' }
        ],
        notifyMethod:[
          { required: true, type: 'array', message: this.$t('ple_select_notice'), trigger:'change' }
        ]
      },
      spinShow: false,
      closeWorkOrderShow: false,
      closeModel: {
        status: false,
        loading: true,
      },
      formValidate1: {},
      ruleValidate1:  {
        result: [
          { required: true, message: this.$t('ple_fill_proc_result'), trigger: 'blur' }
        ]
      },
      // 工单详情
      formValidate2: {},
      ruleValidate2:  {
        result: [
          { required: true, message: this.$t('ple_fill_proc_result'), trigger: 'blur' }
        ]
      },
      historyList:[],
      notifyMethod: []
    }
  },
  computed: {
    ...mapGetters([
      'groups'
    ])
  },
  methods: {
    ...mapActions([
      'getWorkOrderList',
      'createWorkOrder',
      'closeWorkOrder',
      'getWorkOrderHistory'
    ]),
    // 获取节点列表
    init () {
      // this.workOrderList.loading = true
      const data = {
        pageSize: this.workOrderList.pageSize, 
        pageNo: this.workOrderList.pageNo, 
        ...this.searchFrom,
      }
      this.getWorkOrderList(data).then(res => {
        const data = res.data.rs
        this.workOrderList.data = data.data.list
        this.workOrderList.data.map( e => {
          e.notifyMethod = e.notifyMethod.split(',')
        })
        this.workOrderList.total = data.data.count
        this.workOrderList.loading = false
      })
    },
    nextPage (page) {
      this.workOrderList.pageNo = page
      this.init()
    },
    search (){
      this.init()
    },
    notifyMethodChange (event) {
      if (event.includes('0')) this.notifyMethod = this.formValidate.notifyMethod = ['0']
      if (event[0] === '0') {
        event.shift()
        this.notifyMethod = this.formValidate.notifyMethod = event
      }
    },
    changeGroup (event) {
      const le = event[event.length - 1]
      this.formValidate.notifyGroup = le
      this.notifyMethod = this.formValidate.notifyMethod = this.searchNotifyMethod(this.groups, le)
    },
    changeGroup1 (event) {
      const le = event[event.length - 1]
      this.searchFrom.notifyGroup = le
    },
    // 递归查找通知方式
    searchNotifyMethod (arrs, le){
      let noti = []
      const searchNotify = arr => {
        if(!arr) return null
        arr.forEach(v => {
          if(v.id === le){
            noti = v.notifyMethod.split(',')
          }else{
            if(v.children && v.children.length > 0) searchNotify(v.children)
          }
        })
        return noti
      }
      return searchNotify(arrs)
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.spinShow = true
          let data = JSON.parse(JSON.stringify(this.$refs[name].model))
          data.notifyMethod = this.notifyMethod.join(',')
          this.createWorkOrder(data).then(res => {
            this.spinShow = false
            if (res.data.code !== 0) return
            this.$Message.success(this.$t('save_ok'))
            this.close()
            this.init()
          }).catch(err => this.spinShow = false)
        } else {
          this.$Message.error(this.$t('unvalid_param'))
        }
      })
    },
    closeWorkOrders (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          const data = {
            orderId: this.formValidate2.id,
            result: this.formValidate1.result
          }
          this.closeWorkOrderShow = true
          this.closeWorkOrder(data).then(res => {
            this.closeWorkOrderShow = false
            if (res.data.code !== 0) return
            this.$Message.success(this.$t('close_success'))
            this.close()
            this.init()
            this.$refs[name].resetFields()
          }).catch(err => this.closeWorkOrderShow = false)
        }else{
          this.$Message.error(this.$t('unvalid_param'))
        }
      })
    },
    loadConfirm (name) {
      this[name].loading = false
      this.$nextTick(() => {
        this[name].loading = true
      })
    },
    close () {
      this.show_bg = false
      this.workDeatil = false
      this.show_workOrder = false
      this.show_close = false
    },
    close1 () {
      this.show_close = false
    },
    close_workOrder () {
      this.show_close = true
    },
    add_workOrder () {
      this.show_bg = true
      this.show_workOrder = true
    }
  },
  mounted () {
    this.$nextTick(()=>{
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
    })
    window.onresize = () => {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
    }
  },
  created() {
    this.$store.dispatch('getGroups', {useFor: 1})
    this.init()
  }
}
</script>
