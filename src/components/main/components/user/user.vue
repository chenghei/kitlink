<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="userInfo.photo ? `${path}/p/a/rest-api/files/download?filePath=${userInfo.photo}` : normalPhoto" style="margin-right:5px"/>
       {{userInfo.name}}
      <Icon :size="15" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list" style="display:block">
        <DropdownItem name="account" class="dropDownItem">
          <Icon custom="ivu-icon-iconfont icon-userInfo" style="font-family: 'iconfont';margin-right:20px" size="13" />
          {{$t('personal')}}
        </DropdownItem>
        <DropdownItem name="changePassword" class="dropDownItem">
          <Icon custom="ivu-icon-iconfont icon-password" style="font-family: 'iconfont';margin-right:20px" size="13" />
          {{$t('change_password')}}
        </DropdownItem>
        <DropdownItem name="logout" class="dropDownItem">
          <Icon custom="ivu-icon-iconfont icon-logout" style="font-family: 'iconfont';margin-right:20px" size="13" />
          {{$t('logout')}}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapGetters, mapActions } from 'vuex'
import config from '@/config'

export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    normalPhoto:{
      type: String,
      default:require('../../../../assets/images/touxiang.png')
    }
  },
  data() {
    return {
      path: config.assetsPatch
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.handleLogOut().then(() => {
            window.location = '/login'
          })
          break
        case 'account':
          this.$emit('personal','true')
          break
        case 'changePassword':
          this.$emit('password','true')
          break
      }
    }
  },
}
</script>
