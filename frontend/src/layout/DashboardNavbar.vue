<template>
  <base-nav
    id="navbar-main"
    class="navbar-top navbar-dark"
    :show-toggle-button="false"
    expand
  >
    <ul class="navbar-nav align-items-center d-none d-md-flex">
      <li class="nav-item dropdown">
        <base-dropdown class="nav-link pr-0" position="right">
          <div slot="title" class="media align-items-center">
            <span class="avatar avatar-sm rounded-circle">
              <img
                style="cursor: pointer"
                alt="user logo"
                :src="userLogo || '/img/pages/default_profile_picture.png'"
              />
            </span>
            <div
              class="media-body ml-2 d-none d-lg-block"
              style="cursor: pointer"
            >
              <span class="mb-0 text-sm font-weight-bold">{{
                name ? name.split(" ")[0] : ""
              }}</span>
            </div>
          </div>

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
      </li>
    </ul>
  </base-nav>
</template>
<script>
import { logout, getRoles } from "../services/auth";

export default {
  props: {
    name: String,
    userLogo: {
      type: String,
    },
  },
  data() {
    return {
      activeNotifications: false,
      showMenu: false,
      searchQuery: "",
    };
  },
  computed: {
    showSupportButton() {
      return true;
    },
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
        volunteer: "voluntario",
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
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
  },
};
</script>
<style>
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
