<style lang="less" scoped src="./language.less"></style>
<template>
    <div class="content-body">
        <div class="content boxShadow">
            <div class="header">
                <span>{{$t('language_list')}}</span>
                <div @click="add" v-if="$route.meta.access.includes('1000.05.07.001')">
                    <img src="../../../assets/images/add18.svg">
                    {{$t('add_language')}}
                </div>
            </div>
             <Row type="flex" class="content_select">
                <div class="content_select_input">
                    <p>{{$t('code')}}：</p> 
                    <Input type="text" v-model="languageList.code" style="width:300px"/>
                </div>
                <div class="content_select_input">
                    <p>{{$t('chinese')}}（CN）：</p>
                    <Input type="text" v-model="languageList.cn" style="width:300px"/>
                </div>
                <div class="content_select_input">
                    <p>{{$t('english')}}（EN）：</p>
                    <Input type="text" v-model="languageList.en" style="width:300px"/>
                </div>
                <div class="select_button" @click="init">{{$t('query')}}</div>
            </Row>
            <Table ref="table" :loading="languageList.loading" :height="tableHeight" :columns="languageList.columns" :data="languageList.data"></Table>
            <div class="list_bottom">
                <Page :total="languageList.total" :page-size="languageList.pageSize" show-elevator show-total @on-change="nextPage"></Page>
            </div>
        </div>
        <transition name="slide-fade">
            <div class="bg" v-if="show_bg" @click="close"></div>
        </transition>
        <!-- 新增/编辑 -->
        <transition name="width800-fade">
            <div class="width_800" v-if="show_language">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="140">
                <div class="add_title">
                    <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
                    {{title}}
                </div>
                <Row class="add_scroll">
                    <FormItem v-if="title === $t('e_language')" label="ID：" prop="" style="margin-top:20px">
                        <Input type="text" v-model="formValidate.id" disabled style="width:300px"/>
                    </FormItem>
                    <FormItem :label="$t('code')+'：'" prop="code" style="margin-top:20px">
                        <Row>
                            <i-col span="12" style="width:300px;">
                                <Input type="text" v-model="formValidate.code" style="width:300px"/>
                            </i-col>
                            <i-col span="12" class="tip">{{$t('language_tip')}}</i-col>
                        </Row>
                    </FormItem>
                    <FormItem :label="$t('chinese')+'（CN）：'" prop="cn" style="margin-top:20px">
                        <Input type="text" v-model="formValidate.cn" style="width:300px"/>
                    </FormItem>
                    <FormItem :label="$t('english')+'（EN）：'" prop="en" style="margin-top:20px">
                        <Input type="text" v-model="formValidate.en" style="width:300px"/>
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
                <Button type="success" :loading="deleteModel.loading" @click="deleteLan">{{$t('confirm')}}</Button>
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
            show_language: false,
            title: '',
            languageList:{
                columns: [
                    {
                    title: this.$t('code'),
                    key: 'code',
                    minWidth:100,
                    },
                    {
                    title: this.$t('chinese')+'（CN）',
                    key: 'cn',
                    minWidth:70,
                    },
                    {
                    title: this.$t('english')+'（EN）',
                    key: 'en',
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
                    width:180,
                    render: (h, params) => {
                        let btn = []
                        if(this.$route.meta.access.includes('1000.05.07.001')) {
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
                                                this.title = this.$t('e_language')
                                                this.show_bg = true 
                                                this.show_language = true
                                                this.formValidate = JSON.parse(JSON.stringify(params.row))
                                            }
                                        }
                                    })
                                ])
                            )
                        }
                        if(this.$route.meta.access.includes('1000.05.07.002')) {
                            btn.push(
                                h('Tooltip',{
                                    props:{
                                    content: this.$t('delete'),
                                    placement:'top',
                                    }
                                }, [
                                    h('img',{
                                    attrs: {
                                        src: require("../../../assets/images/node/right3.svg"),
                                    },
                                    style: {
                                        width:'16px',
                                        marginTop:'4px',
                                        cursor:'pointer'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteModel.status = true
                                            this.deleteModel.formValidate.id = params.row.id
                                            this.delTitle = params.row.code
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
                total: 0,
                code: '',
                cn: '',
                en: '',
                loading:false
            },
            formValidate: {},
            ruleValidate: {
                code:[
                    { required: true, message: this.$t('input_the')+this.$t('code'), trigger: 'blur' }
                ],
                cn:[
                    { required: true, message: this.$t('input_the')+this.$t('chinese'), trigger: 'blur' }
                ],
                en:[
                    { required: true, message: this.$t('input_the')+this.$t('english'), trigger: 'blur' }
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
            'getLanguageList',
            'saveLanguage',
            'deleteLanguage'
        ]),
        init () {
            const data = {
                pageSize: this.languageList.pageSize,
                pageNo: this.languageList.pageNo,
                code: this.languageList.code,
                cn: this.languageList.cn,
                en: this.languageList.en
            }
            this.getLanguageList(data).then(res => {
                this.languageList.data = res.data.rs.data.list
                this.languageList.total = res.data.rs.data.count
                this.languageList.loading = false
            })
        },
        nextPage(page) {
            this.languageList.pageNo = page
            this.init()
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.spinShow = true
                    this.saveLanguage(this.$refs[name].model).then(res => {
                        this.spinShow = false
                        if (res.data.code !== 0) return
                        this.$Message.success(this.$t('op_ok'))
                        this.init()
                        this.close()
                    }).catch(err => this.spinShow = false)
                    
                } else {
                    this.$Message.error(this.$t('unvalid_param'));
                }
            })
        },
        // 删除语言
        deleteLan () {
            this.deleteModel.loading = true
            this.deleteLanguage({id: this.deleteModel.formValidate.id}).then(res => {
                this.deleteModel.loading = false
                this.deleteModel.status = false
                if (res.data.code !== 0) return
                this.$Message.success(this.$t('delete_ok'))
                this.init()
            }).catch(err => this.deleteModel.loading = false)
        },
        add () {
            this.formValidate = {}
            this.title = this.$t('add_language')
            this.show_bg = true
            this.show_language = true
        },
        close () {
            this.show_bg = false
            this.show_language = false
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
    }
}
</script>