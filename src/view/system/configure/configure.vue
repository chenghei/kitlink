<style lang="less" scoped src="./configure.less"></style>
<template>
    <div class="content-body">
        <div class="content boxShadow">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="top">
            <div class="header">
                <span>{{$t('setting')}}</span>
            </div>
            <div class="configure_content">
                <Row>
                    <i-col :sm="24" :md="12" :lg="8">
                        <div class="top_title">{{$t('database')}}</div>
                        <FormItem :label="$t('address')+'：'" prop="">
                            <Input type="text" v-model="formValidate.jdbc_url" style="width:300px"/>
                        </FormItem>
                        <FormItem :label="$t('user1')+'：'" prop="" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.jdbc_username" style="width:300px"/>
                        </FormItem>
                        <FormItem :label="$t('password')+'：'" prop="" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.jdbc_password" style="width:300px"/>
                        </FormItem>
                    </i-col>
                    <i-col  :sm="24" :md="12" :lg="8">
                        <div class="top_title">{{$t('pool_monitor')}}</div>
                        <FormItem :label="$t('initial_thread')+'：'" prop="jdbc_pool_init">
                            <Input type="text" v-model="formValidate.jdbc_pool_init" style="width:300px"/>
                        </FormItem>
                        <FormItem label="Minldle：" prop="jdbc_pool_minIdle" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.jdbc_pool_minIdle" style="width:300px"/>
                        </FormItem>
                        <FormItem :label="$t('maximum_activity')+'：'" prop="jdbc_pool_maxActive" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.jdbc_pool_maxActive" style="width:300px"/>
                        </FormItem>
                    </i-col>
                    <i-col :sm="24" :md="12" :lg="8">
                        <div class="top_title">{{$t('system_information')}}</div>
                        <FormItem :label="$t('interval')+'：'" prop="">
                            <Input type="text" v-model="formValidate.notify_remind_interval" style="width:300px"/>
                        </FormItem>
                        <FormItem :label="$t('paging_configuration')+'：'" prop="" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.page_pageSize" style="width:300px"/>
                        </FormItem>
                        <FormItem :label="$t('session_time_out')+'：'" prop="" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.session_sessionTimeout" style="width:300px"/>
                        </FormItem>
                        <FormItem :label="$t('session_cleanup_interval')+'：'" prop="" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.session_sessionTimeoutClean" style="width:300px"/>
                        </FormItem>
                        <FormItem :label="$t('maximum_upload_limit')+'：'" prop="" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.web_maxUploadSize" style="width:300px"/>
                        </FormItem>
                    </i-col>
                </Row>
                <Row>
                    <i-col :sm="24" :md="12" :lg="8">
                        <div class="top_title">{{$t('data_acquisition')}}</div>
                        <FormItem :label="$t('middleware')+' API：'" prop="">
                            <Input type="text" v-model="formValidate.data_api_url" style="width:300px"/>
                        </FormItem>
                        <FormItem :label="$t('middleware')+' CMD：'" prop="" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.data_cmd_url" style="width:300px"/>
                        </FormItem>
                        <FormItem :label="'MQTT（'+$t('address')+'）：'" prop="" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.data_mqtt_uri" style="width:300px"/>
                        </FormItem>
                        <FormItem :label="'MQTT（'+$t('user')+'）：'" prop="" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.data_mqtt_username" style="width:300px"/>
                        </FormItem>
                        <FormItem :label="'MQTT（'+$t('password')+'）：'" prop="" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.data_mqtt_password" style="width:300px"/>
                        </FormItem>
                        <FormItem :label="'MQTT（'+$t('terminal')+' ID）：'" prop="" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.data_mqtt_clientid" style="width:300px"/>
                        </FormItem>
                    </i-col>
                    <i-col :sm="24" :md="12" :lg="8">
                        <div class="top_title">{{$t('notification')}}</div>
                        <FormItem :label="$t('server_addr')+'：'" prop="">
                            <Input type="text" v-model="formValidate.sms_url" style="width:300px"/>
                        </FormItem>
                        <FormItem :label="$t('user')+'：'" prop="" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.sms_account" style="width:300px"/>
                        </FormItem>
                        <FormItem :label="$t('password')+'：'" prop="" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.sms_password" style="width:300px"/>
                        </FormItem>
                    </i-col>
                    <i-col :sm="24" :md="12" :lg="8">
                        <div class="top_title">{{$t('email_notification')}}</div>
                        <FormItem :label="$t('server_addr')+'：'" prop="notify_mail_host">
                            <Input type="text" v-model="formValidate.notify_mail_host" style="width:300px"/>
                        </FormItem>
                        <FormItem :label="$t('service_port')+'：'" prop="notify_mail_port" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.notify_mail_port" style="width:300px"/>
                        </FormItem>
                        <FormItem :label="$t('user')+'：'" prop="notify_mail_user" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.notify_mail_user" style="width:300px"/>
                        </FormItem>
                        <FormItem :label="$t('password')+'：'" prop="notify_mail_password" style="margin-top:20px">
                            <Input type="text" v-model="formValidate.notify_mail_password" style="width:300px"/>
                        </FormItem>
                    </i-col>
                </Row>
            </div>
            <div class="add_bottom" style="width:100%">
                <div class="add_button" @click="handleSubmit('formValidate')" v-if="$route.meta.access.includes('1000.05.06.001')">{{$t('save')}}</div>
            </div>
            </Form>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    data () {
        return {
            formValidate: {},
            ruleValidate: {
                jdbc_pool_init: [
                    { required: true, message: this.$t('input_the')+this.$t('initial_thread'), trigger:'blur' }
                ],
                jdbc_pool_minIdle: [
                    { required: true, message: this.$t('input_the')+'Minldle', trigger:'blur' }
                ],
                jdbc_pool_maxActive: [
                    { required: true, message: this.$t('input_the')+this.$t('maximum_activity'), trigger:'blur' }
                ],
                notify_mail_host: [
                    { required: true, message: this.$t('input_the')+this.$t('server_addr'), trigger:'blur' }
                ],
                notify_mail_port: [
                    { required: true, message: this.$t('input_the')+this.$t('service_port'), trigger:'blur' }
                ],
                notify_mail_user: [
                    { required: true, message: this.$t('input_the')+this.$t('user1'), trigger:'blur' }
                ],
                notify_mail_password: [
                    { required: true, message: this.$t('input_the')+this.$t('password'), trigger:'blur' }
                ],
            },
            spinShow: false,
        }
    },
    methods: {
        ...mapActions([
            'getConfigureList',
            'saveConfig'
        ]),
        init () {
            this.getConfigureList().then(res => {
                this.formValidate = res.data.rs.data
            })
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.spinShow = true;
                    this.saveConfig(this.$refs[name].model).then(result => {
                        this.spinShow = false;
                        this.init();
                        if (res.data.code !== 0) return
                        this.$Message.success(this.$t('save_ok'));
                    }).catch(err => {
                        this.spinShow = false;
                        this.$Message.error(err);
                    })
                } else {
                    this.$Message.error(this.$t('unvalid_format'));
                }
            })
        },
    },
    created () {
        this.init()
    },
}
</script>