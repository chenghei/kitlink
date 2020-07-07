<style lang="less" scoped src="./role.less"></style>
<template>
  <div class="content-body">
    <div class="content boxShadow">
      <div class="header">
        <span>{{$t('role_list')}}</span>
        <div @click="add" v-if="$route.meta.access.includes('1000.05.02.001')">
          <img src="../../../assets/images/add18.svg">
          {{$t('add_role')}}
        </div>
      </div>
      <Row type="flex" class="content_select"> 
        <div class="content_select_input">
        <p>{{$t('name')}}：</p>
        <Input type="text" v-model="roleList.name" style="width:300px"/>
        </div>
        <div class="select_button" @click="init">{{$t('query')}}</div>
      </Row>
      <Table ref="table" :loading="roleList.loading" :height="tableHeight" :columns="roleList.columns" :data="roleList.data"></Table>
    </div>
    <transition name="slide-fade">
      <div class="bg" v-if="show_bg" @click="close"></div>
    </transition>
    <!-- 添加角色 -->
    <transition name="width800-fade">
      <div class="width_800" v-if="show_user">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="160" :label-colon="true">
          <div class="add_title">
            <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
            {{title}}
          </div>
          <Row class="add_scroll">
            <FormItem :label="$t('org4')+'：'" prop="office.name" style="margin-top:20px">
              <Input search type="text" v-model="formValidate.office.name" style="width:400px" @on-focus="inner_region" readonly/>
            </FormItem>
            <FormItem :label="$t('name')+'：'" prop="name" style="margin-top:20px">
              <Row>
              <i-col span="12" style="width:200px">
                <Input type="text" v-model="formValidate.name" style="width:400px"/>
              </i-col>
              </Row>
            </FormItem>
            <FormItem :label="$t('sys_data_or_not')+'：'" prop="sysData" >
              <Row>
                <i-col span="10" style="width:80px;">
                  <i-select v-model="formValidate.sysData" filterable clearable>
                    <i-option value="0">{{$t('no')}}</i-option>
                    <i-option value="1">{{$t('yes')}}</i-option>
                  </i-select>
                </i-col>
                <i-col span="14" class="tip"> 
                  {{$t('sys_data_or_not_remark')}}
                </i-col>
              </Row>
            </FormItem>
            <FormItem :label="$t('data_scope')+'：'" prop="dataScope" style="margin-top:20px">
              <Row>
                <i-col span="12" style="width:200px">
                  <i-select v-model="formValidate.dataScope" filterable clearable>
                    <i-option v-for="item in dictType" :value="item.value" :key="item.id">{{ item.label }}</i-option>
                  </i-select>
                </i-col>
              </Row>
            </FormItem>
            <FormItem :label="$t('subsys')+'：'" prop="subsysIdList" >
              <i-col class="checkBoxmargin">
                <CheckboxGroup v-model="formValidate.subsysIdList">
                  <Checkbox v-for="item in subSysList" :label="item.id" :key="item.id">{{item.name}}</Checkbox>
                </CheckboxGroup>
              </i-col>
            </FormItem>
            <Row type="flex" style="padding-left:111px;">
                <i-col span="2">
                    <span>{{$t('role')}}：</span>
                </i-col>
                <i-col>
                    <Tree ref="tree" check-directly multiple :check-strictly='true' :data="copyMenus" show-checkbox @on-check-change="checkChange"></Tree>
                </i-col>
            </Row>
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
    <!-- 分配用户 -->
    <transition name="width800-fade">
      <div class="width_800" v-if="show_group">
        <Form ref="formValidate1" :model="formValidate1" :rules="ruleValidate" :label-width="30">
          <div class="add_title">
            <img src="../../../assets/images/node/close.svg" @click="close">
            {{$t('assign_user')}}
          </div>
          <Row class="add_scroll distribution">
            <div class="distribution_top">{{userList.row.name}}</div>
            <div class="distribution_content">
                <span>{{$t('ownership_institution')}}：</span><span style="margin-right:120px">{{userList.row.office.name}}</span>
                <span>{{$t('data_scope')}}：</span><span>{{userList.row.dataScopeName}}</span>
            </div>
            <div class="distribution_img">
                <img src="../../../assets/images/node/add.svg" @click="add_role">
                <div>{{$t('assign_user')}}</div>
            </div>
            <Table ref="table1" :height="tableHeight1" :loading="userList.loading" :columns="userList.columns" :data="userList.data"></Table>
          </Row>
          <!-- <div class="add_bottom">
            <div class="add_button" @click="handleSubmit('formValidate1')">{{$t('assign_user')}}</div>
          </div> -->
        </Form>
      </div>
    </transition>
    <!-- 分配用户/选择机构 -->
    <transition name="width400-fade">
        <div class="inner_400" v-show="open_inner">
          <div class="add_title" >
            <img src="../../../assets/images/node/close.svg" alt="close" @click="close1">
              {{title1}}
          </div>
          <Row class="add_scroll inner" style="padding:0 30px;">
            <Input search type="text" v-model="searchName" style="width:340px;margin-top:20px" :placeholder="$t('input_key')" @on-search="searchOranization" />
            <Tree :data="organ" @on-select-change="selectOranization" style="margin-top:40px"></Tree>
            <Row v-if="title1 == $t('assign_user')" style="margin-top:20px;flex-direction: column;" type="flex"> 
              <span style="margin-bottom:10px">{{$t('optional_users')}}：</span>
              <div class="tags" v-for="item in oranUser.list" :key="item.id"  @click="select_role(item)">{{item.name}}</div>
            </Row>
            <Row v-if="title1 == $t('assign_user')" style="margin-top:20px;flex-direction: column;" type="flex"> 
              <span style="margin-bottom:10px">{{$t('selected_users')}}：</span>
              <Tag  v-for="item in oranUser.selected" :key="item.id" :name="item.id" closable @on-close="handleClose2">{{item.name}}</Tag>
            </Row>
          </Row>
          <div class="add_bottom" style="width:410px;">
            <div class="add_button" @click="confirmOranization">{{$t('confirm')}}</div>
          </div>
          <Spin size="large" fix v-if="treeSpin"></Spin>
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
        <Button type="success" :loading="deleteModel.loading" @click="removeRole">{{$t('confirm')}}</Button>
        <Button @click="deleteModel.status = false">{{$t('cancel')}}</Button>
      </div>
    </Modal>

    <Modal v-model="userModifyModel.status">
      <p slot="header" style="color:#f60;text-align:center"></p>
      <div style="text-align:center" v-if="$i18n.locale==='en-US'">
          <p><Icon type="ios-alert-outline" size="22"/>Are you sure you want to remove user [{{userModifyModel.formValidate.name}}] from [{{userList.row.office.name}}]  ？</p>
          <p>{{$t('cant_restore_delete')}}</p>
      </div>
      <div style="text-align:center" v-if="$i18n.locale==='zh-CN'">
          <p><Icon type="ios-alert-outline" size="22"/>你确定要将用户 [{{userModifyModel.formValidate.name}}] 从 [{{userList.row.office.name}}] 中移除吗 ？</p>
          <p>{{$t('cant_restore_delete')}}</p>
      </div>
      <div slot="footer">
          <Button type="success" :loading="userModifyModel.loading" @click="removeUser">{{$t('confirm')}}</Button>
          <Button @click="userModifyModel.status = false">{{$t('cancel')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { deal, checkedArr } from '@/libs/tools'

const checkChildren = menus => {
  let result = []
  const checks = arr => {
    arr.forEach(v => {
      result.push(v.id)
      if (v.children) {
        checks(v.children)
      }
    })
    return result
  }

  return checks(menus)
}
export default {
  data () {

    const validateName = (rule, value ,callback) => {
      if (!value) {
        return callback(new Error(this.$t('enter_name_prompt')))
      } else {
        let data = {name: value, oldName: this.formValidate.oldName}
        this.nameCheck(data).then(res => {
          if(res.data.code !== 0) callback(new Error(res.data.msg))
          if(res.data.rs.exist === true){
            callback(new Error(this.$t('name_already_exists')))
          }else{
            callback()
          }
        }).catch(err => console.log(err))
      }
    }

    return {
      delTitle: "",
      haveCheck:[],
      searchName: '',
      tableHeight:null,
      tableHeight1:null,
      show_bg:false,
      show_user:false,
      show_group:false,
      open_inner: false,
      title:this.$t('add_role'),
      title1:'',
      office: {},
      organ: [],
      roleList: {
        columns: [
          {
            title: this.$t('org4'),
            key: 'company',
            minWidth: 70,
            render: (h, params) => {
              return h('span', params.row.office.name)
            }
          },
          {
            title: this.$t('name'),
            key: 'name',
            minWidth: 70,
          },
          {
            title: this.$t('data_scope'),
            key: 'dataScope',
            minWidth: 70,
            render: (h, params) => {
              const dataScope = params.row.dataScope
              const dictType = this.dictType.find(v => v.value === dataScope)
              return h('span', dictType ? dictType.label : '')
            }
          },
          {
            title: this.$t('op'),
            key: 'action',
            width: 230,
            render: (h, params) => {
              let btn = []

              if(this.$route.meta.access.includes('1000.05.02.001')) {
                btn.push(
                  h('Tooltip',{
                    props:{
                      content:this.$t('assign_user'),
                      placement:'top',
                    },
                    style: {
                      marginRight: '40px'
                    }
                  }, [
                    h('img',{
                      attrs: {
                        src: require("../../../assets/images/fenpei.svg"),
                      },
                      style: {
                        width:'16px',
                        marginTop:'4px',
                        cursor:'pointer'
                      },
                      on: {
                        click: () => {
                          this.tableHeight1 = window.innerHeight - this.$refs.table.$el.offsetTop - 270
                          this.show_group = true
                          this.show_bg = true
                          this.getUser(params.row)
                        }
                      }
                    })
                  ]),
                )
                if(params.row.sysData === '1'){
                  if(this.userInfo.admin){
                    btn.push(
                      h('Tooltip',{
                        props:{
                        content:this.$t('edit'),
                        placement:'top',
                        },
                        style: {
                          marginRight: '40px'
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
                        on :{
                          click: () =>{
                            this.editRole(params.row)
                            this.title = this.$t('e_role')
                            this.show_bg = true 
                            this.show_user = true
                          }
                        }
                        })
                      ])
                    )
                  }
                } else {
                  btn.push(
                    h('Tooltip',{
                      props:{
                      content:this.$t('edit'),
                      placement:'top',
                      },
                      style: {
                        marginRight: '40px'
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
                      on :{
                        click: () =>{
                          this.editRole(params.row)
                          this.title = this.$t('e_role')
                          this.show_bg = true 
                          this.show_user = true
                        }
                      }
                      })
                    ])
                  )
                }
              }

              if(this.$route.meta.access.includes('1000.05.02.002')) {
                if(params.row.sysData === '1'){
                  if(this.userInfo.admin){
                    btn.push(
                      h('Tooltip',{
                        props:{
                        content:this.$t('delete'),
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
                            'click': () => {
                              this.deleteModel.status = true
                              this.deleteModel.formValidate.id = params.row.id
                              this.delTitle = params.row.name
                            }
                          }
                        })
                      ])
                    )
                  }
                } else {
                  btn.push(
                    h('Tooltip',{
                      props:{
                      content:this.$t('delete'),
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
                          'click': () => {
                            this.deleteModel.status = true
                            this.deleteModel.formValidate.id = params.row.id
                            this.delTitle = params.row.name
                          }
                        }
                      })
                    ])
                  )
                }
              }
              return h('div', btn)
            }
          },
        ],
        data: [],
        name: '',
        loading: false
      },
      userList: {
        columns: [
          {
            title: this.$t('company4'),
            key: 'company',
            width:180,
            render: (h, params) => {
              return h('span', params.row.company.name)
            }
          },
          {
            title: this.$t('dept4'),
            key: 'office',
            render: (h, params) => {
              return h('span', params.row.office.name)
            }
          },
          {
            title: this.$t('login_name'),
            key: 'loginName',
            width:120,
          },
          {
            title: this.$t('name1'),
            key: 'name',
          },
          {
            title: this.$t('mobile'),
            width:130,
            key: 'mobile',
          },
          {
            title: this.$t('op'),
            key: 'action',
            width:110,
            render: (h, params) => {
              return h('div', [
                h('Tooltip',{
                  props:{
                  content:this.$t('delete'),
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
                      'click': () => {
                        this.userModifyModel.status = true
                        this.userModifyModel.formValidate = params.row
                      }
                    }
                  })
                ])
              ])
            }
          }
        ],
        data: [],
        row: {
          office: {name: ''}
        },
        loading: false
      },
      formValidate: {
        office:{
          id: '',
          name: ''
        }
      },
      ruleValidate: {
        'office.name':[
          { required: true, message: this.$t('select_organization'), trigger: 'change' }
        ],
        name:[
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        sysData:[
          { required: true, message: this.$t('select_sys_data'), trigger: 'change' }
        ],
        dataScope:[
          { required: true, message: this.$t('select_data_range'), trigger: 'change' }
        ],
        subsysIdList: [
          { required: true, type: 'array', min: 1, message: this.$t('select_subsystem'), trigger: 'change' },
        ]
      },
      spinShow: false,
      treeSpin: false,
      oranUser: {
        list: [],
        selected: []
      },
      deleteModel: {
        status: false,
        loading: false,
        formValidate: {}
      },
      userModifyModel: {
        status: false,
        loading: false,
        formValidate: {
          name: ''
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'dictType',
      'menus',
      'subSysList',
      'organizationList',
      'userInfo'
    ])
  },
  methods: {
    ...mapActions([
      'getRoleList',
      'saveRole',
      'nameCheck',
      'deleteRole',
      'getRoleUserList',
      'getOrganizationUsers',
      'roleAssign',
      'deleteRoleUser',
      'getRoleMenus'
    ]),
    init() {
      const data = {
        pageSize: this.roleList.pageSize, 
        pageNo: this.roleList.pageNo, 
        name: this.roleList.name
      }
      this.getRoleList(data).then(res => {
        const data = res.data.rs
        this.roleList.data = data.data
        this.roleList.loading = false
      }).catch(() => this.roleList.loading = false)
    },
    nextPage (page) {
      this.roleList.pageNo = page
      this.init()
    },
    //搜索机构
    searchOranization(value) {
      const arrs = JSON.parse(JSON.stringify(this.organizationList))
      if(value === '') {
        this.organ = arrs
        return
      }
      this.organ = deal(arrs, node => node.title.indexOf(value) > -1)
    },
    //选择机构
    selectOranization(event) {
      this.office = {
        id: event[0].id,
        name: event[0].title
      }
      if(this.title1 == this.$t('assign_user')) this.getOrganRole(event)
    },
    //选择用户 机构
    confirmOranization() {  
      if(this.title1 == this.$t('assign_user')) {
        const data = {
          roleId: this.userList.row.id,
          uIds: this.oranUser.selected.map(v => v.id).join(',')
        }
        // this.treeSpin = true
        this.roleAssign(data).then(res => {
          this.treeSpin = false
          if (res.data.code !== 0) return
          this.$Message.success(this.$t('save_ok'))
          this.getUser(this.userList.row)
          this.close1()
        }).catch(err => this.treeSpin = false)
      }else {
        if(!this.office.id) return this.$Message.error(this.$t('select_organization'))
        this.formValidate.office = this.office
        this.close1()
      }
    },
    //编辑 保存角色
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.spinShow = true
          this.$refs[name].model.menuList = this.$refs.tree.getCheckedNodes()
          this.$refs[name].model.menuIds = this.$refs.tree.getCheckedNodes().map(v => v.id).join(',')
          this.$refs[name].model.menuIdList = this.$refs.tree.getCheckedNodes().map(v => v.id)
          this.saveRole(this.$refs[name].model).then(res => {
            this.spinShow = false
            if (res.data.code !== 0) return
            this.$Message.success(this.$t('save_ok'))
            this.init()
            this.close()
          }).catch(err => this.spinShow = false)
        } else {
          this.$Message.error(this.$t('unvalid_param'))
        }
      })
    },
    //编辑角色
    editRole(row) {
      this.haveCheck = []
      this.getRoleMenus({roleId: row.id}).then(res => {
        const row = res.data.rs.data
        this.formValidate = JSON.parse(JSON.stringify(row))
        this.formValidate.oldName = row.name
        this.organ = checkedArr([row.office.id], this.organizationList, 'selected')
        this.haveCheck = this.haveCheck.concat(row.menuIdList)
        const menus = checkedArr(this.haveCheck || [], this.menus, 'checked')
        this.copyMenus = menus.length > 0 ? menus : this.menus
      })
    },
    //分配用户面板
    getUser(row){
      this.userList.row = row
      const dictType = this.dictType.find(v => v.value === row.dataScope)
      this.userList.row.dataScopeName = dictType.label
      // this.userList.loading = true
      this.getRoleUserList({roleId: row.id}).then(res => {
        this.userList.loading = false
        this.userList.data = res.data.rs.data
        this.oranUser.selected = JSON.parse(JSON.stringify(res.data.rs.data))
      }).catch(() => this.userList.loading = false)
    },
    //根据机构获取角色
    getOrganRole(row) {
      const id = row[0].id
      this.treeSpin = true
      this.getOrganizationUsers({officeId: id}).then(res => {
        this.treeSpin = false
        const data = res.data.rs.data
        this.oranUser.list = data
      }).catch(() => this.treeSpin = false)
    },
    //删除角色用户
    removeUser() {
      const data = {
        roleId: this.userList.row.id,
        userId: this.userModifyModel.formValidate.id
      }

      this.userModifyModel.loading = true
      this.deleteRoleUser(data).then(res => {
        this.userModifyModel.loading = false
        if (res.data.code !== 0) return
        this.userModifyModel.status = false
        this.$Message.success(this.$t('delete_ok'))
        this.getUser(this.userList.row)
      }).catch(err => this.userModifyModel.loading = false)
    },
    //删除角色
    removeRole() {
      this.deleteModel.loading = true
      this.deleteRole({roleId: this.deleteModel.formValidate.id}).then(res => {
          this.deleteModel.loading = false
          if (res.data.code !== 0) return
          this.deleteModel.status = false
          this.$Message.success(this.$t('delete_ok'))
          this.init()
      }).catch(err => this.deleteModel.loading = false)
    },
    add () {
      this.title = this.$t('add_role')
      this.show_bg = true
      this.show_user = true
      this.formValidate =  {
        office:{
          id: '',
          name: ''
        }
      }
      this.haveCheck = []
      this.copyMenus = checkedArr([], this.menus, 'checked')
    },
    add_role () {
      this.organ = this.organizationList
      this.searchName = ''
      this.title1 = this.$t('assign_user')
      this.open_inner = true
    },
    inner_region () {
      this.organ = this.organizationList
      this.searchName = ''
      this.title1 = this.$t('org4')
      this.open_inner = true
    },
    //选择机构人员
    select_role (row) {
      const check = this.oranUser.selected.find(v => v.id === row.id)
      if(!check) this.oranUser.selected.push(row)
    },
    // 已选删除
    handleClose2 (event, id) {
      const index = this.oranUser.selected.findIndex(v => v.id === id)
      this.oranUser.selected.splice(index, 1)
    },
    close () {
      this.show_bg = false
      this.show_user = false
      this.show_group = false
      this.open_inner = false
    },
    close1 () {
      this.open_inner = false
    },
    checkChange (arr, item) {
      if(this.haveCheck.find(e => e == item.id)){
        let parents = item.parentIds.split(",").slice(1,-1)
        let children = checkChildren([item])
        children.map(e => {
          if(this.haveCheck.indexOf(e)>-1){
            this.haveCheck.splice(this.haveCheck.indexOf(e),1)
          }
        })
        this.haveCheck = [...new Set(this.haveCheck.concat(parents))]
        this.copyMenus = checkedArr(this.haveCheck, this.menus, 'checked')
        return
      }
      let parents = item.parentIds.split(",").slice(1,-1)
      let children = checkChildren([item])
      this.haveCheck = [...new Set(this.haveCheck.concat(parents.concat(children)))] 
      this.copyMenus = checkedArr(this.haveCheck, this.menus, 'checked')
    }
  },
  mounted () {
    this.$nextTick(()=>{
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
    })
    window.onresize = () => {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
      this.tableHeight1 = window.innerHeight - this.$refs.table.$el.offsetTop - 270
    }
  },
  created() {
    this.$store.dispatch('getDictType', {dictType: 'sys_data_scope'})
    this.$store.dispatch('getMenus', {ignorePermission: '1'})
    this.$store.dispatch('getSubSysLists')
    this.$store.dispatch('getOrganizationLists')
    this.organ = this.organizationList
    this.copyMenus = this.menus
    this.init()
  }
}
</script>
