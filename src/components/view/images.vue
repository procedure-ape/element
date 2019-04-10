<template>
  <div class="tableBox">
    <el-row class="right">
      <!-- 批量操作 -->
      <deleteImage :images="multipleSelection" @updateView="updateView()"></deleteImage>
      <createImage @updateView="updateView()"></createImage>
    </el-row>
    <el-table ref="multipleTable" :data="tableData3" v-loading="table_loading" tooltip-effect="dark" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="name" label="镜像名称">
      </el-table-column>
      <!-- <el-table-column prop="visibility" label="是否可见">
      </el-table-column> -->
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.status | imageStatus }}
        </template>
      </el-table-column>
      <el-table-column prop="size" label="大小">
      </el-table-column>
      <!-- <el-table-column prop="min_ram" label="最小内存">
      </el-table-column>
      <el-table-column prop="min_disk" label="最小磁盘">
      </el-table-column> -->
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-button size="mini">
              更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updateImageDialog(scope.row)">编辑镜像</el-dropdown-item>
              <el-dropdown-item @click.native="deleteImageDialog(scope.row)">删除镜像</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑镜像 dialog -->
    <el-dialog title="编辑镜像" :visible.sync="updateImage.dialog" width="400px" @close="close('updateImage')">
      <el-form label-width="100px" :rules="rules" :model="updateImage" ref="updateImage" class="demo-ruleForm">
        <el-form-item label="镜像名称" prop="name">
          <el-input v-model="updateImage.name" size="mini"></el-input>
        </el-form-item>
        <!-- <el-form-item label="镜像描述">
          <el-input v-model="updateImage.description" size="mini" placeholder="auto"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="最小磁盘(GB)">
          <el-input-number v-model="updateImage.minDisk" controls-position="right" @change="handleChange1" :min="0" size="mini"></el-input-number>
        </el-form-item>
        <el-form-item label="最小内存(MB)">
          <el-input-number v-model="updateImage.minRam" controls-position="right" @change="handleChange2" :min="0" size="mini"></el-input-number>
        </el-form-item> -->
        <!-- <el-form-item label="受保护的">
          <el-switch v-model="updateImage.visibility" active-text="共有" inactive-text="私有">

          </el-switch>
        </el-form-item>
        <el-form-item label="可见性">
          <el-switch v-model="updateImage.protected" active-text="是" inactive-text="否">

          </el-switch>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateImage.dialog = false">取 消</el-button>
        <el-button type="primary" @click="updImage('updateImage')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除镜像 dialog -->
    <el-dialog title="删除镜像" :visible.sync="deleteImage.dialog" width="400px">
      <el-form label-width="100px">
        <el-form-item label="镜像名称">
          <el-input v-model="deleteImage.name" size="mini" disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteImage.dialog = false">取 消</el-button>
        <el-button type="primary" @click="delImage()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import createImage from './menu/image/createImage'
  import deleteImage from './menu/image/deleteImage'
  import iamgeStatus from '../filters/image'
  import rules from '@/components/rules/rules'

  export default {
    data() {
      return {
        tableData3: [],
        multipleSelection: [],
        table_loading: true,
        updateImage: {
          dialog: false,
          image_id: '',
          name: '',
          description: '',
          minDisk: '',
          minRam: '',
          protected: '',
          visibility: ''
        },
        deleteImage: {
          dialog: false,
          id: '',
          name: ''
        },
        disk_formats: [
          'iso',
          'qcow2'
        ],
      }
    },
    computed: {
      rules: function () {
        return rules.rules
      }
    },
    mounted: function () {
      this.listImages()
    },
    filters: {
      imageStatus: (value) => {
        return iamgeStatus.imageStatus(value)
      }
    },
    methods: {
      updateImageDialog(v) {
        this.updateImage.dialog = true
        this.updateImage.image_id = v.id
        this.updateImage.name = v.name
        // this.updateImage.description = v.description
        this.updateImage.minDisk = v.min_disk
        this.updateImage.minRam = v.min_ram
        this.updateImage.protected = v.protected
        this.updateImage.visibility = v.visibility == "public"
      },
      deleteImageDialog(v) {
        this.deleteImage.dialog = true
        this.deleteImage.id = v.id
        this.deleteImage.name = v.name
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      listImages() {
        axios.get('/image/listImages')
          .then((res) => {
            this.tableData3 = res.data['imageInfo']
            this.table_loading = false
          })
      },
      updImage(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updateImage.dialog = false
            axios.post('/image/updateImage', {
                image_id: this.updateImage.image_id,
                name: this.updateImage.name,
                // description: this.updateImage.description,
                minDisk: this.updateImage.minDisk,
                minRam: this.updateImage.minRam,
                protected: this.updateImage.protected,
                visibility: this.updateImage.visibility ? 'public' : 'private'
              })
              .then((res) => {
                this.listImages()
              })
          } else {
            return false;
          }
        });
      },
      delImage() {
        this.deleteImage.dialog = false
        axios.post('/image/delImage', {
            image_id: this.deleteImage.id
          })
          .then((res) => {
            this.listImages()
          })

      },
      handleChange1() {

      },
      handleChange2() {

      },
      close(formName) {
        this.$refs[formName].resetFields()
      }
    },
    components: {
      createImage,
      deleteImage,
      rules,
    }
  }
</script>

<style scoped>

</style>