<template>
  <div ref="news_table" class="card-radius card shadow vld-parent mb-4 px-2">
    <div class="card-header border-0">
      <h4 class="text-center mb-0">Criar publicação</h4>
      <hr class="my-2" />
      <div class="mb-1 mt-2 cursor-pointer">
        <div class="click-name row">
          <a
            class="col-8 d-flex align-items-center"
            @click="handleViewUser(user)"
          >
            <img
              v-if="profile_picture"
              width="30"
              height="30"
              :src="profile_picture"
              class="rounded-circle mr-2"
              alt="foto de perfil"
            />
            <i v-else class="fas fa-user-circle fa-2x mr-1" />
            <span>{{ user.name ? user.name : user.company_name }}</span>
          </a>
          <div :class="endpoint === 'diretoria' ? 'd-block' : 'd-none'">
            <label class="form-control-label d-block mb-0"> Pública </label>
            <base-switch
              :value="model.is_public"
              class="mb-0"
              @input="switchChangedHandler($event, 'is_public')"
            />
          </div>
        </div>
      </div>
    </div>
    <div ref="publicacao_container" class="mb-3 mr-4 ml-4">
      <div class="row">
        <div class="col-lg-12">
          <div class="sp-container-edditable">
            <quill-editor v-model="model.body" :options="editorEdittable" />
          </div>
        </div>
      </div>
      <div class="row">
        <file-select
          v-model="image"
          v-tooltip="
            'A imagem deve possuir tamanho máximo de 2MB e, preferencialmente, ser do formato <b>PNG</b> ou <b>JPG</b> com dimensão de <b>500x500 pixels</b>.'
          "
          class="mt-2 col-lg-12"
          type="secondary btn-block btn-radius"
          icon="far fa-image"
          title="Selecione uma imagem"
          accept="image/*"
          :mb-size="2"
        />
      </div>
      <div v-if="error" class="row mt-4">
        <div class="col-12 text-center">
          <base-alert type="danger">{{ error }}</base-alert>
        </div>
      </div>
      <div class="row mt-1 text-right">
        <div class="col-12">
          <base-button
            class="btn-radius"
            type="block btn-primary"
            :disabled="!isValidModel"
            @click="handleSubmit()"
          >
            Publicar
          </base-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/services/api";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "quill-emoji/dist/quill-emoji.css";

import { quillEditor } from "vue-quill-editor";
import Quill from "quill";

import * as Emoji from "quill-emoji";
import { getUserId } from "../services/auth";
Quill.register(("modules/emoji-shortname", Emoji));

export default {
  name: "NewPost",
  components: {
    quillEditor,
  },
  props: {
    endpoint: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: false,
      default: "",
    },
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      model: {
        body: "",
        type: "news",
        is_public: false,
      },
      route_endpoint: "",
      editorReadOnly: {
        placeholder: "...",
        readOnly: true,
        theme: "bubble",
      },
      emojiIcon:
        '<svg class="i" viewBox="0 0 24 24"><use href="#emoticon-sad</use></svg>',
      toolbarOptions: {
        container: [["bold", "italic", "underline", "strike"], ["emoji"]],
      },
      editorOption: {},
      error: "",
      image: null,
      requiredFields: ["body"],
      editorEdittable: {
        placeholder:
          "Escreva aqui... (lembre-se, se necessário, você pode linkar arquivos pelo editor)",
        modules: {
          toolbar: this.toolbarOptions,
          "emoji-toolbar": false,
          "emoji-textarea": false,
          "emoji-shortname": false,
        },
      },
      user_id: getUserId(),
      profile_picture: this.profilePicture,
    };
  },
  computed: {
    isValidModel() {
      const data = this.model;
      for (const key of this.requiredFields) {
        if (!data[key]) return false;
      }
      return true;
    },
  },
  async mounted() {
    if (this.endpoint === "diretoria") this.route_endpoint = "admin";
    else if (this.endpoint === "professor") this.route_endpoint = "teacher";
    else if (this.endpoint === "aluno") this.route_endpoint = "student";
    else if (this.endpoint === "voluntario") this.route_endpoint = "volunteer";
    else if (this.endpoint === "parceiro") this.route_endpoint = "partner";
    else if (this.endpoint === "associado") this.route_endpoint = "associate";
  },
  methods: {
    handleViewUser(user) {
      this.$router.push(
        `/${this.endpoint}/usuarios/${user.user_id}/visualizar`
      );
    },
    async handleSubmit() {
      this.error = "";
      const loader = this.$loading.show({
        container: this.$refs.publicacao_container,
        width: 90,
        height: 90,
      });
      try {
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };
        const data = new FormData();
        if (this.image) {
          data.append("image", this.image, this.image.name);
        }
        Object.entries(this.model).forEach((entry) => {
          data.append(entry[0], entry[1]);
        });
        const { data: news } = await api.post(
          `/${this.route_endpoint}/news`,
          data,
          config
        );
        this.$emit("news", news);
        this.image = null;
        this.model = {
          body: "",
          type: "news",
        };
        this.$toasted.show("Publicação salva com sucesso");
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao salvar a publicação");
        this.error =
          "Ocorreu um erro ao salvar a publicação. Por favor, verifique os campos e tente novamente.";
      } finally {
        loader.hide();
      }
    },
    switchChangedHandler(event, prop) {
      if (typeof event === "boolean") this.model[prop] = event;
    },
  },
};
</script>
<style>
.btn-radius {
  border-radius: 10px;
  border: 2px solid #eaeaea;
}
</style>
<style lang="scss" scoped>
p > strong {
  font-weight: bold !important;
}
.cursor-pointer {
  cursor: pointer;
}

.sp-container-edditable .quill-editor .ql-container,
.sp-container-edditable .quill-editor .ql-container .ql-editor {
  min-height: 10rem;
  width: 100%;
}
.card-radius {
  border-radius: 15px;
}
</style>
