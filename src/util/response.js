import Vue from 'vue'
import axios from 'axios'

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  if(response.config.method == 'post' && response.data.msg == "success"){
    Vue.prototype.$notify({
      title: '成功',
      message: '操作成功',
      type: 'success'
    })
  }else if(response.config.method == 'post' && response.data.error_num != 0){
    Vue.prototype.$notify({
      title: '操作失败',
      message: response.data.msg,
      type: 'warning'
    })
  }
  
  return response;
}, function (error) {
  Vue.prototype.$notify.error({
    title: '网络错误',
    message: '请重试或者联系我们的工作人员'
  })
  // 对响应错误做点什么
  return Promise.reject(error);
});