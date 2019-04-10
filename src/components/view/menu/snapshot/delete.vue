<template>
  <div>
    <el-button size="mini" @click="beforeDelete()">删除快照</el-button>
    <el-dialog title="删除镜像" :visible.sync="dialogVisible" width="400px">
      确认删除快照？
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteimages()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'deleteImage',
    props: [
      'snapshots'
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
      deleteimages() {
        let vols = []
        this.dialogVisible = false
        for (let vol of this.snapshots) {
          vols.push(vol.id)
        }
        axios.post('/image/delsnapshot', {
          image_id: vols
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