<style lang="less" scoped src='./group.less'></style>
<template>
    <div id="grid_group">
        <Row type="flex" style="justify-content: space-between;">
            <i-col class="content_left boxShadow">
                <div class="header">
                    <span>{{$t('group_list')}}</span>
                    <Icon type="md-sync" size="20" @click="init" style="cursor:pointer"/>
                </div>
                <div class="tree_out">
                    <Tree :data="groupsList" @on-select-change="changeGroup"></Tree>
                    <Spin size="large" fix v-if="groupSpin"></Spin>
                </div>
            </i-col>
            <i-col class="content_right boxShadow">
                <div class="header">
                    <span>{{$t('group_manager')}}</span>
                    <div>
                        <div @click="add_group" v-if="$route.meta.access.includes('1000.04.003')">
                            <img src="../../../assets/images/add18.svg">
                            {{$t('add_group')}}
                        </div>
                    </div>
                </div>
                <Row type="flex" class="content_select"> 
                    <div class="content_select_input">
                        <p>{{$t('name')}}：</p>
                        <Input type="text" v-model="groupView.searchValue" style="width:300px"/>
                    </div>
                    <div class="select_button" @click="handleSearch">{{$t('query')}}</div>
                </Row>
                <Table ref="table" :loading="groupView.loading" :height="tableHeight" :columns="groupView.columns" :data="groupView.data"></Table>
            </i-col>
        </Row>
        <transition name="slide-fade">
            <div class="bg" v-if="show_bg" @click="close"></div>
        </transition>
        <!-- 添加/编辑分组 -->
        <transition name="width800-fade">
            <div class="width_800" v-show="show_group">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="140">
                    <div class="add_title">
                        <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
                        {{title}}
                    </div>
                    <Row class="add_scroll">
                        <FormItem :label="$t('group_name')+'：'" prop="name" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.name" style="width:200px"/>
                        </FormItem>
                        <FormItem :label="$t('remark')+'：'" prop="remarks">
                        <i-col>
                            <Input type="textarea"  v-model="formValidate.remarks" style="width:400px;"/>
                        </i-col>
                        </FormItem>
                        <FormItem :label="$t('notify_method')+'：'" prop="notifyMethod" >
                            <i-col>
                                <CheckboxGroup v-model="notifyMethod" @on-change="notifyMethodChange">
                                    <Checkbox label="0">{{$t('none_notify')}}</Checkbox>
                                    <Checkbox label="1">{{$t('sms_notify')}}</Checkbox>
                                    <!-- <Checkbox label="2">{{$t('email_notify')}}</Checkbox> -->
                                    <Checkbox label="3">{{$t('wechat_notify')}}</Checkbox>
                                    <Checkbox label="4">{{$t('voice_notify')}}</Checkbox>
                                </CheckboxGroup>
                            </i-col>
                        </FormItem>
                    </Row>
                    <div class="add_bottom">
                        <div class="add_button" @click="handleSubmit('formValidate')" >{{$t('save')}}</div>
                    </div>
                    <Spin size="large" fix v-if="spinShow"></Spin>
                </Form>
            </div>
        </transition>
        <!-- 人员管理 -->
        <transition name="width800-fade">
            <div class="width_800" v-show="show_user" style="width:40vw;">
                <div class="add_title" style="margin-bottom:20px">
                    <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
                    {{$t('person_manager')}}
                </div>
                <Row class="add_scroll" style="padding:0 30px">
                    <Table ref="selection" :loading="groupGriders.loading" :height="tableHeight" :columns="groupGriders.columns" :data="groupGriders.data"></Table>
                    <div class="list_bottom">
                        <Page :total="groupGriders.total" :page-size="groupGriders.pageSize" 
                        @on-change="gridersNextPage" show-elevator show-total></Page>
                    </div>
                </Row>
                <div class="add_bottom" style="width:40vw;">
                    <div class="add_button" @click="getsextGroupGriders">{{$t('add_personnel')}}</div>
                </div>
            </div>
        </transition>
        <!-- 分配人员 -->
        <transition name="width800-fade" style="width:40vw;">
            <div class="inner_800" v-show="show_member">
                <div class="add_title" style="margin-bottom:20px">
                    <img src="../../../assets/images/node/close.svg" alt="close" @click="close1">
                    {{$t('add_personnel')}}
                </div>
                <Row class="add_scroll" style="padding:0 30px">
                    <Table ref="selection" 
                        :loading="extGroupGriders.loading" :height="tableHeight" :columns="extGroupGriders.columns" :data="extGroupGriders.data" @on-select-all-cancel="handleSelectAll" @on-select-all="handleSelectAll" @on-select="handleSelect" @on-select-cancel="handleCancel"></Table>
                    <div class="list_bottom">
                        <Page :total="extGroupGriders.total" 
                        :page-size="extGroupGriders.pageSize" @on-change="extGridersNextPage" show-elevator show-total></Page>
                    </div>
                </Row>
                <div class="add_bottom" style="width:40vw;">
                    <div class="add_button" @click="addGrider">{{$t('confirm')}}</div>
                </div>
                <Spin size="large" fix v-if="griderSpin"></Spin>
            </div>
        </transition>

        <Modal v-model="deleteModel.status">
            <p slot="header" style="color:#f60;text-align:center"></p>
            <div style="text-align:center">
                <p>
                    <Icon type="ios-alert-outline" size="22"/>
                    {{$t('del_confirm')}} {{delTitle}}？
                </p>
                <p>{{$t("cant_restore_delete")}}</p>
            </div>
            <div slot="footer">
                <Button type="success" :loading="deleteModel.loading" @click="deleteGroups">{{$t('confirm')}}</Button>
                <Button @click="deleteModel.status = false">{{$t('cancel')}}</Button>
            </div>
        </Modal>

        <Modal v-model="griderModifyModel.status">
            <p slot="header" style="color:#f60;text-align:center"></p>
            <div style="text-align:center" v-if="$i18n.locale==='en-US'">
                <p><Icon type="ios-alert-outline" size="22"/>Are you sure you want to remove grid member <b>[{{griderModifyModel.formValidate.name}}]</b> from group <b>[{{groupName}}]</b> ?</p>
            </div>
            <div style="text-align:center" v-if="$i18n.locale==='zh-CN'">
                <p><Icon type="ios-alert-outline" size="22"/>你确定要将网格员 <b>[{{griderModifyModel.formValidate.name}}]</b> 移出分组 <b>[{{groupName}}]</b> 吗?</p>
            </div>
            <div slot="footer">
                <Button type="success" :loading="griderModifyModel.loading" @click="removeGrider">{{$t('confirm')}}</Button>
                <Button @click="griderModifyModel.status = false">{{$t('cancel')}}</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { parseJson } from '@/libs/util'
