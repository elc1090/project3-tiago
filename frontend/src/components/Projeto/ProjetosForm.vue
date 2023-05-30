<template>
  <div>
    <div class="row">
      <div class="col-xl-8">
        <card shadow type="secondary">
          <div slot="header" class="bg-white border-0">
            <div class="row align-items-center">
              <div class="col-12">
                <h3 class="mb-0">
                  <i class="fas fa-project-diagram mr-2" /> Novo projeto
                </h3>
              </div>
            </div>
          </div>
          <template>
            <form role="form">
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
              <hr />
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
                  :disabled="!isValidModel"
                  @click="handleOpenModalConfirmation"
                >
                  Cadastrar novo projeto
                </base-button>
              </div>
            </form>
          </template>
        </card>
      </div>
    </div>
    <modal
      :show.sync="modals.modalConfirmation"
      modal-classes="modal-default modal-dialog-centered"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Atenção!
      </h6>
      <div ref="modal_confirmation" class="vld-parent">
        <div class="py-3 text-center">
          <i class="fas fa-project-diagram fa-3x" />
          <h4 class="heading mt-4">Confirmar criação</h4>
          <p class="mt-3">
            Por favor, digite
            <span class="font-weight-bold">{{ model.title }}</span>
            para prosseguir
          </p>
          <base-input
            v-model="modals.inputConfirmation"
            placeholder="Digite aqui"
            input-classes="form-control"
          />
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
          type="white text-success"
          :disabled="!inputConfirmationTextIsValid()"
          @click="handleSubmitNewProject"
        >
          Confirmar criação
        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import api from "@/services/api";
import { getUserId } from "@/services/auth";

import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import "vue-search-select/dist/VueSearchSelect.css";
import BaseButton from "../BaseButton.vue";
import { ModelSelect } from "vue-search-select";

export default {
  name: "ProjetoForm",
  components: {
    ModelSelect,
    "v-select": vSelect,
    BaseButton,
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
  computed: {
    isValidModel() {
      const project = this.model;
      if (this.endpoint !== "diretoria" && project.title) return true;
      for (const i of this.required_fields) if (!project[i]) return false;
      return true;
    },
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
    await this.loadUsersList();
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
    handleOpenModalConfirmation() {
      this.modals.inputConfirmation = "";
      this.modals.modalConfirmation = true;
    },
    async handleSubmitNewProject(e) {
      e.preventDefault();
      this.error = "";
      const loader = this.$loading.show({
        container: this.$refs.modal_confirmation,
        width: 90,
        height: 90,
        opacity: 0,
        color: "white",
      });
      try {
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };
        const data = new FormData();
        if (this.image) data.append("image", this.image, this.image.name);
        const model = Object.assign({}, this.model);
        model.responsible_id = model.responsible_id || this.user_id;

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
        await api.post(`/${this.route_role}/projects`, data, config);
        this.$toasted.show("Novo projeto cadastrado com sucesso");
        this.$router.push(`/${this.endpoint}/projetos`);
      } catch (e) {
        const genericError = "Ocorreu um erro ao cadastrar o projeto.";
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
          this.participants.teachers = data.teachers.map((t) => ({
            value: t.user_id,
            text: t.name,
            type: "teacher",
          }));
          this.editors.teachers = data.teachers.map((t) => ({
            value: t.user_id,
            text: t.name,
            type: "teacher",
          }));
          this.hasTeacher = true;
        }
        if (data.volunteers.length) {
          this.participants.volunteers = data.volunteers.map((t) => ({
            value: t.user_id,
            text: t.name,
            type: "volunteer",
          }));
          this.editors.volunteers = data.volunteers.map((t) => ({
            value: t.user_id,
            text: t.name,
            type: "volunteer",
          }));
          this.hasVolunteer = true;
        }
        this.responsibles = data.volunteers.concat(data.teachers);
        loader.hide();
      } catch (e) {
        this.$toasted.error(
          "Ocorreu um erro ao recuperar a lista de colaboradores"
        );
      }
    },
    handleSelectResponsible() {
      if (this.selectedResponsible)
        this.model.responsible_id = this.selectedResponsible.user_id;
      else this.model.responsible_id = "";
    },
    inputConfirmationTextIsValid() {
      return this.modals.inputConfirmation === this.model.title;
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
