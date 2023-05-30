<template>
  <div>
    <div class="row">
      <div class="col-xl-4 order-xl-2 mb-5 mb-xl-0">
        <div class="row">
          <div class="col-12">
            <div ref="project_card" class="card shadow flex-grow-1 vld-parent">
              <div class="card-body text-center">
                <h2 class="card-title mb-1 text-warning">
                  {{ project.title }}
                </h2>
                <p
                  v-if="project.start_date || project.end_date"
                  class="description mb-0"
                >
                  <i class="fas fa-calendar mr-2" />{{
                    formatDate(project.start_date, "L") || "--"
                  }}
                  até
                  {{ formatDate(project.end_date, "L") || "--" }}
                </p>
                <div class="mt-3">
                  <router-link
                    v-tooltip="'Gerenciar tarefas do projeto'"
                    :to="`/${endpoint}/projetos/${$route.params.id}/tarefas`"
                    class="btn btn-white py-1 px-2"
                  >
                    <i class="fas fa-columns text-warning mr-2" />
                    Tarefas
                  </router-link>
                  <router-link
                    v-if="
                      endpoint === 'colaborador' && user_id === project.user_id
                    "
                    v-tooltip="'Editar propriedades do projeto'"
                    :to="`/${endpoint}/projetos/${$route.params.id}/editar`"
                    class="btn btn-white py-1 px-2"
                  >
                    <i class="fas fa-edit text-info mr-2" />Projeto
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-8">
        <div class="row mb-4">
          <div class="col-12">
            <card shadow type="secondary">
              <div slot="header" class="bg-white border-0">
                <div class="row align-items-center">
                  <div class="col-8">
                    <h3 class="mb-0">
                      <i class="fas fa-tag mr-2" /> Nova
                      <span class="text-warning">tag</span>
                    </h3>
                  </div>
                </div>
              </div>
              <template>
                <form ref="tag_form" role="form vld-parent">
                  <div class="row ml-1">
                    <h6 class="heading-small text-muted mb-4">
                      Informações básicas
                    </h6>
                  </div>
                  <div class="row ml-lg-2">
                    <div class="col-lg-4">
                      <base-input
                        v-model.trim="model.title"
                        label="Título*"
                        placeholder="Digite o título"
                      />
                    </div>
                    <div class="col-lg-4">
                      <label class="form-control-label"> Cor da tag </label>
                      <div>
                        <base-input>
                          <select v-model="model.color" class="form-control">
                            <option selected disabled value="">
                              Selecione uma cor para a tag
                            </option>
                            <option
                              v-for="(tag, index) in tagThemes"
                              :key="index"
                              :value="tag.color"
                            >
                              {{ tag.title }}
                            </option>
                          </select>
                        </base-input>
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <label class="form-control-label">
                        Pré-visualização
                      </label>
                      <div v-if="model.title">
                        <badge :type="model.color || 'default'">{{
                          model.title
                        }}</badge>
                      </div>
                      <div v-else>-</div>
                    </div>
                  </div>
                  <div class="row text-center mt-2">
                    <div v-if="error" class="col-12">
                      <base-alert type="danger">{{ error }}</base-alert>
                    </div>
                    <div class="col-12">
                      <span
                        v-tooltip="
                          !model.title
                            ? 'Preencha os campos obrigatórios (*)'
                            : ''
                        "
                      >
                        <base-button
                          type="primary"
                          :custom="true"
                          :disabled="!model.title"
                          @click="handleSubmitNewTag"
                        >
                          Cadastrar nova tag
                        </base-button>
                      </span>
                    </div>
                  </div>
                </form>
              </template>
            </card>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="card shadow flex-grow-1">
              <div ref="secoes_list" class="vld-parent">
                <div class="card table-container">
                  <div class="card-header border-0">
                    <div class="row align-items-center">
                      <div class="col">
                        <h3 class="mb-0">
                          <i class="fas fa-tags mr-2" /> Lista de tags
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div ref="tags_container" class="table-responsive vld-parent">
                    <base-table
                      class="table align-items-center table-flush"
                      thead-classes="thead-light"
                      tbody-classes="list"
                      :data="tags"
                      type="hover"
                    >
                      <template slot="columns">
                        <th>#</th>
                        <th>Título</th>
                        <th>Visualização</th>
                        <th>Ações</th>
                      </template>
                      <template slot-scope="{ row, index }">
                        <th scope="row" class="py-4">{{ index + 1 }}</th>
                        <td>
                          <div class="mt-1">
                            {{ row.title }}
                          </div>
                        </td>
                        <td>
                          <badge :type="row.color">{{ row.title }}</badge>
                        </td>
                        <td>
                          <base-button
                            v-tooltip.bottom="'Excluir tag'"
                            type="white"
                            size="sm"
                            class="text-danger"
                            @click="handleOpenModalRemove(row)"
                          >
                            <i class="fas fa-trash text-danger" />
                          </base-button>
                          <base-button
                            v-tooltip.bottom="'Editar tag'"
                            type="white"
                            size="sm"
                            class="text-danger"
                            @click="handleOpenModalUpdate(row)"
                          >
                            <i class="fas fa-edit text-info" />
                          </base-button>
                        </td>
                      </template>
                    </base-table>
                    <p
                      v-if="!tags.length"
                      class="text-center text-warning mt-3"
                    >
                      Não há tags cadastradas no projeto até o momento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal
      :show.sync="modals.modalRemove.show"
      modal-classes="modal-default modal-dialog-centered"
      body-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_confirmation_delete" class="vld-parent">
        <div class="py-3 text-center">
          <i class="fas fa-tag fa-3x" />
          <h4 class="heading mt-4">
            Você realmente deseja excluir a tag
            <span class="text-danger">
              {{ modals.modalRemove.tag.title }}
            </span>
            ?
          </h4>
        </div>
        <base-alert
          v-if="modals.modalRemove.error"
          type="danger"
          class="text-center"
        >
          Ocorreu um erro ao remover a tag. Por favor, tente novamente.
        </base-alert>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="white"
          class="ml-auto"
          @click="modals.modalRemove.show = false"
        >
          Voltar
        </base-button>
        <base-button type="white text-danger" @click="handleSubmitRemoveTag">
          Confirmar remoção
        </base-button>
      </template>
    </modal>
    <modal
      :show.sync="modals.modalUpdate.show"
      modal-classes="modal-dialog-centered modal-md"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Editar tag
      </h6>
      <div ref="modal_edit_tag" class="vld-parent">
        <div class="py-3 text-center">
          <i class="fas fa-tag fa-3x" />
          <h4 class="heading mt-4">Editar tag do projeto</h4>
        </div>
      </div>
      <template>
        <form role="form">
          <div class="row">
            <div class="col-lg-12">
              <base-input
                v-model.trim="modals.modalUpdate.tag.title"
                label="Título*"
                placeholder="Digite o título"
              />
            </div>
            <div class="col-lg-12">
              <label class="form-control-label"> Cor da tag </label>
              <div>
                <base-input>
                  <select
                    v-model="modals.modalUpdate.tag.color"
                    class="form-control"
                  >
                    <option selected disabled value="">
                      Selecione uma cor para a tag
                    </option>
                    <option
                      v-for="(tag, index) in tagThemes"
                      :key="index"
                      :value="tag.color"
                    >
                      {{ tag.title }}
                    </option>
                  </select>
                </base-input>
              </div>
            </div>
            <div class="col-lg-12">
              <label class="form-control-label"> Pré-visualização </label>
              <div v-if="modals.modalUpdate.tag.title">
                <badge :type="modals.modalUpdate.tag.color || 'default'">{{
                  modals.modalUpdate.tag.title
                }}</badge>
              </div>
              <div v-else>-</div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-12">
              <base-alert
                v-if="modals.modalUpdate.error"
                type="danger"
                class="text-center"
              >
                Ocorreu um erro ao atualizar a tag. Por favor, tente novamente.
              </base-alert>
            </div>
          </div>
        </form>
      </template>
      <template slot="footer">
        <base-button
          type="link"
          text-color="dark"
          class="ml-auto"
          @click="modals.modalUpdate.show = false"
        >
          Voltar
        </base-button>
        <base-button
          type="primary"
          :disabled="!modals.modalUpdate.tag.title"
          @click="handleSubmitUpdateTag()"
        >
          Salvar alterações
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import api from "@/services/api.js";
import { getUserId } from "@/services/auth";

