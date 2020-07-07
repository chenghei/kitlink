<style scoped lang="less">
    /deep/
    .ivu-input{
        height:32px;
    }
    /deep/
    .ivu-select-dropdown{
        left:0 !important
    }
</style>
<template>
    <div>
        <Row >
            <i-col>
                <Row>
                    <DatePicker type="daterange" v-model="dates" @on-change="changeDate"  :placeholder="$t('select_date')" style="width: 200px" placement="bottom-end"></DatePicker>
                </Row>
                <Row class="searchable-table-con1" style="margin-top: 10px;">
                    <Table ref="table" :height="tableHeight" :columns="columns1" :data="data1" size="default" :loading="loading"></Table>
                    <div class="list_bottom">
                        <Page :total="pageCount" :current="1" @on-change="changePage" :page-size="pageSize" show-total></Page>
                    </div>
                </Row>
            </i-col>
        </Row>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    name: 'history',
    props: {
        devEui: {
            type: String,
        }
    },
    data () {
        return {
            tableHeight: '',
            loading: false,
            dates: ['', ''],
            columns1: [
                {
                    type: 'selection',
                    width: 80,
                    align: 'center'
                },
                {
                    title: 'devEUI',
                    key: 'dev_eui',
                    width: 150
                },
                {
                    title: 'fCnt',
                    key: 'fcnt',
                    width: 80
                },
                {
                    title: 'fport',
                    key: 'fport',
                    width: 80
                },
                {
                    title: 'rssi',
                    key: 'rssi',
                    width: 80
                },
                {
                    title: 'dateTime',
                    key: 'datetime',
                    width: 220
                },
                {
                    title: 'payload',
                    key: 'payload'
                }
            ],
            data1: [],
            pageSize: 20,
            pageCount: 0,
            limit: 20,
            offset: 1
        }
    },
    methods: {
        ...mapActions([
            'history'
        ]),
        init () {
            let postData = {
                type: 'node',
                topic: 'payload',
                dev_eui: this.devEui,
                page_size: this.limit, 
                page_number: this.offset,
                from: new Date(this.dates[0]).getTime().toString(),
                to: new Date(this.dates[1]).getTime().toString()
            }
            this.history(postData).then(res => {
                this.loading = false
                let result = res.data.rs
                let data = result.pages
                this.data1 = data.map(item => {
                    return {
                        dev_eui: item.payload.dev_eui,
                        fcnt: item.payload.fcnt,
                        fport: item.payload.fport,
                        rssi: item.payload.rssi,
                        datetime: moment(item.payload.ts).format('YYYY-MM-DD HH:mm:ss'),
                        payload: item.payload.payload
                    }
                })
                this.pageCount = result.total
            }).catch(err => this.loading = false)
        },
        changePage (page) {
            this.offset = page
            this.init()
        },
        changeDate (times) {
            this.dates = times
            this.init()
        }
    },
    created () {
        this.dates = [moment().startOf('day').format('YYYY-MM-DD'),moment(new Date()).add(1,'days').startOf('day').format('YYYY-MM-DD')]
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