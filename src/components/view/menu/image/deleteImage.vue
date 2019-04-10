<template>
  <div>
    <el-button size="mini" @click="beforeDelete()">删除镜像</el-button>
    <el-dialog title="删除镜像" :visible.sync="dialogVisible" width="400px">
      确认删除镜像？
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
      'images'
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
        for (let vol of this.images) {
          vols.push(vol.id)
        }
        axios.post('/image/delImage', {
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