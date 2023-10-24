<template>
  <v-container>
    <v-card v-for="comanda in comandes" :key="comanda.id">
      <v-card-title>{{ comanda.id }}</v-card-title>
      <v-card-subtitle>{{ comanda.info }}</v-card-subtitle>
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
</template>
  
<script>
import { getComandasFinalizadas,comandaRecogida } from './communicationsManager';
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
      recaudacioTotal: 0, // Calcular la recaudació total basada en les comandes entregades
      tempsMitjaPreparacio: 0 // Calcular el temps mitjà de preparació de les comandes
    };
  },
  methods: {
    recollirComanda(id) {
      comandaRecogida(id);
    }
  },
  created() {
    //Coge todas las comandas ya finalizadas del servidor
    getComandasFinalizadas();
  },
}
</script>
  