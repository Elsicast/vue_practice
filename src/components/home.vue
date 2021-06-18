<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <div class="logo">
          <img src="../assets/mylogo.png">
        </div>
        <span>电商系统</span>
      </div>
      <el-button type="info" @click="logout">注销</el-button>
    </el-header>
    <el-container>
      <el-aside width="auto" >
        <el-menu class="el-menu-vertical-demo" :collapse="isCollapse"
        active-text-color="#409EFF" :unique-opened="true"
        :router="true" :default-active="activepath">
        <!-- 一级菜单 -->
          <el-submenu :index="item.path" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconsobj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children"
            :key = "subitem.id" >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <el-switch
          v-model="isCollapse"
          :active-value="false"
          :inactive-value="true"
        >
        </el-switch>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created () {
    this.getMenuList()
    this.activepath = window.sessionStorage.getItem('activePath')
  },
  updated () {
    this.activepath = window.sessionStorage.getItem('activePath').replace(/\//g, '')
    // console.log(this.activepath)
  },
  data () {
    return {
      activepath: '',
      isCollapse: false,
      menulist: [],
      iconsobj: {
        125: 'iconfont icon-yonghuguanli',
        103: 'iconfont icon-quanxianguanli',
        101: 'iconfont icon-shangpinguanli',
        102: 'iconfont icon-dingdanguanli',
        145: 'iconfont icon-shujutongji'
      }
    }
  },
  methods: {
    // 获取菜单列表
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.console.error(res.meta.msg)
      this.menulist = res.data
      // console.log(res)
    },
    // 注销
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
    // 保存连接的激活状态
    // savenavstat (activepath) {
    //   window.sessionStorage.setItem('activePath', activepath)
    //   this.activepath = activepath
    // }
  }
}
</script>

<style lang="less" scoped>
.el-header{
  background-color: rgb(45, 68, 82);
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: white;
  font-size: 20px;
  > div{
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
    img{
      height: 80;
      width: 80;
    }
  }
}
.iconfont{
  margin-right: 10px;
}
.el-aside{
  background-color: #ffffff;
  position: relative;
  height: 100%;
  padding-left: 0px;
  .el-menu{
    border-right: none;
  }
}
.el-aside>.el-menu{
    position: abs;
    border: 0,0;
    box-shadow: 5px,5px,1,black;
  }
.el-switch{
  position: absolute;
  // transition: all, .3, linear,0;
  // transform: translate(-50%,-50%);
  bottom: 10px;
  left: 10px;
}

.el-main{
  background-color:#eeee;
}

.home-container{
  height: 100%;
}

.logo{
  background-color:rgb(122, 116, 116);
  border-radius: 50%;
  height: 50px;
  width: 50px;
  overflow: hidden;
  text-align: center;
  img {
    height: 50px;
    width: 50px;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
