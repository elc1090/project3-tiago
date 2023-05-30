<template>
  <div>
    <div class="container-fluid mt--7">
      <div class="row">
        <div v-if="nextEvents.length" class="col-lg-4 order-xl-2 mb-4 mb-xl-0">
          <card shadow body-classes="pb-2">
            <div slot="header" class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-lg-12">
                  <h3 class="mb-0">Próximos eventos no mês</h3>
                </div>
              </div>
            </div>
            <template>
              <card
                v-for="event in nextEvents"
                :key="event.id"
                shadow
                class="mb-3"
                body-classes="pb-2"
              >
                <div slot="header" class="bg-white border-0">
                  <div class="row align-items-center">
                    <div class="col-lg-12">
                      <h3 class="mb-0 h4">
                        <i class="fas fa-comments mr-2" /> {{ event.title }}
                      </h3>
                    </div>
                  </div>
                </div>
                <template>
                  <p class="description mb-1">
                    <i class="fas fa-calendar-day mr-2" /> <b>Quando? </b>
                    {{ formatDate(event.start, "LL") }}
                    <span v-if="event.end && event.start != event.end"
                      >até {{ formatDate(event.end, "LL") }}</span
                    >
                  </p>
                  <p v-if="event.start_hour" class="description mb-1">
                    <i class="fas fa-clock mr-2" /> <b>Início: </b>
                    {{ event.start_hour }}
                  </p>
                  <p v-if="event.end_hour" class="description mb-2">
                    <i class="fas fa-clock mr-2" /> <b>Fim: </b>
                    {{ event.end_hour }}
                  </p>
                  <p class="description mb-1">
                    <base-button
                      type="link"
                      class="p-0 m-0"
                      @click="getEventParticipants(event.id)"
                      >Mais detalhes</base-button
                    >
                  </p>
                </template>
              </card>
              <p v-if="!all" class="description text-right mb-2">
                <base-button
                  type="link"
                  class="p-0 m-0"
                  @click="loadAllEvents()"
                  >Carregar mais</base-button
                >
              </p>
            </template>
          </card>
        </div>
        <div class="col-lg-8 order-xl-1">
          <card shadow>
            <div slot="header" class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-lg-12">
                  <h3 class="mb-0">
                    <i class="fas fa-calendar-day mr-2" /> Agenda
                    <span class="text-success">de eventos</span>
                    <div
                      class="btn-group float-right pt-2"
                      role="group"
                      aria-label="Ações"
                    >
                      <base-button
                        size="sm"
                        type="seagreen"
                        @click.stop="handleOpenModalAddNewEvent()"
                        >Criar evento <i class="fas fa-plus ml-1" />
                      </base-button>
                    </div>
                  </h3>
                </div>
              </div>
            </div>
            <template>
              <FullCalendar :options="calendarOptions" />
            </template>
          </card>
        </div>
      </div>
    </div>

    <modal
      v-if="modals.viewEvent.event"
      :show.sync="modals.viewEvent.show"
      modal-classes="modal-dialog-centered"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <div class="d-flex justify-content-between">
        <h6 id="modal-title-notification" slot="header" class="modal-title">
          Detalhes do evento
        </h6>
        <div class="d-flex justify-content-between align-items-center">
          <i
            v-if="modals.viewEvent.event.user_id == user_id"
            v-tooltip="'Excluir evento'"
            class="far fa-trash-alt float-right ml-1 text-warning mt-2 mr-2"
            @click="handleOpenDeleteEventModal(modals.viewEvent.event.id)"
          />
          <i
            v-tooltip="'Fechar'"
            class="fas fa-times fa-close float-right ml-1 text-primary mt-2 mr-2"
            @click="handleCloseViewModal"
          />
        </div>
      </div>
      <div class="p-3">
        <template>
          <div slot="header" class="bg-white border-0">
            <div class="row align-items-center">
              <div class="col-lg-12">
                <h3 class="mb-0 h4">
                  <i class="fas fa-comments mr-2" />
                  {{ modals.viewEvent.event.title }}
                </h3>
              </div>
            </div>
          </div>
          <hr class="mt-3 mb-4" />
          <template>
            <p class="description mb-2">
              <i class="fas fa-calendar-day mr-2" /> <b>Quando? </b>
              {{ formatDate(modals.viewEvent.event.start, "LL") }}
              <span
                v-if="
                  modals.viewEvent.event.end &&
                  modals.viewEvent.event.start != modals.viewEvent.event.end
                "
                >até {{ formatDate(modals.viewEvent.event.end, "LL") }}</span
              >
            </p>

            <p
              v-if="modals.viewEvent.event.start_hour"
              class="description mb-2"
            >
              <i class="fas fa-clock mr-2" /> <b>Início: </b>
              {{ modals.viewEvent.event.start_hour }}
            </p>
            <p v-if="modals.viewEvent.event.end_hour" class="description mb-2">
              <i class="fas fa-clock mr-2" /> <b>Fim: </b>
              {{ modals.viewEvent.event.end_hour }}
            </p>
            <p v-if="modals.viewEvent.event.location" class="description mb-2">
              <i class="fas fa-map mr-2" /> <b>Local do evento: </b>
              {{ modals.viewEvent.event.location }}
            </p>
            <p v-if="modals.viewEvent.event.details" class="description mb-2">
              <i class="fas fa-clipboard-list mr-2" /> <b>Detalhes: </b>
              {{ modals.viewEvent.event.details }}
            </p>
            <p v-if="modals.viewEvent.names.length" class="description mb-2">
              <i class="fas fa-users mr-2" /> <b>Participantes: </b>
            </p>
            <div v-for="(name, index) in modals.viewEvent.names" :key="index">
              <span class="description ml-2">- {{ name }}</span>
            </div>
          </template>
        </template>
      </div>
    </modal>
    <modal
      :show.sync="modals.deleteEvent.show"
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
            Você realmente deseja excluir este evento?
          </h4>
        </div>
      </div>
      <template slot="footer">
        <base-button
          type="link"
          text-color="white"
          class="ml-auto"
          @click="modals.deleteEvent.show = false"
        >
          Voltar
        </base-button>
        <base-button
          type="white text-danger"
          @click="handleDeleteEvent(modals.deleteEvent.idDelete)"
        >
          Confirmar exclusão
        </base-button>
      </template>
    </modal>
    <event-sidebar
      v-show="modals.addNewEvent.show"
      :background-color="'white'"
      @close="modals.addNewEvent.show = false"
      @update="loadEvents"
    />
  </div>
