<template>
  <div class="stopServer">
    <el-button size="mini" @click="dialogVisible = true">关闭虚拟机</el-button>

    <el-dialog title="关闭虚拟机" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>确认关闭虚拟机</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="stopServer()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'stopServer',
    props: ['servers'],
    data() {
      return {
        dialogVisible: false
      };
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      stopServer() {
        let stopServers = []
        for (let server of this.servers) {
          stopServers.push(server.server_id)
        }

        this.dialogVisible = false

        axios.post('/api/stopServer', {
          server_id: stopServers
        })
        .then(()=>{
          this.$emit('updateView')
        })
      }
    }
  }
</script>

<style scoped>

</style>