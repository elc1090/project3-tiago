<template>
  <div>
    <div class="row">
      <div class="col-xl-8 order-xl-1">
        <card shadow type="secondary">
          <div slot="header" class="bg-white border-0">
            <div class="row align-items-center">
              <div class="col-12">
                <h3 class="mb-0">
                  <i class="fas fa-project-diagram mr-2" /> Editar projeto
                  <span class="text-warning">{{ model.title }}</span>
                </h3>
              </div>
            </div>
          </div>
          <template>
            <form ref="project_form" role="form" class="vld-parent">
              <div class="row ml-1">
                <h6 class="heading-small text-muted">Informações básicas</h6>
              </div>
              <div class="row ml-2">
                <div class="col-lg-12">
                  <base-input
                    v-model.trim="model.title"
                    label="Título do projeto*"
                    placeholder="Digite o título"
                  />
                </div>
              </div>
              <div class="row ml-2">
                <file-select
                  v-model="image"
                  v-tooltip="
                    'A imagem deve possuir tamanho máximo de 2MB e, preferencialmente, ser do formato <b>PNG</b> ou <b>JPG</b> com dimensão de <b>500x500 pixels</b>.'
                  "
                  class="mt-2 col-lg-12"
                  type="secondary btn-block btn-radius"
                  icon="far fa-image"
                  title="Selecione uma imagem"
                  accept="image/*"
                  :mb-size="2"
                />
              </div>
              <div class="row ml-2">
                <p v-if="image_url" class="col-12 description">
                  <i class="fas fa-info-circle mr-2" /> Se desejar você pode
                  substituir a
                  <base-button
                    v-tooltip="'Abrir arquivo'"
                    type="link"
                    class="p-0 mt--1"
                    @click="openLink(image_url)"
                  >
                    imagem atual
                    <i class="fas fa-link ml-1" />
                  </base-button>
                </p>
              </div>
              <hr />
              <div class="row ml-2">
                <div class="col-lg-12">
                  <label class="form-control-label d-block">
                    Permissões de acesso
                    <i class="fas fa-eye ml-1" />
                  </label>
                  <div class="row">
                    <div
                      v-if="hasVolunteer > 0"
                      :class="hasTeacher > 0 ? 'col-lg-6' : 'col-lg-12'"
                    >
                      <div class="d-flex flex-row">
                        <model-select
                          v-model="participants.voluntario"
                          placeholder="Voluntários"
                          class="participants_select w-100"
                          :options="participants.volunteers"
                        />
                      </div>
                    </div>
                    <div
                      v-if="hasTeacher > 0"
                      :class="hasVolunteer > 0 ? 'col-lg-6' : 'col-lg-12'"
                    >
                      <div class="d-flex flex-row">
                        <model-select
                          v-model="participants.professor"
                          placeholder="Professores"
                          class="participants_select w-100"
                          :options="participants.teachers"
                        />
                      </div>
                    </div>
                    <div class="col-lg-12 mt-2">
                      <label class="form-control-label"> Participantes </label>
                      <div
                        class="ui fluid dropdown selection multiple participants"
                      >
                        <a
                          v-if="!participants.list.length"
                          class="text default"
                        >
                          Lista de participantes
                        </a>
                        <a
                          v-for="(participante, idx) in participants.list"
                          :key="participante.value"
                          class="ui label transition visible"
                        >
                          {{ participante.text }}
                          <i
                            class="delete icon"
                            @click="delParticipante(idx)"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-12 mt-4">
                  <label class="form-control-label d-block">
                    Permissões de editor
                    <i class="fas fa-pen ml-1" />
                  </label>
                  <div class="row">
                    <div
                      v-if="hasVolunteer > 0"
                      :class="hasTeacher > 0 ? 'col-lg-6' : 'col-lg-12'"
                    >
                      <div class="d-flex flex-row">
                        <model-select
                          v-model="editors.voluntario"
                          placeholder="Voluntários"
                          class="participants_select w-100"
                          :options="editors.volunteers"
                        />
                      </div>
                    </div>
                    <div
                      v-if="hasTeacher > 0"
                      :class="hasVolunteer > 0 ? 'col-lg-6' : 'col-lg-12'"
                    >
                      <div class="d-flex flex-row">
                        <model-select
                          v-model="editors.professor"
                          placeholder="Professores"
                          class="participants_select w-100"
                          :options="editors.teachers"
                        />
                      </div>
                    </div>
                    <div class="col-lg-12 mt-2">
                      <label class="form-control-label"> Editores </label>
                      <div
                        class="ui fluid dropdown selection multiple participants"
                      >
                        <a v-if="!editors.list.length" class="text default">
                          Lista de editores
                        </a>
                        <a
                          v-for="(participante, idx) in editors.list"
                          :key="participante.value"
                          class="ui label transition visible"
                        >
                          {{ participante.text }}
                          <i class="delete icon" @click="delEditor(idx)" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr class="my-4" />
              <div class="row ml-1">
                <h6 class="heading-small text-muted">
                  Informações complementares (opcional)
                </h6>
              </div>
              <div class="row ml-2">
                <div class="col-lg-6 mt-1">
                  <label class="form-control-label d-block">
                    Data de início
                    <base-button
                      size="sm"
                      type="link"
                      class="p-0 m-0 ml-2 float-right"
                      @click="setCurrentDate"
                    >
                      Usar data atual
                    </base-button>
                  </label>
                  <base-input
                    v-model="model.start_date"
                    type="date"
                    placeholder="Data início"
                    input-classes="form-control"
                    addon-left-icon="ni ni-calendar-grid-58"
                  />
                </div>
                <div class="col-lg-6">
                  <label class="form-control-label">Data de término</label>
                  <base-input
                    v-model="model.end_date"
                    type="date"
                    addon-left-icon="ni ni-calendar-grid-58"
                    placeholder="Data término"
                    input-classes="form-control"
                  />
                </div>
                <div class="col-lg-12">
                  <label class="form-control-label">Descrição projeto</label>
                  <textarea
                    v-model="model.description"
                    rows="3"
                    class="form-control"
                    placeholder="Faça uma breve descrição do projeto aqui..."
                  />
                </div>
                <div
                  v-if="endpoint === 'diretoria'"
                  ref="collaborators_list"
                  class="col-lg-12 vld-parent"
                >
                  <hr class="my-4" />
                  <label class="form-control-label">
                    Responsável do projeto
                  </label>
                  <v-select
                    v-model="selectedResponsible"
                    class="select"
                    placeholder="Busque por um usuário (nome)"
                    label="name"
                    :options="responsibles"
                    :filter-by="filterByNameOrEmail"
                    @input="handleSelectResponsible"
                  >
                    <template v-slot:option="option">
                      {{ option.name }}
                    </template>
                    <span slot="no-options">
                      Não há colaboradores cadastrados
                    </span>
                  </v-select>
                </div>
              </div>
              <div class="col-lg-12 ml-2">
                <hr class="my-4" />
                <base-input
                  v-model="model.note"
                  label="Observações"
                  placeholder="Observações sobre o projeto"
                />
              </div>
              <div v-if="error" class="row ml-2">
                <div class="col-lg-12 text-center">
                  <base-alert type="danger">{{ error }}</base-alert>
                </div>
              </div>
              <div class="text-right">
                <base-button
                  type="primary"
                  class="mt-4"
                  :custom="true"
                  @click="handleSubmitForm"
                >
                  Salvar alterações
                </base-button>
              </div>
              <template v-if="endpoint === 'voluntario'">
                <hr class="my-4" />
                <div class="col-12 ml-1 text-center">
                  <h6 class="heading-small text-muted">
                    <base-button
                      type="danger"
                      size="sm"
                      class="mt-4 mt-md--1 mt-sm--1"
                      icon="fas fa-trash"
                      @click="modals.modalConfirmation = true"
                    >
                      Excluir projeto
                    </base-button>
                  </h6>
                </div>
              </template>
            </form>
          </template>
        </card>
      </div>
    </div>
    <modal
      :show.sync="modals.modalConfirmation"
      modal-classes="modal-default modal-dialog-centered"
      body-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_confirmation_delete" class="vld-parent">
        <div class="py-3 text-center">
          <i class="fa fa-trash fa-3x" />
          <h4 class="heading mt-4">
            Você realmente deseja excluir o projeto
            <span class="text-warning">
              {{ model.title }}
            </span>
            ?
          </h4>
          <p class="mt-3 mb-0">
            Todas as informações relacionadas a ele serão perdidas.
          </p>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="white"
          class="ml-auto"
          @click="modals.modalConfirmation = false"
        >
          Voltar
        </base-button>
        <base-button
          type="white text-danger"
          @click="handleSubmitRemoveProject()"
        >
          Confirmar exclusão
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import api from "@/services/api.js";
import { getUserId } from "@/services/auth";
import vSelect from "vue-select";
import { ModelSelect } from "vue-search-select";
import "vue-select/dist/vue-select.css";
import "vue-search-select/dist/VueSearchSelect.css";

