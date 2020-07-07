<template>
    <div class="content-body">
        <div class="content boxShadow">
            <div class="header">
                <span>{{$t('alarm_rule_list')}}</span>
                <div>
                    <img src="../../../assets/images/add18.svg">
                    {{$t('add_alarm_rule')}}
                </div>
            </div>
            <Row type="flex" align="middle" class="content_select">
                <span>{{$t('alert_level')}}：</span> 
                <Row>
                    <i-col span="12" style="width:200px">
                        <i-select  filterable clearable>
                            <i-option v-for="(item,index) in cityList" :value="item.value" :key="index">{{ item.label }}</i-option>
                        </i-select>
                    </i-col>
                </Row>
                <span style="margin-left:30px;">{{$t('node_type')}}：</span> 
                <Row>
                    <i-col span="12" style="width:200px">
                        <i-select  filterable clearable>
                            <i-option v-for="(item,index) in cityList" :value="item.value" :key="index">{{ item.label }}</i-option>
                        </i-select>
                    </i-col>
                </Row>
                <span style="margin-left:30px;">{{$t('name')}}：</span>
                <Input type="text"  style="width:300px"/>
                <div class="select_button" >{{$t('query')}}</div>
            </Row>
            <Table :columns="ruleList.columns" :data="ruleList.data" ref="table" :height="tableHeight" ></Table>
            <div class="list_bottom">
                <Page show-elevator show-total ></Page>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            tableHeight: '',
            ruleList: {
                columns :[
                    {
                        title: this.$t('node_type'),
                        key: 'type'
                    },
                    {
                        title: this.$t('name'),
                        key: 'type'
                    },
                    {
                        title: this.$t('expression'),
                        key: 'type'
                    },
                    {
                        title: this.$t('type'),
                        key: 'type'
                    },
                    {
                        title: this.$t('rule_description'),
                        key: 'type'
                    },
                    {
                        title: this.$t('alert_level'),
                        key: 'type'
                    },
                    {
                        title: this.$t('remark'),
                        key: 'type'
                    },
                    {
                        title: this.$t('op'),
                        width: 200,
                        render: (h, params) => {
                            return h('div', [
                                h('Tooltip',{
                                    props:{
                                    content:'修改',
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

                                            }
                                        }
                                    })
                                ]),
                                h('Tooltip',{
                                    props:{
                                    content:'删除',
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
                                            
                                        }
                                    }
                                    })
                                ]),
                            ]);
                        }
                    },
                ],
                data: [
                    {
                        type:'2'
                    }
                ]
            },
            cityList: [
                {
                    value: 'New York',
                    label: 'New York'
                },
                {
                    value: 'London',
                    label: 'London'
                },
                {
                    value: 'Sydney',
                    label: 'Sydney'
                },
                {
                    value: 'Ottawa',
                    label: 'Ottawa'
                },
                {
                    value: 'Paris',
                    label: 'Paris'
                },
                {
                    value: 'Canberra',
                    label: 'Canberra'
                }
            ],
        }
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