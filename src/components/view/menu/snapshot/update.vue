<template>
  <div>
    <el-button size="mini" @click="beforeCreate()">创建镜像</el-button>
    <el-dialog title="创建镜像" :visible.sync="dialogVisible" width="400px">
      <el-form label-width="120px">
        <el-form-item label="镜像名称">
          <el-input v-model="image.image_name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="镜像描述">
          <el-input v-model="image.description" size="mini" placeholder="auto"></el-input>
        </el-form-item>
        <el-form-item label="镜像源">
          <div id="filePicker">
            添加文件
          </div>
          <webuploader :formData="formdata" ref="uploader" uploadButton="#filePicker" @fileChange="fileChange"
            @progress="onProgress" @success="onSuccess" url="http://192.168.30.135:8000/image/get_image"></webuploader>
          <div id="filename">
            {{ image.filename }}
          </div>
        </el-form-item>
        <!-- <el-form-item label="最小磁盘(GB)">
          <el-input-number v-model="image.min_disk" controls-position="right" @change="handleChange" :min="0" size="mini"></el-input-number>
        </el-form-item>
        <el-form-item label="最小内存(MB)">
          <el-input-number v-model="image.min_ram" controls-position="right" @change="handleChange" :min="0" size="mini"></el-input-number>
        </el-form-item> -->
        <el-form-item label="镜像格式">
          <el-select v-model="image.disk_format" placeholder="" size="mini">
            <el-option v-for="v of disk_formats" :key="v" :value="v" :label="v"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="受保护的">
          <el-switch v-model="image.visibility" active-text="共有" inactive-text="私有">

          </el-switch>
        </el-form-item>
        <el-form-item label="可见性">
          <el-switch v-model="image.protected" active-text="是" inactive-text="否">

          </el-switch>
        </el-form-item> -->
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
    name: 'createImage',
    data() {
      return {
        dialogVisible: false,
        image: {
          image_name: '',
          min_disk: 0,
          min_ram: 0,
          disk_format: 'iso',
          protected: false,
          visibility: true,
          filename: '无文件'
        },
        disk_formats: [
          'iso',
          'qcow2'
        ],
        fileList: [],
        formdata: {}
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
      create() {
        this.$refs.uploader.upload(this.formdata.file)
      },
      uploadImage() {
        this.dialogVisible = false
        axios.post('/image/uploadImage', {
            image_name: this.image.image_name,
            min_disk: this.image.min_disk,
            min_ram: this.image.min_ram,
            task_id: this.formdata.task_id,
            disk_format: this.image.disk_format,
            protected: this.image.protected ? 'private' : 'public',
            visibility: this.image.visibility,
            filename: this.formdata.file.name
          })
          .then(() => {
            this.$emit('updateView')
          })
      },
      handleRemove(file, fileList) {

      },
      handlePreview(file) {

      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      fileChange(e, task_id) {
        console.log(e.name)
        this.formdata.file = e
        this.formdata.task_id = task_id
        this.image.filename = e.name
      },
      onProgress(e) {

      },
      onSuccess(e) {
        this.uploadImage()
      }

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