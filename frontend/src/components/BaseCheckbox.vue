<template>
  <div
    class="custom-control custom-checkbox rounded-circle"
    :class="{ disabled: disabled, 'form-check-inline': inline }"
    @click="emitClick()"
  >
    <input
      :id="cbId"
      v-model="model"
      class="custom-control-input"
      type="checkbox"
      :disabled="disabled"
    />
    <label :for="cbId" class="custom-control-label">
      <slot>
        <span v-if="inline">&nbsp;</span>
      </slot>
    </label>
  </div>
</template>
<script>
import { randomString } from "./stringUtils";

export default {
  name: "BaseCheckbox",
  model: {
    prop: "checked",
  },
  props: {
    checked: {
      default: false,
      type: [Array, Boolean, Number],
      description: "Whether checkbox is checked",
    },
    disabled: {
      type: Boolean,
      description: "Whether checkbox is disabled",
    },
    inline: {
      type: Boolean,
      description: "Whether checkbox is inline",
    },
  },
  data() {
    return {
      cbId: "",
      touched: false,
    };
  },
  computed: {
    model: {
      get() {
        return this.checked;
      },
      set(check) {
        if (!this.touched) {
          this.touched = true;
        }
        this.$emit("input", check);
      },
    },
  },
  mounted() {
    this.cbId = randomString();
  },
  methods: {
    emitClick() {
      this.$emit("click");
    },
  },
};
</script>
