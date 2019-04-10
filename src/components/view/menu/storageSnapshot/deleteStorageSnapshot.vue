<template>
  <div>
    <el-button size="mini" @click="beforeCreate()">删除卷快照</el-button>
    <el-dialog title="删除卷快照" :visible.sync="dialogVisible" width="400px">
      确认删除卷快照？
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
    name: 'deleteStorage',
    props: [
      'multipleSelection'
    ],
    data() {
      return {
        dialogVisible: false
      }
    },
    methods: {
      beforeCreate() {
        this.dialogVisible = true
      },
      del() {
        let vols = []
        this.dialogVisible = false
        for (let vol of this.multipleSelection) {
          vols.push(vol.id)
        }
        axios.post('/store/delSnapshot', {
          snapshot_id: vols
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
