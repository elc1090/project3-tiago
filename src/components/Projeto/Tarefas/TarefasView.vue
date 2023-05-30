<template>
  <div>
    <div class="row">
      <div class="col-12">
        <card type="secondary">
          <div slot="header" class="bg-white border-0">
            <div class="row align-items-center">
              <div class="col-12">
                <h3 class="mb-0">
                  <i class="fas fa-project-diagram mr-2" /> Tarefas do projeto
                  <span class="text-warning">{{ project.title }}</span>
                </h3>
              </div>
            </div>
          </div>
          <div id="scrollable">
            <div id="vld-parent" ref="project_task">
              <div class="row m-4">
                <div v-if="!project.columns" class="col-lg-12 text-center">
                  <badge type="primary">Sem colunas até o momento</badge>
                </div>
                <div
                  v-for="(column, index) in project.columns"
                  :key="`col_${column.id}_${index}`"
                >
                  <card
                    type="secondary"
                    class="column-project ml-4 shadow-sm"
                    body-classes="pb-2"
                  >
                    <div slot="header" class="bg-white border-0">
                      <div class="row align-items-center">
                        <div class="col-12">
                          <h3 class="mb-0">
                            <span class="text-default">{{ column.title }}</span>
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div v-if="!column.tasks.length" class="text-center">
                      <badge type="primary">Sem tarefas até o momento</badge>
                    </div>
                    <div
                      v-for="(task, tk_index) in column.tasks"
                      :key="`col_${column.id}_task_${task.id}_${tk_index}`"
                    >
                      <card class="task-project mb-2 cursor">
                        <div class="row">
                          <div class="col-12">
                            <badge
                              v-for="(tag, tg_index) in task.tags"
                              :key="`task_${task.id}_tag_${tag.id}_${tg_index}`"
                              v-tooltip.bottom="tag.title"
                              :type="tag.color"
                              class="mx-1 badge mb-2"
                            >
                              {{ tag.title }}
                            </badge>
                          </div>
                        </div>
                        <div
                          class="row"
                          @click="handleOpenModalViewTask(task, column.title)"
                        >
                          <div class="col-lg-12">
                            <span class="float-right">
                              <i
                                v-tooltip.bottom="'Visualizar conteúdo'"
                                class="fas fa-eye text-primary"
                              />
                            </span>
                          </div>
                          <div class="col-lg-10">
                            {{ truncate(task.title, 50) }}
                          </div>
                          <div class="col-lg-12 tarefa-info mt-4">
                            <span v-if="task.start_date && task.end_date">
                              <i class="fas fa-calendar-day mr-2" />
                              {{ formatDate(task.start_date, "L") || "--" }}
                              -
                              {{ formatDate(task.end_date, "L") || "--" }}
                            </span>
                            <span v-else-if="task.end_date">
                              <i class="fas fa-calendar-day mr-2" /> Até
                              {{ formatDate(task.end_date, "L") }}
                            </span>
                            <span class="float-right">
                              <i
                                v-tooltip.bottom="
                                  task.status === 'pending'
                                    ? 'Tarefa pendente'
                                    : 'Tarefa concluída'
                                "
                                :class="[
                                  'fas',
                                  task.status === 'pending'
                                    ? 'fa-spinner'
                                    : 'fa-check',
                                ]"
                              />
                            </span>
                          </div>
                        </div>
                      </card>
                    </div>
                  </card>
                </div>
              </div>
            </div>
          </div>
        </card>
      </div>
    </div>
    <modal
      :show.sync="modals.modalViewTask.show"
      :modal-classes="
        endpoint === 'colaborador'
          ? 'modal-dialog-centered modal-xl'
          : 'modal-dialog-centered'
      "
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Visualizar detalhes da tarefa
      </h6>
      <div>
        <div class="py-3 text-center">
          <i class="fas fa-sticky-note fa-3x" />
          <h4 class="heading mt-4">
            Visualizar tarefa
            <span class="text-warning">
              {{ modals.modalViewTask.task.title }}
            </span>
          </h4>
        </div>
        <div ref="modal_view_task" class="vld-parent">
          <div>
            <form role="form">
              <div class="row ml-1 mt-4">
                <h6 class="heading-small text-muted">Informações básicas</h6>
              </div>
              <div class="row mx-2">
                <div class="col-lg-6">
                  <base-input
                    ref="title"
                    v-model="modals.modalViewTask.task.title"
                    disabled
                    label="Título da tarefa*"
                    placeholder="Digite o título"
                  />
                </div>
                <div class="col-lg-6">
                  <label class="form-control-label"> Status da tarefa* </label>
                  <div>
                    <base-input>
                      <select
                        v-model="modals.modalViewTask.task.status"
                        disabled
                        class="form-control"
                      >
                        <option disabled selected value="">
                          Selecione o status da tarefa
                        </option>
                        <option value="pending">Pendente</option>
                        <option value="finished">Concluída</option>
                      </select>
                    </base-input>
                  </div>
                </div>
                <div class="col-lg-6">
                  <label class="form-control-label d-block">
                    Data de início
                  </label>
                  <base-input
                    v-model="modals.modalViewTask.task.start_date"
                    disabled
                    type="date"
                  />
                </div>
                <div class="col-lg-6">
                  <base-input
                    v-model="modals.modalViewTask.task.end_date"
                    disabled
                    label="Data de término"
                    type="date"
                  />
                </div>
                <div class="col-lg-12">
                  <label class="form-control-label">
                    Descrição da tarefa
                  </label>
                  <div class="np-container-edditable">
                    <quill-editor
                      v-model="modals.modalViewTask.task.description"
                      disabled
                      :options="editorReadOnly"
                    />
                  </div>
                </div>
              </div>
              <hr class="my-4" />
              <div class="row ml-1 mt-4">
                <h6 class="heading-small text-muted">Responsável</h6>
              </div>
              <div class="row mx-2">
                <div class="col-lg-6 mt-lg-0 mt-3">
                  <label class="form-control-label d-block">Responsável</label>
                  <div v-if="selectedColaboradorEdit" class="row ml-1">
                    <div class="collaborator-image ml-1 mr-0">
                      <img
                        v-tooltip.bottom="selectedColaboradorEdit.name"
                        :src="selectedColaboradorEdit.image_url"
                        class="collaborator-image my-1"
                        alt="..."
                      />
                    </div>
                  </div>
                  <p v-else>Não definido</p>
                </div>
              </div>
              <hr class="my-4" />
              <div class="row ml-1 mt-4">
                <h6 class="heading-small text-muted">Tags</h6>
              </div>
              <label class="form-control-label ml-2">
                Tags associadas à tarefa
              </label>
              <div class="row mx-2">
                <div v-if="tags.length" class="col-lg-8">
                  <div class="row">
                    <div
                      v-for="(tag, index) in tags"
                      :key="`viewTag_${index}_${tag.id}`"
                      class="col-lg-4 mt-3"
                    >
                      <base-checkbox
                        v-if="tags[index].selected"
                        v-model="tags[index].selected"
                        class="custom-control-alternative text-left mr-1"
                        disabled
                      >
                        <span class="d-block ml--3">
                          <badge :type="tag.color">{{ tag.title }}</badge>
                        </span>
                      </base-checkbox>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="row mt-3">
            <div class="col-12">
              <p class="text-right description mt-3 mb-0">
                <i class="far fa-clock mr-1" /> Criado em
                {{
                  formatTimestamp(modals.modalViewTask.task.created_at, "lll")
                }}. Atualizado em
                {{
                  formatTimestamp(modals.modalViewTask.task.updated_at, "lll")
                }}.
              </p>
            </div>
          </div>
          <div class="row text-center mt-4">
            <div class="col-12">
              <base-alert v-if="modals.modalViewTask.error" type="danger">{{
                modals.modalViewTask.error
              }}</base-alert>
            </div>
          </div>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="dark"
          class="ml-auto"
          @click="modals.modalViewTask.show = false"
        >
          Voltar
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import api from "@/services/api";

