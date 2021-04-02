<template>
  <div>
    <b-button v-b-modal.import-modal>Import file</b-button>

    <b-modal id="import-modal" title="Import">
      <b-form class="import-select" inline>
        <label class="mr-sm-2" for="input-type-select">Import From </label>
        <b-form-select
          id="input-type-select"
          class="mb-2 mr-sm-2 mb-sm-0"
          :options="options"
          v-model="selectedValue"
          :value="null"
        ></b-form-select>
      </b-form>
      <div v-if="selectedValue == 'Splitwise'">
        <b-row class="fileRow">
          <b-col cols="8">
            <b-form-file
              placeholder=""
              drop-placeholder="Drop file here..."
              v-model="inputFile"
              accept=".csv"
            ></b-form-file>
          </b-col>
          <b-button
            class="input-button"
            v-on:click="importSplitwise"
            variant="success"
            :disabled="!inputFile"
            >Import</b-button
          >
        </b-row>
      </div>
      <div v-if="selectedValue == 'CSV'">
        <h1>CSV</h1>
      </div>
    </b-modal>
  </div>
</template>

<script>
import csv from "jquery-csv";

export default {
  name: "ImportExpenses",
  data() {
    return {
      inputFile: null,
      selectedValue: null,
      options: ["Splitwise", "CSV"],
      unfilteredObjects: [],
    };
  },
  methods: {
    toField(item) {
      var field = {};
      field.key = item;
      field.sortable = true;
      return field;
    },
    importSplitwise() {
      var vue = this;
      console.log(vue.inputFile);
      const file = vue.inputFile;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          var fileResult = vue.cleanupFile(e.target.result);
          vue.unfilteredObjects = csv.toObjects(fileResult);
          vue.$emit("onImport", this.unfilteredObjects);
        } catch (error) {
          vue.showError = true;
          vue.errorAlertMessage = "File could not be imported.";
          console.log(error);
        }
      };
      reader.readAsText(file);
    },
    cleanupFile(e) {
      // Cleans Splitwise files to remove unused lines
      var result = e.substring(e.indexOf("\n") + 2);
      result = result
        .substring(1, result.length - 2)
        .replace(/^\s*[\r\n]/gm, "\n");
      return result;
    },
  },
};
</script>

<style>
.import-select {
  padding-bottom: 4%;
}
</style>