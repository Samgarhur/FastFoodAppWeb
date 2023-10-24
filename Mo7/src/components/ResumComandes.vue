<template>
    <v-container>
      <v-card v-for="comanda in comandes" :key="comanda.id">
        <v-card-title>{{ comanda.id }}</v-card-title>
        <v-card-subtitle>{{ comanda.info }}</v-card-subtitle>
        <v-card-actions>
          <v-btn @click="recollirComanda(comanda)">Recollir Comanda</v-btn>
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
  export default {
    name: 'ResumComandes',
    data() {
      return {
        comandes: [], // Aquí hauries de carregar les últimes comandes preparades des de la base de dades o API
        recaudacioTotal: 0, // Calcular la recaudació total basada en les comandes entregades
        tempsMitjaPreparacio: 0 // Calcular el temps mitjà de preparació de les comandes
      };
    },
    methods: {
      recollirComanda(comanda) {
        // Lògica per recollir la comanda
      }
    }
  }
  </script>
  