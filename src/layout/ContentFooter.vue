<template>
  <footer class="footer px-4">
    <div class="row align-items-center justify-content-lg-between px-1">
      <div class="col-lg"></div>
    </div>
    <base-button
      v-if="this.$props.externalChatUrl"
      v-tooltip="
        `Clique para ${showExternalChat ? 'fechar' : 'abrir'} o chat externo`
      "
      type="danger"
      class="bottom-right"
      :icon-only="true"
      :icon="`fas ${showExternalChat ? 'fa-times' : 'fa-comments'}`"
      @click="handleToggleExternalChat"
    />
    <nav
      v-show="showExternalChat"
      id="sidenav-iframe"
      ref="iframe-nav"
      class="fixed-right navbar navbar-vertical navbar-expand-xs navbar-light bg-white p-0"
    >
      <iframe
        ref="iframe-element"
        class="responsive-iframe"
        style="border: 0"
        allowFullScreen="true"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        frameborder="0"
        scrolling="yes"
        :src="this.$props.externalChatUrl"
      />
    </nav>
  </footer>
</template>
<script>
export default {
  props: {
    showSocial: {
      type: Boolean,
      default: true
    },
    externalChatUrl: {
      type: String
    }
  },
  data() {
    return {
      year: new Date().getFullYear(),
      showExternalChat: false
    };
  },
  methods: {
    handleToggleExternalChat() {
      if (this.showExternalChat) {
        document.body.style.overflow = "auto";
        this.showExternalChat = false;
        return;
      }
      const refNav = this.$refs["iframe-nav"];
      const refIframe = this.$refs["iframe-element"];
      refNav.style.maxWidth = window.innerWidth + "px";
      refIframe.style.height = window.innerHeight + "px";
      this.showExternalChat = true;
      document.body.style.overflow = "hidden";
    }
  }
};
</script>
<style scoped>
.footer .nav-link {
  padding: 0 0.75rem;
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
  padding: 0;
  line-height: 50px;
  background-color: transparent;
}

.bottom-right {
  position: fixed;
  bottom: 10px;
  right: 5px;
  z-index: 10000;
  width: 60px;
  height: 60px;
  padding: 10px 16px;
  font-size: 20px;
  line-height: 1.33;
  border-radius: 35px;
}
.responsive-iframe {
  margin: 0 auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  min-height: 500px;
}
.navbar {
  z-index: 1000 !important;
  overflow-y: hidden;
}
.navbar-vertical.navbar-expand-xs {
  width: 100%;
}
.fa-close {
  font-size: 1.5em;
  cursor: pointer;
}
</style>
<style>
html {
  position: relative;
  min-height: 100%;
}
.main-content {
  margin-bottom: 5rem;
}
</style>
