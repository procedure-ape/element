<template>
  <div class="createServer">
    <el-button size="mini" @click="beforeCreate()">创建虚拟机</el-button>
    <el-dialog title="创建虚拟机" :visible.sync="dialogVisible" width="400px" @close="closeForm('create_server')">
      <el-form ref="create_server" :model="create_server" label-width="100px" :rules="rules" class="demo-ruleForm">
        <el-form-item label="虚拟机名称" prop="name">
          <el-input v-model="create_server.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="镜像" size="mini" prop="image_id">
          <el-select v-model="create_server.image_id" placeholder="选择镜像" size="mini">
            <el-option v-for="image in infos.images" :key="image.id" :label="image.name" :value="image.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配置" size="mini" prop="flavor_id">
          <el-select v-model="create_server.flavor_id" placeholder="选择配置" size="mini">
            <el-option v-for="flavor of infos.flavors" :key="flavor.id" :label="flavor.name" :value="flavor.flavor_id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="网络" size="mini">
          <el-checkbox-group v-model="form.networks" size="mini">
            <el-checkbox class="NetworksCheckBox" v-for="network of infos.networks" :key="network.id" :label="network.name"
              :value="network.id"></el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
        <el-form-item label="网络" size="mini" prop="networks">
          <el-select v-model="create_server.networks" placeholder="请选择">
            <el-option v-for="network of infos.networks" :key="network.id" :label="network.name" :value="network.id">
              <span>{{ network.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建数量" size="mini">
          <el-input-number size="mini" v-model="create_server.number"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createServer('create_server')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import qs from 'qs'
  import rules from '../../../rules/rules'

  export default {
    name: 'createServer',
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
        create_server: {
          name: '',
          image_id: '',
          flavor_id: '',
          networks: '',
          number: 1,
        },
        infos: {
          images: [],
          flavors: [],
          networks: []
        }
      };
    },
    methods: {
      closeForm(formName) {
        this.$refs[formName].resetFields()
      },
      beforeCreate() {
        this.dialogVisible = true
        axios.all([getimage(), getflavor(), getnetwork()])
          .then(([image, flavor, network]) => {
            this.infos.images = image.data.imageInfo
            this.infos.flavors = flavor.data.flavorInfo
            this.infos.networks = network.data.networkInfo
            for (let index in this.infos.networks) {
              if (!this.infos.networks[index].name) {
                let network_id = this.infos.networks[index].id.split('-')
                this.infos.networks[index].name = network_id[0] + '-' + network_id[1]
              }
            }
          })
      },
      createServer(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogVisible = false
            axios.post('/api/createServer', {
                name: this.create_server.name,
                image_id: this.create_server.image_id,
                flavor_id: this.create_server.flavor_id,
                network_id: this.create_server.networks,
                number: this.create_server.number,
              })
              .then((res) => {
                this.$emit('updateView')
              })
          } else {
            return false;
          }
        });
      }
    }
  }

  function getimage() {
    return axios.get('/image/listImages')
  }

  function getflavor() {
    return axios.get('/api/listflavors')
  }

  function getnetwork() {
    return axios.get('/network/listnetworks')
  }
</script>

<style scoped>

</style>