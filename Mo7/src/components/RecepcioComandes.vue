<template>
    <v-container>
      <v-card v-for="comanda in comandes" :key="comanda.id">
        <v-card-title>{{ comanda.id }}</v-card-title>
        <v-card-subtitle>{{ comanda.info }}</v-card-subtitle>
        <v-card-actions>
          <v-btn @click="acceptarComanda(comanda)">Acceptar</v-btn>
          <v-btn @click="rebutjarComanda(comanda)">Rebutjar</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'RecepcioComandes',
    data() {
      return {
        comandes: [] // Aquí hauries de carregar les comandes des de la base de dades o API
      };
    },
    methods: {
      acceptarComanda(comanda) {
        // Lògica per acceptar la comanda
      },
      rebutjarComanda(comanda) {
        // Lògica per rebutjar la comanda
      }
    }
  }
  </script>
  