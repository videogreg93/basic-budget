<template>
  <div>
    <b-button v-b-modal.import-modal>Import file</b-button>

    <b-modal
      id="import-modal"
      title="Import"
      ok-title="Import"
      @ok="importSplitwise"
      :ok-disabled="!inputFile || splitwise.selectedImportOption == null"
      ok-variant="success"
    >
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
              v-model="inputFile"
              accept=".csv"
            ></b-form-file>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form
              ><b-form-group
                label="Import option: "
                v-slot="{ ariaDescribedby }"
              >
                <b-form-radio-group
                  class="pt-2"
                  :options="splitwise.importOptions"
                  v-model="splitwise.selectedImportOption"
                  :aria-describedby="ariaDescribedby"
                  stacked
                />
              </b-form-group>
            </b-form>
          </b-col>
        </b-row>
      </div>
      <div v-if="selectedValue == 'CSV'">
        <p>
          Use <a href="template.csv">this template</a> for your personal file
        </p>
        <b-form-file
              placeholder=""
              v-model="inputFile"
              accept=".csv"
            ></b-form-file>
      </div>
    </b-modal>
  </div>
</template>

<script>
import csv from "jquery-csv";
import ExpensesService from "../services/ExpensesService";

export default {
  name: "ImportExpenses",
  data() {
    return {
      splitwise: {
        selectedImportOption: null,
        importOptions: [
          {
            text: "Override existing expenses",
            value: 0,
          },
          {
            text: "Import only new expenses",
            value: 1,
          },
          {
            text: "Append to existing expenses",
            value: 2,
          },
        ],
      },
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
    importSplitwise(event) {
      event.preventDefault();
      var vue = this;
      const file = vue.inputFile;
      const reader = new FileReader();
      var importType = vue.splitwise.selectedImportOption;
      switch (importType) {
        case 0: // Override existing expenses
          ExpensesService.getService()
            .deleteAllExpenses()
            .then(() => {
              console.log("Deleted all expenses");
              reader.readAsText(file);
            });
          break;
        case 1: // Import only new expenses
          reader.readAsText(file);
          break;
        case 2: // Append to existing expenses
          reader.readAsText(file);
          break;
      }
      reader.onload = (e) => {
        try {
          var fileResult = vue.cleanupFile(e.target.result);
          vue.unfilteredObjects = csv.toObjects(fileResult);
          if (importType == 1) {
            // Import only new expenses
            ExpensesService.getService()
              .addOnlyNewExpenses(vue.unfilteredObjects)
              .then(() => {
                ExpensesService.getService()
                  .getAllExpenses()
                  .then((items) => {
                    // Close the dialog
                    vue.$nextTick(() => {
                      this.$bvModal.hide("import-modal");
                    });
                    vue.$emit("onImport", items);
                  });
              });
          } else {
            ExpensesService.getService()
              .addExpenses(vue.unfilteredObjects)
              .then(() => {
                vue.$emit("onImport", this.unfilteredObjects);
              });
          }
        } catch (error) {
          vue.showError = true;
          vue.errorAlertMessage = "File could not be imported.";
          console.log(error);
        }
      };
    },
    cleanupFile(e) {
      // Cleans Splitwise files to remove unused lines
      var result = e.substring(e.indexOf("\n") + 2);
      result = result
        .substring(1, result.length - 2)
        .replace(/^\s*[\r\n]/gm, "\n");
      return result;
    },
    okTest() {
      console.log("test");
    },
  },
};
</script>

<style>
.import-select {
  padding-bottom: 4%;
}
</style>