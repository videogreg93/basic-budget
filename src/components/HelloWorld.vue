<template>
  <b-container class="container">
    <h1>Easy Budget</h1>
    <b-alert
      id="alert"
      variant="success"
      :show="showSuccess"
      dismissible
      fade
      >{{ successAlertMessage }}</b-alert
    >
    <b-alert id="alert" variant="danger" :show="showError" dismissible fade>{{
      errorAlertMessage
    }}</b-alert>
    <b-row class="fileRow">
      <b-col cols="4">
        <b-form-file
          @change="onFileChange"
          placeholder=""
          drop-placeholder="Drop file here..."
          v-model="inputFile"
          accept=".csv"
        ></b-form-file>
      </b-col>
      <b-button class="input-button" v-on:click="save" variant="success"
        >Save</b-button
      >
      <b-button class="input-button" v-on:click="reset">Reset</b-button>
    </b-row>
      <date-filter-input v-model="dateRange" @dateChange="onDateChange" :fromProp="dateRange.from" :untilProp="dateRange.until" />
    <b-row>
      <v-chart
        class="chart"
        group="1"
        :option="option"
        autoresize
        @legendselectchanged="legendSelected"
      />
      <v-chart
        class="chart"
        ref="chart"
        group="1"
        id="chart2"
        :option="option2"
        autoresize
      />
    </b-row>
    <!-- Table Containers -->
    <b-row class="accordian-row">
      <b-button v-b-toggle.all-expenses-table-container variant="primary">
        See All Expenses
      </b-button>
    </b-row>
    <b-collapse id="all-expenses-table-container" accordion="expense-accordion">
      <b-table striped hover :items="expenses" :fields="fields"></b-table>
    </b-collapse>
    <b-row class="accordian-row">
      <b-button v-b-toggle.grouped-expenses-table-container variant="primary">
        Expenses grouped by type
      </b-button>
    </b-row>
    <b-collapse
      id="grouped-expenses-table-container"
      accordion="expense-accordion"
    >
      <b-table striped hover :items="expenses" :fields="fields"></b-table>
    </b-collapse>
  </b-container>
</template>

<script>
import * as echarts from "echarts/core";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import csv from "jquery-csv";
import DateFilterInput from "./DateFilterInput.vue";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

