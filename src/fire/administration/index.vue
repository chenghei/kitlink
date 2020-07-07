<style lang="less" scoped>
  .navSelect{
    display: flex;
    height:40px;
    margin-bottom:30px;
    align-items: center;
    background: #E6E6E6;
    margin-left: -30px;
    padding-left:30px;
    div{
        max-width:130px;
        display: flex;
        margin-right:60px;
        white-space: nowrap;
        img{
            margin-right: 10px;
        }
        span{
            cursor: pointer;
        }
    }
    div.active{
        color:#01C1AE;
    }
  }
</style>
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
          { name: 'lamp_power_index_chart' },
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

