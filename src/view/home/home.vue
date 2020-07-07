<template>
  <div>{{'首页'}}</div>
</template>
<script>
export default {
  name: 'home',
  mounted() {
    this.$router.push({
      name: 'monitor_list'
    })
  }
}
</script>
