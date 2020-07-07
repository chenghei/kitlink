<style lang="less" scoped src="./dictionaries.less"></style>
<template>
    <div class="content-body">
        <div class="content boxShadow">
            <div class="header">
                <span>{{$t('dict')}}</span>
                <div @click="add" v-if="$route.meta.access.includes('1000.05.05.001')">
                    <img src="../../../assets/images/add18.svg">
                    {{$t('add_dict')}}
                </div>
            </div>
            <Row type="flex"  class="content_select">
                <div class="content_select_input">
                <p>{{$t('type')}}：</p> 
                <i-col span="12" style="width:200px">
                    <i-select v-model="dictionariesList.type" filterable clearable>
                        <i-option v-for="(item,index) in typeList" :value="item" :key="index">{{ item }}</i-option>
                    </i-select>
                </i-col>
                </div>
                <div class="content_select_input">
                    <p>{{$t('description')}}：</p>
                    <Input type="text" v-model="dictionariesList.description" style="width:300px"/>
                </div>
                <div class="select_button" @click="init">{{$t('query')}}</div>
            </Row>
            <Table ref="table" :height="tableHeight" :loading="dictionariesList.loading" :columns="dictionariesList.columns" :data="dictionariesList.data"></Table>
            <div class="list_bottom">
                <Page :total="dictionariesList.total" show-elevator show-total :page-size="dictionariesList.pageSize" @on-change="nextPage"></Page>
            </div>
        </div>
        <transition name="slide-fade">
            <div class="bg" v-if="show_bg" @click="close"></div>
        </transition>
        <!-- 新增/编辑字典 -->
        <transition name="width800-fade">
            <div class="width_800" v-if="show_dictionaries">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="140">
                <div class="add_title">
                    <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
                    {{title}}
                </div>
                <Row class="add_scroll">
                    <FormItem :label="$t('key_value')+'：'" prop="value" style="margin-top:20px">
                        <Input type="text" v-model="formValidate.value" style="width:200px"/>
                    </FormItem>
                    <FormItem :label="$t('label')+'：'" prop="label" style="margin-top:20px">
                        <Input type="text" v-model="formValidate.label" style="width:200px"/>
                    </FormItem>
                    <FormItem :label="$t('type')+'：'" prop="type" style="margin-top:20px">
                        <Input type="text" v-model="formValidate.type" style="width:200px"/>
                    </FormItem>
                    <FormItem :label="$t('description')+'：'" prop="description" style="margin-top:20px">
                        <Input type="text" v-model="formValidate.description" style="width:200px"/>
                    </FormItem>
                    <FormItem :label="$t('sort')+'：'" prop="" style="margin-top:20px">
                        <input type="number" class="input_middle" step="10" v-model="formValidate.sort" style="width:200px"/>
                    </FormItem>
                    <FormItem :label="$t('remark')+'：'" prop="">
                        <i-col>
                            <Input type="textarea" v-model="formValidate.remarks" style="width:400px;"/>
                        </i-col>
                    </FormItem>
                </Row>
                <div class="add_bottom">
                    <div class="add_button" @click="handleSubmit('formValidate')">{{$t('save')}}</div>
                </div>
                </Form>
                <Spin size="large" fix v-if="spinShow"></Spin>
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
                <Button type="success" :loading="deleteModel.loading" @click="deleteDic">{{$t('confirm')}}</Button>
                <Button @click="deleteModel.status = false">{{$t('cancel')}}</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    data () {
        return {
            delTitle: '',
            tableHeight:'',
            show_bg: false,
            show_dictionaries: false,
            title: this.$t('add_dict'),
            dictionariesList:{
                columns: [
                    {
                        title: this.$t('key_value'),
                        key: 'value',
                        minWidth: 70,
                    },
                    {
                        title: this.$t('label'),
                        key: 'label',
                        minWidth: 70,
                    },
                    {
                        title: this.$t('type'),
                        key: 'type',
                        minWidth: 70,
                    },
                    {
                        title: this.$t('description'),
                        key: 'description',
                        minWidth: 70,
                    },
                    {
                        title: this.$t('sort'),
                        key: 'sort',
                        minWidth: 70,
                    },
                    {
                        title: this.$t('op'),
                        key: 'action',
                        width:220,
                        render: (h, params) => {
                            let btn = []

                            if(this.$route.meta.access.includes('1000.05.05.001')) {
                                btn.push(
                                    h('Tooltip',{
                                        props:{
                                        content: this.$t('add_key_value'),
                                        placement:'top',
                                        },
                                        style: {
                                            marginRight: '40px'
                                        }
                                    }, [
                                        h('img',{
                                        attrs: {
                                            src: require("../../../assets/images/addMechanism.svg"),
                                        },
                                        style: {
                                            width:'16px',
                                            cursor:'pointer'
                                        },
                                        on: {
                                            click: () => {
                                                this.title = this.$t('add_key_value')
                                                this.show_bg = true
                                                this.show_dictionaries = true
                                                this.formValidate = {}
                                                this.formValidate.type = params.row.type
                                                this.formValidate.description = params.row.description
                                                this.formValidate.sort = params.row.sort + 10
                                            }
                                        }
                                        })
                                    ])
                                )
                            }

                            if(this.$route.meta.access.includes('1000.05.05.001')) {
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
                                            cursor:'pointer'
                                        },
                                        on: {
                                            click: () => {
                                                this.title = this.$t('e_dict')
                                                this.show_bg = true 
                                                this.show_dictionaries = true
                                                this.formValidate = JSON.parse(JSON.stringify(params.row)) 
                                                }
                                            }
                                        })
                                    ])
                                )
                            }

                            if(this.$route.meta.access.includes('1000.05.05.002')) {
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
                                        h('img',{
                                        attrs: {
                                            src: require("../../../assets/images/node/right3.svg"),
                                        },
                                        style: {
                                            width:'16px',
                                            cursor:'pointer'
                                        },
                                        on: {
                                            click: () => {
                                                this.deleteModel.status = true
                                                this.deleteModel.formValidate.id = params.row.id
                                                this.delTitle = params.row.value
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
                total:0,
                type:'',
                description:'',
                loading:false
            },
            typeList:[],
            formValidate: {},
            ruleValidate: {
                value:[
                    { required: true, message: this.$t('input_key_value'), trigger: 'blur' }
                ],
                label:[
                    { required: true, message: this.$t('input_label'), trigger: 'blur' }
                ],
                type:[
                    { required: true, message: this.$t('input_tyep'), trigger: 'blur' }
                ],
                description:[
                    { required: true, message: this.$t('input_description'), trigger: 'blur' }
                ],
            },
            spinShow: false,
            deleteModel: {
                status: false,
                loading: false,
                formValidate: {}
            },
        }
    },
    methods: {
        ...mapActions([
            'getDictionariesList',
            'getDictionariesTypeList',
            'saveDictionaries',
            'deleteDictionaries'
        ]),
        init () {
            const data = {
                pageSize: this.dictionariesList.pageSize,
                pageNo: this.dictionariesList.pageNo,
                type: this.dictionariesList.type,
                description: this.dictionariesList.description
            }
            this.getDictionariesList(data).then(res => {
                const data = res.data.rs
                this.dictionariesList.data = data.data.list
                this.dictionariesList.total = data.data.count 
                this.dictionariesList.loading = false
            })
            this.getDictionariesTypeList().then(res => {
                this.typeList = res.data.rs.data
            })
        },
        nextPage (page) {
            this.dictionariesList.pageNo = page
            this.init()
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.spinShow = true
                    this.saveDictionaries(this.$refs[name].model).then(res => {
                        this.spinShow = false
                        if (res.data.code !== 0) return
                        if (this.title === this.$t('e_dict') ) {
                            this.$Message.success(this.$t('op_ok'))
                        } else {
                            this.$Message.success(this.$t('op_ok'))
                        }
                        this.init()
                        this.close()
                    }).catch(err => this.spinShow = false)
                    
                } else {
                    this.$Message.error(this.$t('unvalid_param'));
                }
            })
        },
        // 删除字典
        deleteDic () {
            this.deleteModel.loading = true
            this.deleteDictionaries({dictId: this.deleteModel.formValidate.id}).then(res => {
                this.deleteModel.loading = false
                this.deleteModel.status = false
                if (res.data.code !== 0) return
                this.$Message.success(this.$t('delete_ok'))
                this.init()
            }).catch(err => this.deleteModel.loading = false)
        },
        add () {
            this.formValidate = {}
            this.title = this.$t('add_dict')
            this.show_bg = true
            this.show_dictionaries = true
            this.formValidate.sort = 10
        },
        close () {
            this.show_bg = false
            this.show_dictionaries = false
        }
    },
    created () {
        this.init()
    },
    mounted () {
        this.$nextTick(()=>{
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
        })
        window.onresize = () => {
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 100
        }
    },
}
</script>