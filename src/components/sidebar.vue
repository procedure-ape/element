<template>
  <div class="sidebar">
    <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group> -->
    <el-menu :default-active="this.$route.path" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
      :collapse="isCollapse" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <router-link to='dashboard' tag='div'>
        <el-menu-item index="/home/dashboard">
          <i class="fa fa-tachometer"></i>
          <span slot="title">仪表板</span>
        </el-menu-item>
      </router-link>

      <router-link to='instances'>
        <el-menu-item index="/home/instances">
          <i class="fa fa-television"></i>
          <span slot="title">虚拟机</span>
        </el-menu-item>
      </router-link>

      <router-link to='images'>
        <el-menu-item index="/home/images">
          <i class="fa fa-clipboard"></i>
          <span slot="title">镜像</span>
        </el-menu-item>
      </router-link>

      <router-link to='snapshot'>
        <el-menu-item index="/home/snapshot">
          <i class="fa fa-copy"></i>
          <span slot="title">快照</span>
        </el-menu-item>
      </router-link>

      <router-link to='flavor'>
        <el-menu-item index="/home/flavor">
          <i class="fa fa-gears"></i>
          <span slot="title">虚拟机配置</span>
        </el-menu-item>
      </router-link>

      <el-submenu index="/storage/">
        <template slot="title">
          <i class="fa fa-window-restore"></i>
          <span>存储</span>
        </template>
        <router-link to="storage">
          <el-menu-item index="/storage">云硬盘</el-menu-item>
        </router-link>
        <router-link to="storageSnapshot">
          <el-menu-item index="/storage/storageSnapshot">云硬盘快照</el-menu-item>
        </router-link>
      </el-submenu>

      <el-submenu index="/system/">
        <template slot="title">
          <i class="fa fa-internet-explorer"></i>
          <span>网络</span>
        </template>
        <!-- <router-link to="topology">
          <el-menu-item index="/home/topology">网络拓扑</el-menu-item>
        </router-link> -->
        <router-link to="network">
          <el-menu-item index="/home/network">网络</el-menu-item>
        </router-link>
        <router-link to="floatIP">
          <el-menu-item index="/home/floatIP">浮动IP</el-menu-item>
        </router-link>
        <router-link to="routers">
          <el-menu-item index="/home/routers">路由</el-menu-item>
        </router-link>
        <!-- <router-link to="securityGroups">
          <el-menu-item index="/home/securityGroups">安全组</el-menu-item>
        </router-link> -->
      </el-submenu>

      <router-link to='user'>
        <el-menu-item index="/system/user">
          <i class="fa fa-user-o"></i>
          <span slot="title">用户</span>
        </el-menu-item>
      </router-link>

    </el-menu>
  </div>
</template>

<script>
  export default {
    name: 'sidebar',
    data() {
      return {
        isCollapse: false
      };
    },
    methods: {
      handleOpen(key, keyPath) {

      },
      handleClose(key, keyPath) {

      }
    }
  }
</script>

<style scoped>
  .sidebar {
    height: 100%;
  }

  .sidebar a {
    text-decoration: none;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    min-height: 400px;
    height: 100%;
  }

  .el-submenu .el-menu-item {
    min-width: 100px;
  }
</style>