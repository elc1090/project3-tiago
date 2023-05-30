<template>
  <div>
    <i v-if="showLeftMailIcon" class="fas fa-envelope mr-2" />
    <a :href="`mailto:${emailAddress}`" title="Escrever um email">
      {{ emailAddress }}
      <i class="fas fa-external-link-alt ml-1 text-gray" />
    </a>
  </div>
</template>
<script>
export default {
  name: "EmailLink",
  props: {
    emailAddress: {
      type: String,
      required: true,
    },
    showLeftMailIcon: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
<style scoped>
i.fa-external-link-alt {
  font-size: 0.75rem !important;
}
</style>
