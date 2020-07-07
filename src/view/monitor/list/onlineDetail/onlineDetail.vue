<template>
    <div>
        <device-details :nodeId="nodeId"></device-details>
    </div>
</template>
<script>
import deviceDetails from '_c/deviceDetails/deviceDetails'
export default {
    components: {
        deviceDetails
    },
    data () {
        return {
            nodeId: this.$route.params.nodeId
        }
    }
}
</script>