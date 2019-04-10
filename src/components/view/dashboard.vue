<template>
  <div v-loading="loading">
    <div class="dashboard" style="min-height: 60px">
      <gauge v-for="limitsInfo of limitsInfos" :key="limitsInfo.id" :data="limitsInfo"></gauge>
    </div>

    <div style="padding: 0 10px;display: flex;flex-direction: row;align-items: self-start;flex-wrap: wrap" v-if="hypervisorsInfo">
      <el-card style="margin-right: 10px;min-width: 600px;margin-top: 10px">
        <el-tabs v-model="activeName">
          <el-tab-pane label="计算服务" name="first">
            <compute></compute>
          </el-tab-pane>
          <el-tab-pane label="块存储服务" name="second">
            <storage></storage>
          </el-tab-pane>
          <el-tab-pane label="网络代理" name="third">
            <network></network>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <el-card v-if="hypervisorsInfo" style="margin-top: 10px">
        <div>
          主机IP：{{ hypervisorsInfo.host_ip }}
        </div>
        <div>
          操作系统：{{ server_hardware_info.server_info.system_name }}
        </div>
        <div>
          CPU型号：{{ cpuInfo }}
        </div>
        <div>
          内存大小：{{ server_hardware_info.memory_info | mem_json }}
        </div>
        <div>
          网卡个数：{{ server_hardware_info.net_card_info.length }}
        </div>
        <div>
          运行虚拟机个数：{{ hypervisorsInfo.running_vms }}
        </div>
        <div class="dividing">
          <span>物理资源</span>
        </div>
        <div style="display: flex;justify-content: space-between;">
          <gaugeMini v-for="gauge of gauges" :key="gauge.id" :data="gauge"></gaugeMini>
        </div>
      </el-card>
    </div>

    <div style="display: flex;flex-wrap: wrap;" v-if="hypervisorsInfo">
      <!-- <el-card v-for="host of hostInfo" :key="host.name" style="margin: 10px">
        <div slot="header" class="">
          <span>{{ host.name | noun }}</span>
        </div>
        <div v-for="i of host.info" :key="i.name">
          {{ i.name | noun }}:{{ i.info }}
        </div>
      </el-card> -->
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import gauge from './echarts/gauge1'
  import gaugeMini from './echarts/gauge2'
  import compute from '@/components/view/tab/server/compute'
  import storage from '@/components/view/tab/server/storage'
  import network from '@/components/view/tab/server/network'
  import noun from '@/components/filters/noun'

  export default {
    name: 'dashboard',
    data() {
      return {
        hypervisorsInfo: '',
        gauges: [],
        activeName: 'first',
        loading: true,
        hostInfo: [],
        PhysicalResources: {

        },
        server_hardware_info: {
          net_card_info: [],
          server_info: {
            system_name: ''
          },
          cpuInfo: {

          }
        },
        limitsInfos: []
      }
    },
    methods: {
      ratio(used, amount) {
        let ratio = used / amount
        let ratiocolor
        if (ratio < 0.7) {
          ratiocolor = [ratio, '#41b883']
        } else if (ratio < 0.9) {
          ratiocolor = [ratio, '#ffd04b']
        } else {
          ratiocolor = [ratio, '#ff1d1d']
        }
        return ratiocolor
      }
    },
    computed: {
      cpuInfo: function () {
        let v = this.hypervisorsInfo.topology
        if (this.server_hardware_info.cpu_info) {
          return v.cores + '核x ' + v.threads + '线程x ' + v.sockets + '路 ' + this.server_hardware_info.cpu_info[
            'model name']
        }
        return ''
      }
    },
    filters: {
      noun(v) {
        return noun.noun(v)
      },
      mem_json(v) {
        if (v) {
          return parseInt(parseInt(v.MemTotal.split(' ')[0]) / 1024 / 1024) + 'GB'
        }
        return ''
      },
    },
    beforeCreate: function () {
      this.loading = true
      axios.get('/api/listHypervisors')
        .then((res) => {
          this.loading = false

          // 内存
          this.hypervisorsInfo = res.data.hypervisorsInfo[0]
          this.gauges.push({
            id: 'memory',
            content: {
              title: '内存使用量',
              color: [
                this.ratio(this.hypervisorsInfo.memory_mb_used, this.hypervisorsInfo.memory_size),
                [1, '#eee']
              ],
              data: {
                name: '',
                value: parseInt(this.hypervisorsInfo.memory_mb_used/this.hypervisorsInfo.memory_size*10000)/100
              },
              used: '已使用：' + this.hypervisorsInfo.memory_mb_used + 'MB',
              all: '总资源：' + this.hypervisorsInfo.memory_size + 'MB',
            },
          })

          // 磁盘
          this.gauges.push({
            id: 'local',
            content: {
              title: '磁盘使用量',
              color: [
                this.ratio(this.hypervisorsInfo.local_gb_used, this.hypervisorsInfo.local_gb),
                [1, '#eee']
              ],
              data: {
                name: '',
                value: parseInt(this.hypervisorsInfo.local_gb_used/this.hypervisorsInfo.local_gb*10000)/100
              },
              used: '已使用：' + this.hypervisorsInfo.local_gb_used + 'GB',
              all: '总资源：' + this.hypervisorsInfo.local_gb + 'GB',
            },
          })

          // cpu
          this.gauges.push({
            id: 'vcpu',
            content: {
              title: 'vcpu使用量',
              color: [
                this.ratio(this.hypervisorsInfo.vcpus_used, this.hypervisorsInfo.vcpus),
                [1, '#eee']
              ],
              data: {
                name: '',
                value: parseInt(this.hypervisorsInfo.vcpus_used/this.hypervisorsInfo.vcpus*10000)/100
              },
              used: '已使用：' + this.hypervisorsInfo.vcpus_used,
              all: '总资源：' + this.hypervisorsInfo.vcpus,
            },
          })
        })

      axios.get('/api/hardwareInfo')
        .then((res) => {
          this.server_hardware_info = res.data.server_hardware_info
          let cpu_info = res.data.server_hardware_info.cpu_info
          let memory_info = res.data.server_hardware_info.memory_info
          let server_info = res.data.server_hardware_info.server_info
          let net_card_info = res.data.server_hardware_info.net_card_info[0]
          this.hostInfo.push({
            name: 'cpu_info',
            info: json_array(cpu_info)
          })
          this.hostInfo.push({
            name: 'memory_info',
            info: mem_json_array(memory_info)
          })
          this.hostInfo.push({
            name: 'server_info',
            info: json_array(server_info)
          })
          this.hostInfo.push({
            name: 'net_card_info',
            info: json_array(net_card_info)
          })
        })

      axios.get('/api/listlimits')
        .then((res) => {
          this.limitsInfos.push({
            id: 'vcpu使用量',
            content: {
              title: 'vcpu使用量',
              data: {
                name: '',
                value: parseInt((res.data.limitsInfo.total_cores_used/res.data.limitsInfo.total_cores)*10000)/100
              },
              color: [
                this.ratio(res.data.limitsInfo.total_cores_used, res.data.limitsInfo.total_cores),
                [1, '#ddd']
              ],
              used: '已使用：' + res.data.limitsInfo.total_cores,
              all: '总资源：' + res.data.limitsInfo.total_cores_used
            }
          })

          this.limitsInfos.push({
            id: '内存使用量',
            content: {
              title: '内存使用量',
              data: {
                name: '',
                value: parseInt((res.data.limitsInfo.total_ram_used/res.data.limitsInfo.total_ram)*10000)/100
              },
              color: [
                this.ratio(res.data.limitsInfo.total_ram_used, res.data.limitsInfo.total_ram),
                [1, '#ddd']
              ],
              used: '已使用：' + res.data.limitsInfo.total_ram_used+'MB',
              all: '总资源：' + res.data.limitsInfo.total_ram+'MB',
            }
          })

          this.limitsInfos.push({
            id: '本地磁盘使用量',
            content: {
              title: '本地磁盘使用量',
              data: {
                name: '',
                value: parseInt((res.data.limitsInfo.volume_store_use/res.data.limitsInfo.volume_store_total)*10000)/100
              },
              color: [
                this.ratio(res.data.limitsInfo.volume_store_use, res.data.limitsInfo.volume_store_total),
                [1, '#ddd']
              ],
              used: '已使用：' + res.data.limitsInfo.volume_store_use+'GB',
              all: '总资源：' + res.data.limitsInfo.volume_store_total+'GB',
            }
          })

          this.limitsInfos.push({
            id: '虚拟机数量',
            content: {
              title: '虚拟机数量',
              data: {
                name: '',
                value: parseInt((res.data.limitsInfo.instances_used/res.data.limitsInfo.instances)*10000)/100
              },
              color: [
                this.ratio(res.data.limitsInfo.instances_used, res.data.limitsInfo.instances),
                [1, '#ddd']
              ],
              used: '已使用：' + res.data.limitsInfo.instances_used,
              all: '总资源：' + res.data.limitsInfo.instances,
            }
          })
        })
    },
    components: {
      gauge,
      compute,
      storage,
      network,
      noun,
      gaugeMini,
    }
  }

  function json_array(v) {
    let array = []
    for (let i in v) {
      array.push({
        name: i,
        info: v[i]
      })
    }
    return array
  }

  function mem_json_array(v) {
    let array = []
    for (let i in v) {
      let size = parseInt(parseInt(v[i].split(' ')[0]) / 1024)
      array.push({
        name: i,
        info: size + 'MB'
      })
    }
    return array
  }
</script>

<style scoped>
  #box {
    background: transparent;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
  }

  .box-card {
    width: 200px;
    margin: 10px;
  }

  .dashboard {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .dividing {
    margin-top: 10px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-top: solid 1px #ebeef5;
  }
</style>