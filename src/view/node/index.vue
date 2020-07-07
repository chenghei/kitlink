<style lang="less" scoped src="./index.less"></style>
<template>
  <div id="node_index">
    <div class="navSelect">
        <div v-for="(item,i) in nav" :key="i" :class="activeNav == i ? 'active' : ''">
          <span style="width:20px;display:block" >
            <img src="../../assets/images/circle8.svg" v-show="activeNav == i">
          </span>
          <span>{{item.title}}</span>
        </div>
        <span v-if="gongcheng" class="engineering" @click="changeRouter()">{{$t('engineering_mode')}} >></span>
        <span v-if="jianyi" class="engineering" @click="changeRouter1()">{{$t('simple_mode')}} >></span>
    </div>
    <router-view/>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      activeNav:0,
      gongcheng: true,
      jianyi: false,
    }
  },
  computed: {
    ...mapGetters([
      'routes',
    ]),
    nav() {
      return [
        {title: this.$t('node')}
      ]
    }
  },
  methods: {
    changeRouter () {
      let name = ''
      if (this.routes[0].subCode === 'fire-v2') {
        name = 'node_engineering'
      } else {
        name = 'lamp_node_engineering'
      }
      this.$router.push({name:name})
      this.gongcheng = false
      this.jianyi = true
    },
    changeRouter1 () {
      let name = ''
      if (this.routes[0].subCode === 'fire-v2') {
        name = 'node_nodeIndex'
      } else {
        name = 'lamp_node_nodeIndex'
      }
      this.$router.push({name:name})
      this.gongcheng = true
      this.jianyi = false
    }
  },
  mounted () {
    this.gongcheng = sessionStorage.getItem('index') ? (sessionStorage.getItem('index') == 0 ? true : false) : true
    this.jianyi = sessionStorage.getItem('index') == 1 ? true : false
  },
  beforeRouteUpdate(to,from,next){
    if(to.name == 'node_nodeIndex' || to.name == "lamp_node_nodeIndex"){
      this.gongcheng = true,
      this.jianyi = false
      sessionStorage.setItem('index',0)
    }
    if(to.name == 'node_engineering' || to.name == "lamp_node_engineering"){
      this.gongcheng = false,
      this.jianyi = true
      sessionStorage.setItem('index',1)
    }
    next()
  },
}
</script>
