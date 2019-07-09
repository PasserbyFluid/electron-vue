<template>
  <div class="dashboard-container">
    <div class="dashboard-text">用户名:{{name}}</div>
    <div class="dashboard-text">权限:<span>{{power == '0' ? '管理员' :' 普通用户'}}</span></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'name',
      'power'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
