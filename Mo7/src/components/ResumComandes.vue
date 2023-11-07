<template>
  <v-container>
    <v-card v-for="comanda in comandes" :key="comanda.id_comanda" class="mb-3">
      <v-card-title class="headline">Comanda {{ comanda.id_comanda }}</v-card-title>
      <v-card-title class="headline">Persona a recollir la comanda: {{ comanda.nombre_usuario }}</v-card-title>

      <v-dialog v-model="dialog[comanda.id_comanda]" max-width="300">
        <template v-slot:activator="{ on }">
          <v-btn class="ma-2" @click="dialog[comanda.id_comanda] = true">Recollir comanda</v-btn>
        </template>
        <v-card>
          <v-card-title>Confirmación</v-card-title>
          <v-card-text>
            ¿Estás seguro de que has recogido la comanda?
          </v-card-text>
          <v-card-actions>
            <v-btn @click="recollirComanda(comanda.id_comanda)">Sí</v-btn>
            <v-btn @click="dialog = false">No</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>

    <v-divider class="my-3"></v-divider>

    <v-row justify="center">
      <v-col>
        <p class="headline">Recaudació Total: {{ recaudacioTotal }}</p>
        <p class="subheading">Temps Mitjà de Preparació: {{ tempsMitjaPreparacio }}</p>
      </v-col>
    </v-row>
  </v-container>
  <v-snackbar v-model="snackbar" :timeout="2000">
    {{ snackbarMessage }}
  </v-snackbar>
</template>

<script>
//import { getComandasFinalizadas, comandaRecogida } from './communicationsManager';
import { socket, state } from './socket';

export default {
  name: 'ResumComandes',
  data() {
    return {
      comandes: [],
      comandesPruebas: [
        {
          id: 1,
          info: "PATATAS, ANVORGESA, COLA COCA",
          temps: "10"
        },
        {
          id: 2,
          info: "PATATAS, HAMBURGUESA, FANTA",
          temps: "20"
        },
        {
          id: 3,
          info: "PATATAS, HAMBURGUESA, FANTA",
          temps: "02"
        },
        {
          id: 4,
          info: "PATATAS, HAMBURGUESA, FANTA",
          temps: "05"
        },
        {
          id: 5,
          info: "PATATAS, HAMBURGUESA, FANTA",
          temps: "1"
        },
        {
          id: 6,
          info: "PATATAS, HAMBURGUESA, FANTA",
          temps: "2"
        },
        {
          id: 7,
          info: "PATATAS, HAMBURGUESA, FANTA",
          temps: "55"
        },
        {
          id: 8,
          info: "PATATAS, HAMBURGUESA, FANTA",
          temps: "32"
        },
      ],
      dialog: {},
      snackbar: false,
      snackbarMessage: '',
      recaudacioTotal: 0,
      tempsMitjaPreparacio: 0,
      recollida: ""
    };
  },
  watch: {
    comandes: {
      handler: 'cambiComandes',
      deep: true, // Para detectar cambios en propiedades anidadas
    },
  },

  methods: {
    recollirComanda(id) {
      //comandaRecogida(id, this.recollida);
      this.recollida = "recollida";
      socket.emit("comandaRecollida", id, this.recollida);
      this.dialog[id] = false;
      this.snackbarMessage = 'Comanda recogida';
      this.snackbar = true;
      // Actualiza las comandas al recoger una
      socket.emit('solicitarComandasFinalizadasIniciales');
    },
    cambiComandes() {      // Por ejemplo, puedes emitir un evento cuando las comandas cambien
      socket.emit('solicitarComandasFinalizadasIniciales');
    }
  },
  created() {
    //Para coger las comandas finalizadas al entrar en la pagina
    socket.on('getComandasFinalizadas', (comandas) => {
      const comandesJson = JSON.parse(comandas);
      this.comandes = comandesJson;
    });
    // Solicitar comandas iniciales
    socket.emit('solicitarComandasFinalizadasIniciales');

    /*
    // Obtiene todas las comandas ya finalizadas del servidor
    getComandasFinalizadas();*/
  },
};
</script>

<style scoped>
.headline {
  font-size: 20px;
  color: #333;
}

.subheading {
  font-size: 14px;
  color: #777;
}

.v-card {
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  color: #fff;
}
</style>
