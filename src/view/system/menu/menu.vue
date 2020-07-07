<style lang="less" scoped src="./menu.less"></style>
<template>
    <div class="content-body">
        <div class="content boxShadow">
            <div class="header">
                <span>{{$t('menu_conf')}}</span>
                <div @click="add" v-if="$route.meta.access.includes('1000.05.04.001')">
                    <img src="../../../assets/images/add18.svg">
                    {{$t('add_menu')}}
                </div>
            </div>
            <tree-grid 
                ref='table'
                :tableHeight='treeHeight'
                :items='menuList.data' 
                :columns='menuList.columns'
                @on-row-click='rowClick'
                @on-selection-change='selectionClick'
                @on-sort-change='sortClick'
            ></tree-grid>
            <!-- <div class="list_bottom">
                <Page :total="1002" show-elevator show-total></Page>
            </div> -->
        </div>
        <transition name="slide-fade">
            <div class="bg" v-if="show_bg" @click="close"></div>
        </transition>
        <!-- 添加菜单 -->
        <transition name="width800-fade">
            <div class="width_800" v-if="show_menu">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
                <div class="add_title">
                    <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
                    {{title}}
                </div>
                <Row class="add_scroll">
                    <FormItem :label="$t('subsys')+'：'" prop="" style="margin-top:20px">
                        <i-col span="12" style="width:200px">
                            <i-select v-model="formValidate.subName" filterable>
                                <i-option v-for="(item,index) in menuSubSysList" :value="item.name" :key="index">{{ item.name }}</i-option>
                            </i-select>
                        </i-col>
                    </FormItem>
                    <FormItem :label="$t('menu_parent')+'：'" prop="parent.title" style="margin-top:20px">
                        <Input search @on-focus='open_menu' v-model="formValidate.parent.title" type="text"  style="width:200px" readonly/>
                    </FormItem>
                    <FormItem :label="$t('name')+'：'" prop="title" style="margin-top:20px">
                        <Input type="text" v-model="formValidate.title" style="width:400px"/>
                    </FormItem>
                    <FormItem :label="$t('router_name')+'：'" prop="" style="margin-top:20px">
                        <Input type="text" v-model="formValidate.name" style="width:400px"/>
                    </FormItem>
                    <FormItem :label="$t('router_path')+'：'" prop="" style="margin-top:20px">
                        <Input type="text" v-model="formValidate.path" style="width:400px"/>
                    </FormItem>
                    <FormItem :label="$t('router_component')+'：'" prop="" style="margin-top:20px">
                        <Input type="text" v-model="formValidate.component" style="width:400px"/>
                    </FormItem>
                    <FormItem :label="$t('parent_component')+'：'" prop="" style="margin-top:20px">
                        <Input type="text" v-model="formValidate.meta.active" style="width:400px"/>
                    </FormItem>
                    <FormItem :label="$t('redirect')+'：'" prop="" style="margin-top:20px">
                        <Row>
                        <i-col span="14" >
                            <Input type="text" v-model="formValidate.redirect" style="width:400px"/>
                        </i-col>
                        <i-col span="7" class="tip" style="margin-left:30px;">
                            {{$t('redirect_address')}}
                        </i-col>
                        </Row>
                    </FormItem>
                    <FormItem :label="$t('icon')+'：'" prop="" style="margin-top:20px">
                        <Input type="text" v-model="formValidate.icon" style="width:200px"/>
                    </FormItem>
                    <FormItem :label="$t('sort')+'：'" prop="" style="margin-top:20px">
                        <Row>
                        <i-col span="8">
                            <input class="input_middle" :step="30" type="number" v-model="formValidate.sort" style="width:200px"/>
                        </i-col>
                        <i-col class="tip">
                            {{$t('sort_order')}}
                        </i-col>
                        </Row>
                    </FormItem>
                    <FormItem :label="$t('display')+'：'" prop="" >
                        <Row>
                        <i-col span="8">
                            <RadioGroup v-model='formValidate.showMenu'>
                            <Radio style="margin-right:40px" label="true">{{$t('visible')}}</Radio >
                            <Radio  label="false">{{$t('hide')}}</Radio >
                            </RadioGroup >
                        </i-col>
                        <i-col class="tip">
                            {{$t('show_sys_menu')}}
                        </i-col>
                        </Row>

                    </FormItem>
                    <FormItem :label="$t('permission_identifier')+'：'" prop="" style="margin-top:20px">
                        <Row>
                        <i-col span="7" style="width:200px">
                            <Input type="text" v-model="formValidate.permission" style="width:200px"/>
                        </i-col>
                        <i-col span="14" class="tip">
                            {{$t('permission_tip')}}
                        </i-col>
                        </Row>
                    </FormItem>
                    <FormItem :label="$t('remark')+'：'" prop="" >
                        <i-col>
                            <Input type="textarea" style="width:400px;margin-top:10px"/>
                        </i-col>
                    </FormItem>
                </Row>
                <div class="add_bottom">
                    <div class="add_button" @click="handleSubmit('formValidate')" >{{$t('save')}}</div>
                </div>
                </Form>
                <Spin size="large" fix v-if="spinShow"></Spin>
            </div>
        </transition>
        <!-- 上级菜单选择 -->
        <transition name="width400-fade">
            <div class="inner_400" v-show="select_menu">
                <div class="add_title" >
                    <img src="../../../assets/images/node/close.svg" alt="close" @click="close1">
                    {{$t('menu_parent')}}
                </div>
                <Row class="add_scroll inner" style="padding:0 30px;">
                    <Input search v-model="searchName" type="text"  style="width:340px;margin-top:20px" :placeholder="$t('input_key')" @on-search="searchOranization"/>
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
            <Button type="success" :loading="deleteModel.loading" @click="delMenu">{{$t('confirm')}}</Button>
            <Button @click="deleteModel.status = false">{{$t('cancel')}}</Button>
        </div>
    </Modal>
    </div>
