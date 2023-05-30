<template>
  <div>
    <div class="row">
      <div class="col-12 text-center mb-2">
        <base-button
          v-if="endpoint === 'professor'"
          :custom="true"
          size="sm"
          class="text-center"
          type="primary"
          @click="$router.push(`/${endpoint}/projetos/novo`)"
        >
          <i class="fas fa-plus mr-1" /> Cadastrar novo projeto
        </base-button>
      </div>
    </div>
    <div
      v-if="endpoint === 'professor' || endpoint === 'voluntario'"
      class="mt-5"
    >
      <div class="col-12">
        <h2 class="">MEUS PROJETOS</h2>
      </div>
      <div class="row">
        <div class="col-12">
          <p v-if="myProjects.length === 0" class="text-center my-0">
            Você não possui nenhum projeto!
          </p>
          <div class="card-deck">
            <div
              v-for="project in myProjects"
              :key="project.id"
              class="col-xl-3 col-lg-3 col-md-4 mb-5 d-flex align-items-stretch"
            >
              <card-root :title="project.title" :image_url="project.image_url">
                <p v-if="project.description" class="card-text mt-2 mb-0 mx--2">
                  <span :title="project.description">{{
                    truncate(project.description)
                  }}</span>
                </p>
                <p class="description mb-0 mx--2">
                  <span class="font-weight-500">Responsável: </span>
                  {{ project.responsible_name }}
                </p>
                <p v-if="project.start_date" class="description mb-0 mx--2">
                  <span class="font-weight-500">Início: </span>
                  {{ formatDate(project.start_date, "L") }}
                </p>
                <p v-if="project.end_date" class="description mb-0 mx--2">
                  <span class="font-weight-500">Fim: </span>
                  {{ formatDate(project.end_date, "L") }}
                </p>
                <template slot="footer">
                  <div class="row">
                    <div class="col-12 text-center" />
                    <div class="col-12">
                      <base-button
                        v-if="project.responsible_id === my_id"
                        class="btn btn-white btn-sm float-left"
                        @click="
                          $router.push(
                            `/${endpoint}/projetos/${project.id}/editar`
                          )
                        "
                      >
                        <i class="far fa-edit" />
                      </base-button>
                      <router-link
                        v-tooltip="
                          'Clique para abrir o projeto e ver as tarefas'
                        "
                        :to="
                          project.permission === 'read'
                            ? `/${endpoint}/projetos/${project.id}/visualizar-tarefas`
                            : `/${endpoint}/projetos/${project.id}/tarefas`
                        "
                        class="btn btn-primary btn-radius btn-sm float-right"
                      >
                        Acessar
                      </router-link>
                    </div>
                  </div>
                </template>
              </card-root>
            </div>
          </div>
          <hr class="my-2" />
        </div>
      </div>
      <div class="col-12">
        <h2 class="">OUTROS PROJETOS</h2>
      </div>
      <div class="row">
        <div class="col-12">
          <p v-if="projects.length === 0" class="text-center text-warning mt-3">
            Você não possui acesso há outros projetos!
          </p>
          <div class="card-deck">
            <div
              v-for="project in projects"
              :key="project.id"
              class="col-xl-3 col-lg-3 col-md-4 mb-5 d-flex align-items-stretch"
            >
              <card-root :title="project.title" :image_url="project.image_url">
                <p v-if="project.description" class="card-text mt-2 mb-0 mx--2">
                  <span :title="project.description">{{
                    truncate(project.description)
                  }}</span>
                </p>
                <p class="description mb-0 mx--2">
                  <span class="font-weight-500">Responsável: </span>
                  {{ project.responsible_name }}
                </p>
                <p v-if="project.start_date" class="description mb-0 mx--2">
                  <span class="font-weight-500">Início: </span>
                  {{ formatDate(project.start_date, "L") }}
                </p>
                <p v-if="project.end_date" class="description mb-0 mx--2">
                  <span class="font-weight-500">Fim: </span>
                  {{ formatDate(project.end_date, "L") }}
                </p>
                <template slot="footer">
                  <div class="row">
                    <div class="col-12 text-center" />
                    <div class="col-12">
                      <router-link
                        v-tooltip="
                          'Clique para abrir o projeto e ver as tarefas'
                        "
                        :to="
                          project.permission === 'read'
                            ? `/${endpoint}/projetos/${project.id}/visualizar-tarefas`
                            : `/${endpoint}/projetos/${project.id}/tarefas`
                        "
                        class="btn btn-primary btn-radius btn-sm float-right"
                      >
                        Acessar
                      </router-link>
                    </div>
                  </div>
                </template>
              </card-root>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="endpoint === 'diretoria'" class="row">
      <div class="col-12">
        <div
          ref="projects_table"
          class="card shadow table-container vld-parent"
        >
          <div class="card-header border-0">
            <div class="row align-items-center">
              <div class="col-12">
                <h3 class="mb-0">
                  <i class="fas fa-project-diagram mr-2" /> Lista de
                  <span class="text-warning">projetos</span>
                  <base-button
                    :custom="true"
                    size="sm"
                    class="float-right"
                    type="primary"
                    @click="$router.push(`/${endpoint}/projetos/novo`)"
                  >
                    <i class="fas fa-plus mr-1" /> Cadastrar novo projeto
                  </base-button>
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
                <th>Projeto</th>
                <th>Responsável</th>
                <th>Início</th>
                <th>Término</th>
                <th>Ações</th>
              </template>
              <template slot-scope="{ row, index }">
                <td class="py-4">{{ index + 1 }}</td>
                <th scope="row">
                  <router-link
                    :to="`/${endpoint}/projetos/${row.id}/tarefas`"
                    class="btn btn-link p-0 m-0"
                  >
                    {{ row.title }}
                  </router-link>
                </th>
                <td>
                  <router-link
                    v-if="endpoint !== 'colaborador' && row.responsible_name"
                    :to="`/${endpoint}/usuarios/${row.responsible_id}/visualizar`"
                    class="btn btn-link p-0 m-0"
                  >
                    {{ row.responsible_name }}
                  </router-link>
                  <div v-else-if="row.responsible_name">
                    {{ row.responsible_name }}
                  </div>
                  <span v-else v-tooltip="'Não atribuído'"> - </span>
                </td>
                <td>
                  <span
                    v-if="row.start_date"
                    v-tooltip="'Data de início'"
                    class="mr-2"
                  >
                    {{ formatDate(row.start_date, "LL") }}
                  </span>
                  <span v-else>-</span>
                </td>
                <td>
                  <span
                    v-if="row.end_date"
                    v-tooltip="'Data de término'"
                    class="mr-2"
                  >
                    {{ formatDate(row.end_date, "LL") }}
                  </span>
                  <span v-else>-</span>
                </td>
                <td>
                  <router-link
                    v-tooltip.bottom="'Gerenciar tags'"
                    :to="`/${endpoint}/projetos/${row.id}/tags`"
                    class="btn btn-white py-1 px-2"
                  >
                    <i class="fas fa-tags text-success" />
                  </router-link>
                  <router-link
                    v-tooltip.bottom="'Gerenciar tarefas'"
                    :to="`/${endpoint}/projetos/${row.id}/tarefas`"
                    class="btn btn-white py-1 px-2"
                  >
                    <i class="fas fa-columns text-warning" />
                  </router-link>
                  <router-link
                    v-tooltip.bottom="'Editar propriedades do projeto'"
                    :to="`/${endpoint}/projetos/${row.id}/editar`"
                    class="btn btn-white py-1 px-2"
                  >
                    <i class="fas fa-edit text-info" />
                  </router-link>
                </td>
              </template>
            </base-table>
            <p v-if="empty" class="text-center text-warning mt-3">
              Não há projetos cadastrados até o momento
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!empty" class="row">
      <div class="col-12 text-muted text-right mt-4">
        <b>{{ tableData.length }}</b> projetos cadastrados ao total
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/services/api";
import { getUserId } from "@/services/auth";
import CardRoot from "@/components/CardRoot.vue";

export default {
  name: "ProjetoTable",
  components: {
    CardRoot,
  },
  props: {
    endpoint: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      my_id: Number(getUserId()),
      myProjects: [],
      projects: [],
      tableData: [],
      empty: false,
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
    const loader = this.$loading.show({
      container: this.$refs.projects_table,
      width: 90,
      height: 90,
    });
    try {
      if (!this.endpoint) return;

      const { data } = await api.get(`/${this.route_role}/projects`);
      if (data.length) {
        this.tableData = data;
        this.myProjects = data.filter(
          (project) => project.responsible_id === this.my_id
        );
        this.projects = data.filter(
          (project) => project.responsible_id !== this.my_id
        );
      }
      this.empty = !data.length;
      loader.hide();
    } catch (e) {
      this.$toasted.error("Ocorreu um erro ao recuperar os projetos");
    }
  },
  methods: {
    truncate(text, stop = 150, clamp = "...") {
      if (!text) return "N/A";
      return text.slice(0, stop) + (stop < text.length ? clamp : "");
    },
  },
};
</script>
<style scoped>
.table-container {
  min-height: 150px;
}
</style>
