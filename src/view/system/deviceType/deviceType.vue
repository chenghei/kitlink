<style lang="less" scoped src="./deviceType.less"></style>
<template>
    <div class="content-body">
        <div class="content boxShadow">
            <div class="header">
                <span>{{$t('device_list')}}</span>
                <div @click="add">
                    <img src="../../../assets/images/add18.svg">
                    {{$t('add_device')}}
                </div>
            </div>
            <Row type="flex"  class="content_select">
                <div class="content_select_input">
                    <p>{{$t('name')}}：</p>
                    <Input type="text" style="width:300px"/>
                </div>
                <div class="content_select_input">
                    <p>{{$t('type')}}：</p>
                    <Input type="text" style="width:300px"/>
                </div>
                <div class="select_button">{{$t('query')}}</div>
            </Row>
            <Table ref="table" :height="tableHeight" :columns="deviceList.columns" :data="deviceList.data"></Table>
            <div class="list_bottom">
                <Page show-elevator show-total ></Page>
            </div>
        </div>
        <transition name="slide-fade">
            <div class="bg" v-if="show_bg" @click="close"></div>
        </transition>
        <transition name="width800-fade">
            <div class="width_800" v-if="show_addtype">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="140">
                <div class="add_title">
                    <img src="../../../assets/images/node/close.svg" alt="close" @click="close">
                    {{$t('add_device')}}
                </div>
                <Row class="add_scroll">
                    <div class="addTypeTitle" style="margin-top:30px">设备</div>
                    <FormItem :label="'类型名称：'" prop="value">
                        <Input type="text" style="width:400px"/>
                    </FormItem>
                    <FormItem :label="'名称（英文）：'" prop="">
                        <Input type="text" style="width:400px"/>
                    </FormItem>
                    <FormItem :label="'设备类型：'" prop="">
                        <Input type="text" style="width:400px"/>
                    </FormItem>
                    <FormItem :label="'代码：'" prop="value">
                        <Input type="text" style="width:400px"/>
                    </FormItem>
                    <FormItem :label="'离线间隔：'" prop="value">
                        <Row>
                            <i-col span="12" style="width:200px">
                                <Input type="text" style="width:200px"/>
                            </i-col>
                            <i-col span="13" class="tip">
                                指到当前时间，超过间隔时间无数据上报，视为离线，其中：86400秒为一天
                            </i-col>
                        </Row>
                     </FormItem>
                     <FormItem :label="'图标：'" prop="value">
                        <Upload action="//jsonplaceholder.typicode.com/posts/">
                            <div style="cursor:pointer">
                            <img src="../../../assets/images/uploadavator.svg">
                            上传图标
                            </div>
                        </Upload>
                    </FormItem>
                    <div v-for="(item,index) in formValidate.typeItem" :key="index">
                        <div class="addTypeTitle" style="margin-top:30px">型号{{item.index}}</div>
                        <FormItem :label="'型号名称：'" prop="value">
                        <Input type="text" v-model="item.value" style="width:400px"/>
                        </FormItem>
                        <FormItem :label="'代码：'" prop="value">
                        <Input type="text" style="width:400px"/>
                        </FormItem>
                        <FormItem :label="'产品图片：'" prop="value">
                            <Upload action="//jsonplaceholder.typicode.com/posts/">
                                <div style="cursor:pointer">
                                <img src="../../../assets/images/uploadavator.svg">
                                上传图标
                                </div>
                            </Upload>
                        </FormItem>
                    </div>
                    <div style="display:flex;justify-content: center;margin-bottom:40px">
                        <div class="select_button"  style="margin:0;background: rgb(237, 64, 20);margin-right:30px" @click="delType">删除型号</div>
                        <div class="select_button" @click="addType" style="margin:0">添加型号</div>
                    </div>
                    
                </Row>
                <div class="add_bottom">
                    <div class="add_button" @click="handleSubmit('formValidate')">{{$t('save')}}</div>
                </div>
                </Form>
                <Spin size="large" fix v-if="false"></Spin>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    data () {
        return {
            index: 1,
            tableHeight: '',
            show_bg: false,
            show_addtype: false,
            deviceList:{
                columns: [
                    {
                        title: '名称'
                    },
                    {
                        title: '类型'
                    },
                    {
                        title: '型号'
                    },
                    {
                        title: '图标'
                    },
                    {
                        title: '产品图片'
                    },
                    {
                        title: '更新时间'
                    },
                    {
                        title: '备注'
                    },
                    {
                        title: '操作'
                    }
                ],
                data: []
            },
            formValidate:{
                typeItem:[
                    {
                        value: '',
                        index: 1
                    },
                ]
            },
            ruleValidate:{
                value:[
                    {required: true,}
                ]
            }
        }
    },
    methods: {
        delType () {
            this.index--
            this.formValidate.typeItem.pop()
        },
        addType () {
            this.index++
            this.formValidate.typeItem.push({
                value: '',
                index: this.index
            })
        },
        handleSubmit (name) {
        },
        add () {
            this.show_bg = true
            this.show_addtype = true
        },
        close () {
            this.show_bg = false
            this.show_addtype = false
        }
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