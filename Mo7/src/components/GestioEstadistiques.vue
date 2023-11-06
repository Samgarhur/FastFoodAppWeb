<template>
    <v-container>
      <v-row justify="center">
        <v-col v-for="comanda in comandes" :key="comanda.id_comanda" cols="3">
          <v-card :class="posarColorComandes(comanda.tempsRestant)">
            <v-card-title>Comanda {{ comanda.id_comanda }}</v-card-title>
            <v-card-title>Temps: {{ comanda.tempsRestant }} minuts</v-card-title>
  
  
            <v-card-actions>
              <v-btn @click="veureDetalls(comanda.id_comanda)">Veure Detalls</v-btn>
              <v-dialog v-model="dialog" max-width="300">
                <template v-slot:activator="{ on }">
                  <v-btn class="ma-2" @click="dialog = true">Finalitzar comanda</v-btn>
                </template>
                <v-card>
                  <v-card-title>Confirmación</v-card-title>
                  <v-card-text>
                    ¿Estás segur de que la comanda esta finalitzada?
                  </v-card-text>
                  <v-card-actions>
                    <v-btn @click="marcarComandaFinalitzada(comanda.id_comanda,comanda.tempsRestant)">Sí</v-btn>
                    <v-btn @click="dialog = false">No</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card-actions>
  
            <v-expand-transition>
              <v-card v-if="mostrarDetalls && comandaSeleccionada == comanda.id_comanda" class="v-card--reveal"
                style="height: 100%;">
                <v-card-text class="pb-0">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-subtitle>Usuari: {{ comanda.nombre_usuario }}</v-list-item-subtitle><br>
                      Productes ->
                      <v-list-item-subtitle v-for="producto in comanda.productos" :key="producto.nombre_producto">
  
                        {{ producto.nombre_producto }} - Quantitat: {{ producto.quantitat }}
  
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
  
                </v-card-text>
                <v-card-actions class="pt-0">
                  <v-btn variant="text" color="teal-accent-4" @click="mostrarDetalls = false">
                    Tancar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-row>
    </v-container>   
  </template>
  
    
  <script>
  
  import { comandaFinalitzada, getComandasAceptadas } from './communicationsManager';
  import { socket, state } from './socket';
  export default {
    name: 'GestioEstaditiques',
    data() {
      return {
        
      };
    },
    methods: {
      
    },
    created() {
      
    },  
    
  }
  </script>
  
  <style>
  
  </style>
    