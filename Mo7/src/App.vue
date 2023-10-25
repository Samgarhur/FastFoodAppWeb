<template>
  <v-app>
    <v-main>      
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import PaginaPrincipal from './components/PaginaPrincipal.vue';

export default {
  name: 'App',
  components: {
    PaginaPrincipal
  }
}
</script>
