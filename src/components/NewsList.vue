<template>
  <div class="vld-parent">
    <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center">
      <!-- Mask -->
      <span class="bg-gradient-default opacity-8" />
      <!-- Header container -->
      <div
        ref="news_container"
        class="container-fluid align-items-center vld-parent"
      >
        <div class="row">
          <div class="col-12 d-block d-md-none">
            <router-link
              :to="'/'"
              class="btn-link font-weight-normal text-white"
              title="Voltar para o início"
            >
              <i class="fas fa-chevron-left mr-1" /> Voltar
            </router-link>
          </div>
          <div class="col-lg-7 col-md-10">
            <p class="text-white mt-3 mb-5">
              Aqui você pode conferir todos os avisos, eventos, treinamentos e
              dinâmicas disponibilizados pela diretoria ou professores. Clique
              em mais detalhes para ver as informações completas.
            </p>
          </div>
          <div class="col-lg-12">
            <div class="float-right">
              <a
                v-tooltip="'Abrir Facebook'"
                href="https://www.facebook.com/orquestrandoarte/"
                target="_blank"
                rel="noreferrer noopener"
                class="text-lg mx-1"
              >
                <i class="fab fa-facebook"
              /></a>
              <a
                v-tooltip="'Abrir Instagram'"
                href="https://www.instagram.com/orquestrandoarte/"
                target="_blank"
                rel="noreferrer noopener"
                class="text-lg mx-1"
              >
                <i class="fab fa-instagram"
              /></a>
              <a
                v-tooltip="'Abrir Site Oficial'"
                href="https://www.orquestrandoarte.org/"
                target="_blank"
                rel="noreferrer noopener"
                class="text-lg mx-1"
              >
                <i class="fas fa-globe text-white"
              /></a>
            </div>
          </div>
        </div>
      </div>
      <div class="row" />
    </base-header>
    <div class="container-fluid mt--6">
      <div v-if="control.empty" class="row">
        <div class="col-12 mb-1 text-center mt--3">
          <badge type="info" class="bg-white">
            Não existem publicações até o momento
          </badge>
        </div>
      </div>
      <div v-else class="row">
        <div class="col-12">
          <div class="card-deck">
            <div
              v-for="newsData in news"
              :key="newsData.id"
              class="col-lg-4 col-md-6 mb-5 d-flex align-items-stretch"
            >
              <div class="card text-center flex-grow-1">
                <div class="card-profile-image">
                  <img
                    :src="newsData.image_url"
                    class="card-image my-3"
                    alt="..."
                  />
                </div>
                <div class="card-body mt-7 pt-3 pb-0">
                  <h3 class="card-title mb-1">
                    {{ newsData.title }}
                  </h3>
                  <badge type="primary" class="mt-2">
                    {{ newsType[newsData.type] }}
                  </badge>
                  <p
                    v-if="newsData.date || newsData.start_hour"
                    class="description mt-2"
                  >
                    <span v-if="newsData.date"
                      ><b>Data: </b> {{ formatDate(newsData.date, "LL") }}</span
                    >
                    <span v-if="newsData.start_hour" class="px-2"
                      ><b>Hora: </b> {{ newsData.start_hour }}</span
                    >
                  </p>
                  <p v-else class="text-center description mt-2">
                    <span v-tooltip="'Data de publicação'"
                      ><i class="far fa-clock mr-1" />
                      {{ formatTimestamp(newsData.created_at, "lll") }}</span
                    >
                  </p>
                </div>
                <div
                  :ref="`container_news_${newsData.id}`"
                  class="card-footer text-center vld-parent"
                >
                  <base-button
                    type="seagreen"
                    size="sm"
                    @click="handleOpenModalView(newsData)"
                  >
                    <i class="fas fa-eye mr-2" /> Mais detalhes
                  </base-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!control.empty" class="row">
        <div class="col-lg-12 mb-3 text-right">
          <p class="text-muted">
            Exibindo
            <span class="font-weight-bold">{{ news.length }}</span> de um total
            de
            <span class="font-weight-bold">{{ control.total }}</span>
            publicações.
          </p>
        </div>
        <div class="col-lg-12">
          <base-pagination
            :page-count="control.lastPage"
            :per-page="control.limit"
            :value="control.page"
            size="md"
            align="center"
            @input="handlePageInput"
          />
        </div>
      </div>
    </div>
    <modal
      :show.sync="modalView.show"
      modal-classes="modal-dialog-centered modal-xl"
      body-classes="pb-0"
      header-classes="pb-0"
    >
      <h6 id="modal-title-notification" slot="header" class="modal-title">
        Detalhes da publicação
      </h6>
      <div class="text-center">
        <div class="pb-2 card-profile-image">
          <img :src="modalView.news.image_url" class="card-image my-3" />
        </div>
      </div>
      <div class="text-center">
        <h3 class="mt-7 pt-2">
          {{ modalView.news.title }}
          <base-button
            v-if="modalView.news.link"
            v-tooltip.bottom="'Abrir <b>link externo</b> da publicação'"
            type="link"
            class="p-0 m-0 ml-1 mt--1"
            @click="openLink(modalView.news.link)"
          >
            <i class="fas fa-link" />
          </base-button>
        </h3>
        <p class="description mt-1 mb-0">
          {{ modalView.news.subtitle }}
        </p>
        <p
          v-if="showAuthor && modalView.news.author"
          class="description mt-1 mb-0"
        >
          <b>Empresa:</b> {{ modalView.news.author.name }}
        </p>
        <p v-if="modalView.news.author_name" class="description mt-1 mb-0">
          <b>Autor:</b> {{ modalView.news.author_name }}
        </p>
        <badge type="seagreen mt-2">
          {{ newsType[modalView.news.type] }}
        </badge>
        <p class="description mt-1 mb-0">
          <span v-if="modalView.news.date"
            ><b>Data: </b> {{ formatDate(modalView.news.date, "LL") }}</span
          >
          <span v-if="modalView.news.start_hour" class="px-2"
            ><b>Hora: </b> {{ modalView.news.start_hour }}</span
          >
        </p>
        <p v-if="modalView.news.tags" class="description mt-1 mb-0">
          <b>Tags:</b>
          <badge
            v-for="tag in modalView.news.tags.split(';')"
            :key="`${modalView.news.id}_${tag}`"
            class="mx-1"
            type="primary"
          >
            {{ tag.trim() }}
          </badge>
        </p>
      </div>
      <div class="mt-3">
        <quill-editor
          v-model="modalView.news.body"
          :options="editorReadOnly"
          disabled="disabled"
          class="border rounded"
        />
        <p class="text-right description mt-3 mb-0">
          <i class="far fa-clock mr-1" /> Publicado em
          {{ formatTimestamp(modalView.news.created_at, "lll") }}. Atualizado em
          {{ formatTimestamp(modalView.news.updated_at, "lll") }}.
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
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

