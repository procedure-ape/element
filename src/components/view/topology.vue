<template>
  <div class="tableBox">
    <div style="display: inline-block;min-width: 400px">
      <svg width="800px" height="1000px">
        <g class="network" v-for="network of networks" :key="network.id" :id="network.id"
          :transform="network.transform">
          <g class="network_container_small">
            <rect rx="7" ry="7" width="600" height="15" :fill="network.fill" class="network-rect"></rect>
            <text x="300" y="-3" class="network-name" transform="translate(0,17)"
              pointer-events="none">{{ network.name }}</text>
            <text x="580" y="-20" class="network-cidr"
              transform="translate(0,50)">{{ network.subnets | subnetCidr }}</text>
            <text x="585" y="30" class="network-type" transform="translate(0,0)" data-toggle="tooltip"
              data-placement="bottom" title="" data-original-title="外部网络">{{ network | external }}</text>
          </g>
          <g class="device" id="id_528e9414-4863-4b74-a5c0-6c08acf18c83" transform="translate(47.5,50)">
            <g class="router_small device_body">
              <g class="ports" pointer-events="none">
                <g class="port" id="id_340147f1-00c3-46ec-99cf-3fda6c5efe9b" transform="translate(20,7.5)">
                  <line class="port_line" stroke-width="3" :stroke="network.fill" x1="-10" y1="-43" y2="-9" x2="-10"></line><text
                    class="port_text" x="0" y="0">192.168.77.1</text>
                </g>
              </g>
              <rect rx="3" ry="3" width="20" height="20" class="frame"></rect>
              <g transform="translate(3.5,3)" class="icon">
                <polygon points="12.51,4.23 12.51,0.49 8.77,0.49 9.68,1.4 6.92,4.16 8.84,6.08 11.6,3.32  "></polygon>
                <polygon points="0.49,8.77 0.49,12.51 4.23,12.51 3.32,11.6 6.08,8.83 4.17,6.92 1.4,9.68  "></polygon>
                <polygon points="1.85,5.59 5.59,5.59 5.59,1.85 4.68,2.76 1.92,0 0,1.92 2.76,4.68   "></polygon>
                <polygon points="11.15,7.41 7.41,7.41 7.41,11.15 8.32,10.24 11.08,13 13,11.08 10.24,8.32   "></polygon>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>

  </div>
</template>

<script>
  import axios from 'axios'
  import topology from '@/components/debug/topology'

  export default {
    name: 'topology',
    mounted: function () {
      console.log(JSON.parse(JSON.stringify(topology.json)))
      this.networks = topology.json.networks
      console.log('--------router----')
      for (let i in this.networks) {
        this.networks[i].transform = 'translate(0,' + i * 100 + ')'
        this.networks[i].fill = this.Chromatography[i]
        let network_id = this.networks[i].id
        for(let port of topology.json.ports){
          if(network_id == port.network_id){
            let device_id = port.device_id
            for(let router of topology.json.routers){
              if(device_id == router.id){
                console.log(router)
              }
            }
            for(let server of topology.json.servers){

            }
          }
        }
      }
    },
    data() {
      return {
        networks: [],
        interval: 100,
        svgLength: 0,
        Chromatography: [
          'rgb(31, 119, 180)',
          'rgb(255, 127, 14)',
          'rgb(44, 160, 44)',
          'rgb(214, 39, 40)',
          'rgb(148, 103, 189)',
          'rgb(140, 86, 75)',
          'rgb(227, 119, 194)',
          'rgb(127, 127, 127)',
          'rgb(188, 189, 34)',
          'rgb(23, 190, 207)',
        ]
      }
    },
    components: {
      topology
    },
    filters: {
      subnetCidr(v) {
        let cidr = ''
        for (let i of v) {
          cidr ? cidr += ',' + i.cidr : cidr = i.cidr
        }
        return cidr
      },
      transform(v) {
        console.log(v)
      },
      external(v){
        if(v['router:external']){
          return ''
        }
        return ''
      }
    },
  }
</script>

<style scoped>
  .network-name {
    fill: white;
  }

  .port_text {
    display: none;
  }

  .network-type {
    font-family: FontAwesome;
  }

  .network-cidr {
    font-size: 12px;
    text-anchor: end;
  }

  .frame {
    fill: url(#device_small_bg);
    stroke: #333;
    stroke-width: 3;
  }
</style>