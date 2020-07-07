<style lang="less" scoped src="./index.less"></style>
<template>
    <div >
        <div class="navSelect">
            <div v-for="(item,i) in nav" :key="i" :class="activeNav == i ? 'active' : ''">
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
        activeNav: 0,
        nav: [
            {name: '地图模式'}
        ],
        title: '监控中心'
    }
  },
  methods: {
  }
}
</script>

