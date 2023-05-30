<template>
  <right-sidebar
    icon="fas fa-birthday-cake fa-2x"
    title="Aniversariantes"
    @close="$emit('close')"
  >
    <div ref="birthdays_list" class="row vld-parent">
      <div class="col-lg-12 p-0 mt-4">
        <h6 class="heading-small text-muted mb-3 pl-2">
          <i class="fas fa-calendar-day mr-1" /> Hoje
          {{
            birthdays.today.length
              ? `(${formatDate(birthdays.today[0].birth, "DD/MM")})`
              : ""
          }}
        </h6>
        <div class="card table-container">
          <div class="table-responsive">
            <base-table
              class="table align-items-center table-flush"
              thead-classes="thead-light"
              tbody-classes="list"
              :data="birthdays.today"
              type="hover"
            >
              <template slot="columns">
                <th>Colaborador</th>
                <th v-if="endpoint === 'company'">WhatsApp</th>
                <th>Email</th>
              </template>
              <template slot-scope="{ row }">
                <th scope="row">
                  <router-link
                    :to="
                      endpoint === 'company'
                        ? `/empresa/colaboradores/${row.user_id}/editar`
                        : `/colaborador/colaboradores?id=${row.user_id}`
                    "
                  >
                    {{ row.name }}
                  </router-link>
                  <span v-if="getAge(row.birth) > 0 && endpoint === 'company'">
                    <span
                      v-tooltip.bottom="
                        `Colaborador nasceu em <b>${formatDate(
                          row.birth,
                          'D [de] MMMM [de] YYYY'
                        )}</b>`
                      "
                      class="d-block text-left text-muted font-weight-normal"
                    >
                      {{ getAge(row.birth) }} anos
                    </span>
                  </span>
                </th>
                <td v-if="endpoint === 'company'">
                  <whatsapp-link
                    :phone-number="row.phone"
                    :show-left-phone-icon="false"
                  />
                </td>
                <td>
                  <email-link
                    v-if="row.email"
                    :email-address="row.email"
                    :show-left-mail-icon="false"
                  />
                  <span v-else>N/A</span>
                </td>
              </template>
            </base-table>
            <div v-if="error" class="text-center text-warning mt-3">
              <p>
                {{ error }}
              </p>
            </div>
            <div v-if="emptyToday" class="text-center mt-3">
              <badge type="primary"
                >Nenhum colaborador aniversariante hoje</badge
              >
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-12 p-0 mt-4">
        <hr class="my-4" />
        <h6 class="heading-small text-muted mb-3 pl-2">
          <i class="fas fa-calendar-week mr-1" /> Essa semana
        </h6>
        <div class="card table-container">
          <div class="table-responsive">
            <base-table
              class="table align-items-center table-flush"
              thead-classes="thead-light"
              tbody-classes="list"
              :data="birthdays.thisWeek"
              type="hover"
            >
              <template slot="columns">
                <th>Data</th>
                <th>Colaborador</th>
                <th v-if="endpoint === 'company'">WhatsApp</th>
                <th>Email</th>
              </template>
              <template slot-scope="{ row }">
                <th scope="row">
                  {{ formatDate(row.birth, "DD/MM") }}
                </th>
                <th scope="row">
                  <router-link
                    :to="
                      endpoint === 'company'
                        ? `/empresa/colaboradores/${row.user_id}/editar`
                        : `/colaborador/colaboradores?id=${row.user_id}`
                    "
                  >
                    {{ row.name }}
                  </router-link>
                  <span v-if="getAge(row.birth) > 0 && endpoint === 'company'">
                    <span
                      v-tooltip.bottom="
                        `Colaborador nasceu em <b>${formatDate(
                          row.birth,
                          'D [de] MMMM [de] YYYY'
                        )}</b>`
                      "
                      class="d-block text-left text-muted font-weight-normal"
                    >
                      {{ getAge(row.birth) }} anos
                    </span>
                  </span>
                </th>
                <td v-if="endpoint === 'company'">
                  <whatsapp-link
                    :phone-number="row.phone"
                    :show-left-phone-icon="false"
                  />
                </td>
                <td>
                  <email-link
                    v-if="row.email"
                    :email-address="row.email"
                    :show-left-mail-icon="false"
                  />
                  <span v-else>N/A</span>
                </td>
              </template>
            </base-table>
            <div v-if="error" class="text-center text-warning mt-3">
              <p>
                {{ error }}
              </p>
            </div>
            <div v-if="emptyThisWeek" class="text-center mt-3">
              <badge type="primary"
                >Nenhum colaborador aniversariante essa semana</badge
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </right-sidebar>
</template>

<script>
import api from "@/services/api";

import RightSidebar from "@/components/RightSidebar";

export default {
  name: "BirthdaysSidebar",
  components: {
    RightSidebar,
  },
  props: {
    endpoint: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      birthdays: {
        today: [],
        thisWeek: [],
      },
      emptyToday: "",
      emptyThisWeek: "",
      error: "",
    };
  },
  async mounted() {
    const loader = this.$loading.show({
      container: this.$refs.birthdays_list,
      width: 100,
      height: 100,
    });
    try {
      const { data: birthdays } = await api.get(
        `/${this.endpoint}/users-birthday-stats`
      );
      if (birthdays.today.length) this.birthdays.today = birthdays.today;
      else this.emptyToday = true;
      if (birthdays.thisWeek.length)
        this.birthdays.thisWeek = birthdays.thisWeek;
      else this.emptyThisWeek = true;
    } catch (e) {
      this.error = "Ocorreu um erro ao recuperar os aniversariantes";
      this.$toasted.error(this.error);
    }
    loader.hide();
  },
  methods: {
    getAge(birth) {
      return (
        this.moment().year() -
        parseInt(this.moment(birth, "YYYY-MM-DD").format("YYYY"))
      );
    },
  },
};
</script>
<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.table-container {
  min-height: 100px;
}
</style>
