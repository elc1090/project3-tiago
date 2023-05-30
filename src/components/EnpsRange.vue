<template>
  <div>
    <div class="range-labels text-description">
      <span v-for="i in 11" :key="i - 1">{{ i - 1 }}</span>
    </div>
    <input
      list="tickmarks"
      type="range"
      min="0"
      max="10"
      class="slider"
      :disabled="disabled"
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
    <div class="range-labels">
      <i v-tooltip.bottom="'0 (Detrator)'" class="fas fa-frown text-danger" />
      <i v-tooltip.bottom="'1 (Detrator'" class="fas fa-frown text-danger" />
      <i v-tooltip.bottom="'2 (Detrator)'" class="fas fa-frown text-danger" />
      <i v-tooltip.bottom="'3 (Detrator)'" class="fas fa-frown text-danger" />
      <i v-tooltip.bottom="'4 (Detrator)'" class="fas fa-frown text-danger" />
      <i v-tooltip.bottom="'5 (Detrator)'" class="fas fa-frown text-danger" />
      <i v-tooltip.bottom="'6 (Detrator)'" class="fas fa-frown text-danger" />
      <i v-tooltip.bottom="'7 (Neutro)'" class="fas fa-meh text-yellow" />
      <i v-tooltip.bottom="'8 (Neutro)'" class="fas fa-meh text-yellow" />
      <i v-tooltip.bottom="'9 (Promotor)'" class="fas fa-smile text-success" />
      <i v-tooltip.bottom="'10 (Promotor)'" class="fas fa-smile text-success" />
    </div>
  </div>
</template>
<script>
export default {
  name: "EnpsRange",
  props: {
    disabled: {
      type: Boolean,
      required: true,
    },
    value: Number,
  },
};
</script>
<style scoped>
.slider {
  width: 100%;
  margin-top: 20px;
  -webkit-appearance: none;
  width: 100%;
  height: 25px;
  background: #d3d3d3;
  transition: opacity 0.2s;
  border-radius: 20px;
  border: 1.5px black solid;
  background: linear-gradient(
    45deg,
    rgba(219, 69, 69, 1) 50%,
    rgba(244, 215, 64, 1) 85%,
    rgba(69, 219, 84, 1) 100%
  );
}
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 15px;
  height: 15px;
  background: black;
  cursor: pointer;
  border-radius: 50px;
  margin-top: -1px;
}
.range-labels {
  display: flex;
  justify-content: space-between;
}
.text-description {
  margin-bottom: -20px;
}
</style>
