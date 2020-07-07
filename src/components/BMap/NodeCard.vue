<template>
  <div class="carousel-wrap" :style="{'background': color}">
    <a :href="link">
      <div class="item-header">
        <div style="height: 30px;line-height: 30px;">
          <img :src="icon" width="30" height="30" style="vertical-align: middle;margin-right:10px" />
          <span class="name" style="vertical-align: middle;display:inline-block;">{{name}} {{status}}</span>
        </div>
        <div><i :class="[fa_classs, voltage]"></i></div>
      </div>
      <div class="item-content">
        <span class="data">
                {{data1}}
                <sub class="unit">{{unit1}}</sub>
            </span>
        <span class="data">
                {{data2}}
                <sub class="unit">{{unit2}}</sub>
            </span>
      </div>
      <div class="item-footer">
        <span class="sn">{{dev_eui}}</span>
        <span class="date no-warp">{{time}}</span>
      </div>
    </a>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
  export default {
    name: 'NodeCard',
    props: {
      link: '',
      color: {
        type: String,
        //default: '#0fcfbe'
        default: 'linear-gradient(to right, #44E5AA , #11A5AA)'
      },
      icon: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      },
      data1: {
        type: String,
        default: ''
      },
      data2: {
        type: String,
        default: ''
      },
      unit1: {
        type: String,
        default: ''
      },
      unit2: {
        type: String,
        default: ''
      },
      dev_eui: {
        type: String,
        default: 'dev_eui'
      },
      time: {
        type: String,
        default: ''
      },
      // 右上角电池图标
      voltage: {
        type: String,
        default: 'fa-battery-4'
      },
      status: {
        type: String,
        default: ''
      },
      spinShow: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        fa_classs: 'fa'
      }
    },
    methods: {
      init() {

      }
    },
    mounted() {
      this.init()
    }
  }
</script>

<style scoped>
  .carousel-wrap{ position: relative; transition: transform .35s; overflow: hidden;}
  .carousel-wrap a{ display: flex; flex-direction: column; padding:10px 14px 8px 14px; overflow: hidden; color: #180808;}
  .item-header{ display: flex; justify-content: space-between;}
  .item-content{ padding-top: 24px; padding-bottom: 24px; display: flex; flex: 1; align-items: center; justify-content: space-between;}
  .item-content .data{ font-size: 28px; white-space: nowrap;}
  .item-footer{ z-index: 1; display: flex; justify-content: space-between;}
  .sn{ width: 50%; overflow: hidden; height: 40px; white-space: nowrap; word-break: break-all; word-wrap: break-word;}
  .date{ height: 21px; overflow: hidden; text-align: right;}

</style>