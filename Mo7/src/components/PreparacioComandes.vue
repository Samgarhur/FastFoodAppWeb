<template>
    <v-container>
      <v-card v-for="comanda in comandes" :key="comanda.id">
        <v-card-title>{{ comanda.id }}</v-card-title>
        <v-card-subtitle>{{ comanda.info }}</v-card-subtitle>
        <v-card-actions>
          <v-btn @click="veureDetalls(comanda)">Veure Detalls</v-btn>
          <v-btn @click="marcarComandaFinalitzada(comanda)">Marcar com a Finalitzada</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'PreparacioComandes',
    data() {
      return {
        comandes: [] // Aquí hauries de carregar les comandes en preparació des de la base de dades o API
      };
    },
    methods: {
      veureDetalls(comanda) {
        // Lògica per veure els detalls de la comanda
      },
      marcarComandaFinalitzada(comanda) {
        // Lògica per marcar la comanda com a finalitzada
      }
    }
  }
  </script>
  