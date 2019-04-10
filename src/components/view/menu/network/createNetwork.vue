<template>
  <div class="createServer">
    <el-button size="mini" @click="beforeCreate()">创建网络</el-button>
    <el-dialog title="创建网络" :visible.sync="dialogVisible" width="400px">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="网络" name="network">
            <el-form ref="network" :model="network" label-width="120px">
              <el-form-item label="名称">
                <el-input v-model="network.network_name" size="mini" placeholder="请输入名称"></el-input>
              </el-form-item>
              <!-- <el-form-item label="项目" size="mini">
                <el-select v-model="network.project" placeholder="选择项目">

                </el-select>
              </el-form-item> -->
              <!-- <el-form-item label="供应商网络类型" size="mini">
                <el-select v-model="network.status" placeholder="选择网络类型">
                  <el-option v-for="status in network.status_list" :key="status" :value="status" :label="status">

                  </el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="启用管理员状态" size="mini">
                <el-checkbox v-model="network.admin_state_up"></el-checkbox>
              </el-form-item>
              <el-form-item label="共享的" size="mini">
                <el-checkbox v-model="network.is_shared"></el-checkbox>
              </el-form-item>
              <el-form-item label="创建子网" size="mini">
                <el-checkbox v-model="network.check_num"></el-checkbox>
              </el-form-item>
              <el-form-item label="可用域提示" size="mini">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="network.availability_zone">
                </el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane v-if="network.check_num" label="子网" name="subnet">
            <el-form label-width="120px" :model="subnet" :rules="rules" ref="subnet" class="demo-ruleForm">
              <el-form-item label="子网名称">
                <el-input v-model="subnet.subnet_name" size="mini" placeholder="请输入名称"></el-input>
              </el-form-item>
              <el-form-item label="网络地址" prop="cidr">
                <el-input v-model="subnet.cidr" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="IP版本">
                <el-select v-model="subnet.ip_version" placeholder="选择网络类型" size="mini">
                  <el-option v-for="status in subnet.IPs" :key="status.value" :value="status.value" :label="status.name">

                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="!subnet.gateway" label="网关IP">
                <el-input v-model="subnet.gateway_ip" size="mini"></el-input>
              </el-form-item>
              <el-form-item label="禁用网关">
                <el-checkbox v-model="subnet.gateway"></el-checkbox>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane v-if="network.check_num" label="子网详情" name="subnetInfo">
            <el-form label-width="120px">
              <el-form-item label="激活DHCP">
                <el-checkbox v-model="subnetInfo.DHCP"></el-checkbox>
              </el-form-item>
              <el-form-item label="分配地址池">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="subnetInfo.allocation_pools">
                </el-input>
              </el-form-item>
              <el-form-item label="DNS服务器">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="subnetInfo.dns_nameservers">
                </el-input>
              </el-form-item>
              <!-- <el-form-item label="主机路由">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="subnetInfo.host_routes">
                </el-input>
              </el-form-item> -->
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createServer()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import rules from '@/components/rules/rules'

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
        activeName: 'network',
        network: {
          check_num: true,
          status_list: [
            'Flat',
            'VLAN',
            'VXLAN'
          ],
          admin_state_up: true,
          network_name: '',
          is_shared: '',
          availability_zone: ''
        },
        subnet: {
          IPs: [{
              name: 'IPv4',
              value: '4'
            },
            {
              name: 'IPv6',
              value: '6'
            }
          ],
          ip_version: '4',
          gateway: false,
          subnet_name: '',
          cidr: '',
          gateway_ip: ''
        },
        subnetInfo: {
          DHCP: true,
          subnet_name: '',
          ip_version: '',
          cidr: '',
          gateway_ip: '',
          allocation_pools: '',
          dns_nameservers: '',
        }
      };
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      beforeCreate() {
        this.dialogVisible = true
      },
      createServer() {
        this.dialogVisible = false
        axios.post('/network/createNetwork', {
            network_name: this.network.network_name,
            admin_state_up: this.network.admin_state_up,
            is_shared: this.network.is_shared,
            check_num: this.network.check_num ? 'True' : 'False',
            availability_zone: this.network.availability_zone,
            subnet_name: this.subnet.subnet_name,
            ip_version: this.subnet.ip_version,
            cidr: this.subnet.cidr,
            gateway_ip: this.subnet.gateway_ip,
            allocation_pools: this.subnetInfo.allocation_pools,
            dns_nameservers: this.subnetInfo.dns_nameservers,
            // start_ip: '192.168.37.5',
            // end_ip: '192.168.37.10'
          })
          .then(() => {
            this.$emit('updateView')
          })
      },
      handleClick(tab, event) {

      }
    }
  }
</script>

<style scoped>

</style>