<template>
    <button class="my-button-class" onclick="window.location.href = '/';">
        <img src="./home.png" alt="icono Pag Principal" width="40" height="45">
    </button>
    <v-container>
        <v-btn class="ma-2" @click="dialogCrearProducte = true">Recargar estadistiques</v-btn>
    </v-container>
    <v-container>
        <v-card v-for="estadistica in estadistiques">
            <v-card-title>{{ estadistica.nom }}</v-card-title>
            <v-img :src="decodeBase64Image(estadistica.foto)" height="150" width="150" cover></v-img>
        </v-card>
    </v-container>
</template>
    
<script>

//import { comandaFinalitzada, getComandasAceptadas } from './communicationsManager';
import { socket, state } from './socket';
export default {
    name: 'GestioEstaditiques',
    data() {
        return {
            estadistiques: [],

        };
    },
    methods: {
        //Funcion para codificar las imagenes del servidor de base64 a una url
        decodeBase64Image(base64String) {
            const binaryString = atob(base64String);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: "image/jpeg" }); // Ajusta el tipo MIME según tu imagen
            this.producteEditat.foto = URL.createObjectURL(blob);
            return URL.createObjectURL(blob);
        }

    },
    created() {

    },

}
</script>
  
<style>
.my-button-class {
  position: absolute;
  top: 1rem;
  left: 1rem;
  height: 55px;
  background-color: #66B3FF;
  color: #fff;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.my-button-class img {
  width: 50px;
  height: 55px;
}

.my-button-class:hover {
  background-color: #0056b3;
}
</style>
    