<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar
      :background-color="sidebarBackground"
      short-title="Client"
      title="Dashboard Client"
      :display-sidebar="displaySidebar"
      :user-logo="client.profile_picture ? client.profile_picture.url : ''"
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
      <dashboard-navbar
        :name="client.name"
        :user-logo="client.profile_picture ? client.profile_picture.url : ''"
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
import DashboardNavbar from "./../DashboardNavbar.vue";
import ContentFooter from "./../ContentFooter.vue";
import { FadeTransition } from "vue2-transitions";

import menu from "./menu.json";

import api from "@/services/api";
import { logout, setUserId } from "@/services/auth";

export default {
  components: {
    DashboardNavbar,
    ContentFooter,
    FadeTransition
  },
  data() {
    return {
      sidebarBackground: "vue", //vue|blue|orange|green|red|primary
      menu: menu,
      client: {
        name: "",
        profile_picture: null
      },
      displaySidebar: true
    };
  },
  async mounted() {
    try {
      const { data } = await api.get("/client/clients");
      if (data) {
        this.client = data;
        setUserId(data.user_id);
      } else return;
    } catch (e) {
      this.$toasted.error("Ocorreu um erro ao recuperar as informações");
      logout();
      this.$router.push("/");
    }
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    toggleDisplaySidebar() {
      this.displaySidebar = !this.displaySidebar;
    }
  }
};
</script>
