<template>
  <div>
    <div class="row">
      <h6 class="heading-small text-muted mb-4 pl-2">
        <i class="fas fa-edit mr-1" /> Tarefas ativas
      </h6>
    </div>
    <div v-if="empty" class="col-12 text-center mt--3">
      <badge type="info">
        O desafio não possúi tarefas em aberto no momento
      </badge>
    </div>
    <div ref="list_open_tasks" class="row vld-parent">
      <div
        v-for="task in openTasks"
        :key="'task_' + task.id"
        class="col-lg-4 col-md-6"
        @click="handleResponseTask(task.id)"
      >
        <span title="Ver tarefa" class="task-card pb-1 shadow">
          <div class="mb-3 task-card-header">
            <i
              :class="[
                task.submission.length
                  ? 'text-success fas fa-clipboard-check'
                  : 'text-danger fas fa-clipboard',
              ]"
            />
            <span :title="task.title">{{ task.title }}</span>
          </div>
          <span v-if="task.end_date" class="float-right text-sm text-muted">
            <i class="far fa-calendar-alt mr-1" /> até
            {{ formatDate(task.end_date, "L") }}
          </span>
          <span v-else class="float-right text-sm text-muted">
            <i class="far fa-calendar-alt mr-1" /> sem prazo
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/services/api";

export default {
  name: "OpenTasks",
  props: {
    challengeId: {
      type: Number,
      required: true,
      description: "Challenge identifier",
    },
  },
  data() {
    return {
      openTasks: [],
      empty: "",
    };
  },
  async mounted() {
    const loaderOpenTasks = this.$loading.show({
      container: this.$refs.list_open_tasks,
      width: 90,
      height: 90,
    });
    try {
      const { data } = await api.get(
        `/collaborator/challenges/${this.$props.challengeId}/participant/tasks`
      );
      if (data.length) this.openTasks = data;
      else this.empty = true;
      loaderOpenTasks.hide();
    } catch (e) {
      this.$toasted.error("Ocorreu um erro ao recuperar as tarefas do desafio");
    }
  },
  methods: {
    handleResponseTask(taskId) {
      this.$router.push(
        `/colaborador/desafios/${this.$route.params.id}/equipes/task/${taskId}/resposta`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.task-card {
  margin: 0;
  padding: 1.2rem 1rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.25;
  color: #32325d;
  background-color: #f6f9fc;
  border-radius: 0.375rem;
  border: 0;
  text-align: left;
  font-family: inherit;
  display: inline-block;
  vertical-align: middle;
  text-decoration: none;
  -moz-appearance: none;
  cursor: pointer;
  width: 100%;
  margin: 0.5rem 0;

  &:hover {
    background-color: #ffffff;
    box-shadow: rgba(0, 0, 0, 0.1) 0 0 0 1px, rgba(0, 0, 0, 0.1) 0 4px 16px;
  }

  > div {
    align-items: center;
    display: flex;
  }

  .task-card-header i {
    box-sizing: content-box;
    color: #5e72e4;
    vertical-align: middle;
    font-size: 1.5rem;
  }

  span {
    display: inline-block;
    font-size: 0.875rem;
    line-height: 1.5;
    margin-left: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: middle;
  }
}

.card-profile-image img {
  width: 180px;
  height: 180px;
  border-radius: 10%;
}
</style>