</template>
<script>
import TreeGrid from '_c/treeGrid/treeGrid'
import { deal, checkedArr } from '@/libs/tools'
import { mapActions,mapGetters } from 'vuex'

export default {
    data () {
        return {
            show_bg: false,
            show_menu: false,
            select_menu: false,
            treeHeight:'',
            title: '',
            searchName: '',
            parentId:'',
            baseSystem:'',
            baseId:'',
            delMenuId:'',
            delTitle:'',
            formValidate: {},
            ruleValidate: {
                title:[
                    { required: true, message: this.$t('enter_name_prompt'), trigger: 'blur' }
                ],
                'parent.title':[
                    { required: true, message: this.$t('select_menu_parent'),}
                ],
            },
            menuList:{
                columns: [
                    {
                        title: this.$t('name'),
                        key: 'title'
                    }, {
                        title: this.$t('router_path'),
                        key: 'path',
                    }, {
                        title: this.$t('subsys'),
                        key: 'subName',
                    }, {
                        title: this.$t('sort'),
                        key: 'sort',
                    }, {
                        title: this.$t('display'),
                        key: 'hideInMenu',
                    }, {
                        title: this.$t('permission_identifier'),
                        key: 'permission',
                    }, {
                        title: this.$t('op'),
                        type: 'action',
                        width: '200',
                        actions: function(that) {
                            let btn = []
                            if(that.$route.meta.access.includes('1000.05.04.001')) {
                                btn.push(
                                    {
                                        title: that.$t('e_menu'),
                                        tip: that.$t('edit'),
                                        marginRight:40,
                                        marginLeft:8,
                                        src:require('../../../assets/images/node/right1.svg')
                                    },
                                    {
                                        title: that.$t('add_submenu'),
                                        tip: that.$t('add_submenu'),
                                        marginRight:40,
                                        marginLeft:0,
                                        src:require('../../../assets/images/addMechanism.svg')
                                    }
                                )
                            }

                            if(that.$route.meta.access.includes('1000.05.04.002')) {
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
            },
            selectMenu:'',
            // 树状图数据
            dataTree: [],
            treeData:[],
            deleteModel: {
                status: false,
                loading: false,
                formValidate: {}
            },
            spinShow: false,
            confirmSelect:""
        }
        
    },
    components: {
        TreeGrid,
    },
    computed: {
        ...mapGetters([
            'menuSubSysList'
        ]),
    },
    methods: {
        ...mapActions([
            'getMenuList',
            'saveMenu',
            'deleteMenu'
        ]),
        init () {
            this.getMenuList().then(res => {
                this.baseSystem = res.data.rs[0].title
                this.baseId = res.data.rs[0].id
                this.menuList.data = res.data.rs[0].children
                this.dataTree = res.data.rs
            })
        },
        add () {
            this.title = this.$t('add_menu')
            this.show_bg = true
            this.show_menu = true
            this.formValidate = {
                meta:{
                    icon:''
                },
                parent:{
                    title:''
                },
                subName:'基础系统',
                showMenu: 'true'
            }
            this.treeData = this.dataTree
        },
        open_menu () {
            this.select_menu = true
        },
        close () {
            this.show_bg = false
            this.show_menu = false
            this.select_menu = false
        },
        close1 () {
            this.select_menu = false
        },
        selectTree (event) {
            if (event.length > 0) {
                this.confirmSelect = event
                this.selectMenu = event[0].title
                this.parentId = event[0].id
            }
        },
        confirmTree () {
           this.select_menu = false
           if (this.confirmSelect[0].children.length > 0) {
               this.formValidate.sort = this.confirmSelect[0].children[this.confirmSelect[0].children.length-1].sort + 30
           } else {
               this.formValidate.sort = 30
           }
           if ( this.selectMenu ) {
               this.formValidate.parent.title = this.selectMenu
               this.formValidate.parent.id = this.parentId
           }
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.spinShow = true
                    let subsysId =  this.menuSubSysList.find(e => e.name == this.formValidate.subName)
                    subsysId = subsysId.id
                    let data = {
                        parent:{
                            id: this.formValidate.parent.id
                        },
                        id: this.formValidate.id ? this.formValidate.id : '',
                        name: this.formValidate.title ? this.formValidate.title : '',
                        href: this.formValidate.path ? this.formValidate.path : '',
                        target: this.formValidate.redirect ? this.formValidate.redirect : '',
                        icon: this.formValidate.icon ? this.formValidate.icon : '',
                        sort: this.formValidate.sort ? this.formValidate.sort : '',
                        isShow: this.formValidate.showMenu == 'true' ? '1' : '0',
                        permission: this.formValidate.permission ? this.formValidate.permission : '',
                        routerName: this.formValidate.name ? this.formValidate.name : '',
                        routerComponent: this.formValidate.component ? this.formValidate.component : '',
                        subsys:{
                            id: subsysId ? subsysId : ''
                        },
                        parentIds:this.formValidate.parentIds,
                        active:this.formValidate.meta.active
                    }
                    this.saveMenu(data).then(res => {
                        this.spinShow = false
                        if (res.data.code == 0) {
                            this.$Message.success(this.$t('op_ok'));
                            this.close()
                            this.init()
                        }
                    }).catch(err => this.spinShow = false)
                    
                } else {
                    this.$Message.error(this.$t('unvalid_param'));
                }
            })
        },
        //搜索上级菜单
        searchOranization (value) {
            let arrs = []
            arrs = JSON.parse(JSON.stringify(this.dataTree))
            if(value === '') {
                this.treeData = arrs
                return
            }
            this.treeData = deal(arrs, node => node.title.indexOf(value) > -1 )
        },
        // 删除菜单
        delMenu () {
            this.deleteModel.loading = true
            this.deleteMenu({id:this.delMenuId}).then(res => {
                this.deleteModel.loading = false
                if (res.data.code !== 0) return
                this.deleteModel.status = false
                this.$Message.success(this.$t('delete_ok'))
                this.init()
            }).catch(err => this.deleteModel.loading = false)
        },
        rowClick (data, index, event ,text) {
            this.treeData = this.dataTree
            if ( text === this.$t('e_menu')) {
                this.title = text
                this.show_bg = true
                this.show_menu = true
                let _a = Object.assign({},data)
                this.formValidate = _a
                if(this.formValidate.parent === null){
                    this.formValidate.parent = {
                        title:this.baseSystem,
                        id:this.baseId
                    }
                }
                this.formValidate.showMenu = this.formValidate.hideInMenu ? 'false' : 'true'
            }
            if ( text === this.$t('add_submenu')) {
                
                this.title = text
                this.show_bg = true
                this.show_menu = true
                let _a = Object.assign({},data)
                this.formValidate = {
                    meta:{
                        icon:''
                    },
                    parent:{
                        title:_a.title,
                        id:_a.id
                    },
                    parentIds:_a.parentIds,
                    subName:'基础系统',
                    showMenu: 'true'
                }
                if(data.children.length>0){
                    this.formValidate.sort = data.children[data.children.length-1].sort +30
                }else{
                    this.formValidate.sort = 30
                }
            }
            if ( text === this.$t('delete') ) {
                this.deleteModel.status = true
                this.delMenuId = data.id
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
    created () {
        this.$store.dispatch('getMenuSubSysList')
        this.init()
    },
    mounted () {
        this.$nextTick(()=>{
            this.treeHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
        })
        window.onresize = () => {
            this.treeHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
        }
    }
}
</script>