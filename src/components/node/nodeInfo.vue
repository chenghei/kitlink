<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="Name：" prop="name">
            <Input v-model="formValidate.name" :placeholder="$t('input_pls')+'Name'"/>
        </FormItem>
        <FormItem label="appEUI：" prop="appEUI">
            <Input v-model="formValidate.appEUI" :placeholder="$t('input_pls')+'appEUI'" readonly/>
        </FormItem>
        <FormItem label="devEUI：" prop="devEUI">
            <Input v-model="formValidate.devEUI" :placeholder="$t('input_pls')+'devEUI'" readonly/>
        </FormItem>
        <FormItem label="appKey：" prop="appKey">
            <Input v-model="formValidate.appKey" :placeholder="$t('input_pls')+'appKey'"/>
        </FormItem>
        <FormItem label="channelListID：" prop="channelListID">
            <Input v-model="formValidate.channelListID" :placeholder="$t('input_pls')+'channelListID'" readonly/>
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
        <FormItem label="Time：" prop="onlineTime">
            <Input v-model="formValidate.onlineTime" readonly/>
        </FormItem>
        <FormItem>
            <Row type="flex">
            <div class="add_button" type="primary" @click="handleSubmit('formValidate')" :loading="loading">{{ $t('save') }}</div>
            <div class="add_button" style="background:#b3b3b3;margin-left: 8px" @click="handleReset('formValidate')" >{{ $t('reset') }}</div>
            </Row>
        </FormItem>
    </Form>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    name: 'nodeInfo',
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
                name: [
                    { required: true, message: this.$t('input_pls')+'name', trigger: 'blur' },
                    { type: 'string', max: 16, message: 'name'+this.$t('unvalid_format'), trigger: 'blur'}
                ],
                appKey: [
                    { required: true, message: this.$t('input_pls')+'appKey', trigger: 'blur' },
                    { type: 'string', max: 32, message: 'appKey'+this.$t('unvalid_format'), trigger: 'blur' }
                ],
                rxWindow: [
                    { required: true, message: this.$t('choose')+'rxWindow', trigger: 'change' }
                ]
            }
        }
    },
    methods: {
        ...mapActions([
            'getNode',
            'editNodePanel'
        ]),
        init () {
            this.getNode({dev_eui:this.devEui}).then(res => {
                this.formValidate = res.data.rs.data
            }).catch(err => console.log(err))
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.editNodePanel(this.$refs[name].model).then(result => {
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
        }
    },
    created () {
        this.init()
    }
}
</script>