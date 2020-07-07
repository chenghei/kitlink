<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <FormItem label="devAddr：" prop="devAddr">
            <Row type="flex">
                <Input v-model="formValidate.devAddr" placeholder="" style="width:calc(100% - 90px)"/>
                <div class="add_button" style="min-width:85px;margin-left:3px" @click="getDevAddress">{{ $t('gen') }}</div>
            </Row>
            
        </FormItem>
        <FormItem label="devEUI：" prop="devEUI">
            <Input v-model="formValidate.devEUI" readonly/>
        </FormItem>
        <FormItem label="appSKey：" prop="appSKey">
            <Input v-model="formValidate.appSKey" :placeholder="$t('input_pls')+'appSKey'"/>
        </FormItem>
        <FormItem label="nwkSKey：" prop="nwkSKey">
            <Input v-model="formValidate.nwkSKey" :placeholder="$t('input_pls')+'nwkSKey'"/>
        </FormItem>
        <FormItem label="dbber：" prop="dbber">
            <Input v-model="formValidate.dbber" :placeholder="$t('input_pls')+'dbber'"/>
        </FormItem>
        <FormItem label="installationMargin：" prop="installationMargin">
            <InputNumber v-model="formValidate.installationMargin" :placeholder="$t('input_pls')+'installationMargin'" style="width:100%;"></InputNumber>
        </FormItem>
        <FormItem label="fCntUp：" prop="fCntUp">
            <InputNumber v-model="formValidate.fCntUp" :placeholder="$t('input_pls')+'fCntUp'" style="width:100%;"></InputNumber>
        </FormItem>
        <FormItem label="fCntDown：" prop="fCntDown">
            <InputNumber v-model="formValidate.fCntDown" :placeholder="$t('input_pls')+'fCntDown'" style="width:100%;"></InputNumber>
        </FormItem>
        <FormItem label="rxDelay：" prop="rxDelay">
            <InputNumber v-model="formValidate.rxDelay" :placeholder="$t('input_pls')+'rxDelay'" style="width:100%;"></InputNumber>
        </FormItem>
        <FormItem label="rx1DR：" prop="rx1DROffset">
            <InputNumber v-model="formValidate.rx1DROffset" :placeholder="$t('input_pls')+'rx1DR'" style="width:100%;"></InputNumber>
        </FormItem>
        <FormItem label="rx2DR：" prop="rx2DR">
            <InputNumber v-model="formValidate.rx2DR" :placeholder="$t('input_pls')+'rx2DR'" style="width:100%;"></InputNumber>
        </FormItem>
        <FormItem label="rxWindow：" prop="rxWindow">
            <Select v-model="formValidate.rxWindow" :placeholder="$t('choose')+'rxWindow'">
                <Option value="RX1">RX1</Option>
                <Option value="RX2">RX2</Option>
            </Select>
        </FormItem>
        <FormItem>
            <Row type="flex">
                <div class="add_button" @click="handleSubmit('formValidate')" >{{ $t('save') }}</div>
                <div class="add_button" style="background:#b3b3b3;margin-left: 8px" @click="handleReset('formValidate')" >{{ $t('reset') }}</div>
            </Row>
            
        </FormItem>
    </Form>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    name: 'sessionAbp',
    props: {
        devEui: {
            type: String,
        }
    },
    data () {
        return {
            loading: false,
            formValidate: {},
            ruleValidate: {
                devAddr: [
                    { required: true, message: this.$t('input_pls')+'devAddr', trigger: 'blur' },
                    { type: 'string', max: 8, message: 'devAddr'+this.$t('unvalid_format'), trigger: 'blur'}
                ],
                appSKey: [
                    { required: true, message: this.$t('input_pls')+'appSKey', trigger: 'blur' },
                    { type: 'string', max: 32, message: 'appSKey'+this.$t('unvalid_format'), trigger: 'blur' }
                ],
                nwkSKey: [
                    { required: true, message: this.$t('input_pls')+'nwkSKey', trigger: 'blur' },
                    { type: 'string', max: 32, message: 'nwkSKey'+this.$t('unvalid_format'), trigger: 'blur' }
                ],
                rxWindow: [
                    { required: true, message: this.$t('choose')+'rxWindow', trigger: 'change' }
                ]
            }
        }
    },
    methods: {
        ...mapActions([
            'getNodeSession',
            'getDevAddr',
            'editNodeSession'
        ]),
        init () {
            this.getNodeSession({dev_eui:this.devEui}).then(res => {
                this.formValidate = res.data.rs.data
                if(res.data.rs.data.devEUI === ''){
                    this.formValidate.devEUI = this.devEui
                }
            }).catch(err => console.log(err))
        },
        getDevAddress () {
            this.getDevAddr({dev_eui:this.devEui}).then(res => {
                this.formValidate.devAddr = res.data.rs.data.devAddr
            }).catch(err => {
                this.$Message.error(err);
            })
        },
        handleSubmit (name) {
            let method = 'put'
            if(this.formValidate.code === 204){
                method = 'post'
            }
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    // console.log(method);
                    this.editNodeSession({data:this.$refs[name].model,methods:method}).then(result => {
                        this.loading = false;
                        this.init();
                        if (res.data.code !== 0) return
                        this.$Message.success(this.$t('save_ok'));
                    }).catch(err => {
                        this.loading = false;
                        this.$Message.error(err);
                    })
                } else {
                    this.$Message.error(this.$t('unvalid_format'));
                }
            })
        },
        handleReset (name) {
            this.$refs[name].resetFields();
            this.loading = false;
        }

    },
    created () {
        this.init()
    }
}
</script>