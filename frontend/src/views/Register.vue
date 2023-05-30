<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div
        ref="formContainer"
        class="card bg-secondary shadow border-0 vld-parent"
      >
        <div class="card-header bg-transparent pb-4 pt-4">
          <h1 class="text-center">Subscriptions App</h1>
          <p class="text-center">Cadastro</p>
        </div>
        <div class="card-body px-lg-5 py-lg-5">
          <div class="text-center text-muted mb-4">
            <small>Entre com suas credenciais</small>
          </div>
          <form role="form" @submit="handleSignUp">
            <base-input
              v-model="model.email"
              class="input-group-alternative mb-3"
              placeholder="Email"
              addon-left-icon="ni ni-email-83"
            />

            <base-input
              v-model="model.name"
              class="input-group-alternative mb-3"
              placeholder="Nome"
              addon-left-icon="ni ni-single-02"
            />

            <base-input
              v-model="model.password"
              class="input-group-alternative"
              placeholder="Senha"
              type="password"
              addon-left-icon="ni ni-lock-circle-open"
            />

            <base-alert
              v-if="error"
              type="danger"
              class="text-center mt-4 mb-0"
            >
              <i class="fas fa-exclamation-circle mr-1" />
              {{ error }}
            </base-alert>

            <div class="text-center">
              <base-button
                native-type="submit"
                class="mt-4 px-5"
                type="default"
                title="Cadastrar"
              >
                Cadastrar
              </base-button>
            </div>
          </form>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-12">
          <router-link to="/login" class="text-light float-right">
            <small> Já possui uma conta? </small>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "../services/api";
import { login } from "../services/auth";

export default {
  name: "Login",
  data() {
    return {
      model: {
        email: "",
        name: "",
        password: ""
      },
      error: ""
    };
  },

  methods: {
    async handleSignUp(e) {
      e.preventDefault();
      const user = this.model;
      user.email = user.email.trim();
      if (!user.email || !user.password) {
        this.error = "Preencha seu email e senha para continuar.";
      } else {
        let loader = this.$loading.show({
          container: this.$refs.formContainer,
          width: 128,
          height: 128
        });
        try {
          const dataForm = new FormData();
          dataForm.append("data", JSON.stringify(user));
          await api.post("/clients", user);
          this.$router.push(`/login`);
          this.$toasted.show("Conta criada com sucesso");
        } catch (err) {
          this.error = "Houve um problema com o cadastro.";
          this.$toasted.error("Ocorreu um erro com com o cadastro");
        } finally {
          loader.hide();
        }
      }
    }
  }
};
</script>
<style scoped></style>
