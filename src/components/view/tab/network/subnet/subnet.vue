<template>
  <div>
    <div class="subnetHeader">
      <el-button @click="CreateDialog" size='mini' style="float: right">创建子网</el-button>
    </div>
    <div class="subnetContent">
      <el-table ref="multipleTable" :data="tables" tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="subnet_name" label="名称">
        </el-table-column>
        <el-table-column prop="CIDR" label="网络地址">
        </el-table-column>
        <el-table-column prop="ip_version" label="IP版本">
        </el-table-column>
        <el-table-column prop="gateway_ip" label="网关IP">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="EditDialog(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="DeleteDialog(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 创建子网 dialog -->
    <el-dialog title="创建子网" :visible.sync="create.dialog" width="400px" @close="close('create')">
      <el-form label-width="100px" :model="create" :rules="rules" ref="create" class="demo-ruleForm">
        <el-form-item label="子网名称">
          <el-input v-model="create.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="子网地址" prop='cidr'>
          <el-input v-model="create.cidr" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="IP版本">
          <el-select v-model="create.ip_version" size="mini">
            <el-option value="IPv4">IPv4</el-option>
            <el-option value="IPv6">IPv6</el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="!create.gateway" label="网关IP">
          <el-input v-model="create.gateway_ip" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="禁用网关">
          <el-checkbox v-model="create.gateway"></el-checkbox>
        </el-form-item>
        <el-form-item label="分配地址池">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"
            v-model="create.allocation_pools">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="create.dialog = false">取 消</el-button>
        <el-button type="primary" @click="createSubnet('create')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑子网 dialog -->
    <el-dialog title="编辑子网" :visible.sync="edit.dialog" width="400px">
      <el-form label-width="100px">
        <el-form-item label="子网名称">
          <el-input v-model="edit.name" size="mini"></el-input>
        </el-form-item>
        <!-- <el-form-item label="网络地址">
          <el-input v-model="edit.CIDR" size="mini"></el-input>
        </el-form-item>
        <el-form-item v-if="!edit.gateway" label="网关IP">
          <el-input v-model="edit.gateway_ip" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="禁用网关">
          <el-checkbox v-model="edit.gateway"></el-checkbox>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="edit.dialog = false">取 消</el-button>
        <el-button type="primary" @click="editSubnet()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除子网 dialog -->
    <el-dialog title="删除子网" :visible.sync="del.dialog" width="400px">
      确定删除该子网？
      <span slot="footer" class="dialog-footer">
        <el-button @click="del.dialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteSubnet()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import rules from '@/components/rules/rules'

  export default {
    name: 'subnet',
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
        tables: [],
        multipleTable: [],
        network_id: '',
        create: {
          name: '',
          dialog: false,
          gateway: false,
          gateway_ip: '',
          allocation_pools: "",
          cidr: "",
          ip_version: 'IPv4',
          dns_nameservers: '',
        },
        edit: {
          name: '',
          dialog: false,
          gateway: false,
          gateway_ip: '',
          allocation_pools: "",
          CIDR: "",
          dns_nameservers: ''
        },
        del: {
          dialog: false
        },

      }
    },
    methods: {
      close(formName) {
        this.$refs[formName].resetFields()
      },
      getSubnet(network_id) {
        axios.post('/network/listsubnets', {
            network_id
          })
          .then((res) => {
            this.tables = res.data.subnetInfo
          })
      },
      getNetwork() {
        let intervalID = setInterval(() => {
          let network_id = sessionStorage.getItem('network')
          if (network_id) {
            clearInterval(intervalID)
            this.network_id = network_id
            this.getSubnet(network_id)
          }
        }, 100)
      },
      handleSelectionChange() {

      },
      CreateDialog() {
        this.create.dialog = true
      },
      createSubnet(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.create.dialog = false
            let data = {
              network_id: this.network_id,
              name: this.create.name,
              cidr: this.create.cidr,
              gateway_ip: this.create.gateway_ip,
              ip_version: this.create.ip_version == 'IPv4' ? 4 : 6,
              allocation_pools: this.create.allocation_pools,
            }
            axios.post('/network/createSubnet', data)
              .then(() => {
                this.getSubnet(this.network_id)
              })
          } else {
            return false;
          }
        });

      },

      EditDialog(index, row) {
        this.edit.subnet_id = row.subnet_id
        this.edit.name = row.subnet_name
        this.edit.CIDR = row.CIDR
        this.edit.gateway_ip = row.gateway_ip
        for (let i of row.allocation_pools) {
          this.edit.allocation_pools = i.start + ',' + i.end
        }
        this.edit.cidr = row.cidr
        this.edit.ip_version = row.ip_version
        this.edit.dialog = true
      },
      editSubnet() {
        this.edit.dialog = false
        let data = {
          subnet_id: this.edit.subnet_id,
          name: this.edit.name,
          // cidr: this.edit.CIDR,
          // allocation_pools: this.edit.allocation_pools,
        }
        axios.post('/network/updateSubnet', data)
          .then(() => {
            this.getSubnet(this.network_id)
          })
      },

      DeleteDialog(index, row) {
        this.del.dialog = true
        this.del.subnet_id = row.subnet_id
      },
      deleteSubnet() {
        this.del.dialog = false
        let data = {
          subnet_id: this.del.subnet_id
        }
        axios.post('/network/deleteSubnet', data)
          .then(() => {
            this.getSubnet(this.network_id)
          })
      },


    },
    mounted: function () {
      this.getNetwork()
    }
  }
</script>

<style>

</style>