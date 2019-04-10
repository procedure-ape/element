<template>
  <el-card class="host">
    <div class="hostInfo">
      <div>
        <div>主机名：{{ host.hypervisor_hostname }}</div>
        <div>主机IP:{{ host.host_ip }}</div>
        <div>运行虚拟机数量:{{ host.running_vms }}</div>
        <div>vcpu个数:{{ host.vcpus }}</div>
        <div>vcpu(使用中):{{ host.vcpus_used }}</div>
      </div>
      <div id="infoEcharts"></div>
    </div>
  </el-card>
</template>

<script>
  export default {
    name: 'hostInfo',
    mounted: function () {
      console.log(JSON.parse(JSON.stringify(this.host)))
      this.$nextTick(() => {
        let memory_used = Math.round(this.host.memory_mb_used/this.host.memory_size*10000)/100
        let local_gb_used = Math.round(this.host.local_gb_used/this.host.local_gb*10000)/100
        // 主机信息仪表板
        this.$echarts.init(document.getElementById('infoEcharts')).setOption({
          legend: {
            data: ['host']
          },
          series: [

            {
              name: '内存使用量',
              type: 'gauge',
              center: ['150', '50%'], // 默认全局居中
              radius: '100%',
              min: 0,
              max: 100,
              endAngle: 45,
              splitNumber: 10,
              axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                  width: 8
                }
              },
              axisTick: { // 坐标轴小标记
                length: 12, // 属性length控制线长
                lineStyle: { // 属性lineStyle控制线条样式
                  color: 'auto'
                }
              },
              splitLine: { // 分隔线
                length: 20, // 属性length控制线长
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                  color: 'auto'
                }
              },
              pointer: {
                width: 5
              },
              title: {
                offsetCenter: [0, '-30%'], // x, y，单位px
              },
              detail: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder'
              },
              data: [{
                value: memory_used,
                name: '内存 %'
              }, ]
            },

            {
              name: '本地磁盘使用量',
              type: 'gauge',
              center: ['300', '50%'], // 默认全局居中
              radius: '100%',
              min: 0,
              max: 100,
              splitNumber: 10,
              axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                  width: 8
                }
              },
              axisTick: { // 坐标轴小标记
                length: 12, // 属性length控制线长
                lineStyle: { // 属性lineStyle控制线条样式
                  color: 'auto'
                }
              },
              splitLine: { // 分隔线
                length: 20, // 属性length控制线长
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                  color: 'auto'
                }
              },
              pointer: {
                width: 5
              },
              title: {
                offsetCenter: [0, '-30%'], // x, y，单位px
              },
              detail: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder'
              },
              data: [{
                value: local_gb_used,
                name: '磁盘使用量 %'
              }, ]
            },

            {
              name: 'VCPU使用量',
              type: 'gauge',
              center: ['420', '50%'], // 默认全局居中
              radius: '60%',
              min: 0,
              max: this.host.vcpus,
              startAngle: 75,
              endAngle: -75,
              splitNumber: 1,
              axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                  width: 4
                }
              },
              axisTick: { // 坐标轴小标记
                length: 8, // 属性length控制线长
                lineStyle: { // 属性lineStyle控制线条样式
                  color: 'auto'
                }
              },
              splitLine: { // 分隔线
                length: 15, // 属性length控制线长
                lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                  color: 'auto'
                }
              },
              pointer: {
                width: 2
              },
              title: {
                offsetCenter: [0, '-30%'], // x, y，单位px
              },
              detail: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder'
              },
              data: [{
                value: this.host.vcpus_used,
                name: 'CPU'
              }, ]
            },
          ]
        })

      })
    },
    props: [
      'host'
    ]
  }
</script>

<style>
  .hostInfo {
    display: flex;
    flex-direction: row;
  }

  .host {
    margin: 10px;
  }

  #infoEcharts {
    width: 70%;
    height: 200px;
  }
</style>