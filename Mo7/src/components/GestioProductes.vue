<template>
  <button class="my-button-class" onclick="window.location.href = '/';"><img src="./901844-200.png"
      alt="icono Pag Principal" width="50" height="55"></button> <v-container>
    <v-dialog v-model="dialog" max-width="300">
      <template v-slot:activator="{ on }">
        <v-btn class="ma-2" @click="dialog = true">Afegir producte</v-btn>
      </template>
      <v-card>
        <v-card-title>Confirmación</v-card-title>
        <v-card-text>
          <v-text-field v-model="nouProducte.nom" label="Nom del producte"></v-text-field>
          <v-text-field v-model="nouProducte.descripcio" label="Descripcio del producte"></v-text-field>
          <v-text-field v-model="nouProducte.preu" label="preu del producte"></v-text-field>
          <v-text-field v-model="nouProducte.foto" label="Posa la URL de la imatge del producte" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="afegirProducte">Agegir producte</v-btn>
          <v-btn @click="dialog = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  <v-container>
    <v-card v-for="producte in productes">
      <v-card-title>{{ producte.nom }}</v-card-title>
      <v-card-subtitle>Descripcio: {{ producte.descripcio }}</v-card-subtitle>
      <v-card-subtitle>Preu: {{ producte.preu }}</v-card-subtitle>      
      <v-img :src="decodeBase64Image(producte.foto)" height="150" width="150" cover></v-img>
      <v-card-actions>
        <v-btn @click="editarProducte(producte.id_producte)">Editar</v-btn>
        <v-btn @click="eliminarProducte(producte.id_producte)">Eliminar</v-btn>
        <v-btn @click="activarDesactivarProducte(producte.id_producte)">{{ producte.estat ? 'Desactivar' : 'Activar' }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
  <v-snackbar v-model="snackbar" :timeout="2000">
    {{ snackbarMessage }}
  </v-snackbar>
</template>
  
<script>
import { getProductos, deleteProducte, addProducte, updateProducte, updateEstatProducte } from './communicationsManager';
export default {
  data() {
    return {
      verMenuAfegir: false,
      productes: [], // Aquí hauries de carregar els productes des de la base de dades o API
      nouProducte: {
        nom: "",
        descripcio: "",
        preu: 0,
        estat: 1,
        foto: ""
      },
      producteEditat: {
        nom: "",
        descripcio: "",
        preu: 0,
        estat: 1,
        foto: ""
      },
      dialog: false, // Controla la visibilidad del diálogo de aceptación
      rechazarDialog: false, // Controla la visibilidad del diálogo de rechazo
      snackbar: false, // Controla la visibilidad del Snackbar
      snackbarMessage: '', // Mensaje del Snackbar      
    };
  },
  methods: {
    editarProducte(producte) {
      // Lògica per editar el producte
    },
    eliminarProducte(producte) {
      deleteProducte(producte);
    },
    activarDesactivarProducte(producte) {
      // Lògica per activar o desactivar el producte
    },
    menuAfegirProducte() {
      this.verMenuAfegir = true;

    },
    afegirProducte() {
      addProducte(this.nouProducte)
      this.dialog = false;
      this.snackbarMessage = 'Producte Afegit';
      this.snackbar = true;

    },
    //Funcion para codificar las imagenes del servidor de base64 a una url
    decodeBase64Image(base64String) {
      const binaryString = atob(base64String);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "image/jpeg" }); // Ajusta el tipo MIME según tu imagen
      return URL.createObjectURL(blob);
    }
  },
  created() {
    getProductos().then(response => {
      this.productes = response;
    });
  },
}
</script>

<style></style>
  