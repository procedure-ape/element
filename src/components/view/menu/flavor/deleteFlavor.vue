<template>
  <div>
    <el-button size="mini" @click="beforeDelete()">删除配置</el-button>
    <el-dialog title="创建卷" :visible.sync="dialogVisible" width="400px" :before-close="handleClose">
      确认删除配置？
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="del()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'deleteFlavor',
    props: [
      'multipleSelection'
    ],
    data() {
      return {
        dialogVisible: false
      }
    },
    methods: {
      beforeDelete() {
        this.dialogVisible = true
      },
      handleClose(done) {

      },
      del() {
        let vols = []
        this.dialogVisible = false
        for (let vol of this.multipleSelection) {
          vols.push(vol.flavor_id)
        }
        axios.post('/api/delFlavor', {
            flavor_id: vols
          })
          .then(() => {
            this.$emit('updateView')
          })
      }
    }
  }
</script>

<style>

</style>