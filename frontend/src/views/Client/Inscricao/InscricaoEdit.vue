<template>
  <div>
    <base-header type="gradient-default" class="header pb-8 py-5 pt-md-8">
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-12 mt-0 mt-md-4 mt-lg-0 d-block">
            <router-link
              :to="'/cliente'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para a listagem de parceiros"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--7">
      <div class="row">
        <div class="col-xl-12 d-flex justify-content-center">
          <card shadow type="secondary" class="col-sm-12 col-xl-5">
            <div slot="header" class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-12 d-flex justify-content-between">
                  <h3 class="mb-0 text-center">
                    <i class="fas fa-edit mr-2" /> Editar inscrição
                  </h3>
                  <i
                    v-tooltip="'Excluir inscrição'"
                    class="btn btn-danger py-1 px-2 far fa-trash-alt"
                    @click="handleDeleteSubscription()"
                  ></i>
                </div>
              </div>
            </div>
            <template>
              <form role="form">
                <div class="ml-lg-2">
                  <div
                    class="col-12 d-flex flex-row align-items-center justify-content-between"
                  >
                    <label class="form-control-label">Nome*</label>
                    <base-input
                      v-model.trim="model.name"
                      placeholder="Insira o nome"
                    />
                  </div>
                  <hr class="mt--3 mb-2" />
                  <div
                    class="col-12 d-flex flex-row align-items-center justify-content-between"
                  >
                    <label class="form-control-label">Descrição</label>
                    <base-input
                      v-model="model.description"
                      placeholder="Insira a descrição"
                    />
                  </div>
                  <hr class="mt--3 mb-2" />
                  <div
                    class="col-12 d-flex flex-row align-items-center justify-content-between"
                  >
                    <label class="form-control-label">Preço*</label>

                    <base-input
                      v-model="model.price"
                      placeholder="Insira o preço"
                      v-mask="[
                        'R$##.##',
                        'R$###.##',
                        'R$####.##',
                        'R$#####.##'
                      ]"
                    />
                  </div>
                  <hr class="mt--3 mb-2" />
                  <div
                    class="col-12 d-flex flex-row align-items-center justify-content-between"
                  >
                    <label class="form-control-label">Categoria*</label>
                    <select
                      v-model="model.category"
                      class="form-control mb-4 select-input"
                    >
                      <option value="" selected disabled>
                        Selecione uma opção
                      </option>
                      <option key="music" value="music">Música</option>
                      <option key="entertainment" value="entertainment">
                        Entretenimento
                      </option>
                      <option key="utilities" value="utilities">
                        Utilidades
                      </option>
                      <option
                        key="food_and_beverages"
                        value="food_and_beverages"
                      >
                        Alimentação
                      </option>
                      <option
                        key="health_and_wellbeing"
                        value="health_and_wellbeing"
                      >
                        Saúde e Bem Estar
                      </option>
                      <option key="productivity" value="productivity">
                        Produtividade
                      </option>
                      <option key="banking" value="banking">Banco</option>
                      <option key="transport" value="transport">
                        Transporte
                      </option>
                      <option key="education" value="education">
                        Educação
                      </option>
                      <option key="insurance" value="insurance">
                        Segurança
                      </option>
                    </select>
                  </div>

                  <hr class="mt--3 mb-2" />

                  <div
                    class="col-12 d-flex flex-row align-items-center justify-content-between"
                  >
                    <label class="form-control-label">Próxima cobrança</label>

                    <input
                      class="no-border form-control mb-4 select-input"
                      :min="today"
                      type="date"
                      v-model="model.next_bill"
                    />
                  </div>
                  <hr class="mt--3 mb-2" />

                  <div
                    class="col-12 d-flex flex-row align-items-center justify-content-between"
                  >
                    <label class="form-control-label">É contínua?</label>
                    <base-switch
                      class="mb-switch"
                      v-bind:value="model.is_continuous"
                      @input="switchChangedHandler($event, 'is_continuous')"
                    />
                  </div>
                  <hr class="mt--3 mb-2" />

                  <div
                    v-if="model.is_continuous"
                    class="col-12 d-flex flex-row align-items-center justify-content-between"
                  >
                    <label class="form-control-label">Ciclo (meses)</label>
                    <base-input
                      v-model="model.billing_cycle"
                      placeholder="Insira o ciclo em meses"
                      type="number"
                    />
                  </div>
                  <hr v-if="model.is_continuous" class="mt--3 mb-2" />

                  <div
                    class="col-12 d-flex flex-row align-items-center justify-content-between"
                  >
                    <label class="form-control-label">Está ativa?</label>

                    <base-switch
                      class="mb-switch"
                      v-bind:value="model.is_active"
                      @input="switchChangedHandler($event, 'is_active')"
                    />
                  </div>
                  <hr class="mt--3 mb-2" />
                </div>

                <div v-if="error" class="row ml-lg-2">
                  <div class="col-lg-12 text-center">
                    <base-alert type="danger">
                      {{ error }}
                    </base-alert>
                  </div>
                </div>
                <div class="text-center">
                  <base-button
                    type="default"
                    class="mt-4"
                    :custom="true"
                    :disabled="!isValidModel"
                    @click="handleSubmit"
                  >
                    Salvar
                  </base-button>
                </div>
              </form>
            </template>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../../services/api";

