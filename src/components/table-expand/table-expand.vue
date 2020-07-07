<style scoped lang="less" src='./table-expand.less'></style>
<template>
    <div>
        <Row class="expand-row" v-for="(item,i) in row.nodeAlertMsg.timeline" :key="i" type="flex" style="align-items:center">
            <i-col style="width:20px">
                <div style="width:8px;height:8px;background:white;margin-right:-30px;border-radius:50%"></div>
            </i-col>
            <i-col span="15">
                <span class="expand-key">{{ m(item.time)}}</span>
                <span class="expand-value">{{ item.event }}</span>
            </i-col>
        </Row>
    </div>
</template>
<script>
export default {
    props: {
        row: Object
    },
    methods: {
        m (e) {
            return moment(e).format("YYYY-MM-DD HH:mm:ss")
        }
    },
    mounted() {
        if(this.$i18n.locale === 'en-US') {
            moment.locale('en-us')
        }else{
            moment.locale('zh-cn')
        }
    }
    
};
</script>