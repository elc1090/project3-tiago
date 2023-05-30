<template>
  <div>
    <p class="col-lg-12 ml-2">
      Aqui você pode adicionar questões à avaliação. Após adicionadas, é
      possível alterar sua ordem de exibição e seus detalhes, bem como
      removê-las da sua avaliação. Ainda, é possível pré-visualizar a vista que
      os alunos terão da sua avaliação.
    </p>
    <div v-for="(question, index) in material.evaluation" :key="index">
      <card shadow type="secondary mb-3">
        <div slot="header" class="bg-white border-0">
          <div class="row align-items-center">
            <div class="col-12">
              <h3 class="mb-0">
                Questão
                {{ index + 1 }} - {{ question.title }}
                <span class="float-right">
                  <base-button
                    v-tooltip.bottom="'Excluir questão'"
                    type="white"
                    size="sm"
                    class="text-primary"
                    @click="handleRemoveQuestions(index, question.id)"
                  >
                    <i class="fas fa-trash text-danger" />
                  </base-button>
                  <base-button
                    v-tooltip.bottom="
                      'Pré-visualizar (visualizar como colaborador)'
                    "
                    type="white"
                    size="sm"
                    class="text-primary"
                    @click="handleOpenModalView(question, index)"
                  >
                    <i class="fas fa-eye text-primary" />
                  </base-button>
                </span>
              </h3>
            </div>
          </div>
        </div>
        <div class="row ml-lg-1">
          <h6 class="heading-small text-muted mb-4">Informações básicas</h6>
        </div>
        <div class="row ml-lg-2">
          <div class="col-lg-6">
            <label class="form-control-label"> Título da questão </label>
            <p>{{ question.title }}</p>
          </div>
          <div class="col-lg-6">
            <label class="form-control-label">
              Tipo de questão
              <i
                v-tooltip="
                  'Questões de <b>múltipla escolha</b> permitem a seleção de apenas uma opção. <b>Caixas de seleção</b>, permitem a seleção de uma ou mais opções; <b>Texto</b> permite que o colaborador descreva sua resposta em formato de texto.'
                "
                class="fas fa-info-circle ml-1"
              />
            </label>
            <p>
              {{ questionTypes.find((e) => e.type === question.type).name }}
            </p>
          </div>
          <div v-if="question.description" class="col-lg-12">
            <label class="form-control-label">Descrição</label>
            <p>
              {{ question.description }}
            </p>
          </div>
        </div>
        <div
          v-if="question.type === 'radiobox' || question.type === 'checkbox'"
        >
          <div class="row ml-lg-1">
            <div class="col-12">
              <hr class="mt-3 mb-4" />
              <h6 class="heading-small text-muted mb-4">Detalhes da questão</h6>
            </div>
          </div>
          <div class="row ml-lg-2">
            <div class="col-12">
              <label class="form-control-label">
                Alternativas ({{ question.options.length }})
              </label>
            </div>
          </div>
          <div
            v-for="(option, aIndex) in question.options"
            :key="aIndex"
            class="row ml-lg-3"
          >
            <p class="col-lg-12 mb-1 description">
              <i class="fas fa-angle-right mr-1" /> {{ option.title }}
            </p>
          </div>
        </div>
        <div
          v-if="question.type === 'checkbox' && question.right_answer.length"
        >
          <div class="row ml-lg-1">
            <div class="col-12">
              <hr class="mt-3 mb-4" />
              <h6 class="heading-small text-muted mb-4">Resposta correta</h6>
            </div>
          </div>
          <div class="row ml-lg-2">
            <div class="col-lg-12">
              <label class="form-control-label">
                Alternativa(s) correta(s)
              </label>
            </div>
          </div>

          <div class="row ml-lg-3">
            <div class="col-12">
              <p
                v-for="(option, oIndex) in question.options"
                :key="oIndex"
                class="mb-1 description"
              >
                <span v-if="question.right_answer[oIndex]">
                  <i class="fas fa-angle-right mr-1" />
                  {{ option.title }}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div
          v-if="question.type === 'radiobox' && question.right_answer.length"
        >
          <div class="row ml-lg-1">
            <div class="col-12">
              <hr class="mt-3 mb-4" />
              <h6 class="heading-small text-muted mb-4">Resposta correta</h6>
            </div>
          </div>
          <div
            v-if="question.options[question.right_answer].title"
            class="row ml-lg-2"
          >
            <div class="col-lg-12">
              <label class="form-control-label"> Alternativa correta </label>
            </div>
          </div>
          <div class="row ml-lg-3">
            <div class="col-12">
              <p class="mb-1 description">
                <i class="fas fa-angle-right mr-1" />
                {{ question.options[question.right_answer].title }}
              </p>
            </div>
          </div>
        </div>
      </card>
    </div>
    <card shadow type="secondary" class="new_question">
      <div slot="header" class="bg-white border-0">
        <div class="row align-items-center">
          <div class="col-12">
            <h3 class="mb-0">
              <i class="fas fa-edit text-default mr-2" /> Nova questão
              <span class="float-right">
                <base-button
                  v-tooltip.bottom="
                    'Pré-visualizar (visualizar como colaborador)'
                  "
                  type="white"
                  size="sm"
                  class="text-primary"
                  :disabled="!isValidQuestion"
                  @click="
                    handleOpenModalView(
                      model.questions,
                      material.evaluation.length
                    )
                  "
                >
                  <i class="fas fa-eye text-primary" />
                </base-button>
              </span>
            </h3>
          </div>
        </div>
      </div>
      <div class="row ml-lg-1">
        <div class="col-12">
          <h6 class="heading-small text-muted mb-4">Informações básicas</h6>
        </div>
      </div>
      <div class="row ml-lg-2">
        <div class="col-lg-6">
          <base-input
            v-model.trim="model.questions.title"
            label="Título da questão*"
            placeholder="Digite o título"
          />
        </div>
        <div class="col-lg-6">
          <label class="form-control-label">
            Tipo de questão
            <i
              v-tooltip="
                'Questões de <b>múltipla escolha</b> permitem a seleção de apenas uma opção. <b>Caixas de seleção</b>, permitem a seleção de uma ou mais opções; <b>Texto</b> permite que o colaborador descreva sua resposta em formato de texto.'
              "
              class="fas fa-info-circle ml-1"
            />
          </label>
          <base-input>
            <select v-model="model.questions.type" class="form-control">
              <option selected disabled value="">
                Selecione um tipo de questão
              </option>
              <option
                v-for="type in questionTypes"
                :key="type.key"
                :value="type.type"
              >
                {{ type.name }}
              </option>
            </select>
          </base-input>
        </div>
        <div class="col-lg-12">
          <base-input label="Descrição da questão (opcional)">
            <textarea
              v-model="model.questions.description"
              rows="2"
              class="form-control"
              placeholder="Escreva aqui..."
            />
          </base-input>
        </div>
      </div>
      <div
        v-if="
          model.questions.type === 'radiobox' ||
          model.questions.type === 'checkbox'
        "
      >
        <div class="row ml-lg-1">
          <div class="col-12">
            <hr class="mt-3 mb-4" />
            <h6 class="heading-small text-muted mb-4">Detalhes da questão</h6>
          </div>
        </div>
        <div class="row ml-lg-2">
          <div class="col-lg-8">
            <base-input
              v-model.trim="model.option.title"
              label="Título da opção*"
              placeholder="Digite o título"
            />
          </div>
          <div
            class="col-lg-4 text-center text-lg-left mt-lg-4 pt-lg-1 mt-0 pt-0 mb-4 mb-lg-0"
          >
            <base-button
              :disabled="!model.option.title.trim()"
              type="default"
              @click="handleAddOptions"
            >
              <i class="fas fa-plus mr-1" /> Adicionar opção
            </base-button>
          </div>
        </div>
        <div class="row ml-lg-2">
          <div class="col-lg-12">
            <label class="form-control-label">
              Alternativas ({{ model.questions.options.length }})
              <i
                v-tooltip="
                  'Para adicionar a questão do tipo múltipla escolha ou caixas de seleção é preciso adicionar ao menos uma opção.'
                "
                class="fas fa-info-circle ml-1"
              />
            </label>
          </div>
        </div>
        <div class="row ml-lg-2">
          <div class="col-12">
            <Container @drop="onDropOption($event)">
              <Draggable
                v-for="(option, index) in model.questions.options"
                :key="index"
                class="card radiobox"
              >
                <span class="column-drag-handle cursor pr-3 float-left">
                  <i class="fas fa-bars text-gray" />
                </span>
                {{ option.title }}
                <span class="float-right">
                  <base-button
                    v-tooltip.bottom="'Excluir opção'"
                    type="white"
                    size="sm"
                    class="text-primary"
                    @click="handleRemoveOptions(index)"
                  >
                    <i class="fas fa-trash text-danger" />
                  </base-button>
                </span>
              </Draggable>
            </Container>
          </div>
        </div>
        <div
          v-if="
            model.questions.type === 'radiobox' &&
            model.questions.options.length
          "
        >
          <div class="row ml-lg-1">
            <div class="col-12">
              <hr class="mt-3 mb-4" />
              <h6 class="heading-small text-muted mb-4">Resposta correta</h6>
            </div>
          </div>
          <div class="row ml-lg-2">
            <div class="col-12">
              <label class="form-control-label d-block">
                Selecione a opção correta
              </label>
              <div class="col-lg-12 mt-2 ml-lg-2">
                <base-input>
                  <base-radio
                    v-for="(option, index) in model.questions.options"
                    :key="index"
                    v-model="model.questions.right_answer[0]"
                    :name="String(index)"
                    class="mb-2 ml-2"
                    :inline="false"
                    :disabled="false"
                  >
                    <span class="ml--3">{{ option.title }}</span>
                  </base-radio>
                </base-input>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else-if="
            model.questions.type === 'checkbox' &&
            model.questions.options.length
          "
        >
          <div class="row ml-lg-1">
            <div class="col-12">
              <hr class="mt-3 mb-4" />
              <h6 class="heading-small text-muted mb-4">Resposta correta</h6>
            </div>
          </div>
          <div class="row ml-lg-2">
            <div class="col-12">
              <label class="form-control-label">
                Selecione a(s) alternativa(s) correta(s)
              </label>
            </div>
            <div class="col-lg-12 mt-2 ml-lg-2">
              <base-input>
                <base-checkbox
                  v-for="(option, index) in model.questions.options"
                  :key="index"
                  v-model="model.questions.right_answer[index]"
                  class="mb-2 mr-1"
                  :name="String(index)"
                >
                  <span class="ml--3">{{ option.title }} </span>
                </base-checkbox>
              </base-input>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-3 mb-3">
        <base-button
          :custom="true"
          type="default"
          :disabled="!isValidQuestion"
          @click="handleAddQuestions"
        >
          <i class="fas fa-plus mr-1" /> Adicionar esta questão
        </base-button>
      </div>
    </card>
    <modal
      :show.sync="modalView.show"
      modal-classes="modal-dialog-centered modal-lg"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Visualizar questão (ponto de vista do colaborador)
      </h6>
      <div ref="modal_view" class="vld-parent">
        <h3>
          Questão {{ modalView.index + 1 }} -
          {{ modalView.question.title }}
        </h3>
        <p class="ml-1">
          {{ modalView.question.description }}
        </p>
        <div v-if="modalView.question.type === 'text'">
          <textarea
            rows="2"
            class="form-control"
            placeholder="Escreva aqui..."
          />
        </div>
        <div v-else-if="modalView.question.type === 'radiobox'">
          <div class="row ml-lg-2">
            <div class="col-lg-12">
              <base-input>
                <base-radio
                  v-for="(option, index) in modalView.question.options"
                  :key="index"
                  v-model="modalView.radioSelect[0]"
                  :name="option.title"
                  class="mb-2"
                >
                  <span class="ml--3">{{ option.title }}</span>
                </base-radio>
              </base-input>
            </div>
          </div>
        </div>
        <div v-else-if="modalView.question.type === 'checkbox'">
          <div class="row ml-lg-2">
            <div class="col-lg-12">
              <base-checkbox
                v-for="(option, index) in modalView.question.options"
                :key="index"
                v-model="modalView.checkboxSelect[index]"
                class="mb-2 mr-1"
              >
                <span class="ml--3">{{ option.title }} </span>
              </base-checkbox>
            </div>
          </div>
        </div>
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
import { Container, Draggable } from "vue-smooth-dnd";

