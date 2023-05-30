<template>
  <div ref="news_feed" class="vld-parent">
    <div v-for="(event, index) in news" :key="event.id">
      <div class="col-xl-8 col-lg-12 mb-4 card px-2">
        <p class="mb-2 mt-2">
          <img
            v-if="event.profile_picture"
            width="30"
            height="30"
            :src="event.profile_picture"
            class="rounded-circle mr-2"
            alt="foto de perfil"
          />
          <i v-else class="fas fa-user-circle fa-2x mr-1" />
          <span>{{
            event.collaborator_name
              ? event.collaborator_name
              : event.company_name
          }}</span>
        </p>
        <img
          v-if="event.image_url"
          class="image-feed rounded mx-auto d-block col-12 px-0"
          :src="event.image_url"
          alt="..."
        />
        <quill-editor
          v-model="event.body"
          :options="editorReadOnly"
          disabled="disabled"
        />
        <div class="m-3 d-flex">
          <base-button
            class="btn btn-white"
            :title="!event.liked ? 'Curtir' : 'Descurtir'"
            @click="handleLike(index)"
          >
            <div v-if="!event.liked" class="">
              <i class="far fa-heart fa-sm" />
              {{ event.likes }}
            </div>
            <div v-else class="">
              <i class="fas fa-heart fa-sm" />
              {{ event.likes }}
            </div>
          </base-button>
          <base-button
            class="btn btn-white"
            @click="
              $router.push(`colaborador/publicacoes/${event.id}/visualizar`)
            "
          >
            <i class="far fa-comment fa-sm" /> {{ event.comments }}
          </base-button>
        </div>
      </div>
    </div>
    <div ref="scroll" class="" />
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
import api from "@/services/api";

export default {
  name: "PostCard",
  components: { quillEditor },
  data() {
    return {
      news: [],
      meta: {},
      events: [],
      trainings: [],
      dynamics: [],
      limit: 10,
      empty: {
        news: "",
        events: "",
        trainings: "",
        dynamics: "",
      },
      editorReadOnly: {
        placeholder: "...",
        readOnly: true,
        theme: "bubble",
      },
    };
  },
  async mounted() {
    await this.loadInitialNews();
    await this.loadNews();
  },
  methods: {
    loadNews() {
      window.onscroll = async () => {
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight ===
          document.documentElement.offsetHeight;
        if (bottomOfWindow && this.meta.current_page < this.meta.last_page) {
          const loader = this.$loading.show({
            container: this.$refs.scroll,
            loader: "dots",
            width: 90,
            height: 90,
            opacity: 0,
          });
          try {
            const {
              data: { data, meta },
            } = await api.get(
              `/collaborator/news/?page=${this.meta.current_page + 1}`
            );
            if (data.length) {
              this.news = this.news.concat(data);
              this.meta = meta;
            } else this.empty.news = true;
            loader.hide();
          } catch (e) {
            this.$toasted.error("Ocorreu um erro ao carregar as publicações");
          }
        }
      };
    },

    async handleLike(index) {
      if (!this.news[index].liked) {
        this.news[index].likes += 1;
      } else if (this.news[index].liked && this.news[index].likes > 0) {
        this.news[index].likes -= 1;
      }
      this.news[index].liked = !this.news[index].liked;
      try {
        await api.put(`/collaborator/news/${this.news[index].id}/like`);
      } catch (error) {
        this.news[index].likes -= 1;
        this.news[index].liked = !this.news[index].liked;
        this.$toasted.error("Falha ao curtir");
      }
    },
    truncate(text, stop = 150, clamp = "...") {
      if (!text) return "N/A";
      return text.slice(0, stop) + (stop < text.length ? clamp : "");
    },
    async loadPublications(targetObjName, loaderRef, errorMsg) {
      this.empty[targetObjName] = false;
      const loader = this.$loading.show({
        container: loaderRef,
        loader: "dots",
        width: 90,
        height: 90,
        opacity: 0,
      });
      try {
        const {
          data: { data, meta },
        } = await api.get("/collaborator/news");
        if (data.length) {
          this.news = data;
          this.meta = meta;
        } else this.empty[targetObjName] = true;
        loader.hide();
      } catch (e) {
        this.$toasted.error(`Ocorreu um erro ao recuperar ${errorMsg}`);
      }
    },
    async loadInitialNews() {
      await this.loadPublications("news", this.$refs.news_table, "as notícias");
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
.fab {
  color: #f6f9fc;
}
</style>
<style>
p > strong {
  font-weight: bold !important;
}
</style>
<style scoped>
.image-feed {
  max-width: 500;
  max-height: 500;
}
</style>
