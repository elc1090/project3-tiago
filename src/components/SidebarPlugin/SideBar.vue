<template>
  <nav
    v-show="displaySidebar"
    id="sidenav-main"
    :class="{ 'fixed-left': displaySidebar }"
    class="navbar navbar-vertical navbar-expand-md navbar-light bg-white"
  >
    <div class="container-fluid">
      <!--Toggler-->
      <navbar-toggle-button @click.native="showSidebar">
        <span class="navbar-toggler-icon" />
      </navbar-toggle-button>
      <router-link class="navbar-brand img-container" to="/">
        <h1>Subscriptions App</h1>
        <br />
      </router-link>
      <slot name="mobile-right">
        <ul class="nav align-items-center d-md-none">
          <base-dropdown v-if="isUser" class="nav-item" position="right">
            <a slot="title" class="nav-link" href="#" role="button">
              <div class="media align-items-center">
                <span class="avatar avatar-sm rounded-circle">
                  <img
                    alt="user logo"
                    :src="userLogo || '/img/pages/default_profile_picture.png'"
                  />
                </span>
              </div>
            </a>

            <template>
              <div class="dropdown-header noti-title">
                <h6 class="text-overflow m-0">Ações</h6>
              </div>
              <router-link
                :to="getFullPathBasedOnRole('configuracoes')"
                class="dropdown-item"
              >
                <i class="ni ni-settings" />
                <span>Configurações</span>
              </router-link>

              <div class="dropdown-divider" />
              <a
                class="dropdown-item"
                style="cursor: pointer"
                @click="handleLogout"
              >
                <i class="ni ni-user-run" />
                <span>Sair</span>
              </a>
            </template>
          </base-dropdown>
        </ul>
      </slot>
      <slot />
      <div
        v-show="$sidebar.showSidebar"
        id="sidenav-collapse-main"
        class="navbar-collapse collapse show"
      >
        <div class="navbar-collapse-header d-md-none">
          <div class="row">
            <div class="col-6 collapse-brand">
              <router-link to="/">
                <img :src="defaultLogo" />
              </router-link>
            </div>
            <div class="col-6 collapse-close">
              <navbar-toggle-button @click.native="closeSidebar" />
            </div>
          </div>
        </div>

        <ul class="navbar-nav">
          <slot name="links" />
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import NavbarToggleButton from "@/components/NavbarToggleButton";
import { logout, getRoles } from "@/services/auth";

export default {
  name: "Sidebar",
  components: {
    NavbarToggleButton
  },
  props: {
    logo: {
      type: String,
      default: "/img/brand/orquestrando_logo.png",
      description: "Sidebar app logo"
    },
    isUser: {
      type: Boolean,
      default: true
    },
    autoClose: {
      type: Boolean,
      default: true,
      description:
        "Whether sidebar should autoclose on mobile when clicking an item"
    },
    displaySidebar: {
      type: Boolean,
      default: true
    },
    userLogo: {
      type: String
    }
  },
  provide() {
    return {
      autoClose: this.autoClose
    };
  },
  computed: {
    showSupportButton() {
      return true;
    },
    defaultLogo() {
      return this.logo;
    }
  },
  beforeDestroy() {
    if (this.$sidebar.showSidebar) {
      this.$sidebar.showSidebar = false;
    }
  },
  methods: {
    getFullPathBasedOnRole(subpath) {
      const roles = getRoles();
      const rolesMap = {
        admin: "diretoria",
        student: "aluno",
        teacher: "professor",
        partner: "parceiro",
        associate: "associado",
        volunteer: "voluntario"
      };
      if (roles) {
        const role = JSON.parse(roles)[0];
        return `/${rolesMap[role]}/${subpath}`;
      }
      return "/";
    },
    handleLogout() {
      logout();
      this.$toasted.show("Até breve! :)");
      this.$router.push("/");
    },
    closeSidebar() {
      this.$sidebar.displaySidebar(false);
    },
    showSidebar() {
      this.$sidebar.displaySidebar(true);
    },
    toggleSidebar() {
      this.displaySidebar = !this.displaySidebar;
    }
  }
};
</script>
<style scoped>
.navbar-vertical .navbar-brand-img {
  max-height: 3em !important;
  width: auto !important;
}
.navbar-vertical .img-container {
  flex: 1 !important;
  max-height: 4.7em;
  display: flex !important;
  justify-content: center !important;
}
</style>
<style>
.text-dark-yellow {
  color: #e69900;
}

.text-dark-green {
  color: seagreen;
}
</style>
