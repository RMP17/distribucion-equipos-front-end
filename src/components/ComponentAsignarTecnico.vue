<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="info" flat class="square" v-on="on" title="Nuevo equipo" >
          <v-icon>add_to_queue</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="grey lighten-2">

          <v-layout align-center justify-space-between fill-height>
            <span class=title>Nuevo Equipo</span>
            <v-btn color="secondary" flat
                   @click="dialog=!dialog"
                   class="square">
              <v-icon>close</v-icon>
            </v-btn>
          </v-layout>
        </v-card-title>
        <v-card-text>
          <v-container >
            <v-form ref="form" v-model="valid" lazy-validation
            >
              <v-text-field
                      color="blue darken-4"
                      background-color="blue lighten-5"
                      box
                      :rules="rules.descripcion"
                      v-model="equipo.descripcion"
                      label="Descripción"
                      required
              ></v-text-field>
              <v-select :items="tipos"
                        v-model="equipo.tipo"
                        background-color="blue lighten-5"
                        color="blue darken-4"
                        item-text="state"
                        item-value="abbr"
                        :rules="rules.tipo"
                        box
                        label="Extensión"
              ></v-select>
              <v-text-field
                      color="blue darken-4"
                      background-color="blue lighten-5"
                      :rules="rules.codigo"
                      v-model="equipo.codigo"
                      label="Código"
                      box
                      required
              ></v-text-field>
              <v-text-field
                      color="blue darken-4"
                      background-color="blue lighten-5"
                      :rules="rules.modelo"
                      v-model="equipo.modelo"
                      label="Modelo"
                      box
                      required
              ></v-text-field>
              <v-text-field
                      color="blue darken-4"
                      background-color="blue lighten-5"
                      v-model="equipo.nro_serie"
                      :rules="rules.nro_serie"
                      label="Número de serie"
                      box
                      required
              ></v-text-field>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" outline @click="dialog = false">Cerrar</v-btn>
          <v-btn color="info" depressed class="text" @click="submit">Enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
    import Equipo from '../models/Equipo'
    import axios from 'axios';

    export default {
    data: () => ({
        // view
        dialog: false,
        valid: true,
        tipos: [
            {state: 'Equipo', abbr: 'e'},
            {state: 'Otro', abbr: 'o'},
        ],
        rules: {
            descripcion: [
                v => !!v || 'Descripción es requerido',
                /*v => (v && v.length <= 10) || 'Name must be less than 10 characters'*/
            ],
           /* tipo_equipo: [
                v => !!v || 'Tipo de equipo es requerido',
                /!*v => (v && v.length <= 10) || 'Name must be less than 10 characters'*!/
            ],*/
            codigo: [
                v => !!v || 'Código es requerido',
                // v => /.+@.+/.test(v) || 'E-mail must be valid'
            ],
            tipo: [
                v => !!v || 'Tipo es requerido',
                // v => /.+@.+/.test(v) || 'E-mail must be valid'
            ],
            modelo: [
                v => !!v || 'Modelo es requerido',
                // v => /.+@.+/.test(v) || 'E-mail must be valid'
            ],
            nro_serie: [
                v => !!v || 'Número de serie es requerido',
                // v => /.+@.+/.test(v) || 'E-mail must be valid'
            ],
        },
        // model
        equipo: new Equipo(),
    }),
    methods:{
        submit:function () {
            if (this.$refs.form.validate()) {
                axios.post(this.$urlApi.resourcesEquipo,
                this.equipo
                ).then( response => {
                    this.equipo = new Equipo();
                    this.$toastr('success', '','TAREA REALIZADA CON ÉXITO');
                    // this.dialog=false;
                    this.valid=true;
                    this.$emit('register-success');
                }).catch( errors => {
                    this.$notifyErrors(errors);
                });
            }
        },
    }
  }
</script>
