<template>

</template>

<script>
  export default {
    



  }

  function request(url){
        axios.get('/api/listservers')
        .then((res) => {
          console.log(res)
          this.tableData3 = res.data.serverInfo
        })
        .catch(function (err) {
          console.log(err)
        })
  }
</script>

<style>

</style>