<template>
  <button class="my-button-class" onclick="window.location.href = '/';"><img src="./901844-200.png"
      alt="icono Pag Principal" width="50" height="55"></button> <v-container>
    <v-dialog v-model="dialogCrearProducte" max-width="300">
      <template v-slot:activator="{ on }">
        <v-btn class="ma-2" @click="dialogCrearProducte = true">Afegir producte</v-btn>
      </template>
      <v-card>
        <v-card-title>Confirmación</v-card-title>
        <v-card-text>
          <v-text-field v-model="nouProducte.nom" label="Nom producte"></v-text-field>
          <v-text-field v-model="nouProducte.descripcio" label="Descripcio"></v-text-field>
          <v-text-field v-model="nouProducte.preu" label="Preu"></v-text-field>
          <v-text-field v-model="nouProducte.foto" label="Imatge del producte" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="afegirProducte">Afegir producte</v-btn>
          <v-btn @click="dialogCrearProducte = false">Cancelar</v-btn>
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
        <v-dialog v-model="dialogEditarProducte" max-width="300">
          <template v-slot:activator="{ on }">
            <v-btn class="ma-2" @click="openEditDialog(producte)">Editar producte</v-btn>
          </template>
          <v-card>
            <v-card-title>Confirmación</v-card-title>
            <v-card-text>
              <v-text-field v-model="producteEditat.nom" label="Nom del producte"></v-text-field>
              <v-text-field v-model="producteEditat.descripcio" label="Descripcio del producte"></v-text-field>
              <v-text-field v-model="producteEditat.preu" label="Preu del producte"></v-text-field>
              <v-text-field v-model="producteEditat.foto" label="Posa la URL de la imatge del producte"
                required></v-text-field>
              <v-switch v-model="producteEditat.modificarFoto" :class="{ 'correcte': producteEditat.modificarFoto }" label="Vols modificar la imatge?"></v-switch>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="editarProducte()">Modificar producte</v-btn>
              <v-btn @click="dialogEditarProducte = false">Cancelar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogEliminarProducte" max-width="300">
          <template v-slot:activator="{ on }">
            <v-btn class="ma-2" @click="dialogEliminarProducte = true">Eliminar</v-btn>
          </template>
          <v-card>
            <v-card-title>Confirmación</v-card-title>
            <v-card-text>
              ¿Estás segur de que vols eliminar el producte?
            </v-card-text>
            <v-card-actions>
              <v-btn @click="eliminarProducte(producte.id_producte)">Sí</v-btn>
              <v-btn @click="dialogEliminarProducte = false">No</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog> 
        <v-btn @click="activarDesactivarProducte(producte.id_producte,producte.estat)">{{ producte.estat ? 'Desactivar' :'Activar'}}</v-btn>
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
        foto: "",
        modificarFoto:false
      },
      dialogCrearProducte: false, // Controla la visibilidad del diálogo de crear producto
      dialogEliminarProducte: false, // Controla la visibilidad del diálogo de eliminar producto
      dialogEditarProducte: false, // Controla la visibilidad del diálogo de editar producto
      rechazarDialog: false, // Controla la visibilidad del diálogo de rechazo
      snackbar: false, // Controla la visibilidad del Snackbar
      snackbarMessage: '', // Mensaje del Snackbar      
    };
  },
  methods: {
    openEditDialog(producte) {
      this.producteEditat = { ...producte };
      this.dialogEditarProducte = true;
    },
    editarProducte() {
      const id = this.producteEditat.id_producte;
      // Lògica per editar el producte
      updateProducte(id, this.producteEditat).then(response => {
        // Actualiza la lista de productos después de editarlo
        getProductos().then(response => {
          this.productes = response;
        });
      });
      this.dialogEditarProducte = false;
    },   
    eliminarProducte(producte) {
      deleteProducte(producte).then(response => {
        // Actualiza la lista de productos después de eliminar
        getProductos().then(response => {
          this.productes = response;
        });
      });
      this.dialogEliminarProducte = false;
      this.snackbarMessage = 'Producte eliminat';
      this.snackbar = true;

    },
    activarDesactivarProducte(id,estat) {
      const nuevoEstat = !estat;//Cambia el estado al contrario de el que estaba
      console.log(nuevoEstat)
      updateEstatProducte(id,nuevoEstat)
    },
    menuAfegirProducte() {
      this.verMenuAfegir = true;

    },
    afegirProducte() {
      addProducte(this.nouProducte).then(response => {
        // Actualiza la lista de productos después de agregar
        getProductos().then(response => {
          this.productes = response;
        });
      });
      this.dialogCrearProducte = false;
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
      this.producteEditat.foto = URL.createObjectURL(blob)
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

<style>
/*Para cambiar el color del boton para selecionar si cambiar imagen o no*/
.correcte {  
  color: green; 
}

</style>
  