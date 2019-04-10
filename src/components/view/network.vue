<template>
  <div class="tableBox">
    <network-list v-if="tab === 'list'" @tabs='tabs'></network-list>
    <network-details v-else @tabBack="tabBacks"></network-details>
  </div>
</template>

<script>
  import axios from 'axios'
  import networkList from './tab/network/networkList'
  import networkDetails from './tab/network/networkDetails'

  export default {
    data() {
      return {
        tab: 'list',
        network: 1
      }
    },
    components: {
      networkList,
      networkDetails
    },
    filters: {
      
    },
    methods: {
      tabs(network){
        this.tab = 'details'
        sessionStorage.setItem('network',network.id)
        // this.$refs.networkD.test()
      },
      tabBacks(){
        this.tab = 'list'
      }
    }
  }

</script>

<style>

</style>