<template>
  <button class="my-button-class" onclick="window.location.href = '/';"><img src="./901844-200.png"
      alt="icono Pag Principal" width="50" height="55"></button>

  <v-container>
    <v-card v-for="producte in productes" :key="producte.id">
      <v-card-title>{{ producte.nom }}</v-card-title>
      <v-card-subtitle>{{ producte.descripcio }}</v-card-subtitle>
      <v-card-subtitle>{{ producte.preu }}</v-card-subtitle>
      <v-card-actions>
        <v-btn @click="editarProducte(producte)">Editar</v-btn>
        <v-btn @click="eliminarProducte(producte)">Eliminar</v-btn>
        <v-btn @click="activarDesactivarProducte(producte)">{{ producte.actiu ? 'Desactivar' : 'Activar' }}</v-btn>
      </v-card-actions>
    </v-card>
    <v-btn @click="afegirProducte">Afegir Producte</v-btn>
  </v-container>
</template>
  
<script>
import { getProductes, deleteProducte,addProducte,updateProducte } from './communicationsManager';
export default {
  data() {
    return {
      productes: [] // Aquí hauries de carregar els productes des de la base de dades o API
    };
  },
  methods: {
    editarProducte(producte) {
      // Lògica per editar el producte
    },
    eliminarProducte(producte) {
      // Lògica per eliminar el producte
    },
    activarDesactivarProducte(producte) {
      // Lògica per activar o desactivar el producte
    },
    afegirProducte() {
      // Lògica per afegir un nou producte
    }
  }, 
  created() {
    getProductes().then(response => {
      this.productes = response;
    });
  },
}
</script>
  