</template>
<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import bootstrapPlugin from "@fullcalendar/bootstrap";

import EventSidebar from "./EventSidebar";

import api from "@/services/api.js";
import { getRoles } from "@/services/auth";
import { getUserId } from "../../services/auth";

export default {
  name: "AgendaView",
  components: {
    FullCalendar,
    EventSidebar,
  },
  data() {
    return {
      model: {
        calendar_id: "",
      },
      events: [],
      all: false,
      calendarOptions: {
        displayEventTime: false,

        headerToolbar: {
          center: "title",
          left: "prev,next",
          right: "listYear,dayGridMonth",
        },
        eventClick: this.handleEventClick,
        eventsSet: this.handleEventsSet,
        initialView: "dayGridMonth",
        plugins: [
          dayGridPlugin,
          listPlugin,
          googleCalendarPlugin,
          bootstrapPlugin,
        ],
        locale: ptBrLocale,
        googleCalendarApiKey: "AIzaSyBah7Sg6aUqKIY4uA9x2_DfCTCCpTmaojs",
        eventSources: [],
        themeSystem: "bootstrap",
        height: 700,
      },
      modals: {
        addNewEvent: {
          show: false,
        },
        viewEvent: {
          show: false,
          event: null,
          names: [],
        },
        deleteEvent: { show: false, idDelete: null },
      },
      role: "",
      user_id: null,
    };
  },
  computed: {
    nextEvents() {
      const futureEvents = this.events.filter((event) =>
        this.moment(event.start).isSameOrAfter(this.moment())
      );
      futureEvents.sort((a, b) => {
        const date_a = this.moment(a.start);
        const date_b = this.moment(b.start);
        if (date_a.isBefore(date_b)) return -1;
        else if (date_a.isAfter(date_b)) return 1;
        return 0;
      });
      if (this.all) return futureEvents;
      return futureEvents.slice(0, 3);
    },
  },
  async mounted() {
    this.getFullPathBasedOnRole();
    this.loadEvents();
    this.user_id = getUserId();
  },
  methods: {
    async loadEvents() {
      try {
        const { data } = await api.get(`${this.role}/events`);

        this.events = data;

        this.calendarOptions.eventSources = [];
        this.calendarOptions.eventSources.push({
          events: this.events,
          color: "yellow",
          textColor: "black",
        });
      } catch (err) {
        this.$toasted.error("Ocorreu um erro ao carregar os eventos");
      }
    },
    handleOpenDeleteEventModal(id) {
      this.modals.deleteEvent.show = true;
      this.modals.deleteEvent.idDelete = id;
    },
    async handleDeleteEvent(id) {
      try {
        await api.delete(`${this.role}/events/${id}`);
        this.loadEvents();
        this.modals.deleteEvent.show = false;
        this.modals.viewEvent.show = false;
      } catch (err) {
        this.$toasted.error("Ocorreu um erro ao excluir o evento");
      }
    },
    getFullPathBasedOnRole() {
      const roles = getRoles();

      if (roles) {
        const role = JSON.parse(roles)[0];
        this.role = role;
      }
    },

    handleOpenModalViewEvent(event, names) {
      this.modals.viewEvent.show = true;
      this.modals.viewEvent.event = event;
      this.modals.viewEvent.names = names;
    },
    handleOpenModalAddNewEvent() {
      this.modals.addNewEvent.show = true;
    },
    handleEventClick: async function (info) {
      this.getEventParticipants(info.event.id);
    },

    handleCloseViewModal() {
      this.modals.viewEvent.show = false;
      this.modals.viewEvent.event = null;
    },

    async getEventParticipants(id) {
      const {
        data: { event, names },
      } = await api.get(`${this.role}/events/${id}`);

      this.handleOpenModalViewEvent(event, names);
    },

    loadAllEvents() {
      this.all = true;
      this.$toasted.show("Os próximos eventos foram carregados");
    },
  },
};
</script>
<style scoped>
.navbar {
  z-index: 1000 !important;
}
.navbar-vertical.navbar-expand-xs {
  width: 100%;
  max-width: 500px !important;
}
.fa-close {
  font-size: 1.5em;
  cursor: pointer;
}
</style>
<style scoped></style>
