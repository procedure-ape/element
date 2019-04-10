<template>
  <div>
    <el-button icon="el-icon-arrow-left" size="mini" style="margin-bottom: 5px;" @click="tabBack"></el-button>
    <el-tabs type="border-card">
      <el-tab-pane label="子网">
        <subnet></subnet>
      </el-tab-pane>
      <el-tab-pane label="端口">
        <port></port>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import axios from 'axios'
  import subnet from './subnet/subnet'
  import port from './port/port'

  export default {
    name: 'networkDetails',
    data() {
      return {

      }
    },
    props: [

    ],
    components: {
      subnet,
      port
    },
    methods: {
      tabBack(){
        this.$emit('tabBack')
      }
    },
    mounted: function () {

    },

  }
</script>

<style>

</style>