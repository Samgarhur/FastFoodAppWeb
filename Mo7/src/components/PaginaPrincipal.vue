<template>
    <v-container>
      <v-btn @click="mostrarRecepcioComandes">Recepció de Comandes</v-btn>
      <v-btn @click="mostrarPreparacioComandes">Preparació de Comandes</v-btn>
      <v-btn @click="mostrarResumComandes">Resum de Comandes</v-btn>
      <v-btn @click="mostrarGestioProductes">Gestió de Productes</v-btn>
  
      <RecepcioComandes v-if="mostrarRecepcio" />
      <PreparacioComandes v-if="mostrarPreparacio" />
      <ResumComandes v-if="mostrarResum" />
      <GestioProductes v-if="mostrarGestio" />
    </v-container>
  </template>
  
  <script>
  import RecepcioComandes from './RecepcioComandes.vue';
  import PreparacioComandes from './PreparacioComandes.vue';
  import ResumComandes from './ResumComandes.vue';
  import GestioProductes from './GestioProductes.vue';
  
  export default {
    name: 'PaginaPrincipal',
    components: {
      RecepcioComandes,
      PreparacioComandes,
      ResumComandes,
      GestioProductes
    },
    data() {
      return {
        mostrarRecepcio: false,
        mostrarPreparacio: false,
        mostrarResum: false,
        mostrarGestio: false
      };
    },
    methods: {
      mostrarRecepcioComandes() {
        this.mostrarRecepcio = true;
        this.mostrarPreparacio = false;
        this.mostrarResum = false;
        this.mostrarGestio = false;
      },
      mostrarPreparacioComandes() {
        this.mostrarRecepcio = false;
        this.mostrarPreparacio = true;
        this.mostrarResum = false;
        this.mostrarGestio = false;
      },
      mostrarResumComandes() {
        this.mostrarRecepcio = false;
        this.mostrarPreparacio = false;
        this.mostrarResum = true;
        this.mostrarGestio = false;
      },
      mostrarGestioProductes() {
        this.mostrarRecepcio = false;
        this.mostrarPreparacio = false;
        this.mostrarResum = false;
        this.mostrarGestio = true;
      }
    }
  }
  </script>
  