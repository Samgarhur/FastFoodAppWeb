<template>
  <v-container>
    <v-card v-for="comanda in comandes" :key="comanda.id" class="mb-3 resum-comanda">
      <v-card-title class="headline">Comanda {{ comanda.id_comanda }} - Usuari: {{ comanda.nombre_usuario }}</v-card-title>
      <v-card-subtitle v-for="producte in comanda.productos" class="subheading">
        {{ producte.nombre_producto }} ,
        Quantitat: {{ producte.quantitat }}
      </v-card-subtitle>

      <v-card-actions>
        <v-dialog v-model="dialog[comanda.id_comanda]" max-width="300">
          <template v-slot:activator="{ on }">
            <v-btn class="ma-2" @click="dialog[comanda.id_comanda] = true">Aceptar</v-btn>
          </template>
          <v-card>
            <v-card-title>Confirmación</v-card-title>
            <v-card-text>
              ¿Estás segur de que vols aceptar aquesta comanda?
            </v-card-text>
            <v-card-actions>
              <v-btn @click="acceptarComanda(comanda.id_comanda)">Sí</v-btn>
              <v-btn @click="dialog = false">No</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="rechazarDialog[comanda.id_comanda]" max-width="300">
          <template v-slot:activator="{ on }">
            <v-btn class="ma-2" @click="rechazarDialog[comanda.id_comanda] = true">Rebutjar</v-btn>
          </template>
          <v-card>
            <v-card-title>Confirmación</v-card-title>
            <v-card-text>
              ¿Estás segur de que vols rebutjar aquesta comanda?
            </v-card-text>
            <v-card-actions>
              <v-btn @click="rebutjarComanda(comanda.id_comanda)">Sí</v-btn>
              <v-btn @click="rechazarDialog = false">No</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-actions>
    </v-card>
  </v-container>
  <v-snackbar v-model="snackbar" :timeout="2000">
    {{ snackbarMessage }}
  </v-snackbar>
</template>
  
<script>

import { getComandas } from './communicationsManager';
import { socket, state } from './socket';
export default {
  name: 'RecepcioComandes',
  data() {
    return {
      comandes: [], // Aquí hauries de carregar les comandes des de la base de dades o API
      dialog: {}, // Controla la visibilidad del diálogo de aceptación
      rechazarDialog: {}, // Controla la visibilidad del diálogo de rechazo
      estatComandas: "",
      snackbar: false, // Controla la visibilidad del Snackbar
      snackbarMessage: '', // Mensaje del Snackbar
    };
  },
  methods: {
    acceptarComanda(id) {
      this.estatComandas = "aceptada";
      console.log(id)
      socket.emit("comandaAceptada", id, this.estatComandas);
      this.dialog[id] = false; // Cierra el diálogo después de la confirmación
      this.snackbarMessage = 'Comanda aceptada';
      this.snackbar = true; // Muestra el Snackbar
      socket.emit('solicitarComandasIniciales');
    },
    rebutjarComanda(id) {
      this.estatComandas = "rebutjada";
      //estatComanda(id, this.estatComandas)
      socket.emit("comandaRebutjada", id, this.estatComandas);
      this.rechazarDialog[id] = false; // Cierra el diálogo de rechazo después de la confirmación
      this.snackbarMessage = 'Comanda rebutjada';
      this.snackbar = true; // Muestra el Snackbar
      socket.emit('solicitarComandasIniciales');
    },

  },
  created() {

    socket.on('getComandas', (comandas) => {
      const comandesJson = JSON.parse(comandas);
      this.comandes = comandesJson;

    });
    // Solicitar comandas iniciales
    socket.emit('solicitarComandasIniciales');
    
    /*getComandas().then(response => {
      this.comandes = response;
    });*/
  },
}
</script>

<style scoped>
/* Estilos específicos para la segunda página */
.resum-comanda {
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.headline {
  font-size: 20px;
  color: #333;
}

.subheading {
  font-size: 14px;
  color: #777;
}

.v-card-title {
  font-size: 18px;
  color: #333;
}

.v-card-subtitle {
  font-size: 14px;
  color: #777;
}

.v-btn.ma-2 {
  margin: 0.5rem;
}

.v-divider {
  margin: 1rem 0;
}

.v-row {
  justify-content: center;
}

.v-col {
  text-align: center;
}

.v-snackbar {
  background-color: #66B3FF;
  color: #fff;
}
</style>
