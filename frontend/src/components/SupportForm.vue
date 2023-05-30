<template>
  <div>
    <card shadow>
      <div slot="header" class="bg-white border-0">
        <div class="row align-items-center">
          <div class="col-8">
            <h3 class="mb-0">Contatar suporte</h3>
          </div>
        </div>
      </div>
      <template>
        <form ref="support_form" role="form" class="vld-parent">
          <div class="row ml-lg-2">
            <div class="col-lg-12">
              <label class="form-control-label">
                No que podemos te ajudar?
              </label>
              <div>
                <base-input addon-left-icon="ni ni-support-16">
                  <select v-model="model.category" class="form-control">
                    <option selected disabled value="">
                      Selecione um motivo
                    </option>
                    <option
                      v-for="category in supportCategories"
                      :key="category.key"
                      :value="category.key"
                    >
                      {{ category.value }}
                    </option>
                  </select>
                </base-input>
              </div>
            </div>
            <div class="col-lg-12">
              <base-input
                v-model="model.subject"
                label="Assunto"
                placeholder="Digite o assunto"
              />
            </div>
          </div>
          <hr class="mt-2 mb-4" />
          <div class="row ml-lg-2">
            <div class="col-lg-12">
              <label class="form-control-label"> Descrição </label>
              <div class="sp-container-edditable">
                <quill-editor
                  v-model="model.description"
                  :options="editorEdittable"
                />
              </div>
            </div>
          </div>
          <div class="row ml-lg-2">
            <div class="col-12">
              <base-alert
                v-if="error"
                type="danger"
                class="text-center mt-4 mb-0"
              >
                <i class="fas fa-exclamation-circle mr-1" />
                {{ error }}
              </base-alert>
              <base-alert
                v-if="success"
                type="success"
                class="text-center mt-4 mb-0"
              >
                <i class="fas fa-thumbs-up mr-1" /> {{ success }}
              </base-alert>
            </div>
            <div class="col-12 mt-4 text-right">
              <base-button type="primary" :custom="true" @click="handleSubmit">
                Enviar mensagem
              </base-button>
            </div>
          </div>
        </form>
      </template>
    </card>
    <div v-if="showHistory">
      <div ref="messages_container" class="vld-parent">
        <div class="row">
          <div class="col-12">
            <hr class="my-4" />
          </div>
        </div>
        <div v-if="!loaded" class="row">
          <div class="col-12 text-center">
            <base-button
              type="link"
              :custom="true"
              @click="handleLoadAllMessages"
            >
              Carregar histórico de mensagens
            </base-button>
          </div>
        </div>
        <div v-else class="row">
          <div v-if="!messages.length" class="col-12 text-center">
            <badge type="primary">
              Não há mesagens enviadas no histórico
            </badge>
          </div>
          <div v-else class="col-12">
            <div class="row">
              <div
                v-for="message in messages"
                :key="'message' + message.id"
                class="col-12"
              >
                <div class="card mb-3">
                  <div class="card-body pt-3 pb-2">
                    <div class="row">
                      <div class="col-12 my-3 sh-container-read-only text-sm">
                        <div class="col-12">
                          <i class="fas fa-caret-right text-sm mr-1" />
                          <b class="font-weight-bold">Motivo:</b>
                          {{ getCategoryName(message.category) }}
                        </div>
                        <div class="col-12">
                          <i class="fas fa-caret-right text-sm mr-1" />
                          <b class="font-weight-bold">Assunto:</b>
                          {{ message.subject }}
                        </div>
                        <div class="col-12">
                          <i class="fas fa-caret-right text-sm mr-1" />
                          <b class="font-weight-bold">Mensagem:</b>
                          <div class="border rounded">
                            <quill-editor
                              v-model="message.description"
                              :options="editorReadOnly"
                              disabled="disabled"
                            />
                            <div class="mt-2">
                              <div class="text-muted text-sm text-right mr-1">
                                Enviado em:
                                {{ formatTimestamp(message.created_at) }}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-12">
                          <h3 class="h4 text-center my-2">
                            <i class="fas fa-comments text-green mr-1" />
                            Respostas recebidas
                          </h3>
                          <div v-if="!message.responses.length">
                            <p class="description text-center mb-0">
                              Nenhuma resposta recebida até o momento
                            </p>
                          </div>
                          <div v-else>
                            <div
                              v-for="response in message.responses"
                              :key="`response_${response.id}`"
                              class="border rounded mb-2"
                            >
                              <p class="description p-2">
                                {{ response.content }}
                              </p>
                              <div class="mt-2">
                                <div class="text-muted text-sm text-right mr-1">
                                  <i class="far fa-clock mr-1" />
                                  {{ formatTimestamp(response.created_at) }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <p class="text-muted text-right">
                  <b>{{ messages.length }}</b> mensagens enviadas ao total
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

import api from "@/services/api.js";

export default {
  name: "SupportForm",
  components: {
    quillEditor,
  },
  props: {
    to: {
      type: String,
      required: true,
    },
    showHistory: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      model: {
        category: "",
        subject: "",
        description: "",
      },
      messages: [],
      loaded: false,
      supportCategories: [
        {
          key: "general_question",
          value: "Dúvida de usabilidade",
        },
        {
          key: "bug_report",
          value: "Reportar problema",
        },
        {
          key: "my_account",
          value: "Minha conta",
        },
        {
          key: "feature_request",
          value: "Sugerir funcionalidade",
        },
        {
          key: "feedback",
          value: "Dar feedback",
        },
        {
          key: "other",
          value: "Outro",
        },
      ],
      editorEdittable: {
        placeholder:
          "Descreva aqui o motivo de seu contato. Para que possamos lhe atender da melhor forma, forneça todos os detalhes possíveis (lembre-se, se necessário, você pode linkar arquivos pelo editor).",
      },
      editorReadOnly: {
        placeholder: "...",
        readOnly: true,
        theme: "bubble",
      },
      success: "",
      error: "",
    };
  },
  methods: {
    async handleSubmit(e) {
      e.preventDefault();
      this.error = this.success = "";
      const data = this.model;
      if (!data.category || !data.subject || !data.description) {
        this.error = "Por favor, preencha todos os campos antes de continuar.";
        return;
      }
      const loader = this.$loading.show({
        container: this.$refs.support_form,
        width: 160,
        height: 160,
      });
      try {
        await api.post(this.to, data);
        this.model.category = this.model.subject = this.model.description = "";
        this.success =
          "Mensagem enviada com sucesso. Fique tranquilo, se necessário, você será contatado! :)";
        this.$toasted.show("Mensagem enviada com sucesso");
      } catch (e) {
        this.error =
          "Ocorreu ao enviar a mensagem, verifique as informações e tente novamente.";
        this.$toasted.error("Ocorreu ao enviar a mensagem");
      } finally {
        loader.hide();
      }
    },
    async handleLoadAllMessages() {
      this.loaded = false;
      const loader = this.$loading.show({
        container: this.$refs.messages_container,
        width: 90,
        height: 90,
      });
      try {
        const { data } = await api.get(this.to);
        this.messages = data;
        this.loaded = true;
        loader.hide();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar as mensagens");
      }
    },
    getCategoryName(key) {
      const category = this.supportCategories.find(
        (message) => message.key == key
      );
      return category ? category.value : "-";
    },
  },
};
</script>
<style>
p > strong {
  font-weight: bold !important;
}

.sp-container-edditable .quill-editor .ql-container,
.sp-container-edditable .quill-editor .ql-container .ql-editor {
  min-height: 10rem;
  width: 100%;
}

.sh-container-read-only .quill-editor .ql-container,
.sh-container-read-only .quill-editor .ql-container .ql-editor {
  min-height: 3rem;
  max-height: 8rem;
  width: 100%;
}
</style>
