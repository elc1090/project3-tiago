<template>
  <right-sidebar
    icon="fas fa-calendar-day fa-2x"
    title="Dados do evento"
    @close="handleClose()"
  >
    <div class="row">
      <div class="col-lg-12">
        <base-input
          v-model="model.title"
          label="Nome do evento"
          placeholder="Digite o nome do evento"
        />
      </div>
      <div class="col-6">
        <label class="form-control-label d-block">
          Data de início do evento
        </label>
        <base-input
          v-model="model.start"
          addon-left-icon="fas fa-calendar"
          type="date"
        />
      </div>
      <div class="col-6">
        <label class="form-control-label d-block">Data de fim do evento</label>
        <base-input
          v-model="model.end"
          addon-left-icon="fas fa-calendar"
          type="date"
        />
      </div>
      <div class="col-12">
        <label class="form-control-label d-block">Adicionar horário?</label>
        <base-switch
          class="mb-4 mx-auto d-block"
          :value="showHour"
          @input="showHourChangedHandler($event)"
        />
      </div>
    </div>
    <div v-show="showHour" class="row">
      <div class="col-6">
        <label class="form-control-label d-block">
          Hora de início do evento
        </label>
        <base-input
          v-model="model.start_hour"
          addon-left-icon="fas fa-clock"
          type="time"
        />
      </div>
      <div class="col-6">
        <label class="form-control-label d-block">Hora de fim do evento</label>
        <base-input
          v-model="model.end_hour"
          addon-left-icon="fas fa-clock"
          type="time"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <label class="form-control-label d-block">Local do evento</label>
        <base-input
          v-model="model.location"
          addon-left-icon="fas fa-map-marker-alt"
          placeholder="Local do evento"
        />
      </div>
      <div class="col-lg-12">
        <base-input label="Detalhes">
          <textarea
            v-model="model.details"
            rows="2"
            class="form-control"
            placeholder="Escreva aqui os detalhes"
          />
        </base-input>
      </div>
      <div v-if="role === 'admin'" class="col-lg-12">
        <span class="form-control-label">Participantes</span>
        <div class="row pl-lg-4">
          <div class="col-lg-6 mt-3">
            <div class="d-flex flex-row">
              <model-select
                v-model="professor"
                placeholder="Professores"
                class="participants_select w-100"
                :is-disabled="model.teacher"
                :options="professores"
              />
              <div class="d-flex align-items-center ml-1">
                <base-checkbox
                  v-model="model.teacher"
                  class="p-0 ml-5 mr--4"
                  name="professor"
                />
              </div>
            </div>
          </div>
          <div class="col-lg-6 mt-3">
            <div class="d-flex flex-row">
              <model-select
                v-model="parceiro"
                placeholder="Parceiros"
                class="participants_select w-100"
                :is-disabled="model.partner"
                :options="parceiros"
              />
              <div class="d-flex align-items-center ml-1">
                <base-checkbox
                  v-model="model.partner"
                  class="p-0 ml-5 mr--4"
                  name="parceiro"
                />
              </div>
            </div>
          </div>
          <div class="col-lg-6 mt-3">
            <div class="d-flex flex-row">
              <model-select
                v-model="associado"
                placeholder="Associados"
                class="participants_select w-100"
                :is-disabled="model.associate"
                :options="associados"
              />
              <div class="d-flex align-items-center ml-1">
                <base-checkbox
                  v-model="model.associate"
                  class="p-0 ml-5 mr--4"
                  name="associado"
                />
              </div>
            </div>
          </div>
          <div class="col-lg-6 mt-3">
            <div class="d-flex flex-row">
              <model-select
                v-model="voluntario"
                placeholder="Voluntarios"
                class="participants_select w-100"
                :is-disabled="model.volunteer"
                :options="voluntarios"
              />
              <div class="d-flex align-items-center ml-1">
                <base-checkbox
                  v-model="model.volunteer"
                  class="p-0 ml-5 mr--4"
                  name="voluntario"
                />
              </div>
            </div>
          </div>
          <div class="col-lg-6 mt-3">
            <div class="d-flex flex-row">
              <model-select
                v-model="aluno"
                placeholder="Alunos"
                class="participants_select w-100"
                :is-disabled="model.student"
                :options="alunos"
              />
              <div class="d-flex align-items-center ml-1">
                <base-checkbox
                  v-model="model.student"
                  class="p-0 ml-5 mr--4"
                  name="aluno"
                />
              </div>
            </div>
          </div>
          <div class="col-lg-12 mt-4 mb-4">
            <label class="form-control-label">
              Usuários inclusos no evento
            </label>
            <div class="ui fluid dropdown selection multiple participants">
              <a v-if="!participantes.length" class="text default">
                Lista de participantes
              </a>
              <a
                v-for="(participante, idx) in participantes"
                :key="participante.value"
                class="ui label transition visible"
              >
                {{ participante.text }}
                <i class="delete icon" @click="delParticipante(idx)" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-12 text-center">
        <base-button
          type="seagreen"
          :disabled="!model.start || !model.title"
          @click="submitNewEvent()"
        >
          Salvar evento
        </base-button>
      </div>
      <div class="col-12 text-right">
        <hr class="my-4" />
        <base-button type="link" size="sm" @click="cleanFields()">
          Limpar campos
        </base-button>
      </div>
    </div>
  </right-sidebar>
</template>
<script>
import "vue-select/dist/vue-select.css";

