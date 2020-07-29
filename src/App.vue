<template>
  <v-app>
    <div id="printSection">
    </div>
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </v-app>
</template>
<script>

  import { mapActions, mapState } from 'vuex';
  export default {
    name: 'App',
    data () {
      return {
        //
      }
    },
    created(){
      this.init();
    },
    methods:{
      ...mapActions(['getCurrentUser']),
      init(){
        this.getCurrentUser();
        this.$http.defaults.headers.common['Authorization'] = this.token;
      }
    },
    computed:{
      ...mapState(['token']),
    }
  }
</script>
