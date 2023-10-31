<template>
  <v-container>
    <v-card v-for="comanda in comandes" :key="comanda.id">
      <v-card-title>Comanda numero {{ comanda.id_comanda }}</v-card-title>
      <v-card-subtitle v-for="producte in comanda.productos">
        {{ producte.nombre_producto }} ,
        Quantitat: {{ producte.quantitat }}
      </v-card-subtitle>

      <v-card-actions>
        <v-dialog v-model="dialog" max-width="300">
          <template v-slot:activator="{ on }">
            <v-btn class="ma-2" @click="dialog = true">Aceptar</v-btn>
          </template>
          <v-card>
            <v-card-title>Confirmación</v-card-title>
            <v-card-text>
              ¿Estás segur de que vols aceptar aquesta comanda?
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
              ¿Estás segur de que vols rebutjar aquesta comanda?
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
  <v-snackbar v-model="snackbar" :timeout="2000">
    {{ snackbarMessage }}
  </v-snackbar>
</template>
  
<script>

import { getComandas } from './communicationsManager';
export default {
  name: 'RecepcioComandes',
  data() {
    return {
      comandes: [], // Aquí hauries de carregar les comandes des de la base de dades o API
      dialog: false, // Controla la visibilidad del diálogo de aceptación
      rechazarDialog: false, // Controla la visibilidad del diálogo de rechazo
      estatComandas: "",
      snackbar: false, // Controla la visibilidad del Snackbar
      snackbarMessage: '', // Mensaje del Snackbar
    };
  },
  methods: {
    acceptarComanda(id) {
      this.estatComandas = "aceptada";
      //estatComanda(id, this.estatComandas)
      this.dialog = false; // Cierra el diálogo después de la confirmación
      this.snackbarMessage = 'Comanda aceptada';
      this.snackbar = true; // Muestra el Snackbar
    },
    rebutjarComanda(id) {
      this.estatComandas = "rebutjada";
      //estatComanda(id, this.estatComandas)
      this.rechazarDialog = false; // Cierra el diálogo de rechazo después de la confirmación
      this.snackbarMessage = 'Comanda rebutjada';
      this.snackbar = true; // Muestra el Snackbar
    },

  },
  created() {
    getComandas().then(response => {
      this.comandes = response;
    });
  },
}
</script>
  