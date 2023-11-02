<template>
  <div class="container">
    <h1 class="title">Administració de la Botiga</h1>
    <div class="button-container">
      <v-btn class="custom-button" @click="$router.push('/GestioComandes')">Gestió de Comandes</v-btn>
      <v-btn class="custom-button" @click="$router.push('/gestioProductes')">Gestió de Productes</v-btn>
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
  background-color: #f4f4f4; /* Cambia el color de fondo a tu preferencia */
}

.title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333; /* Cambia el color del título a tu preferencia */
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.custom-button {
  margin-bottom: 1.5rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: #66B3FF; /* Cambia el color de fondo del botón a tu preferencia */
  color: #fff; /* Cambia el color del texto del botón a tu preferencia */
  border: none;
  border-radius: 50px; /* Hace que los botones sean redondos */
  cursor: pointer;
  display: flex;
  align-items: center; /* Centra el texto verticalmente en el botón */
  justify-content: center; /* Centra el texto horizontalmente en el botón */
  transition: background-color 0.3s ease;
}

.custom-button:hover {
  background-color: #0056b3; /* Cambia el color de fondo al pasar el mouse por encima */
}
</style>
