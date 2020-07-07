<style lang="less" scoped src='./detail.less'></style>
<template>
    <div class="content-body">
        <div class="content boxShadow" style="background:#fff">
            <div class="header">
                <div>
                    <img src="../../../assets/images/jiantouzuo.svg" @click="$router.go(-1)">
                    <span>{{devEui}}</span>
                </div>
            </div>
            <Tabs type="line" style="margin-top:10px;" >
                <TabPane :label="$t('view1')">
                    <nodeView :devEui="devEui"></nodeView>
                </TabPane>
                <TabPane :label="$t('node_status')">
                    <nodeInfo :devEui="devEui"></nodeInfo>
                </TabPane >
                <TabPane label="Session/ABP">
                    <sessionAbp :devEui="devEui"></sessionAbp>
                </TabPane>
                <TabPane :label="$t('history')">
                    <history :devEui="devEui"></history>
                </TabPane>
                <!-- <TabPane :label="$t('control_panel')">
                    <controlPanel></controlPanel> 
                </TabPane> -->
                <TabPane label="Downlink">
                    <downlink :devEui="devEui"></downlink>
                </TabPane>
                <TabPane label="Uplink">
                    <uplink :devEui="devEui"></uplink>
                </TabPane>
            </Tabs>
        </div>
    </div>
</template>
<script>
import nodeView from '_c/node/nodeView'
import nodeInfo from '_c/node/nodeInfo'
import sessionAbp from '_c/node/sessionAbp'
import history from '_c/node/history'
import downlink from '_c/node/downlink'
import uplink from '_c/node/uplink'
export default {
    components: {
        nodeView,
        nodeInfo,
        sessionAbp,
        history,
        downlink,
        uplink
    },
    data() {
        return {
            devEui: this.$route.params.devEui,
        }
    },
    methods: {
    }
}
</script>