import api from "@/services/api";

export default {
  components: {
    quillEditor,
  },
  props: {
    endpoint: {
      type: String,
      required: true,
    },
    showAuthor: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      news: [],
      control: {
        page: 1,
        limit: 10,
        lastPage: 0,
        total: 0,
        empty: "",
      },
      editorReadOnly: {
        placeholder: "...",
        readOnly: true,
        theme: "bubble",
      },
      modalView: {
        show: false,
        news: "",
      },
      newsType: {
        notice: "Aviso",
        event: "Evento",
        training: "Treinamento",
        dynamic: "Dinâmica",
      },
    };
  },
  async mounted() {
    await this.loadNews(this.control.page);
  },
  methods: {
    async loadNews(page) {
      const loader = this.$loading.show({
        container: this.$refs.news_container,
        width: 150,
        height: 150,
        opacity: 0,
      });
      try {
        const { data } = await api.get(
          `/${this.endpoint}/news?page=${page}&limit=${this.control.limit}&walls=true&notNewsType=true`
        );

        const defaultImgPath = "/img/pages/news.png";
        this.control.lastPage = data.meta.last_page;
        this.control.total = data.meta.total;
        this.control.page = data.meta.page;
        data.data.forEach((newsData) => {
          if (!newsData.image_url) newsData.image_url = defaultImgPath;
        });
        this.news = data.data;
        this.control.empty = !data.meta.total;
        loader.hide();
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao recuperar as publicações");
      }
    },
    async handlePageInput(page) {
      await this.loadNews(page);
    },
    async handleOpenModalView(news) {
      const loader = this.$loading.show({
        container: this.$refs[`container_news_${news.id}`][0],
        width: 50,
        height: 50,
      });
      try {
        const { data } = await api.get(`/${this.endpoint}/news/${news.id}`);
        if (!data.image_url) data.image_url = "/img/pages/news.png";
        this.modalView.news = data;
        this.modalView.show = true;
      } catch (e) {
        this.$toasted.error("Ocorreu um erro ao carregar a publicação");
      } finally {
        loader.hide();
      }
    },
    openLink(link) {
      window.open(link, "file-window", "resizable=1,height=750,width=750");
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
</style>
