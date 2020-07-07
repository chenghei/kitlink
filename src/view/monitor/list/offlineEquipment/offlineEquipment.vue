<template>
    <div class="content-body">
        <div class="content boxShadow">
            <div class="header">
                <div>
                    <img src="../../../../assets/images/jiantouzuo.svg" alt="jiantouzuo" @click="changeRouter('/monitor/index/list')">
                    <span>{{$t('device_offline')}}</span>
                </div>
            </div>
            <Table ref="table" :loading="offlineList.loading" :height="tableHeight" :columns="offlineList.columns" :data="offlineList.data"></Table>
            <div class="list_bottom">
                <Page :total="offlineList.total" show-elevator show-total @on-change="nextPage"></Page>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    data () {
        return {
            tableHeight: '',
            offlineList: {
                columns: [
                    {
                        title: this.$t('name'),
                        key: 'name',
                        minWidth:70,
                    },
                    {
                        title: this.$t('device_id'),
                        key: 'devEui',
                        width:150,
                    },
                    {
                        title: this.$t('device_type'),
                        key: 'typeName',
                        minWidth:70,
                    },
                    {
                        title: this.$t('address'),
                        key: 'address',
                        minWidth:70,
                    },
                    {
                        title: this.$t('status'),
                        minWidth:70,
                        render: (h, params) => {
                            return h('span', this.$t('offline'))
                        }
                    },
                    {
                        title: this.$t('upd_time'),
                        minWidth:70,
                        render: (h, params) => {
                        return h('span', moment(params.row.ts).format("YYYY-MM-DD HH:mm:ss"))
                        }
                    },
                    {
                        title: this.$t('device_detail'),
                        key: 'detail',
                        width: 200,
                        render: (h, params) => {
                        return h('div', [
                            h('Tooltip',{
                                props:{
                                content: this.$t('device_detail'),
                                placement:'top',
                                },
                                style: {
                                    marginRight: '40px'
                                }
                            }, [
                            h('img', {
                                attrs: {
                                    src: require("../../../../assets/images/xiangqing.svg"),
                                },
                                style: {
                                    width: '16px',
                                    marginTop:'4px',
                                    cursor:'pointer'
                                },
                                on: {
                                    click: () =>{
                                    this.$router.push({
                                        name: 'monitor_onlineDetail', 
                                        params: { nodeId: params.row.id }
                                    })
                                    }
                                }
                            }),
                            ]),
                        ]);
                        }
                    },
                ],
                data: [],
                pageSize: 14,
                pageNo: 1,
                name: '',
                total: 0,
                loading: false
            }
        }
    },
    methods: {
        ...mapActions([
            'getOfflineNodes'
        ]),
        init () {
            const data = {
                pageSize: this.offlineList.pageSize, 
                pageNo: this.offlineList.pageNo, 
                name: this.offlineList.name,
            }
            // this.offlineList.loading = true
            this.getOfflineNodes(data).then(res => {
                const data = res.data.rs
                this.offlineList.data = data.data.list
                this.offlineList.total = data.data.total
                this.offlineList.loading = false
            })
        },
        nextPage (page) {
            this.offlineList.pageNo = page
            this.init()
        },
        changeRouter (url) {
            this.$router.push(url)
        },
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
        
        if(this.$i18n.locale === 'en-US') {
            moment.locale('en-us')
        }else{
            moment.locale('zh-cn')
        }
    }
}
</script>