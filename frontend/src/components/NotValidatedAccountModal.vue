<template>
  <modal
    :show.sync="show"
    :close-on-click="false"
    modal-classes="modal-dialog-centered"
    body-classes="pb-0"
  >
    <div class="py-1 text-center">
      <img
        class="mx-auto d-block img-fluid mb-3"
        width="30%"
        :src="defaultLogo"
      />
      <div class="text-center">
        <hr class="my-4" />
        <h4 class="heading mt-1 mb-4">
          Olá,
          <span class="text-warning">{{ name || baseEndpoint }}</span
          >!
        </h4>
        <p class="text-md">
          Seu cadastrado como
          <span class="text-warning">{{ baseEndpoint }}</span> está com
          validação pendente
          <i
            v-tooltip="
              'Por questões de segurança, apenas contas validadas podem acessar as funcionalidades do Portal.'
            "
            class="fas fa-exclamation-triangle ml-1"
          />
        </p>
        <p class="text-sm">
          O acesso ao portal será liberado assim que sua conta for validada pela
          nossa equipe. Não se preocupe, isso deverá acontecer em breve. Em caso
          de dúvidas, sinta-se livre para
          <base-button
            type="danger"
            class="ml-auto"
            size="sm"
            @click="$router.push(`/${baseEndpoint}/suporte`)"
          >
            Contatar o suporte
          </base-button>
        </p>
        <p class="text-right mt-4">
          Cordialmente,<br />
          <span class="font-weight-600"
            >Equipe <span class="text-warning">Stars/Azaz</span></span
          >
        </p>
      </div>
    </div>
  </modal>
</template>
<script>
export default {
  name: "NotValidatedAccountModal",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    name: {
      type: String,
    },
    baseEndpoint: {
      type: String,
      required: true,
    },
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
