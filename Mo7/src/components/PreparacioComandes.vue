<template>
  <v-container>
    <v-row justify="center">
      <v-col v-for="comanda in comandes" :key="comanda.id" cols="3">
        <v-card :class="posarColorComandes(comanda.temps)">
          <v-card-title>Comanda numero {{ comanda.id }}</v-card-title>
          <v-card-title>Temps: {{ comanda.temps }} minuts</v-card-title>
          <v-card-subtitle>{{ comanda.info }}</v-card-subtitle>


          <v-card-actions>
            <v-btn @click="veureDetalls(comanda.id)">Veure Detalls</v-btn>
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
                  <v-btn @click=" marcarComandaFinalitzada(comanda.id)">Sí</v-btn>
                  <v-btn @click="dialog = false">No</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-actions>
          <v-expand-transition>
            <v-card v-if="mostrarDetalls && comandaSeleccionada == comanda.id" class="v-card--reveal"
              style="height: 100%;">
              <v-card-text class="pb-0">
                <v-list-item>Temps comanda: {{ comanda.temps }}</v-list-item>
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
  <v-snackbar v-model="snackbar" :timeout="2000">
    {{ snackbarMessage }}
  </v-snackbar>
</template>
  
<script>

import { comandaFinalitzada, getComandasAceptadas } from './communicationsManager';
import { socket, state } from './socket';
export default {
  name: 'PreparacioComandes',
  data() {
    return {
      mostrarDetalls: false,
      comandaSeleccionada: null,
      finalitzada: "",
      comandes:[],
      comandesPrueba: [{
        id: 1,
        info: "PATATAS, ANVORGESA,COLACOCA",
        temps: "10"
      },
      {
        id: 2,
        info: "PATATAS, AMBORGUSA,FANTA",
        temps: "20"
      },
      {
        id: 3,
        info: "PATATAS, AMBORGUSA,FANTA",
        temps: "02"
      },
      {
        id: 4,
        info: "PATATAS, AMBORGUSA,FANTA",
        temps: "05"
      },
      {
        id: 5,
        info: "PATATAS, AMBORGUSA,FANTA",
        temps: "1"
      },
      {
        id: 6,
        info: "PATATAS, AMBORGUSA,FANTA",
        temps: "2"
      },
      {
        id: 7,
        info: "PATATAS, AMBORGUSA,FANTA",
        temps: "55"
      },
      {
        id: 8,
        info: "PATATAS, AMBORGUSA,FANTA",
        temps: "32"
      }],
      dialog: false, // Controla la visibilidad del diálogo de aceptación
      rechazarDialog: false, // Controla la visibilidad del diálogo de rechazo
      snackbar: false, // Controla la visibilidad del Snackbar
      snackbarMessage: '', // Mensaje del Snackbar
    };
  },
  methods: {
    veureDetalls(id) {
      this.mostrarDetalls = true;
      this.comandaSeleccionada = id;
    },
    marcarComandaFinalitzada(id) {
      // Lògica per marcar la comanda com a finalitzada     
      this.finalitzada = "finalitzada";
      comandaFinalitzada(id, this.finalitzada);
      this.dialog = false; // Cierra el diálogo después de la confirmación
      this.snackbarMessage = 'Comanda finalitzada';
      this.snackbar = true;

    },
    //Funcion para cambiar el color de los pedidos en funcion del tiempo
    posarColorComandes(temps) {
      if (temps >= 20) {
        return 'comanda-roja';
      }
      else if (temps >= 10) {
        return 'comanda-amarilla';
      }
      else {
        return 'comanda-verde';
      }
    }

  },
  created() {
    socket.on('getComandasAceptadas', (comandas) => {
      const comandesJson = JSON.parse(comandas);
      this.comandes = comandesJson;

    });
    // Solicitar comandas iniciales
    socket.emit('solicitarComandasAceptadasIniciales');
    
    /*
    //Coge las comandas que han sido aceptadas del servidor
    getComandasAceptadas()*/

    // Ordena las comandas por el tiempo en que entran
    this.comandes.sort((a, b) => b.temps - a.temps);
  },
}
</script>

<style>
.comanda-roja {
  background-color: red;
  color: white;
  border: 1px solid black;
  margin-bottom: 5px;
  margin-right: 5px;
}

.comanda-amarilla {
  background-color: yellow;
  color: black;
  border: 1px solid black;
  margin-bottom: 5px;
  margin-right: 5px;
}

.comanda-verde {
  background-color: green;
  color: white;
  border: 1px solid black;
  margin-bottom: 5px;
  margin-right: 5px;
}
</style>
  