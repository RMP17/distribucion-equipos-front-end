<template>
  <v-app>
    <div id="printSection">
    </div>
    <div id="main-container">
      <span class="font-weight-bold"></span>
      <v-toolbar app dense>
        <v-toolbar-title class="headline text-uppercase">
          <!--<span>Vuetify</span>
          <span class="font-weight-light">MATERIAL DESIGN</span>-->
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon>mdi_anchor</v-icon>
        <v-toolbar-items>
          <!--<v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" flat>
                <v-icon left>people</v-icon>
                Personal
              </v-btn>
            </template>
            <v-list >
              <v-list-tile to="/personal/tecnicos" active-class="active-custom">
                <v-list-tile-title
                >Tecnicos</v-list-tile-title>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-title>Notarios</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>-->

          <v-btn to="/personal" flat>
            <v-icon left>people</v-icon>
            Personal
          </v-btn>
          <v-btn to="/equipos" flat>
            <v-icon left>laptop_windows</v-icon>
            Equipos
          </v-btn>
          <v-btn to="/pro-ele-ref" flat title="Proceso Electoral o Referendo">
            <v-icon left>how_to_vote</v-icon>
            Pro. Ele. Ref.
          </v-btn>
          <v-btn to="/asignaciones" flat>
            <v-icon left>assignment_ind</v-icon>
            Asignaciones
          </v-btn>
          <!--<v-btn to="/" flat>
            <v-icon left>laptop_windows</v-icon>
            Equipos
          </v-btn>-->
          <!--<v-btn flat>Link Two</v-btn>
          <v-btn flat>Link Three</v-btn>-->
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <router-view/>
      </v-content>
    </div>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      //
    }
  }
}
</script>