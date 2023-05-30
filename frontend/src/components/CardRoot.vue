<template>
  <div class="card card-curso shadow flex-grow-1 border-0">
    <div class="card-image">
      <img
        class="card-img-top"
        :src="imageUrl || placeholderImg"
        alt="Imagem curso"
      />
      <div class="image-overlay" />
    </div>
    <div class="card-body py-3">
      <h2 class="card-title text-center mb-1">
        {{ title }}
      </h2>
      <slot />
    </div>
    <div class="card-footer text-center">
      <slot name="footer" />
    </div>
  </div>
</template>
<script>
export default {
  name: "CardRoot",
  props: {
    title: {
      type: String,
      description: "Card title.",
      default: "Título padrão",
    },
    imageUrl: {
      type: String,
      description: "Card image_url.",
      default: "/img/pages/default_banner_course.jpg",
    },
  },
  data() {
    return {
      placeholderImg: "/img/pages/default_banner_course.jpg",
    };
  },
};
</script>
<style></style>
<style scoped>
.card-curso {
  border-radius: 15px;
}
.card-footer {
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}
.card-img-top {
  height: 150px;
  margin: auto;
  object-fit: cover;
  border-radius: 15px;
}

.card-image {
  position: relative;
  border-radius: 15px;
  height: 150px;
}

.image-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0.2;
  transition: 0.5s ease;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
}

.card:hover .image-overlay {
  opacity: 1;
}
</style>
