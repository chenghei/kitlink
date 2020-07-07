<template>
  <div>
    <Dropdown @on-click="selectLang">
      <a href="javascript:void(0)" style="margin-right:15px;margin-left:10px;">
        <img :src="src" style="margin-bottom:-7px;">
        <!-- <Icon :size="18" type="md-arrow-dropdown" /> -->
      </a>
      <DropdownMenu slot="list">
        <DropdownItem v-for="(value, key) in localList" :name="key" :key="`lang-${key}`">{{ value }}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import { localRead } from '@/libs/util'

export default {
  name: 'Language',
  inject: ['reload'],
  props: {
    lang: String
  },
  data () {
    return {
      langList: {
        'zh-CN': '语言',
        'en-US': 'Lang'
      },
      localList: {
        'zh-CN': '中文简体',
        'en-US': 'English'
      },
      src:''
    }
  },
  watch: {
    lang (lang) {
      this.$i18n.locale = lang
      this.reload()
    },
    local (newVal, oldVal) {
      this.src = newVal == 'zh-CN' ? require('../../../../assets/images/CN.svg') : require('../../../../assets/images/EU.svg')
    }
  },
  computed: {
    title () {
      return this.langList[this.lang]
    },
    local () {
      return this.$store.state.app.local
    },
  },
  methods: {
    selectLang (name) {
      if(name == 'en-US'){
        this.src = require('../../../../assets/images/EU.svg')
      }else{
        this.src = require('../../../../assets/images/CN.svg')
      }
      this.$emit('on-lang-change', name)
    }
  },
  mounted () {
    this.src = this.local == 'zh-CN' ? require('../../../../assets/images/CN.svg') : require('../../../../assets/images/EU.svg')
  }
}
</script>
