<template>
  <card
    class="card-stats"
    :show-footer-line="true"
    :body-classes="{ 'pb-1': margin }"
  >
    <div v-if="iconInTop" class="row mb-2">
      <div class="col-12 text-center">
        <div
          class="icon icon-shape text-white rounded-circle shadow"
          :class="[`bg-${type}`, iconClasses]"
        >
          <i :class="icon" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <slot>
          <h5
            v-if="title"
            :class="[
              margin ? 'mb-3' : 'mb-0',
              'card-title text-uppercase text-muted',
            ]"
          >
            {{ title }}
          </h5>
          <span v-if="subTitle" class="h2 font-weight-bold mb-0">{{
            subTitle
          }}</span>
        </slot>
      </div>

      <div v-if="!iconInTop && ($slots.icon || icon)" class="col-auto">
        <slot name="icon">
          <div
            class="icon icon-shape text-white rounded-circle shadow"
            :class="[`bg-${type}`, iconClasses]"
          >
            <i :class="icon" />
          </div>
        </slot>
      </div>
    </div>

    <p class="mt-3 mb-0 text-sm">
      <slot name="footer" />
    </p>
  </card>
</template>
<script>
import Card from "./Card.vue";

export default {
  name: "StatsCard",
  components: {
    Card,
  },
  props: {
    type: {
      type: String,
      default: "primary",
    },
    icon: String,
    title: String,
    subTitle: String,
    iconClasses: [String, Array],
    margin: {
      type: Boolean,
      default: false,
    },
    iconInTop: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style></style>