export default {
    data () {
        return {
            delTitle: '',
            pid: '',
            groups: [],
            groupId: '',
            groupName: '',
            groupSpin: false,
            show_bg: false,
            show_group: false,
            show_user: false,
            show_member: false,
            tableHeight:null,
            title:'',
            formValidate:{
                pid: 0,
                notifyMethod: []
            },
            ruleValidate:{
                name: [
                    { required: true,  message: this.$t('input_group_name'), trigger: 'blur' }
                ],
                notifyMethod:[
                    { required: true, type: 'array', message: this.$t('select_notify_method'), trigger:'change' }
                ]
            },
            notifyMethod: [],
            spinShow: false,
            groupGriders: {
                columns: [
                    {
                        title: this.$t('name'),
                        key: 'name'
                    },
                    {
                        title: this.$t('mobile'),
                        key: 'mobile',
                    },
                    {
                        title: this.$t('gender'),
                        render: (h, params) => {
                            return h('span', params.row.gender === '1' ? this.$t('gender_male') : this.$t('gender_female'))
                        }
                    },
                    {
                        title: this.$t('remark'),
                        key: 'remarks',
                    },
                    {
                        title: this.$t('op'),
                        key: 'action',
                        render: (h, params) => {
                            return h('div', [
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
                                            width:'16px',
                                            marginTop:'4px',
                                            cursor:'pointer'
                                        },
                                        on: {
                                            'click': () => {
                                                this.griderModifyModel.status = true
                                                this.griderModifyModel.formValidate = params.row
                                            }
                                        }
                                    }),
                                ])
                            ]);
                        }
                    },
                ],
                data: [],
                pageSize: 10,
                pageNo: 1,
                total: 0,
                loading: false
            },
            extGroupGriders: {
                columns: [
                    {
                        type: 'selection',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: this.$t('name'),
                        key: 'name'
                    },
                    {
                        title: this.$t('mobile'),
                        key: 'mobile',
                    },
                    {
                        title: this.$t('gender'),
                        render: (h, params) => {
                            return h('span', params.row.gender === '1' ?  this.$t('gender_male'): this.$t('gender_female'))
                        }
                    },
                    {
                        title: this.$t('remark'),
                        key: 'remarks',
                    }
                ],
                data: [],
                selected: new Set(),
                pageSize: 10,
                pageNo: 1,
                total: 0,
                loading: false
            },
            griderSpin: false,
            groupsList: [],
            groupView: {
                columns: [
                    {
                        title: this.$t('group_name'),
                        key: 'groupName',
                        width:170,
                    },
                    {
                        title: this.$t('notify_method'),
                        key: 'notify',
                        minWidth:70,
                    },
                    {
                        title: this.$t('remark'),
                        key: 'remarks',
                        minWidth:70,
                    },
                    {
                        title: this.$t('upd_time'),
                        key: 'updateDate',
                        minWidth:70,
                    },
                    {
                        title: this.$t('creator'),
                        key: 'creator',
                        minWidth:70,
                    },
                    {
                    title: this.$t('op'),
                    key: 'action',
                    width:230,
                    render: (h, params) => {
                        let btn = []

                        if(this.$route.meta.access.includes('1000.04.003')) {
                            btn.push(
                                h('Tooltip',{
                                    props:{
                                    content: this.$t('assign_personnel'),
                                    placement:'top',
                                    },
                                    style: {
                                        marginRight: '40px'
                                    }
                                }, [
                                    h('img', {
                                        attrs: {
                                            src: require("../../../assets/images/renyuanguanli.svg"),
                                        },
                                        style: {
                                            width:'16px',
                                            marginTop:'4px',
                                            cursor:'pointer'
                                        },
                                        on: {
                                            click: () => {
                                                this.show_user = true
                                                this.show_bg = true
                                                this.getsgroupGriders(params.row)
                                            }
                                        }
                                    }),
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
                                                this.title = this.$t('e_group')
                                                this.show_group = true
                                                this.show_bg = true
                                                this.editGroup(params.row)
                                            }
                                        }
                                    })
                                ]),
                            )
                        }

                        if(this.$route.meta.access.includes('1000.04.004')) {
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
                                            width:'16px',
                                            marginTop:'4px',
                                            cursor:'pointer'
                                        },
                                        on: {
                                            'click': () => { 
                                                this.deleteModel.status = true
                                                this.deleteModel.formValidate.id = params.row.id
                                                this.delTitle = params.row.groupName
                                            }
                                        }
                                    })
                                ]),
                            )
                        }
                        return h('div', btn)
                    }
                    },
                ],
                data: [],
                searchData: [],
                searchValue: '',
                loading: false
            },
            deleteModel: {
                status: false,
                loading: false,
                formValidate: {}
            },
            griderModifyModel: {
                status: false,
                loading: false,
                formValidate: {}
            }
        }
    },
    methods:{
        ...mapActions([
            'getGroupsList',
            'createGroup',
            'deleteGroup',
            'getGroupGriders',
            'getGroupExtGriders',
            'griderModify'
        ]),
        init() {
            // this.groupSpin = this.groupView.loading = true
            this.getGroupsList({useFor: 1}).then(res => {
                this.groupSpin = this.groupView.loading = false
                this.groups = parseJson(res.data.rs.data)
                this.groupView.data = this.groupView.searchData = this.groups
                this.groupsList = [{
                    title: '根节点',
                    expand: true,
                    children: this.groups
                }]
            })
        },
        //选择分组
        changeGroup(event) {
            if (event.length > 0) {
                const info = event[0]
                if(info.nodeKey === 0) {
                    this.groupView.data = this.groupView.searchData = this.groups
                    return
                }
                const list = this.groups.find(v => v.id === info.id)
                if (list) {
                    this.pid = list.id || 0
                    this.groupView.data = this.groupView.searchData = list.children || []
                }else{
                    this.groupView.data = event
                }
            }
        },
        handleSearch() {
            this.groupView.data = this.groupView.searchData.filter(item => item.groupName.indexOf(this.groupView.searchValue) > -1)
        },
        notifyMethodChange (event) {
            this.notifyMethod = this.formValidate.notifyMethod = event
            if (event.includes('0')) this.notifyMethod = this.formValidate.notifyMethod = ['0']
            if (event[0] === '0') {
                if(event.length > 1){
                    event.shift()
                    this.notifyMethod = this.formValidate.notifyMethod = event
                }
            }
        },
        // 编辑保存分组
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.spinShow = true
                    let data = JSON.parse(JSON.stringify(this.$refs[name].model))
                    data.notifyMethod = data.notifyMethod.join(',')
                    data.pid = this.formValidate.pid || 0
                    this.createGroup(data).then(res => {
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
        //删除分组
        deleteGroups () {
            this.deleteModel.loading = true
            this.deleteGroup({groupId: this.deleteModel.formValidate.id}).then(res => {
                this.deleteModel.loading = false
                if (res.data.code !== 0) return
                this.deleteModel.status = false
                this.$Message.success(this.$t('delete_ok'))
                this.init()
            }).catch(err => this.deleteModel.loading = false)
        },
        //编辑分组弹窗
        editGroup(row) {
            this.formValidate = {
                name: row.groupName,
                ...row
            }
            this.notifyMethod = this.formValidate.notifyMethod = row.notifyMethod.split(',')
        },
        //分组人员管理
        getsgroupGriders(row) {
            this.groupId = row.id
            this.groupName = row.groupName
            const data = {
                pageSize: this.groupGriders.pageSize, 
                pageNo: this.groupGriders.pageNo, 
                groupId: row.id
            }
            this.getGroupGriders(data).then(res => {
                const data = res.data.rs
                this.groupGriders.data = data.data.list
                this.groupGriders.total = data.data.count
                this.groupGriders.loading = false
            })
        },
        gridersNextPage(page) {
            this.groupGriders.pageNo = page
            this.groupGriders()
        },
        //网格员移出
        removeGrider() {
            const data = {
                groupId: this.groupId,
                griderIds: this.griderModifyModel.formValidate.id,
                opType: 'R',
            }
            this.griderModifyModel.loading = true
            this.griderModify(data).then(res => {
                this.griderModifyModel.loading = false
                if (res.data.code !== 0) return
                this.griderModifyModel.status = false
                this.$Message.success(this.$t('delete_ok'))
                this.show_member = false
                this.getsgroupGriders({
                    id: this.groupId,
                    groupName: this.groupName
                })
            }).catch(err => this.griderModifyModel.loading = false)
        },
        //非分组人员管理
        getsextGroupGriders() {
            this.show_member = true
            this.extGroupGriders.selected = new Set()
            const data = {
                pageSize: this.extGroupGriders.pageSize, 
                pageNo: this.extGroupGriders.pageNo, 
                groupId: this.groupId
            }
            this.getGroupExtGriders(data).then(res => {
                const data = res.data.rs
                this.extGroupGriders.data = data.data.list
                this.extGroupGriders.total = data.data.count
                this.extGroupGriders.loading = false
                this.updateChecked()
            })
        },
        selectGrider(event) {
            this.extGroupGriders.selectList = event
        },
        //从已选项中去除取消项 
        handleCancel(selection, row) { 
            this.extGroupGriders.selected.delete(row.id)
        },
        //添加到已选项
        handleSelect(selection, row) {
            this.extGroupGriders.selected.add(row.id)
        },
        //全选
        handleSelectAll(selection) {  
            if(selection.length === 0){
                let data = this.$refs.selection.data
                data.forEach((item)=>{
                    if(this.extGroupGriders.selected.has(item.id)){
                        this.extGroupGriders.selected.delete(item.id)
                    }
                })
            }else{
                selection.forEach((item)=>{
                    this.extGroupGriders.selected.add(item.id)
                })
            }
        },
        //把源数据加上_checked字段，遍历已选项数据，更新选中状态
        updateChecked() { 
            if(!this.$refs.selection || !this.$refs.selection.data ){
                return null
            }
            let objData = this.extGroupGriders.data
            if(this.importAll){//选中所有页面
                for (let index in objData) {
                   objData[index]._checked = true
                }
            }else{//没有全部选中所有页面
                for (let index in objData) {
                    if (this.extGroupGriders.selected.has(objData[index].id)) {
                        objData[index]._checked = true
                    }
                }
            }
        },
        //网格员分配
        addGrider() {
            const data = {
                groupId: this.groupId,
                griderIds: Array.from(this.extGroupGriders.selected).join(','),
                opType: 'A',
            }
            this.griderSpin = true
            this.griderModify(data).then(res => {
                this.griderSpin = false
                this.show_member = false
                if (res.data.code !== 0) return
                this.$Message.success(this.$t('op_ok'))
                this.getsgroupGriders({
                    id: this.groupId,
                    groupName: this.groupName
                })
            }).catch(err => this.griderSpin = false)
        },
        extGridersNextPage(page) {
            this.extGroupGriders.pageNo = page
            this.getsextGroupGriders()
        },
        add_group () {
            this.formValidate = {
                pid: this.pid,
                notifyMethod: []
            }
            this.notifyMethod = []
            this.title = this.$t('add_group')
            this.show_bg = true
            this.show_group = true
        },
        close () {
            this.show_bg = false
            this.show_group = false
            this.show_user = false
            this.show_member = false
            this.$refs['formValidate'].resetFields()
        },
        close1 () {
            this.show_member = false
        }
    },
    mounted () {
        this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 230
        })
        window.onresize = () => {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 230
        }
    },
    created() {
        this.init()
    }
    
}
</script>