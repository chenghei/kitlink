<style lang="less" scoped src="./index.less"></style>
<template>
  <div class="index">
      <div class="index_top">
          <img src="../../assets/images/logo.png" class="logo">
          {{$t('kitlink')}}
      </div>
      <Row type="flex" class="index_bottom">
        <Row type="flex" justify="center" align="middle" class="code-row-bg">
            <Col class="indexCard"   v-for="item in list" :key="item.id">
            <div @click="changeRouter(item)"> 
                <img :src="require('../../assets/images/' + item.code + '.svg')" style="width:180px">
                <span>{{item.name}}</span>
                <img src="../../assets/images/moreIcon.svg" class="icon">
            </div>
            </Col>
        </Row>
      </Row>
  </div>
</template>
<script>
import { mapActions,mapMutations } from 'vuex'
import { getToken } from '@/libs/util'
export default {
  data () {
    return {
      list: []
    }
  },
  methods: {
    ...mapMutations([
      'setHasGetRouter',
      'setHasGetInfo'
    ]),
    ...mapActions([
      'getSubSysList',
      'setSubSys',
      'getNodes'
    ]),
    changeRouter (item) {
      let name = ''
      switch (item.code) {
        case "fire-v2" :
        name = 'monitor'
        break
        case "lamp":
        name = 'lamp_monitor'
        break
      }
      if (item.name === '应急安全' || item.name === '安全防护-V2' || item.name === '智慧照明' || item.name === '智慧园区') {
        this.setSubSys(item.id)
        let arr = ['sec', 'park', 'apartment', 'comm']
        if(arr.includes(item.code)){
          window.location.href = `${item.url}`
        }
        this.$router.push({name:name})
      } else {
        this.$Message.info(this.$t('正在开发中...'));
      }
    }
  },
  created () {
    this.$store.dispatch('getNodes',{update:1})
    this.getSubSysList().then(res => {
      this.list = res.data.rs.data
    })
    this.setHasGetRouter(false)
    this.setHasGetInfo(false)
  }
}
</script>
