<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar
      :background-color="sidebarBackground"
      short-title="Dashboard"
      title="Dashboard Pública"
      :display-sidebar="displaySidebar"
      :is-user="false"
    >
      <template slot="links">
        <!-- menu links -->
        <sidebar-item
          v-for="link in menu.links"
          :key="link.path"
          :link="link"
        />
      </template>
    </side-bar>
    <div class="main-content" :data="sidebarBackground">
      <i
        class="fa fa-bars btn-toggle d-none d-md-block"
        @click="toggleDisplaySidebar()"
      />
      <base-nav
        id="navbar-main"
        class="navbar-top navbar-dark navbar-text"
        :show-toggle-button="false"
        expand
      />
      <div @click="toggleSidebar">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <router-view />
        </fade-transition>
      </div>
    </div>
    <content-footer v-if="!$route.meta.hideFooter" />
  </div>
</template>
<script>
import ContentFooter from "./../ContentFooter.vue";
import { FadeTransition } from "vue2-transitions";

import menu from "./menu.json";

export default {
  components: {
    ContentFooter,
    FadeTransition,
  },
  data() {
    return {
      sidebarBackground: "vue", //vue|blue|orange|green|red|primary
      menu: menu,
      admin: {
        name: "",
        profile_picture: null,
      },
      displaySidebar: true,
    };
  },
  async mounted() {},
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    toggleDisplaySidebar() {
      this.displaySidebar = !this.displaySidebar;
    },
  },
};
</script>

<style scoped>
.navbar-text {
  margin-top: 25px;
}
.btn-toggle {
  position: absolute;
  z-index: 999;
  color: #ffffff;
  margin-left: 10px;
  margin-top: 29px;
  font-size: 20px;
  cursor: pointer;
}
.btn-toggle:hover,
.btn-toggle:active,
.btn-toggle:focus {
  -webkit-box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1),
    0 3px 6px rgba(0, 0, 0, 0.08);
  box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
  -webkit-transform: translateY(-1px);
  transform: translateY(-1px);
}
</style>
