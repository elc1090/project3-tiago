<template>
  <div class="bg-default wrapper">
    <!-- Navbar -->
    <base-nav
      class="navbar-top navbar-horizontal navbar-light bg-white"
      container-classes="py-1 container"
      expand
      :show-toggle-button="false"
    >
      <span slot="brand" class="navbar-brand m-auto">
        <img :src="defaultLogo" />
      </span>
    </base-nav>
    <!-- Page content -->
    <div class="container main-content">
      <slide-y-up-transition mode="out-in" origin="center top">
        <router-view />
      </slide-y-up-transition>
    </div>
  </div>
</template>
<script>
import { SlideYUpTransition } from "vue2-transitions";

export default {
  name: "BlankLayout",
  components: {
    SlideYUpTransition,
  },
  data() {
    return {
      year: new Date().getFullYear(),
    };
  },
  computed: {
    defaultLogo() {
      return `/img/brand/${
        window.location.host.includes("cobusiness")
          ? "cobusiness.png"
          : "orquestrando_logo.png"
      }`;
    },
  },
};
</script>
<style scoped>
.wrapper {
  min-height: 100%;
  min-width: 100%;
  position: absolute;
}

.bg-dark-green {
  background-color: seagreen !important;
}
.navbar-horizontal .navbar-brand img {
  height: 45px;
}
</style>
<style>
html {
  position: relative;
  min-height: 100%;
}
</style>
