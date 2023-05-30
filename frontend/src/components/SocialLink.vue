<template>
  <div>
    <i v-if="socialType === 'facebook'" class="fab fa-facebook mr-2"
/>
    <i v-if="socialType === 'instagram'" class="fab fa-instagram mr-2"
/>
    <i v-if="socialType === 'linkedin'" class="fab fa-linkedin mr-2"
/>
    <i v-if="socialType === 'homepage'" class="fas fa-external-link-alt mr-2" />
    <a :href="`mailto:${socialLink}`" title="Abrir link">
      {{ socialLink }}
      <i class="fas fa-external-link-alt ml-1 text-gray"
    /></a>
  </div>
</template>
<script>
export default {
  name: "SocialLink",
  props: {
    socialLink: {
      type: String,
      required: true,
    },
    showLeftIcon: {
      type: Boolean,
      default: true,
    },
    socialType: {
      type: String,
      required: true,
    },
  },
};
</script>
<style scoped>
i.fa-external-link-alt {
  font-size: 0.75rem !important;
}
</style>
