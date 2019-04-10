<template>
  <div>
    <el-button size="mini" @click="beforeCreate()">创建安全组</el-button>
    <el-dialog title="创建镜像" :visible.sync="dialogVisible" width="400px">
      <el-form label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="createSgroup.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="createSgroup.description">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="create()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import webuploader from '../../webuploader/webuploader'

  export default {
    name: 'createSecurityGroups',
    data() {
      return {
        dialogVisible: false,
        createSgroup: {
          name: '',
          description: ''
        }
      }
    },
    components: {
      webuploader
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      handleChange(value) {

      },
      beforeCreate() {
        this.dialogVisible = true
      },
      create(){
        axios.post('/network/createSgroup',{
          name: this.createSgroup.name,
          description: this.createSgroup.description
        })
        .then(()=>{
          this.$emit('updateView')
        })
        this.dialogVisible = false
      },

    }
  }
</script>

<style>
  #filePicker input {
    display: none;
  }

  #filePicker {
    height: 40px;
  }

  #filename {
    z-index: 0;
  }
</style>