export default {
  name: "HelloWorld",
  components: {
    VChart,
    DateFilterInput,
  },
  provide: {
    [THEME_KEY]: "light",
  },
  methods: {
    onDateChange() {
      var vue = this;
      var from = this.dateRange.from;
      var until = this.dateRange.until;
      var objects = vue.unfilteredObjects
      .filter((element) => element.Date >= from && element.Date <= until);
      this.updateValues(objects);
    },
    legendSelected(params) {
      console.log("legend Selected");
      console.log(params);
      console.log(this.option2);
    },
    cleanupFile(e) {
      // Cleans Splitwise files to remove unused lines
      var result = e.substring(e.indexOf("\n") + 2);
      result = result
        .substring(1, result.length - 2)
        .replace(/^\s*[\r\n]/gm, "\n");
      return result;
    },
    updateValues(objects) {
      var vue = this;
      vue.expenses = objects.slice(0, -1);
      vue.categories = new Set(objects.map(vue.mapToCategories));
      vue.option.legend.data = Array.from(vue.categories);
      // For each category, count up the costs
      var costs = [];
      this.categories.forEach((category) => {
        var cost = objects
          .filter((element) => element.Category == category)
          .reduce((acc, val) => acc + parseFloat(val.Cost), 0);
        var item = {};
        item.value = cost;
        item.name = category;
        costs.push(item);
      });
      vue.option.series[0].data = costs;
      vue.getMonthlyCosts();
      vue.showSuccess = 3;
    },
    onFileChange(e) {
      var vue = this;
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          var fileResult = vue.cleanupFile(e.target.result);
          vue.unfilteredObjects = csv
            .toObjects(fileResult)
          var objects = vue.unfilteredObjects;
          vue.fields = csv.toArrays(fileResult)[0].map(vue.toField);
          this.updateValues(objects);
          vue.successAlertMessage = "File imported!";
        } catch (error) {
          vue.showError = true;
          vue.errorAlertMessage = "File could not be imported.";
          console.log(error);
        }
      };
      reader.readAsText(file);
    },
    // Generic function to group objects of an array via the keygetter
    groupBy(list, keyGetter) {
      const map = new Map();
      list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
          map.set(key, [item]);
        } else {
          collection.push(item);
        }
      });
      return map;
    },
    getMonthlyCosts() {
      var vue = this;
      // Group costs month
      var grouped = Array.from(
        vue.groupBy(
          vue.expenses,
          (expense) => expense.Date.split("-")[0] + expense.Date.split("-")[1]
        )
      );

      // Calculate total cost of each category, grouped per month
      vue.totalCostsPerMonth = grouped.map((expenseArray) => {
        var item = {};
        item.date = expenseArray[0];
        item.groupedCosts = Array.from(vue.categories).map((category) => {
          var groupedItem = {};
          groupedItem.category = category;
          groupedItem.cost = expenseArray[1]
            .filter((expense) => expense.Category == category)
            .reduce((acc, val) => acc + parseFloat(val.Cost), 0);
          return groupedItem;
        });
        item.cost = expenseArray[1].reduce(
          (acc, val) => acc + parseFloat(val.Cost),
          0
        );
        return item;
      });

      // Calculate average cost per month, grouped by category
      vue.averageCostsPerMonth = Array.from(vue.categories).map((category) => {
        var result = {};
        result.name = category;
        result.value =
          vue.totalCostsPerMonth
            .map((monthItem) => {
              return monthItem.groupedCosts.find(
                (item) => item.category == category
              );
            })
            .reduce((acc, val) => acc + parseFloat(val.cost), 0) /
          vue.totalCostsPerMonth.length;
        return result;
      });
      vue.option2.series[0].data = Array.from(vue.averageCostsPerMonth);
      console.log(grouped[2][1]);
      vue.averageCostPerMonth =
        grouped
          .map((monthItem) => {
            return monthItem[1].reduce(
              (acc, val) => acc + parseFloat(val.Cost),
              0
            );
          })
          .reduce((acc, val) => acc + val, 0) / grouped.length;
      vue.option2.title.text =
        "Monthly\n" + parseInt(vue.averageCostPerMonth) + "$/month";
    },
    mapToCategories(item) {
      return item.Category;
    },
    toField(item) {
      var field = {};
      field.key = item;
      field.sortable = true;
      return field;
    },
    save() {
      console.log("save");
    },
    reset() {
      this.expenses = [];
      this.categories = [];
      this.items = [];
      this.fields = [];
      this.option.series.forEach((item) => {
        item.data = [];
      });
      this.option2.series.forEach((item) => {
        item.data = [];
      });
      this.inputFile = null;
    },
  },
  data() {
    return {
      dateRange: {
        from: "0000-01-01",
        until: "3000-01-01"
      },
      resize: true,
      option: {
        title: {
          text: "Total Costs",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: [],
        },
        series: [
          {
            name: "All Time",
            type: "pie",
            radius: "50%",
            center: ["50%", "50%"],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
      option2: {
        title: {
          text: "Monthly",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
        },
        series: [
          {
            name: "Monthly",
            type: "pie",
            radius: "50%",
            center: ["50%", "50%"],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
      categories: [],
      expenses: [],
      unfilteredObjects: [],
      items: [],
      fields: [],
      totalCostsPerMonth: [],
      averageCostsPerMonth: [],
      averageCostPerMonth: 0.0,
      showError: false,
      showSuccess: false,
      successAlertMessage: "",
      errorAlertMessage: "",
      inputFile: null,
    };
  },
  mounted: function () {
    console.log("Mounted");
    echarts["connect"]("1");
  },
};
</script>

<style>
.accordian-row {
  margin-top: 1%;
  margin-bottom: 1%;
}
.container {
  display: flex;
  flex-flow: column wrap;
}
.chart {
  min-height: 400px;
  width: 50%;
}
.fileRow {
  margin-bottom: 2%;
}
.input-button {
  margin-left: 0.5%;
  margin-right: 0.5%;
}
</style>