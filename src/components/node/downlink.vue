<template>
    <div>
        <Row :gutter="10">
            <i-col span="24">
                <Row>
                    <div @click="addConfirms" class="add_button" style="float:right;width:80px;">{{ $t('send_to') }}</div>
                    <div class="add_button" style="float:right;margin-right:5px;width:80px;background:#ed4014">{{ $t('delete') }}</div>
                </Row>
                <Row class="searchable-table-con1" style="margin-top: 10px;">
                    <Table ref="table" :height="tableHeight" :columns="columns1" :data="data1" size="default" :loading="loading" @on-selection-change="selectData"></Table>
                    <div class="list_bottom">
                        <Page :total="pageCount" :current="1" @on-change="changePage" :page-size="pageSize" show-total show-elevator></Page>
                    </div>
                </Row>
            </i-col>
        </Row>

        <Modal width="500" v-model="addConfirm.status" :loading="addConfirm.loading" >
        <p slot="header" style="color:#1A1A1A;text-align:left">Downlink{{ $t('send_to')}}</p>
        <div style="padding:0 30px">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="devEUI" prop="devEUI">
                    <Input v-model="formValidate.devEUI" readonly/>
                </FormItem>
                <FormItem label="confirmed" prop="confirmed">
                    <RadioGroup v-model="formValidate.confirmed">
                        <Radio :label=1>{{ $t('yes') }}</Radio>
                        <Radio :label=2>{{ $t('no') }}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="data" prop="data">
                    <Input v-model="formValidate.data"/>
                </FormItem>
                <FormItem label="fPort" prop="fPort">
                    <Input v-model="formValidate.fPort"/>
                </FormItem>
                <FormItem label="reference" prop="reference">
                    <Input v-model="formValidate.reference"/>
                </FormItem>
            </Form>
        </div>
        <div slot="footer">
            <Button :loading="loading" type="success" @click="add('formValidate')">处理</Button>
            <Button @click="addConfirm.status = false">取消</Button>
        </div>
        </Modal>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    name: 'downlink',
    props: {
        devEui: {
            type: String,
        }
    },
    data () {
        return {
            tableHeight: '',
            loading: false,
            columns1: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: 'id',
                    key: 'id',
                    width: 80
                },
                {
                    title: 'devEUI',
                    key: 'devEUI',
                    width: 150
                },
                {
                    title: 'fPort',
                    key: 'fPort',
                    width: 100
                },
                {
                    title: 'confirmed',
                    key: 'confirmed',
                    width: 110
                },
                {
                    title: 'reference',
                    key: 'reference',
                    width: 110
                },
                {
                    title: 'pending',
                    key: 'pending',
                    width: 110
                },
                {
                    title: 'data',
                    key: 'data'
                },
                {
                    title: this.$t('op'),
                    key: 'action',
                    width: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('Poptip', {
                                props: {
                                    confirm: true,
                                    title: this.$t('cant_restore_delete'),
                                    transfer: true
                                },
                                on: {
                                    'on-ok': () => { 
                                        
                                    }
                                }
                            }, [
                                h('Button', {
                                    style: {
                                        margin: '0 5px'
                                    },
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    }
                                }, this.$t('delete'))
                            ])
                        ]);
                    }
                }
            ],
            data1: [],
            selectdata: [],
            addConfirm: {
                status: false,
                loading: true
            },
            formValidate: {
                devEUI: this.devEui,
                confirmed: 1,
                fPort: 2
            },
            ruleValidate: {
                data: [
                    { required: true, message: this.$t('input_pls')+'data', trigger: 'blur' }
                ]
            },
            pageSize: 20,
            pageCount: 0,
            limit: 20,
            offset: 0
        }
    },
    methods: {
        ...mapActions([
            'getDownlink'
        ]),
        init () {
            this.getDownlink({dev_eui:this.devEui}).then(res => {
                this.loading = false
            }).catch(err => this.loading = false)
        },
        changePage (page) {
            this.offset = (page-1)*this.limit;
            this.init();
        },
        addConfirms () {
            this.addConfirm.status = true
        },
        selectData (data) {
            this.selectdata = data;
        },
    },
    created () {
        this.init()
    },
    mounted () {
        this.$nextTick(()=>{
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 400
        })
        window.onresize = () => {
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 400
        }
    }
}
</script>