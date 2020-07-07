<style lang="less" scoped src='./user.less'></style>
<template>
    <div class="content-body">
        <div class="content boxShadow">
            <div class="header">
                <span>{{$t('user_list')}}</span>
                <div @click="add_user" v-if="$route.meta.access.includes('1000.05.01.001')">
                    <img src="../../../assets/images/add18.svg" alt="add18">
                    {{$t('add_user')}}
                </div>
            </div>
            <Row type="flex" class="content_select"> 
                <div class="content_select_input">
                    <p>{{$t('account')}}：</p>
                    <Input type="text" v-model="userList.loginName" style="width:300px;" />
                </div>
                <div class="content_select_input">
                    <p>{{$t('name')}}：</p>
                    <Input type="text" v-model="userList.name" style="width:300px"/>
                </div>
                <div class="select_button" @click="init">{{$t('query')}}</div>
            </Row>
            <Table ref="table" :loading="userList.loading" :height="tableHeight" :columns="userList.columns" :data="userList.data"></Table>
            <div class="list_bottom">
                <Page :total="userList.total" :page-size="userList.pageSize" @on-change="nextPage" show-elevator show-total></Page>
            </div>
        </div>
    <transition name="slide-fade">
      <div class="bg" v-if="show_bg" @click="close"></div>
    </transition>
    <!-- 添加用户 -->
    <transition name="width800-fade">
      <div class="width_800" v-if="show_user">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="170">
          <div class="add_title">
            <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
            {{title_user}}
          </div>
          <Row class="add_scroll">
            <div class="avator">
                <div class="avator_out">
                    <img :src="uploadImg.url ? uploadImg.url : (this.photo? `${path}/p/a/rest-api/files/download?filePath=${this.photo}`:'')" >
                </div>
            </div>
            <FormItem label="" prop="" style="margin-top:20px">
            <Row>
              <i-col span="7" offset="5"> 
              <Upload 
                action="//jsonplaceholder.typicode.com/posts/" 
                :before-upload="handleBeforeUpload"
                >
                <div class="select_ava">
                  <img src="../../../assets/images/uploadavator.svg">
                  {{$t('upload_avatar')}}
                </div>
              </Upload>
              </i-col>
              <i-col span="8"> 
                <div class="select_ava" @click="clearPhoto">
                  <img src="../../../assets/images/clearavator.svg">
                  <span>{{$t('head_removal')}}</span>
                </div>
              </i-col>
            </Row>
          </FormItem>
            <FormItem @click="add_company" :label="$t('company4')+'：'" prop="company.name" style="margin-top:20px">
              <Input search type="text" v-model="formValidate.company.name" style="width:400px" @on-focus="add_company" readonly/>
            </FormItem>
            <FormItem :label="$t('dept4')+'：'" prop="office.name" style="margin-top:20px">
              <Input search type="text" v-model="formValidate.office.name"  style="width:400px" @on-focus="add_department" readonly/>
            </FormItem>
            <FormItem :label="$t('job_number')+'：'" prop="no" style="margin-top:20px">
              <Input type="text" v-model="formValidate.no"  style="width:200px"/>
            </FormItem>
            <FormItem :label="$t('name')+'：'" prop="name" style="margin-top:20px">
              <Input type="text" v-model="formValidate.name" style="width:200px"/>
            </FormItem>
            <FormItem :label="$t('login_name')+'：'" prop="loginName" style="margin-top:20px">
              <Input type="text" v-model="formValidate.loginName" style="width:200px"/>
            </FormItem>
            <FormItem :class="title_user === $t('add_user') ? 'myrequire' : ''" :label="$t('password')+'：'" prop="newPassword" style="margin-top:20px">
              <Input type="password" v-model="formValidate.newPassword" style="width:200px"/>
            </FormItem>
            <FormItem :class="title_user === $t('add_user') ? 'myrequire' : ''" :label="$t('cfm_password')+'：'" prop="confirmNewPassword" style="margin-top:20px">
              <Input type="password" v-model="formValidate.confirmNewPassword" style="width:200px"/>
            </FormItem>
            <FormItem :label="$t('email')+'：'" prop="email" style="margin-top:20px">
              <Input type="text" v-model="formValidate.email" style="width:200px"/>
            </FormItem>
            <FormItem :label="$t('phone')+'：'" prop="phone" style="margin-top:20px">
              <Input type="text" v-model="formValidate.phone" style="width:200px"/>
            </FormItem>
            <FormItem :label="$t('mobile')+'：'" prop="mobile" style="margin-top:20px">
              <Input type="text" v-model="formValidate.mobile" style="width:200px"/>
            </FormItem>
            <Row type="flex"> 
                <FormItem :label="$t('language')+'：'" prop="language" >
                    <i-col span="12" style="width:100px">
                        <i-select v-model="formValidate.language" filterable>
                            <i-option value="CN">{{$t('chinese')}}</i-option>
                            <i-option value="EN">{{$t('english')}}</i-option>
                        </i-select>
                    </i-col>
                </FormItem>
                <FormItem style="margin-left:40px" :label="$t('account_yes_no')+'：'" prop="loginFlag">
                    <i-col span="12" style="width:100px">
                        <i-select v-model="formValidate.loginFlag" filterable>
                            <i-option value="1">{{$t('yes')}}</i-option>
                            <i-option value="0">{{$t('no')}}</i-option>
                        </i-select>
                    </i-col>
                </FormItem>
                
            </Row>
            <i-col style="position: relative;">
                    <FormItem :label="$t('account_end_time')+'：'" :prop="title_user === $t('add_user') ? 'endCount' :''">
                        <Row type="flex">
                        <i-col>
                            <Input type="number"  v-model="formValidate.endCount" style="width:100px"/>
                        </i-col>
                        <i-col  style="width:70px;margin-left:20px">
                            <i-select v-model="formValidate.timeUnit" filterable @on-change="selectDate">
                                <i-option value="d">{{$t('day')}}</i-option>
                                <i-option value="w">{{$t('week')}}</i-option>
                                <i-option value="M">{{$t('month')}}</i-option>
                                <i-option value="y">{{$t('year')}}</i-option>
                            </i-select>
                        </i-col>
                        </Row>
                    </FormItem>   
                    <span v-show="showDate" style="position: absolute;top:35px;left:170px">{{endDate}}</span>              
                </i-col>
            <FormItem :label="$t('role')+'：'" prop="roleIdList">
                <i-col>
                <CheckboxGroup v-model="formValidate.roleIdList">
                    <Checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{item.name}}</Checkbox>
                </CheckboxGroup>
                </i-col>
            </FormItem>
            <FormItem :label="$t('remark')+'：'" prop="remarks">
              <i-col>
                <Input type="textarea" v-model="formValidate.remarks" style="width:400px;"/>
              </i-col>
            </FormItem>
            <FormItem :label="$t('create_dt')+'：'" prop="" v-if="title_user == $t('e_user')">
              <i-col>
                <Input disabled v-model="formValidate.createDate" style="width:200px;"/>
              </i-col>
            </FormItem>
            <Row type="flex" v-if="title_user == $t('e_user')">
                <FormItem :label="$t('last_login')+'IP：'" prop="">
                <i-col span="8" style="width:200px">
                    <Input disabled v-model="formValidate.loginIp" style="width:200px;"/>
                </i-col>
                </FormItem>
                <FormItem :label="$t('time')+'：'" prop="" style="margin-left:-100px">
                <i-col span="12">
                    <Input disabled v-model="formValidate.loginDate" style="width:200px;"/>
                </i-col>
                </FormItem>
            </Row>
          </Row>
          <div class="add_bottom">
            <div class="add_button" @click="handleSubmit('formValidate')">{{$t('save')}}</div>
          </div>
          <Spin size="large" fix v-if="spinShow"></Spin>
        </Form>
      </div>
    </transition>
    <!-- 选择公司/部门 -->
    <transition name="width400-fade">
        <div class="inner_400" v-show="select_company">
            <div class="add_title" >
                <img src="../../../assets/images/node/close.svg"  @click="close1">
                {{title}}
            </div>
            <Row class="add_scroll inner" style="padding:0 30px;">
                <Input search type="text" v-model="searchName" style="width:340px;margin-top:20px" :placeholder="$t('input_key')" @on-search="searchOranization" />
                <Tree :data="treeData" @on-select-change="selectTree" style="margin-top:40px"></Tree>
            </Row>
            <div class="add_bottom" style="width:410px;">
                <div class="add_button" @click="confirmTree">{{$t('confirm')}}</div>
            </div>
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
        <Button type="success" :loading="deleteModel.loading" @click="removeUser">{{$t('confirm')}}</Button>
        <Button @click="deleteModel.status = false">{{$t('cancel')}}</Button>
      </div>
    </Modal>

    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { deal, checkedArr } from '@/libs/tools'
