<template>
<div>
  <!-- <a type="text" :class="['sider-trigger-a', collapsed ? 'collapsed' : '']" style="margin-top:0">
    <img src="../../../../../assets/images/collapsed.png" >
  </a> -->
</div>
  
</template>
<script>
export default {
  name: 'siderTrigger',
  props: {
    collapsed: Boolean,
    icon: {
      type: String,
      default: 'navicon-round'
    },
    size: {
      type: Number,
      default: 26
    }
  },
  methods: {
    handleChange () {
      this.$emit('on-change', !this.collapsed)
    }
  }
}
</script>
<style lang="less">
@import './sider-trigger.less';
</style>
