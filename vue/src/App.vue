<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
    <router-link :to="{ name: 'Courses' }">Jobs</router-link>
  </div>
  <button @click="redirect"> Redirect </button>
  <button @click="back"> Back </button>
  <button @click="forward"> Forward </button>
  <router-view/>
</template>

<script>

  export default {
  methods: {
    redirect() {

    },
    back() {
      this.$router.go(-1)
    },
    forward(){
      this.$router.go(+1)
    }
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
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