import config from '@/config'

export default {
    data () {
        const validatePass = (rule, value, callback) => {
            if (this.title_user === this.$t('add_user') && !value) {
                callback(new Error(this.$t('input_password')))
            }else{
                // 对第二个密码框单独验证
                this.$refs.formValidate.validateField('confirmNewPassword')
                callback()
            }
        }

        const validatePassCheck = (rule, value, callback) => {
            if (this.title_user === this.$t('add_user') && !value) {
                callback(new Error(this.$t('input_password_again')))
            } else if (value !== this.formValidate.newPassword) {
                callback(new Error(this.$t('inconsistent_password')))
            } else {
                callback()
            }
        }

        return {
            resetDate:'',
            delTitle:'',
            path: config.assetsPatch,
            photo: '',
            uploadImg:{
                url: ''
            },
            file: {},
            spinShow: false,
            endDate: '',
            searchName: '',
            tableHeight:null,
            show_bg: false,
            show_user: false,
            select_company: false,
            select_department: false,
            title:'',
            title_user:'',
            showDate: true,
            selectCompany: {
                id: '',
                name: ''
            },
            selectOffice: {
                id: '',
                name: '',
                children: false
            },
            formValidate: {
                company: {
                    id: '',
                    name: ''
                },
                office: {
                    id: '',
                    name: ''
                },
                language: 'CN',
                loginFlag: '1',
                timeUnit: 'd',
                roleIdList: []
            },
            ruleValidate: {
                'company.name':[
                    { required: true, message: this.$t('select_company'), trigger: 'change' }
                ],
                'office.name':[
                    { required: true, message: this.$t('select_dept'), trigger: 'change' }
                ],
                name:[
                    { required: true, message: this.$t('input_name'), trigger: 'blur' }
                ],
                loginName:[
                    { required: true, message: this.$t('input_loginName'), trigger: 'blur' }
                ],
                newPassword:[
                    { validator: validatePass, trigger: 'blur' }
                ],
                confirmNewPassword:[
                    { validator: validatePassCheck, trigger: 'blur' }
                ],
                roleIdList:[
                    { required: true, type:'array', message: this.$t('select_role'), trigger: 'change' }
                ],
                endCount:[
                    { required: true , message: this.$t('input_endDate'),trigger: 'change'}
                ],
            },
            userList: {
                columns: [
                    {
                        title: this.$t('company4'),
                        key: 'company',
                        minWidth: 70,
                        render: (h, params) => {
                            return h('span', params.row.company.name)
                        },
                    },
                    {
                        title: this.$t('dept4'),
                        key: 'department',
                        minWidth: 70,
                        render: (h, params) => {
                            return h('span', params.row.office.name)
                        },
                    },
                    {
                        title: this.$t('account'),
                        key: 'loginName',
                        minWidth: 70,
                    },
                    {
                        title: this.$t('name'),
                        key: 'name',
                        minWidth: 70,
                    },
                    {
                        title: this.$t('mobile'),
                        key: 'mobile',
                        minWidth: 70,
                    },
                    {
                        title: this.$t('op'),
                        key: 'action',
                        width: 180,
                        render: (h, params) => {
                            let btn = []

                            if(this.$route.meta.access.includes('1000.05.01.001')) {
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
                                                src: require("../../../assets/images/node/right1.svg"),
                                            },
                                            style: {
                                                width:'16px',
                                                marginTop:'4px',
                                                cursor:'pointer'
                                            },
                                            on: {
                                                click: () => {
                                                    this.title_user = this.$t('e_user')
                                                    this.show_bg = true 
                                                    this.show_user = true
                                                    this.editUser(params.row)
                                                    this.photo = params.row.photo
                                                    this.uploadImg = {
                                                        url: ''
                                                    }
                                                }
                                            }
                                        })
                                    ])
                                )
                            }

                            if(this.$route.meta.access.includes('1000.05.01.002') && this.userInfo.id !== params.row.id) {
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
                            return h('div', btn)
                        }
                    },
                ],
                data: [],
                pageSize: 10,
                pageNo: 1,
                loginName: '',
                name: '',
                total: 0,
                loading: false
            },
            // 树状图数据
            treeData: [],
            company: [],
            organ: [],
            deleteModel: {
                status: false,
                loading: false,
                formValidate: {}
            }
        }
    },
    computed: {
        ...mapGetters([
            'roleList',
            'organizationList',
            'userInfo',
        ]),
        changeDate() {
            const data = {
                endCount: this.formValidate.endCount,
                timeUnit: this.formValidate.timeUnit
            }
            return data
        }
    },
    watch: {
        changeDate: {
            handler: function(val) {
                if(val.endCount){
                    if(!val.timeUnit) return
                    let endCount = parseInt(val.endCount)
                    if(endCount === 0) {
                        this.endDate = '失效'
                        return 
                    }
                    if(endCount < 0) {
                        setTimeout(() => {
                            this.formValidate.endCount = 0
                            this.endDate = '失效'
                            return 
                        }, 0);
                    }
                    if(val.timeUnit === 'd' && endCount > 0){
                        endCount = endCount - 1
                    }
                    this.endDate = moment().add(endCount, val.timeUnit).format('YYYY-MM-DD')
                } 
                if(!val.endCount){
                    this.formValidate.endCount = ""
                    this.endDate = this.resetDate
                }
            },
            deep: true
        }
    },
    methods: {
        ...mapActions([
            'getAcctList',
            'saveAcct',
            'deleteAcct',
            'getAcctInfo',
            'uploadHeader'
        ]),
        init() {
            const data = {
                pageSize: this.userList.pageSize, 
                pageNo: this.userList.pageNo, 
                loginName: this.userList.loginName,
                name: this.userList.name
            }
            this.getAcctList(data).then(res => {
                const data = res.data.rs
                this.userList.data = data.data.list
                this.userList.total = data.data.count
                this.userList.loading = false
            })
        },
        nextPage (page) {
            this.userList.pageNo = page
            this.init()
        },
        handleBeforeUpload (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                this.uploadImg = {
                    url: reader.result,
                    file,
                };
            };
            this.file = file
            return false
        },
        clearPhoto () {
            this.uploadImg.url = ''
        },
        selectDate (value) {
            if(this.formValidate.endCount && this.formValidate.endCount > 0){
                let endCount = parseInt(this.formValidate.endCount)
                if (value === 'd' && this.formValidate.endCount > 0) {
                    endCount = endCount - 1
                }
                this.endDate = moment().add(endCount, value).format('YYYY-MM-DD')
            }
        },
        handleSubmit (name) {
            this.select_company = false
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let data = new FormData()
                    data.append('file', this.file)
                    data.append('uid', this.$refs[name].model.id)
                    this.spinShow = true
                    if(this.uploadImg.url){
                        this.uploadHeader(data).then(res => {
                            this.$refs[name].model.photo = res.data.rs.data
                                this.saveAcct(this.$refs[name].model).then(res => {
                                this.spinShow = false
                                if (res.data.code !== 0) return
                                this.$Message.success(this.$t('save_ok'))
                                this.init()
                                this.close()
                                if(this.userInfo.id === this.$refs[name].model.id) this.$router.go(0);
                                
                            }).catch(err => this.spinShow = false)
                        })
                    } else {
                        this.saveAcct(this.$refs[name].model).then(res => {
                            this.spinShow = false
                            if (res.data.code !== 0) return
                            this.$Message.success(this.$t('save_ok'))
                            this.init()
                            this.close()
                            if(this.userInfo.id === this.$refs[name].model.id) this.$router.go(0);
                        }).catch(err => this.spinShow = false)
                    }
                    
                } else {
                    this.$Message.error(this.$t('unvalid_param'))
                }
            })
        },
        //选择公司，部门
        selectTree(event) {
            if(this.title === this.$t('company4')) {
                this.selectCompany = {
                    id: event[0].id,
                    name: event[0].title
                }
            }else{
                this.selectOffice = {
                    id: event[0].id,
                    name: event[0].title,
                    children: event[0].children ? true : false
                }
            }
        },
        //确定公司，部门
        confirmTree() {
            if(this.title === this.$t('company4')) {
                this.formValidate.company = this.selectCompany
            }else{
                if(this.selectOffice.children === true){
                    return this.$Message.error(`不能选择父节点（${this.selectOffice.name}），请重新选择`)
                }
                this.formValidate.office = this.selectOffice
            }
            this.select_company = false
        },
        //搜索机构
        searchOranization(value) {
            let arrs = []
            if(this.title === this.$t('company4')) 
                arrs = JSON.parse(JSON.stringify(this.company))
            else
                arrs = JSON.parse(JSON.stringify(this.organizationList))
            if(value === '') {
                this.treeData = arrs
                return
            }
            this.treeData = deal(arrs, node => node.title.indexOf(value) > -1 )
        },
        //编辑用户数据处理
        editUser(row) {
            row = JSON.parse(JSON.stringify(row))
            this.getAcctInfo({userId: row.id}).then(res => {
                const data = res.data.rs.data
                this.formValidate = {
                    roleIdList:data.roleIdList,
                    oldLoginName: row.loginName,
                    confirmNewPassword: '',
                    timeUnit:'d',
                    newPassword:'',
                    ...row,
                    endCount:'',
                }
                this.treeData = checkedArr([row.company.id], this.company, 'selected')
                this.treeData = checkedArr([row.office.id], this.organizationList, 'selected')
                let timeA = moment(row.endDate).valueOf()
                let timeB = moment(new Date()).valueOf()
                if(timeA < timeB){
                    this.endDate = '失效'
                    this.resetDate = '失效'
                } else {
                    this.endDate = row.endDate.split(' ')[0]
                    this.resetDate = row.endDate.split(' ')[0]
                }
            })
        },
        //删除用户
        removeUser() {
            this.deleteModel.loading = true
            this.deleteAcct({userId: this.deleteModel.formValidate.id}).then(res => {
                this.deleteModel.loading = false
                if (res.data.code !== 0) return
                this.deleteModel.status = false
                this.$Message.success(this.$t('delete_ok'))
                this.init()
            }).catch(err => this.deleteModel.loading = false)
        },
        add_company() {
            this.title = this.$t('company4')
            this.select_company = false
            this.treeData = this.company
            setTimeout(() => {
                this.select_company = true
            })
        },
        add_department () {
            this.title = this.$t('dept4')
            this.select_company = false
            this.treeData = this.organizationList
            setTimeout(() => {
                this.select_company = true
            })
        },
        add_user () {
            this.endDate = ''
            this.resetDate = ''
            this.formValidate = {
                newPassword:"",
                company: {
                    id: '',
                    name: ''
                },
                office: {
                    id: '',
                    name: ''
                },
                language: 'CN',
                loginFlag: '1',
                timeUnit: 'd',
                endCount:'',
                roleIdList: []
            }
            this.uploadImg = {
                url: ''
            },
            this.photo = ''
            this.title_user = this.$t('add_user')
            this.show_bg = true
            this.show_user = true
        },
        close () {
            this.show_bg = false
            this.show_user = false
            this.select_company = false
        }, 
        close1 () {
            this.select_company = false
        },
        // minValue(event){
        //     if(this.formValidate.endCount < 0) {
        //         setTimeout(() => {
        //             this.formValidate.endCount = 0
        //             this.endDate = '无限'
        //         }, 0);
        //     }
        // }
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
        this.$store.dispatch('getOrganizationList', {type: 1}).then(res => {
            this.company = res.data.rs.data
        })
        this.$store.dispatch('getOrganizationLists')
        this.$store.dispatch('getRoleLists')
        this.init()
    }
}
</script>