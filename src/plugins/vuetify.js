import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import es from 'vuetify/es5/locale/es'
import '@deveodk/vue-toastr/dist/@deveodk/vue-toastr.css'
import VueToastr from '@deveodk/vue-toastr'
import NotifyErrors from './notify-errors'
import Print from './print'

Vue.use(NotifyErrors);
Vue.use(Print);

Vue.use(VueToastr, {
    defaultPosition: 'toast-bottom-right',
    defaultTimeout: 6000
});

Vue.use(Vuetify, {
  theme: {
    primary: '#ee44aa',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    blue_darken_1: '#1E88E5',
  },
  options: {
    customProperties: true
  },
  iconfont: 'md',
  lang: {
    locales: { es },
    current: 'es'
  },
});