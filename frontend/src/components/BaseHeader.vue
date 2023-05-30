<template>
  <div class="header" :class="{ [`bg-default`]: type }">
    <div class="container-fluid">
      <div class="header-body">
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "BaseHeader",
  props: {
    type: {
      type: String,
      default: "primary",
      description: "Header background type"
    }
  }
};
</script>
<style>
.bg-orquestrando {
  /* background: repeating-linear-gradient(
    -65deg,
    #f9a64b,
    #f9a64b 20%,
    #c456a0 20%,
    #c456a0 30%,
    #01adee 30%,
    #01adee 50%,
    #a4ce3a 50%,
    #a4ce3a 60%
  ); */
  /* background-color: #c95fa7; */
  background: #6f2557;
  background: linear-gradient(
    40.61deg,
    #6f2557 0%,
    #832e67 18.16%,
    #973778 35.48%,
    #ac4089 59.5%,
    #c2499b 100%
  );
}
</style>
