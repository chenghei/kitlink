<style lang="less" scoped src="./user.less"></style>
<template>
  <div id="grid">
    <div class="content boxShadow">
      <div class="header">
        <span>{{$t('personnel_list')}}</span>
        <div @click="add" v-if="$route.meta.access.includes('1000.04.001')">
          <img src="../../../assets/images/add18.svg">
          {{$t('add_personnel')}}
        </div>
      </div>
      <Row type="flex" class="content_select"> 
        <div class="content_select_input">
          <p>{{$t('name1')}}：</p>
          <Input type="text" v-model="griderList.name" style="width:300px"/>
        </div>
        <div class="content_select_input">
          <p>{{$t('mobile')}}：</p>
          <Input type="text" v-model="griderList.mobile" style="width:300px"/>
        </div>
        <div class="select_button" @click="init">{{$t('query')}}</div>
      </Row>
      <Table ref="table" :loading="griderList.loading" :height="tableHeight" :columns="griderList.columns" :data="griderList.data"></Table>
      <div class="list_bottom">
          <Page :total="griderList.total" :page-size="griderList.pageSize" 
          @on-change="nextPage" show-elevator show-total></Page>
      </div>
    </div>
    <transition name="slide-fade">
      <div class="bg" v-if="show_bg" @click="close"></div>
    </transition>
    <!-- 添加人员 -->
    <transition name="width800-fade">
      <div class="width_800" v-if="show_user">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="140">
          <div class="add_title">
            <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
            {{title}}
          </div>
          <Row class="add_scroll">
            <FormItem :label="$t('name1')+'：'" prop="name" style="margin-top:20px">
              <Input type="text" v-model="formValidate.name" style="width:200px"/>
            </FormItem>
            <FormItem :label="$t('mobile')+'：'" prop="mobile" style="margin-top:20px">
              <Input type="text" v-model="formValidate.mobile" style="width:200px"/>
            </FormItem>
            <FormItem :label="$t('password')+'：'" prop="newPassword" style="margin-top:20px">
              <Input type="password" v-model="formValidate.newPassword" style="width:200px"/>
            </FormItem>
            <FormItem :label="$t('cfm_password')+'：'" prop="passwdCheck" style="margin-top:20px">
              <Input type="password" v-model="formValidate.passwdCheck" style="width:200px"/>
            </FormItem>
            <FormItem :label="$t('gender')+'：'" prop="gender" style="margin-top:20px">
              <Row>
                <i-col span="12" style="width:100px">
                  <i-select v-model="formValidate.gender" filterable>
                    <i-option value="1">{{$t('gender_male')}}</i-option>
                    <i-option value="2">{{$t('gender_female')}}</i-option>
                  </i-select>
                </i-col>
              </Row>
            </FormItem>
            <FormItem :label="$t('validity_month')+'：'" prop="endCount" style="margin-top:20px">
              <Row>
                <i-col span="12" style="width:100px">
                  <i-select v-model="formValidate.endCount" @on-change="changeEndCount" filterable>
                    <i-option value="-1" v-show="title != $t('add_personnel')">{{$t('account_invalid_currrent')}}</i-option>
                    <i-option value="0">{{$t('account_valid_option_forever')}}</i-option>
                    <i-option value="1">1</i-option>
                    <i-option value="2">2</i-option>
                    <i-option value="3">3</i-option>
                    <i-option value="4">4</i-option>
                    <i-option value="5">5</i-option>
                    <i-option value="6">6</i-option>
                    <i-option value="7">7</i-option>
                    <i-option value="8">8</i-option>
                    <i-option value="9">9</i-option>
                    <i-option value="10">10</i-option>
                    <i-option value="11">11</i-option>
                    <i-option value="12">12</i-option>
                  </i-select>
                </i-col>
                <i-col span="12" style="padding-left:10px;" v-show="formValidate.endCount">
                  {{formValidate.endDate?formValidate.endDate:'永久'}}
                </i-col>
              </Row>
            </FormItem>
            <FormItem :label="$t('remark')+'：'" prop="remarks">
              <i-col>
                <Input type="textarea" v-model="formValidate.remarks" style="width:400px;"/>
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
    <!-- 分组管理 -->
    <transition name="width400-fade">
      <div class="add_group" v-if="show_group">
          <div class="add_title">
            <img src="../../../assets/images/node/close.svg" @click="close">
            {{$t('group_manager')}}
          </div>
          <Row class="add_scroll">
            <Tree ref="tree" :data="groupData" show-checkbox multiple check-strictly check-directly></Tree>
          </Row>
          <div class="add_bottom" style="width:410px;">
            <div class="add_button" @click="saveGroup()">{{$t('save')}}</div>
          </div>
          <Spin size="large" fix v-if="groupForm.spinShow"></Spin>
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
            <Button type="success" :loading="deleteModel.loading" @click="deleteGriders">{{$t('confirm')}}</Button>
            <Button @click="deleteModel.status = false">{{$t('cancel')}}</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { parseJson } from '@/libs/util'

