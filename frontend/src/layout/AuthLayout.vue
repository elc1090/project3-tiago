<template>
  <div class="bg-default wrapper">
    <!-- Navbar -->
    <base-nav
      class="navbar-top navbar-horizontal navbar-light bg-white"
      container-classes="px-4 container"
      expand
    >
      <router-link slot="brand" class="navbar-brand" to="/">
        <h1>Subscriptions App</h1>
      </router-link>

      <template v-slot="{ closeMenu }">
        <!-- Collapse header -->
        <div class="navbar-collapse-header d-md-none">
          <div class="row">
            <div class="col-6 collapse-brand">
              <router-link to="/">
                <img :src="defaultLogo" />
              </router-link>
            </div>
            <div class="col-6 collapse-close">
              <button
                type="button"
                class="navbar-toggler"
                aria-label="Toggle sidenav"
                @click="closeMenu"
              >
                <span />
                <span />
              </button>
            </div>
          </div>
        </div>
        <!-- Navbar items -->
      </template>
    </base-nav>
    <!-- Header -->
    <div class="header mt-lg-7 mt-5">
      <div class="container">
        <div class="header-body text-center mb-3">
          <div class="row">
            <div class="col-12">
              <h1 class="text-white">Bem-vindo!</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  name: "AuthLayout",
  components: {
    SlideYUpTransition
  },
  data() {
    return {
      year: new Date().getFullYear(),
      showMenu: false
    };
  },
  computed: {
    defaultLogo() {
      return `/img/brand/${
        window.location.host.includes("cobusiness")
          ? "cobusiness.png"
          : "orquestrando_logo.png"
      }`;
    }
  }
};
</script>
<style scoped>
.footer .nav-link {
  padding: 0 0.75rem;
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  min-height: 50px;
  padding: 0;
  line-height: 50px;
}
.main-content {
  margin-bottom: 9rem;
}

.wrapper {
  min-height: 100%;
  min-width: 100%;
  position: absolute;
}

.bg-dark-green {
  background-color: seagreen !important;
}

.bg-diagonal-stripes {
  background: repeating-linear-gradient(
    -65deg,
    #01adee,
    #01adee 300px,
    #a4ce3a 300px,
    #a4ce3a 500px,
    #f9a64b 500px,
    #f9a64b 800px,
    #c456a0 800px,
    #c456a0 1000px
  );
}

.navbar-horizontal .navbar-brand img.custom-logo {
  height: 45px;
}
</style>
<style>
html {
  position: relative;
  min-height: 100%;
}
</style>
