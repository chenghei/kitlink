<style lang="less" scoped src="./index.less"></style>
<template>
  <div>
    <div class="navSelect">
      <div v-for="(item,i) in nav" :key="i" :class="activeNav == i ? 'active' : ''" @click="changeRouter(item.name,i)">
          <span style="width:20px;display:block" >
              <img src="@/assets/images/circle8.svg" v-show="activeNav == i">
          </span>
          <span>{{$t(item.name)}}</span>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeNav: '',
      nav: [
          { name: 'lamp_project_index_weProject' },
          { name: 'lamp_project_index_lampPole' },
          { name: 'lamp_project_index_lampAmmeter' },
      ],
    }
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
      this.activeNav = sessionStorage.getItem('index') ?sessionStorage.getItem('index') : 0
  },
  beforeRouteUpdate (to,from,next) {
      this.activeNav = sessionStorage.getItem('index') ?sessionStorage.getItem('index') : 0
      next()
  },
}
</script>

