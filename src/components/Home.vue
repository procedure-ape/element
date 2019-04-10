<template>
  <div class="home">
    <el-container>
      <el-aside width="201px">
        <sidebar></sidebar>
      </el-aside>
      <el-main style="padding: 0px">
        <div class="content">
          <topbar></topbar>
          <router-view id="contentMain"></router-view>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import topbar from './topbar'
  import sidebar from './sidebar'

  export default {
    name: 'home',
    components: {
      topbar,
      sidebar
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .home {
    height: 100%;
    display: flex;
    flex-direction: row;
    transition: all .5s;
  }

  .content {
    flex-grow: 1;
    background: #eeeeee;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
  }

  .tableBox {
    padding: 10px;

    .right {
      display: flex;
      flex-direction: row-reverse;
      padding-bottom: 10px;
    }
  }

  .right button {
    margin-left: 10px;
  }

  .tableBox {
    height: 90%;
    overflow-y: auto;
  }

  .dataTable {
    position: fixed;
    top: 100px;
    bottom: 10px;
    width: 100%;
  }

  #contentMain {
    flex-grow: 1;
    overflow-y: overlay;
    padding-bottom: 80px;
  }

  #contentMain::-webkit-scrollbar{
    width: 5px;
    background-color: transparent;
  }

  #contentMain::-webkit-scrollbar-button{
    height: 0;
    background-color: transparent;
  }

  #contentMain::-webkit-scrollbar-thumb{
    border-radius: 5px;
    background-color: #c1c1c1;
  }

  #contentMain::-webkit-scrollbar-track{
    background-color: transparent;
  }

  #contentMain::-webkit-scrollbar-track-piece{
    background-color: transparent;
  }

</style>