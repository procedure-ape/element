<template>
  <div>
    <div style="text-align: center;">{{ data.content.title }}</div>
    <div class="gauge" :id="data.id"></div>
    <div>
      <div>{{ data.content.used }}</div>
      <div>{{ data.content.all }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'hostInfo',
    data(){
      return {
        
      }
    },

    mounted: function () {
      this.$nextTick(() => {
        // 主机信息仪表板
        this.$echarts.init(document.getElementById(this.data.id)).setOption({
          legend: {
            data: ['host']
          },
          series: [{
            name: '',
            type: 'gauge',
            center: ['50%', '50%'], // 默认全局居中
            radius: '100%',
            min: 0,
            max: 100,
            endAngle: 90,
            startAngle: 449,
            splitNumber: 100,
            axisLine: { // 坐标轴线
              lineStyle: { // 属性lineStyle控制线条样式
                width: 10,
                color: this.data.content.color
              }
            },
            axisTick: { // 坐标轴小标记
              show: false
            },
            splitLine: { // 分隔线
              length: 1, // 属性length控制线长
              lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'auto'
              }
            },
            axisLabel: {
              show: false
            },
            pointer: {
              width: 5
            },
            title: {
              offsetCenter: [0, '-30%'], // x, y，单位px
            },
            detail: {
              // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              fontSize: 20,
              offsetCenter:[
                '10%','10%'
              ],
              formatter: function (value) {
                return value+'%';
              },
            },
            pointer: {
              show: false
            },
            data: [
              this.data.content.data
            ]
          }, ]
        })

      })
    },
    props: {
      data: {
        type: Object,
        default: function(){
          return {
            id: 'default',
            content: {
              title: '',
              data: {
                name: 'default',
                value: 1
              },
              color: [
                [1, '#ddd']
              ]
            }
          }
        }
      }
    }
  }
</script>


<style scoped>
  .hostInfo {
    display: flex;
    flex-direction: row;
  }

  .host {
    margin: 10px;
    padding: 10px 40px;
    display: inline-block;
  }

  .gauge {
    width: 100px;
    height: 100px;
  }
</style>