export default {
  name: "AvaliacaoEdit",
  components: {
    Container,
    Draggable,
  },
  props: {
    material: Object,
  },
  data() {
    return {
      model: {
        questions: {
          title: "",
          type: "",
          description: "",
          right_answer: [],
          options: [],
        },
        option: {
          title: "",
        },
      },
      questionRequiredFields: ["title", "type"],
      modalView: {
        show: false,
        question: "",
        index: "",
        radioSelect: [],
        checkboxSelect: [],
      },
      materialTypes: [
        {
          type: "video",
          name: "Vídeo do YouTube",
        },
        { type: "pdf", name: "PDF" },
        { type: "link", name: "Link externo" },
        { type: "text", name: "Texto" },
        { type: "test", name: "Avaliação" },
      ],
      questionTypes: [
        {
          type: "radiobox",
          name: "Múltipla escolha",
        },
        {
          type: "checkbox",
          name: "Caixas de seleção",
        },
        {
          type: "text",
          name: "Texto",
        },
      ],
      error: "",
      editorEdittable: {
        placeholder: "Escreva o texto aqui..",
      },
    };
  },
  computed: {
    isValidQuestion() {
      const question = this.model.questions;
      for (const key of this.questionRequiredFields) {
        if (question[key] === "") return false;
      }
      if (
        (this.model.questions.type === "radiobox" ||
          this.model.questions.type === "checkbox") &&
        !this.model.questions.options.length
      )
        return false;
      return true;
    },
  },
  async mounted() {
    for (let question of this.material.evaluation) {
      if (
        question.type !== "text" &&
        (typeof question.options === "string" ||
          question.options instanceof String)
      ) {
        question.options = JSON.parse(question.options);
        if (question.type === "checkbox" && question.right_answer !== "") {
          const answers = Array(question.options.length).fill(false);
          question.right_answer
            .split(",")
            .forEach((optionId) => (answers[optionId] = true));
          question.right_answer = answers;
        }
      }
    }
  },
  methods: {
    handleAddQuestions() {
      this.material.evaluation.push(Object.assign({}, this.model.questions));
      this.model.questions.title = "";
      this.model.questions.type = "";
      this.model.questions.description = "";
      this.model.questions.right_answer = [];
      this.model.questions.options = [];
    },
    handleRemoveQuestions(index, id) {
      if (id) {
        const confirmation = confirm(
          "Você realmente deseja excluir a pergunta? Se existirem, as respostas para a pergunta serão perdidas. Ainda será necessário clicar em 'SALVAR ALTERAÇÕES' para efetivar a remoção."
        );
        if (!confirmation) return;
      }
      this.material.evaluation.splice(index, 1);
    },
    handleAddOptions() {
      this.model.questions.options.push(Object.assign({}, this.model.option));
      this.model.option.title = "";
    },
    handleRemoveOptions(index) {
      this.model.questions.options.splice(index, 1);
    },
    handleOpenModalView(content, index) {
      this.modalView.question = content;
      this.modalView.index = index;
      this.modalView.radioSelect = [];
      this.modalView.checkboxSelect = [];
      this.modalView.show = true;
    },
    onDropOption(dropResult) {
      const { removedIndex, addedIndex } = dropResult;
      var opcoes = this.model.questions.options;
      let draggingMaterial = this.model.questions.options[removedIndex];
      if (removedIndex === addedIndex) return;
      if (removedIndex !== null) {
        opcoes.splice(removedIndex, 1);
      }
      if (addedIndex !== null) {
        opcoes.splice(addedIndex, 0, draggingMaterial);
      }
    },
    truncate(text, stop = 30, clamp = "...") {
      if (!text) return "N/A";
      return text.slice(0, stop) + (stop < text.length ? clamp : "");
    },
  },
};
</script>
<style scoped>
.radiobox {
  background: #fff;
  color: #525f7f;
  padding: 1rem;
  border-radius: 5px;
  margin: 1rem 0 1rem 0;
}

.new_question {
  border: 4px solid rgba(85, 51, 255, 0.4);
}

.cursor {
  cursor: pointer;
}
</style>
