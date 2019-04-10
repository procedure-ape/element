<template>
  <div>
    <el-button size="mini" @click="beforeCreate()">创建卷</el-button>
    <el-dialog title="创建卷" :visible.sync="dialogVisible" width="400px" @close="close('stora')">
      <el-form label-width="100px" :model="Stora" :rules="rules" ref="stora" class="demo-ruleForm">
        <el-form-item label="卷名称" prop="name">
          <el-input v-model="Stora.name" size="mini" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="大小(GiB)">
          <el-input-number v-model="Stora.size" controls-position="right" @change="handleChange" :min="1" size="mini">
          </el-input-number>
        </el-form-item>
        <el-form-item label="卷类型">
          <el-select v-model="Stora.volume_type" placeholder="类型" size="mini">
            <el-option v-for="stora in Stora.types" :key="stora.id" :label="stora.name" :value="stora.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="create('stora')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import rules from '@/components/rules/rules'

  export default {
    name: 'createStorage',
    components: {
      rules
    },
    computed: {
      rules: function () {
        return rules.rules
      }
    },
    data() {
      return {
        dialogVisible: false,
        Stora: {
          types: [{
            name: 'iscsi',
            id: 'iscsi',
          }],
          volume_type: "iscsi",
          size: 1
        }
      }
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      close(formName) {
        this.$refs[formName].resetFields()
      },
      handleChange(value) {
        console.log(value);
      },
      beforeCreate() {
        this.dialogVisible = true
      },
      create(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogVisible = false
            axios.post('/store/createVolume', {
                volume_name: this.Stora.name,
                volume_size: this.Stora.size,
                volume_type: this.Stora.volume_type
              })
              .then(() => {
                this.$emit('updateView')
              })
          } else {
            return false;
          }
        });

      }
    }
  }
</script>

<style>

</style>