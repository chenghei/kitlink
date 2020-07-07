<template>
  <div id="app">
    <router-view v-if="toggleFlag"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide () { 
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      toggleFlag: true
    }
  },
  methods: {
    reload () {
      this.toggleFlag= false
      this.$nextTick(() => {
        this.toggleFlag = true
      })
    }
  }
}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
