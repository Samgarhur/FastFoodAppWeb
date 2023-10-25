<template>
    <v-container>
      <v-btn @click="mostrarRecepcioComandes">Recepció de Comandes</v-btn>
      <v-btn @click="mostrarPreparacioComandes">Preparació de Comandes</v-btn>
      <v-btn @click="mostrarResumComandes">Resum de Comandes</v-btn>  
  
      <RecepcioComandes v-if="mostrarRecepcio" />
      <PreparacioComandes v-if="mostrarPreparacio" />
      <ResumComandes v-if="mostrarResum" />   
    </v-container>
  </template>
  
  <script>
  import RecepcioComandes from './RecepcioComandes.vue';
  import PreparacioComandes from './PreparacioComandes.vue';
  import ResumComandes from './ResumComandes.vue'; 
  
  export default {
    name: 'PaginaPrincipal',
    components: {
      RecepcioComandes,
      PreparacioComandes,
      ResumComandes   
    },
    data() {
      return {
        mostrarRecepcio: false,
        mostrarPreparacio: false,
        mostrarResum: false     
      };
    },
    methods: {
      mostrarRecepcioComandes() {
        this.mostrarRecepcio = true;
        this.mostrarPreparacio = false;
        this.mostrarResum = false;       
      },
      mostrarPreparacioComandes() {
        this.mostrarRecepcio = false;
        this.mostrarPreparacio = true;
        this.mostrarResum = false;        
      },
      mostrarResumComandes() {
        this.mostrarRecepcio = false;
        this.mostrarPreparacio = false;
        this.mostrarResum = true;        
      }      
    }
  }
  </script>
  