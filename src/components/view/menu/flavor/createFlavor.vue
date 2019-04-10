<template>
  <div>
    <el-button size="mini" @click="beforeCreate()">创建配置</el-button>
    <el-dialog title="创建配置" :visible.sync="dialogVisible" width="400px" @close="close('flavor')">
      <el-form label-width="120px" :model="flavor" :rules="rules" ref="flavor" class="demo-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="flavor.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="VCPU数量">
          <el-input-number v-model="flavor.vcpus" :min="1" size="mini"></el-input-number>
        </el-form-item>
        <el-form-item label="内存(MB)">
          <el-input-number v-model="flavor.ram" :min="1" size="mini"></el-input-number>
        </el-form-item>
        <el-form-item label="根磁盘(GB)">
          <el-input-number v-model="flavor.disk" :min="0" size="mini"></el-input-number>
        </el-form-item>
        <el-form-item label="临时磁盘(GB)">
          <el-input-number v-model="flavor.ephemeral" :min="0" size="mini"></el-input-number>
        </el-form-item>
        <el-form-item label="Swap磁盘(MB)">
          <el-input-number v-model="flavor.swap" :min="0" size="mini"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="create('flavor')">确 定</el-button>
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
        flavor: {
          name: '',
          vcpus: 1,
          ram: 1,
          disk: 0,
          ephemeral: 0,
          swap: 0
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
            axios.post('/api/createFlavor', {
                name: this.flavor.name,
                vcpus: this.flavor.vcpus,
                ram: this.flavor.ram,
                disk: this.flavor.disk,
                ephemeral: this.flavor.ephemeral,
                swap: this.flavor.swap,
              })
              .then(() => {
                this.$emit('updateView')
              })
          } else {
            return false;
          }
        });

      },
      close(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style>

</style>