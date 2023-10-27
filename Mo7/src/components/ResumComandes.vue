<template>
  <v-container>
    <v-card v-for="comanda in comandes" :key="comanda.id">
      <v-card-title>{{ comanda.id }}</v-card-title>
      <v-card-subtitle>{{ comanda.info }}</v-card-subtitle>
      <v-dialog v-model="dialog" max-width="300">
        <template v-slot:activator="{ on }">
          <v-btn class="ma-2" @click="dialog = true">Recollir comanda</v-btn>
        </template>
        <v-card>
          <v-card-title>Confirmación</v-card-title>
          <v-card-text>
            ¿Estás segur de que han recollit la comanda?
          </v-card-text>
          <v-card-actions>
            <v-btn @click="recollirComanda(comanda.id)">Sí</v-btn>
            <v-btn @click="dialog = false">No</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-card-actions>
        <v-btn @click="recollirComanda(comanda.id)">Recollir Comanda</v-btn>
      </v-card-actions>
    </v-card>
    <v-divider></v-divider>
    <v-row>
      <v-col>
        <p>Recaudació Total: {{ recaudacioTotal }}</p>
        <p>Temps Mitjà de Preparació: {{ tempsMitjaPreparacio }}</p>
      </v-col>
    </v-row>
  </v-container>
  <v-snackbar v-model="snackbar" :timeout="2000">
    {{ snackbarMessage }}
  </v-snackbar>
</template>
  
<script>
import { getComandasFinalizadas, comandaRecogida } from './communicationsManager';
export default {
  name: 'ResumComandes',
  data() {
    return {
      comandes: [{
        id: 1,
        info: "PATATAS, ANVORGESA,COLACOCA",
        temps: "10"
      },
      {
        id: 2,
        info: "PATATAS, AMBORGUSA,FANTA",
        temps: "20"
      },
      {
        id: 3,
        info: "PATATAS, AMBORGUSA,FANTA",
        temps: "02"
      },
      {
        id: 4,
        info: "PATATAS, AMBORGUSA,FANTA",
        temps: "05"
      },
      {
        id: 5,
        info: "PATATAS, AMBORGUSA,FANTA",
        temps: "1"
      },
      {
        id: 6,
        info: "PATATAS, AMBORGUSA,FANTA",
        temps: "2"
      },
      {
        id: 7,
        info: "PATATAS, AMBORGUSA,FANTA",
        temps: "55"
      },
      {
        id: 8,
        info: "PATATAS, AMBORGUSA,FANTA",
        temps: "32"
      }], // Aquí hauries de carregar les últimes comandes preparades des de la base de dades o API
      recollida: "",

      dialog: false, // Controla la visibilidad del diálogo de aceptación
      rechazarDialog: false, // Controla la visibilidad del diálogo de rechazo     
      snackbar: false, // Controla la visibilidad del Snackbar
      snackbarMessage: '', // Mensaje del Snackbar
      recaudacioTotal: 0, // Calcular la recaudació total basada en les comandes entregades
      tempsMitjaPreparacio: 0 // Calcular el temps mitjà de preparació de les comandes
    };
  },
  methods: {
    recollirComanda(id,) {
      this.recollida = "recollida"
      comandaRecogida(id, this.recollida);
      this.dialog = false; // Cierra el diálogo después de la confirmación
      this.snackbarMessage = 'Comanda recollida';
      this.snackbar = true;
    }
  },
  created() {
    //Coge todas las comandas ya finalizadas del servidor
    getComandasFinalizadas();
  },
}
</script>
  