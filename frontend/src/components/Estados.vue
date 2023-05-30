<template>
  <div class="row">
    <div :class="'col-' + estadoInputSize">
      <base-input :label="estadoLabel">
        <slot name="estado-select" :estados="estados" :estado="estado">
          <select
            v-model="estado"
            class="form-control"
            @input="$emit('inputEstado', $event.target.value)"
          >
            <option
value="" disabled selected>Selecione um estado</option>
            <option
              v-for="estado in estados"
              :key="estado.value"
              :value="estado.value"
            >
              {{ estado.text }}
            </option>
          </select>
        </slot>
      </base-input>
    </div>
    <div :class="'col-' + cidadeInputSize">
      <base-input :label="cidadeLabel">
        <slot name="cidade-select" :cidade="cidade">
          <select
            v-model="cidade"
            class="form-control"
            @input="$emit('inputCidade', $event.target.value)"
          >
            <option v-if="estado.length" value="" disabled selected>
              Selecione uma cidade
            </option>
            <option
v-else value="" disabled selected>...</option>
            <option
              v-for="(cidade, index) in cidades"
              :key="index"
              :value="cidade"
            >
              {{ cidade }}
            </option>
          </select>
        </slot>
      </base-input>
    </div>
  </div>
</template>
<script>
import brasil from "../assets/estados/brasil.json";

export default {
  name: "Estados",
  props: {
    selectedEstado: {
      type: String,
      required: true,
      description: "'Estado' value",
    },
    selectedCidade: {
      type: String,
      required: true,
      description: "'Cidade' value",
    },
    estadoLabel: {
      type: String,
      default: "Estado",
      description: "Label of 'Estado' select",
    },
    cidadeLabel: {
      type: String,
      default: "Cidade",
      description: "Label of 'Cidade' select",
    },
    estadoInputSize: {
      type: String,
      default: "lg-6",
      description: "Column size of 'Estado' select div",
    },
    cidadeInputSize: {
      type: String,
      default: "lg-6",
      description: "Column size of 'Cidade' select div",
    },
  },
  data() {
    return {
      cidade: "",
      estado: "",
      cidades: [],
      brasil,
      estados: [
        { value: "AC", text: "Acre" },
        { value: "AL", text: "Alagoas" },
        { value: "AP", text: "Amapá" },
        { value: "AM", text: "Amazonas" },
        { value: "BA", text: "Bahia" },
        { value: "CE", text: "Ceará" },
        { value: "DF", text: "Distrito Federal" },
        { value: "ES", text: "Espírito Santo" },
        { value: "GO", text: "Goiás" },
        { value: "MA", text: "Maranhão" },
        { value: "MT", text: "Mato Grosso" },
        { value: "MS", text: "Mato Grosso do Sul" },
        { value: "MG", text: "Minas Gerais" },
        { value: "PA", text: "Pará" },
        { value: "PB", text: "Paraíba" },
        { value: "PR", text: "Paraná" },
        { value: "PE", text: "Pernambuco" },
        { value: "PI", text: "Piauí" },
        { value: "RJ", text: "Rio de Janeiro" },
        { value: "RN", text: "Rio Grande do Norte" },
        { value: "RS", text: "Rio Grande do Sul" },
        { value: "RO", text: "Rondônia" },
        { value: "RR", text: "Roraima" },
        { value: "SC", text: "Santa Catarina" },
        { value: "SP", text: "São Paulo" },
        { value: "SE", text: "Sergipe" },
        { value: "TO", text: "Tocantins" },
      ],
    };
  },
  watch: {
    selectedEstado: function () {
      if (this.selectedEstado) {
        this.cidades = this.brasil[this.selectedEstado].cidades;
        if (this.cidade && !this.cidades.includes(this.selectedCidade)) {
          this.cidade = "";
          this.$emit("inputCidade", this.cidade);
        }
      } else {
        this.estado = this.cidade = "";
        this.cidades = [];
        this.$emit("inputCidade", this.cidade);
      }
    },
    selectedCidade: function () {
      if (this.selectedCidade) {
        this.cidades = this.brasil[this.selectedEstado].cidades;
        if (this.cidade && this.cidades.includes(this.selectedCidade)) {
          this.cidade = this.selectedCidade;
          this.$emit("inputCidade", this.cidade);
        }
      }
    },
  },
  updated: function () {
    this.estado = this.selectedEstado;
    this.cidade = this.selectedCidade;
  },
};
</script>
