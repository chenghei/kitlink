<style lang="less" scoped src="./index.less"></style>
<template>
  <div id="report_index">
    <div class="navSelect">
        <div v-for="(item,i) in nav" :key="i" :class="activeNav == i ? 'active' : ''">
          <span style="width:20px;display:block" >
            <img src="../../assets/images/circle8.svg" v-show="activeNav == i">
          </span>
          <span>{{item.title}}</span>
        </div>
    </div>
    <router-view/>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeNav:0
    }
  },
  computed: {
    nav() {
      return [
        {title: this.$t('report')}
      ]
    }
  }
}
</script>
