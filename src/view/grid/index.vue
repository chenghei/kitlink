<style lang="less" scoped src="./index.less"></style>
<template>
  <div id="grid_index">
    <div class="navSelect">
        <div v-for="(item,i) in nav" :key="i" @click="changeRouter(item.name,i)" :class="activeNav == i ? 'active' : ''">
          <span style="width:20px;display:block" >
            <img src="../../assets/images/circle8.svg" v-show="activeNav == i">
          </span>
          <span>{{$t(item.name)}}</span>
        </div>
    </div>
    <router-view/>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      nav:[],
      activeNav:''
    }
  },
  computed: {
    ...mapGetters([
      'routes'
    ])
  },
  methods: {
    changeRouter (name,i) {
      this.activeNav = i
      sessionStorage.setItem('index',this.activeNav)
      this.$router.push({
        name:name
      })
    },
  },
  mounted () {
    this.nav = this.routes.find(v => v.name === 'grid').children[0].children.filter(v => v.hideInMenu === false)
    this.activeNav = sessionStorage.getItem('index',this.activeNav) ?sessionStorage.getItem('index',this.activeNav) : 0
  },
  beforeRouteUpdate (to,from,next) {
    if (to.name == 'grid_gridIndex') {
      sessionStorage.setItem('index',0)
      this.activeNav = 0
    }
    this.activeNav = sessionStorage.getItem('index') ? sessionStorage.getItem('index') : 0
    next()
  },
}
</script>
