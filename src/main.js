import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@/assets/global.css'
import urlApi from './plugins/api'
import Axios from 'axios'
import extractFirstLetter from './filters/extractFirstLetter'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const options = {
  title:'¿Está seguro/a?',
  icon: 'question',
  iconHtml: '؟',
  confirmButtonText: 'SI',
  cancelButtonText: 'NO',
  showCancelButton: true,
  showCloseButton: true
}

Vue.use(VueSweetalert2, options);
Vue.filter('extractFirstLetter', extractFirstLetter);

Vue.prototype.$urlApi=urlApi;
Vue.prototype.$http = Axios;
Vue.config.productionTip = false;
store.dispatch('getCurrentUser').then(()=>{
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
});

