<template>
  <b-row>
    <b-col>
      <label for="from-datepicker">From</label>
      <b-form-datepicker
        id="from-datepicker"
        v-bind:value="from"
        v-model="from"
        @input="handleFromInput"
        class="mb-2"
      />
    </b-col>
    <b-col
      ><label for="until-datepicker">Until</label>
      <b-form-datepicker
        id="until-datepicker"
        v-bind:value="until"
        v-model="until"
        @input="handleUntilInput"
        class="mb-2"
      />
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "DateFilterInput",
  props: {
    fromProp: String,
    untilProp: String,
  },
  data() {
    return {
      content: this.value,
      from: this.fromProp,
      until: this.untilProp,
      dateRange: {
        from: this.fromProp,
        until: this.untilProp,
      },
    };
  },
  methods: {
    handleFromInput() {
      this.dateRange.from = this.from;
      this.$emit("input", this.dateRange);
      this.$emit("dateChange", this.dateRange);
    },
    handleUntilInput() {
      this.dateRange.until = this.until;
      this.$emit("input", this.dateRange);
      this.$emit("dateChange", this.dateRange);
    },
  },
};
</script>