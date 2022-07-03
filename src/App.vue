<template>
  <div id="app">
    <user-auth-email-password-social-vue></user-auth-email-password-social-vue>
  </div>
</template>

<script>
import UserAuthEmailPasswordSocialVue from './pages/UserAuthEmailPasswordSocial.vue'
export default {
  name: 'App',
  components: {
    UserAuthEmailPasswordSocialVue
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
