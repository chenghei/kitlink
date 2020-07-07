<style lang="less" scoped src="./alarmDetail.less">
</style>
<template>
    <div>
        <Modal v-model="show" @on-visible-change="changeModel" :width="500">
        <p slot="header" style="color:#1A1A1A;text-align:left">{{$t('alarm_detail')}}</p>
        <div style="padding:0 30px">
            <div class="info">
                <div class="infoTitle">{{$t('device_name')}}：</div>
                <div>{{showList.name}} ({{showList.devEui}})</div>
            </div>
            <div class="info">
                <div class="infoTitle">{{$t('alarm_type')}}：</div>
                <div style="margin-right:5px"> {{showList.typeName}} ({{showList.ruleName}}) </div>
                <Badge :count="showList.counts?showList.counts:'1'" type="warning"></Badge>
            </div>
            <div class="info">
                <div class="infoTitle">{{$t('alarm_addr')}}：</div>
                <div>{{showList.address}}</div>
            </div>
            <div class="info">
                <div class="infoTitle">{{$t('alarm_time')}}：</div>
                <div>{{ms(showList.ts)}}</div>
            </div>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="top" >
                <FormItem :label="$t('proc_result_type')+'：'" prop="resultType" style="margin-top:20px">
                    <Row>
                    <i-col span="24">
                        <RadioGroup v-model="formValidate.resultType">
                            <Radio label="1" style="margin-right:10px;min-width:75px">{{$t('real_alarm')}}</Radio>
                            <Radio label="2" style="margin-right:10px;min-width:75px">{{$t('hidden_danger')}}</Radio>
                            <Radio label="3" style="margin-right:10px;min-width:75px">{{$t('false_alarm')}}</Radio>
                            <Radio label="4" style="margin-right:10px;min-width:75px">{{$t('inspection_test')}}</Radio>
                        </RadioGroup>
                    </i-col>
                    </Row>
                </FormItem>
                <FormItem :label="$t('proc_result_desc')+'：'" prop="result">
                    <Input type="textarea" v-model="formValidate.result" style="width:400px"/>
                </FormItem>
            </Form>
        </div>
        <div slot="footer">
            <Button :loading="loading" type="success" @click="handleSubmit('formValidate')">{{$t('proc')}}</Button>
            <Button @click="changeModel(false)">{{$t('cancel')}}</Button>
        </div>
        
        </Modal>
    </div>

</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    props: {
        showModel: {
            type: Boolean
        },
        modelList: {
            type:Object,
        }
    },
    data () {
        return {
            show:false,
            showList:{},
            formValidate: {
                resultType:'1',
                result:''
            },
            ruleValidate: {
                resultType: [
                    { required: true,trigger: 'change' }
                ],
            },
            loading: false,
            refresh: false
        }
    },
    watch: {
        showModel (val){
            this.show = val
        },
        modelList (val) {
            this.showList = val
        }
    },
    methods: {
        ...mapActions([
            'alarmDeal',
        ]),
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.loading = true
                    let data = {
                        ...this.$refs[name].model,
                        sequences: this.showList.sequence,
                        devEui: this.showList.devEui,
                        ruleId: this.showList.ruleId
                    }
                    this.alarmDeal(data).then(res => {
                        this.loading = false
                        this.show = false
                        this.$emit('change-model',false)
                        this.$emit('handle-alarm', true)
                        this.refresh = true
                        if (res.data.code !== 0) return
                        this.$Message.success(this.$t('proc_success'))
                    }).catch(err => this.loading = false)
                    
                } else {
                    this.$Message.error(this.$t('unvalid_param'));
                }
            })
        },
        ms (e) {
            return moment(e).format("YYYY-MM-DD HH:mm:ss")
        },
        changeModel(state){
            this.$refs['formValidate'].resetFields();
            this.$emit('change-model',state,this.refresh)
        }
    },
    mounted() {
        if(this.$i18n.locale === 'en-US') {
            moment.locale('en-us')
        }else{
            moment.locale('zh-cn')
        }
    }
}
</script>