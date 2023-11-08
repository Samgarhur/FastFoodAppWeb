<template>
  <div class="container">
    <img src="./PedralbesLogo.png" alt="Pedralbes Logo" height="400" width="400"/>    
    <div class="button-container">
      <v-btn class="custom-button" @click="$router.push('/GestioComandes')">Gestió de Comandes</v-btn>
      <v-btn class="custom-button" @click="$router.push('/gestioProductes')">Gestió de Productes</v-btn>
      <v-btn class="custom-button" @click="$router.push('/gestioEstadistiques')">Estadistiques</v-btn>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4; 
}

.title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333; 
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.custom-button {
  margin-bottom: 1.5rem;
  padding: 1.5rem 3rem;
  font-size: 1.5rem;
  background-color: #66B3FF; 
  color: #fff; 
  border: none;
  border-radius: 20px; 
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center; 
  justify-content: center; 
  transition: background-color 0.3s ease;  
}

.custom-button:hover {
  background-color: #0056b3; 
}
</style>
