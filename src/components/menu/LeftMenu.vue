<template>
  <div class="hello">
    <el-header style="padding:0px">
        <el-col :span="3"><div class="grid-content bg-purple admin_logo"><img src="../../../static/img/logo.png">后台管理</div></el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple-light admin_logo_right">
            用户 : {{p_username}} 
          </div></el-col>
          <el-col :span="3">
            <el-button type="primary" round @click="logout">退出登录</el-button>
          </el-col>
    </el-header>
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1', '3']" router>
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-menu"></i>系统管理</template>
              <el-menu-item index="/userView">用户管理</el-menu-item>
              <el-menu-item index="/">数据列表</el-menu-item>
              <!-- <el-menu-item index="/reportView">数据展示</el-menu-item> -->
          </el-submenu>          
        </el-menu>
      </el-aside>
      <el-main><slot></slot></el-main>
    </el-container>
  </div>
</template>

<style>
   @import '../../assets/css/Index.css';
</style>

<script>
  export default {
    name:'LeftMenu',
    data() {
      return {
        p_username:sessionStorage['username'],
      }
    },
    methods: {
      logout:function(){
        if(sessionStorage)
          sessionStorage.clear();
        location.reload();
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
    }
  };
</script>