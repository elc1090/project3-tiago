<template>
  <div>
    <div class="card text-center flex-grow-1">
      <div class="card-profile-image">
        <img src="/img/pages/meet.png" class="card-image my-3" alt="..." />
      </div>
      <div class="card-body mt-7 pt-3 pb-0">
        <h3 class="card-title mb-1">
          {{ meeting.subject }}
        </h3>
        <p v-if="meeting.date" class="description mt-2">
          <span v-if="meeting.date">
            <b>Data: </b> {{ formatDate(meeting.date, "LL") }}
          </span>
          <span v-if="meeting.duration" class="px-2">
            <b>Duração: </b>
            {{ formatMinutes(meeting.duration) }}
          </span>
        </p>
        <p v-else class="text-center description mt-2">
          <span v-tooltip="'Data de publicação'">
            <i class="far fa-clock mr-1" />
            {{ formatTimestamp(meeting.created_at, "lll") }}
          </span>
        </p>
      </div>
      <div
        :ref="`container_meetings_${meeting.id}`"
        class="card-footer text-center vld-parent"
      >
        <base-button type="seagreen" size="sm" @click="handleOpenModalView">
          <i class="fas fa-eye mr-2" /> Mais detalhes
        </base-button>
      </div>
    </div>
    <modal
      :show.sync="modalView.show"
      modal-classes="modal-dialog-centered modal-xl"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <h6
        id="modal-title-notification"
        slot="header"
        class="modal-title-notification"
      >
        Detalhes da reunião
      </h6>
      <div class="text-center">
        <div class="pb-2 card-profile-image">
          <img src="/img/pages/meet.png" class="card-image my-3" />
        </div>
      </div>
      <div class="text-center">
        <div v-if="role === 'admin'" class="mt-7 mb--7">
          <base-button
            type="info"
            class="p-2"
            @click="
              $router.push(`/diretoria/reunioes/${modalView.meeting.id}/editar`)
            "
          >
            <i class="fas fa-pen" /> Editar
          </base-button>
        </div>
        <h3 class="pt-2 mt-7">
          {{ modalView.meeting.subject }}
        </h3>
        <p class="description mt-1 mb-0">
          {{ modalView.meeting.description }}
        </p>
        <p v-if="modalView.meeting.responsible" class="description mt-1 mb-0">
          <b>Responsável:</b> {{ modalView.meeting.responsible }}
        </p>
        <p class="description mt-1 mb-0">
          <span v-if="modalView.meeting.date">
            <b>Data: </b> {{ formatDate(modalView.meeting.date, "LL") }}
          </span>
          <span v-if="modalView.meeting.duration" class="px-2">
            <b>Duração: </b> {{ formatMinutes(modalView.meeting.duration) }}
          </span>
        </p>
        <p v-if="modalView.meeting.local" class="description mt-1 mb-0">
          <a
            v-if="isValidHttpUrl(modalView.meeting.local)"
            :href="modalView.meeting.local"
            target="_blank"
          >
            <i class="fas fa-link" /> {{ modalView.meeting.local }}
          </a>
          <template v-else>
            <b>Local: {{ modalView.meeting.local }}</b>
          </template>
        </p>
        <p v-if="modalView.meeting.tags" class="description mt-1 mb-0">
          <b>Tags:</b>
          <badge
            v-for="tag in modalView.meeting.tags.split(';')"
            :key="`${modalView.meeting.id}_${tag}`"
            class="mx-1"
            type="primary"
          >
            {{ tag.trim() }}
          </badge>
        </p>
        <p v-if="role === 'admin'" class="description mt-1 mb-0">
          <b>Disponibilidade:</b>
          <badge v-if="modalView.meeting.teacher" class="mx-1" type="success">
            Professores
          </badge>
          <badge v-if="modalView.meeting.partner" class="mx-1" type="success">
            Parceiros
          </badge>
          <badge v-if="modalView.meeting.associate" class="mx-1" type="success">
            Associados
          </badge>
          <badge v-if="modalView.meeting.volunteer" class="mx-1" type="success">
            Voluntários
          </badge>
          <badge v-if="modalView.meeting.other" class="mx-1" type="info">
            Outros
          </badge>
        </p>
      </div>
      <div class="mt-3">
        <quill-editor
          v-model="modalView.meeting.report"
          :options="editorReadOnly"
          disabled="disabled"
          class="border rounded"
        />
        <p class="text-right description mt-3 mb-0">
          <i class="far fa-clock mr-1" /> Publicado em
          {{ formatTimestamp(modalView.meeting.created_at, "lll") }}. Atualizado
          em {{ formatTimestamp(modalView.meeting.updated_at, "lll") }}.
        </p>
      </div>
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
import { quillEditor } from "vue-quill-editor";
import api from "../services/api";

export default {
  components: {
    quillEditor,
  },
  props: {
    meeting: { type: Object, required: true },
    role: { type: String, required: false, default: "admin" },
  },
  data() {
    return {
      modalView: {
        show: false,
        meeting: "",
      },
      editorReadOnly: {
        placeholder: "...",
        readOnly: true,
        theme: "bubble",
      },
    };
  },
  methods: {
    formatMinutes(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      let text = "";
      const houresTxt = hours === 2 ? "Duas" : hours;
      if (hours) text += hours > 1 ? `${houresTxt} horas` : "Uma hora";
      if (mins) {
        if (hours) text += " e ";
        text += mins > 1 ? `${mins} minutos` : "1 minuto";
      }
      return text;
    },
    async handleOpenModalView() {
      if (this.modalView.meeting) {
        this.modalView.show = true;
        return;
      }

      const loader = this.$loading.show({
        container: this.$refs[`container_meetings_${this.meeting.id}`][0],
        width: 50,
        height: 50,
      });
      try {
        const { data } = await api.get(
          `/${this.role}/meetings/${this.meeting.id}`
        );
        this.modalView.meeting = data.meeting;
        this.modalView.meeting.other =
          this.role === "admin" &&
          (data.teachers.length ||
            data.volunteers.length ||
            data.partners.length);
        this.modalView.show = true;
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao carregar a reunião");
      } finally {
        loader.hide();
      }
    },
    openLink(link) {
      window.open(link, "file-window", "resizable=1,height=750,width=750");
    },
    isValidHttpUrl(string) {
      let url;
      try {
        url = new URL(string);
      } catch (_) {
        return false;
      }

      return url.protocol === "http:" || url.protocol === "https:";
    },
  },
};
</script>

<style scoped>
.card-image {
  width: 115px;
  height: 115px;
  border-radius: 10%;
  margin: auto;
}
.table-container {
  min-height: 150px;
}
.fab {
  color: #f6f9fc;
}
</style>
<style>
.nv-container-read-only .quill-editor .ql-container,
.nv-container-read-only .quill-editor .ql-container .ql-editor {
  min-height: 5rem;
  max-height: 10rem;
  width: 100%;
}

p > strong {
  font-weight: bold !important;
}
b {
  font-weight: bold;
}
</style>
