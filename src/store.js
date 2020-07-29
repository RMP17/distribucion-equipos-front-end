import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
Vue.use(Vuex)
// this.$http.defaults.headers.common['Authorization'] = this.token;

export default new Vuex.Store({
  state: {
    token:'',
    user:''
  },
  mutations: {
    storeAuthData(state, authData){
      state.token=authData.token;
      state.user=authData.user;
      let currentUser=JSON.stringify(authData);
      localStorage.setItem("currentUser", currentUser);
    },
  },
  actions: {
    getCurrentUser({commit}){
      let currentUser=localStorage.getItem("currentUser");
      if(currentUser){
        let data=JSON.parse(currentUser);
        commit('storeAuthData', data);
      }
    },
  }
})