import "vue-select/dist/vue-select.css";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

export default {
  name: "ProjetoTable",
  components: {
    quillEditor,
  },
  props: {
    endpoint: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      model: {
        column: {
          title: "",
        },
        task: {
          column_id: "",
          title: "",
          status: "",
          description: "",
          start_date: "",
          end_date: "",
          tags: [],
          responsible: "",
        },
        tag: {
          title: "",
          color: "",
        },
      },
      permissionProject: "none",
      tags: [],
      data: [],
      collaborators: [],
      error: "",
      selectedTags: [],
      selectedColaborador: "",
      selectedColaboradorEdit: "",
      project: "",
      tagThemes: [
        {
          title: "Azul",
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
      upperDropPlaceholderOptions: {
        className: "cards-drop-preview",
        animationDuration: "150",
        showOnTop: true,
      },
      dropPlaceholderOptions: {
        className: "drop-preview",
        animationDuration: "150",
        showOnTop: true,
      },
      modals: {
        modalNewTag: {
          show: false,
          error: "",
        },
        modalNewTask: {
          show: false,
          column: {},
          error: "",
        },
        modalViewTask: {
          show: false,
          task: {},
          error: "",
        },
        modalRemoveTask: {
          show: false,
          task: {},
          error: "",
        },
        modalColumn: {
          show: false,
          new: true,
          column: {
            title: "",
          },
          error: "",
        },
        modalRemoveColumn: {
          show: false,
          column: {},
          error: "",
        },
      },
      draggingColumn: {
        index: "",
        data: {},
      },
      draggingTask: {
        column: {},
        index: "",
        data: {},
      },
      editorEdittable: {
        placeholder:
          "Escreva aqui... (lembre-se, se necessário, você pode linkar arquivos pelo editor)",
      },
      editorReadOnly: {
        placeholder: "Nenhuma descrição adicionada",
        readOnly: true,
        theme: "bubble",
      },
      route_role: "",
      hasSelectedTag: false,
      filterByName: (option, label, search) => {
        const temp = search.toLowerCase();
        return option.name.toLowerCase().indexOf(temp) > -1;
      },
    };
  },
  watch: {
    "$route.params.id": async function () {
      if (this.endpoint) {
        const map = {
          diretoria: "admin",
          professor: "teacher",
          voluntario: "volunteer",
        };
        this.route_role = map[this.endpoint];
      }
      await this.loadColumns(true);
      this.modals.modalViewTask.show = false;
    },
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

    await this.loadColumns(true);
  },
  methods: {
    async loadGetPermission() {
      const loader = this.$loading.show({
        container: this.$refs.tasks_list,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.get(
          `/collaborator/projects/${this.project.parent_project_id}/get-permission`
        );
        if (data) this.permissionProject = data.permission;
        loader.hide();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar a permission");
      }
    },
    async loadColumns(loadTags) {
      const loader = this.$loading.show({
        container: this.$refs.project_task,
        width: 90,
        height: 90,
      });
      try {
        if (loadTags) await this.loadTagList();
        const { data } = await api.get(
          `/${this.route_role}/projects/${this.$route.params.id}/columns`
        );
        data.columns.forEach((col) => {
          col.tasks.forEach((tarefa) => {
            tarefa.tags.forEach((tag) => {
              const found = this.tags.find((t) => t.id === tag.project_tag_id);
              if (found) {
                tag.color = found.color;
                tag.title = found.title;
              }
            });
          });
        });
        this.project = data;
        loader.hide();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar os projetos");
      }
    },
    async loadTagList() {
      try {
        const { data } = await api.get(
          `/${this.route_role}/projects/${this.$route.params.id}/tags`
        );
        this.tags = data;
        for (const tag of this.tags) {
          tag.selected = false;
        }
      } catch (e) {
        this.error = "Ocorreu um erro ao recuperar as tags do projeto.";
        this.$toasted.error("Erro ao recuperar as informações");
      }
    },
    async handleOpenModalViewTask(task) {
      task.start_date = task.start_date
        ? this.moment(task.start_date).format("YYYY-MM-DD")
        : "";
      task.end_date = task.end_date
        ? this.moment(task.end_date).format("YYYY-MM-DD")
        : "";
      this.modals.modalViewTask.task = Object.assign({}, task);
      this.handleDeselectTag();
      this.hasSelectedTag = false;
      this.tags.forEach((tag) => {
        const found = task.tags.find((t) => t.project_tag_id === tag.id);
        if (found) {
          tag.selected = true;
          this.hasSelectedTag = true;
        }
      });
      const collaborator = this.collaborators.find(
        (collaborator) =>
          collaborator.user_id === this.modals.modalViewTask.task.responsible_id
      );
      this.selectedColaboradorEdit = collaborator ? collaborator : "";
      this.modals.modalViewTask.show = true;
    },
    truncate(text, stop = 30, clamp = "...") {
      if (!text) return "N/A";
      return text.slice(0, stop) + (stop < text.length ? clamp : "");
    },
    handleSelectResponsible() {
      if (!this.selectedColaborador) {
        this.model.task.responsible = "";
        return;
      }
      this.model.task.responsible_id = this.selectedColaborador.user_id;
    },
    handleSelectResponsibleEdit() {
      if (!this.selectedColaboradorEdit) {
        this.modals.modalViewTask.task.responsible_id = "";
        return;
      }
      this.modals.modalViewTask.task.responsible_id =
        this.selectedColaboradorEdit.user_id;
    },
    handleDeselectTag() {
      this.tags.forEach((tag) => {
        tag.selected = false;
      });
    },
    setCurrentDate(isNewTask) {
      isNewTask
        ? (this.model.task.start_date = this.moment().format("YYYY-MM-DD"))
        : (this.modals.modalViewTask.task.start_date =
            this.moment().format("YYYY-MM-DD"));
    },
  },
};
</script>
<style scoped>
.cursor {
  cursor: pointer;
}
.collaborator-image {
  border-radius: 50px;
  max-width: 40px;
  width: 100%;
  margin-right: 20px;
}
.table-container {
  min-height: 150px;
}
.column-project {
  width: 350px;
  border: "1px solid black";
  margin-bottom: 20px;
}
.task-project {
  height: 100%;
}
.cards-drop-preview {
  background-color: rgba(150, 150, 200, 0.1);
  border: 1px dashed #abc;
  margin: 5px 45px 5px 5px;
}
.drop-preview {
  background-color: rgba(150, 150, 200, 0.1);
  border: 1px dashed #abc;
  margin: 5px;
}
.new-item:hover {
  background: rgba(150, 150, 200, 0.1);
  border-radius: 6px;
}
.add-responsible {
  border-radius: 50%;
  background-color: rgba(150, 150, 200, 0.1);
}
.add-responsible:hover {
  background-color: rgba(150, 150, 200, 0.3);
}
.task-info {
  font-size: 80%;
}
#scrollable {
  overflow-x: auto;
}
</style>
<style>
p > strong {
  font-weight: bold !important;
}
.np-container-edditable .quill-editor .ql-container,
.np-container-edditable .quill-editor .ql-container .ql-editor {
  height: 6rem;
  width: 100%;
}
.responsible_select.v-select {
  background-color: #fff;
  background-clip: padding-box;
}
.responsible_select.v-select .vs__dropdown-toggle {
  padding: 0.5rem 0.1rem;
}
.responsible_select.v-select
  .vs__dropdown-toggle
  .vs__selected-options
  .vs__search {
  color: #8898aa;
  font-weight: 400;
  line-height: 1.5;
  font-size: 0.875rem;
}
</style>