export default {
  name: "ProjetoProfile",
  components: {
    "v-select": vSelect,
    ModelSelect,
  },
  props: {
    endpoint: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      user_id: getUserId(),
      model: {
        title: "",
        is_visible: true,
        description: "",
        start_date: "",
        end_date: "",
        note: "",
        responsible_id: "",
      },
      image: null,
      image_url: "",
      route_role: "",
      modals: {
        modalConfirmation: false,
        inputConfirmation: "",
      },
      selectedResponsible: null,
      hasVolunteer: false,
      hasTeacher: false,
      participants: {
        voluntario: "",
        professor: "",
        volunteers: [],
        teachers: [],
        list: [],
      },
      editors: {
        voluntario: "",
        professor: "",
        volunteers: [],
        teachers: [],
        list: [],
      },
      responsibles: [],
      error: "",
      default_profile_image: "",
      filterByNameOrEmail: (option, label, search) => {
        const temp = search.toLowerCase();
        return option.name.toLowerCase().indexOf(temp) > -1;
      },
      required_fields: ["title", "responsible_id"],
    };
  },
  watch: {
    "participants.professor": function () {
      if (!this.participants.professor) return;

      const newTeacher = this.participants.teachers.find(
        (p) => p.value === this.participants.professor
      );
      this.participants.list = [...this.participants.list, newTeacher];
      this.teachers = this.participants.teachers.filter(
        (p) => p.value !== newTeacher.value
      );
      this.participants.professor = null;
    },
    "participants.voluntario": function () {
      if (!this.participants.voluntario) return;

      const newVolunteer = this.participants.volunteers.find(
        (p) => p.value === this.participants.voluntario
      );
      this.participants.list = [...this.participants.list, newVolunteer];
      this.participants.volunteers = this.participants.volunteers.filter(
        (p) => p.value !== newVolunteer.value
      );
      this.participants.voluntario = null;
    },
    "editors.professor": function () {
      if (!this.editors.professor) return;

      const newTeacher = this.editors.teachers.find(
        (p) => p.value === this.editors.professor
      );
      this.editors.list = [...this.editors.list, newTeacher];
      this.editors.teachers = this.editors.teachers.filter(
        (p) => p.value !== newTeacher.value
      );
      this.editors.professor = null;
    },
    "editors.voluntario": function () {
      if (!this.editors.voluntario) return;

      const newVolunteer = this.editors.volunteers.find(
        (p) => p.value === this.editors.voluntario
      );
      this.editors.list = [...this.editors.list, newVolunteer];
      this.editors.volunteers = this.editors.volunteers.filter(
        (p) => p.value !== newVolunteer.value
      );
      this.editors.voluntario = null;
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
    this.default_profile_image = "/img/pages/default_profile_picture.png";
    await this.loadProject();
    await this.loadUsersList();

    if (!this.responsibles.find((e) => e.user_id === this.model.responsible_id))
      this.warning = true;
  },
  methods: {
    delParticipante(index) {
      const mapPart = {
        teacher: "teachers",
        volunteer: "volunteers",
      };

      const [newParticipante] = this.participants.list.splice(index, 1);
      this.participants[mapPart[newParticipante.type]] = [
        ...this.participants[mapPart[newParticipante.type]],
        newParticipante,
      ];
    },
    delEditor(index) {
      const mapPart = {
        teacher: "teachers",
        volunteer: "volunteers",
      };

      const [newParticipante] = this.editors.list.splice(index, 1);
      this.editors[mapPart[newParticipante.type]] = [
        ...this.editors[mapPart[newParticipante.type]],
        newParticipante,
      ];
    },
    openLink(link) {
      window.open(link, "file-window", "resizable=1,height=750,width=750");
    },
    async handleSubmitForm(e) {
      e.preventDefault();
      if (
        !this.model.title ||
        (!this.model.responsible_id && this.endpoint === "diretoria")
      ) {
        this.error =
          "Por favor, preencha todos os campos obrigatórios antes de continuar.";
        return;
      }
      const loader = this.$loading.show({
        container: this.$refs.project_form,
        width: 90,
        height: 90,
      });
      try {
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };
        const data = new FormData();
        if (this.image) {
          data.append("image", this.image, this.image.name);
        }
        const model = Object.assign({}, this.model);
        model.responsible_id = model.responsible_id || this.user_id;

        delete model.image_url;
        delete model.image_key;

        if (this.selectedResponsible)
          model.responsible_id = this.selectedResponsible.user_id;
        Object.entries(model).forEach((entry) => {
          data.append(entry[0], entry[1]);
        });
        data.append(
          "participants",
          JSON.stringify(this.participants.list.map((v) => v.value))
        );
        data.append(
          "editors",
          JSON.stringify(this.editors.list.map((v) => v.value))
        );

        await api.put(
          `/${this.route_role}/projects/${this.model.id}`,
          data,
          config
        );
        this.$toasted.show("Informações atualizadas com sucesso");
        this.success = "Projeto atualizado com sucesso!";
        this.$router.push(`/${this.endpoint}/projetos`);
      } catch (e) {
        this.error =
          "Não foi possível salvar as informações. Por favor, tente novamente em alguns instantes.";
        this.$toasted.error("Ocorreu um erro ao salvar as informações");
      }
      loader.hide();
    },
    async handleSubmitRemoveProject() {
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation_delete,
        width: 160,
        height: 160,
        opacity: 0,
      });
      try {
        await api.delete(`/${this.route_role}/projects/${this.model.id}`);
        this.$toasted.show("Projeto removido com sucesso");
        this.$router.push(`/${this.endpoint}/projetos`);
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao remover o projeto");
      } finally {
        loader.hide();
      }
    },
    async loadUsersList() {
      const loader = this.$loading.show({
        container: this.$refs.collaborators_list,
        width: 150,
        height: 150,
        opacity: 0,
      });
      try {
        const { data } = await api.get(`/${this.route_role}/projects/users`);
        if (data.teachers.length) {
          this.participants.teachers = data.teachers
            .filter(
              (t) => !this.participants.list.find((a) => a.value === t.user_id)
            )
            .map((t) => ({
              value: t.user_id,
              text: t.name,
              type: "teacher",
            }));
          this.editors.teachers = data.teachers
            .filter(
              (t) => !this.editors.list.find((a) => a.value === t.user_id)
            )
            .map((t) => ({
              value: t.user_id,
              text: t.name,
              type: "teacher",
            }));
          this.hasTeacher = true;
        }
        if (data.volunteers.length) {
          this.participants.volunteers = data.volunteers
            .filter(
              (t) => !this.participants.list.find((a) => a.value === t.user_id)
            )
            .map((t) => ({
              value: t.user_id,
              text: t.name,
              type: "volunteer",
            }));
          this.editors.volunteers = data.volunteers
            .filter(
              (t) => !this.editors.list.find((a) => a.value === t.user_id)
            )
            .map((t) => ({
              value: t.user_id,
              text: t.name,
              type: "volunteer",
            }));
          this.hasVolunteer = true;
        }
        this.responsibles = data.volunteers.concat(data.teachers);
        this.selectedResponsible = this.responsibles.find(
          (r) => r.user_id === this.model.responsible_id
        );
        loader.hide();
      } catch (e) {
        this.$toasted.error(
          "Ocorreu um erro ao recuperar a lista de colaboradores"
        );
      } finally {
        loader.hide();
      }
    },
    async loadProject() {
      const loaderForm = this.$loading.show({
        container: this.$refs.project_form,
        width: 90,
        height: 90,
      });
      try {
        const {
          data: { project, participants },
        } = await api.get(
          `/${this.route_role}/projects/${this.$route.params.id}`
        );
        project.start_date = project.start_date
          ? this.moment(project.start_date).format("YYYY-MM-DD")
          : "";
        project.end_date = project.end_date
          ? this.moment(project.end_date).format("YYYY-MM-DD")
          : "";
        project.is_visible = Boolean(project.is_visible);
        this.image_url = project.image_url;
        Object.assign(this.model, project);
        participants.forEach((user) => {
          if (user.permission === "write") {
            this.editors.list.push({
              value: user.participant_id,
              text: user.name,
              type: user.role,
            });
          } else if (user.permission === "read") {
            this.participants.list.push({
              value: user.participant_id,
              text: user.name,
              type: user.role,
            });
          }
        });

        this.model = project;

        loaderForm.hide();
      } catch (e) {
        this.error = "Ocorreu um erro ao recuperar as informações do projeto.";
        this.$toasted.error("Erro ao recuperar as informações");
      }
    },
    handleSelectResponsible() {
      if (this.selectedResponsible)
        this.model.responsible_id = this.selectedResponsible.user_id;
      else this.model.responsible_id = "";
    },
    setCurrentDate() {
      this.model.start_date = this.moment().format("YYYY-MM-DD");
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
.btn-radius {
  border-radius: 10px;
  border: 2px solid #eaeaea;
}
</style>
<style>
.select.v-select {
  background-color: #fff;
  background-clip: padding-box;
}
.select.v-select .vs__dropdown-toggle {
  padding: 0.5rem 0.1rem;
}
.select.v-select .vs__dropdown-toggle .vs__selected-options .vs__search {
  color: #8898aa;
  font-weight: 400;
  line-height: 1.5;
  font-size: 0.875rem;
}
.participants_select.v-select {
  background-color: #fff;
  background-clip: padding-box;
}
.participants_select.v-select .vs__dropdown-toggle {
  padding: 0.5rem 0.1rem;
  min-width: 100%;
}
.participants_select.v-select
  .vs__dropdown-toggle
  .vs__selected-options
  .vs__search {
  color: #8898aa;
  font-weight: 400;
  line-height: 1.5;
  font-size: 0.875rem;
}
</style>