import api from "@/services/api";
import RightSidebar from "@/components/RightSidebar";

import { ModelSelect } from "vue-search-select";
import "vue-search-select/dist/VueSearchSelect.css";

import { getRoles } from "@/services/auth";

export default {
  name: "EventSidebar",
  components: {
    ModelSelect,
    RightSidebar,
  },
  data() {
    return {
      participantes: [],
      professores: [],
      parceiros: [],
      associados: [],
      voluntarios: [],
      alunos: [],
      professor: "",
      parceiro: "",
      associado: "",
      voluntario: "",
      aluno: "",
      model: {
        teacher: false,
        partner: false,
        associate: false,
        volunteer: false,
        student: false,
        title: "",
        start: "",
        end: "",
        start_hour: "",
        end_hour: "",
        details: "",
        location: "",
      },
      showHour: false,
      close: true,
      role: "",
    };
  },
  watch: {
    professor() {
      if (!this.professor) return;

      const newUser = this.professores.find((p) => p.value === this.professor);
      this.participantes = [...this.participantes, newUser];
      this.professores = this.professores.filter(
        (p) => p.value !== newUser.value
      );
      this.professor = null;
      this.close = false;
    },
    parceiro() {
      if (!this.parceiro) return;

      const newUser = this.parceiros.find((p) => p.value === this.parceiro);
      this.participantes = [...this.participantes, newUser];
      this.parceiros = this.parceiros.filter((p) => p.value !== newUser.value);
      this.parceiro = null;
      this.close = false;
    },
    voluntario() {
      if (!this.voluntario) return;

      const newUser = this.voluntarios.find((p) => p.value === this.voluntario);
      this.participantes = [...this.participantes, newUser];
      this.voluntarios = this.voluntarios.filter(
        (p) => p.value !== newUser.value
      );
      this.voluntario = null;
      this.close = false;
    },
    aluno() {
      if (!this.aluno) return;

      const newUser = this.alunos.find((p) => p.value === this.aluno);
      this.participantes = [...this.participantes, newUser];
      this.alunos = this.alunos.filter((p) => p.value !== newUser.value);
      this.aluno = null;
      this.close = false;
    },
    associado() {
      if (!this.associado) return;

      const newUser = this.associados.find((p) => p.value === this.associado);
      this.participantes = [...this.participantes, newUser];
      this.associados = this.associados.filter(
        (p) => p.value !== newUser.value
      );
      this.associado = null;
      this.close = false;
    },
  },
  async mounted() {
    this.getFullPathBasedOnRole();
    const loader = this.$loading.show({
      container: this.$refs.publicacao_container,
      width: 90,
      height: 90,
    });
    try {
      const { data } = await api.get(`/${this.role}/events/users`);
      this.professores = data.teachers.map((t) => ({
        value: t.user_id,
        text: t.name,
        type: "teacher",
      }));
      this.voluntarios = data.volunteers.map((t) => ({
        value: t.user_id,
        text: t.name,
        type: "volunteer",
      }));
      this.parceiros = data.partners.map((t) => ({
        value: t.user_id,
        text: t.name,
        type: "partner",
      }));
      this.associados = data.associates.map((t) => ({
        value: t.user_id,
        text: t.name,
        type: "associate",
      }));
      this.alunos = data.students.map((t) => ({
        value: t.user_id,
        text: t.name,
        type: "student",
      }));
    } catch (e) {
      const genericError = "Ocorreu um erro ao buscar os usuários.";
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
      this.$toasted.error(genericError);
    } finally {
      loader.hide();
    }
  },
  methods: {
    getFullPathBasedOnRole() {
      const roles = getRoles();

      if (roles) {
        const role = JSON.parse(roles)[0];
        this.role = role;
      }
    },
    handleClose() {
      if (this.close) this.$emit("close");
      else this.close = true;
    },
    delParticipante(index) {
      const mapPart = {
        teacher: "professores",
        partner: "parceiros",
        associate: "associados",
        volunteer: "voluntarios",
        student: "alunos",
      };

      const [newParticipante] = this.participantes.splice(index, 1);
      this[mapPart[newParticipante.type]] = [
        ...this[mapPart[newParticipante.type]],
        newParticipante,
      ];
    },
    showHourChangedHandler(event) {
      if (typeof event === "boolean") {
        this.showHour = event;
        if (!event) {
          this.model.start_hour = "";
          this.model.end_hour = "";
        }
      }
    },
    cleanFields() {
      this.model = {
        teacher: false,
        partner: false,
        associate: false,
        volunteer: false,
        student: false,
        title: "",
        start: "",
        end: "",
        start_hour: "",
        end_hour: "",
        details: "",
        location: "",
      };
      this.participantes = [];
      this.professores = [];
      this.parceiros = [];
      this.voluntarios = [];
      this.alunos = [];
    },
    async submitNewEvent() {
      try {
        const event = this.model;
        //event.start_hour = "1970-01-01 " + event.start_hour + ":00";
        //event.end_hour = "1970-01-01 " + event.end_hour + ":00";
        await api.post(`/${this.role}/events`, {
          ...event,
          participants: this.participantes.map((p) => p.value),
        });
        this.close = true;
        this.handleClose();
        this.cleanFields();
        this.$toasted.success("O evento foi salvo com sucesso!");
        this.$emit("update");
      } catch (err) {
        this.$toasted.error("Ocorreu um erro ao salvar o evento");
      }
    },
  },
};
</script>
