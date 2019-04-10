<template>
  <div>
    <el-button size="mini" @click="beforeCreate()">创建镜像</el-button>
    <el-dialog title="创建镜像" :visible.sync="dialogVisible" width="400px" :before-close="handleClose"
      @close="closeForm('image')">
      <!-- <form method="post" action="http://192.168.30.168:8000/image/get_image" enctype="multipart/form-data">
        <input type="file" name="file">
        <input type="submit" value="原始上传">
      </form> -->
      <!-- <form method="post" action="http://127.0.0.1:4000/upload" enctype="multipart/form-data" target="_blank">
        <input type="file" name="file">
        <input type="submit" value="原始上传">
      </form> -->
      <el-form label-width="120px" :model="image" :rules="rules" ref="image" class="demo-ruleForm">
        <el-form-item label="镜像名称" prop="image_name">
          <el-input v-model="image.image_name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="镜像描述">
          <el-input v-model="image.description" size="mini" placeholder="auto"></el-input>
        </el-form-item>
        <el-form-item label="镜像源" prop="filename">
          <div id="filePicker">
            添加文件
          </div>
          <webuploader :formData="formdata" ref="uploader" uploadButton="#filePicker" @fileChange="fileChange"
            @progress="onProgress" @success="onSuccess" :url="uploadImageUrl"></webuploader>
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
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="create('image')" v-loading="loading.uploadImage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import webuploader from '../../webuploader/webuploader'
  import rules from '@/components/rules/rules'

  export default {
    name: 'createImage',
    computed: {
      rules: function () {
        return rules.rules
      }
    },
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
          'qcow2',
          'raw'
        ],
        fileList: [],
        formdata: {},
        loading: {
          uploadImage: false
        }
      }
    },
    beforeCreate: function () {
      this.uploadImageUrl = window.location.origin + '/image/get_image'
    },
    components: {
      webuploader
    },
    methods: {
      closeForm(formName) {
        this.$refs[formName].resetFields()
      },
      handleClose(done) {
        if (this.loading.uploadImage) {
          this.$confirm('文件上传中，请不要关闭或刷新当前页面')
            .then(_ => {})
            .catch(_ => {});
        } else {
          this.dialogVisible = false
        }
      },
      handleChange(value) {

      },
      beforeCreate() {
        this.dialogVisible = true
      },
      create(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$refs.uploader.upload(this.formdata.file)
          } else {
            return false;
          }
        });
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
        this.formdata.file = e
        this.formdata.task_id = task_id
        this.image.filename = e.name
      },
      onProgress(e) {
        this.loading.uploadImage = true
      },
      onSuccess(e) {
        this.uploadImage()
        this.loading.uploadImage = false
        this.$emit('updateView')
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