import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

const state = {
  count: 2
}

const mutations = {
  updateListHypervisors(state) {
    axios.post('/api/listHypervisors')
      .then((res) => {
        state.count++
      })
  }
}

export default new Vuex.Store({
  state,
  mutations
})