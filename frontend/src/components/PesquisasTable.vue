<template>
  <div>
    <div
      ref="versoes_pesquisa_table"
      class="card shadow table-container vld-parent"
    >
      <div class="card-header border-0">
        <div class="row align-items-center">
          <div class="col">
            <h3 class="mb-0">
              <i class="fas fa-clipboard-list mr-2" /> Pesquisas
              <span class="text-warning">{{
                isActive ? "ativas" : "passadas"
              }}</span>
            </h3>
          </div>
        </div>
      </div>
      <div class="table-responsive">
        <base-table
          class="table align-items-center table-flush"
          thead-classes="thead-light"
          tbody-classes="list"
          :data="tableData"
          type="hover"
        >
          <template slot="columns">
            <th>#</th>
            <th>Status</th>
            <th>Título</th>
            <th>Data de início</th>
            <th>Data de término</th>
            <th>Ações</th>
          </template>
          <template slot-scope="{ row, index }">
            <td class="py-0">
              {{ index + 1 }}
            </td>
            <td>
              <badge
v-if="row.answered" type="success"> Respondida </badge>
              <badge v-else type="warning">
                {{ isActive ? "Pendente" : "Não respondida" }}
              </badge>
            </td>
            <td>
              {{ row.title }}
            </td>
            <td>
              {{ formatDate(row.start_date, "LL") }}
            </td>
            <td>
              {{ formatDate(row.end_date, "LL") }}
            </td>
            <td>
              <span
                v-if="isActive"
                v-tooltip.bottom="'Responder esta pesquisa'"
              >
                <router-link
                  :to="`/colaborador/pesquisas/${row.id}/resposta`"
                  class="btn btn-white cursor-pointer py-1 px-2"
                >
                  <i class="fas fa-edit text-info" /> </router-link></span>
              <span
                v-else
                v-tooltip.bottom="
                  row.answered
                    ? 'Ver minha resposta'
                    : 'Pesquisa não respondida'
                "
              >
                <base-button
                  class="btn btn-white cursor-pointer py-1 px-2"
                  :class="{ disabled: !row.answered }"
                  @click="handleOpenModalView(row.id)"
                >
                  <i class="fas fa-eye text-primary" /> </base-button></span>
            </td>
          </template>
        </base-table>
        <p v-if="!tableData.length" class="text-center text-warning mt-3">
          Não há versões {{ isActive ? "ativas " : "passadas " }}
          de pesquisas de satisfação até o momento
        </p>
      </div>
    </div>
    <modal
      :show.sync="modalView.show"
      modal-classes="modal-dialog-centered modal-sm"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <h6
slot="header" class="modal-title">Detalhes da minha resposta</h6>
      <div class="text-center">
        <h2 class="card-title text-orange mb-4 pt-2">
          {{ modalView.version.title }}
        </h2>
      </div>
      <div class="description">
        <b>Questão objetiva:</b> {{ modalView.version.objective_question }}
        <br /><b>Resposta:</b>
        {{ modalView.answer.objective_answer }}
      </div>
      <div class="description mt-2">
        <b>Questão descritiva: </b>{{ modalView.version.descriptive_question }}
        <br /><b>Resposta:</b>
        {{ modalView.answer.descriptive_answer }}
      </div>
      <p class="text-right description mt-3 mb-0">
        <i class="far fa-clock mr-1" /> Respondido em
        {{ formatTimestamp(modalView.answer.created_at, "lll") }}.
      </p>
      <template slot="footer">
        <base-button
          type="link"
          text-color="dark"
          class="ml-auto"
          @click="modalView.show = false"
        >
          Voltar
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import api from "@/services/api.js";
export default {
  name: "PesquisasTable",
  props: {
    tableData: {
      type: Array,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      modalView: {
        show: false,
        version: {},
        answer: {},
      },
    };
  },
  methods: {
    async handleOpenModalView(versao_id) {
      await this.loadAnswer(versao_id);
      await this.loadPesquisa(versao_id);
      this.modalView.show = true;
    },
    async loadAnswer(versao_id) {
      const loader = this.$loading.show({
        container: this.$refs.form_container,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.get(
          `/collaborator/satisfaction-survey/answer/${versao_id}`
        );
        if (data[0]) {
          this.modalView.answer = data[0];
        } else this.empty = true;
        loader.hide();
      } catch (e) {
        this.$toasted.error(
          "Ocorreu um erro ao recuperar as informações da pesquisa"
        );
      }
    },
    async loadPesquisa(versao_id) {
      const loader = this.$loading.show({
        container: this.$refs.form_container,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.get(
          `/collaborator/satisfaction-survey/${versao_id}`
        );
        this.modalView.version = data;
        loader.hide();
      } catch (e) {
        this.$toasted.error(
          "Ocorreu um erro ao recuperar as informações da pesquisa"
        );
      }
    },
  },
};
</script>
<style scoped></style>
