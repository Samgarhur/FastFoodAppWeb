import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  productes:[]
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === "production" ? undefined : "http://pfcgrup7.dam.inspedralbes.cat:3044/";

export const socket = io(URL);


socket.on("connect", () => {
  state.connected = true;
});



socket.on("disconnect", () => {
  state.connected = false;
});


socket.on('getComandas', (estat) => {   

  
});

socket.on('comandaAceptada', (estat) => {   

  
});

socket.on('comandaRebutjada', (estat) => {   
  
});

socket.on('comandaFinalitzada', (estat) => {   
  
});

socket.on('comandaRecollida', (estat) => {   
  
});


