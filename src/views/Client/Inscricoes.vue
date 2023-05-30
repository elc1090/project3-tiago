<template>
  <div>
    <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center">
      <!-- Header container -->
      <div
        ref="enquetes_list"
        class="container-fluid d-flex align-items-center vld-parent justify-content-center"
      >
        <div class="row">
          <div class="col-12 text-center d-flex flex-column">
            <h2 class="text-white my-3 text-center">Custo mensal:</h2>
            <h1 class="text-white my-3 text-center">
              {{
                subscriptions
                  ? subscriptions
                      .reduce(
                        (partialSum, a) => partialSum + parseFloat(a.price),
                        0
                      )
                      .toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL"
                      })
                  : "R$ 0,00"
              }}
            </h1>
          </div>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--7">
      <div v-if="empty" class="row">
        <div class="col-12 mb-3 text-center">
          <badge type="info" class="bg-white">
            Não existem inscrições cadastradas até o momento
          </badge>
        </div>
      </div>
      <div class="row text-center mb-6">
        <div class="col-12">
          <base-button
            v-tooltip="'Clique para cadastrar uma nova inscrição'"
            :custom="true"
            size="sm"
            type="white"
            @click="$router.push('/cliente/inscricoes/novo')"
          >
            <i class="fas fa-plus mr-1" /> Nova inscrição
          </base-button>
        </div>
      </div>
      <div v-if="!empty">
        <div class="row">
          <div class="col-12">
            <div class="card-deck d-flex justify-content-center">
              <div
                v-for="subscription in subscriptions"
                :key="subscription.id"
                class="w-100 cursor-pointer"
                @click="
                  $router.push(`cliente/inscricoes/${subscription.id}/editar`)
                "
              >
                <div class="card">
                  <div class="card-body d-flex justify-content-between">
                    <div class="">
                      <div>
                        <h2 class="card-title">{{ subscription.name }}</h2>
                      </div>
                      <!-- <a
                        href="#"
                        class="btn btn-default edit-button"
                        v-tooltip="Editar"
                        ><i class="fas fa-edit"
                      /></a> -->

                      <p class="card-text">
                        {{ subscription.daysLeft }} dias restantes
                      </p>
                    </div>
                    <p class="card-text d-flex align-items-center">
                      {{
                        parseFloat(subscription.price).toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL"
                        })
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/services/api.js";
import Badge from "../../components/Badge.vue";

export default {
  name: "InscricoesList",
  components: { Badge },
  data() {
    return {
      subscriptions: [],
      empty: false,
      today: ""
    };
  },
  async mounted() {
    const loader = this.$loading.show({
      container: this.$refs.enquetes_list,
      width: 150,
      height: 150,
      opacity: 0
    });
    try {
      this.today = new Date();
      const { data } = await api.get("/client/subscriptions");
      if (data.length) {
        this.subscriptions = data;
        for (let subscription of this.subscriptions) {
          let nextBillDate = new Date(subscription.next_bill);
          subscription.daysLeft = parseInt(
            Math.ceil((nextBillDate - this.today) / 86400000)
          );
        }
      } else this.empty = true;
      loader.hide();
    } catch (e) {
      console.log(e);
      this.$toasted.error("Ocorreu um erro ao recuperar as inscrições.");
    }
  }
};
</script>
<style scoped>
.card-profile-image img {
  width: 180px;
  height: 180px;
}

.edit-button {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
