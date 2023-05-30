<template>
  <div>
    <div class="row">
      <h6 class="heading-small text-muted mb-4 pl-2">
        <i :class="[icon, 'mr-1']" /> {{ title }}
      </h6>
    </div>
    <div v-if="!data.length" class="text-center text-warning mb-3 mt--2">
      {{ emptyMessage }}
    </div>
    <div ref="list_open_tasks" class="row vld-parent">
      <div
        v-for="task in data"
        :key="'task_' + task.id"
        class="col-lg-3 col-md-6"
        @click="handleViewTask(task.id)"
      >
        <span title="Ver tarefa" class="task-card pb-1">
          <div class="mb-3 task-card-header">
            <i class="fas fa-clipboard-list" />
            <span :title="task.title">{{ task.title }}</span>
          </div>
          <div>
            <span
              v-if="
                task.submission.length && task.submission[0].evaluation_score
              "
              class="font-weight-light"
            >
              {{ task.submission[0].evaluation_score }}
              <i class="fas fa-star"
            /></span>
            <span v-else class="font-weight-light text-warning">
              Tarefa ainda não avaliada</span
            >
          </div>
          <span class="float-right text-sm text-muted" v-if="!showDeadline"
            ><i class="far fa-calendar-alt mr-1" /> início em
            {{ formatDate(task.start_date, "L") }}</span
          >
          <span class="float-right text-sm text-muted" v-else-if="task.end_date"
            ><i class="far fa-calendar-alt mr-1" /> até
            {{ formatDate(task.end_date, "L") }}</span
          >
          <span class="float-right text-sm text-muted" v-else
            ><i class="far fa-calendar-alt mr-1" /> sem prazo</span
          >
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "TaskListEquipe",
  props: {
    data: {
      type: Array,
      default: () => [],
      description: "List of tasks",
    },
    title: {
      type: String,
      required: true,
      description: "Section title",
    },
    icon: {
      type: String,
      default: "fas fa-clipboard-list",
      description: "Section icon",
    },
    emptyMessage: {
      type: String,
      default: "Não há tarefas no momento",
      description: "Message displayed when listTasks is empty",
    },
    showDeadline: {
      type: Boolean,
      default: true,
      description:
        "If the task card should show the deadline or the task start date",
    },
  },
  data() {
    return {
      clicked: false,
    };
  },
  methods: {
    handleViewTask(taskId) {
      if (this.clicked) return;
      this.clicked = true;
      this.$router.push(
        `/empresa/desafios/${this.$route.params.id}/equipes/${this.$route.params.teamId}/submissoes/tarefas/${taskId}/visualizar`
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
</style>
