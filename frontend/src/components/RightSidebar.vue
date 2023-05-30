<template>
  <nav
    id="sidenav-filters"
    v-click-outside="handleClose"
    class="fixed-right navbar navbar-vertical navbar-expand-xs navbar-light bg-white"
  >
    <div class="row">
      <div class="col-12">
        <i
          class="fas fa-times fa-close p-1 text-primary"
          title="Fechar"
          @click="handleClose()"
        />
      </div>
      <div class="col-12 mb-1">
        <div class="navbar-brand">
          <i :class="icon" />
          <h1 class="text-center h3 mt-2">
            {{ title }}
          </h1>
        </div>
      </div>
    </div>
    <slot />
  </nav>
</template>
<script>
export default {
  name: "RightSidebar",
  props: {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped>
.navbar {
  z-index: 1000 !important;
}
.navbar-vertical.navbar-expand-xs {
  width: 100%;
  max-width: 500px !important;
}
.fa-close {
  font-size: 1.5em;
  cursor: pointer;
}
</style>
