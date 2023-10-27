<template>
    <div class="container">
      <h1 class="title">Administració Botiga</h1>
      <div class="buttons">
        <v-btn @click="$router.push('/GestioComandes')">Gestió de comandes</v-btn><br>
        <v-btn @click="$router.push('/gestioProductes')">Gestió de Productes</v-btn>
      </div>
    </div>
  </template>
  
  <style>
  .container {
    display: flex;
    flex-direction: column;
    padding-top: 100px;
    align-items: center;
    height: 100vh;
  }
  
  .title {
    font-size: 3rem;
    margin-bottom: 2rem;
  }
  
  .buttons {
    display: flex;
    flex-direction: column;
  }
  .button {
    margin-bottom: 1rem;
  }
  </style>