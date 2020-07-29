<template>
    <v-container fluid fill-height>
      <v-flex md4  offset-md4 >
        <v-card class="elevation-12">
          <v-toolbar dark  color="info" dense flat>
            <v-toolbar-title>Login </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent>
              <v-text-field
                      label="Nombre de usuario"
                      v-model="credentials.usuario"
                      color="blue_darken_1"
                      box
                      required
              ></v-text-field>
              <v-text-field
                      label="Contraseña"
                      v-model="credentials.contrasenia"
                      autocomplete="false"
                      color="blue_darken_1"
                      box
                      :append-icon="show1 ? 'visibility_off' : 'visibility'"
                      :type="show1 ? 'text' : 'password'"
                      required
                      @click:append="show1 = !show1"
              ></v-text-field>
              <v-btn block color="blue_darken_1" dark @click="authenticate" type="submit">Iniciar sesión</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-container>
</template>

<script>
  import { mapMutations } from 'vuex';
  import router from '../router'

  export default {
    data () {
      return {
        show1: false,
        credentials:{
          contrasenia: '',
          usuario: '',
        },
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
          emailMatch: () => ('The email and password you entered don\'t match')
        }
      }
    },
    methods: {
      ...mapMutations([
        'storeAuthData', // map `this.increment()` to `this.$store.commit('increment')`
      ]),
      authenticate: function () {
        this.$http.post(this.$urlApi.login, this.credentials
        ).then(response=>{
          this.storeAuthData(response.data);
          this.$http.defaults.headers.common['Authorization'] = response.data.token;
          if (response.data.nivel_acceso===2){
            router.replace('/inicio');
          }else{
            router.replace('/inicio');
          }
        }, err=>{
          alert('Verifique que los datos sean correctos');
        });
      },
    }
  }
</script>
