<template>
  <label class="file-select">
    <div class="select-button" :title="title">
      <span v-if="value" class="btn btn-white">{{ value.name }}</span>
      <span v-else :class="'btn btn-' + type">
        <i class="fas fa-upload fas-4 pb-1 mr-2" />{{ title }}
      </span>
    </div>
    <input type="file" :accept="accept" @change="handleFileChange" />
  </label>
</template>

<script>
export default {
  name: "FileSelect",
  props: {
    value: File,
    title: {
      default: "Selecione o arquivo",
      description: "Upload buttton label",
    },
    type: {
      default: "warning",
      description: "Upload button type",
    },
    accept: {
      type: String,
      default: "",
      description: "String with the accepted files",
    },
    mbSize: {
      type: Number,
      default: 0,
      description: "Max file size in MB",
    },
  },
  methods: {
    handleFileChange(e) {
      const file = e.target.files[0];
      if (!file) {
        this.$emit("input", null);
        return;
      }
      if (this.mbSize && file.size > this.mbSize * 1024 * 1024) {
        this.$toasted.error(
          `O tamanho do arquivo excede o máximo permitido (${this.mbSize}MB)`
        );
      } else {
        this.$emit("input", file);
      }
    },
  },
};
</script>

<style scoped>
.file-select {
  cursor: pointer;
}
.file-select > input[type="file"] {
  display: none;
}
</style>
