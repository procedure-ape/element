<template>
  <div>
    <div class="portHeader">
      <el-button @click="CreateDialog" size="mini" style="float: right">创建端口</el-button>
    </div>
    <div class="portContent">
      <el-table ref="multipleTable" :data="tables" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            {{ scope.row | portName }}
          </template>
        </el-table-column>
        <el-table-column label="固定IP">
          <template slot-scope="scope">
            <div v-for="ip of scope.row.fixed_ips" :key="ip.ip_address">{{ ip.ip_address }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="mac_address" label="MAC地址">
        </el-table-column>
        <el-table-column label="连接设备">
          <template slot-scope="scope">
            <div v-if="scope.row.device_id">{{ scope.row.device_id }}</div>
            <div v-else>分离</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
        </el-table-column>
        <el-table-column label="管理状态">
          <template slot-scope="scope">
            {{ scope.row.admin_state_up ? 'UP' : 'DOWN' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button size="mini" @click="EditDialog(scope.$index, scope.row)">编辑</el-button> -->
            <el-button size="mini" type="danger" @click="DeleteDialog(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 创建端口 dialog -->
    <el-dialog title="创建端口" :visible.sync="create.dialog" width="400px">
      <el-form label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="create.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="create.admin_state_up">启用管理员状态</el-checkbox>
        </el-form-item>
        <el-form-item label="设备ID">
          <el-input v-model="create.device_id" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="设备所属者">
          <el-input v-model="create.device_owner" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="指定 IP 地址或子网">
          <el-select v-model="create.IPorSubnet">
            <el-option value="">未指定的</el-option>
            <!-- <el-option value="subnet">子网</el-option>
            <el-option value="IP">固定的IP地址</el-option> -->
          </el-select>
        </el-form-item>
        <!-- <el-form-item v-if="create.IPorSubnet === ''" label="子网">
          <el-input v-model="create.gateway_ip" size="mini"></el-input>
        </el-form-item>
        <el-form-item v-if="!create.gateway" label="IP地址">
          <el-input v-model="create.gateway_ip" size="mini"></el-input>
        </el-form-item> -->
        <!-- <el-form-item v-if="!create.gateway" label="MAC地址">
          <el-input v-model="create.gateway_ip" size="mini"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-checkbox v-model="create.port_security_enabled">端口安全</el-checkbox>
        </el-form-item>
        <el-form-item label="VNIC类型">
          <el-select v-model="create.IPorSubnet">
            <el-option value="normal">正常</el-option>
            <el-option value="macrtap">直连</el-option>
            <el-option value="direct">直通物理硬件</el-option>
            <el-option value="baremetal">直通物理硬件</el-option>
            <el-option value="direct-physical">直通物理硬件</el-option>
            <el-option value="virtio-forwarder">直通物理硬件</el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="create.dialog = false">取 消</el-button>
        <el-button type="primary" @click="createPort()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑子网 dialog -->
    <el-dialog title="编辑子网" :visible.sync="edit.dialog" width="400px">
      <span slot="footer" class="dialog-footer">
        <el-button @click="edit.dialog = false">取 消</el-button>
        <el-button type="primary" @click="editPort()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除端口 dialog -->
    <el-dialog title="删除端口" :visible.sync="del.dialog" width="400px">
      <span slot="footer" class="dialog-footer">
        <el-button @click="del.dialog = false">取 消</el-button>
        <el-button type="primary" @click="deletePort()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'port',
    data() {
      return {
        tables: [],
        multipleTable: [],
        network_id: '',
        create: {
          dialog: false,
          gateway: false,
          gateway_ip: '',
          admin_state_up: true,
          port_security_enabled: true,
          binding_vnic_type: 'normal',
          device_id: '',
          device_owner: '',
          subnet_id: '',
          ip_address: '',
        },
        del: {
          dialog: false
        },
        edit: {
          dialog: false
        },

      }
    },

    filters: {
      portName: (row)=>{
        if(row.port_name){
          return row.port_name
        }
        let s = row.port_id.split('-')
        return s[0] + '-' + s[1]
      }
    },

    methods: {
      getPort(network_id) {
        axios.post('/network/listports', {
            network_id
          })
          .then((res) => {
            this.tables = res.data.portInfo
          })
      },
      getNetwork() {
        let intervalID = setInterval(() => {
          let network_id = sessionStorage.getItem('network')
          if (network_id) {
            clearInterval(intervalID)
            this.network_id = network_id
            this.getPort(network_id)
          } else {
            console.log(network_id)
          }
        }, 100)
      },
      handleSelectionChange() {

      },
      CreateDialog() {
        this.create.dialog = true
      },
      createPort() {
        this.create.dialog = false
        let data = {
          network_id: this.network_id,
          name: this.create.name,
          admin_state_up: this.create.admin_state_up,
          port_security_enabled: this.create.port_security_enabled,
          binding_vnic_type: this.create.binding_vnic_type,
          device_id: this.create.device_id,
          device_owner: this.create.device_owner,
          subnet_id: this.create.subnet_id,
          ip_address: this.create.ip_address,
        }
        axios.post('/network/createPort', data)
      },
      EditDialog(index, row) {
        this.edit.dialog = true
      },
      editPort() {
        this.edit.dialog = false
      },
      DeleteDialog(index, row) {
        this.del.dialog = true
        this.del.port_id = row.port_id
      },
      deletePort() {
        this.del.dialog = false
        let data = {
          port_id: this.del.port_id
        }
        axios.post('/network/deletePort', data)
        .then(()=>{
          this.getPort(this.network_id)
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