export default {
  data () {
    const validateMobile = (rule, value ,callback) => {
      if (!value) {
        return callback(new Error(this.$t('input_mobile')))
      } else {
        let data = {mobile: value, griderId: this.formValidate.id}
        this.mobileCheck(data).then(res => {
          if(res.data.code !== 0) callback(new Error(res.data.msg))
          if(res.data.rs.exist === true){
            callback(new Error(this.$t('mobile_exists')))
          }else{
            callback()
          }
        }).catch(err => console.log(err))
      }
    }

    const validatePass = (rule, value, callback) => {
      if (this.title === this.$t('add_personnel') && !value) {
        callback(new Error(this.$t('input_password')))
      }else{
        // 对第二个密码框单独验证
        this.$refs.formValidate.validateField('passwdCheck')
        callback()
      }
        
    }

    const validatePassCheck = (rule, value, callback) => {
      if (this.title === this.$t('add_personnel') && !value) {
        callback(new Error(this.$t('input_password_again')))
      } else if (value !== this.formValidate.newPassword) {
        callback(new Error(this.$t('inconsistent_password')))
      } else {
        callback()
      }
    }

    return {
      delTitle: '',
      title: this.$t('add_personnel'),
      tableHeight:null,
      show_bg:false,
      show_user:false,
      show_group:false,
      griderList: {
        columns: [
          {
            title: this.$t('name1'),
            key: 'name',
            minWidth:100,
          },
          {
            title: this.$t('mobile'),
            key: 'mobile',
            minWidth:70,
          },
          {
            title: this.$t('gender'),
            minWidth:70,
            render: (h, params) => {
              return h('span', params.row.gender === '1' ? this.$t('gender_male') : this.$t('gender_female'))
            }
          },
          {
            title: this.$t("valid_time"),
            render: (h, params) => {
              return h('span', params.row.endDate ? params.row.endDate  : '永久')
            },
            minWidth:70,
          },
          {
            title: this.$t('remark'),
            key: 'remarks',
            minWidth:70,
          },
          {
            title: this.$t('op'),
            key: 'action',
            width:230,
            render: (h, params) => {
              let btn = []

              if(this.$route.meta.access.includes('1000.04.001')) {
                btn.push(
                  h('Tooltip',{
                    props:{
                    content: this.$t('group_manager'),
                    placement:'top',
                    },
                    style: {
                        marginRight: '40px'
                    }
                  }, [
                    h('img', {
                      attrs: {
                        src: require("../../../assets/images/fenzuguanli.svg"),
                      },
                      style: {
                        width:'16px',
                        marginTop:'4px',
                        cursor:'pointer'
                      },
                      on: {
                        click: () => {
                          this.show_group = true
                          this.show_bg = true
                          this.groupForm.griderId = params.row.id
                          this.getGroups(params.row.id)
                        }
                      }
                    })
                  ]),
                  h('Tooltip',{
                    props:{
                    content: this.$t('edit'),
                    placement:'top',
                    },
                    style: {
                        marginRight: '40px'
                    }
                  }, [
                    h('img', {
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
                          this.formValidate = JSON.parse(JSON.stringify(params.row)) 
                          this.formValidate.nowDate = this.formValidate.endDate
                          this.formValidate.endCount = '-1'
                          this.title = this.$t('e_personnel')
                          this.show_bg = true
                          this.show_user = true
                        }
                      }
                    })
                  ])
                )
              }

              if(this.$route.meta.access.includes('1000.04.002')) {
                btn.push(
                  h('Tooltip',{
                    props:{
                    content: this.$t('delete'),
                    placement:'top',
                    },
                    style: {
                        marginRight: '40px'
                    }
                  }, [
                    h('img', {
                      attrs: {
                        src: require("../../../assets/images/node/right3.svg"),
                      },
                      style: {
                        marginRight: '5px',
                        width:'16px',
                        marginTop:'4px',
                        cursor:'pointer'
                      },
                      on: {
                        click: () => {
                          this.deleteModel.status = true
                          this.deleteModel.formValidate.id = params.row.id
                          this.delTitle = params.row.name
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
        name: '',
        mobile: '',
        pageSize: 10,
        pageNo: 1,
        total: 0,
        loading: false
      },
      formValidate: {
        endDate:'',
        nowDate: '',
        gender: '1'
      },
      spinShow: false,
      ruleValidate: {
        name:[
          { required: true, message: this.$t('input_name'), trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: validateMobile, trigger: 'blur' }
        ],
        newPassword:[
          { validator: validatePass, trigger: 'blur' }
        ],
        passwdCheck:[
          { validator: validatePassCheck, trigger: 'blur' }
        ],
        gender:[
          { required: true, message: this.$t('select_gender'), trigger: 'change' }
        ],
        endCount:[
          { required: true, message: this.$t('select_valid'), trigger: 'change' }
        ],
      },
      // 树状图数据
      groupData: [],
      groups: [],
      deleteModel: {
        status: false,
        loading: false,
        formValidate: {}
      },
      groupForm: {
        griderId: '',
        spinShow: false
      }
    }
  },
  methods: {
    ...mapActions([
      'getGriderList',
      'getGirderGroups',
      'saveGrider',
      'deleteGrider',
      'getGroupsList',
      'groupsModify',
      'mobileCheck'
    ]),
    init() {
      const data = {
        pageSize: this.griderList.pageSize, 
        pageNo: this.griderList.pageNo, 
        name: this.griderList.name,
        mobile: this.griderList.mobile
      }
      this.getGriderList(data).then(res => {
        const data = res.data.rs
        this.griderList.data = data.data.list
        this.griderList.total = data.data.count
        this.griderList.loading = false
      })
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.spinShow = true
          if(parseInt(this.$refs[name].model.endCount) > 0) this.$refs[name].model.endDate = `${this.$refs[name].model.endDate} 00:00:00`
          this.saveGrider(this.$refs[name].model).then(res => {
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
    nextPage(page) {
      this.griderList.pageNo = page
      this.init()
    },
    changeEndCount(row) {
      if(row === '-1') {
        this.formValidate.endDate = this.formValidate.nowDate
        return
      }
      if(row === '0') {
        this.formValidate.endDate = ''
        return
      }
      
      this.formValidate.endDate = moment().add(parseInt(row), 'months').format('YYYY-MM-DD')
    },
    deleteGriders() {
      this.deleteModel.loading = true
      this.deleteGrider({griderId: this.deleteModel.formValidate.id}).then(res => {
        this.deleteModel.loading = false
        if (res.data.code !== 0) return
        this.deleteModel.status = false
        this.$Message.success(this.$t('delete_ok'))
        this.init()
      }).catch(err => this.deleteModel.loading = false)
    },
    getGroups(id) {
      this.getGirderGroups({griderId: id}).then(res => {
        const data = res.data.rs.data
        this.checkGroup(data)
      })
    },
    // 递归分组，显示勾选
    checkGroup(arr) {
      const userArr = arr.map(v => v.id)
      const toParse = arr => {
        arr.forEach(v => {
          if(userArr.includes(v.id)){
            this.$set(v, 'checked', true)
          }else{
            this.$set(v, 'checked', false)
          }
          if(v.children){
            toParse(v.children)
          }
        })
      }

      toParse(this.groupData)
    },
    saveGroup() {
      const nodes = this.$refs.tree.getCheckedNodes()
      const data = {
        griderId: this.groupForm.griderId,
        groups: nodes.map(v => v.id).join(',')
      }
      this.groupForm.spinShow = true
      this.groupsModify(data).then(res => {
        this.groupForm.spinShow = false
        if (res.data.code !== 0) return
        this.$Message.success(this.$t('save_ok'))
        this.close()
        this.init()
      }).catch(err => this.groupForm.spinShow = false)
    },
    add () {
      this.title = this.$t('add_personnel')
      this.show_bg = true
      this.show_user = true
      this.$nextTick(() => {
         this.$refs['formValidate'].resetFields();
         this.formValidate = {
          endDate:'',
          nowDate: '',
          gender: '1'
        }
      })
    },
    close () {
      this.show_bg = false
      this.show_user = false
      this.show_group = false
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
    this.getGroupsList({useFor: 1}).then(res => {
        this.groupData = this.groups = parseJson(res.data.rs.data)
    })
    this.init()
  }
}
</script>
