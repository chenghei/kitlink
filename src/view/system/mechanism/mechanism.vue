<style lang="less" scoped src="./mechanism.less"></style>
<template>
    <div class="content-body">
        <Row type="flex" style="justify-content: space-between;">
            <i-col class="content_left boxShadow">
                <div class="header">
                    <span>{{$t('org')}}</span>
                    <Icon type="md-sync" size="20" @click="init" style="cursor:pointer"/>
                </div>
                <div class="tree_out">
                    <Tree :data="lists" @on-select-change="changeTree"></Tree>
                    <Spin size="large" fix v-if="listSpin"></Spin>
                </div>
            </i-col>
            <i-col class="content_right boxShadow">
                <div class="header">
                    <span>{{$t('organization')}}</span>
                    <div>
                        <div @click="add_mechanism" v-if="$route.meta.access.includes('1000.05.03.001')">
                            <img src="../../../assets/images/add18.svg">
                            {{$t('add_organization')}}
                        </div>
                    </div>
                </div>
                <Row type="flex" class="content_select"> 
                    <div class="content_select_input">
                        <p>{{$t('name')}}：</p>
                        <Input type="text" v-model="dataView.searchValue" style="width:300px"/>
                    </div>
                    <div class="select_button" @click="handleSearch">{{$t('query')}}</div>
                </Row>
                <tree-grid 
                    ref='table'
                    :tableHeight='treeHeight'
                    :items='dataView.data' 
                    :columns='dataView.columns'
                    @on-row-click='rowClick'
                    @on-selection-change='selectionClick'
                    @on-sort-change='sortClick'
                ></tree-grid>
            </i-col>
        </Row>
        <transition name="slide-fade">
            <div class="bg" v-if="show_bg" @click="close"></div>
        </transition>
        <!-- 添加/编辑机构 -->
        <transition name="width800-fade">
            <div class="width_800" v-if="show_mechanism">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="140">
                    <div class="add_title">
                        <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
                        {{title}}
                    </div>
                    <Row class="add_scroll">
                        <FormItem :label="$t('org_parent')+'：'" prop="" style="margin-top:20px">
                            <Input search type="text" v-model="formValidate.parent.name" style="width:400px" @on-focus="inner_mechanism" :readonly="!userInfo.admin" />
                        </FormItem>
                        <FormItem :label="$t('org_area')+'：'" prop="area.name" style="margin-top:20px">
                            <Input search type="text" v-model="formValidate.area.name" style="width:400px" @on-focus="inner_region" readonly/>
                        </FormItem>
                        <FormItem :label="$t('org_name')+'：'" prop="name" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.name" style="width:200px"/>
                        </FormItem>
                        <FormItem :label="$t('org_type')+'：'" prop="type" style="margin-top:20px">
                            <Row>
                            <i-col span="12" style="width:200px">
                                <i-select v-model="formValidate.type" filterable clearable>
                                    <i-option v-for="item in type" :value="item.value" :key="item.id">{{ item.label }}</i-option>
                                </i-select>
                            </i-col>
                            </Row>
                        </FormItem>
                        <FormItem :label="$t('org_level')+'：'" prop="grade" style="margin-top:20px">
                            <Row>
                            <i-col span="12" style="width:200px">
                                <i-select v-model="formValidate.grade" filterable clearable>
                                    <i-option v-for="item in grade" :value="item.value" :key="item.id">{{ item.label }}</i-option>
                                </i-select>
                            </i-col>
                            </Row>
                        </FormItem>
                        <FormItem :label="$t('use_or_not')+'：'" prop="useable" style="margin-top:20px">
                            <Row>
                                <i-col span="12" style="width:100px">
                                    <i-select v-model="formValidate.useable" filterable clearable>
                                        <i-option value="1">{{$t('yes')}}</i-option>
                                        <i-option value="0">{{$t('no')}}</i-option>
                                    </i-select>
                                </i-col>
                            </Row>
                        </FormItem>
                        <FormItem :label="$t('address')+'：'" prop="address" style="margin-top:20px">
                        <Input type="text" v-model="formValidate.address" style="width:400px"/>
                        </FormItem>
                        <FormItem :label="$t('postal_code')+'：'" prop="zipCode" style="margin-top:20px">
                        <Input type="text" v-model="formValidate.zipCode" style="width:200px"/>
                        </FormItem>
                        <FormItem :label="$t('principal')+'：'" prop="master" style="margin-top:20px">
                        <Input type="text" v-model="formValidate.master" style="width:200px"/>
                        </FormItem>
                        <FormItem :label="$t('phone')+'：'" prop="phone" style="margin-top:20px">
                        <Input type="text" v-model="formValidate.phone" style="width:200px"/>
                        </FormItem>
                        <FormItem :label="$t('fax')+'：'" prop="fax" style="margin-top:20px">
                        <Input type="text" v-model="formValidate.fax" style="width:200px"/>
                        </FormItem>
                        <FormItem :label="$t('email')+'：'" prop="email" style="margin-top:20px">
                        <Input type="text" v-model="formValidate.email" style="width:200px"/>
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
                    <Spin size="large" fix v-if="treeSpin"></Spin>
                </Form>
            </div>
        </transition>
        <!-- 选择机构/区域 -->
        <transition name="width400-fade">
            <div class="inner_400" v-show="select_mechanism">
                <div class="add_title inner" >
                    <img src="../../../assets/images/node/close.svg" alt="close" @click="close1">
                    {{title1}}
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
                <Button type="success" :loading="deleteModel.loading" @click="removeMechanism">{{$t('confirm')}}</Button>
                <Button @click="deleteModel.status = false">{{$t('cancel')}}</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import TreeGrid from '_c/treeGrid/treeGrid'
