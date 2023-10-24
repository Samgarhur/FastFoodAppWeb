<template>
  <v-container>
    <v-card v-for="comanda in comandes" :key="comanda.id">
      <v-card-title>{{ comanda.id }}</v-card-title>
      <v-card-subtitle>{{ comanda.info }}</v-card-subtitle>
      <v-card-actions>
        <v-snackbar  @click="acceptarComanda(comanda.id)" :timeout="2000">
          <template v-slot:activator="{ props }">
            <v-btn class="ma-2" v-bind="props">Aceptar</v-btn>
          </template>
          Comanda aceptada
        </v-snackbar>

        <v-btn @click="acceptarComanda(comanda.id)">Acceptar</v-btn>
        <v-btn @click="rebutjarComanda(comanda.id)">Rebutjar</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
  
<script>

import { getComandas, estatComandas } from './communicationsManager';
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
      estatComandas: null
    };
  },
  methods: {
    acceptarComanda(id) {
      this.estatComandas = true;
      estatComandas(id, this.estatComandas)
    },
    rebutjarComanda(id) {
      this.estatComandas = false;
      estatComandas(id, this.estatComandas)
    },

  },
  created() {
    //Coge todas las comandas del servidor
    getComandas();
  },
}
</script>
  