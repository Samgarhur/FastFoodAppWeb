<template>
  <v-container>
    <v-card v-for="comanda in comandes" :key="comanda.id">
      <v-card-title>{{ comanda.id_comanda}}</v-card-title>
      <v-card-subtitle>{{ comanda.info }}</v-card-subtitle>

      <v-card-actions>
        <v-dialog v-model="dialog" max-width="300">
          <template v-slot:activator="{ on }">
            <v-btn class="ma-2"  @click="dialog = true">Aceptar</v-btn>
          </template>
          <v-card>
            <v-card-title>Confirmación</v-card-title>
            <v-card-text>
              ¿Estás seguro de que deseas aceptar esta comanda?
            </v-card-text>
            <v-card-actions>
              <v-btn @click="acceptarComanda(comanda.id)">Sí</v-btn>
              <v-btn @click="dialog = false">No</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="rechazarDialog" max-width="300">
          <template v-slot:activator="{ on }">
            <v-btn class="ma-2" @click="rechazarDialog = true">Rechazar</v-btn>
          </template>
          <v-card>
            <v-card-title>Confirmación</v-card-title>
            <v-card-text>
              ¿Estás seguro de que deseas rechazar esta comanda?
            </v-card-text>
            <v-card-actions>
              <v-btn @click="rebutjarComanda(comanda.id)">Sí</v-btn>
              <v-btn @click="rechazarDialog = false">No</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
  
<script>

import { getComandas, comandaAceptada } from './communicationsManager';
export default {
  name: 'RecepcioComandes',
  data() {
    return {
      comandes: [{
        id: 1,
        info: "PATATAS, ANVORGESA,COLACOCA"
      },
      {
        id: 2,
        info: "PATATAS, AMBORGUSA,FANTA"
      }], // Aquí hauries de carregar les comandes des de la base de dades o API
      dialog: false, // Controla la visibilidad del diálogo de aceptación
      rechazarDialog: false, // Controla la visibilidad del diálogo de rechazo
      estatComandas: null
    };
  },
  methods: {
    acceptarComanda(id) {
      this.estatComandas = true;
      comandaAceptada(id)
      this.dialog = false; // Cierra el diálogo después de la confirmación
    },
    rebutjarComanda(id) {
      this.estatComandas = false;
      estatComandas(id)
      this.rechazarDialog = false; // Cierra el diálogo de rechazo después de la confirmación
    },

  },
  created() {
    //Coge todas las comandas del servidor
    getComandas(this);
  },
}
</script>
  