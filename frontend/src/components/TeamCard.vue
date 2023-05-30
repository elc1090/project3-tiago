<template>
  <card
    ref="team_card"
    shadow
    footer-classes="py-2 text-center"
    body-classes="p-1"
  >
    <div slot="header" class="bg-white border-0">
      <div class="row align-items-center">
        <div class="col-8">
          <h3 class="mb-0">Equipe do desafio</h3>
        </div>
      </div>
    </div>
    <template>
      <div class="row text-center">
        <div class="col-md-4 mt-2">
          <img
            src="/img/pages/default_banner_course.jpg"
            width="150"
            height="150"
            class="rounded-circle"
            alt="..."
          />
          <h3 class="mt-3">
            <span class="bg-white rounded border p-2">{{ team.name }}</span>
          </h3>
        </div>
        <div class="col-md-8">
          <div
            class="card-profile-stats d-flex justify-content-center small pb-0 mb-1"
          >
            <div>
              <span class="heading">{{ tasksSubmissions() }}</span>
              <span class="description">Tarefas entregues</span>
            </div>
            <div>
              <span class="heading">{{ members.length }}</span>
              <span class="description">Número de integrantes</span>
            </div>
          </div>
          <h4>
            Integrantes:
            <span
              v-for="member in members"
              :key="member.id"
              class="font-weight-light"
              >{{ member.name }};
            </span>
          </h4>
          <h4>
            Avaliação geral:
            <span v-if="team.evaluation_score" class="font-weight-light">
              {{ team.evaluation_score }} <i class="fas fa-star"
            /></span>
            <span v-else class="font-weight-light text-warning">
              Equipe ainda não avaliada</span
            >
          </h4>
        </div>
      </div>
    </template>
  </card>
</template>
<script>
export default {
  name: "CallCard",
  props: {
    team: {
      type: Object,
      required: true,
      description: "Team challenge",
    },
    members: {
      type: Array,
      required: true,
      description: "Team members",
    },
    tasks: {
      type: Array,
      required: true,
      description: "Team tasks",
    },
  },
  data() {
    return {
      bgClasses: [
        "warning",
        "info",
        "primary",
        "success",
        "secondary",
        "danger",
        "light",
        "dark",
      ],
    };
  },
  methods: {
    tasksSubmissions() {
      let submissionCount = 0;
      this.tasks.forEach((task) => {
        if (task.submission.length) {
          submissionCount += 1;
        }
      });
      return submissionCount;
    },
  },
};
</script>
<style scoped>
.card-profile-stats > div .heading {
  font-size: 1rem;
}
</style>
