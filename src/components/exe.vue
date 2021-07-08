<template>
  <el-container>
    <el-header>
      <el-menu small router unique-opened :default-active="activepath" mode="horizontal" active-text-color="blue">
        <el-menu-item index="/exp1" class="menu1">过滤规则</el-menu-item>
        <el-menu-item index="/exp2">轩辕十四过滤规则</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  created () {
    this.activepath = window.sessionStorage.getItem('activePath')
  },
  updated () {
    this.activepath = window.sessionStorage.getItem('activePath')
    console.log(this.activepath)
  },
  data () {
    return {
      activepath: ''
    }
  },
  methods: {
    reset (name) {
    }
  }
}
</script>

<style lang="less" scoped>
.el-menu-item{
    font-size: 16px;
}
.el-menu{
  margin-left: 10px;
}
.menu1{
  margin-right: 10px;
}
</style>