export default {
  name: "ProjetoForm",
  props: {
    endpoint: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      model: {
        title: "",
        color: "",
      },
      user_id: null,
      tags: [],
      tagThemes: [
        {
          title: "Rosa",
          color: "primary",
        },
        {
          title: "Azul acizentada (padrão)",
          color: "default",
        },
        {
          title: "Azul clara",
          color: "info",
        },
        {
          title: "Laranja",
          color: "warning",
        },
        {
          title: "Preta",
          color: "dark",
        },
        {
          title: "Vermelha",
          color: "danger",
        },
        {
          title: "Verde",
          color: "success",
        },
      ],
      project: "",
      modals: {
        modalUpdate: {
          show: false,
          tag: {
            id: "",
            title: "",
            color: "",
          },
          error: "",
        },
        modalRemove: {
          show: false,
          tag: "",
          error: "",
        },
      },
      error: "",
      route_role: "",
    };
  },
  async mounted() {
    if (this.endpoint) {
      const map = {
        diretoria: "admin",
        professor: "teacher",
        voluntario: "volunteer",
      };
      this.route_role = map[this.endpoint];
    }

    const { voltar } = this.$route.query;
    if (voltar) this.$emit("returnToProject", true);
    await this.loadProject();
    await this.loadTagsList();
    this.loadSelfInfo();
  },
  methods: {
    handleOpenModalRemove(tag) {
      this.modals.modalRemove.error = "";
      this.modals.modalRemove.tag = tag;
      this.modals.modalRemove.show = true;
    },
    handleOpenModalUpdate(tag) {
      this.modals.modalUpdate.error = "";
      Object.assign(this.modals.modalUpdate.tag, tag);
      this.modals.modalUpdate.show = true;
    },
    async loadProject() {
      const loaderForm = this.$loading.show({
        container: this.$refs.project_card,
        width: 90,
        height: 90,
      });
      try {
        const {
          data: { project },
        } = await api.get(
          `/${this.route_role}/projects/${this.$route.params.id}`
        );
        project.is_visible = project.is_visible ? true : false;
        this.project = project;
        loaderForm.hide();
      } catch (e) {
        this.error = "Ocorreu um erro ao recuperar as informações das tags.";
        this.$toasted.error("Erro ao recuperar as informações");
      }
    },
    async loadTagsList() {
      const loaderForm = this.$loading.show({
        container: this.$refs.tags_container,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.get(
          `/${this.route_role}/projects/${this.$route.params.id}/tags`
        );
        this.tags = data;
        loaderForm.hide();
      } catch (e) {
        this.error = "Ocorreu um erro ao recuperar as informações das tags.";
        this.$toasted.error("Erro ao recuperar as informações");
      }
    },
    async handleSubmitNewTag(e) {
      e.preventDefault();
      const loader = this.$loading.show({
        container: this.$refs.tags_container,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.post(
          `/${this.route_role}/projects/${this.project.id}/tags`,
          this.model
        );
        this.tags.push(data);
        this.$toasted.show("Nova tag cadastradra com sucesso.");
        this.model.title = "";
        this.model.color = "";
      } catch (e) {
        const genericError =
          "Ocorreu um erro ao cadastrar a tag. Por favor, tente novamente.";
        const hasErrorResponseData = e.response && e.response.data;
        let customError = genericError;
        if (hasErrorResponseData) {
          const data = e.response.data.error
            ? e.response.data.error
            : e.response.data.errors;
          if (data[0] && data[0].message) customError = data[0].message;
          else if (data.message) customError = data.message;
        }
        this.error = hasErrorResponseData ? customError : genericError;
        this.$toasted.error("Ocorreu um erro ao cadastrar a tag.");
      }
      loader.hide();
    },
    async handleSubmitRemoveTag() {
      this.modals.modalRemove.error = false;
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation_delete,
        width: 160,
        height: 160,
        opacity: 0,
      });
      try {
        const tag = this.modals.modalRemove.tag;
        await api.delete(
          `/${this.route_role}/projects/${this.project.id}/tags/${tag.id}`
        );
        this.$toasted.show("Tag removida com sucesso");
        this.modals.modalRemove.show = false;
        await this.loadTagsList();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao remover a tag");
        this.modals.modalRemove.error = true;
      } finally {
        loader.hide();
      }
    },
    async handleSubmitUpdateTag() {
      this.modals.modalUpdate.error = false;
      const loader = this.$loading.show({
        container: this.$refs.modal_update_tag,
        width: 160,
        height: 160,
        opacity: 0,
      });
      try {
        const tag = this.modals.modalUpdate.tag;
        await api.put(
          `/${this.route_role}/projects/${this.project.id}/tags/${tag.id}`,
          this.modals.modalUpdate.tag
        );
        this.$toasted.show("Tag atualizada com sucesso");
        this.modals.modalUpdate.show = false;
        await this.loadTagsList();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao atualizar a tag");
        this.modals.modalUpdate.error = true;
      } finally {
        loader.hide();
      }
    },
    loadSelfInfo() {
      this.user_id = getUserId();
    },
  },
};
</script>
<style scoped>
.colaborator-image {
  border-radius: 50px;
  max-width: 40px;
  width: 100%;
  margin-right: 20px;
}
</style>