export default {
  name: "InscricaoForm",
  data() {
    return {
      model: {
        name: "",
        description: "",
        price: "",
        category: "",
        next_bill: "",
        billing_cycle: "",
        is_continuous: false,
        is_active: false
      },
      today: "",
      modals: {
        modalConfirmation: false,
        inputConfirmation: ""
      },
      error: "",
      requiredFields: ["name", "price", "category"],
      showComplementarInfo: true
    };
  },

  async mounted() {
    this.today = this.formatDate(new Date(), "YYYY-MM-DD");

    try {
      const { data } = await api.get(
        `/client/subscriptions/${this.$route.params.id}`
      );

      this.model = data;
      this.model.next_bill = this.formatDate(
        new Date(this.model.next_bill),
        "YYYY-MM-DD"
      );
      this.model.price = parseFloat(this.model.price).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      });
    } catch (err) {
      this.$toasted.error("Ocorreu um erro ao carregar os dados da inscrição");
    }
  },
  computed: {
    isValidModel() {
      const sub = this.model;
      for (const key of this.requiredFields) {
        if (sub[key] === "") return false;
      }
      return true;
    }
  },
  methods: {
    switchChangedHandler(event, attribute) {
      if (typeof event === "boolean") this.model[attribute] = event;
    },

    async handleDeleteSubscription() {
      try {
        await api.delete(`/client/subscriptions/${this.$route.params.id}`);

        this.$toasted.show("Inscrição excluída com sucesso");
        this.$router.push("/cliente");
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao excluir a inscrição");
      }
    },

    async handleSubmit(e) {
      e.preventDefault();
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation,
        width: 90,
        height: 90,
        opacity: 0
      });

      this.error = "";
      this.model.billing_cycle = this.model.is_continuous
        ? this.model.billing_cycle
        : 0;

      this.model.price = parseFloat(
        this.model.price
          .substring(2, this.model.price.length)
          .replaceAll(",", ".")
      );

      const subscription = this.model;

      try {
        await api.put(`/client/subscriptions/${this.$route.params.id}`, {
          data: subscription
        });

        this.$toasted.show("Inscrição editada com sucesso");
        this.$router.push("/cliente");
      } catch (e) {
        const genericError = "Ocorreu um erro ao editar a inscrição.";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.error = hasErrorResponseData ? customError : genericError;
        this.$toasted.error(genericError);
        this.modals.modalConfirmation = false;
      }
      loader.hide();
    }
  }
};
</script>

<style>
.mb-switch {
  margin-top: 10px;
  margin-bottom: 30px;
}

.select-input {
  width: 208px;
}
</style>