import { mapGetters, mapActions } from 'vuex'
import { deal, checkedArr } from '@/libs/tools'

const addType = (data, type) => {
    const toParse = arr => {
        arr.forEach(v => {
            const row = type.find(k => k.value === v.type)
            v.typeName = row.label
            if(v.children) toParse(v.children)
        })
        return arr
    }
    return toParse(data)
}
export default {
    data () {
        return {
            delTitle: '',
            tableHeight:'',
            show_bg: false,
            show_mechanism: false,
            select_mechanism: false,
            treeHeight:'',
            title:'',
            title1:'',
            formValidate: {
                useable: '1',
                parent: {
                    id: 0,
                    name: ''
                },
                area: {
                    id: 0,
                    name: ''
                }
            },
            ruleValidate: {
                'parent.name':[
                    { required: true, message: this.$t('select_org_parent'), trigger: 'blur' }
                ],
                'area.name':[
                    { required: true, message: this.$t('select_org_area'), trigger: 'blur' }
                ],
                name:[
                    { required: true, message: this.$t('input_org_name'), trigger: 'blur' }
                ],
                type:[
                    { required: true, message: this.$t('select_org_type'), trigger: 'change' }
                ],
                grade:[
                    { required: true, message: this.$t('select_org_level'), trigger: 'change' }
                ]
            },
            type: [],
            grade: [],
            dataView:{
                // 树形表格
                columns: [
                    {
                        title: this.$t('name'),
                        key: 'title',
                        sortable: true,
                    }, {
                        title: this.$t('org_area'),
                        key: 'areaName',
                    }, {
                        title: this.$t('org_code'),
                        key: 'code',
                    }, {
                        title: this.$t('org_type'),
                        key: 'typeName',
                    }, {
                        title: this.$t('remark'),
                        key: 'remarks',
                    }, {
                        title: this.$t('op'),
                        type: 'action',
                        width: '200',
                        actions: function(that) {
                            let btn = []
                            if(that.$route.meta.access.includes('1000.05.03.001')) {
                                btn.push(
                                    {
                                        title: that.$t('e_org'),
                                        tip: that.$t('edit'),
                                        marginRight:40,
                                        marginLeft:8,
                                        src:require('../../../assets/images/node/right1.svg')
                                    },
                                    {
                                        title: that.$t('add_sub_organization'),
                                        tip: that.$t('add_sub_organization'),
                                        marginRight:40,
                                        marginLeft:0,
                                        src:require('../../../assets/images/addMechanism.svg')
                                    }
                                )
                            }

                            if(that.$route.meta.access.includes('1000.05.03.002')) {
                                btn.push(
                                    {
                                        title: that.$t('delete'),
                                        tip: that.$t('delete'),
                                        marginRight:0,
                                        marginLeft:0,
                                        src:require('../../../assets/images/node/right3.svg')
                                    }
                                )
                            }
                            return btn
                        }(this)
                        
                    }],
                data: [],
                searchData: [],
                searchValue: ''
            },
            organ: [],
            lists: [],
            area: [],
            treeData: [],
            searchName: '',
            listSpin: false,
            treeSpin: false,
            deleteModel: {
                status: false,
                loading: false,
                formValidate: {}
            }
        }
    },
    components: {
        TreeGrid
    },
    computed: {
        ...mapGetters([
            'areas',
            'userInfo'
        ])
    },
    methods: {
        ...mapActions([
            'getOrganizationList',
            'getOrganizationDetail',
            'getAreas',
            'getDictTypes',
            'saveOrganization',
            'deleteOrganization'
        ]),
        init() {
            // this.listSpin = true
            this.getOrganizationList().then(e => {
                this.listSpin = false
                const data = addType(e.data.rs.data, this.type)
                if(this.userInfo.admin){
                     this.lists = [{
                        title: this.$t('root'),
                        expand: true,
                        children: data,
                        id:0
                    }]
                } else {    
                    this.lists = data
                }
                
                this.organ = JSON.parse(JSON.stringify(this.lists)) 
                this.dataView.data = this.dataView.searchData = data
                if(!this.userInfo.admin)this.changeTree([data[0]])
            }).catch(() => this.listSpin = false)
        },
        changeTree(event) {
            if (event.length > 0) {
                const info = event[0]
                if(info.nodeKey === 0) {
                    this.dataView.data = this.organ[0].children
                    return
                }
                const list = info.children
                if (list) {
                    this.formValidate.pid = info.id || 0
                    this.dataView.data = this.dataView.searchData = list || []
                } else {
                    this.dataView.data = event
                }
            }
        },
        handleSearch() {
            this.dataView.data = this.dataView.searchData.filter(item => item.title.indexOf(this.dataView.searchValue) > -1)
        },
        //搜索机构
        searchOranization(value) {
            let arrs = []
            if(this.title1 === this.$t('org_parent')) 
                arrs = JSON.parse(JSON.stringify(this.organ))
            else
                arrs = JSON.parse(JSON.stringify(this.areas))
            if(value === '') {
                this.treeData = arrs
                return
            }
            this.treeData = deal(arrs, node => node.title.indexOf(value) > -1 )
        },
        //选择机构，地区
        selectTree(event) {
            if (event.length > 0) {
                if(this.title1 === this.$t('org_parent')) {
                    this.parent = {
                        id: event[0].id,
                        name: event[0].title
                    }
                }else{
                    this.area = {
                        id: event[0].id,
                        name: event[0].title,
                    }
                }
            }
        },
        //确定公司，部门
        confirmTree() {
            if(this.title1 === this.$t('org_parent')) {
                this.formValidate.parent = this.parent
            }else{
                this.formValidate.area = this.area
            }
            this.select_mechanism = false
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.treeSpin = true
                    this.saveOrganization(this.$refs[name].model).then(res => {
                        this.treeSpin = false
                        if (res.data.code !== 0) return
                        this.$Message.success(this.$t('save_ok'))
                        this.init()
                        this.close()
                    }).catch(err => this.treeSpin = false)
                } else {
                    this.$Message.error(this.$t('unvalid_param'))
                }
            })
        },
        removeMechanism() {
            this.deleteModel.loading = true
            this.deleteOrganization({id: this.deleteModel.formValidate.id}).then(res => {
                this.deleteModel.loading = false
                if (res.data.code !== 0) return
                this.deleteModel.status = false
                this.$Message.success(this.$t('delete_ok'))
                this.init()
            }).catch(err => this.deleteModel.loading = false)
        },
        inner_mechanism () {
            this.title1 = this.$t('org_parent')
            this.select_mechanism = false
            this.treeData = this.organ
            setTimeout( () => {
                this.select_mechanism = true
            })
        },
        inner_region () {
            this.title1 = this.$t('org_area')
            this.select_mechanism = false
            this.treeData = this.areas
            setTimeout( () => {
                this.select_mechanism = true
            })
        },
        add_mechanism () {
            this.getOrganizationDetail().then(res => {
                const data = res.data.rs.data
                this.formValidate = {
                    useable: '1',
                    parent: data.parent,
                    area: data.area,
                    type: data.type
                }
                this.title = this.$t('add_organization')
                this.show_bg = true
                this.show_mechanism = true
            })
        },
        close () {
            this.show_bg = false
            this.show_mechanism = false
            this.select_mechanism = false
        },
        close1 () {
            this.select_mechanism = false
        },
        rowClick(data, index, event ,text) {
            this.title = text
            if(text === this.$t('e_org') || text === this.$t('add_sub_organization')){
                this.getOrganizationDetail({id: data.id}).then(res => {
                    this.formValidate = res.data.rs.data
                    this.treeData = checkedArr([this.formValidate.area.id], this.areas, 'selected')
                    this.treeData = checkedArr([this.formValidate.parentId], this.organ, 'selected')
                    if(!this.formValidate.parent){
                        this.formValidate.parent = {
                            name: this.userInfo.admin ? this.$t('root') : '',
                            id: 0
                        }
                    }
                    if(text === this.$t('add_sub_organization')) {
                        this.formValidate = {
                            useable: '1',
                            parent: {
                                id: this.formValidate.id,
                                name: this.formValidate.name
                            },
                            area: {}
                        },
                        this.treeData = checkedArr([this.formValidate.id], this.organ, 'selected')
                    }
                    
                    this.show_bg = true
                    this.show_mechanism = true
                })
            }
            if(text === this.$t('delete')){
                this.deleteModel.status = true
                this.deleteModel.formValidate.id = data.id
                this.delTitle = data.title
            }
        },
        selectionClick(arr) {
            // console.log('选中数据id数组:' + arr)
        },
        sortClick(key, type) {
            // console.log('排序字段:' + key)
            // console.log('排序规则:' + type)
        }
    },
    mounted () {
        this.$nextTick(()=>{
            this.treeHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 230
        })
        window.onresize = () => {
            this.treeHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 230
        }
    },
    created() {
        this.$store.dispatch('getAreas')
        this.getDictTypes({dictType: 'sys_office_type'}).then(res => {
            this.type = res.data.rs.data
        })
        this.getDictTypes({dictType: 'sys_office_grade'}).then(res => {
            this.grade = res.data.rs.data
        })
        this.init()
    }
}
</script>