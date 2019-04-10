<template>
  <div>
    <el-button size="mini" @click="beforeDelete()">释放浮动IP</el-button>
    <el-dialog title="释放浮动IP" :visible.sync="dialogVisible" width="400px">
      确认释放浮动IP？
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
      del() {
        let vols = []
        this.dialogVisible = false
        for (let v of this.multipleSelection) {
          vols.push(v.id)
        }
        axios.post('/network/deleteIP', {
          floating_ip: vols
        })
        .then(()=>{
          this.$emit('updateView')
        })
      }
    }
  }
</script>

<style>

</style>