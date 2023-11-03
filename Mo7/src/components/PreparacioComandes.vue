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
                  <v-btn @click="marcarComandaFinalitzada(comanda.id_comanda)">Sí</v-btn>
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
      comandes: [],
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
      //Envia el estado de la comanda finalizada por socket
      socket.emit("comandaFinalitzada", id, this.finalitzada);

      //comandaFinalitzada(id, this.finalitzada);
      this.dialog = false; // Cierra el diálogo después de la confirmación
      this.snackbarMessage = 'Comanda finalitzada';
      this.snackbar = true;
      socket.emit('solicitarComandasAceptadasIniciales');

    },

    // Función para calcular el tiempo restante de cada comanda en minutos
    calcularTempsRestant() {
      const now = new Date(); // Hora actual
      for (const comanda of this.comandes) {
        const dataComanda = new Date(comanda.data_comanda); // Hora de la comanda
        const diffMillis = now - dataComanda; // Diferencia en milisegundos
        const diffMinutes = Math.floor(diffMillis / (1000 * 60)); // Diferencia en minutos
        comanda.tempsRestant = diffMinutes;
      }
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
      console.log(comandesJson)

      // Iniciar el temporizador para calcular el tiempo restante
      this.calcularTempsRestant();
      this.interval = setInterval(this.calcularTempsRestant, 1000); // Actualizar cada segundo

    });
    // Solicitar comandas iniciales
    socket.emit('solicitarComandasAceptadasIniciales');

    /*
    //Coge las comandas que han sido aceptadas del servidor
    getComandasAceptadas()*/

    // Ordena las comandas por el tiempo en que entran
    this.comandes.sort((a, b) => b.temps - a.temps);
  },

  beforeDestroy() {
    // Limpiar el intervalo al salir del componente
    clearInterval(this.interval);
  },
}
</script>

<style>
.comanda-roja {
  background-color: indianred;
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
  background-color: mediumseagreen;
  color: white;
  border: 1px solid black;
  margin-bottom: 5px;
  margin-right: 5px;
}
</style>
  